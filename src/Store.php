<?php

declare(strict_types=1);

namespace Instruckt\Laravel;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class Store
{
    // -------------------------------------------------------------------------
    // Driver routing
    // -------------------------------------------------------------------------

    private static function useDatabase(): bool
    {
        return config('instruckt.store', 'file') === 'database';
    }

    // -------------------------------------------------------------------------
    // Public API (driver-agnostic)
    // -------------------------------------------------------------------------

    public static function createAnnotation(array $data): array
    {
        $id = (string) Str::ulid();
        $now = now()->toIso8601String();

        $screenshot = null;
        if (! empty($data['screenshot'])) {
            $screenshot = self::saveScreenshot($id, $data['screenshot']);
        }

        $framework = SourceResolver::enrich($data['framework'] ?? null);

        $annotation = [
            'id'            => $id,
            'url'           => $data['url'] ?? '',
            'x'             => (float) ($data['x'] ?? 0),
            'y'             => (float) ($data['y'] ?? 0),
            'comment'       => $data['comment'] ?? '',
            'element'       => $data['element'] ?? '',
            'element_path'  => $data['element_path'] ?? '',
            'css_classes'   => $data['css_classes'] ?? null,
            'nearby_text'   => $data['nearby_text'] ?? null,
            'selected_text' => $data['selected_text'] ?? null,
            'bounding_box'  => $data['bounding_box'] ?? null,
            'screenshot'    => $screenshot,
            'intent'        => $data['intent'] ?? 'fix',
            'severity'      => $data['severity'] ?? 'important',
            'status'        => 'pending',
            'framework'     => $framework,
            'thread'        => [],
            'resolved_by'   => null,
            'resolved_at'   => null,
            'created_at'    => $now,
            'updated_at'    => $now,
        ];

        if (self::useDatabase()) {
            self::dbInsert($annotation);
        } else {
            $all = self::fileReadAll();
            $all[] = $annotation;
            self::fileWriteAll($all);
        }

        return $annotation;
    }

