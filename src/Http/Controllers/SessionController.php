<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Instruckt\Laravel\Store;

final class SessionController
{
    public function index(): JsonResponse
    {
        return response()->json(Store::listSessions());
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate(['url' => 'required|string|max:2048']);

        $session = Store::createSession($request->input('url'));

        return response()->json($session, 201);
    }

    public function show(string $id): JsonResponse
    {
        $session = Store::getSessionOrFail($id);
        $session['annotations'] = Store::getSessionAnnotations($id);

        return response()->json($session);
    }

    public function events(string $id): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        Store::getSessionOrFail($id);

        return response()->stream(function () use ($id) {
            $deadline = time() + 60;
            $lastChecked = now()->subSecond()->toIso8601String();

            while (time() < $deadline) {
                if (connection_aborted()) {
                    break;
                }

                $cutoff = $lastChecked;
                $lastChecked = now()->toIso8601String();

                $updated = Store::getRecentlyUpdatedAnnotations($id, $cutoff);

                foreach ($updated as $annotation) {
                    echo 'event: annotation.updated' . PHP_EOL;
                    echo 'id: ' . $annotation['id'] . PHP_EOL;
                    echo 'data: ' . json_encode($annotation) . PHP_EOL;
                    echo PHP_EOL;
                }

                if (! empty($updated)) {
                    ob_flush();
                    flush();
                }

                sleep(1);
            }

            echo ': reconnect' . PHP_EOL . PHP_EOL;
            ob_flush();
            flush();
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache, no-store',
            'X-Accel-Buffering' => 'no',
            'Connection' => 'keep-alive',
        ]);
    }
}
