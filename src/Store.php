<?php

declare(strict_types=1);

namespace Instruckt\Laravel;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

final class Store
{
    private const PREFIX = 'instruckt:';
    private const SESSIONS_KEY = self::PREFIX . 'sessions';
    private const TTL = 86400; // 24 hours — dev data is ephemeral

    // ── Sessions ─────────────────────────────────────────────────

    public static function createSession(string $url): array
    {
        $session = [
            'id' => (string) Str::ulid(),
            'url' => $url,
            'status' => 'active',
            'created_at' => now()->toIso8601String(),
            'updated_at' => now()->toIso8601String(),
        ];

        $sessions = self::allSessionIds();
        $sessions[] = $session['id'];
        Cache::put(self::SESSIONS_KEY, $sessions, self::TTL);
        Cache::put(self::sessionKey($session['id']), $session, self::TTL);

        return $session;
    }

    public static function getSession(string $id): ?array
    {
        return Cache::get(self::sessionKey($id));
    }

    public static function getSessionOrFail(string $id): array
    {
        $session = self::getSession($id);

        if (! $session) {
            abort(404, 'Session not found.');
        }

        return $session;
    }

    public static function listSessions(): array
    {
        $ids = self::allSessionIds();
        $sessions = [];

        foreach (array_reverse($ids) as $id) {
            $session = Cache::get(self::sessionKey($id));

            if ($session) {
                $sessions[] = $session;
            }
        }

        return array_slice($sessions, 0, 50);
    }

    // ── Annotations ──────────────────────────────────────────────

    public static function createAnnotation(string $sessionId, array $data): array
    {
        self::getSessionOrFail($sessionId);

        $annotation = [
            'id' => (string) Str::ulid(),
            'session_id' => $sessionId,
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
            'url' => $data['url'] ?? '',
            'resolved_by' => null,
            'resolved_at' => null,
            'created_at' => now()->toIso8601String(),
            'updated_at' => now()->toIso8601String(),
        ];

        // Store the annotation
        Cache::put(self::annotationKey($annotation['id']), $annotation, self::TTL);

        // Add to session's annotation index
        $index = Cache::get(self::sessionAnnotationsKey($sessionId), []);
        $index[] = $annotation['id'];
        Cache::put(self::sessionAnnotationsKey($sessionId), $index, self::TTL);

        // Add to global annotation index
        $global = Cache::get(self::PREFIX . 'all_annotations', []);
        $global[] = $annotation['id'];
        Cache::put(self::PREFIX . 'all_annotations', $global, self::TTL);

        return $annotation;
    }

    public static function getAnnotation(string $id): ?array
    {
        return Cache::get(self::annotationKey($id));
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
        $annotation = self::getAnnotationOrFail($id);

        foreach ($data as $key => $value) {
            $annotation[$key] = $value;
        }

        $annotation['updated_at'] = now()->toIso8601String();

        Cache::put(self::annotationKey($id), $annotation, self::TTL);

        return $annotation;
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

    public static function getSessionAnnotations(string $sessionId): array
    {
        $index = Cache::get(self::sessionAnnotationsKey($sessionId), []);
        $annotations = [];

        foreach ($index as $id) {
            $annotation = Cache::get(self::annotationKey($id));

            if ($annotation) {
                $annotations[] = $annotation;
            }
        }

        // Sort oldest first
        usort($annotations, fn ($a, $b) => $a['created_at'] <=> $b['created_at']);

        return $annotations;
    }

    public static function getPendingAnnotations(?string $sessionId = null): array
    {
        if ($sessionId) {
            $annotations = self::getSessionAnnotations($sessionId);
        } else {
            $ids = Cache::get(self::PREFIX . 'all_annotations', []);
            $annotations = [];

            foreach ($ids as $id) {
                $annotation = Cache::get(self::annotationKey($id));

                if ($annotation) {
                    $annotations[] = $annotation;
                }
            }
        }

        $pending = array_filter($annotations, fn ($a) => in_array($a['status'], ['pending', 'acknowledged'], true));

        usort($pending, fn ($a, $b) => $a['created_at'] <=> $b['created_at']);

        return array_values($pending);
    }

    public static function getRecentlyUpdatedAnnotations(string $sessionId, string $since): array
    {
        $annotations = self::getSessionAnnotations($sessionId);

        return array_values(array_filter($annotations, fn ($a) => $a['updated_at'] > $since));
    }

    // ── Keys ─────────────────────────────────────────────────────

    private static function sessionKey(string $id): string
    {
        return self::PREFIX . "session:{$id}";
    }

    private static function annotationKey(string $id): string
    {
        return self::PREFIX . "annotation:{$id}";
    }

    private static function sessionAnnotationsKey(string $sessionId): string
    {
        return self::PREFIX . "session:{$sessionId}:annotations";
    }

    private static function allSessionIds(): array
    {
        return Cache::get(self::SESSIONS_KEY, []);
    }
}
