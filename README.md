# instruckt-laravel

Laravel package for [instruckt](https://github.com/joshcirre/instruckt) — visual feedback for AI coding agents. Provides the backend API, MCP server, database migrations, and a Blade toolbar component.

Your users annotate elements in the browser. Your AI agent (Claude Code, Cursor, etc.) reads and responds to those annotations via MCP.

## Requirements

- PHP 8.2+
- Laravel 11 or 12
- [laravel/mcp](https://github.com/laravel/mcp) (for MCP tool integration)

## Install

```bash
composer require joshcirre/instruckt-laravel --dev
```

```bash
php artisan instruckt:install
```

This publishes the config, runs migrations, copies the JS assets, and automatically configures MCP for any detected AI agents (Claude Code, Cursor, Codex, OpenCode, GitHub Copilot).

## Setup

Add the toolbar component to your layout (typically before `</body>`):

```blade
<x-instruckt-toolbar />
```

That's it. The component loads the JS and initializes instruckt with sensible defaults.

### Connect Your AI Agent

The install command automatically detects your AI agent and configures MCP. If you need to do it manually, add to `.mcp.json` (Claude Code):

```json
{
  "mcpServers": {
    "instruckt": {
      "command": "php",
      "args": ["artisan", "mcp:serve", "instruckt"]
    }
  }
}
```

## MCP Tools

The package registers these MCP tools for your AI agent:

| Tool | Description |
|------|-------------|
| `instruckt.list_sessions` | List all feedback sessions |
| `instruckt.get_session` | Get a session with its annotations |
| `instruckt.get_pending` | Get pending annotations for a session |
| `instruckt.get_all_pending` | Get all pending annotations across sessions |
| `instruckt.acknowledge` | Mark an annotation as seen |
| `instruckt.resolve` | Resolve an annotation |
| `instruckt.dismiss` | Dismiss an annotation |
| `instruckt.reply` | Reply to an annotation thread |
| `instruckt.watch` | Watch for new annotations (SSE) |

## Configuration

Published to `config/instruckt.php`:

```php
return [
    // Only enabled in local env by default. Set INSTRUCKT_ENABLED=true for staging.
    'enabled' => (bool) env('INSTRUCKT_ENABLED', env('APP_ENV') === 'local'),

    // API route prefix
    'route_prefix' => env('INSTRUCKT_ROUTE_PREFIX', 'instruckt'),

    // Middleware applied to API routes (add 'auth' to gate access)
    'middleware' => explode(',', env('INSTRUCKT_MIDDLEWARE', 'api')),

    // Override JS source (e.g. pinned CDN version)
    'cdn_url' => env('INSTRUCKT_CDN_URL', null),
];
```

## Toolbar Component

The `<x-instruckt-toolbar />` component accepts optional attributes:

```blade
<x-instruckt-toolbar
    theme="dark"
    position="bottom-left"
    :adapters="['livewire', 'vue']"
/>
```

## How It Works

1. The Blade component loads `instruckt.iife.js` and initializes the annotation UI
2. Users click elements and leave feedback with intent (fix/change/question/approve) and severity
3. Annotations are persisted to your database via the API routes
4. Your AI agent connects via MCP and receives annotations as structured tool calls
5. The agent can reply, acknowledge, or resolve — changes sync back to the browser via SSE

## API Routes

All routes are registered under the configured prefix (default: `/instruckt`):

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/instruckt/sessions` | List sessions |
| POST | `/instruckt/sessions` | Create session |
| GET | `/instruckt/sessions/{id}` | Get session |
| GET | `/instruckt/sessions/{id}/events` | SSE event stream |
| POST | `/instruckt/sessions/{id}/annotations` | Create annotation |
| PATCH | `/instruckt/annotations/{id}` | Update annotation |
| POST | `/instruckt/annotations/{id}/reply` | Add thread reply |

## License

MIT
