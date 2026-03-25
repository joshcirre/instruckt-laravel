<?php

declare(strict_types=1);

use Instruckt\Laravel\Http\Middleware\ValidateMcpToken;
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
|   .mcp.json: { "instruckt": { "command": "php", "args": ["artisan", "mcp:start", "instruckt"] } }
|
| Web (HTTP/SSE) — Claude Code connects via URL (set INSTRUCKT_MCP_TOKEN for auth):
|   .mcp.json: {
|     "instruckt": {
|       "url": "https://your-app.com/instruckt/mcp",
|       "headers": { "Authorization": "Bearer your-secret-token" }
|     }
|   }
|
*/

if (config('instruckt.enabled', true)) {
    Mcp::local('instruckt', InstrucktServer::class);

    $mcpMiddleware = array_merge(
        config('instruckt.mcp_middleware', ['web']),
        [ValidateMcpToken::class],
    );

    Mcp::web('/instruckt/mcp', InstrucktServer::class)
        ->middleware($mcpMiddleware);
}
