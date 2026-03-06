<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Instruckt\Laravel\Models\InstrucktAnnotation;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description(
    'Block and wait for new annotations to arrive, then return them as a batch. '
    . 'Use in an agent loop to automatically process user feedback. '
    . 'Returns immediately if pending annotations already exist; otherwise polls until timeout.'
)]
final class WatchAnnotationsTool extends Tool
{
    public function handle(Request $request): Response
    {
        $sessionId = $request->get('session_id');
        $timeout = min((int) ($request->get('timeout_seconds') ?? 30), 120);
        $batchWindow = min((int) ($request->get('batch_window_seconds') ?? 3), 10);

        $deadline = time() + $timeout;
        $batchDeadline = null;

        while (true) {
            $query = InstrucktAnnotation::query()
                ->where('status', 'pending')
                ->oldest();

            if ($sessionId) {
                $query->where('session_id', $sessionId);
            }

            $annotations = $query->get();

            if ($annotations->isNotEmpty()) {
                if ($batchDeadline === null) {
                    $batchDeadline = time() + $batchWindow;
                }

                if (time() >= $batchDeadline) {
                    return Response::text(json_encode([
                        'count' => $annotations->count(),
                        'annotations' => $annotations->toArray(),
                        'timed_out' => false,
                    ], JSON_PRETTY_PRINT));
                }
            }

            if (time() >= $deadline) {
                return Response::text(json_encode([
                    'count' => $annotations->count(),
                    'annotations' => $annotations->toArray(),
                    'timed_out' => $annotations->isEmpty(),
                    'message' => $annotations->isEmpty()
                        ? 'No new annotations within timeout. Call again to continue watching.'
                        : null,
                ], JSON_PRETTY_PRINT));
            }

            sleep(1);
        }
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'session_id' => $schema->string()
                ->description('Optional session ID to watch. Omit to watch all sessions.'),
            'timeout_seconds' => $schema->integer()
                ->description('How long to wait for annotations (default: 30, max: 120).'),
            'batch_window_seconds' => $schema->integer()
                ->description('After first annotation, wait this many more seconds to batch (default: 3).'),
        ];
    }
}
