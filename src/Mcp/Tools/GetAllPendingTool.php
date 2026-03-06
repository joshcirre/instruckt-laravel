<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Instruckt\Laravel\Store;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Get all pending annotations across every session. Use for a global view of unresolved user feedback.')]
final class GetAllPendingTool extends Tool
{
    public function handle(Request $request): Response
    {
        $annotations = Store::getPendingAnnotations();

        return Response::text(json_encode([
            'count' => count($annotations),
            'annotations' => $annotations,
        ], JSON_PRETTY_PRINT));
    }

    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
