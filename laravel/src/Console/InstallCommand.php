<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

final class InstallCommand extends Command
{
    protected $signature = 'instruckt:install
        {--skip-mcp : Skip automatic .mcp.json configuration}
        {--skip-skill : Skip installing the Claude Code skill}';

    protected $description = 'Install instruckt — publish config, run migrations, publish assets, configure MCP';

    public function handle(): int
    {
        $this->info('Installing instruckt...');

        $this->call('vendor:publish', ['--tag' => 'instruckt-config', '--force' => false]);
        $this->call('vendor:publish', ['--tag' => 'instruckt-migrations', '--force' => false]);
        $this->call('vendor:publish', ['--tag' => 'instruckt-assets', '--force' => true]);
        $this->call('migrate', ['--force' => false]);

        if (! $this->option('skip-mcp')) {
            $this->configureMcp();
        }

        if (! $this->option('skip-skill')) {
            $this->installSkill();
        }

        $this->newLine();
        $this->components->info('instruckt installed successfully.');
        $this->newLine();
        $this->line('  Add the toolbar to your layout:');
        $this->line('  <code>&lt;x-instruckt-toolbar /&gt;</code>');
        $this->newLine();

        return self::SUCCESS;
    }

    private function configureMcp(): void
    {
        $mcpPath = base_path('.mcp.json');
        $serverConfig = [
            'command' => 'php',
            'args' => [base_path('artisan'), 'mcp:serve', 'instruckt'],
        ];

        if (File::exists($mcpPath)) {
            $config = json_decode(File::get($mcpPath), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $this->warn('  Could not parse .mcp.json — skipping MCP configuration.');

                return;
            }

            if (isset($config['mcpServers']['instruckt'])) {
                $this->line('  MCP server already configured.');

                return;
            }

            $config['mcpServers']['instruckt'] = $serverConfig;
        } else {
            $config = ['mcpServers' => ['instruckt' => $serverConfig]];
        }

        File::put($mcpPath, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n");
        $this->components->info('Configured instruckt MCP server in .mcp.json');
    }

    private function installSkill(): void
    {
        $skillSource = dirname(__DIR__, 2).'/resources/boost/skills/instruckt/SKILL.md';
        $skillDir = base_path('.claude/skills/instruckt');

        if (! File::exists($skillSource)) {
            return;
        }

        if (File::exists($skillDir.'/SKILL.md')) {
            $this->line('  Skill already installed.');

            return;
        }

        File::ensureDirectoryExists($skillDir);
        File::copy($skillSource, $skillDir.'/SKILL.md');
        $this->components->info('Installed instruckt skill to .claude/skills/instruckt/');
    }
}
