# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In Progress

## Current Goal

- Feature 10 (TBD from feature specs)

## Completed

- **Feature 09 — Share Dialog**
  - Created `app/api/projects/[projectId]/collaborators/route.ts` — `GET` lists collaborators enriched with Clerk display name and avatar (accessible to owner and collaborators); `POST` invites by email (owner-only, 403 for non-owners, 409 if already a collaborator)
  - Created `app/api/projects/[projectId]/collaborators/[email]/route.ts` — `DELETE` removes a collaborator by URL-encoded email (owner-only)
  - Created `components/editor/share-dialog.tsx` — client dialog; owners see invite form + remove buttons per collaborator; collaborators see read-only list; collaborator rows show Clerk avatar and display name (falls back to email initial); "Copy link" button copies `/editor/[projectId]` with 2 s "Copied!" feedback; fetches collaborator list on open
  - Updated `components/editor/workspace-navbar.tsx` — added `onShare` prop; Share button is now active (removed `disabled`)
  - Updated `components/editor/workspace-client.tsx` — added `isOwner` prop; manages `shareDialogOpen` state; renders `ShareDialog` wired to Share button
  - Updated `app/editor/[roomId]/page.tsx` — derives `isOwner` from `project.ownerId === identity.userId` and passes it to `WorkspaceClient`
  - `npm run build` passes with zero TypeScript errors

- **Feature 08 — Editor Workspace Shell**
  - Created `lib/project-access.ts` — `getCurrentUserIdentity()` returns `{ userId, email }` from Clerk; `getProjectWithAccess()` fetches a project by ID and returns it only if the caller is owner or a collaborator (checked via `ProjectCollaborator` unique index)
  - Created `components/editor/access-denied.tsx` — centered layout with `Lock` icon, short message, and a link back to `/editor`; used for both missing and unauthorized projects
  - Created `components/editor/workspace-navbar.tsx` — client component; shows sidebar toggle (left), project name (center), and share button + AI sidebar toggle + `UserButton` (right); share button disabled (placeholder)
  - Created `components/editor/workspace-client.tsx` — client shell managing sidebar and AI sidebar open/close state; wraps `ProjectDialogsProvider` + `ProjectDialogs`; renders `WorkspaceNavbar`, `ProjectSidebar` (with `activeProjectId`), dark canvas placeholder, and collapsible right AI sidebar placeholder
  - Created `app/editor/[roomId]/page.tsx` — async server component; awaits `params` Promise; unauthenticated users redirect to `/sign-in`; missing/unauthorized projects render `AccessDenied`; authorized access renders `WorkspaceClient` with project + sidebar data fetched in parallel
  - Updated `components/editor/project-sidebar.tsx` — added optional `activeProjectId` prop; matching project row highlighted with `bg-muted` in both owned and shared lists
  - `npm run build` passes with zero TypeScript errors

- **Feature 07 — Wire Editor to Real Project API**
  - Created `lib/data/projects.ts` — `getProjectsForUser()` server helper fetches owned projects (by `ownerId`) and shared projects (via `ProjectCollaborator.collaboratorEmail`) from Prisma in parallel using `currentUser()` from Clerk
  - Created `hooks/use-project-actions.ts` — replaces mock hook; manages dialog state + real API mutations: create (`POST /api/projects` with slug-based custom ID + short random suffix), rename (`PATCH /api/projects/[id]` with optimistic update + rollback), delete (`DELETE /api/projects/[id]` with optimistic update + redirect to `/editor` if deleting active workspace, else `router.refresh()`)
  - Created `components/editor/editor-home-client.tsx` — client shell that receives server-fetched project lists as props, owns sidebar toggle state, renders navbar + sidebar + dialogs + main content
  - Updated `app/api/projects/route.ts` POST — accepts optional `id` field to support custom slug-based project IDs
  - Updated `app/editor/layout.tsx` — simplified to a server component pass-through (chrome moved to page-level)
  - Updated `app/editor/page.tsx` — server component that fetches projects and delegates to `EditorHomeClient`
  - Updated `components/editor/project-dialogs-context.tsx` — context type now derives from `useProjectActions`
  - Updated `components/editor/project-dialogs.tsx` — create dialog shows room ID preview (slug + suffix) instead of plain slug
  - Updated `components/editor/project-sidebar.tsx` — uses `ownedProjects`/`sharedProjects` from context (real data), project names link to `/editor/[id]`
  - `npm run build` passes with zero TypeScript errors

