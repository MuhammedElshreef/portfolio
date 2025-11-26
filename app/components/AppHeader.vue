<script setup lang="ts">
const links = [
  { name: "Home", to: "/" },
  { name: "Projects", to: "/projects" },
  // { name: "About", to: "/about" },
  // { name: "Contact", to: "/contact" },
];
</script>
<template>
  <div
    class="fixed top-2 sm:top-4 mx-auto left-1/2 transform -translate-x-1/2 z-10"
  >
    <div
      class="bg-muted/80 backdrop-blur-sm rounded-full px-2 sm:px-4 border border-border shadow-lg shadow-neutral-950/5 text-lg sm:text-xl text-muted-foreground"
    >
      <div class="flex items-center justify-center gap-2 sm:gap-4 h-10">
        <NuxtLink
          v-for="link in links"
          :key="link.name"
          :to="link.to"
          active-class="text-foreground"
          inactive-class="text-muted-foreground"
          class="hover:text-foreground transition-colors text-sm sm:text-base"
        >
          {{ link.name }}
        </NuxtLink>
        <div
          class="flex items-center justify-center gap-2 border-l pl-2 sm:pl-4"
        >
          <NuxtLink to="https://github.com/MuhammedElshreef" target="_blank">
            <Icon
              name="lucide:github"
              class="inline-block h-5 w-5 text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors hover:scale-110 cursor-pointer mt-2"
            />
          </NuxtLink>
          <NuxtLink to="/Elshreef-CV.pdf" target="_blank">
            <Icon
              name="lucide:file-text"
              class="inline-block h-5 w-5 text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors hover:scale-110 cursor-pointer mt-2"
            />
          </NuxtLink>
          <ToggleDarkMode />
        </div>
      </div>
    </div>
  </div>
</template>
