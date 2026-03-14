<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Instruckt\Laravel\Store;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Mark an annotation as resolved after fixing the issue.')]
final class ResolveTool extends Tool
{
    public function handle(Request $request): Response
    {
        $annotation = Store::getAnnotation($request->get('annotation_id'));

        if (! $annotation) {
            return Response::text(json_encode([
                'ok' => false,
                'error' => 'Annotation not found.',
            ]));
        }

        $updated = Store::updateAnnotation($request->get('annotation_id'), [
            'status' => 'resolved',
            'resolved_by' => 'agent',
            'resolved_at' => now()->toIso8601String(),
        ]);

        return Response::text(json_encode([
            'ok' => true,
            'annotation' => $updated,
        ], JSON_PRETTY_PRINT));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'annotation_id' => $schema->string()
                ->description('The annotation ID to resolve.')
                ->required(),
        ];
    }
}
