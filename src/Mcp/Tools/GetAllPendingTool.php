<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Instruckt\Laravel\Store;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Get all pending annotations — unresolved user feedback from the browser.')]
final class GetAllPendingTool extends Tool
{
    public function handle(Request $request): Response
    {
        try {
            $annotations = Store::getPendingAnnotations();

            // Replace screenshot file paths with a boolean flag — agents should
            // call get_screenshot to retrieve the actual image data.
            foreach ($annotations as &$a) {
                $a['has_screenshot'] = ! empty($a['screenshot']);
                unset($a['screenshot']);
            }
            unset($a);

            return Response::text(json_encode([
                'ok' => true,
                'count' => count($annotations),
                'annotations' => $annotations,
            ], JSON_PRETTY_PRINT));
        } catch (\Throwable $e) {
            report($e);

            $errorMessage = 'Failed to get pending annotations.';
            if (config('app.debug')) {
                $errorMessage .= " Error: {$e->getMessage()}";
            }

            return Response::text(json_encode([
                'ok' => false,
                'error' => $errorMessage,
            ]));
        }
    }

    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
