<script setup lang="ts">
import { Analytics } from "@vercel/analytics/nuxt";
</script>
<template>
  <div>
    <NuxtLayout>
      <Analytics />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
