import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'server',  // ADD THIS LINE
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
