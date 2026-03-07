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

    public static function createAnnotation(array $data): array
    {
        $id = (string) Str::ulid();
        $now = now()->toIso8601String();

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
            'intent' => $data['intent'] ?? 'fix',
            'severity' => $data['severity'] ?? 'important',
            'status' => 'pending',
            'framework' => $data['framework'] ?? null,
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

    public static function getAnnotationOrFail(string $id): array
    {
        $annotation = self::getAnnotation($id);

        if (! $annotation) {
            abort(404, 'Annotation not found.');
        }

        return $annotation;
    }

    public static function updateAnnotation(string $id, array $data): array
    {
        $all = self::readAll();
        $found = false;
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

            break;
        }
        unset($annotation);

        if (! $found) {
            abort(404, 'Annotation not found.');
        }

        self::writeAll($all);

        return $updated;
    }

    public static function addThreadMessage(string $annotationId, string $role, string $content): array
    {
        $all = self::readAll();

        foreach ($all as &$annotation) {
            if ($annotation['id'] !== $annotationId) {
                continue;
            }

            $annotation['thread'][] = [
                'id' => (string) Str::ulid(),
                'role' => $role,
                'content' => $content,
                'timestamp' => now()->toIso8601String(),
            ];

            $annotation['updated_at'] = now()->toIso8601String();
            self::writeAll($all);

            return $annotation;
        }
        unset($annotation);

        abort(404, 'Annotation not found.');
    }

    public static function allAnnotations(): array
    {
        return self::readAll();
    }

    public static function getPendingAnnotations(): array
    {
        return array_values(array_filter(
            self::readAll(),
            fn (array $a) => in_array($a['status'], ['pending', 'acknowledged'], true),
        ));
    }
}
