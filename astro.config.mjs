// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // 'static' = every page is turned into a plain .html file at build time.
  // That's what lets this run on normal cPanel hosting: just upload dist/.
  output: 'static',
});
