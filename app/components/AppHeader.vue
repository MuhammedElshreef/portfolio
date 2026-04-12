<script setup lang="ts">
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>
<template>
  <div
    class="fixed bottom-2 sm:bottom-4 mx-auto left-1/2 transform -translate-x-1/2 z-10"
  >
    <div
      class="bg-muted/80 backdrop-blur-sm rounded-full px-2 sm:px-4 border border-border shadow-lg shadow-neutral-950/5 text-lg sm:text-xl text-muted-foreground"
    >
      <div class="flex items-center justify-center gap-2 sm:gap-4 h-10">
        <NuxtLink
          to="https://github.com/MuhammedElshreef"
          target="_blank"
          class="hover:text-foreground transition-colors"
        >
          <Icon name="lucide:github" class="inline-block h-5 w-5 mt-1" />
        </NuxtLink>

        <div class="w-px h-4 bg-border" />

        <NuxtLink
          to="/Elshreef-CV.pdf"
          target="_blank"
          class="hover:text-foreground transition-colors"
        >
          <Icon name="lucide:file-text" class="inline-block h-5 w-5 mt-1" />
        </NuxtLink>

        <div class="w-px h-4 bg-border" />

        <ToggleDarkMode />

        <div class="w-px h-4 bg-border" />

        <button
          @click="scrollToTop"
          class="hover:text-foreground transition-colors cursor-pointer"
        >
          <Icon name="lucide:arrow-up" class="inline-block h-5 w-5 mt-1" />
        </button>
      </div>
    </div>
  </div>
</template>
