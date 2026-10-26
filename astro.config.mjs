// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://maingoo.tech',
  // Las páginas siguen siendo estáticas; solo /api/chat se ejecuta como función de Vercel
  adapter: vercel(),
  integrations: [tailwind(), sitemap()]
});
