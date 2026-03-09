<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

final class UninstallCommand extends Command
{
    protected $signature = 'instruckt:uninstall
        {--dry-run : Show what would be removed without making changes}
        {--keep-config : Keep the published config file}
        {--keep-npm : Keep the npm package installed}';

    protected $description = 'Uninstall instruckt — remove config, toolbar injection, MCP config, skills, and npm package';

    private bool $dryRun = false;

    /** @var list<string> */
    private array $actions = [];

    public function handle(): int
    {
        $this->dryRun = (bool) $this->option('dry-run');

        if ($this->dryRun) {
            $this->components->warn('Dry run — no changes will be made.');
            $this->newLine();
        }

        $this->components->info('Uninstalling instruckt...');
        $this->newLine();

        $this->removeConfig();
        $this->removeToolbarFromJs();
        $this->removeToolbarFromBlade();
        $this->removeMcpConfig();
        $this->removeSkills();
        $this->removeStorageFiles();

        if (! $this->option('keep-npm')) {
            $this->removeNpmPackage();
        }

        $this->newLine();

        if (empty($this->actions)) {
            $this->components->info('Nothing to uninstall — instruckt is not installed.');

            return self::SUCCESS;
        }

        if ($this->dryRun) {
            $this->components->info('Dry run complete. The following changes would be made:');
            $this->newLine();

            foreach ($this->actions as $action) {
                $this->line("  • {$action}");
            }

            $this->newLine();

            return self::SUCCESS;
        }

        $this->newLine();
        $this->components->info('instruckt has been uninstalled.');
        $this->line('  You may also want to run your asset build (npm run build / bun run build).');

        return self::SUCCESS;
    }

    // ── Config ──────────────────────────────────────────────────

    private function removeConfig(): void
    {
        if ($this->option('keep-config')) {
            return;
        }

        $configPath = config_path('instruckt.php');

        if (! File::exists($configPath)) {
            return;
        }

        $this->record("Remove config/instruckt.php");

        if (! $this->dryRun) {
            File::delete($configPath);
            $this->components->info('Removed config/instruckt.php');
        }
    }

    // ── JS toolbar injection ────────────────────────────────────

    private function removeToolbarFromJs(): void
    {
        $candidates = [
            resource_path('js/app.tsx'),
            resource_path('js/app.ts'),
            resource_path('js/app.jsx'),
            resource_path('js/app.js'),
        ];

        foreach ($candidates as $appPath) {
            if (! File::exists($appPath)) {
                continue;
            }

            $contents = File::get($appPath);

            if (! str_contains($contents, 'instruckt')) {
                continue;
            }

            $relative = str_replace(base_path() . '/', '', $appPath);

            // Remove the instruckt snippet block (comment + import + constructor)
            $cleaned = (string) preg_replace(
                '/\n*\/\/ Instruckt — visual feedback toolbar\nimport \{ Instruckt \} from \'instruckt\';\nnew Instruckt\([^)]*\);\n*/',
                "\n",
                $contents
            );

            // If the pattern didn't match (custom edits), try line-by-line removal
            if ($cleaned === $contents) {
                $lines = explode("\n", $contents);
                $filtered = array_filter($lines, function (string $line) {
                    $trimmed = trim($line);

                    if ($trimmed === '// Instruckt — visual feedback toolbar') {
                        return false;
                    }

                    if (str_contains($trimmed, "from 'instruckt'") || str_contains($trimmed, 'from "instruckt"')) {
                        return false;
                    }

                    if (str_contains($trimmed, 'new Instruckt(')) {
                        return false;
                    }

                    return true;
                });

                $cleaned = implode("\n", $filtered);
            }

            // Trim trailing whitespace/newlines to keep file clean
            $cleaned = rtrim($cleaned) . "\n";

            $this->record("Remove instruckt code from {$relative}");

            if (! $this->dryRun) {
                File::put($appPath, $cleaned);
                $this->components->info("Removed instruckt from {$relative}");
            }
        }
    }

    // ── Blade toolbar injection ─────────────────────────────────

