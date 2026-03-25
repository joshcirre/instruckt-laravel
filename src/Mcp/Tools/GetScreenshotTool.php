<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Instruckt\Laravel\Store;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Get the screenshot image attached to an annotation. Returns the base64-encoded PNG image data.')]
final class GetScreenshotTool extends Tool
{
    public function handle(Request $request): Response
    {
        $annotation = Store::getAnnotation($request->get('annotation_id'));

        if (! $annotation) {
            return Response::error('Annotation not found.');
        }

        $screenshot = $annotation['screenshot'] ?? null;

        if (! $screenshot) {
            return Response::error('This annotation has no screenshot. Do not attempt to locate the image via other means.');
        }

        $path = storage_path("app/_instruckt/{$screenshot}");

        if (! file_exists($path)) {
            return Response::error("Screenshot file not found on disk: {$screenshot}");
        }

        $data = base64_encode(file_get_contents($path));
        $mimeType = str_ends_with($screenshot, '.svg') ? 'image/svg+xml' : 'image/png';

        return Response::image($data, $mimeType);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'annotation_id' => $schema->string()
                ->description('The annotation ID to get the screenshot for.')
                ->required(),
        ];
    }
}
