<script setup lang="ts">
import { ref } from "vue";

const featProjects = ref([
  {
    title: "Knight",
    description:
      "knight is a landing page website It was built by vanilla js and tailwindcss I built this website to test my skills on tailwind",
    techs: ["HTML", "CSS", "JavaScript", "TailwindCSS", "Netlify"],
    img: "/images/knight-image.webp",
    alt: "knight",
    link: [
      {
        url: "https://github.com/MuhammedElshreef/knight-landing-page",
        img: "/icons/github-icon.svg",
      },
      {
        url: "https://knight-landing-page.netlify.app/",
        img: "/icons/external-link.svg",
      },
    ],
  },
  {
    title: "Fylo",
    description:
      "Fylo is a landing page website and it was my first website ever it has a special place in my heart,It was built by tailwindcss I built this website to practice on tailwind",
    techs: ["HTML", "CSS", "JavaScript", "TailwindCSS", "Netlify"],
    img: "/images/fylo-image.webp",
    alt: "fylo",
    link: [
      {
        url: "https://github.com/MuhammedElshreef/fylo-landing-page",
        img: "/icons/github-icon.svg",
      },
      {
        url: "https://fylo-frontend-mentor-landing-page.netlify.app/",
        img: "/icons/external-link.svg",
      },
    ],
  },
  {
    title: "Space Tourism",
    description:
      "Space tourism is a multi-page website and it was my first project with vue I built this website to practice on vue",
    techs: ["HTML", "CSS", "TailwindCSS", "JavaScript", "vue"],
    img: "/images/space-tourism-image.webp",
    alt: "fylo",
    link: [
      {
        url: "https://github.com/MuhammedElshreef/Space-tourism",
        img: "/icons/github-icon.svg",
      },
      {
        url: "https://space-tourism-dusky-seven.vercel.app/",
        img: "/icons/external-link.svg",
      },
    ],
  },
]);
</script>

<template>
  <div id="projects">
    <div class="flex flex-col gap-4 lg:gap-6 lg:pb-0 pb-14 lg:py-16">
      <div class="flex lg:gap-6 gap-2 justify-center items-center">
        <div class="flex flex-col gap-2">
          <p class="lg:text-4xl text-xl font-bold text-primary">
            Other Noteworthy Projects
          </p>
          <span class="text-azure text-center">( more coming soon.. )</span>
        </div>
      </div>
      <div
        class="grid lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8 ;g:py-24 py-2"
      >
        <div v-for="(project, index) in featProjects" :key="index">
          <div
            class="bg-[#333333] space-y-3 overflow-hidden rounded-md shadow-2xl lg:h-[370px] relative"
          >
            <div class="relative overflow-hidden">
              <img :src="project.img" class="w-full h-40 transition-all" />
            </div>
            <div class="px-4 py-4 space-y-1">
              <div class="flex justify-between items-center">
                <h3 class="font-medium text-secondary text-2xl">
                  {{ project.title }}
                </h3>
              </div>
              <div class="flex flex-col">
                <p class="text-sm text-paragraph">
                  {{ project.description }}
                </p>
                <div
                  class="flex justify-between gap-2 text-azure py-4 lg:absolute bottom-0 left-0 right-0 lg:px-4"
                >
                  <div class="flex gap-2 text-xs flex-wrap">
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
