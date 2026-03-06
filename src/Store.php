<?php

declare(strict_types=1);

namespace Instruckt\Laravel;

use Illuminate\Support\Str;
use PDO;

final class Store
{
    private static ?PDO $pdo = null;

    private static function db(): PDO
    {
        if (self::$pdo === null) {
            $path = base_path('instruckt.sqlite');
            $isNew = ! file_exists($path);

            self::$pdo = new PDO("sqlite:{$path}", null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);

            self::$pdo->exec('PRAGMA journal_mode=WAL');

            if ($isNew) {
                self::migrate();
            }
        }

        return self::$pdo;
    }

    private static function migrate(): void
    {
        self::$pdo->exec(<<<'SQL'
            CREATE TABLE IF NOT EXISTS annotations (
                id TEXT PRIMARY KEY,
                url TEXT NOT NULL,
                x REAL NOT NULL DEFAULT 0,
                y REAL NOT NULL DEFAULT 0,
                comment TEXT NOT NULL,
                element TEXT NOT NULL DEFAULT '',
                element_path TEXT DEFAULT '',
                css_classes TEXT,
                nearby_text TEXT,
                selected_text TEXT,
                bounding_box TEXT,
                intent TEXT NOT NULL DEFAULT 'fix',
                severity TEXT NOT NULL DEFAULT 'important',
                status TEXT NOT NULL DEFAULT 'pending',
                framework TEXT,
                thread TEXT NOT NULL DEFAULT '[]',
                resolved_by TEXT,
                resolved_at TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
        SQL);
    }

    public static function createAnnotation(array $data): array
    {
        $id = (string) Str::ulid();
        $now = now()->toIso8601String();

        $stmt = self::db()->prepare(<<<'SQL'
            INSERT INTO annotations (id, url, x, y, comment, element, element_path, css_classes,
                nearby_text, selected_text, bounding_box, intent, severity, status, framework,
                thread, resolved_by, resolved_at, created_at, updated_at)
            VALUES (:id, :url, :x, :y, :comment, :element, :element_path, :css_classes,
                :nearby_text, :selected_text, :bounding_box, :intent, :severity, 'pending', :framework,
                '[]', NULL, NULL, :created_at, :updated_at)
        SQL);

        $stmt->execute([
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
            'bounding_box' => isset($data['bounding_box']) ? json_encode($data['bounding_box']) : null,
            'intent' => $data['intent'] ?? 'fix',
            'severity' => $data['severity'] ?? 'important',
            'framework' => isset($data['framework']) ? json_encode($data['framework']) : null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return self::getAnnotationOrFail($id);
    }

    public static function getAnnotation(string $id): ?array
    {
        $stmt = self::db()->prepare('SELECT * FROM annotations WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        return $row ? self::hydrate($row) : null;
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
        self::getAnnotationOrFail($id);

        $allowed = ['status', 'comment', 'resolved_by', 'resolved_at', 'thread'];
        $sets = [];
        $params = ['id' => $id, 'updated_at' => now()->toIso8601String()];

        foreach ($data as $key => $value) {
            if (! in_array($key, $allowed, true)) {
                continue;
            }

            if ($key === 'thread') {
                $value = json_encode($value);
            }

            $sets[] = "{$key} = :{$key}";
            $params[$key] = $value;
        }

        $sets[] = 'updated_at = :updated_at';

        if (! empty($sets)) {
            $sql = 'UPDATE annotations SET ' . implode(', ', $sets) . ' WHERE id = :id';
            self::db()->prepare($sql)->execute($params);
        }

        return self::getAnnotationOrFail($id);
    }

    public static function addThreadMessage(string $annotationId, string $role, string $content): array
    {
        $annotation = self::getAnnotationOrFail($annotationId);

        $thread = $annotation['thread'] ?? [];
        $thread[] = [
            'id' => (string) Str::ulid(),
            'role' => $role,
            'content' => $content,
            'timestamp' => now()->toIso8601String(),
        ];

        return self::updateAnnotation($annotationId, ['thread' => $thread]);
    }

    public static function allAnnotations(): array
    {
        $rows = self::db()->query('SELECT * FROM annotations ORDER BY created_at ASC')->fetchAll();

        return array_map([self::class, 'hydrate'], $rows);
    }

    public static function getPendingAnnotations(): array
    {
        $stmt = self::db()->prepare(
            "SELECT * FROM annotations WHERE status IN ('pending', 'acknowledged') ORDER BY created_at ASC"
        );
        $stmt->execute();

        return array_map([self::class, 'hydrate'], $stmt->fetchAll());
    }

    private static function hydrate(array $row): array
    {
        $row['x'] = (float) $row['x'];
        $row['y'] = (float) $row['y'];
        $row['bounding_box'] = $row['bounding_box'] ? json_decode($row['bounding_box'], true) : null;
        $row['framework'] = $row['framework'] ? json_decode($row['framework'], true) : null;
        $row['thread'] = json_decode($row['thread'] ?? '[]', true);

        return $row;
    }
}
