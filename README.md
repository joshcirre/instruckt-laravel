# instruckt-laravel

Laravel package for [instruckt](https://github.com/joshcirre/instruckt) — visual feedback for AI coding agents. Provides the backend API, MCP tools, JSON file storage, and a Blade toolbar component.

Users annotate elements in the browser, annotations are copied as structured markdown, and your AI agent can also read them via MCP.

## Requirements

- PHP 8.2+
- Laravel 11 or 12
- [laravel/mcp](https://github.com/laravel/mcp) (optional, for MCP tool integration)

## Install

```bash
composer require joshcirre/instruckt-laravel --dev
```

```bash
php artisan instruckt:install
```

This publishes the config, copies the JS assets, and automatically configures MCP for any detected AI agents (Claude Code, Cursor, Codex, OpenCode, GitHub Copilot).

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
      "args": ["artisan", "mcp:start", "instruckt"]
    }
  }
}
```

## Storage

Annotations are stored in `_instruckt/annotations.json` at your project root. No database migrations needed. Add `_instruckt/` to your `.gitignore`.

## MCP Tools

The package registers these MCP tools for your AI agent:

| Tool | Description |
|------|-------------|
| `instruckt.get_all_pending` | Get all pending annotations |
| `instruckt.acknowledge` | Mark an annotation as seen |
| `instruckt.resolve` | Resolve an annotation |
| `instruckt.dismiss` | Dismiss an annotation |
| `instruckt.reply` | Reply to an annotation |

## Configuration

Published to `config/instruckt.php`:

```php
return [
    // Only enabled in local env by default
    'enabled' => (bool) env('INSTRUCKT_ENABLED', env('APP_ENV') === 'local'),

    // API route prefix
    'route_prefix' => env('INSTRUCKT_ROUTE_PREFIX', 'instruckt'),

    // Middleware applied to API routes
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
2. Users click elements and leave feedback
3. Annotations auto-copy as structured markdown to the clipboard for pasting into AI agents
4. Annotations are persisted to `_instruckt/annotations.json` via API routes
5. On page reload (including Vite rebuilds), annotations are loaded from the API and markers reappear
6. AI agents can read pending annotations via MCP tools and resolve/dismiss them after fixing

## API Routes

All routes are registered under the configured prefix (default: `/instruckt`):

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/instruckt/annotations` | List all annotations |
| POST | `/instruckt/annotations` | Create annotation |
| PATCH | `/instruckt/annotations/{id}` | Update annotation |
| POST | `/instruckt/annotations/{id}/reply` | Add reply |

## License

MIT
