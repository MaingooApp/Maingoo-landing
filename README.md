# Maingoo Landing - Documentación técnica interna

Este documento describe la base técnica de la landing de Maingoo para desarrollo interno. No está pensado como README público ni como material comercial, sino como referencia operativa para mantener, extender y desplegar esta pieza del SaaS.

La landing funciona como punto de entrada comercial y captación de leads para Maingoo. Actualmente es un sitio estático construido con Astro, con lógica de cliente para formulario, validaciones, analítica, consentimiento, reCAPTCHA y envío de contactos mediante EmailJS.

## Estado actual

- Tipo de proyecto: landing estática de captación.
- Framework: Astro 5.
- Styling: Tailwind CSS 3.
- Render: estático, sin backend propio en este repositorio.
- Formularios: lógica client-side con EmailJS.
- Validación de teléfono: `libphonenumber-js`.
- Dataset local: municipios de España para autocompletado.
- Rutas legales incluidas: cookies, privacidad y términos.

## Stack

| Área | Tecnología |
| --- | --- |
| Framework | Astro `^5.13.2` |
| Estilos | Tailwind CSS `^3.4.17` |
| Integración Tailwind | `@astrojs/tailwind` |
| Formularios | `@emailjs/browser` |
| Teléfonos | `libphonenumber-js` |
| Lenguaje/config | TypeScript + ESM |
| Gestor de paquetes | npm |

## Requisitos locales

- Node.js compatible con Astro 5.
- npm.
- Acceso a internet para probar servicios externos: EmailJS, reCAPTCHA, Google Analytics, Microsoft Clarity, Cookie Script y Google Fonts.

Instalación:

```sh
npm install
```

Arranque local:

```sh
npm run dev
```

URL por defecto:

```text
http://localhost:4321/
```

## Scripts

| Comando | Uso interno |
| --- | --- |
| `npm run dev` | Desarrollo local con hot reload. |
| `npm run build` | Compilación de producción. Debe ejecutarse antes de publicar cambios. |
| `npm run preview` | Validación local del build generado en `dist/`. |
| `npm run astro` | Acceso directo a la CLI de Astro. |

## Estructura interna

```text
.
├── astro.config.mjs
├── package.json
├── package-lock.json
├── public/
│   ├── Hero-bg.png
│   ├── Maingoo-icon.svg
│   ├── icono-IA-SF.png
│   ├── maingo_origin.png
│   └── maingoo_logo.svg
├── src/
│   ├── components/
│   │   ├── Benefits.astro
│   │   ├── ChatWidget.astro
│   │   ├── ContactCTA.astro
│   │   ├── FAQs.astro
│   │   ├── Features.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   └── Pricing.astro
│   ├── data/
│   │   └── municipios_spain.json
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── cookies.astro
│   │   ├── index.astro
│   │   ├── politica-privacidad.astro
│   │   └── terminos-servicio.astro
│   └── styles/
│       └── global.css
├── tailwind.config.ts
└── tsconfig.json
```

## Arquitectura

### Layout global

Archivo: `src/layouts/Layout.astro`

Responsabilidades:

- Define la estructura HTML base.
- Configura metadatos por página mediante props `title` y `description`.
- Carga favicon, fuente Inter y scripts globales.
- Inserta `Header`, `Footer` y `ChatWidget`.
- Importa estilos globales desde `src/styles/global.css`.
- Aplica el script inicial de modo claro/oscuro para evitar FOUC.

Punto de atención: el layout contiene integraciones de terceros y scripts inline. Si se endurece la política CSP o se migra a un sistema de consentimiento más estricto, este archivo será uno de los principales puntos de ajuste.

### Página principal

Archivo: `src/pages/index.astro`

Compone la landing con:

- `Hero`
- `Features`
- `Pricing`
- `ContactCTA`
- `FAQs`

La página usa `Layout` con título y descripción SEO específicos.

### Componentes

La mayoría de componentes son secciones estáticas de presentación. `ContactCTA.astro` es el componente con más lógica y debe tratarse como componente crítico.

## Rutas

| Ruta | Archivo | Uso |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Landing principal. |
| `/cookies` | `src/pages/cookies.astro` | Política de cookies. |
| `/politica-privacidad` | `src/pages/politica-privacidad.astro` | Política de privacidad. |
| `/terminos-servicio` | `src/pages/terminos-servicio.astro` | Términos del servicio. |

## Formulario de contacto

Archivo: `src/components/ContactCTA.astro`

Responsabilidades actuales:

- Inicializa EmailJS.
- Construye el selector de países y prefijos telefónicos.
- Formatea el teléfono mientras el usuario escribe.
- Valida teléfono según país seleccionado.
- Valida email con expresión regular.
- Busca municipios españoles desde `src/data/municipios_spain.json`.
- Muestra sugerencias de ubicación.
- Gestiona campo condicional para tipo de negocio "Otro".
- Controla contador de caracteres del mensaje.
- Exige aceptación de privacidad.
- Exige reCAPTCHA v2.
- Envía el lead a EmailJS.
- Muestra alertas de éxito/error.

Identificadores actualmente usados:

