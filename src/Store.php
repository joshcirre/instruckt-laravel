<?php

declare(strict_types=1);

namespace Instruckt\Laravel;

use Illuminate\Support\Str;

final class Store
{
    private static function path(): string
    {
        return storage_path('app/_instruckt/annotations.json');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private static function readAll(): array
    {
        $path = self::path();

        if (! file_exists($path)) {
            return [];
        }

        $data = json_decode(file_get_contents($path), true);

        return is_array($data) ? $data : [];
    }

    /**
     * @param array<int, array<string, mixed>> $annotations
     */
    private static function writeAll(array $annotations): void
    {
        $path = self::path();
        $dir = dirname($path);

        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents($path, json_encode(array_values($annotations), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n", LOCK_EX);
    }

    private static function screenshotDir(): string
    {
        return storage_path('app/_instruckt/screenshots');
    }

    /**
     * Delete the screenshot file for an annotation if it exists.
     */
    private static function deleteScreenshot(?string $screenshotPath): void
    {
        if (! $screenshotPath) {
            return;
        }

        $path = storage_path("app/_instruckt/{$screenshotPath}");

        if (file_exists($path)) {
            @unlink($path);
        }
    }

    /**
     * Save a data URL screenshot to disk and return the relative path.
     */
    private static function saveScreenshot(string $id, string $dataUrl): ?string
    {
        if (! str_starts_with($dataUrl, 'data:image/')) {
            return null;
        }

        $dir = self::screenshotDir();

        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        // Determine format and extract data
        $parts = explode(',', $dataUrl, 2);
        $header = $parts[0] ?? '';
        $data = $parts[1] ?? '';

        if (str_contains($header, ';base64')) {
            $binary = base64_decode($data);
            $ext = str_contains($header, 'image/svg+xml') ? 'svg' : 'png';
        } else {
            // URL-encoded (e.g. SVG data URLs from snapdom)
            $binary = urldecode($data);
            $ext = 'svg';
        }

        if (! $binary) {
            return null;
        }

        $filename = "{$id}.{$ext}";
        file_put_contents("{$dir}/{$filename}", $binary);

        return "screenshots/{$filename}";
    }

    public static function createAnnotation(array $data): array
    {
        $id = (string) Str::ulid();
        $now = now()->toIso8601String();

        // Save screenshot file if provided
        $screenshot = null;
        if (! empty($data['screenshot'])) {
            $screenshot = self::saveScreenshot($id, $data['screenshot']);
        }

        // Enrich framework context with server-side source resolution
        $framework = SourceResolver::enrich($data['framework'] ?? null);

        $annotation = [
            'id' => $id,
            'url' => $data['url'] ?? '',
            'x' => (float) ($data['x'] ?? 0),
            'y' => (float) ($data['y'] ?? 0),
            'comment' => $data['comment'] ?? '',
            'element' => $data['element'] ?? '',
            'element_path' => $data['element_path'] ?? '',
            'css_classes' => $data['css_classes'] ?? null,
            'nearby_text' => $data['nearby_text'] ?? null,
            'selected_text' => $data['selected_text'] ?? null,
            'bounding_box' => $data['bounding_box'] ?? null,
            'screenshot' => $screenshot,
            'intent' => $data['intent'] ?? 'fix',
            'severity' => $data['severity'] ?? 'important',
            'status' => 'pending',
            'framework' => $framework,
            'thread' => [],
            'resolved_by' => null,
            'resolved_at' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ];

        $all = self::readAll();
        $all[] = $annotation;
        self::writeAll($all);

        return $annotation;
    }

    public static function getAnnotation(string $id): ?array
    {
        foreach (self::readAll() as $annotation) {
            if ($annotation['id'] === $id) {
                return $annotation;
            }
        }

        return null;
    }

    /**
     * @internal Used by HTTP controllers only — do not call from MCP tools.
     *           The abort() call throws HttpResponseException which crashes
     *           the stdio transport when app.debug is true.
     */
    public static function getAnnotationOrFail(string $id): array
    {
        $annotation = self::getAnnotation($id);

        if (! $annotation) {
            abort(404, 'Annotation not found.');
        }

        return $annotation;
    }

    public static function updateAnnotation(string $id, array $data): ?array
    {
        $all = self::readAll();
        $found = false;
        $updated = null;
        $allowed = ['status', 'comment', 'resolved_by', 'resolved_at', 'thread'];

        foreach ($all as &$annotation) {
            if ($annotation['id'] !== $id) {
                continue;
            }

            foreach ($data as $key => $value) {
                if (in_array($key, $allowed, true)) {
                    $annotation[$key] = $value;
                }
            }

            $annotation['updated_at'] = now()->toIso8601String();
            $found = true;
            $updated = $annotation;

            // Clean up screenshot when annotation is resolved or dismissed
            $newStatus = $data['status'] ?? null;
            if (in_array($newStatus, ['resolved', 'dismissed'], true)) {
                self::deleteScreenshot($annotation['screenshot'] ?? null);
            }

            break;
        }
        unset($annotation);

        if (! $found) {
            return null;
        }

        self::writeAll($all);

        return $updated;
    }

    public static function allAnnotations(): array
    {
        return self::readAll();
    }

    public static function getPendingAnnotations(): array
    {
        return array_values(array_filter(
            self::readAll(),
            fn (array $a) => $a['status'] === 'pending',
        ));
    }
}
