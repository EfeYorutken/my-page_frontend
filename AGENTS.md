# AGENTS.md

Vite + React 19 + TypeScript single-page portfolio (Efe Yörütken). No test framework exists.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build`; TypeScript errors **fail the build**
- `npm run lint` — `eslint .` (no type-aware rules)
- There are no tests. Verify changes with `npm run build` + `npm run lint`.

## Git gotchas

- There is **no `.gitignore`** and `dist/` is committed to the repo. `npm run build` rewrites committed `dist/` files. Don't add a `.gitignore` or prune `dist` without asking.
- Remote: `origin` → `EfeYorutken/my-page_frontend`, branch `master`.

## Content is data-driven

- All visible content lives in bilingual JSON files under `src/data/**/*.json`, keyed by language (`tr` / `en`). Components import these JSONs directly (Vite resolves them as modules). To change site content, edit these JSONs.
- `src/exdata.json` is a stale, unused duplicate — nothing imports it. Ignore it; don't edit it expecting changes.

## Language quirk

- Runtime language state and the `LanguageOptions` prop (`src/types.ts`) are both `"en"` / `"tr"`, matching the JSON keys. Components branch on `lang == "tr"` and fall back to English otherwise.
- Note: the page always initializes to `"en"` at mount; `localStorage["lang"]` is only written (not read) on toggle.
- Light/dark theme is toggled via the `data-theme` attribute on `<html>`; all styles live in `src/App.scss` (`src/index.scss` is empty).

## TypeScript conventions

- `verbatimModuleSyntax` is on: use `import type` for type-only imports.
- `noUnusedLocals` and `noUnusedParameters` are on.
- Shared types are in `src/types.ts`. Entry: `src/main.tsx` → `src/App.tsx` → `src/pages/my_boring_page.tsx`; per-section components live in `src/pages/boring_page_components/`.