- **Feature 06 — Project API Routes**
  - Created `app/api/projects/route.ts` — `GET` lists the authenticated user's projects (ordered by `createdAt` desc); `POST` creates a project with `ownerId` from Clerk, defaults missing name to `"Untitled Project"`
  - Created `app/api/projects/[projectId]/route.ts` — `PATCH` renames (owner-only, 403 for non-owners); `DELETE` removes with cascade (owner-only, 403 for non-owners); both return `401` when unauthenticated
  - `npm run build` passes with zero TypeScript errors

- **Feature 05 — Prisma Data Layer**
  - Created `prisma/models/project.prisma` — `Project` model (ownerId, name, optional description, status enum DRAFT/ARCHIVED, canvasJsonPath, timestamps, indexes on ownerId and createdAt) and `ProjectCollaborator` model (project relation with cascade delete, collaboratorEmail, createdAt, unique on projectId/email, indexes on email and projectId/createdAt)
  - Created `lib/prisma.ts` — cached singleton, branches on `DATABASE_URL`: `prisma+postgres://` uses `accelerateUrl` (Prisma Accelerate), otherwise uses `@prisma/adapter-pg` direct driver
  - Ran `prisma migrate dev --name init-projects` — migration applied to database and client generated to `app/generated/prisma/`
  - `npm run build` passes with zero TypeScript errors

- **Feature 04 — Project Dialogs**
  - Created `hooks/use-project-dialogs.ts` — dedicated hook managing dialog state, form state, loading state, and mock project list (create/rename/delete update state in memory)
  - Created `components/editor/project-dialogs-context.tsx` — context provider so editor home page and sidebar can both access dialog actions
  - Created `components/editor/project-dialogs.tsx` — three controlled dialogs (Create with live slug preview, Rename with prefill + auto-focus + Enter-to-submit, Delete with destructive button)
  - Updated `app/editor/layout.tsx` — uses the hook, wraps children in provider, renders dialogs at layout level
  - Updated `app/editor/page.tsx` — heading, description, and New Project button wired to Create dialog via context
  - Updated `components/editor/project-sidebar.tsx` — project lists with rename/delete hover actions for owned projects only (shared tab has no actions), mobile backdrop scrim added

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

- Feature 10 (TBD from feature specs)

## Open Questions

- None yet.

## Architecture Decisions

- Prisma v7 uses `accelerateUrl` option (not an adapter) for `prisma+postgres://` / Accelerate connections; `adapter` option is for direct driver connections (`@prisma/adapter-pg`)
- Prisma schema split across `prisma/schema.prisma` (generator + datasource) and `prisma/models/*.prisma` (models); `prisma.config.ts` points schema dir to `prisma/`
- Generated Prisma client lives at `app/generated/prisma/client` (not an index export); import as `@/app/generated/prisma/client`
- Using shadcn/ui on top of Tailwind CSS v4 for the component library
- components/ui/ holds all shadcn-generated primitives — not modified after install
- Dark mode enforced via `dark` class on `<html>` element (shadcn uses class strategy)
- Next.js 16 uses `proxy.ts` (renamed from `middleware.ts`); function exported as `proxy` not `middleware`
- Clerk appearance variables reference CSS custom properties — no hardcoded colors

## Session Notes

- Prisma 7.8.0, @prisma/adapter-pg 7.8.0, pg 8.20.0 installed; generated client at `app/generated/prisma/`
- Next.js 16.2.4, React 19, Tailwind CSS v4 (@tailwindcss/postcss), TypeScript strict
- globals.css uses Tailwind v4 @import syntax; shadcn generated CSS custom property tokens
- shadcn components must not be modified after installation
- Clerk Next.js v7.3.1, @clerk/ui v1.8.0 installed
- `proxy.ts` is the Next.js 16 equivalent of `middleware.ts` — same API, renamed file and function
