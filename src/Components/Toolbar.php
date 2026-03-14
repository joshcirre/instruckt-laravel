<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Components;

use Illuminate\View\Component;

final class Toolbar extends Component
{
    public string $scriptSrc;

    public string $endpoint;

    public string $adapters;

    public string $theme;

    public string $position;

    public string $colors;

    public string $keys;

    public string $tools;

    public function __construct(
        string $endpoint = '',
        /** @var array<string> $adapters */
        array $adapters = ['livewire', 'vue', 'svelte'],
        string $theme = 'auto',
        string $position = 'bottom-right',
        ?array $colors = null,
        ?array $keys = null,
        ?array $tools = null,
    ) {
        $this->endpoint = $endpoint ?: url(config('instruckt.route_prefix', 'instruckt'));
        $this->adapters = json_encode($adapters);
        $this->theme = $theme;
        $this->position = $position;
        $this->colors = json_encode($colors ?? config('instruckt.colors', []));
        $this->keys = json_encode($keys ?? config('instruckt.keys', []));
        $this->tools = json_encode($tools ?? config('instruckt.tools', []));
        $this->scriptSrc = $this->resolveScriptSrc();
    }

    private function resolveScriptSrc(): string
    {
        // 1. Explicit config override
        if ($cdn = config('instruckt.cdn_url')) {
            return $cdn;
        }

        // 2. Local node_modules (if npm installed)
        $nodeModule = base_path('node_modules/instruckt/dist/instruckt.iife.js');
        if (file_exists($nodeModule)) {
            $publicPath = public_path('vendor/instruckt/instruckt.iife.js');
            // If public path is a symlink (e.g. to local instruckt dist), don't overwrite
            if (! is_link($publicPath)) {
                if (! file_exists($publicPath) || filemtime($nodeModule) > filemtime($publicPath)) {
                    @mkdir(dirname($publicPath), 0755, true);
                    copy($nodeModule, $publicPath);
                }
            }

            return asset('vendor/instruckt/instruckt.iife.js');
        }

        // 3. Already published to public
        if (file_exists(public_path('vendor/instruckt/instruckt.iife.js'))) {
            return asset('vendor/instruckt/instruckt.iife.js');
        }

        // 4. CDN fallback — always works, uses the npm package version
        $version = config('instruckt.version', 'latest');

        return "https://unpkg.com/instruckt@{$version}/dist/instruckt.iife.js";
    }

    public function render(): \Illuminate\Contracts\View\View
    {
        return view('instruckt::components.toolbar');
    }
}
