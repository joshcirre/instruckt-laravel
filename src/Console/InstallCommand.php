<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

use function Laravel\Prompts\info;
use function Laravel\Prompts\note;
use function Laravel\Prompts\spin;
use function Laravel\Prompts\warning;

final class InstallCommand extends Command
{
    protected $signature = 'instruckt:install
        {--skip-mcp : Skip automatic MCP configuration}
        {--skip-skill : Skip installing the agent skill}
        {--skip-toolbar : Skip injecting the toolbar into layouts}';

    protected $description = 'Install instruckt — publish config, configure agents, inject toolbar';

    /** @var array<string, array{name: string, mcp_path: string, mcp_key: string, skill_path: string, config: callable}> */
    private array $agents = [];

    public function handle(): int
    {
        $this->registerAgents();

        info('Installing instruckt...');

        $this->call('vendor:publish', ['--tag' => 'instruckt-config', '--force' => false]);
        $this->installNpmPackage();

        $framework = $this->detectFramework();
        note("Detected framework: {$framework}");

        if (! $this->option('skip-toolbar')) {
            $this->injectToolbar($framework);
        }

        $detected = $this->detectAgents();

        if (! $this->option('skip-mcp')) {
            $this->configureMcpForAgents($detected);
        }

        if (! $this->option('skip-skill')) {
            $this->installSkillForAgents($detected);
        }

        $this->newLine();
        info('instruckt installed successfully.');

        return self::SUCCESS;
    }

    // ── npm package ─────────────────────────────────────────────

