<script setup lang="ts">
import { ref, watch } from "vue";

const activeButton = ref(0);

const experience = ref([
  {
    title: "Front-end developer ",
    company: "Mataa",
    date: "Jan 2024 - Apr 2024",
    description:
      "Mataa app, is the largest shopping application in Libya, specializing in providing original products from renowned international brands. Their goal is to offer the best shopping experience to customers across all Libyan cities.",
    url: "https://mataa.app/",
  },
]);
</script>

<template>
  <div id="experience" class="md:py-36">
    <div class="flex flex-col gap-4 lg:gap-6">
      <div class="flex lg:gap-6 gap-2 items-center">
        <h1 class="lg:text-5xl text-2xl font-bold text-primary">
          <span class="text-azure">02.</span> Where I've worked
        </h1>
        <div class="h-[0.5px] lg:w-96 w-20 lg:mt-4 mt-2 bg-paragraph/50"></div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <ul
          :class="[
            'flex lg:flex-col md:overflow-visible overflow-scroll py-4',
            { 'justify-center lg:justify-start': experience.length >= 1 },
          ]"
        >
          <li
            v-for="(exp, index) in experience"
            :key="index"
            class="px-2 text-paragraph"
          >
            <button
              class="text-lg font-semibold border-azure/40 lg:border-l-4 lg:border-b-0 border-b-2 hover:bg-azure/30 hover:cursor-pointer py-4 px-12 text-left"
              :class="{ 'border-azure/100 text-azure': activeButton === index }"
              @click="activeButton = index"
            >
              {{ exp.company }}
            </button>
          </li>
        </ul>
        <div class="flex flex-col gap-4 text-secondary">
          <h2 class="lg:text-3xl text-lg font-semibold">
            <span class="text-iris">{{ experience[activeButton].title }}</span>
            <a
              class="text-azure hover:border-b-2"
              :href="experience[activeButton].url"
              target="_blank"
              >@ {{ experience[activeButton].company }}</a
            >
          </h2>
          <p>{{ experience[activeButton].date }}</p>
          <p class="text-paragraph">
            {{ experience[activeButton].description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