    private function removeToolbarFromBlade(): void
    {
        $layouts = $this->findLayoutFiles();

        foreach ($layouts as $layout) {
            $contents = File::get($layout);

            if (! str_contains($contents, 'instruckt-toolbar') && ! str_contains($contents, 'x-instruckt')) {
                continue;
            }

            $relative = str_replace(base_path() . '/', '', $layout);

            // Remove @persist wrapped version
            $cleaned = (string) preg_replace(
                '/\s*@persist\(\'instruckt\'\)\s*<x-instruckt-toolbar\s*\/>\s*@endpersist\s*/s',
                "\n",
                $contents
            );

            // Remove standalone component
            $cleaned = (string) preg_replace(
                '/\s*<x-instruckt-toolbar\s*\/>\s*/',
                "\n",
                $cleaned
            );

            if ($cleaned !== $contents) {
                $this->record("Remove toolbar from {$relative}");

                if (! $this->dryRun) {
                    File::put($layout, $cleaned);
                    $this->components->info("Removed toolbar from {$relative}");
                }
            }
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
                $path = $dir . '/' . $name;

                if (File::exists($path)) {
                    $layouts[] = $path;
                }
            }
        }

        return array_unique($layouts);
    }

    // ── MCP config ──────────────────────────────────────────────

    private function removeMcpConfig(): void
    {
        $mcpFiles = [
            ['.mcp.json', 'mcpServers', 'Claude Code'],
            ['.cursor/mcp.json', 'mcpServers', 'Cursor'],
            ['.vscode/mcp.json', 'servers', 'GitHub Copilot'],
            ['opencode.json', 'mcp', 'OpenCode'],
        ];

        foreach ($mcpFiles as [$path, $key, $name]) {
            $fullPath = base_path($path);

            if (! File::exists($fullPath)) {
                continue;
            }

            $config = json_decode(File::get($fullPath), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                continue;
            }

            if (! isset($config[$key]['instruckt'])) {
                continue;
            }

            $this->record("Remove instruckt from {$path} ({$name})");

            if (! $this->dryRun) {
                unset($config[$key]['instruckt']);

                // If the MCP key is now empty and the whole file is just that key, remove the file
                if (empty($config[$key]) && count($config) === 1) {
                    File::delete($fullPath);
                    $this->components->info("Removed {$path} ({$name}) — was only instruckt");
                } else {
                    File::put($fullPath, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n");
                    $this->components->info("Removed instruckt from {$path} ({$name})");
                }
            }
        }
    }

    // ── Skills ──────────────────────────────────────────────────

    private function removeSkills(): void
    {
        $skillDirs = [
            '.claude/skills/instruckt',
            '.cursor/skills/instruckt',
            '.agents/skills/instruckt',
            '.github/skills/instruckt',
        ];

        $removed = [];

        foreach ($skillDirs as $dir) {
            $fullPath = base_path($dir);

            if (! File::isDirectory($fullPath) || isset($removed[$fullPath])) {
                continue;
            }

            $this->record("Remove skill directory {$dir}");

            if (! $this->dryRun) {
                File::deleteDirectory($fullPath);
                $this->components->info("Removed {$dir}");
            }

            $removed[$fullPath] = true;
        }
    }

    // ── Storage files ───────────────────────────────────────────

    private function removeStorageFiles(): void
    {
        $storagePath = storage_path('app/instruckt');

        if (! File::isDirectory($storagePath)) {
            return;
        }

        $this->record("Remove storage/app/instruckt directory (annotations & screenshots)");

        if (! $this->dryRun) {
            File::deleteDirectory($storagePath);
            $this->components->info('Removed storage/app/instruckt');
        }
    }

    // ── npm package ─────────────────────────────────────────────

    private function removeNpmPackage(): void
    {
        if (! File::exists(base_path('node_modules/instruckt'))) {
            return;
        }

        $useBun = File::exists(base_path('bun.lockb')) || File::exists(base_path('bun.lock'));
        $cmd = $useBun ? 'bun remove instruckt' : 'npm uninstall instruckt';

        $this->record("Uninstall npm package ({$cmd})");

        if (! $this->dryRun) {
            $process = proc_open($cmd, [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes, base_path());

            if ($process) {
                stream_get_contents($pipes[1]);
                stream_get_contents($pipes[2]);
                fclose($pipes[1]);
                fclose($pipes[2]);
                $exitCode = proc_close($process);

                if ($exitCode === 0) {
                    $this->components->info('Uninstalled npm package.');
                } else {
                    $this->components->warn("Could not uninstall npm package automatically. Run manually: {$cmd}");
                }
            }
        }
    }

    // ── Helpers ──────────────────────────────────────────────────

    private function record(string $action): void
    {
        $this->actions[] = $action;
    }
}
