<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Instruckt\Laravel\Models\InstrucktAnnotation;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Add a reply to an annotation thread. Use to ask clarifying questions or provide status updates without resolving or dismissing.')]
final class ReplyTool extends Tool
{
    public function handle(Request $request): Response
    {
        $annotation = InstrucktAnnotation::query()->findOrFail($request->get('annotation_id'));
        $annotation->addThreadMessage('agent', $request->get('content'));

        return Response::text(json_encode([
            'ok' => true,
            'annotation' => $annotation->fresh()->toArray(),
        ], JSON_PRETTY_PRINT));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'annotation_id' => $schema->string()
                ->description('The annotation ID to reply to.')
                ->required(),
            'content' => $schema->string()
                ->description('The reply message content.')
                ->required(),
        ];
    }
}
