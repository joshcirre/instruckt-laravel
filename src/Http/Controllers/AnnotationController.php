<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Instruckt\Laravel\SourceResolver;
use Instruckt\Laravel\Store;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\Process\Process;
use Throwable;

final class AnnotationController
{
    public function index(): JsonResponse
    {
        return response()->json(Store::allAnnotations());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'x' => 'required|numeric',
            'y' => 'required|numeric',
            'comment' => 'required|string|max:2000',
            'element' => 'required|string|max:255',
            'element_path' => 'nullable|string|max:2048',
            'css_classes' => 'nullable|string',
            'nearby_text' => 'nullable|string|max:500',
            'selected_text' => 'nullable|string|max:500',
            'bounding_box' => 'nullable|array',
            'screenshot' => 'nullable|string',
            'intent' => 'sometimes|string|in:fix,change,question,approve',
            'severity' => 'sometimes|string|in:blocking,important,suggestion',
            'framework' => 'nullable|array',
            'url' => 'required|string|max:2048',
        ]);

        $annotation = Store::createAnnotation($data);

        return response()->json($annotation, 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'status' => 'sometimes|string|in:pending,resolved,dismissed',
            'comment' => 'sometimes|string|max:2000',
        ]);

        if (isset($data['status']) && in_array($data['status'], ['resolved', 'dismissed'], true)) {
            $data['resolved_at'] = now()->toIso8601String();
            $data['resolved_by'] = 'human';
        }

        $annotation = Store::updateAnnotation($id, $data);

        if (! $annotation) {
            abort(404, 'Annotation not found.');
        }

        return response()->json($annotation);
    }

    /**
     * Resolve a component name to its source file path.
     *
     * POST /instruckt/resolve-source
     * { "framework": "livewire", "component": "pages::dashboard" }
     */
    public function resolveSource(Request $request): JsonResponse
    {
        $data = $request->validate([
            'framework' => 'required|string|in:livewire,blade,vue,svelte,react',
            'component' => 'required|string|max:255',
        ]);

        $result = SourceResolver::enrich([
            'framework' => $data['framework'],
            'component' => $data['component'],
        ]);

        return response()->json($result);
    }

    public function screenshot(string $filename): BinaryFileResponse
    {
        $path = storage_path("app/_instruckt/screenshots/{$filename}");

        abort_unless(file_exists($path), 404);

        $contentType = str_ends_with($filename, '.svg') ? 'image/svg+xml' : 'image/png';

        return response()->file($path, ['Content-Type' => $contentType]);
    }

    public function run(Request $request): JsonResponse
    {
        if (! config('instruckt.run.enabled', false)) {
            return response()->json(['message' => 'Run is disabled.'], 403);
        }

        $maxLen = max(1000, (int) config('instruckt.run.max_markdown_length', 50000));
        $data = $request->validate([
            'markdown' => ['required', 'string', 'max:'.$maxLen],
            'annotation_ids' => ['sometimes', 'array', 'max:500'],
            'annotation_ids.*' => ['string', 'max:64'],
        ]);
        $markdown = $data['markdown'];
        $annotationIds = array_values(array_unique(array_filter($data['annotation_ids'] ?? [])));

        // If frontend didn't send IDs (e.g. old bundle), we'll resolve all pending after run
        if ($annotationIds !== []) {
            Log::debug('instruckt run: received annotation_ids', ['count' => count($annotationIds), 'ids' => $annotationIds]);
        }

        $hostUrl = rtrim((string) config('instruckt.run.host_runner_url', ''), '/');
        if ($hostUrl !== '') {
            return $this->runViaHost($hostUrl, $markdown, $annotationIds);
        }

        $command = trim((string) config('instruckt.run.command', ''));
        if ($command === '') {
            return response()->json([
                'message' => 'Configure run.command (e.g. cursor-agent -f --model auto -p "$(cat)") or run.host_runner_url when using Docker.',
            ], 422);
        }

        $cwd = (string) config('instruckt.run.cwd', base_path());
        if ($cwd === '' || ! is_dir($cwd)) {
            return response()->json(['message' => 'run.cwd is invalid.'], 422);
        }

        $timeout = (int) config('instruckt.run.timeout', 120);
        $timeout = $timeout > 0 ? $timeout : null;

        try {
            $process = Process::fromShellCommandline($command, $cwd, null, $markdown, $timeout);
            $process->run();
        } catch (Throwable $e) {
            return response()->json(['message' => 'Run failed.', 'error' => $e->getMessage()], 500);
        }

        $idsToResolve = $annotationIds !== [] ? $annotationIds : $this->pendingAnnotationIds();
        $resolvedIds = $this->markAnnotationsResolved($idsToResolve);
        Log::debug('instruckt run: marked resolved', ['resolved_count' => count($resolvedIds), 'resolved_ids' => $resolvedIds]);

        return response()->json([
            'accepted' => true,
            'exit_code' => $process->getExitCode(),
            'stdout' => $process->getOutput(),
            'stderr' => $process->getErrorOutput(),
            'resolved_ids' => $resolvedIds,
        ], 200);
    }

    private function runViaHost(string $url, string $markdown, array $annotationIds): JsonResponse
    {
        $timeout = max(5, (int) config('instruckt.run.timeout', 120));

        try {
            $response = Http::timeout($timeout)
                ->withBody($markdown, 'text/plain')
                ->post($url);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Host runner unreachable.',
                'error' => $e->getMessage(),
            ], 502);
        }

        $ok = $response->successful();
        $body = $response->json() ?? ['message' => $response->body()];
        if ($ok) {
            $idsToResolve = $annotationIds !== [] ? $annotationIds : $this->pendingAnnotationIds();
            $body['resolved_ids'] = $this->markAnnotationsResolved($idsToResolve);
            Log::debug('instruckt run (via host): marked resolved', ['resolved_count' => count($body['resolved_ids'])]);
        }

        return response()->json(array_merge(['accepted' => $ok], $body), $ok ? 200 : 502);
    }

    /** @return list<string> IDs of all pending annotations in the store */
    private function pendingAnnotationIds(): array
    {
        $pending = Store::getPendingAnnotations();
        return array_map(fn (array $a) => $a['id'], $pending);
    }

    /**
     * Mark the given annotations as resolved (so MCP and UI see the update).
     *
     * @return list<string> IDs that were actually updated
     */
    private function markAnnotationsResolved(array $ids): array
    {
        $resolved = [];
        $now = now()->toIso8601String();
        foreach ($ids as $id) {
            if (Store::getAnnotation($id) === null) {
                continue;
            }
            Store::updateAnnotation($id, [
                'status' => 'resolved',
                'resolved_at' => $now,
                'resolved_by' => 'human',
            ]);
            $resolved[] = $id;
        }
        return $resolved;
    }
}
