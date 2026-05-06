# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In Progress

## Current Goal

- Feature 03 — Authentication (Clerk integration)

## Completed

- **Feature 03 — Authentication**
  - Installed `@clerk/ui` for dark theme support
  - Created `proxy.ts` at project root (Next.js 16 replaces `middleware.ts`) — `clerkMiddleware` exported as `proxy`, public routes derived from env vars with `/sign-in` and `/sign-up` fallbacks, everything else protected by default
  - Wrapped root layout with `ClerkProvider` using `dark` baseTheme from `@clerk/ui/themes`, all appearance variables reference CSS custom properties (no hardcoded colors)
  - Created `app/sign-in/[[...sign-in]]/page.tsx` — two-panel layout: left panel (logo, tagline, text-only feature list, hidden on small screens), right panel (centered `<SignIn />` form)
  - Created `app/sign-up/[[...sign-up]]/page.tsx` — same two-panel layout with `<SignUp />` form
  - Updated `app/page.tsx` — async server component: authenticated users redirect to `/editor`, unauthenticated to `/sign-in`
  - Added `<UserButton />` to editor navbar right section

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

- Feature 04 (TBD from feature specs)

## Open Questions

- None yet.

## Architecture Decisions

- Using shadcn/ui on top of Tailwind CSS v4 for the component library
- components/ui/ holds all shadcn-generated primitives — not modified after install
- Dark mode enforced via `dark` class on `<html>` element (shadcn uses class strategy)
- Next.js 16 uses `proxy.ts` (renamed from `middleware.ts`); function exported as `proxy` not `middleware`
- Clerk appearance variables reference CSS custom properties — no hardcoded colors

## Session Notes

- Next.js 16.2.4, React 19, Tailwind CSS v4 (@tailwindcss/postcss), TypeScript strict
- globals.css uses Tailwind v4 @import syntax; shadcn generated CSS custom property tokens
- shadcn components must not be modified after installation
- Clerk Next.js v7.3.1, @clerk/ui v1.8.0 installed
- `proxy.ts` is the Next.js 16 equivalent of `middleware.ts` — same API, renamed file and function
