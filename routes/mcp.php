<?php

declare(strict_types=1);

use Instruckt\Laravel\Mcp\InstrucktServer;
use Laravel\Mcp\Facades\Mcp;

/*
|--------------------------------------------------------------------------
| instruckt MCP Server
|--------------------------------------------------------------------------
|
| Registers instruckt as both a local (stdio) and web (HTTP/SSE) MCP server.
|
| Local (stdio) — Claude Code connects via artisan command:
|   .mcp.json: { "instruckt": { "command": "php", "args": ["artisan", "mcp:serve", "instruckt"] } }
|
| Web (HTTP/SSE) — Claude Code connects via URL:
|   .mcp.json: { "instruckt": { "url": "http://localhost:8000/instruckt/mcp" } }
|
*/

if (config('instruckt.enabled', true)) {
    Mcp::local('instruckt', InstrucktServer::class);
    Mcp::web('/instruckt/mcp', InstrucktServer::class)
        ->middleware(config('instruckt.middleware', ['web']));
}
