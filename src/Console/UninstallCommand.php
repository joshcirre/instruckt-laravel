<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

use function Laravel\Prompts\confirm;
use function Laravel\Prompts\note;
use function Laravel\Prompts\spin;
use function Laravel\Prompts\table;
use function Laravel\Prompts\warning;

final class UninstallCommand extends Command
{
    protected $signature = 'instruckt:uninstall
        {--force : Skip confirmation prompt}
        {--keep-config : Keep the published config file}
        {--keep-npm : Keep the npm package installed}';

    protected $description = 'Uninstall instruckt — remove config, toolbar injection, MCP config, skills, and npm package';

    /** @var list<array{string, string}> */
    private array $found = [];

    public function handle(): int
    {
        note('Uninstalling instruckt');
        $this->newLine();

        $this->scan();

        if (empty($this->found)) {
            $this->components->info('Nothing to uninstall — instruckt is not installed.');

            return self::SUCCESS;
        }

        table(
            headers: ['What', 'Location'],
            rows: $this->found,
        );

        if (! $this->option('force') && ! confirm('Proceed with uninstall?', default: false)) {
            $this->newLine();
            $this->components->info('Uninstall cancelled.');

            return self::SUCCESS;
        }

        $this->newLine();

        $this->removeConfig();
        $this->removeVitePlugin();
        $this->removeToolbarFromJs();
        $this->removeToolbarFromBlade();
        $this->removeMcpConfig();
        $this->removeSkills();
        $this->removeStorageFiles();

        if (! $this->option('keep-npm')) {
            $this->removeNpmPackage();
        }

        $this->newLine();
        $this->components->info('instruckt has been uninstalled.');
        $this->newLine();
        $this->line('  Next steps:');
        $this->line('  <fg=gray>composer remove joshcirre/instruckt-laravel --dev</>');
        $this->line('  <fg=gray>npm run build</> or <fg=gray>bun run build</>');
        $this->newLine();

        return self::SUCCESS;
    }

    // ── Scan ────────────────────────────────────────────────────

    private function scan(): void
    {
        if (! $this->option('keep-config') && File::exists(config_path('instruckt.php'))) {
            $this->found[] = ['Config', 'config/instruckt.php'];
        }

        foreach ($this->viteConfigCandidates() as $vitePath) {
            if (File::exists($vitePath) && str_contains(File::get($vitePath), 'instruckt/vite')) {
                $this->found[] = ['Vite plugin', $this->relative($vitePath)];
            }
        }

        foreach ($this->jsEntryCandidates() as $appPath) {
            if (File::exists($appPath) && str_contains(File::get($appPath), 'instruckt')) {
                $this->found[] = ['JS toolbar code', $this->relative($appPath)];
            }
        }

        foreach ($this->findLayoutFiles() as $layout) {
            $contents = File::get($layout);

            if (str_contains($contents, 'instruckt-toolbar') || str_contains($contents, 'x-instruckt')) {
                $this->found[] = ['Blade toolbar', $this->relative($layout)];
            }
        }

        foreach ($this->mcpFiles() as [$path, $key, $name]) {
            $fullPath = base_path($path);

            if (! File::exists($fullPath)) {
                continue;
            }

            $config = json_decode(File::get($fullPath), true);

            if (json_last_error() === JSON_ERROR_NONE && isset($config[$key]['instruckt'])) {
                $this->found[] = ['MCP config', "{$path} ({$name})"];
            }
        }

        $checked = [];

        foreach ($this->skillDirs() as $dir) {
            $fullPath = base_path($dir);

            if (File::isDirectory($fullPath) && ! isset($checked[$fullPath])) {
                $this->found[] = ['Agent skill', $dir];
                $checked[$fullPath] = true;
            }
        }

        if (File::isDirectory(storage_path('app/instruckt'))) {
            $this->found[] = ['Storage data', 'storage/app/instruckt'];
        }

        if (! $this->option('keep-npm') && File::exists(base_path('node_modules/instruckt'))) {
            $this->found[] = ['npm package', 'instruckt'];
        }
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

        File::delete($configPath);
        $this->components->twoColumnDetail('config/instruckt.php', '<fg=red>removed</>');
    }

    // ── Vite plugin ────────────────────────────────────────────

    private function removeVitePlugin(): void
    {
        foreach ($this->viteConfigCandidates() as $vitePath) {
            if (! File::exists($vitePath)) {
                continue;
            }

            $contents = File::get($vitePath);

            if (! str_contains($contents, 'instruckt/vite') && ! str_contains($contents, 'instruckt(')) {
                continue;
            }

            $relative = $this->relative($vitePath);

            // Remove the import line
            $cleaned = (string) preg_replace(
                '/\s*import\s+instruckt\s+from\s+[\'"]instruckt\/vite[\'"]\s*;?\n?/',
                "\n",
                $contents
            );

            // Remove the plugin call (handles single-line instruckt({ ... }),)
            $cleaned = (string) preg_replace(
                '/\s*instruckt\(\s*\{[^}]*\}\s*\)\s*,?\n?/',
                "\n",
                $cleaned
            );

            if ($cleaned !== $contents) {
                File::put($vitePath, $cleaned);
                $this->components->twoColumnDetail($relative, '<fg=red>plugin removed</>');
            }
        }
    }

    // ── JS toolbar injection ────────────────────────────────────

