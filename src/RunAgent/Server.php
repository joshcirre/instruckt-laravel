<?php

declare(strict_types=1);

namespace Instruckt\Laravel\RunAgent;

/**
 * Listens for HTTP POSTs and runs the configured CLI agent with the body as prompt.
 * Used when the Laravel app runs in Docker and cannot run the agent directly.
 */
final class Server
{
    private const ACCEPT_TIMEOUT = 3600;

    public function __construct(
        private readonly string $agentBinary,
        private readonly int $port,
        private readonly mixed $output = STDERR,
    ) {}

    public function run(): never
    {
        $server = @stream_socket_server("tcp://0.0.0.0:{$this->port}", $errNo, $errStr);
        if ($server === false) {
            $this->line("Cannot listen on port {$this->port}: {$errStr}");
            exit(1);
        }

        $this->line("Instruckt run-agent server on 0.0.0.0:{$this->port} (agent: {$this->agentBinary})");

        while (true) {
            $conn = @stream_socket_accept($server, self::ACCEPT_TIMEOUT);
            if ($conn === false) {
                continue;
            }
            $this->debug('Connection accepted');
            $this->handle($conn);
            fclose($conn);
        }
    }

    private function handle(mixed $conn): void
    {
        $request = '';
        while ($line = fgets($conn)) {
            $request .= $line;
            if ($line === "\r\n" || $line === "\n") {
                break;
            }
        }

        $contentLength = 0;
        if (preg_match('/Content-Length:\s*(\d+)/i', $request, $m)) {
            $contentLength = (int) $m[1];
        }
        $body = $contentLength > 0 ? stream_get_contents($conn, $contentLength) : '';
        $method = preg_match('/^([A-Z]+)\s/', $request, $m) ? $m[1] : '';
        $path = preg_match('/^[A-Z]+\s+(\S+)/', $request, $m) ? $m[1] : '?';
        $this->debug("%s %s | Content-Length: %d | body: %d bytes", $method, $path, $contentLength, strlen($body));

        if ($method !== 'POST' || $body === '') {
            $this->debug('Rejected (method=%s, body_empty=%s)', $method, $body === '' ? 'yes' : 'no');
            $this->sendResponse($conn, 400, ['accepted' => false, 'message' => 'POST with body required']);
            return;
        }

        $this->runAgent($body);
        $this->sendResponse($conn, 200, ['accepted' => true]);
        $this->debug('Sent 200 OK');
    }

    private function runAgent(string $markdown): void
    {
        if (PHP_OS_FAMILY === 'Windows') {
            $cmd = $this->agentBinary . ' -f --model auto -p ' . escapeshellarg($markdown);
            $this->debug('CLI: %s', $cmd);
            exec($cmd);
            return;
        }

        $tmp = tempnam(sys_get_temp_dir(), 'instruckt.');
        file_put_contents($tmp, $markdown);
        $esc = str_replace("'", "'\\''", $tmp);
        $cmd = sprintf('(%s -f --model auto -p "$(cat %s)") &', $this->agentBinary, $esc);
        $this->debug('CLI: %s', $cmd);
        exec($cmd);
    }

    private function debug(string $format, mixed ...$args): void
    {
        $message = $args !== [] ? sprintf($format, ...$args) : $format;
        $this->line('[' . date('Y-m-d H:i:s') . '] ' . $message);
    }

    private function sendResponse(mixed $conn, int $status, array $body): void
    {
        $statusLine = $status === 200 ? '200 OK' : '400 Bad Request';
        $response = "HTTP/1.1 {$statusLine}\r\nConnection: close\r\nContent-Type: application/json\r\n\r\n" . json_encode($body);
        fwrite($conn, $response);
    }

    private function line(string $message): void
    {
        if (is_resource($this->output)) {
            fwrite($this->output, $message . "\n");
        }
    }
}
