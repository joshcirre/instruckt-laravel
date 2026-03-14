<?php

declare(strict_types=1);

namespace Instruckt\Laravel;

use ReflectionClass;

final class SourceResolver
{
    /**
     * Enrich framework context with source file information.
     *
     * @param  array<string, mixed>|null  $framework
     * @return array<string, mixed>|null
     */
    public static function enrich(?array $framework): ?array
    {
        if (! $framework || empty($framework['framework'])) {
            return $framework;
        }

        return match ($framework['framework']) {
            'livewire' => self::enrichLivewire($framework),
            'blade' => self::enrichBlade($framework),
            default => $framework,
        };
    }

    /**
     * Resolve a Livewire component name to its class and file path.
     *
     * @param  array<string, mixed>  $framework
     * @return array<string, mixed>
     */
    private static function enrichLivewire(array $framework): array
    {
        $componentName = $framework['component'] ?? null;

        if (! $componentName || $componentName === 'Unknown') {
            return $framework;
        }

        // Try the Livewire Factory (works in both v3 and v4)
        $class = self::resolveLivewireClass($componentName);

        if (! $class) {
            return $framework;
        }

        $framework['class_name'] = $class;

        try {
            $reflection = new ReflectionClass($class);
            $filePath = $reflection->getFileName();

            if ($filePath) {
                $framework['source_file'] = self::relativePath($filePath);
                $framework['source_line'] = 1;

                // Try to find the render method line — that's usually most relevant
                if ($reflection->hasMethod('render')) {
                    $framework['render_line'] = $reflection->getMethod('render')->getStartLine();
                }
            }
        } catch (\ReflectionException) {
            // Class exists but reflection failed — keep what we have
        }

        return $framework;
    }

    /**
     * Resolve a Livewire component name to its fully-qualified class name.
     */
    private static function resolveLivewireClass(string $name): ?string
    {
        // Livewire v3+ uses a Factory bound as 'livewire.factory'
        if (app()->bound('livewire.factory')) {
            try {
                /** @var \Livewire\Factory\Factory $factory */
                $factory = app('livewire.factory');

                return $factory->resolveComponentClass($name);
            } catch (\Throwable) {
                // Component not found or factory unavailable
            }
        }

        // Fallback: if the component name looks like a class name, try it directly
        if (class_exists($name)) {
            return $name;
        }

        return null;
    }

    /**
     * Enrich a Blade view context with its file path.
     *
     * @param  array<string, mixed>  $framework
     * @return array<string, mixed>
     */
    private static function enrichBlade(array $framework): array
    {
        $viewName = $framework['component'] ?? null;

        if (! $viewName || $viewName === 'Unknown') {
            return $framework;
        }

        try {
            $path = view()->getFinder()->find($viewName);
            $framework['source_file'] = self::relativePath($path);
        } catch (\InvalidArgumentException) {
            // View not found
        }

        return $framework;
    }

    /**
     * Convert an absolute path to a path relative to the project root.
     */
    private static function relativePath(string $absolutePath): string
    {
        $base = base_path() . '/';

        if (str_starts_with($absolutePath, $base)) {
            return substr($absolutePath, strlen($base));
        }

        return $absolutePath;
    }
}