    private function installNpmPackage(): void
    {
        // Check if already installed
        if (File::exists(base_path('node_modules/instruckt/dist/instruckt.iife.js'))) {
            note('npm package instruckt already installed.');

            return;
        }

        $useBun = File::exists(base_path('bun.lockb')) || File::exists(base_path('bun.lock'));
        $cmd = $useBun ? 'bun add -d instruckt' : 'npm install --save-dev instruckt';

        $exitCode = spin(
            callback: function () use ($cmd) {
                $process = proc_open($cmd, [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes, base_path());

                if (! $process) {
                    return 1;
                }

                stream_get_contents($pipes[1]);
                stream_get_contents($pipes[2]);
                fclose($pipes[1]);
                fclose($pipes[2]);

                return proc_close($process);
            },
            message: "Installing npm package ({$cmd})...",
        );

        if ($exitCode === 0) {
            info('npm package installed.');
        } else {
            warning("Could not install npm package automatically. Run manually: {$cmd}");
        }
    }

    // ── Framework detection ──────────────────────────────────────

    private function detectFramework(): string
    {
        $packageJson = $this->getPackageJson();
        $deps = [];

        if ($packageJson) {
            $deps = array_merge(
                $packageJson['dependencies'] ?? [],
                $packageJson['devDependencies'] ?? [],
            );
        }

        // Inertia + Vue/React/Svelte (check Inertia first — it determines the layout pattern)
        $hasInertia = $this->hasComposerPackage('inertiajs/inertia-laravel');

        if ($hasInertia) {
            if (isset($deps['vue']) || isset($deps['@vitejs/plugin-vue'])) {
                return 'inertia-vue';
            }

            if (isset($deps['react']) || isset($deps['@vitejs/plugin-react'])) {
                return 'inertia-react';
            }

            if (isset($deps['svelte']) || isset($deps['@sveltejs/vite-plugin-svelte'])) {
                return 'inertia-svelte';
            }

            return 'inertia-vue'; // Inertia default
        }

        // Livewire (server-rendered — uses Blade component)
        if ($this->hasComposerPackage('livewire/livewire')) {
            return 'livewire';
        }

        // Standalone JS framework without Inertia (rare with Laravel, but possible)
        if (isset($deps['vue'])) {
            return 'vue';
        }

        if (isset($deps['react'])) {
            return 'react';
        }

        if (isset($deps['svelte'])) {
            return 'svelte';
        }

        return 'blade';
    }

    private function hasComposerPackage(string $package): bool
    {
        $lockPath = base_path('composer.lock');

        if (! File::exists($lockPath)) {
            return false;
        }

        $lock = json_decode(File::get($lockPath), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return false;
        }

        $packages = array_merge($lock['packages'] ?? [], $lock['packages-dev'] ?? []);

        foreach ($packages as $pkg) {
            if (($pkg['name'] ?? '') === $package) {
                return true;
            }
        }

        return false;
    }

    private function getPackageJson(): ?array
    {
        $path = base_path('package.json');

        if (! File::exists($path)) {
            return null;
        }

        $data = json_decode(File::get($path), true);

        return json_last_error() === JSON_ERROR_NONE ? $data : null;
    }

    // ── Toolbar injection ────────────────────────────────────────

    private function injectToolbar(string $framework): void
    {
        // Always prefer JS entry point (works for all frameworks including Livewire)
        if ($this->injectJsToolbar($framework)) {
            return;
        }

        // Fall back to Blade component if no JS entry point found
        $this->injectBladeToolbar($framework);
    }

    /** @return bool Whether injection succeeded */
    private function injectJsToolbar(string $framework): bool
    {
        $routePrefix = config('instruckt.route_prefix', 'instruckt');

        // Detect JS framework adapter to activate
        $jsFramework = match (true) {
            str_starts_with($framework, 'inertia-') => str_replace('inertia-', '', $framework),
            $framework === 'livewire' => 'livewire',
            default => null,
        };

        // Find the JS/TS entry point
        $candidates = [
            resource_path('js/app.tsx'),
            resource_path('js/app.ts'),
            resource_path('js/app.jsx'),
            resource_path('js/app.js'),
        ];

        $appPath = null;

        foreach ($candidates as $candidate) {
            if (File::exists($candidate)) {
                $appPath = $candidate;

                break;
            }
        }

        if (! $appPath) {
            return false;
        }

        $contents = File::get($appPath);
        $relative = str_replace(base_path().'/', '', $appPath);

        if (str_contains($contents, 'instruckt')) {
            note("{$relative} already has instruckt configured.");

            return true;
        }

        $adaptersOpt = $jsFramework ? ", adapters: ['{$jsFramework}']" : '';
        $snippet = "\n// Instruckt — visual feedback toolbar\nimport { Instruckt } from 'instruckt';\nnew Instruckt({ endpoint: '/{$routePrefix}'{$adaptersOpt} });\n";

        File::append($appPath, $snippet);
        info("Injected instruckt into {$relative}");

        return true;
    }

    private function injectBladeToolbar(string $framework): void
    {
        $usePersist = $framework === 'livewire';
        $tag = $usePersist
            ? "@persist('instruckt')\n            <x-instruckt-toolbar />\n        @endpersist"
            : '<x-instruckt-toolbar />';
        $layouts = $this->findLayoutFiles();

        if (empty($layouts)) {
            warning('No layout files found. Add this before </body> in your layout:');
            note($tag);

            return;
        }

        $injected = false;

        foreach ($layouts as $layout) {
            $relative = str_replace(base_path().'/', '', $layout);
            $contents = File::get($layout);

            if (str_contains($contents, 'instruckt-toolbar') || str_contains($contents, 'x-instruckt')) {
                note("{$relative} — already has toolbar");

                continue;
            }

            if (! str_contains($contents, '</body>')) {
                continue;
            }

            if (preg_match('/^([ \t]*)<\/body>/m', $contents, $matches)) {
                $indent = $matches[1];
                $lines = explode("\n", $tag);
                $indented = array_map(fn ($line) => $line !== '' ? $indent.'    '.$line : $line, $lines);
                $replacement = implode("\n", $indented)."\n{$indent}</body>";
                $contents = preg_replace('/^([ \t]*)<\/body>/m', $replacement, $contents, 1);
            } else {
                $contents = str_replace('</body>', "    {$tag}\n</body>", $contents);
            }

            File::put($layout, $contents);
            info("Injected toolbar into {$relative}");
            $injected = true;
        }

        if (! $injected && ! empty($layouts)) {
            warning('Could not inject toolbar automatically. Add this before </body>:');
            note($tag);
        }
    }

    /**
     * @return array<int, string>
     */
    private function findLayoutFiles(): array
    {
        $layouts = [];
        $searchPaths = [
            resource_path('views/layouts'),
            resource_path('views/components/layouts'),
            resource_path('views'),
        ];

        $layoutNames = [
            'app.blade.php',
            'auth.blade.php',
            'guest.blade.php',
            'base.blade.php',
            'layout.blade.php',
            'main.blade.php',
        ];

        foreach ($searchPaths as $dir) {
            if (! File::isDirectory($dir)) {
                continue;
            }

            foreach ($layoutNames as $name) {
                $path = $dir.'/'.$name;

                if (File::exists($path) && str_contains(File::get($path), '</body>')) {
                    $layouts[] = $path;
                }
            }
        }

        return array_unique($layouts);
    }

    // ── Agent detection & MCP config ─────────────────────────────

    private function registerAgents(): void
    {
        $artisan = base_path('artisan');

        $this->agents = [
            'claude_code' => [
                'name' => 'Claude Code',
                'mcp_path' => '.mcp.json',
                'mcp_key' => 'mcpServers',
                'skill_path' => '.claude/skills',
                'config' => fn () => [
                    'command' => 'php',
                    'args' => [$artisan, 'mcp:start', 'instruckt'],
                ],
            ],
            'cursor' => [
                'name' => 'Cursor',
                'mcp_path' => '.cursor/mcp.json',
                'mcp_key' => 'mcpServers',
                'skill_path' => '.cursor/skills',
                'config' => fn () => [
                    'command' => 'php',
                    'args' => [$artisan, 'mcp:start', 'instruckt'],
                ],
            ],
            'codex' => [
                'name' => 'Codex',
                'mcp_path' => '.codex/config.toml',
                'mcp_key' => 'mcp_servers',
                'skill_path' => '.agents/skills',
                'config' => fn () => [
                    'command' => 'php',
                    'args' => [$artisan, 'mcp:start', 'instruckt'],
                    'cwd' => base_path(),
                ],
            ],
            'opencode' => [
                'name' => 'OpenCode',
                'mcp_path' => 'opencode.json',
                'mcp_key' => 'mcp',
                'skill_path' => '.agents/skills',
                'config' => fn () => [
                    'type' => 'local',
                    'enabled' => true,
                    'command' => ['php', $artisan, 'mcp:start', 'instruckt'],
                ],
            ],
            'copilot' => [
                'name' => 'GitHub Copilot',
                'mcp_path' => '.vscode/mcp.json',
                'mcp_key' => 'servers',
                'skill_path' => '.github/skills',
                'config' => fn () => [
                    'command' => 'php',
                    'args' => [$artisan, 'mcp:start', 'instruckt'],
                ],
            ],
        ];
    }

    /**
     * @return array<string, array{name: string, mcp_path: string, mcp_key: string, skill_path: string, config: callable}>
     */
    private function detectAgents(): array
    {
        $detected = [];

        if (File::exists(base_path('.mcp.json')) || File::isDirectory(base_path('.claude')) || File::exists(base_path('CLAUDE.md'))) {
            $detected['claude_code'] = $this->agents['claude_code'];
        }

        if (File::isDirectory(base_path('.cursor'))) {
            $detected['cursor'] = $this->agents['cursor'];
        }

        if (File::isDirectory(base_path('.codex')) || File::exists(base_path('.codex/config.toml'))) {
            $detected['codex'] = $this->agents['codex'];
        }

        if (File::exists(base_path('opencode.json'))) {
            $detected['opencode'] = $this->agents['opencode'];
        }

        if (File::isDirectory(base_path('.vscode'))) {
            $detected['copilot'] = $this->agents['copilot'];
        }

        if (empty($detected)) {
            $detected['claude_code'] = $this->agents['claude_code'];
        }

        return $detected;
    }

    /**
     * @param  array<string, array{name: string, mcp_path: string, mcp_key: string, skill_path: string, config: callable}>  $agents
     */
    private function configureMcpForAgents(array $agents): void
    {
        foreach ($agents as $key => $agent) {
            if (str_ends_with($agent['mcp_path'], '.toml')) {
                note('Codex detected — add instruckt manually to .codex/config.toml');

                continue;
            }

            $this->configureMcpJson($agent);
        }
    }

    /**
     * @param  array{name: string, mcp_path: string, mcp_key: string, skill_path: string, config: callable}  $agent
     */
    private function configureMcpJson(array $agent): void
    {
        $mcpPath = base_path($agent['mcp_path']);
        $configKey = $agent['mcp_key'];
        $serverConfig = ($agent['config'])();

        if (File::exists($mcpPath)) {
            $config = json_decode(File::get($mcpPath), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                warning("Could not parse {$agent['mcp_path']} — skipping {$agent['name']} MCP configuration.");

                return;
            }

            if (isset($config[$configKey]['instruckt'])) {
                note("{$agent['name']} MCP already configured.");

                return;
            }

            $config[$configKey]['instruckt'] = $serverConfig;
        } else {
            File::ensureDirectoryExists(dirname($mcpPath));
            $config = [$configKey => ['instruckt' => $serverConfig]];
        }

        File::put($mcpPath, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n");
        info("Configured instruckt MCP server for {$agent['name']}");
    }

    /**
     * @param  array<string, array{name: string, mcp_path: string, mcp_key: string, skill_path: string, config: callable}>  $agents
     */
    private function installSkillForAgents(array $agents): void
    {
        $skillSource = dirname(__DIR__, 2).'/resources/boost/skills/instruckt/SKILL.md';

        if (! File::exists($skillSource)) {
            return;
        }

        $installed = [];

        foreach ($agents as $agent) {
            $skillDir = base_path($agent['skill_path'].'/instruckt');

            if (isset($installed[$skillDir])) {
                continue;
            }

            if (File::exists($skillDir.'/SKILL.md')) {
                note("{$agent['name']} skill already installed.");
                $installed[$skillDir] = true;

                continue;
            }

            File::ensureDirectoryExists($skillDir);
            File::copy($skillSource, $skillDir.'/SKILL.md');
            info("Installed instruckt skill for {$agent['name']}");
            $installed[$skillDir] = true;
        }
    }
}
