<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Mcp;

use Instruckt\Laravel\Mcp\Tools\AcknowledgeTool;
use Instruckt\Laravel\Mcp\Tools\DismissTool;
use Instruckt\Laravel\Mcp\Tools\GetAllPendingTool;
use Instruckt\Laravel\Mcp\Tools\GetPendingTool;
use Instruckt\Laravel\Mcp\Tools\GetSessionTool;
use Instruckt\Laravel\Mcp\Tools\ListSessionsTool;
use Instruckt\Laravel\Mcp\Tools\ReplyTool;
use Instruckt\Laravel\Mcp\Tools\ResolveTool;
use Instruckt\Laravel\Mcp\Tools\WatchAnnotationsTool;
use Laravel\Mcp\Server;

final class InstrucktServer extends Server
{
    /**
     * Tools registered with this MCP server.
     *
     * @var array<int, class-string<\Laravel\Mcp\Server\Tool>>
     */
    protected array $tools = [
        ListSessionsTool::class,
        GetSessionTool::class,
        GetPendingTool::class,
        GetAllPendingTool::class,
        AcknowledgeTool::class,
        ResolveTool::class,
        DismissTool::class,
        ReplyTool::class,
        WatchAnnotationsTool::class,
    ];
}