    private function removeToolbarFromJs(): void
    {
        foreach ($this->jsEntryCandidates() as $appPath) {
            if (! File::exists($appPath)) {
                continue;
            }

            $contents = File::get($appPath);

            if (! str_contains($contents, 'instruckt')) {
                continue;
            }

            $relative = $this->relative($appPath);

            // Remove the instruckt snippet block (comment + import + constructor)
            $cleaned = (string) preg_replace(
                '/\n*\/\/ Instruckt — visual feedback toolbar\nimport \{ Instruckt \} from \'instruckt\';\nnew Instruckt\([^)]*\);\n*/',
                "\n",
                $contents
            );

            // Remove the import.meta.env.DEV wrapped block
            $cleaned = (string) preg_replace(
                '/\n*\/\/ Instruckt — visual feedback toolbar \(only loaded in dev\)\nif \(import\.meta\.env\.DEV\) \{\n\s*import\(\'instruckt\'\)\.then\([^)]*\)[^}]*\}\n*/',
                "\n",
                $cleaned
            );

            // If the pattern didn't match (custom edits), try line-by-line removal
            if ($cleaned === $contents) {
                $lines = explode("\n", $contents);
                $filtered = array_filter($lines, function (string $line) {
                    $trimmed = trim($line);

                    if ($trimmed === '// Instruckt — visual feedback toolbar'
                        || $trimmed === '// Instruckt — visual feedback toolbar (only loaded in dev)') {
                        return false;
                    }

                    if (str_contains($trimmed, "from 'instruckt'") || str_contains($trimmed, 'from "instruckt"')) {
                        return false;
                    }

                    if (str_contains($trimmed, 'new Instruckt(')) {
                        return false;
                    }

                    if (str_contains($trimmed, "virtual:instruckt")) {
                        return false;
                    }

                    if (str_contains($trimmed, "import('instruckt')")) {
                        return false;
                    }

                    return true;
                });

                $cleaned = implode("\n", $filtered);
            }

            $cleaned = rtrim($cleaned) . "\n";

            File::put($appPath, $cleaned);
            $this->components->twoColumnDetail($relative, '<fg=red>cleaned</>');
        }
    }

    // ── Blade toolbar injection ─────────────────────────────────

    private function removeToolbarFromBlade(): void
    {
        foreach ($this->findLayoutFiles() as $layout) {
            $contents = File::get($layout);

            if (! str_contains($contents, 'instruckt-toolbar') && ! str_contains($contents, 'x-instruckt')) {
                continue;
            }

            $relative = $this->relative($layout);

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
                File::put($layout, $cleaned);
                $this->components->twoColumnDetail($relative, '<fg=red>toolbar removed</>');
            }
        }
    }

    // ── MCP config ──────────────────────────────────────────────

    private function removeMcpConfig(): void
    {
        foreach ($this->mcpFiles() as [$path, $key, $name]) {
            $fullPath = base_path($path);

            if (! File::exists($fullPath)) {
                continue;
            }

            $config = json_decode(File::get($fullPath), true);

            if (json_last_error() !== JSON_ERROR_NONE || ! isset($config[$key]['instruckt'])) {
                continue;
            }

            unset($config[$key]['instruckt']);

            if (empty($config[$key]) && count($config) === 1) {
                File::delete($fullPath);
                $this->components->twoColumnDetail("{$path} ({$name})", '<fg=red>removed</>');
            } else {
                File::put($fullPath, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n");
                $this->components->twoColumnDetail("{$path} ({$name})", '<fg=red>cleaned</>');
            }
        }
    }

    // ── Skills ──────────────────────────────────────────────────

    private function removeSkills(): void
    {
        $removed = [];

        foreach ($this->skillDirs() as $dir) {
            $fullPath = base_path($dir);

            if (! File::isDirectory($fullPath) || isset($removed[$fullPath])) {
                continue;
            }

            File::deleteDirectory($fullPath);
            $this->components->twoColumnDetail($dir, '<fg=red>removed</>');
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

        File::deleteDirectory($storagePath);
        $this->components->twoColumnDetail('storage/app/instruckt', '<fg=red>removed</>');
    }

    // ── npm package ─────────────────────────────────────────────

    private function removeNpmPackage(): void
    {
        if (! File::exists(base_path('node_modules/instruckt'))) {
            return;
        }

        $useBun = File::exists(base_path('bun.lockb')) || File::exists(base_path('bun.lock'));
        $cmd = $useBun ? 'bun remove instruckt' : 'npm uninstall instruckt';

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
            message: "Uninstalling npm package ({$cmd})...",
        );

        if ($exitCode === 0) {
            $this->components->twoColumnDetail('npm package', '<fg=red>uninstalled</>');
        } else {
            warning("Could not uninstall npm package automatically. Run manually: {$cmd}");
        }
    }

    // ── Shared data ─────────────────────────────────────────────

    /**
     * @return list<string>
     */
    private function viteConfigCandidates(): array
    {
        return [
            base_path('vite.config.ts'),
            base_path('vite.config.js'),
            base_path('vite.config.mts'),
            base_path('vite.config.mjs'),
        ];
    }

    /**
     * @return list<string>
     */
    private function jsEntryCandidates(): array
    {
        return [
            resource_path('js/app.tsx'),
            resource_path('js/app.ts'),
            resource_path('js/app.jsx'),
            resource_path('js/app.js'),
        ];
    }

    /**
     * @return list<array{string, string, string}>
     */
    private function mcpFiles(): array
    {
        return [
            ['.mcp.json', 'mcpServers', 'Claude Code'],
            ['.cursor/mcp.json', 'mcpServers', 'Cursor'],
            ['.vscode/mcp.json', 'servers', 'GitHub Copilot'],
            ['opencode.json', 'mcp', 'OpenCode'],
        ];
    }

    /**
     * @return list<string>
     */
    private function skillDirs(): array
    {
        return [
            '.claude/skills/instruckt',
            '.cursor/skills/instruckt',
            '.agents/skills/instruckt',
            '.github/skills/instruckt',
        ];
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

    private function relative(string $path): string
    {
        return str_replace(base_path() . '/', '', $path);
    }
}
