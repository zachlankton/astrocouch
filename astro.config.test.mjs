import { defineConfig } from "astro/config";
import node from "@astrojs/node";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: "server",
  srcDir: "./INSTRUMENTED_SRC/src",
  adapter: node(),
  integrations: [svelte()],
});
