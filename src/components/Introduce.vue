<script setup lang="ts">
import { ref } from "vue";

const about = ref([
  {
    name: "muhammed alsayed",
    specialty: "Frontend Developer",
    links: [
      {
        url: "https://github.com/MuhammedElshreef",
        icon_link: "/icons/github-icon.svg",
      },
      {
        url: "https://www.linkedin.com/in/muhammed-alsayed-0611bb2a3/",
        icon_link: "/icons/linkedin-icon.svg",
      },
      {
        url: "mailto:muhammedelshreef@outlook.com",
        icon_link: "/icons/mail-icon.svg",
      },
    ],
    skills: [
      {
        title: "html",
        link: "/icons/html.svg",
        alt: "html",
      },
      {
        title: "css",
        link: "/icons/css.svg",
        alt: "css",
      },
      {
        title: "tailwindcss",
        link: "/icons/tailwind.svg",
        alt: "tailwindcss",
      },
      {
        title: "JavaScript",
        link: "/icons/js.svg",
        alt: "js",
      },
      {
        title: "TypeScript",
        link: "/icons/ts.svg",
        alt: "ts",
      },
      {
        title: "Astro",
        link: "/icons/astro.svg",
        alt: "Astro",
      },
      {
        title: "vue",
        link: "https://img.icons8.com/color/48/000000/vue-js.png",
        alt: "vue",
      },
      {
        title: "nuxt",
        link: "/icons/nuxt.svg",
        alt: "nuxt",
      },
    ],
  },
]);
</script>

<template>
  <div class="lg:pt-8 pt-24">
    <div class=" md:py-36 pb-14">
      <div class="flex flex-col gap-6 text-left space-y-4">
        <div class="flex flex-col gap-4 ">
          <p class="text-lg md:text-xl text-primary uppercase">
            hi,I'm {{ about[0].name }}
          </p>
          <div class="flex lg:flex-row flex-col lg:gap-24 gap-4">
            <h2
              class="text-5xl md:text-6xl font-medium leading-none uppercase bg-gradient-to-r from-azure to-iris bg-clip-text text-transparent"
            >
              {{ about[0].specialty }}
            </h2>
            <p class="text-lg md:text-3xl text-paragraph">
              <span class="uppercase text-azure"
                >I build things for the web.</span
              >
              <br />
              I'm a
              <span class="text-iris">Frontend Developer</span> based in Libya
              specializing in building websites, web applications, and
              everything in between.
            </p>
          </div>
        </div>

        <div class="flex gap-4">
          <a
            v-for="link in about[0].links"
            :key="link.url"
            :href="link.url"
            target="_blank"
            class="hover:cursor-pointer lg:px-2 lg:py-2 px-1 py-1 hover:bg-paragraph/10 rounded-lg border-2 border-paragraph transition-all duration-300 ease-in-out"
          >
            <img :src="link.icon_link" alt="icon" class="w-8 h-8" />
          </a>
        </div>

        <div class="relative overflow-x-hidden py-8">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-20"
          ></div>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-20"
          ></div>

          <div
            class="flex animate-scroll hover:animate-paused gap-12 md:gap-20 w-max"
          >
            <div
              class="flex items-center gap-2 group text-secondary capitalize hover:cursor-pointer transition-all duration-300"
              v-for="skill in about[0].skills"
              :key="skill.title"
            >
              <img
                :src="skill.link"
                class="h-10 w-10 object-contain transition-transform group-hover:scale-110 opacity-60"
                width="40"
                height="40"
                loading="lazy"
              />
              <span class="text-lg font-medium whitespace-nowrap">
                {{ skill.title }}
              </span>
            </div>

            <div
              class="flex items-center gap-2 group text-secondary capitalize hover:cursor-pointer transition-all duration-300"
              v-for="skill in about[0].skills"
              :key="skill.title"
            >
              <img
                :src="skill.link"
                class="h-10 w-10 object-contain transition-transform group-hover:scale-110 opacity-60"
                width="40"
                height="40"
                loading="lazy"
              />
              <span class="text-lg font-medium whitespace-nowrap">
                {{ skill.title }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* .animate-scroll:hover {
  animation-play-state: paused;
} */

@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  animation: scroll 20s linear infinite;
}
</style>
