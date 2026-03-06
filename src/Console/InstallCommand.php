<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

final class InstallCommand extends Command
{
    protected $signature = 'instruckt:install
        {--skip-mcp : Skip automatic MCP configuration}
        {--skip-skill : Skip installing the agent skill}
        {--skip-toolbar : Skip injecting the toolbar into layouts}';

    protected $description = 'Install instruckt — publish config, run migrations, configure agents, inject toolbar';

    /** @var array<string, array{name: string, mcp_path: string, mcp_key: string, skill_path: string, config: callable}> */
    private array $agents = [];

    public function handle(): int
    {
        $this->registerAgents();

        $this->components->info('Installing instruckt...');
        $this->newLine();

        $this->call('vendor:publish', ['--tag' => 'instruckt-config', '--force' => false]);
        $this->call('vendor:publish', ['--tag' => 'instruckt-migrations', '--force' => false]);
        $this->call('vendor:publish', ['--tag' => 'instruckt-assets', '--force' => true]);
        $this->call('migrate', ['--force' => false]);

        $framework = $this->detectFramework();
        $this->newLine();
        $this->components->twoColumnDetail('Detected framework', $framework);

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
        $this->components->info('instruckt installed successfully.');
        $this->newLine();

        return self::SUCCESS;
    }

    // ── Framework detection ──────────────────────────────────────

    private function detectFramework(): string
    {
        // Check composer.json/lock for PHP frameworks
        if ($this->hasComposerPackage('livewire/livewire')) {
            return 'livewire';
        }

        // Check package.json for JS frameworks
        $packageJson = $this->getPackageJson();

        if ($packageJson) {
            $deps = array_merge(
                $packageJson['dependencies'] ?? [],
                $packageJson['devDependencies'] ?? [],
            );

            if (isset($deps['vue']) || isset($deps['@vitejs/plugin-vue'])) {
                return 'vue';
            }

            if (isset($deps['react']) || isset($deps['@vitejs/plugin-react'])) {
                return 'react';
            }

            if (isset($deps['svelte']) || isset($deps['@sveltejs/vite-plugin-svelte'])) {
                return 'svelte';
            }
        }

        // Fallback — plain Blade
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
        $adapters = match ($framework) {
            'livewire' => "['livewire']",
            'vue' => "['vue']",
            'react' => "['react']",
            'svelte' => "['svelte']",
            default => "['livewire']",
        };

        $tag = "<x-instruckt-toolbar :adapters=\"{$adapters}\" />";
        $layouts = $this->findLayoutFiles();

        if (empty($layouts)) {
            $this->components->warn('No layout files found. Add this before </body> in your layout:');
            $this->line("  {$tag}");

            return;
        }

        $injected = false;

        foreach ($layouts as $layout) {
            $relative = str_replace(base_path().'/', '', $layout);
            $contents = File::get($layout);

            // Already has instruckt toolbar
            if (str_contains($contents, 'instruckt-toolbar') || str_contains($contents, 'x-instruckt')) {
                $this->line("  {$relative} — already has toolbar");

                continue;
            }

            // Find </body> and inject before it
            if (! str_contains($contents, '</body>')) {
                continue;
            }

            // Detect indentation of the </body> tag
            if (preg_match('/^([ \t]*)<\/body>/m', $contents, $matches)) {
                $indent = $matches[1];
                $replacement = "{$indent}    {$tag}\n{$indent}</body>";
                $contents = preg_replace('/^([ \t]*)<\/body>/m', $replacement, $contents, 1);
            } else {
                $contents = str_replace('</body>', "    {$tag}\n</body>", $contents);
            }

            File::put($layout, $contents);
            $this->components->info("Injected toolbar into {$relative}");
            $injected = true;
        }

        if (! $injected && ! empty($layouts)) {
            $this->components->warn('Could not inject toolbar automatically. Add this before </body>:');
            $this->line("  {$tag}");
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
                    'args' => [$artisan, 'mcp:serve', 'instruckt'],
                ],
            ],
            'cursor' => [
                'name' => 'Cursor',
                'mcp_path' => '.cursor/mcp.json',
                'mcp_key' => 'mcpServers',
                'skill_path' => '.cursor/skills',
                'config' => fn () => [
                    'command' => 'php',
                    'args' => [$artisan, 'mcp:serve', 'instruckt'],
                ],
            ],
            'codex' => [
                'name' => 'Codex',
                'mcp_path' => '.codex/config.toml',
                'mcp_key' => 'mcp_servers',
                'skill_path' => '.agents/skills',
                'config' => fn () => [
                    'command' => 'php',
                    'args' => [$artisan, 'mcp:serve', 'instruckt'],
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
                    'command' => ['php', $artisan, 'mcp:serve', 'instruckt'],
                ],
            ],
            'copilot' => [
                'name' => 'GitHub Copilot',
                'mcp_path' => '.vscode/mcp.json',
                'mcp_key' => 'servers',
                'skill_path' => '.github/skills',
                'config' => fn () => [
                    'command' => 'php',
                    'args' => [$artisan, 'mcp:serve', 'instruckt'],
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
                $this->line("  Codex detected — add instruckt manually to .codex/config.toml");

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
                $this->warn("  Could not parse {$agent['mcp_path']} — skipping {$agent['name']} MCP configuration.");

                return;
            }

            if (isset($config[$configKey]['instruckt'])) {
                $this->line("  {$agent['name']} MCP already configured.");

                return;
            }

            $config[$configKey]['instruckt'] = $serverConfig;
        } else {
            File::ensureDirectoryExists(dirname($mcpPath));
            $config = [$configKey => ['instruckt' => $serverConfig]];
        }

        File::put($mcpPath, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n");
        $this->components->info("Configured instruckt MCP server for {$agent['name']}");
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
                $this->line("  {$agent['name']} skill already installed.");
                $installed[$skillDir] = true;

                continue;
            }

            File::ensureDirectoryExists($skillDir);
            File::copy($skillSource, $skillDir.'/SKILL.md');
            $this->components->info("Installed instruckt skill for {$agent['name']}");
            $installed[$skillDir] = true;
        }
    }
}
