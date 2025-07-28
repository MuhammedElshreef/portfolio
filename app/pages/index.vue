<script setup lang="ts">
const { data: info } = await useAsyncData("index", () => {
  return queryCollection("index").first();
});

useSeoMeta({
  title: info.value?.seo.title,
  description: info.value?.seo.description,
});
</script>

<template>
  <div class="flex flex-col justify-center space-y-12">
    <!-- me -->
    <!-- <div class="flex justify-between gap-2">
      <div class="flex-col flex flex-1 space-y-1.5">
        <h1
          class="flex items-center text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
        >
          {{ info?.title }}
        </h1>
        <p class="text-base text-muted-foreground sm:text-lg">
          {{ info?.description }}
        </p>
      </div>
      <NuxtImg
        src="/pfp.jpg"
        alt="Profile Picture"
        class="rounded-full lg:h-36 lg:w-36 w-24 h-24 object-cover"
      />
    </div> -->
    <div class="flex flex-col items-center gap-2">
      <NuxtImg
        src="/pfp.jpg"
        alt="Profile Picture"
        class="rounded-full lg:h-36 lg:w-36 w-24 h-24 object-cover"
      />
      <div class="flex-col flex flex-1 space-y-1.5 text-center">
        <h1
          class="text-2xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
        >
          {{ info?.title }}
        </h1>
        <div class="flex justify-center">
          <p class="text-sm text-muted-foreground sm:text-base lg:w-1/2">
            {{ info?.description }}
          </p>
        </div>
      </div>
    </div>
    <!-- about -->
    <div class="flex flex-col lg:flex-row justify-between gap-6 lg:divide-x-2">
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
          <p class="text-xs text-muted-foreground">
            {{ item?.date }}
          </p>
        </div>
      </div>
    </div>
    <!-- education -->
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
    <!-- skills -->
    <div class="flex flex-col space-y-4">
      <h2 class="text-2xl font-semibold">{{ info?.skills?.title }}</h2>
      <div class="flex flex-wrap gap-2">
        <UiBadge
          v-for="(item, index) in info?.skills?.items"
          :key="index"
          class="text-sm cursor-pointer"
        >
          {{ item.name }}
        </UiBadge>
      </div>
    </div>
    <!-- discover my projects on projects page -->
    <div class="flex flex-col items-center space-y-4">
      <h2 class="lg:text-4xl text-3xl font-semibold">Discover My Projects</h2>
      <p class="text-muted-foreground lg:w-2/3 text-center lg:text-lg">
        Check out my projects on the
        <NuxtLink to="/projects" class="underline text-primary"
          >Projects</NuxtLink
        >
        page to see what I've been working on.
      </p>
    </div>
    <!-- get in touch -->
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
  </div>
</template>
