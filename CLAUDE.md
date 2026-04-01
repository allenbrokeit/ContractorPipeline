# Project Instructions

## Symbols MCP

Always use `symbols-mcp` tools (e.g. `search_symbols_docs`, `get_sdk_reference`, `get_project_rules`, `audit_component`, etc.) when working on this project. Before writing or modifying any component, consult Symbols documentation and framework rules to ensure compliance with the Symbols.app design-system framework and DOMQL v3 syntax.

## Critical Rules

- Components are plain objects, never functions
- No imports between project files — reference by PascalCase key name
- `extends` and `childExtends` must be quoted strings
- Design system keys are ALWAYS lowercase (color, theme, typography — never UPPERCASE)
- ALL values must use design system tokens — no raw px, no hex colors
- Use `el.router(path, el.getRoot())` for navigation — never `window.location`
- Use `extends: 'Link'` with `href` as prop — never `attr: { href }`
- No `document.querySelector` or raw DOM methods — use DOMQL element tree
- Use `children` + `childExtends` — never `$collection`
- Define each color once, use shading modifiers (`'blue.7'`, `'gray+50'`) — no Tailwind-style palettes
- Never chain CSS selectors (`'@dark :hover'`) — use nesting (`'@dark': { ':hover': {} }`)
- `cases.js` belongs at root level, NOT inside `designSystem/`
