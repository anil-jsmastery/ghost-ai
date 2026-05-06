# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In Progress

## Current Goal

- Feature 02 — Editor Chrome (navbar + sidebar shell)

## Completed

- **Feature 02 — Editor Chrome**
  - Created `components/editor/editor-navbar.tsx` — fixed-height top bar with `PanelLeftOpen`/`PanelLeftClose` toggle, left/center/right sections
  - Created `components/editor/project-sidebar.tsx` — floating overlay sidebar (does not push content), slides in from left, `isOpen`/`onClose` props, Projects header + close button, shadcn Tabs (My Projects / Shared) with empty placeholder states, full-width New Project button
  - Updated `app/page.tsx` to wire sidebar state and render both components
  - Dialog pattern deferred — existing shadcn Dialog component in `components/ui/dialog.tsx` uses global color tokens and is ready for use
  - TypeScript check passes with zero errors

- **Feature 01 — Design System**
  - Installed and configured shadcn/ui (Radix, Nova preset, Tailwind v4)
  - Added shadcn components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
  - Installed lucide-react
  - lib/utils.ts created with cn() helper (clsx + tailwind-merge)
  - Dark theme enforced by adding `dark` class to `<html>` in layout.tsx
  - TypeScript check passes with zero errors

## In Progress

- None.

## Next Up

- Feature 03 (TBD from feature specs)

## Open Questions

- None yet.

## Architecture Decisions

- Using shadcn/ui on top of Tailwind CSS v4 for the component library
- components/ui/ holds all shadcn-generated primitives — not modified after install
- Dark mode enforced via `dark` class on `<html>` element (shadcn uses class strategy)

## Session Notes

- Next.js 16.2.4, React 19, Tailwind CSS v4 (@tailwindcss/postcss), TypeScript strict
- globals.css uses Tailwind v4 @import syntax; shadcn generated CSS custom property tokens
- shadcn components must not be modified after installation
