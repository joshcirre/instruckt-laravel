<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Instruckt\Laravel\Store;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Mark an annotation as resolved. Optionally provide a summary of what was changed — it will be posted as an agent reply visible to the user.')]
final class ResolveTool extends Tool
{
    public function handle(Request $request): Response
    {
        $annotation = Store::updateAnnotation($request->get('annotation_id'), [
            'status' => 'resolved',
            'resolved_by' => 'agent',
            'resolved_at' => now()->toIso8601String(),
        ]);

        if ($summary = $request->get('summary')) {
            $annotation = Store::addThreadMessage($annotation['id'], 'agent', $summary);
        }

        return Response::text(json_encode([
            'ok' => true,
            'annotation' => $annotation,
        ], JSON_PRETTY_PRINT));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'annotation_id' => $schema->string()
                ->description('The annotation ID to resolve.')
                ->required(),
            'summary' => $schema->string()
                ->description('Optional summary of what was changed to address this feedback.'),
        ];
    }
}
