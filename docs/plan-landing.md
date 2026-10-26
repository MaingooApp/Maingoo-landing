# Plan: nueva landing de Maingoo con vídeos por función

Documento de trabajo vivo. Si el chat se compacta o se cambia de sesión, **empezar leyendo este archivo** y seguir desde el primer paso sin marcar. Al terminar cada paso, marcarlo `[x]` y anotar el commit o el enlace.

Creado el 2026-10-25. Presentación de Maingoo: 2026-10-28.

## Contexto que no hay que volver a buscar

- **Repo de la landing:** `/Users/david/Developer/Maingoo-landing` (remoto `MaingooApp/Maingoo-landing`, rama de trabajo `main`). Ojo: `/Users/david/Developer/maingoo` es una plantilla Astroship que no es la landing; no tocarla.
  - Stack: Astro 5, Tailwind 3 (`@astrojs/tailwind`, `tailwind.config.ts`), npm.
  - `npm run dev` sirve `localhost:4321`; `npm run build` es la validación principal; `npm run check` lanza Astro check.
  - Normas propias en `AGENTS.md` del repo: copy en español, componentes en PascalCase y commits estilo `feat:`/`fix:` en español.
- **Despliegue:** `.github/workflows` despliega por FTP a `maingoo.tech` (Hostinger) con cada push a la rama `production`. **Nunca hacer push** (ni a `main` ni a `production`). Commits solo locales en `main`; el usuario decide cuándo publicar.
- **Landing actual (punto de partida):**
  - `src/pages/index.astro` lleva `Header`, `Hero`, `Features`, `Pricing`, `ContactCTA`, `FAQs` y `Footer`, más datos estructurados (Organization LSXEM S.L., SoftwareApplication, FAQPage). `Benefits.astro` existe pero no se usa.
  - Páginas legales: `cookies`, `politica-privacidad` y `terminos-servicio`. Se mantienen.
  - Hero: «Gestiona tu restaurante con Inteligencia Artificial», con CTA «Solicitar Acceso a la Beta» y «Pregunta a Maingoo», que abre `ChatWidget`.
  - `Features`: 6 tarjetas con modal. **Promete cosas que la app no tiene**, como delivery (Glovo, Uber), predicción de personal y RRHH.
  - `Pricing`: beta gratis, más los planes Profesional y Empresarial «Próximamente».
  - `ContactCTA`: formulario con EmailJS, captcha, tipo de negocio y municipios (`src/data/municipios_spain.json`).
  - `ChatWidget`: asistente con webhook de n8n e IA local de Chrome.
  - **Conservar la lógica** del formulario, del chat, del captcha, el SEO y las páginas legales; el rediseño es visual y de contenido.
- **App de referencia (rediseño ya hecho):** `/Users/david/Developer/Maingoo-Front`.
  - `DESIGN.md`: marca, tokens, tonos y reglas de iconos.
  - Paleta de marca: primario `#4a8c68`, acción `#3a7154`, verde oscuro `#1A3C34`, menta `#F0F7F4`, fondo `#f1f5f9`, violeta IA `#7c3aed`, ámbar `#f59e0b`.
  - Tipografía Lato 400/700/900, radios de 10 px (control) y 14 px (tarjeta).
  - Iconos: solo Material Symbols Rounded.
  - El logo es el robot sin recolorear, sobre una pastilla `#f0f9f4`.
  - Eslogan aprobado: **«Gana tiempo. Maingoo hace el resto.»**
