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

  integrations: [mdx(), sitemap({
    // Les pages noindex (404, légales) n'ont rien à faire dans le sitemap
    filter: (page) =>
      !page.includes('/404') &&
      !page.includes('/mentions-legales') &&
      !page.includes('/confidentialite') &&
      !page.includes('/cookies'),
  })]
});