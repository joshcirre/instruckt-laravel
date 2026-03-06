<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Instruckt\Laravel\Store;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Dismiss an annotation with a reason. Use when feedback is not actionable or out of scope. The reason is posted as an agent reply visible to the user.')]
final class DismissTool extends Tool
{
    public function handle(Request $request): Response
    {
        $reason = $request->get('reason');

        if (empty($reason)) {
            return Response::text(json_encode(['ok' => false, 'error' => 'reason is required'], JSON_PRETTY_PRINT));
        }

        $annotation = Store::updateAnnotation($request->get('annotation_id'), [
            'status' => 'dismissed',
            'resolved_by' => 'agent',
            'resolved_at' => now()->toIso8601String(),
        ]);

        $annotation = Store::addThreadMessage($annotation['id'], 'agent', $reason);

        return Response::text(json_encode([
            'ok' => true,
            'annotation' => $annotation,
        ], JSON_PRETTY_PRINT));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'annotation_id' => $schema->string()
                ->description('The annotation ID to dismiss.')
                ->required(),
            'reason' => $schema->string()
                ->description('Explanation of why this feedback is being dismissed.')
                ->required(),
        ];
    }
}
