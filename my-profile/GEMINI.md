# GEMINI.md - my-profile

## Project Overview
This is a modern web application built with **Next.js 16** and **React 19**, utilizing the **App Router** architecture. The project is designed for a personal profile or portfolio, styled with **Tailwind CSS 4**.

### Main Technologies
- **Framework:** Next.js 16.1.6 (App Router)
- **Library:** React 19.2.3
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Linting:** ESLint 9

## Building and Running
The following commands are available via `npm`:

- **Development:** `npm run dev`
  Starts the development server at [http://localhost:3000](http://localhost:3000).
- **Production Build:** `npm run build`
  Compiles the application for production deployment.
- **Production Start:** `npm run start`
  Starts the production server after a build.
- **Linting:** `npm run lint`
  Runs ESLint to check for code quality and style issues.

## Project Structure
- `app/`: Contains the application routes, layouts, and components (Next.js App Router).
  - `layout.tsx`: Root layout with global styles and font configurations.
  - `page.tsx`: The main entry page of the application.
  - `globals.css`: Global CSS and Tailwind CSS directives.
- `public/`: Static assets like images and SVG files.
- `next.config.ts`: Next.js configuration.
- `tsconfig.json`: TypeScript configuration.
- `postcss.config.mjs`: PostCSS configuration for Tailwind CSS.

## Development Conventions
- **TypeScript:** Use strict typing for all components and utilities.
- **Styling:** Prefer utility-first styling with Tailwind CSS 4. Global styles should be kept to a minimum in `globals.css`.
- **Components:** Functional components with React 19 features (e.g., Server Components by default).
- **Fonts:** Utilize `next/font` (Geist and Geist Mono are currently configured) for optimized font loading.
- **Linting:** Adhere to the rules defined in `eslint.config.mjs`.
