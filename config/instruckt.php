<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Enable instruckt
    |--------------------------------------------------------------------------
    | Set to false in production or use an environment variable to gate access.
    */
    /*
    | Defaults to true only in local environments. Set INSTRUCKT_ENABLED=false
    | to disable explicitly, or INSTRUCKT_ENABLED=true to enable on staging.
    */
    'enabled' => (bool) env('INSTRUCKT_ENABLED', env('APP_ENV') === 'local'),

    /*
    |--------------------------------------------------------------------------
    | Route prefix
    |--------------------------------------------------------------------------
    | All HTTP API routes will be registered under this prefix.
    */
    'route_prefix' => env('INSTRUCKT_ROUTE_PREFIX', 'instruckt'),

    /*
    |--------------------------------------------------------------------------
    | Middleware
    |--------------------------------------------------------------------------
    | Applied to all instruckt API routes. 'web' gives you session/CSRF.
    | Add 'auth' here if you want to gate annotations to logged-in users.
    */
    /*
    | Uses 'api' by default (no CSRF). Add 'auth' here to gate to logged-in users.
    */
    'middleware' => explode(',', env('INSTRUCKT_MIDDLEWARE', 'api')),

    /*
    |--------------------------------------------------------------------------
    | CDN URL
    |--------------------------------------------------------------------------
    | Where to load instruckt.iife.js from. By default uses the published
    | asset. Override to use a pinned CDN version.
    |
    | Example: 'https://cdn.jsdelivr.net/npm/instruckt@0.1.0/dist/instruckt.iife.js'
    */
    'cdn_url' => env('INSTRUCKT_CDN_URL', null),

    /*
    |--------------------------------------------------------------------------
    | Marker pin colors
    |--------------------------------------------------------------------------
    | Customize the colors of annotation marker pins on the page.
    | All values are CSS color strings. Leave empty for defaults.
    */
    'colors' => [
        // 'default'    => '#6366f1',  // indigo — standard annotations
        // 'screenshot' => '#22c55e',  // green — annotations with screenshots
        // 'dismissed'  => '#71717a',  // gray — dismissed annotations
    ],

    /*
    |--------------------------------------------------------------------------
    | Keyboard shortcuts
    |--------------------------------------------------------------------------
    | Customize the keyboard shortcuts. Values are single key characters.
    | Leave empty for defaults.
    */
    'keys' => [
        // 'annotate'   => 'a',  // toggle annotation mode
        // 'freeze'     => 'f',  // freeze page
        // 'screenshot' => 'c',  // region screenshot capture
        // 'clearPage'  => 'x',  // clear annotations on current page
    ],

    /*
    |--------------------------------------------------------------------------
    | Toolbar tool visibility
    |--------------------------------------------------------------------------
    | Show or hide built-in toolbar tools. Set to false to hide. Omit a key
    | or use true to show. Available: annotate, screenshot, freeze, copy,
    | clear_page, clear_all, minimize.
    */
    'tools' => [
        'annotate' => true,
        'screenshot' => true,
        'freeze' => true,
        'copy' => true,
        'clear_page' => true,
        'clear_all' => true,
        'minimize' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | MCP tool name prefix
    |--------------------------------------------------------------------------
    */
    'mcp_prefix' => 'instruckt',

];
