<script setup lang="ts">
import { Analytics } from "@vercel/analytics/nuxt";
</script>
<template>
  <div>
    <NuxtLayout>
      <NuxtLoadingIndicator color="#50A2FF" />
      <Analytics />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
