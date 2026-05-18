# Repository Guidelines

## Project Structure & Module Organization

This is an Astro landing page for Maingoo with Tailwind CSS. Route files live in `src/pages/`; `index.astro` is the landing page and legal pages include `cookies.astro`, `politica-privacidad.astro`, and `terminos-servicio.astro`. Shared page chrome belongs in `src/layouts/`, currently `Layout.astro`. Reusable sections and widgets are in `src/components/`, such as `Hero.astro`, `Pricing.astro`, and `ChatWidget.astro`. Global styling is in `src/styles/global.css`, static assets are served from `public/`, and structured data lives in `src/data/`.

## Build, Test, and Development Commands

Run commands from the repository root:

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start Astro locally, usually at `http://localhost:4321`.
- `npm run build`: create the production build in `dist/`; use this as the main validation command.
- `npm run preview`: preview the latest production build locally.
- `npm run astro -- check`: run Astro diagnostics when investigating type or template issues.

## Coding Style & Naming Conventions

Use Astro single-file components with frontmatter imports at the top and semantic HTML in the template. Follow the existing two-space indentation in `.astro` files. Prefer Tailwind utility classes for layout and spacing, with shared base styles in `src/styles/global.css` only for reused rules. Name components in PascalCase (`ContactCTA.astro`) and route files in lowercase, hyphenated Spanish slugs where applicable. Keep visible copy consistent with the current Spanish landing-page tone.

## Testing Guidelines

No automated test suite is currently configured. For every change, run `npm run build` and manually verify affected pages in `npm run dev` or `npm run preview`. When adding interactive behavior, validate desktop and mobile breakpoints, especially header navigation, pricing/contact flows, FAQ behavior, and the chat widget. If tests are introduced later, place them near the feature or in a clearly named `tests/` directory and add the command to `package.json`.

## Commit & Pull Request Guidelines

Recent history uses concise Spanish messages, often Conventional Commit style, for example `fix: actualizar la URL del webhook de n8n para el chatbot de Maingoo`. Prefer `fix:`, `feat:`, `chore:`, or `docs:` followed by a short imperative summary. Pull requests should include a brief description, linked issue when available, screenshots for visual changes, and the validation performed, especially `npm run build`.

## Security & Configuration Tips

Do not commit secrets, webhook credentials, or service tokens. Review external URLs in `Header.astro` and `ChatWidget.astro` before deployment. Keep public assets optimized and descriptively named.
