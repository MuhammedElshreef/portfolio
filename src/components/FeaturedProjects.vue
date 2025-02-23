<script setup lang="ts">
import { ref } from "vue";

const featProjects = ref([
  {
    title: "Zad Al-muslim",
    description:
      "Zad Al-Muslim is an Islamic resource platform offering Quran recitations, Islamic radio stations, and educational lessons. It provides easy access to spiritual resources, enhancing religious knowledge and practice with a user-friendly interface.",
    techs: ["Nuxt", "Vue", "Pinia", "TailwindCSS", "Shadcn/ui"],
    img: "/images/zad-almuslim.webp",
    alt: "Zad Al-muslim",
    link: [
      {
        url: "https://github.com/Ahmedelforjani/zad-almuslim",
        img: "/icons/github-icon.svg",
      },
      {
        url: "https://zad-almuslim.ly/",
        img: "/icons/external-link.svg",
      },
    ],
  },
  {
    title: "Movie App",
    description:
      "movie clone is a web application that was built by vue I wanted to build this web app to test my skills on vue and fetching data I used vue router for routing and pinia for the state management.",
    techs: ["Vercel", "TailwindCSS", "Pinia", "Vue-Router", "Vue"],
    img: "/images/movie-image.webp",
    alt: "Zad Al-muslim",
    link: [
      {
        url: "https://github.com/MuhammedElshreef/movie-clone",
        img: "/icons/github-icon.svg",
      },
      {
        url: "http://movie-clone-iota.vercel.app/",
        img: "/icons/external-link.svg",
      },
    ],
  },
  {
    title: "Easy Bank",
    description:
      "Easy Bank is a landing page website It was built by vanilla js and  tailwindcss I built this website to test my skills on tailwind.",
    techs: ["HTML", "CSS", "JavaScript", "TailwindCSS", "Netlify"],
    img: "/images/easy-image.webp",
    alt: "Zad Al-muslim",
    link: [
      {
        url: "https://github.com/MuhammedElshreef/easy-bank",
        img: "/icons/github-icon.svg",
      },
      {
        url: "https://easybank-frontend-mentor.netlify.app/",
        img: "/icons/external-link.svg",
      },
    ],
  },
]);
</script>

<template>
  <div id="projects">
    <div class="lg:flex flex-col gap-4 lg:gap-16 hidden">
      <div class="flex lg:gap-6 gap-2 items-center">
        <h1 class="lg:text-5xl text-2xl font-bold text-primary">
          <span class="text-azure">03.</span> Some Things I’ve Built
        </h1>
        <div class="h-[0.5px] lg:w-96 w-20 lg:mt-4 mt-2 bg-paragraph/50"></div>
      </div>
      <div
        v-for="(project, index) in featProjects"
        :key="index"
        class="flex justify-between py-12"
        :dir="index % 2 === 0 ? 'ltr' : 'rtl'"
      >
        <div class="w-3/5 group relative">
          <div
            class="bg-gradient-to-br from-azure/40 to-iris/40 absolute w-full h-full group-hover:opacity-0 transition-all duration-300 ease-in-out"
          ></div>
          <img :src="project.img" :alt="project.alt" />
        </div>
        <div
          class="flex flex-col justify-between gap-4 text-secondary relative text-end"
        >
          <div class="flex justify-between items-center">
            <div class="flex gap-4 self-end">
              <a
                v-for="(link, index) in project.link"
                :key="index"
                :href="link.url"
                target="_blank"
              >
                <img :src="link.img" />
              </a>
            </div>
            <div>
              <span class="font-bold text-azure w-full text-lg"
                >Featured Project</span
              >
              <h2 class="text-secondary text-3xl">{{ project.title }}</h2>
            </div>
          </div>
          <!-- at the middle -->
          <!-- trim text -->
          <p
            class="text-paragraph bg-[#333333] w-[450px] px-6 py-3 rounded-lg absolute top-3/5 transform -transalte-x -translate-y-1/2"
            :class="[
              index % 2 === 0
                ? '-translate-x-1/4 text-start'
                : 'translate-x-1/4 text-end',
            ]"
          >
            {{ project.description }}
          </p>
          <ul class="flex gap-2 px-4">
            <li
              v-for="(tech, index) in project.techs"
              :key="index"
              class="text-azure/60 hover:text-azure hover:cursor-pointer"
            >
              {{ tech }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="lg:hidden flex flex-col gap-4 lg:gap-6 py-14">
      <div class="flex lg:gap-6 gap-2 items-center">
        <h1 class="lg:text-5xl text-2xl font-bold text-primary">
          <span class="text-azure">03.</span> Some Things I’ve Built
        </h1>
        <div class="h-[0.5px] lg:w-96 w-44 lg:mt-4 mt-2 bg-paragraph/50"></div>
      </div>
      <div class="flex flex-col gap-8 py-6">
        <div v-for="(project, index) in featProjects" :key="index">
          <div
            class="bg-[#333333] space-y-3 overflow-hidden rounded-md shadow-2xl"
          >
            <div class="relative overflow-hidden">
              <img :src="project.img" class="w-full h-40 transition-all" />
            </div>
            <div class="px-4 py-4 space-y-1">
              <div class="flex justify-between items-center">
                <h3 class="font-medium text-secondary text-2xl">
                  {{ project.title }}
                </h3>
                <span class="text-azure text-sm"> Featured Project </span>
              </div>
              <div class="flex flex-col">
                <p class="text-sm text-paragraph">
                  {{ project.description }}
                </p>
                <div class="flex justify-between gap-2 text-xs text-azure py-4">
                  <div class="flex gap-2 flex-wrap">
                    <span v-for="(tech, index) in project.techs" :key="index">
                      {{ tech }}
                    </span>
                  </div>
                  <a
                    v-for="(link, index) in project.link"
                    :key="index"
                    :href="link.url"
                    target="_blank"
                  >
                    <img :src="link.img" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
