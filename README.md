# instruckt-laravel

Laravel package for [instruckt](https://github.com/joshcirre/instruckt) — visual feedback for AI coding agents. Provides the backend API, MCP tools, JSON file storage, and a Blade toolbar component.

Users annotate elements in the browser, annotations are copied as structured markdown, and your AI agent can also read them via MCP. You can trigger a configured local CLI agent (e.g. cursor-agent, claude, gemini, codex) from the toolbar Run button.

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

The install command publishes the config, installs the npm package, and automatically:

- Adds the **instruckt Vite plugin** to your `vite.config.js` with `server: false`
- Adds `import 'virtual:instruckt'` to your JS entry point
- Configures MCP for any detected AI agents (Claude Code, Cursor, Codex, OpenCode, GitHub Copilot)

To uninstall, run `php artisan instruckt:uninstall`. See [Uninstall](#uninstall) for details.

## Setup

### Vite Plugin (Default)

The install command adds the instruckt Vite plugin to your `vite.config.js`:

```js
import laravel from 'laravel-vite-plugin'
import instruckt from 'instruckt/vite'

export default defineConfig({
  plugins: [
    laravel({ input: ['resources/js/app.js'] }),
    instruckt({
      server: false,
      endpoint: '/instruckt',
      adapters: ['livewire', 'blade'],
      mcp: true,
    }),
  ],
})
```

And a single import in your JS entry point:

```js
// resources/js/app.js
import 'virtual:instruckt'
```

The `server: false` flag tells the Vite plugin that Laravel owns the backend — it only provides the virtual module for client injection.

The plugin only runs during `vite serve` (`apply: 'serve'`), so instruckt is completely absent from production builds — zero bytes shipped.

### Blade Component (Alternative)

If you'd rather not touch your JS/Vite config, use the Blade component in your layout before `</body>`:

```blade
<x-instruckt-toolbar />
```

The component is gated behind `config('instruckt.enabled')`, which defaults to `true` only when `APP_ENV=local`. It loads the IIFE build and accepts optional attributes:

```blade
<x-instruckt-toolbar
    theme="dark"
    position="bottom-left"
    :adapters="['livewire', 'vue']"
    :colors="['default' => '#6366f1', 'screenshot' => '#22c55e', 'dismissed' => '#71717a']"
    :keys="['annotate' => 'a', 'freeze' => 'f']"
/>
```

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

## How It Works

1. The Vite plugin (or Blade component) initializes the annotation UI
2. Users click elements and leave feedback — optionally capturing screenshots
3. Annotations auto-copy as structured markdown to the clipboard for pasting into AI agents
4. Annotations are persisted to `storage/app/_instruckt/` via API routes
5. On page reload (including Vite rebuilds), annotations are loaded from the API and markers reappear
6. AI agents can read pending annotations via MCP tools and resolve them after fixing

## MCP Tools

The package registers these MCP tools for your AI agent:

| Tool | Description |
|------|-------------|
| `instruckt.get_all_pending` | Get all pending annotations |
| `instruckt.get_screenshot` | Get the screenshot image for an annotation |
| `instruckt.resolve` | Mark an annotation as resolved (removes marker from browser) |

## Storage

Annotations are stored in `storage/app/_instruckt/annotations.json`. Screenshots are saved as PNGs in `storage/app/_instruckt/screenshots/`. No database migrations needed.

## Configuration

Publish the config file to customize:

```bash
php artisan vendor:publish --tag=instruckt-config
```

Published to `config/instruckt.php`:

```php
return [
    // Only enabled in local env by default
    'enabled' => (bool) env('INSTRUCKT_ENABLED', env('APP_ENV') === 'local'),

    // Run button: run.command (in-process) or run.host_runner_url (Docker)
    'run' => [
        'enabled' => (bool) env('INSTRUCKT_RUN_ENABLED', false),
        'command' => env('INSTRUCKT_RUN_COMMAND', ''),
        'host_runner_url' => env('INSTRUCKT_RUN_HOST_RUNNER_URL', ''),
        'agent_binary' => env('INSTRUCKT_RUN_AGENT_BINARY', 'cursor-agent'),
        'cwd' => env('INSTRUCKT_RUN_CWD', base_path()),
        'timeout' => (int) env('INSTRUCKT_RUN_TIMEOUT', 120),
        'max_markdown_length' => (int) env('INSTRUCKT_RUN_MAX_MARKDOWN_LENGTH', 50000),
    ],

    // API route prefix
    'route_prefix' => env('INSTRUCKT_ROUTE_PREFIX', 'instruckt'),

    // Middleware applied to API routes
    'middleware' => explode(',', env('INSTRUCKT_MIDDLEWARE', 'api')),

    // Override JS source (e.g. pinned CDN version) — only used by Blade component
    'cdn_url' => env('INSTRUCKT_CDN_URL', null),

    // Marker pin colors (CSS color strings) — only used by Blade component
    // When using the Vite plugin, set these in vite.config.js instead
    'colors' => [
        // 'default'    => '#6366f1',  // indigo — standard annotations
        // 'screenshot' => '#22c55e',  // green — annotations with screenshots
        // 'dismissed'  => '#71717a',  // gray — dismissed
    ],

    // Keyboard shortcuts — only used by Blade component
    // When using the Vite plugin, set these in vite.config.js instead
    'keys' => [
        // 'annotate'   => 'a',  // toggle annotation mode
        // 'freeze'     => 'f',  // freeze page
        // 'screenshot' => 'c',  // region screenshot capture
        // 'clearPage'  => 'x',  // clear current page
    ],
];
```

> **Note:** When using the Vite plugin, toolbar visual config (colors, keys, position, theme) lives in `vite.config.js`. The PHP config governs backend behavior (enabled, routes, middleware, MCP).

### Run button

The Run button sends the current annotations as markdown to the backend. Either run the agent **in the same process** or **via a listener on your host** (for Docker).

**Same machine (PHP can run the agent):** set a shell command; markdown is piped to stdin.

```env
INSTRUCKT_RUN_ENABLED=true
INSTRUCKT_RUN_COMMAND="cursor-agent -f --model auto -p \"$(cat)\""
INSTRUCKT_RUN_CWD=/path/to/project
```

**Docker / Sail:** use the host listener (see below).

#### Run button from Docker / Sail

When the app runs inside Docker (e.g. Laravel Sail), the container cannot see your host’s `cursor-agent` binary. Use the **host runner** so the agent runs on your machine with your PATH and Cursor auth:

1. **On your host** (outside the container), from your **Laravel app directory** (where `artisan` lives), run:

   ```bash
   php artisan instruckt:run-agent-server
   ```

   Optional: `--port=31337` (default 31337). The command listens for POSTs and runs `cursor-agent` with the body as the prompt. Debug lines (connections, request size, CLI command) are printed to stderr.

2. **In your app’s `.env`** (read by the container), set:

   ```env
   INSTRUCKT_RUN_ENABLED=true
   INSTRUCKT_RUN_HOST_RUNNER_URL=http://host.docker.internal:31337
   ```

   The Run button will POST markdown to that URL; the listener runs the agent on your host.

## Production Safety

Instruckt is designed as a dev-only tool with multiple layers of protection:

| Layer | Vite Plugin | Blade Component |
|-------|-------------|-----------------|
| **Frontend** | Plugin uses `apply: 'serve'` — absent from production builds entirely | `@if(config('instruckt.enabled'))` — component doesn't render |
| **Backend routes** | Only registered when `config('instruckt.enabled')` is `true` | Same |
| **Config default** | `enabled` defaults to `true` only when `APP_ENV=local` | Same |

## API Routes

All routes are registered under the configured prefix (default: `/instruckt`):

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/instruckt/annotations` | List all annotations |
| POST | `/instruckt/annotations` | Create annotation |
| PATCH | `/instruckt/annotations/{id}` | Update annotation |
| POST | `/instruckt/run` | Trigger configured local CLI agent run (`202`) |

## Keyboard Shortcuts

Default shortcuts (customizable via `keys` in your Vite plugin options or config):

| Key | Action |
|-----|--------|
| `A` | Toggle annotation mode |
| `F` | Toggle freeze animations |
| `C` | Screenshot region capture |
| `X` | Clear annotations on current page |
| `Esc` | Exit annotation/freeze mode |

## Secure Context Note

`navigator.clipboard` requires a secure context (HTTPS or localhost). On `http://*.test` domains, auto-copy on annotation submit is skipped. Use the copy button in the toolbar which uses a fallback method.

## Uninstall

To cleanly remove instruckt from your project:

```bash
php artisan instruckt:uninstall
```

This scans for all instruckt artifacts, shows you what will be removed, and asks for confirmation before proceeding. It reverses everything the install command did:

- Vite plugin from `vite.config.*`
- Virtual import (`import 'virtual:instruckt'`) from your JS entry point
- Legacy JS toolbar code (if installed with an older version)
- Published config (`config/instruckt.php`)
- Blade toolbar component from layout files
- MCP server entries from all agent configs (`.mcp.json`, `.cursor/mcp.json`, etc.)
- Agent skill directories
- Stored annotations and screenshots (`storage/app/_instruckt/`)
- The `instruckt` npm package

After uninstalling, remove the Composer package:

```bash
composer remove joshcirre/instruckt-laravel --dev
```

Options:

| Flag | Description |
|------|-------------|
| `--force` | Skip the confirmation prompt |
| `--keep-config` | Keep `config/instruckt.php` |
| `--keep-npm` | Keep the npm package installed |

## License

MIT