- **Canvases del rediseño (estilo de referencia):** Caja `https://claude.ai/artifact/7LfrBtMBin1492YUtu4jWj`, TPV `https://claude.ai/artifact/9qv9gGYWnBm5MpAqioDHmM`, Comandero `https://claude.ai/artifact/Qgoh59pMfbRjAqyrjWibdf`, KDS `https://claude.ai/artifact/5kqxqAroxnqGh8fvet9L1x`, Acceso `https://claude.ai/artifact/Fbd7T2pu1yJ6EAqt8inp1D`. Logo como asset: `/_blob/e3d405d5bcbbd7876033efad40c1b638` en el canvas del TPV; se copia con `from_url` + `asset_ids`.
- **Vídeo pitch existente:** `/Users/david/Developer/Maingoo-Front/video-pitch`. La carpeta está ignorada por git.
  - Remotion 4.0.484, 1920×1080, 30 fps.
  - `DESIGN-SPEC.md` recoge la dirección visual aprobada y la tabla de tarjetas de plano usadas.
  - `capture/` contiene Playwright contra el front local con la API interceptada: `session.mjs`, `mocks.mjs` y `fake-data.mjs`, con los datos ficticios de **Taberna La Encina**, el proveedor «Distribuciones Hnos. Ruiz, S.L.», el CIF B00000000 y el usuario «Álex».
  - `src/capabilities.json` lista las 24 capacidades que se enseñan.
  - `public/audio` tiene la música y los efectos.
- **Skill de vídeo:** `video-shotcraft`, instalada en `~/.claude/plugins/cache/anthropic-plugin-directory/video-shotcraft/1.0.0-5ddbf521038b/`.
  - Antes de producir hay que elegir modo: plantilla Ink Press, creación autónoma o cocreación.
  - Las tarjetas están en `references/shots/` y se validan contra `gallery/api/library.json`. Cada tarjeta tiene su demo en `demos/`.
  - Reglas clave: capturas reales de la app, datos ficticios congelados antes de capturar, un solo efecto protagonista por plano, dejar respirar al final y, si hay música, cortes en el beat.
- **Front local:** `npm start` en Maingoo-Front sirve `localhost:4200`, y `.claude/launch.json` («front-http») sirve `localhost:4300`. El usuario local de pruebas está en la memoria del proyecto. Para capturar se usan siempre los mocks; nada de datos reales en pantalla.
- **Disco del Mac:** quedan unos 27 GB libres tras la limpieza del 2026-10-25. Los renders de Remotion y la caché de Angular (`.angular/`) crecen rápido: borrar `.angular/cache` si hace falta.
- **Reglas del usuario (memoria):**
  - Responder siempre en español.
  - Diseñar en el canvas y esperar aprobación antes de programar.
  - Un commit local por vista o sección, sin push ni despliegues.
  - Producción apagada hasta la presentación.

## Funciones que deben aparecer (todas con vídeo)

Las 24 capacidades del pitch, más las añadidas en el rediseño, agrupadas en **18 clips de 5–10 s** (máximo 15 s). Cada función aparece al menos en un clip.

| # | Clip | Funciones que cubre | Vista real que se graba (Maingoo-Front) |
|---|---|---|---|
| 1 | Facturas que se leen solas | Facturas, Proveedores | `/facturas`: subida → lectura de la IA → detalle con líneas y stock aplicado |
| 2 | Albaranes sin duplicados | Albaranes | Detalle de factura con albaranes agrupados y aviso «Albarán repetido» |
| 3 | Revisiones de la IA | Revisiones de la IA | `/incidencias-inventario` → paso guiado en `/facturas/detalle/:id?revisar=1` |
| 4 | Costes que avisan | Costes y márgenes, Análisis de proveedores | Ficha de producto con el KPI de subida de coste e historial; comparativa de proveedores |
| 5 | Inventario y recuento | Inventario, Recuento | `/inventario` y `/inventario/recuento` en tablet |
| 6 | Recetas, escandallos y alérgenos | Recetas y escandallos, Alérgenos, Crear artículo con IA | `/articulos/:id` y «Crear artículo con Maingoo AI» |
| 7 | TPV | TPV | `/ventas`: plano de sala → carta con fotos → cobrar y dividir cuenta |
| 8 | Comandero | Comandero | `/dispositivo/terminal/*` en móvil, con PIN, carta, pedido y envío a cocina |
| 9 | Pantalla de cocina | Cocina | `/dispositivo/cocina` con la urgencia por tiempo y «Marcar lista» |
| 10 | Plano de sala | Plano de sala | Editor `/ventas/configuracion/salas/:id/plano` con importación desde imagen |
| 11 | Cierre de caja | Cierre de caja | `/ventas/caja` con apertura, arqueo y cierre guiado |
| 12 | Informes que llegan solos | Informes PDF y Excel, Envío por correo, Informes de ventas | `/ventas/informes` + propuesta del chat «Enviar informe por correo» |
| 13 | Pregúntale a Maingoo AI | Chat con la IA | Chat lateral: pregunta → respuesta con gráfica |
| 14 | Llámale | Llamada con la IA | Franja de llamada con barras de voz y respuesta |
| 15 | APPCC y sensores de temperatura | APPCC, Temperaturas (sensores IoT) | `/appcc` con estado general y alerta de temperatura → `/appcc/:deviceId` con 24 h y PDF del mes |
| 16 | Maquinaria y utensilios | Maquinaria | `/articulos/equipo` |
| 17 | Tu gestoría al día | Gestoría | Ajustes › Asesoría y envío de facturas a la gestoría |
| 18 | Equipo y control | Usuarios y permisos, Auditoría, Dispositivos | Ajustes › Usuarios (PIN del TPV), Actividad, emparejar dispositivos |

