<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Instruckt\Laravel\Models\InstrucktSession;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('List all instruckt annotation sessions for this application.')]
final class ListSessionsTool extends Tool
{
    public function handle(Request $request): Response
    {
        $sessions = InstrucktSession::query()
            ->latest()
            ->limit(50)
            ->get(['id', 'url', 'status', 'created_at', 'updated_at']);

        return Response::text(json_encode([
            'sessions' => $sessions->toArray(),
            'count' => $sessions->count(),
        ], JSON_PRETTY_PRINT));
    }

    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
