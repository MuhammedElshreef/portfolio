<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const links = ref([
  { name: "about", url: "#about" },
  { name: "experience", url: "#experience" },
  { name: "projects", url: "#projects" },
  { name: "contact", url: "#contact" },
]);

const currentSection = ref<string>("");

const scrollToSection = (url: string) => {
  const section = document.querySelector(url);
  if (section) {
    const sectionElement = section as HTMLElement;
    const sectionTop = sectionElement.offsetTop; 
    const offset = window.innerHeight * 0.4; 
    const targetPosition = sectionTop - offset; 

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }
};

const updateCurrentSection = () => {
  const sections = links.value.map((link) => document.querySelector(link.url));
  const scrollPosition = window.scrollY + window.innerHeight / 2;

  for (const section of sections) {
    if (section) {
      const sectionElement = section as HTMLElement;
      const sectionTop = sectionElement.offsetTop;
      const sectionBottom = sectionTop + sectionElement.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSection.value = sectionElement.id;
        break;
      }
    }
  }
};

let observer: IntersectionObserver | null = null;

onMounted(() => {
  window.addEventListener("scroll", updateCurrentSection);

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          currentSection.value = entry.target.id;
        }
      });
    },
    {
      rootMargin: "0px",
      threshold: 0.3,
    }
  );

  links.value.forEach((link: any) => {
    const section = document.querySelector(link.url);
    if (section) {
      observer?.observe(section);
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateCurrentSection);
  if (observer) {
    observer.disconnect();
  }
});
</script>

<template>
  <div class="fixed transform -translate-x-1/2 left-1/2 z-50 top-5">
    <nav>
      <div
        class="bg-[#333333]/10 backdrop-blur-2xl border-[1px] border-paragraph rounded-3xl flex items-center justify-center py-3 px-8 transition-all duration-300 ease-in-out"
      >
        <ul class="flex items-center lg:gap-6 gap-4 text-paragraph">
          <li v-for="(link, index) in links" :key="link.name">
            <a
              class="text-md hover:text-azure hover:cursor-pointer capitalize transition-all duration-300 ease-in-out"
              :class="{
                'text-azure': currentSection === link.url.slice(1),
              }"
              @click.prevent="scrollToSection(link.url)"
            >
              {{ link.name }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