    public static function getAnnotation(string $id): ?array
    {
        if (self::useDatabase()) {
            $row = DB::table('instruckt_annotations')->where('id', $id)->first();

            return $row ? self::dbRowToArray((array) $row) : null;
        }

        foreach (self::fileReadAll() as $annotation) {
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

    public static function updateAnnotation(string $id, array $data): ?array
    {
        $allowed = ['status', 'comment', 'resolved_by', 'resolved_at', 'thread'];
        $changes = array_intersect_key($data, array_flip($allowed));

        if (self::useDatabase()) {
            $row = DB::table('instruckt_annotations')->where('id', $id)->first();
            if (! $row) {
                return null;
            }

            $newStatus = $changes['status'] ?? null;
            if (in_array($newStatus, ['resolved', 'dismissed'], true)) {
                self::deleteScreenshot(((array) $row)['screenshot'] ?? null);
            }

            $dbChanges = [];
            foreach ($changes as $key => $value) {
                $dbChanges[$key] = is_array($value) ? json_encode($value) : $value;
            }
            $dbChanges['updated_at'] = now()->toDateTimeString();

            DB::table('instruckt_annotations')->where('id', $id)->update($dbChanges);

            return self::getAnnotation($id);
        }

        $all = self::fileReadAll();
        $found = false;
        $updated = null;

        foreach ($all as &$annotation) {
            if ($annotation['id'] !== $id) {
                continue;
            }

            foreach ($changes as $key => $value) {
                $annotation[$key] = $value;
            }

            $annotation['updated_at'] = now()->toIso8601String();
            $found = true;
            $updated = $annotation;

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

        self::fileWriteAll($all);

        return $updated;
    }

    public static function allAnnotations(): array
    {
        if (self::useDatabase()) {
            return array_map(
                fn ($row) => self::dbRowToArray((array) $row),
                DB::table('instruckt_annotations')->orderBy('created_at')->get()->all(),
            );
        }

        return self::fileReadAll();
    }

    public static function getPendingAnnotations(): array
    {
        if (self::useDatabase()) {
            return array_map(
                fn ($row) => self::dbRowToArray((array) $row),
                DB::table('instruckt_annotations')
                    ->where('status', 'pending')
                    ->orderBy('created_at')
                    ->get()
                    ->all(),
            );
        }

        return array_values(array_filter(
            self::fileReadAll(),
            fn (array $a) => $a['status'] === 'pending',
        ));
    }

    // -------------------------------------------------------------------------
    // Screenshot helpers (shared, disk-aware)
    // -------------------------------------------------------------------------

    private static function screenshotDisk(): \Illuminate\Contracts\Filesystem\Filesystem
    {
        return Storage::disk(config('instruckt.screenshot_disk', 'local'));
    }

    private static function saveScreenshot(string $id, string $dataUrl): ?string
    {
        if (! str_starts_with($dataUrl, 'data:image/')) {
            return null;
        }

        $parts = explode(',', $dataUrl, 2);
        $header = $parts[0] ?? '';
        $data = $parts[1] ?? '';

        if (str_contains($header, ';base64')) {
            $binary = base64_decode($data);
            $ext = str_contains($header, 'image/svg+xml') ? 'svg' : 'png';
        } else {
            $binary = urldecode($data);
            $ext = 'svg';
        }

        if (! $binary) {
            return null;
        }

        $diskPath = "_instruckt/screenshots/{$id}.{$ext}";
        self::screenshotDisk()->put($diskPath, $binary);

        return "screenshots/{$id}.{$ext}";
    }

    public static function deleteScreenshot(?string $screenshotPath): void
    {
        if (! $screenshotPath) {
            return;
        }

        $diskPath = "_instruckt/{$screenshotPath}";

        if (self::screenshotDisk()->exists($diskPath)) {
            self::screenshotDisk()->delete($diskPath);
        }
    }

    /**
     * Resolve a screenshot filename to an absolute local path or a temporary
     * URL (for remote disks like S3). Returns null if the file does not exist.
     */
    public static function screenshotPath(string $filename): ?string
    {
        $diskPath = "_instruckt/screenshots/{$filename}";
        $disk = self::screenshotDisk();

        if (! $disk->exists($diskPath)) {
            return null;
        }

        $diskName = config('instruckt.screenshot_disk', 'local');

        if ($diskName === 'local') {
            return $disk->path($diskPath);
        }

        return $disk->temporaryUrl($diskPath, now()->addMinutes(30));
    }

    // -------------------------------------------------------------------------
    // File-driver internals
    // -------------------------------------------------------------------------

    private static function filePath(): string
    {
        return storage_path('app/_instruckt/annotations.json');
    }

    private static function fileReadAll(): array
    {
        $path = self::filePath();

        if (! file_exists($path)) {
            return [];
        }

        $data = json_decode(file_get_contents($path), true);

        return is_array($data) ? $data : [];
    }

    private static function fileWriteAll(array $annotations): void
    {
        $path = self::filePath();
        $dir = dirname($path);

        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents(
            $path,
            json_encode(array_values($annotations), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n",
            LOCK_EX,
        );
    }

    // -------------------------------------------------------------------------
    // Database-driver internals
    // -------------------------------------------------------------------------

    private static function dbInsert(array $annotation): void
    {
        DB::table('instruckt_annotations')->insert([
            'id'            => $annotation['id'],
            'url'           => $annotation['url'],
            'x'             => $annotation['x'],
            'y'             => $annotation['y'],
            'comment'       => $annotation['comment'],
            'element'       => $annotation['element'],
            'element_path'  => $annotation['element_path'],
            'css_classes'   => $annotation['css_classes'],
            'nearby_text'   => $annotation['nearby_text'],
            'selected_text' => $annotation['selected_text'],
            'bounding_box'  => isset($annotation['bounding_box']) ? json_encode($annotation['bounding_box']) : null,
            'screenshot'    => $annotation['screenshot'],
            'intent'        => $annotation['intent'],
            'severity'      => $annotation['severity'],
            'status'        => $annotation['status'],
            'framework'     => isset($annotation['framework']) ? json_encode($annotation['framework']) : null,
            'thread'        => json_encode($annotation['thread'] ?? []),
            'resolved_by'   => $annotation['resolved_by'],
            'resolved_at'   => $annotation['resolved_at'],
            'created_at'    => now()->toDateTimeString(),
            'updated_at'    => now()->toDateTimeString(),
        ]);
    }

    private static function dbRowToArray(array $row): array
    {
        foreach (['bounding_box', 'framework', 'thread'] as $key) {
            if (isset($row[$key]) && is_string($row[$key])) {
                $row[$key] = json_decode($row[$key], true);
            }
        }

        foreach (['created_at', 'updated_at', 'resolved_at'] as $key) {
            if (! empty($row[$key])) {
                $row[$key] = Carbon::parse($row[$key])->toIso8601String();
            }
        }

        return $row;
    }
}
