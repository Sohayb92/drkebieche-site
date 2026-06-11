// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Domaine canonique : .fr (SEO local France = la cible), .com en redirection 301
  site: 'https://drkebieche.fr',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), sitemap()]
});