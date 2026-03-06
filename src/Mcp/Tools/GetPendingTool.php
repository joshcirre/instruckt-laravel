<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Instruckt\Laravel\Models\InstrucktSession;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Get all pending (unacknowledged) annotations for a specific session.')]
final class GetPendingTool extends Tool
{
    public function handle(Request $request): Response
    {
        $session = InstrucktSession::query()->findOrFail($request->get('session_id'));
        $annotations = $session->pendingAnnotations()->get();

        return Response::text(json_encode([
            'session_id' => $session->id,
            'count' => $annotations->count(),
            'annotations' => $annotations->toArray(),
        ], JSON_PRETTY_PRINT));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'session_id' => $schema->string()
                ->description('The session ID to check for pending annotations.')
                ->required(),
        ];
    }
}
