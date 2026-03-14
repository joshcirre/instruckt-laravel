<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Symfony\Component\HttpFoundation\Response;

/**
 * Tracks all Blade views rendered during a request and injects a
 * <script type="application/json" id="instruckt-views"> tag into
 * the HTML response. The frontend Blade adapter reads this to map
 * DOM elements back to their source templates.
 *
 * Only active when instruckt is enabled (typically local dev).
 */
final class TrackBladeViews
{
    /** @var list<array{name: string, file: string}> */
    private array $views = [];

    public function handle(Request $request, Closure $next): Response
    {
        if (! config('instruckt.enabled', false)) {
            return $next($request);
        }

        // Skip non-HTML requests
        if ($request->expectsJson() || $request->is(config('instruckt.route_prefix', 'instruckt') . '/*')) {
            return $next($request);
        }

        $this->trackViews();

        $response = $next($request);

        return $this->injectViewData($response);
    }

    private function trackViews(): void
    {
        $basePath = base_path() . '/';

        Event::listen('composing:*', function (string $event, array $data) use ($basePath) {
            /** @var \Illuminate\View\View $view */
            $view = $data[0];
            $path = $view->getPath();

            // Convert to relative path
            if (str_starts_with($path, $basePath)) {
                $path = substr($path, strlen($basePath));
            }

            // Skip vendor views and instruckt's own views
            if (str_starts_with($path, 'vendor/') || str_contains($path, 'instruckt')) {
                return;
            }

            $this->views[] = [
                'name' => $view->name(),
                'file' => $path,
            ];
        });
    }

    private function injectViewData(Response $response): Response
    {
        if (empty($this->views)) {
            return $response;
        }

        $content = $response->getContent();

        // Only inject into HTML responses
        if (! $content || ! str_contains($content, '</body>')) {
            return $response;
        }

        // Deduplicate (same view may render multiple times)
        $unique = [];
        $seen = [];
        foreach ($this->views as $view) {
            $key = $view['name'];
            if (! isset($seen[$key])) {
                $seen[$key] = true;
                $unique[] = $view;
            }
        }

        $json = json_encode($unique, JSON_UNESCAPED_SLASHES | JSON_HEX_TAG);
        $script = '<script type="application/json" id="instruckt-views">' . $json . '</script>';

        $response->setContent(str_replace('</body>', $script . "\n</body>", $content));

        return $response;
    }
}
