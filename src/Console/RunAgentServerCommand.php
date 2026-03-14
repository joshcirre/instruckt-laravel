<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Console;

use Instruckt\Laravel\RunAgent\Server;
use Illuminate\Console\Command;

/**
 * Run the instruckt agent listener so the toolbar Run button can trigger the CLI
 * when the app runs in Docker. Start this on your host (same machine as cursor-agent).
 *
 * @see https://cursor.com/docs/cli/overview#non-interactive-mode
 */
final class RunAgentServerCommand extends Command
{
    protected $signature = 'instruckt:run-agent-server
                            {--port=31337 : Port to listen on}';

    protected $description = 'Run the instruckt agent listener (for Run button when using Docker)';

    public function handle(): int
    {
        $port = (int) $this->option('port');
        $agentBinary = config('instruckt.run.agent_binary', 'cursor-agent');

        $server = new Server($agentBinary, $port, STDERR);
        $server->run();

        return self::SUCCESS;
    }
}
