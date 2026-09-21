import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gonganus.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
