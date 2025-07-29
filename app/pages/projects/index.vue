<script setup lang="ts">
const { data } = await useAsyncData("projects", () => {
  return queryCollection("projects").first();
});
useSeoMeta({
  title: data.value?.seo.title,
  description: data.value?.seo.description,
});
</script>

<template>
  <div class="flex flex-col justify-center space-y-12 ؛">
    <div class="flex-col flex flex-1 lg:space-y-8 space-y-4 lg:w-3/4">
      <Motion
        :initial="{ y: 20, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.6, delay: 0.1 }"
      >
        <h1
          class="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
        >
          {{ data?.projects.title }}
        </h1>
      </Motion>
      <Motion
        :initial="{ y: 20, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.6, delay: 0.2 }"
      >
        <div class="flex">
          <p class="text-sm text-muted-foreground sm:text-base">
            {{ data?.projects.description }}
          </p>
        </div>
      </Motion>
      <Motion
        :initial="{ y: 20, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.6, delay: 0.3 }"
      >
        <div>
          <a href="mailto:muhammedelshreef@outlook.com">
            <UiButton> Email me </UiButton>
          </a>
        </div>
      </Motion>
    </div>

    <Motion
      v-for="(project, index) in data?.projects.items"
      :key="index"
      :initial="{
        opacity: 0,
        x: index % 2 === 0 ? 50 : -50, // Slide from right for RTL, from left for LTR
      }"
      :animate="{
        opacity: 1,
        x: 0,
      }"
      :transition="{
        duration: 0.6,
        delay: 0.4 + index * 0.15, // Staggered delay for each project block
      }"
    >
      <div
        :dir="index % 2 === 0 ? 'rtl' : 'ltr'"
        class="flex lg:flex-row flex-col space-y-4 w-full lg:gap-8"
      >
        <div class="flex-1">
          <NuxtImg
            :src="project.image"
            alt="Project Image"
            class="object-contain rounded-lg"
          />
        </div>
        <div class="flex-1 flex flex-col lg:space-y-8 space-y-2" dir="ltr">
          <div class="flex flex-col space-y-2">
            <h2 class="text-xl font-bold">{{ project.title }}</h2>
            <p class="text-sm text-muted-foreground">
              {{ project.description }}
            </p>
            <div class="flex flex-wrap pt-2">
              <Motion
                v-for="(tech, techIndex) in project.techs"
                :key="techIndex"
                :initial="{ opacity: 0, scale: 0.9 }"
                :animate="{ opacity: 1, scale: 1 }"
                :transition="{
                  duration: 0.3,
                  delay: 0.4 + index * 0.15 + techIndex * 0.05, // Staggered delay for each tech badge
                }"
              >
                <UiBadge class="mr-1 mb-1">
                  {{ tech }}
                </UiBadge>
              </Motion>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <NuxtLink
              v-for="link in project.links"
              :key="link.url"
              :to="link.url"
              target="_blank"
              class="text-blue-500 hover:underline"
            >
              {{ link.title }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </Motion>
  </div>
</template>
