# GEMINI.md - MyLink

## Project Overview
MyLink is a **multi-link profile service for developers** that aggregates scattered links into a single, shareable integrated page.

### Core Tech Stack
- **Framework:** Next.js 16.1.7 (App Router, Turbopack)
- **Library:** React 19.2.4
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.2.1 (via `@tailwindcss/postcss`)
- **UI Components:** shadcn/ui, HugeIcons, Base UI
- **Backend (Planned):** Firebase (Authentication, Firestore)

### Key Features
- **Google Social Login:** Easy signup/login via Firebase Auth.
- **Auto Slug Generation:** Automatic URL slug (`domain.com/displayName`) based on Google email ID.
- **Inline Editing:** Instant editing of profile info and link lists directly on the page without a separate admin panel.
- **Favicon Integration:** Automatic link icon display using Google Favicon API.
- **Public Profile Page:** Optimized public landing page for visitors.

## UI/UX Structure
Based on the design in `@docs/Wireframe.md`.

### 1. View Modes
- **Owner View:** Logged-in state. Inline editing (`✏️`) and link deletion (`🗑️`) are active. "Copy My Link" and "Logout" buttons are visible at the top.
- **Visitor View:** Read-only mode. Simple button interface for link navigation. Includes "Powered by MyLink" footer.

### 2. Component Hierarchy
- **Header:** Handles link copying and logout.
- **Profile Section:** Manages `username` and `description`.
- **Link List Section:** 
    - Add New Link button.
    - Individual Link Item (Favicon + Title + URL + Delete action).

## Building and Running
Managed via `npm` scripts.

- **Dev Server:** `npm run dev` (Turbopack enabled)
- **Production Build:** `npm run build`
- **Production Start:** `npm run start`
- **Linting:** `npm run lint`
- **Formatting:** `npm run format` (via Prettier)
- **Type Check:** `npm run typecheck`

## Development Conventions
- **App Router:** Follows Next.js 16 App Router patterns; prefers Server Components.
- **Styling:** Use Tailwind CSS 4 utility classes. Keep global styles in `@app/globals.css` to a minimum.
- **Components:** UI components reside in `@components/ui/` following shadcn/ui standards.
- **Data:** Firebase Firestore backend; designed for real-time updates via inline editing.
- **Path Aliases:** Use `@/*` for project root references (e.g., `@/components/...`).

## Project Structure
- `@app/`: Routing, layouts, and page components.
- `@components/`: Reusable UI and business components.
- `@docs/`: PRD, User Scenarios, Wireframes, etc.
- `@hooks/`: Custom React Hooks.
- `@lib/`: Utilities and library configurations.
- `@public/`: Static assets (images, SVGs).
- `@my-profile/`: (Reference) Sub-project or legacy codebase.
