import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({ site: 'https://khaledweka.github.io', base: '/', trailingSlash: 'ignore', build: { format: 'preserve' }, integrations: [mdx()] });
