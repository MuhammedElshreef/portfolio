<script setup lang="ts">
const { data: info } = await useAsyncData("index", () => {
  return queryCollection("index").first();
});

const { data: projectsData } = await useAsyncData("projects", () => {
  return queryCollection("projects").first();
});

const imgErrors = reactive<Record<number, boolean>>({});

useSeoMeta({
  title: info.value?.seo.title,
  description: info.value?.seo.description,
});
</script>

<template>
  <div class="flex flex-col justify-center space-y-12">
    <!-- me -->
    <div class="flex justify-between gap-2">
      <Motion
        class="flex flex-col space-y-2 flex-1"
        :initial="{
          y: 20,
          opacity: 0,
        }"
        :animate="{
          y: 0,
          opacity: 1,
        }"
        :transition="{
          duration: 0.6,
          delay: 0.2,
        }"
      >
        <h1
          class="flex items-center text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
        >
          {{ info?.title }}
        </h1>
        <p class="text-base text-muted-foreground sm:text-lg">
          {{ info?.description }}
        </p>
      </Motion>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)',
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1,
        }"
      >
        <NuxtImg
          src="/pfp.jpg"
          alt="Profile Picture"
          class="rounded-full lg:h-36 lg:w-36 w-24 h-24 object-cover"
        />
      </Motion>
    </div>
    <!-- <div class="flex flex-col items-center gap-2">
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)',
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1,
        }"
      >
        <NuxtImg
          src="/pfp.jpg"
          alt="Profile Picture"
          class="rounded-full lg:h-36 lg:w-36 w-24 h-24 object-cover"
        />
      </Motion>
      <div class="flex-col flex flex-1 space-y-1.5 text-center">
        <Motion
          :initial="{
            y: 20,
            opacity: 0,
          }"
          :animate="{
            y: 0,
            opacity: 1,
          }"
          :transition="{
            duration: 0.6,
            delay: 0.2,
          }"
        >
          <h1
            class="text-2xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
          >
            {{ info?.title }}
          </h1>
        </Motion>
        <div>
          <Motion
            :initial="{
              y: 20,
              opacity: 0,
            }"
            :animate="{
              y: 0,
              opacity: 1,
            }"
            :transition="{
              duration: 0.6,
              delay: 0.3,
            }"
            class="flex justify-center"
          >
            <p class="text-sm text-muted-foreground sm:text-base lg:w-3/4">
              {{ info?.description }}
            </p>
          </Motion>
        </div>
      </div>
    </div> -->

    <Motion
      :initial="{
        y: 20,
        opacity: 0,
      }"
      :animate="{
        y: 0,
        opacity: 1,
      }"
      :transition="{
        duration: 0.6,
        delay: 0.4,
      }"
    >
      <div
        class="flex flex-col lg:flex-row justify-between gap-6 lg:divide-x-2"
      >
        <div class="flex flex-col space-y-4 flex-1">
          <h2 class="text-2xl font-semibold">{{ info?.about?.title }}</h2>
          <p class="text-muted-foreground">
            {{ info?.about?.description }}
          </p>
        </div>
        <div class="flex flex-col space-y-4 flex-1 lg:px-4">
          <h2 class="text-2xl font-semibold">{{ info?.experience?.title }}</h2>
          <div
            v-for="(item, index) in info?.experience?.items"
            :key="index"
            class="flex items-center space-x-2"
          >
            <div class="flex items-center space-x-2">
              <h3 class="text-sm text-muted-foreground font-semibold">
                {{ item?.position }}
                <NuxtLink
                  :to="item?.company.url"
                  target="_blank"
                  class="hover:underline"
                  :style="{ color: item?.company.color }"
                >
                  {{ item?.company.name }}
                </NuxtLink>
              </h3>
            </div>
            <div class="flex-1 border-b border-border h-1" />
            <p class="text-xs text-muted-foreground whitespace-nowrap">
              {{ item?.date }}
            </p>
          </div>
        </div>
      </div>
    </Motion>

    <Motion
      :initial="{
        y: 20,
        opacity: 0,
      }"
      :animate="{
        y: 0,
        opacity: 1,
      }"
      :transition="{
        duration: 0.6,
        delay: 0.5,
      }"
    >
      <div class="flex flex-col space-y-4">
        <h2 class="text-2xl font-semibold">{{ info?.education?.title }}</h2>
        <div
          v-for="(item, index) in info?.education?.items"
          :key="index"
          class="flex items-center space-x-2"
        >
          <NuxtImg
            :src="item.logo"
            alt="Institution Logo"
            class="lg:w-12 lg:h-12 w-8 h-8 rounded-full"
          />
          <div class="flex flex-col space-y-1 w-full">
            <h3 class="font-semibold flex justify-between">
              {{ item.institution }}
              <span class="text-muted-foreground text-sm">
                {{ item.date }}
              </span>
            </h3>
            <p class="text-xs text-muted-foreground">
              {{ item.degree }}
            </p>
          </div>
        </div>
      </div>
    </Motion>

    <div class="flex flex-col space-y-4">
      <Motion
        :initial="{
          y: 20,
          opacity: 0,
        }"
        :animate="{
          y: 0,
          opacity: 1,
        }"
        :transition="{
          duration: 0.6,
          delay: 0.6,
        }"
      >
        <h2 class="text-2xl font-semibold">{{ info?.skills?.title }}</h2>
      </Motion>
      <div class="flex flex-wrap gap-2">
        <Motion
          v-for="(item, index) in info?.skills?.items"
          :key="index"
          :initial="{
            opacity: 0,
            scale: 0.9,
          }"
          :animate="{
            opacity: 1,
            scale: 1,
          }"
          :transition="{
            duration: 0.3,
            delay: 0.6 + index * 0.05, // Staggered delay for each badge
          }"
        >
          <UiBadge class="text-sm cursor-pointer">
            {{ item.name }}
          </UiBadge>
        </Motion>
      </div>
    </div>

    <!-- Projects -->
    <div class="flex flex-col space-y-12">
      <Motion
        :initial="{ y: 20, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{ duration: 0.6, delay: 0.7 }"
      >
        <div class="flex-col flex flex-1 lg:space-y-4 space-y-2">
          <h2 class="text-2xl font-semibold">
            {{ projectsData?.projects.title }}
          </h2>
          <p class="text-sm text-muted-foreground sm:text-base">
            {{ projectsData?.projects.description }}
          </p>
        </div>
      </Motion>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Motion
          v-for="(project, index) in projectsData?.projects.items"
          :key="index"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{
            duration: 0.5,
            delay: 0.8 + index * 0.1,
          }"
        >
          <div class="flex flex-col rounded-lg border border-border overflow-hidden h-full">
            <div class="relative aspect-video">
              <NuxtImg
                v-if="project.image && !imgErrors[index]"
                :src="project.image"
                :alt="project.alt"
                class="w-full h-full object-contain bg-muted"
                @error="imgErrors[index] = true"
              />
              <div
                v-else
                class="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-muted relative overflow-hidden flex items-center justify-center"
              >
                <div class="absolute inset-0 opacity-10">
                  <div class="absolute -top-6 -right-6 w-32 h-32 rounded-full border-2 border-primary" />
                  <div class="absolute -bottom-4 -left-4 w-24 h-24 rounded-full border-2 border-primary" />
                  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-primary" />
                </div>
                <span class="text-xl font-bold text-foreground/70 z-10 px-4 text-center">
                  {{ project.title }}
                </span>
              </div>
            </div>
            <div class="flex flex-col flex-1 p-4 space-y-3">
              <h3 class="text-lg font-bold">{{ project.title }}</h3>
              <p class="text-sm text-muted-foreground line-clamp-3">
                {{ project.description }}
              </p>
              <div class="flex flex-wrap gap-1">
                <UiBadge v-for="tech in project.techs" :key="tech" class="text-xs">
                  {{ tech }}
                </UiBadge>
              </div>
              <div class="flex-1" />
              <div v-if="project.links?.length" class="flex items-center space-x-2 pt-1">
                <NuxtLink
                  v-for="link in project.links"
                  :key="link.url"
                  :to="link.url"
                  target="_blank"
                  class="text-sm text-[#50A2FF] hover:underline"
                >
                  {{ link.title }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </Motion>
      </div>
    </div>

    <!-- Get in Touch -->
    <Motion
      :initial="{
        y: 20,
        opacity: 0,
      }"
      :animate="{
        y: 0,
        opacity: 1,
      }"
      :transition="{
        duration: 0.6,
        delay: 0.8,
      }"
    >
      <div class="flex flex-col items-center space-y-4">
        <h2 class="lg:text-4xl text-3xl font-semibold">Get in Touch</h2>
        <p class="text-muted-foreground lg:w-2/3 text-center lg:text-lg">
          If you have any work-related inquiries, feel free to send me an
          <a
            href="mailto:muhammedelshreef@outlook.com"
            class="underline text-primary"
            >Email</a
          >
          with your specific question. I'll respond as soon as I can.
        </p>
      </div>
    </Motion>
  </div>
</template>
