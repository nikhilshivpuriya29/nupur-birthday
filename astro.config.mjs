import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [tailwind()],

  // ADD THIS LINE
  output: 'server',

  compressHTML: true,

  build: {
    inlineStylesheets: 'auto'
  },

  adapter: cloudflare()
});