Para la presentación del 28-10, si falta tiempo, la prioridad es: 1, 13, 15, 7, 9, 8, 4, 12, 14 y luego el resto.

## Decisiones pendientes del usuario (preguntar antes del paso que las necesita)

1. **Fase 1.** Funciones prometidas que no existen: delivery (Glovo, Uber), predicción de personal y RRHH. Propuesta: quitarlas y enseñar solo las funciones reales de la tabla de abajo; RRHH, como mucho, como «próximamente».
2. **Fase 1.** Precios. Hoy: beta gratis más Profesional y Empresarial «Próximamente». Propuesta: mantenerlo hasta cerrar Stripe y la cuenta de prueba (memoria `trial-signup-future`), actualizando la lista de lo incluido.
3. **Fase 1.** Llamada a la acción principal. Hoy: «Solicitar acceso a la beta», que lleva al formulario de contacto. Propuesta: mantenerla con el eslogan nuevo; el registro abierto llegará con la cuenta de prueba.
4. **Fase 2.** Modo de video-shotcraft. Propuesta: **cocreación** solo hasta aprobar el mapa de planos de los 18 clips, y luego autónomo por clip.
5. **Fase 2.** Sonido. Propuesta: clips **sin audio** (en la landing se reproducen en silencio, en bucle y con `playsinline`), así que no hace falta sincronizar con el beat.
6. **Fase 2.** Formato. Propuesta: 1600×1000 (16:10, como la app) para escritorio y 720×1280 para los clips de comandero; MP4 H.264 + WebM, menos de 1,5 MB por clip y póster JPG.

## Fase 1: rediseño de la landing

Regla: primero el canvas y la aprobación; después el código.

- [x] 1.1 Leer `DESIGN.md` y los canvases de referencia. Inventariar el contenido actual de `src/pages` y `src/components` (resumen en Contexto).
- [x] 1.2 Responder las decisiones 1–3 con el usuario (2026-10-25: acepta las 3 propuestas: solo funciones reales, precios beta como hoy y CTA «Solicitar acceso a la beta»).
- [x] 1.3 Crear el canvas «Maingoo — Landing» (`https://claude.ai/artifact/Lx9oAWZ682i6m1vucUAWfF`; archivos en el scratchpad `canvas-landing/project/`; pósteres con capturas reales y datos de prueba del pitch) (tipo Design, `quickstart` intent `design`) con tableros a 1440 de ancho y 390 en móvil:
  - Navegación con logo, enlaces y CTA.
  - Hero con el eslogan y el hueco del vídeo principal.
  - El problema: tiempo perdido en facturas, costes que suben y papeles de APPCC.
  - Cómo trabaja: la IA propone y tú confirmas (patrón de propuesta de DESIGN.md).
  - Rejilla de funciones agrupada en Compras y costes, Servicio (TPV, comandero, cocina, caja), Cocina segura (APPCC e IoT), Tu asistente (chat y voz) y Administración. Cada tarjeta lleva el hueco de su clip, con póster de marca hasta la fase 2.
  - Prueba social si existe: no inventar logos ni testimonios.
  - Precios, contacto y pie.
  - Todo en claro y oscuro.
