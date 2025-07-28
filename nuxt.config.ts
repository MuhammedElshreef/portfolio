// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@nuxt/fonts",
    "motion-v/nuxt",
  ],
  // This is crucial for Nuxt to include your global Tailwind CSS
  css: ["~/assets/css/tailwind.css"],
  fonts: {
    families: [{ name: "Space Grotesk", provider: "google" }],
  },
  colorMode: {
    classSuffix: "",
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
});
