<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Instruckt\Laravel\Models\InstrucktSession;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Get a specific instruckt session with all its annotations. Returns element selectors, Livewire/Vue/Svelte component context, and thread messages.')]
final class GetSessionTool extends Tool
{
    public function handle(Request $request): Response
    {
        $session = InstrucktSession::query()->findOrFail($request->get('session_id'));

        return Response::text(json_encode([
            ...$session->toArray(),
            'annotations' => $session->annotations()->oldest()->get()->toArray(),
        ], JSON_PRETTY_PRINT));
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