- [x] 1.4 Aprobación del usuario y ajustes (textos: Maingoo lo resuelve solo y solo pregunta si tiene dudas, sin enfatizarlo fuera de «Cómo trabaja»; fuera «Nunca subiremos tu precio…»).
- [x] 1.5 Implementar en Astro (commit `85f2626`, uno solo para la vista):
  1. Tokens: Lato, la paleta y los radios en `tailwind.config.ts` (Tailwind 3) y `src/styles/global.css`. Material Symbols como SVG inline o paquete local, sin CDN nuevos.
  2. Layout y navegación.
  3. Hero.
  4. Secciones.
  5. Componente `FeatureClip.astro`: `<video muted loop playsinline preload="none" poster>` que solo se reproduce al estar visible (IntersectionObserver) y respeta `prefers-reduced-motion`, en cuyo caso muestra el póster.
  6. Precios y contacto.
  7. Retirar lo que no se use: `Benefits.astro` y las promesas falsas.
  8. SEO: actualizar título, descripción, datos estructurados (FAQ incluido) e imagen Open Graph con el eslogan nuevo.
- [x] 1.6 Verificar (build y check limpios; revisado a 1440 y 375, claro y oscuro, filtro, formulario con 246 prefijos y sin scroll horizontal; el reCAPTCHA da «clave no válida» en localhost porque la clave es solo de maingoo.tech):
  - `npm run build` y `npm run check` sin errores.
  - Revisión en el navegador a 1440 y 390, en claro y oscuro.
  - Sin scroll horizontal, contraste AA, foco visible y textos en español.
  - El formulario de contacto, el chat y el menú móvil siguen funcionando. No enviar el formulario de verdad.
- [x] 1.7 Actualizar `AGENTS.md` de la landing (estructura, tokens, FeatureClip, tema y despliegue).
- [ ] 1.8 Pendiente menor: nueva imagen Open Graph con el eslogan (sigue `maingo_origin.png`).

## Fase 2: vídeos cortos por función

- [x] 2.1 Elegir el modo de video-shotcraft (decisión 4): cocreación. Leer `SKILL.md` y, según el modo, `references/pipeline.md` o `references/guided-free-creation.md`.
- [x] 2.2 Crear el proyecto Remotion `Maingoo-Front/video-landing/`, ignorado por git como `video-pitch`.
  - Copiar la base de `video-pitch`: `capture/`, `src/lib`, `theme.ts` y `remotion.config.ts`.
  - Una composición por clip (`Clip01Facturas` …) desde un `Root.tsx` común.
  - Reutilizar `DESIGN-SPEC.md` como dirección visual y ampliarlo con una tabla de los 18 clips.
- [x] 2.3 Datos ficticios: ampliar `fake-data.mjs` y `mocks.mjs` para cada vista nueva.
  - TPV y comandero con mesas, carta con fotos y pedidos.
  - KDS con comandas a 2, 12 y 17 min.
  - Caja.
  - APPCC con 3–4 sensores (cámara, congelador, botellero), lecturas de 24 h y una alerta fuera de rango.
  - Maquinaria, gestor, usuarios y auditoría.
  - Congelar los datos antes de capturar. Nada de datos del entorno local en pantalla.
- [x] 2.4 Mapa de planos de los 18 clips: tarjeta de video-shotcraft por clip, duración, guion de 1–2 frases y vista o estado. Validar los nombres de tarjeta en `gallery/api/library.json` y leer el TSX de su demo. **Aprobación del usuario.**
### Guion de los clips (propuesta para aprobar en 2.4)

**Modo:** cocreación (skill video-shotcraft). Producto, datos y dirección visual vienen de este plan y de `video-pitch/DESIGN-SPEC.md`. Se salta la comparativa de styleframes porque la marca está fijada en `DESIGN.md` y el pitch ya se aprobó con ella.

