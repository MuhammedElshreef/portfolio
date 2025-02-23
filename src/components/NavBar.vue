<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const links = ref([
  { name: "about", url: "#about" },
  { name: "experience", url: "#experience" },
  { name: "projects", url: "#projects" },
  { name: "contact", url: "#contact" },
]);

// const currentHash = ref<string>(window.location.hash);

// const scrollToSection = (url: string) => {
//   const section = document.querySelector(url);
//   if (section) {
//     section.scrollIntoView({ behavior: "smooth" });
//   }
// };

// const updateCurrentHash = () => {
//   const sections = links.value.map((link) => document.querySelector(link.url));
//   const scrollPosition = window.scrollY + window.innerHeight / 2;

//   for (const section of sections) {
//     if (section) {
//       const sectionElement = section as HTMLElement;
//       const sectionTop = sectionElement.offsetTop;
//       const sectionBottom = sectionTop + sectionElement.offsetHeight;

//       if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
//         currentHash.value = `#${sectionElement.id}`;
//         break;
//       }
//     }
//   }
// };

// let observer: IntersectionObserver | null = null;

// onMounted(() => {
//   window.addEventListener("scroll", updateCurrentHash);

//   observer = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           currentHash.value = `#${entry.target.id}`;
//         }
//       });
//     },
//     {
//       rootMargin: "0px",
//       threshold: 0.5,
//     }
//   );

//   links.value.forEach((link) => {
//     const section = document.querySelector(link.url);
//     if (section) {
//       observer?.observe(section);
//     }
//   });
// });

// onUnmounted(() => {
//   window.removeEventListener("scroll", updateCurrentHash);
//   if (observer) {
//     observer.disconnect();
//   }
// });
</script>

<template>
  <div class="fixed transform -translate-x-1/2 left-1/2 z-50 top-5">
    <nav>
      <div
        class="backdrop-blur-2xl border-[1px] border-paragraph rounded-3xl flex items-center justify-center py-3 px-8 transition-all duration-300 ease-in-out"
      >
        <ul class="flex items-center lg:gap-6 gap-4 text-paragraph">
          <li v-for="(link, index) in links" :key="link.name">
            <a
              class="text-md hover:text-azure hover:cursor-pointer capitalize transition-all duration-300 ease-in-out"
              :href="link.url"
            >
              {{ link.name }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
