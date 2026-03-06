<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Instruckt\Laravel\Store;

final class AnnotationController
{
    public function store(Request $request, string $sessionId): JsonResponse
    {
        $data = $request->validate([
            'x' => 'required|numeric',
            'y' => 'required|numeric',
            'comment' => 'required|string|max:2000',
            'element' => 'required|string|max:255',
            'element_path' => 'required|string|max:2048',
            'css_classes' => 'nullable|string',
            'nearby_text' => 'nullable|string|max:500',
            'selected_text' => 'nullable|string|max:500',
            'bounding_box' => 'nullable|array',
            'intent' => 'sometimes|string|in:fix,change,question,approve',
            'severity' => 'sometimes|string|in:blocking,important,suggestion',
            'framework' => 'nullable|array',
            'url' => 'required|string|max:2048',
        ]);

        $annotation = Store::createAnnotation($sessionId, $data);

        return response()->json($annotation, 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'status' => 'sometimes|string|in:pending,acknowledged,resolved,dismissed',
            'comment' => 'sometimes|string|max:2000',
            'intent' => 'sometimes|string|in:fix,change,question,approve',
            'severity' => 'sometimes|string|in:blocking,important,suggestion',
            'resolved_by' => 'sometimes|string|in:human,agent',
        ]);

        if (isset($data['status']) && in_array($data['status'], ['resolved', 'dismissed'], true)) {
            $data['resolved_at'] = now()->toIso8601String();
            $data['resolved_by'] = $data['resolved_by'] ?? 'agent';
        }

        $annotation = Store::updateAnnotation($id, $data);

        return response()->json($annotation);
    }

    public function reply(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'role' => 'required|string|in:human,agent',
            'content' => 'required|string|max:2000',
        ]);

        $annotation = Store::addThreadMessage(
            $id,
            $request->input('role'),
            $request->input('content'),
        );

        return response()->json($annotation);
    }
}