**Reglas comunes a todos los clips:**
- Formato 1600×1000 (16:10), 30 fps, sin audio.
- Sin subtítulos: la tarjeta de la landing ya lleva el título, y a ese tamaño el texto no se leería.
- Habla la interfaz real capturada con los mocks (Taberna La Encina), con un solo movimiento protagonista por plano.
- Bucle limpio: los últimos 12 fotogramas funden con el primero.
- Movimiento con la curva de la app `cubic-bezier(0.16,1,0.3,1)`.
- Los estados de color siguen DESIGN.md: urgencia de cocina en ámbar a partir de 10 min y en rojo a partir de 15; la IA en violeta.
- Mensaje: Maingoo lo resuelve solo; la idea de que pregunta cuando duda solo aparece donde la app de verdad pregunta (clip 03).

| # | Clip (`clip` id) | s | Tarjeta · variante | Qué se ve (vista y estado mock) | Movimiento protagonista → final |
|---|---|---|---|---|---|
| 00 | Panel (`panel`, hero) | 10 | `cursor-flyover` | Panel de control de Taberna La Encina: ventas del día, sala, stock y compras | Vista aérea que recorre las cuatro zonas con el cursor de guía → vuelve al plano general |
| 01 | Facturas (`01-facturas`) | 9 | `scan-bracket-sweep` → `row-embed` | Factura HR-2026/04817 de Hnos. Ruiz → su detalle | Escuadras y barrido violeta sobre el papel; las 8 líneas encajan en la tabla y aparece «Stock aplicado» |
| 02 | Albaranes (`02-albaranes`) | 8 | `speed-ramp-freeze · freeze-annotate` | Detalle de factura con líneas agrupadas por albarán; un albarán marcado «Albarán repetido» | La tabla se desliza, se frena en el albarán repetido y una anotación dice «Ya contado en otra factura» |
| 03 | Revisiones de la IA (`03-revisiones`) | 8 | `doc-park-left-pill-deal` | «Revisiones de la IA» → factura con un paso «¿Qué producto es esta línea?» | La factura se aparca a la izquierda; las sugerencias llegan como pastillas; se elige una y queda resuelto |
| 04 | Costes (`04-costes`) | 8 | `spotlight-hero-card` | Ficha del AOVE 5 L con el KPI +12,4 % y su historial | Foco, acercamiento y el KPI se eleva; un único barrido de luz ámbar; vuelve a su sitio |
| 05 | Inventario y recuento (`05-inventario`) | 8 | `type-and-filter` | Recuento en tablet: se busca «aceite», se filtra y se teclea la cantidad contada | Se escribe la búsqueda, la lista se filtra y la fila contada se confirma en verde |
| 06 | Recetas y alérgenos (`06-recetas`) | 9 | `product-card-progressive-assemble` | «Crear artículo con Maingoo AI» → ficha de la receta con escandallo y alérgenos | La ficha se arma por partes (ingredientes, coste por ración, margen, iconos de alérgenos) |
| 07 | TPV (`07-tpv`) | 10 | `input-trigger-moves · cursor-performance` | TPV de escritorio: plano de Terraza → Mesa 1 → carta con fotos → «Cobrar» | El cursor actúa en primera persona: toca la mesa, añade tres platos, envía a cocina y abre el cobro |
| 08 | Comandero (`08-comandero`) | 8 | `radial-ripple-phone-chips` | Móvil del comandero con la carta y el pedido de Terraza · Mesa 4 | El móvil queda en el centro; las pastillas «Mesa 4», «2 × Hamburguesa» y «Enviado a cocina» brotan a los lados |
| 09 | Pantalla de cocina (`09-cocina`) | 7 | `deck-deal-flyin` | KDS con las columnas Nuevas, En preparación y Listas | Las comandas se reparten como cartas en sus columnas; una pasa a ámbar por el tiempo |
| 10 | Plano de sala (`10-plano`) | 7 | `canvas-materialize-moves · panel-to-canvas` | Editor del plano: foto de la terraza → mesas y barra colocadas | La foto se convierte en el plano editable; las mesas se materializan en su sitio |
| 11 | Cierre de caja (`11-caja`) | 8 | `odometer-digit-roll` | Caja: arqueo guiado del turno | El total contado gira hasta 1.467,00 € y la diferencia se fija en 0,00 € con «Cuadra» |
| 12 | Informes (`12-informes`) | 8 | `document-typewriter-reveal` → `icon-performance-moves · pop-burst-confirm` | Informe de ventas del mes generado → propuesta «Enviar informe por correo» | El informe se escribe solo; al pulsar «Enviar», el check de confirmación estalla |
| 13 | Chat (`13-chat`) | 9 | `ai-stream-response` | Chat lateral: «¿Qué platos me dejan menos margen?» | Primero llega el resumen; después la gráfica y la tabla bloque a bloque; queda en reposo |
| 14 | Llamada (`14-llamada`) | 7 | `voice-waveform-live` | Franja de llamada con Maingoo (verde tú, violeta Maingoo) y la respuesta | Barras de voz vivas; la respuesta y su gráfica aparecen mientras habla |
| 15 | APPCC y sensores (`15-appcc`) | 10 | `chart-live-moves · oscilloscope-stream` | Página del sensor «Botellero»: lectura en vivo de 24 h con el rango 2–8 °C | La línea avanza en directo, cruza los 8 °C, salta la alerta «Fuera de rango» y se ve el botón del PDF del mes |
| 16 | Maquinaria (`16-maquinaria`) | 6 | `wall-reveal-moves · bento-light-up` | Máquinas y utensilios (horno, abatidor, cámara, cortadora…) | Las tarjetas del equipo se iluminan en cascada |
| 17 | Gestoría (`17-gestoria`) | 6 | `paper-plane-messenger` | Ajustes › Asesoría con los datos del gestor → propuesta del chat «Enviar informe de compras a tu gestor» | Al enviar, un avión de papel cruza de Maingoo a la tarjeta del gestor |
| 18 | Equipo y control (`18-equipo`) | 8 | `avatar-bracket-carousel` | Usuarios con sus roles (Encargada, Camarero, Cocina), PIN del TPV, dispositivos y actividad | Un mismo marco va mostrando cada rol con sus permisos |

