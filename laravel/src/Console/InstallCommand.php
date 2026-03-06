<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

final class InstallCommand extends Command
{
    protected $signature = 'instruckt:install
        {--skip-mcp : Skip automatic MCP configuration}
        {--skip-skill : Skip installing the agent skill}';

    protected $description = 'Install instruckt — publish config, run migrations, publish assets, configure agents';

    /** @var array<string, array{name: string, mcp_path: string, mcp_key: string, skill_path: string, config: callable}> */
    private array $agents = [];

    public function handle(): int
    {
        $this->registerAgents();

        $this->info('Installing instruckt...');

        $this->call('vendor:publish', ['--tag' => 'instruckt-config', '--force' => false]);
        $this->call('vendor:publish', ['--tag' => 'instruckt-migrations', '--force' => false]);
        $this->call('vendor:publish', ['--tag' => 'instruckt-assets', '--force' => true]);
        $this->call('migrate', ['--force' => false]);

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
        $this->line('  Add the toolbar to your layout:');
        $this->line('  <code>&lt;x-instruckt-toolbar /&gt;</code>');
        $this->newLine();

        return self::SUCCESS;
    }

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
     * Detect which agents have project-level config present.
     *
     * @return array<string, array{name: string, mcp_path: string, mcp_key: string, skill_path: string, config: callable}>
     */
    private function detectAgents(): array
    {
        $detected = [];

        // Claude Code: .mcp.json or .claude/ or CLAUDE.md
        if (File::exists(base_path('.mcp.json')) || File::isDirectory(base_path('.claude')) || File::exists(base_path('CLAUDE.md'))) {
            $detected['claude_code'] = $this->agents['claude_code'];
        }

        // Cursor: .cursor/
        if (File::isDirectory(base_path('.cursor'))) {
            $detected['cursor'] = $this->agents['cursor'];
        }

        // Codex: .codex/ or AGENTS.md
        if (File::isDirectory(base_path('.codex')) || File::exists(base_path('.codex/config.toml'))) {
            $detected['codex'] = $this->agents['codex'];
        }

        // OpenCode: opencode.json
        if (File::exists(base_path('opencode.json'))) {
            $detected['opencode'] = $this->agents['opencode'];
        }

        // Copilot: .vscode/
        if (File::isDirectory(base_path('.vscode'))) {
            $detected['copilot'] = $this->agents['copilot'];
        }

        if (empty($detected)) {
            // Default to Claude Code if nothing detected
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
            // Skip TOML-based configs (Codex) — we can't reliably write TOML
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

        // Deduplicate skill paths (e.g. codex and opencode both use .agents/skills)
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
