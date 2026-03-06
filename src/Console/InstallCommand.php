<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Console;

use Illuminate\Console\Command;

final class InstallCommand extends Command
{
    protected $signature = 'instruckt:install';

    protected $description = 'Install instruckt — publish config, run migrations, publish assets';

    public function handle(): int
    {
        $this->info('Installing instruckt...');

        $this->call('vendor:publish', ['--tag' => 'instruckt-config', '--force' => false]);
        $this->call('vendor:publish', ['--tag' => 'instruckt-migrations', '--force' => false]);
        $this->call('vendor:publish', ['--tag' => 'instruckt-assets', '--force' => true]);
        $this->call('migrate', ['--force' => false]);

        $this->newLine();
        $this->components->info('instruckt installed successfully.');
        $this->newLine();
        $this->line('  Add the toolbar to your layout:');
        $this->line('  <code>&lt;x-instruckt-toolbar /&gt;</code>');
        $this->newLine();
        $this->line('  Configure Claude Code:');
        $this->line('  Add to .mcp.json → "instruckt": { "url": "' . url('mcp') . '" }');
        $this->newLine();

        return self::SUCCESS;
    }
}
