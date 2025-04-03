import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import svelte from "@astrojs/svelte";

import lottie from "astro-integration-lottie";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte(), lottie()]
});