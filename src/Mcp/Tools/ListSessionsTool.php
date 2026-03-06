<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Instruckt\Laravel\Store;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('List all instruckt annotation sessions for this application.')]
final class ListSessionsTool extends Tool
{
    public function handle(Request $request): Response
    {
        $sessions = Store::listSessions();

        return Response::text(json_encode([
            'sessions' => $sessions,
            'count' => count($sessions),
        ], JSON_PRETTY_PRINT));
    }

    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
