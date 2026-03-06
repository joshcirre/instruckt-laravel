<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Instruckt\Laravel\Store;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Get a specific instruckt session with all its annotations. Returns element selectors, Livewire/Vue/Svelte component context, and thread messages.')]
final class GetSessionTool extends Tool
{
    public function handle(Request $request): Response
    {
        $session = Store::getSessionOrFail($request->get('session_id'));
        $session['annotations'] = Store::getSessionAnnotations($session['id']);

        return Response::text(json_encode($session, JSON_PRETTY_PRINT));
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'session_id' => $schema->string()
                ->description('The session ID to retrieve.')
                ->required(),
        ];
    }
}
