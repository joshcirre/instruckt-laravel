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

    public function __construct(
        string $endpoint = '',
        /** @var array<string> $adapters */
        array $adapters = ['livewire', 'vue', 'svelte'],
        string $theme = 'auto',
        string $position = 'bottom-right',
    ) {
        $this->endpoint = $endpoint ?: url(config('instruckt.route_prefix', 'instruckt'));
        $this->adapters = json_encode($adapters);
        $this->theme = $theme;
        $this->position = $position;
        $this->scriptSrc = $this->resolveScriptSrc();
    }

    private function resolveScriptSrc(): string
    {
        if ($cdn = config('instruckt.cdn_url')) {
            return $cdn;
        }

        // Use published asset if it exists, otherwise fall back to package dist
        $published = public_path('vendor/instruckt/instruckt.iife.js');
        if (file_exists($published)) {
            return asset('vendor/instruckt/instruckt.iife.js');
        }

        // Package-relative dist (for local dev via path repository)
        return asset('vendor/instruckt/instruckt.iife.js');
    }

    public function render(): \Illuminate\Contracts\View\View
    {
        return view('instruckt::components.toolbar');
    }
}
