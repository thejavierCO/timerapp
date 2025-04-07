// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Enable Svelte to support Svelte components.
  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()],
  },
});