Pendiente al aprobar:
- Corregir en `src/data/features.ts` el texto del clip 17: hoy dice «Comparte las facturas con tu asesoría», que la app no hace.
- Los clips 00, 08 y 10 necesitan mocks nuevos (comandero, foto de plano).

- [x] 2.5 Capturar las texturas 2x de cada vista: `node capture/capture.mjs <clip>` contra el front local.
- [x] 2.6 Producir y renderizar clip a clip.
  - Revisar cada uno con fotogramas fijos antes del render final.
  - Exportar MP4 + WebM + póster a `Maingoo-landing/public/videos/<clip>.{mp4,webm,jpg}`.
- [x] 2.7 Conectar los clips en `FeatureClip` y revisar en el navegador: peso total, carga diferida y reproducción en móvil.
- [x] 2.8 Commit local en la landing con los clips. El proyecto Remotion se queda fuera de git.

### Estado de la fase 2 (25-10-2026, para quien siga)

**Hechos y renderizados**: los 19 clips (mp4 sin audio + webm + jpg en `public/videos/`). Revisión final independiente hecha el 26-10-2026: sin bloqueantes ni datos reales. Corregido tras ella: el bucle ya no superpone dos encuadres (funde al fondo y vuelve), el chat dice «Listo, este es el correo para tu gestora», encuadres de 16 y 18, tarjeta blanca en 03. El webm se codifica en rango de TV (`-color_range tv`): en rango completo Chrome no lo decodifica. `scripts/render-all.sh` vuelve a renderizar los 19.

**Pie del chat**: la app ya dice «Gana tiempo. Maingoo hace el resto.» (Maingoo-Front `51031a9`) y las capturas con chat se rehicieron (`scripts/recapture-chat.sh`). Mejoras menores anotadas en la revisión: 12 y 17 comparten propuesta de correo; 14 lleva la línea azul de la gráfica de la app; 11 arranca en «000,00».

