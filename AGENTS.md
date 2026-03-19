<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Project Structure

- This repo is a Next.js 16 App Router application rooted at `src/app`.
- Use the `@/*` path alias for imports from `src/*`.
- Current entrypoints and examples live in `src/app/layout.tsx`, `src/app/page.tsx`, and `src/app/globals.css`.

## Build And Validation

- Use `pnpm`, not `npm`, for dependency and script commands.
- Available scripts:
  - `pnpm dev`
  - `pnpm build`
  - `pnpm start`
  - `pnpm lint`
- Follow TDD. Start with meaningful failing tests before implementing behavior.
- If a task needs tests and the current tooling is incomplete, wire up the missing test command or config as part of the work, or explicitly call out the blocker before continuing.
- Jest and Testing Library packages are installed, but there is currently no `test` script or visible Jest config. Do not claim tests were run unless you explicitly wire up and execute a real test command.

## Architecture

- Follow the project layering strictly: API layer -> service layer -> TanStack Query hook -> component consumption.
- Keep components focused on presentation and interaction. Put data fetching in the API layer, business rules and transformations in services, and server-state orchestration in hooks.
- Apply SOLID and DRY when introducing or reshaping code. Prefer small, composable units with clear responsibilities over duplicated or mixed-purpose logic.

## Coding Conventions

- Keep changes minimal and consistent with the current starter-style codebase unless the task clearly requires broader restructuring.
- Prefer TypeScript-first App Router patterns and the metadata API shown in `src/app/layout.tsx`.
- Tailwind CSS v4 is the default and should be used for styling. Reuse utility-first patterns instead of introducing a second styling system.
- Build mobile responsive interfaces by default. Prefer container queries when they fit the component boundary better than page-level media queries.
- React Compiler is enabled in `next.config.ts`. Do not add defensive `useMemo` or `useCallback` by default; only introduce memoization when it is clearly justified by an existing pattern or a measured need.
- Turbopack is configured in `next.config.ts`. Check Next 16 docs before changing bundler-related behavior or older Next.js configuration patterns.

## Review And Documentation Expectations

- Treat `README.md` as starter boilerplate unless it is updated. Prefer verified repo files over README assumptions.
- When proposing architecture, be explicit about what already exists versus what is only prepared by dependencies such as TanStack Query or AG Grid.
- If a task depends on testing or runtime behavior that is not yet configured in the repo, call out the gap clearly instead of inventing missing project conventions.
