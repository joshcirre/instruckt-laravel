<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Instruckt\Laravel\Models\InstrucktSession;

final class SessionController
{
    public function index(): JsonResponse
    {
        $sessions = InstrucktSession::query()
            ->latest()
            ->limit(100)
            ->get();

        return response()->json($sessions);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate(['url' => 'required|string|max:2048']);

        $session = InstrucktSession::query()->create([
            'url' => $request->input('url'),
        ]);

        return response()->json($session, 201);
    }

    public function show(string $id): JsonResponse
    {
        $session = InstrucktSession::query()->findOrFail($id);

        return response()->json([
            ...$session->toArray(),
            'annotations' => $session->annotations()->oldest()->get(),
        ]);
    }

    public function events(string $id): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $session = InstrucktSession::query()->findOrFail($id);

        return response()->stream(function () use ($session) {
            // Hard 60-second timeout — EventSource auto-reconnects.
            // Each reconnect sends Last-Event-ID so we don't miss updates.
            $deadline = time() + 60;
            $lastChecked = now()->subSecond(); // catch any updates from just before connect

            while (time() < $deadline) {
                if (connection_aborted()) {
                    break;
                }

                $cutoff = $lastChecked;
                $lastChecked = now();

                // Emit any annotations updated since last check (new OR status-changed)
                $annotations = $session->annotations()
                    ->where('updated_at', '>=', $cutoff)
                    ->get();

                foreach ($annotations as $annotation) {
                    echo 'event: annotation.updated' . PHP_EOL;
                    echo 'id: ' . $annotation->id . PHP_EOL;
                    echo 'data: ' . $annotation->toJson() . PHP_EOL;
                    echo PHP_EOL;
                }

                if ($annotations->isNotEmpty()) {
                    ob_flush();
                    flush();
                }

                sleep(1);
            }

            // Signal client to reconnect
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