**Cómo se trabaja** (todo en `Maingoo-Front/video-landing/`, ignorado por git):
- Front de capturas: `ng serve --port 4300` (configuración `front-http` de `Maingoo-Front/.claude/launch.json`); backend local en el 3000. Exportar `MG_BASE=http://localhost:4300` antes de capturar.
- Capturas: `cd capture && node capture.mjs <paso>`; pasos existentes: `invoice`, `product`, `dashboard`, `chat`, `voice`, `informes`, `equipo`, `usuarios`, `asesoria`, `sensor`, `caja`, `tpv`, `plano`, `kds`, `comandero`. Guardan texturas 2x/3x en `public/textures/` y cajas en `src/layout.json`. `probe.mjs <ruta> <nombre>` saca una captura rápida a `capture/sweep/`; `reqs.mjs <ruta>` lista las llamadas a la API.
- Datos ficticios en `capture/mocks.mjs` (Taberna La Encina; nada real en pantalla): informes, caja abierta (esperado 502,10 €), sensores (`MG_IOT_ALARM=1` pone el Botellero por encima de 6 ºC), equipo, gestora Carmen Ortega (`carmen@ortega.example`), personas, carta de 15 platos, salas renombradas (Terraza con plano ficticio, Comedor, Barra, Reservado) y líneas de pedido del TPV simuladas en memoria (`ORDERS`: alta de línea, enviar a cocina y cambio de cantidad), porque el backend rechaza la carta ficticia.
- Clips: un componente por clip en `src/clips/`, registrado en `src/Root.tsx` (1920×1200, 30 fps, envuelto en `Loop`, que funde los últimos 12 f con el primero). Cada archivo cita la demo de video-shotcraft que adapta; leer siempre el TSX de la demo antes de implementar.
- Revisión: `scripts/stills.sh <id> <fotogramas…>` deja jpg en `out/qa/`. Render: `scripts/render.sh <id> <fotograma-póster>` (1280×800, copia a la landing).

**Clip 07 TPV**: hecho (`src/clips/C07Tpv.tsx`, 10 s). El paso `tpv` saca plano, pedido vacío, una captura por línea añadida, enviado y diálogo de cobro; cada clic del cursor cambia a la captura siguiente. En el backend local sigue el pedido #2 de Terraza · Mesa 1 en borrador sin líneas reales (las líneas se simulan en `ORDERS`).

**Clip 10 Plano**: hecho (`src/clips/C10Plano.tsx`, 7 s). `capture/sketch.mjs` dibuja el croquis a lápiz (`out/croquis-terraza.jpg`, copiado a `public/textures/`); el paso `plano` lo sube al editor de Terraza, que entra vacío porque `mocks.mjs` simula `GET …/floor-plan` y responde `…/ai-draft` con el plano de Terraza más una barra (sin llamar a la IA real). El cursor y la onda compartidos están en `src/lib/Cursor.tsx` (07 y 10).

**Clips 08 Comandero y 09 Cocina**: hechos (`C08Comandero.tsx` 8 s, `C09Cocina.tsx` 7 s). `capture/device.mjs` abre una sesión de dispositivo simulada sin emparejar nada: escribe la identidad (y, en el comandero, el camarero) en IndexedDB, simula `GET /api/pos/device-context` y manda las llamadas con token de dispositivo con el token del propietario; el comandero usa el id de un dispositivo real del mismo tipo porque el bootstrap lo exige. `mocks.mjs` simula las comandas de cocina (`MG_NOW` fija la hora, `MG_KDS_RISK=1` deja la Mesa 7 en 11 min) y el pedido de la Mesa 4 (mesa ficticia) en `ORDERS`, incluida su ocupación, sin la cual el comandero lo descarta al reconciliar.

**Notas para los demás clips**: 02, 03, 05 y 06 necesitan datos ficticios nuevos (albarán repetido, revisión «¿Qué producto es esta línea?», recuento iniciado y artículo con escandallo). Al terminar, parar el servidor del 4300 y avisar al usuario de reiniciar su `ng serve` del 4200.

## Registro

| Fecha | Paso | Resultado / commit |
|---|---|---|
| 2026-10-25 | Plan | Creado este documento (se movió desde el repo equivocado `/Users/david/Developer/maingoo`) |
| 2026-10-25 | 1.3 | Canvas publicado con escritorio, móvil y oscuro |
| 2026-10-25 | 1.4–1.7 | Landing programada y verificada en local, commit `85f2626` (sin push) |
