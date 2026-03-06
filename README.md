# instruckt

Visual feedback tool for AI coding agents. Click on any element in your app, leave a note, and copy structured markdown to paste into your AI agent — no screenshots needed.

Framework-agnostic JS core with adapters for Livewire, Vue, Svelte, and React.

## Install

```bash
npm install instruckt
```

Or load via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/instruckt/dist/instruckt.iife.js"></script>
```

## Quick Start

```js
import { Instruckt } from 'instruckt'

const instruckt = new Instruckt({
  endpoint: '/instruckt',
})
```

Or with the IIFE build:

```html
<script src="/path/to/instruckt.iife.js"></script>
<script>
  Instruckt.init({ endpoint: '/instruckt' })
</script>
```

## How It Works

1. A floating toolbar appears in your app
2. Press **A** or click the annotate button to enter annotation mode
3. Hover over any element — instruckt highlights it and detects its framework component
4. Click to annotate — type your feedback and save
5. Annotations auto-copy as structured markdown to your clipboard
6. Paste into any AI coding agent (Claude Code, Cursor, Codex, Copilot, OpenCode, etc.)
7. The agent reads the markdown and makes the requested code changes

### Example Output

```markdown
# UI Feedback: /auth/login

## 1. Change the submit button color to green
- Element: `button.btn-primary` in `pages::auth.login`
- Classes: `btn btn-primary`
- Text: "Submit Login"

## 2. Make the login card have rounded corners
- Element: `div.bg-white` in `pages::auth.login`
- Classes: `bg-white dark:bg-white/10 border`
```

## Configuration

```js
new Instruckt({
  // Required — URL to your instruckt API (provided by the Laravel package or your own backend)
  endpoint: '/instruckt',

  // Framework adapters to activate (default: all)
  adapters: ['livewire', 'vue', 'svelte', 'react'],

  // Theme: 'light' | 'dark' | 'auto' (default: 'auto')
  theme: 'auto',

  // Toolbar position (default: 'bottom-right')
  position: 'bottom-right',

  // Callbacks
  onAnnotationAdd: (annotation) => {},
})
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `A` | Toggle annotation mode |
| `F` | Freeze page (pause animations, block navigation) |
| `X` | Clear all annotations on this page |
| `Esc` | Exit annotation/freeze mode |

## Features

- **Framework detection** — automatically identifies Livewire, Vue, Svelte, and React components
- **Shadow DOM isolation** — all UI renders in shadow roots so it never conflicts with your styles
- **Copy as markdown** — annotations auto-copy as structured markdown optimized for AI agents
- **Freeze mode** — pause animations, freeze popovers/dropdowns, and block all navigation
- **Annotation persistence** — annotations survive page reloads and Vite rebuilds via localStorage fallback; with a backend (Laravel), annotations are loaded from the API on init
- **Minimize** — collapse to a small floating button with annotation count badge
- **Page-scoped markers** — annotation pins reposition on scroll/resize and only appear on the page where they were created
- **Clear controls** — clear current page (`X` key or trash icon), or clear all pages via flyout
- **SPA navigation** — survives `wire:navigate`, Vue Router, React Router, and browser back/forward

## Public API

```js
// Get all annotations
instruckt.getAnnotations()

// Export open annotations as markdown
instruckt.exportMarkdown()

// Clean up
instruckt.destroy()
```

## Backend

instruckt needs a backend to persist annotations. The official Laravel package provides this out of the box:

- **[instruckt-laravel](https://github.com/joshcirre/instruckt-laravel)** — Laravel package with JSON file storage, MCP tools, Blade component, and API routes

## License

MIT