| Servicio | Valor actual |
| --- | --- |
| EmailJS public key | `aPPNoh3Ouq2xOXzLa` |
| EmailJS service | `service_4nvrynj` |
| EmailJS template | `template_tkal5o8` |
| reCAPTCHA site key | `6Ld3ueYrAAAAALaYzCiypC39jBZKrANe9bEjLtZn` |

Estos valores son públicos por naturaleza al ejecutarse en cliente, pero no deberían quedar dispersos en componentes si el proyecto crece. Recomendación interna: moverlos a variables públicas de Astro (`PUBLIC_*`) y documentar entornos.

## Integraciones de terceros

| Servicio | Ubicación | Función |
| --- | --- | --- |
| Google Analytics | `Layout.astro` | Analítica web. |
| Microsoft Clarity | `Layout.astro` | Grabación/heatmaps/comportamiento. |
| Cookie Script | `Layout.astro` | Gestión de consentimiento. |
| Google reCAPTCHA v2 | `Layout.astro` + `ContactCTA.astro` | Protección del formulario. |
| EmailJS | `ContactCTA.astro` | Envío de leads sin backend propio. |
| Google Fonts | `Layout.astro` | Fuente Inter. |

IDs actuales:

| Servicio | ID |
| --- | --- |
| Google Analytics | `G-H6FCBZSDLH` |
| Microsoft Clarity | `tc3gljr35e` |
| Cookie Script | `cec8a2c75a9cad8b24709d83c765d8fd` |

## Variables y configuración recomendada

Actualmente el proyecto no usa `.env`. Para separar entornos y facilitar despliegues, se recomienda introducir:

```text
PUBLIC_GA_ID=
PUBLIC_CLARITY_ID=
PUBLIC_COOKIE_SCRIPT_ID=
PUBLIC_EMAILJS_PUBLIC_KEY=
PUBLIC_EMAILJS_SERVICE_ID=
PUBLIC_EMAILJS_TEMPLATE_ID=
PUBLIC_RECAPTCHA_SITE_KEY=
```

En Astro, las variables expuestas al navegador deben empezar por `PUBLIC_`.

## Datos locales

`src/data/municipios_spain.json` se usa para el autocompletado de ubicación del negocio.

Consideraciones:

- Se carga en el bundle del formulario.
- El tamaño del dataset afecta al peso de cliente.
- La búsqueda se realiza en navegador.
- Si el dataset crece o se internacionaliza, conviene mover esta lógica a una API o cargar datos bajo demanda.

## Build

Compilación:

```sh
npm run build
```

Preview:

```sh
npm run preview
```

Salida:

```text
dist/
```

El resultado es estático y puede desplegarse en hosting de frontend. Si se mantiene el envío por EmailJS, no se requiere backend para esta landing.

## Checklist antes de publicar

- Ejecutar `npm run build`.
- Revisar visualmente desktop y mobile.
- Probar envío real del formulario.
- Validar que reCAPTCHA acepta el dominio de producción.
- Validar que EmailJS recibe todos los campos esperados.
- Confirmar que las páginas legales reflejan las integraciones activas.
- Confirmar que Cookie Script gobierna correctamente analítica y tracking.
- Revisar consola del navegador sin errores críticos.
- Verificar que assets de `public/` cargan correctamente.

## Riesgos técnicos actuales

- Credenciales/IDs públicos definidos directamente en componentes.
- Formulario dependiente de terceros y sin backend propio de respaldo.
- reCAPTCHA validado en cliente; sin verificación server-side dentro de este repositorio.
- Scripts de analítica y tracking cargados desde el layout global.
- Lógica extensa dentro de `ContactCTA.astro`; puede dificultar mantenimiento si el formulario crece.
- No hay scripts de lint, test ni typecheck explícitos en `package.json`.
- `npm install` reporta vulnerabilidades que deben revisarse con `npm audit`.

## Recomendaciones de evolución

Prioridad alta:

- Extraer IDs públicos a variables `PUBLIC_*`.
- Añadir script de validación técnica, por ejemplo `astro check`.
- Revisar `npm audit` y actualizar dependencias cuando sea seguro.
- Comprobar cumplimiento de consentimiento antes de cargar tracking.

Prioridad media:

- Separar la lógica del formulario en módulos cliente más pequeños.
- Centralizar configuración de servicios externos.
- Añadir documentación de entornos: local, staging y producción.
- Definir un flujo interno de QA para formularios y conversiones.

Prioridad futura:

- Sustituir EmailJS por endpoint propio del SaaS si se necesita trazabilidad, validación server-side, CRM o antifraude más robusto.
- Mover búsqueda de municipios a API si se amplían países o datasets.
- Añadir pruebas end-to-end para el formulario crítico.

## Convenciones internas

- Mantener componentes Astro pequeños salvo secciones con lógica específica.
- No introducir lógica sensible en cliente.
- Usar `public/` solo para assets estáticos que deban servirse desde raíz.
- Antes de tocar `Layout.astro`, revisar impacto en analítica, consentimiento, SEO y scripts globales.
- Antes de tocar `ContactCTA.astro`, probar formulario completo de forma manual.
- Ejecutar build antes de entregar cambios.

