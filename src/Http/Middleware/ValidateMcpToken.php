<?php

declare(strict_types=1);

namespace Instruckt\Laravel\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class ValidateMcpToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = config('instruckt.mcp_token');

        if (! $token) {
            return $next($request);
        }

        $header = $request->header('Authorization', '');
        $provided = str_starts_with($header, 'Bearer ') ? substr($header, 7) : null;

        if (! $provided || ! hash_equals($token, $provided)) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        return $next($request);
    }
}
