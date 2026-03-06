---
name: instruckt
description: "Visual feedback from users via in-browser annotations. Activates when the user pastes UI feedback markdown, when annotations or visual feedback are mentioned, or when you need to check for pending UI feedback via MCP."
license: MIT
metadata:
  author: joshcirre
---
# Instruckt — Visual Feedback for AI Agents

Instruckt lets users annotate elements directly in the browser. Feedback arrives in two ways:

1. **Clipboard** — the user pastes structured markdown starting with `# UI Feedback`
2. **MCP** — you call `instruckt.get_all_pending` to fetch unresolved annotations

## Workflow

When the user pastes UI feedback or you detect pending annotations:

1. **Get the annotations** — read the pasted markdown or call `instruckt.get_all_pending`
2. **Acknowledge** — call `instruckt.acknowledge` for each annotation to signal you've seen it
3. **Make the fix** — use the element, component, classes, and text context to find and change the right code
4. **Resolve each one** — call `instruckt.resolve` with the `annotation_id` and a summary of what you changed. **This is critical** — it removes the marker from the user's browser on next reload.

## MCP Tools

| Tool | When to use |
|------|-------------|
| `instruckt.get_all_pending` | Get all unresolved annotations — use this first |
| `instruckt.acknowledge` | Mark as "seen" — do this before starting work |
| `instruckt.resolve` | Mark as resolved after fixing — include a summary |
| `instruckt.dismiss` | Dismiss an annotation that doesn't need action |
| `instruckt.reply` | Ask a clarifying question or post a status update |

## Recognizing Pasted Feedback

When the user pastes text that looks like this, treat it as instruckt annotations:

```
# UI Feedback: /dashboard

## 1. Change the heading text
- Element: `h1.text-xl` in `pages::dashboard`
- Classes: `text-xl font-bold`
- Text: "Welcome"
```

Each `##` item is one annotation. The element, component name, classes, and text context tell you where to find the code. After fixing each one, **always resolve it via MCP**.

## Understanding Annotations

- **element** — short HTML element identifier (e.g. `button.btn-primary`)
- **component** — framework component name (e.g. `pages::dashboard`, `UserMenu`)
- **classes** — CSS classes on the element, useful for finding it in code
- **text** — visible text content or selected text near the element
- **intent** — `fix`, `change`, `question`, or `approve`
- **severity** — `blocking`, `important`, or `suggestion`

## Best Practices

- **Always resolve after fixing** — this is the most important step. Without it, the marker stays visible in the user's browser.
- Address `blocking` severity first, then `important`, then `suggestion`
- When resolving, include a clear summary: "Changed heading to 'Welcome to Fission!' in `resources/views/pages/dashboard.blade.php`"
- The component name tells you which file to look at — use it to navigate directly
- Use `reply` to ask questions rather than guessing
