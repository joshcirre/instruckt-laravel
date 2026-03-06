<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Instruckt\Laravel\Models\InstrucktAnnotation;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Mark an annotation as acknowledged — signals to the user that the agent has seen their feedback and is working on it.')]
final class AcknowledgeTool extends Tool
{
    public function handle(Request $request): Response
    {
        $annotation = InstrucktAnnotation::query()->findOrFail($request->get('annotation_id'));
        $annotation->update(['status' => 'acknowledged']);

        return Response::text(json_encode([
            'ok' => true,
            'annotation' => $annotation->fresh()->toArray(),
        ], JSON_PRETTY_PRINT));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'annotation_id' => $schema->string()
                ->description('The annotation ID to acknowledge.')
                ->required(),
        ];
    }
}
