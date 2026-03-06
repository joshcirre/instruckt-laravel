---
name: instruckt
description: "Visual feedback from users via in-browser annotations. Activates when the user has left annotations or feedback in the browser, when you need to check for pending UI feedback, when working on fixes or changes requested through instruckt annotations, or when the user mentions instruckt, annotations, or visual feedback."
license: MIT
metadata:
  author: joshcirre
---
# Instruckt — Visual Feedback for AI Agents

Instruckt lets users annotate elements directly in the browser. You receive structured feedback via MCP tools and can acknowledge, reply, or resolve each annotation.

## Workflow

1. **Check for feedback** — call `instruckt.get_all_pending` at the start of a task or when prompted
2. **Acknowledge** — call `instruckt.acknowledge` to signal you've seen an annotation
3. **Work on the fix** — make the requested code changes
4. **Reply or resolve** — use `instruckt.reply` to ask clarifying questions, or `instruckt.resolve` with a summary of what you changed

## MCP Tools

| Tool | When to use |
|------|-------------|
| `instruckt.get_all_pending` | Get all unresolved annotations across sessions — use this first |
| `instruckt.get_pending` | Get pending annotations for a specific session |
| `instruckt.get_session` | Get full session details including resolved annotations |
| `instruckt.list_sessions` | List all feedback sessions |
| `instruckt.acknowledge` | Mark an annotation as "seen" — do this before starting work |
| `instruckt.reply` | Ask a clarifying question or post a status update |
| `instruckt.resolve` | Mark as resolved — include a summary of what you changed |
| `instruckt.dismiss` | Dismiss an annotation that doesn't need action |

## Understanding Annotations

Each annotation includes:

- **intent** — `fix` (bug), `change` (feature request), `question` (clarification needed), `approve` (looks good)
- **severity** — `blocking` (must fix), `important` (should fix), `suggestion` (nice to have)
- **element** — the HTML element name and CSS selector path
- **framework** — detected component info (Livewire component name + wire:id, Vue component, React component, Svelte component)
- **comment** — the user's feedback text
- **selectedText** — any text the user highlighted before annotating
- **thread** — conversation history between you and the user

## Best Practices

- Always acknowledge annotations before starting work so the user sees you're on it
- Address `blocking` severity first, then `important`, then `suggestion`
- When resolving, include a clear summary: "Fixed the alignment issue in the navbar by updating the flex classes in `resources/views/components/nav.blade.php`"
- Use `reply` to ask questions rather than guessing — the user sees your reply in real-time
- The `framework` field tells you exactly which component to look at — use it to navigate directly to the right file
- For Livewire annotations, the `wire_id` helps you identify the exact component instance
