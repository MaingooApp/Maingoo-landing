# Repository Guidelines

## Project Structure & Module Organization

This is an Astro landing page for Maingoo with Tailwind CSS. Route files live in `src/pages/`; `index.astro` is the landing page and legal pages include `cookies.astro`, `politica-privacidad.astro`, and `terminos-servicio.astro`. Shared page chrome belongs in `src/layouts/`, currently `Layout.astro`. Reusable sections and widgets are in `src/components/`: `Header`, `Hero`, `HowItWorks`, `Features`, `SensorsBand`, `Pricing`, `ContactCTA`, `FAQs`, `Footer` and `ChatWidget` (opened by any element with `data-open-chat`). Global styling is in `src/styles/global.css`; brand tokens (Lato, `brand-*` palette from the Maingoo app, `deep`, `ink`, `muted`, radii `control`/`card`) are in `tailwind.config.ts`. Content data lives in `src/data/`: `features.ts` (the 18 feature clips), `faqs.ts` (also feeds the FAQPage structured data), `pricing.ts` and `municipios_spain.json`. Static assets are served from `public/`; feature posters are in `public/posters/`.

Feature videos: `FeatureClip.astro` looks for `public/videos/<clip>.webm|mp4` at build time, using the `clip` id from `features.ts`. If a file exists, it plays muted in a loop while visible, keeping the poster when `prefers-reduced-motion` is set; otherwise it shows the poster or icon. The plan for the clips is in `docs/plan-landing.md`.

Theme: `.dark` on `<html>` is the real dark mode. The inline script in `Layout.astro` sets it from `localStorage.darkMode` or the system preference, and the header toggle switches it. Every component styles both themes.

Deployment: pushing to the `production` branch deploys `maingoo.tech` over FTP (`.github/workflows`). Never push without the owner's go-ahead.

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

The site deploys on Vercel from `main` with the `@astrojs/vercel` adapter: pages stay static and only `src/pages/api/chat.ts` and `src/pages/api/contact.ts` run as functions (shared helpers in `src/lib/server.ts`). It streams GPT-6 Luna answers from the Azure resource `maingoo-landing-ai` (deployment `gpt-6-luna-landing`, kept apart from the backend so landing usage is billed separately); its only context is `src/lib/chat-context.ts`, built from the public data in `src/data/`, and it has no tools or backend access. It needs `AZURE_LANDING_AI_ENDPOINT`, `AZURE_LANDING_AI_KEY` and optionally `AZURE_LANDING_AI_DEPLOYMENT` in Vercel and in a local `.env`.
The contact form posts to `/api/contact`, which checks reCAPTCHA v2 server-side (`RECAPTCHA_SECRET_KEY`; skipped only in dev without it) and sends the lead with Resend from the verified domain `correo.maingoo.tech` (`RESEND_API_KEY`, optional `CONTACT_TO_EMAIL` default hello@maingoo.tech, `CONTACT_FROM_EMAIL` default `Maingoo <web@correo.maingoo.tech>`), with `reply_to` set to the lead. Do not commit secrets, webhook credentials, or service tokens. Review external URLs in `Header.astro` and `ChatWidget.astro` before deployment. Keep public assets optimized and descriptively named.

## Repositorios de Maingoo

Maingoo se reparte en cinco repositorios hermanos, clonados en la misma carpeta (`~/Developer/`). Esta sección es idéntica en todos: si una tarea exige tocar otro repositorio, lee primero su `AGENTS.md` y sigue sus reglas, porque cada uno tiene su propio stack, ramas y verificación.

| Repositorio | Carpeta local | Qué contiene |
| --- | --- | --- |
| [Maingoo-Front](https://github.com/MaingooApp/Maingoo-Front) | `Maingoo-Front` | App web de clientes: Angular 19, PrimeNG y Tailwind. Incluye el TPV (`/ventas`), las facturas, los productos, el chat con el agente y la versión móvil. Llama al gateway en `/api` (puerto 3000 en local). |
| [Maingoo-Launcher](https://github.com/MaingooApp/Maingoo-Launcher) (rama `master`) | `Maingoo-Launcher` | Backend en NestJS: microservicios sobre NATS, PostgreSQL/Prisma y Docker Compose (`make up`), más el despliegue. Cada servicio es un submódulo en `services/`: `gateway` (API HTTP), `auth`, `enterprises`, `suppliers` (facturas y proveedores), `products`, `documents-analyzer` (lectura de facturas), `billing`, `pos` (TPV) y `agent` (agente de IA). |
| [Admin-Panel](https://github.com/MaingooApp/Admin-Panel) | `Admin-Panel` | Panel interno del equipo Maingoo: Angular 20 y PrimeNG. Gestiona clientes, usuarios, suscripciones, el uso de IA, el soporte de TPV y de productos, y los dispositivos IoT. Usa el mismo gateway (`urlBackend`). |
| [maingoo-connect](https://github.com/MaingooApp/maingoo-connect) | `Maingoo-connect` | Agente local en Rust para Windows y macOS que conecta la web con impresoras de tickets y comandas y con cajones portamonedas. No tiene interfaz: se configura desde Maingoo-Front y recibe los trabajos del backend POS por WebSocket. No tiene autoridad fiscal. |
| [Maingoo-landing](https://github.com/MaingooApp/Maingoo-landing) | `Maingoo-landing` | Web comercial: Astro 5 y Tailwind, desplegada en Vercel. El formulario de contacto envía con Resend desde `/api/contact`. No comparte código con la app. |

Puntos donde un cambio afecta a otro repositorio:

- Los contratos de la API (DTOs, endpoints, mensajes NATS) se definen en los servicios de Maingoo-Launcher. Si cambian, adapta Maingoo-Front y Admin-Panel.
- El catálogo de navegación del agente vive en Maingoo-Front (`src/app/core/navigation/agent-route-catalog.json`) y tiene una copia en `services/agent`. Se sincroniza con `npm run sync:agent-routes`.
- Impresión del TPV: Maingoo-Front → `services/pos` → maingoo-connect. Un cambio en el formato de los trabajos toca los tres.
- Los submódulos de Maingoo-Launcher son repositorios propios. Haz commit dentro del submódulo y después actualiza el puntero en Launcher.
