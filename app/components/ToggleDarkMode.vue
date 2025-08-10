<script setup lang="ts">
import { computed, ref, nextTick, type CSSProperties } from "vue";

const colorMode = useColorMode();

const isAnimating = ref(false);
const animationOverlayStyle = ref<CSSProperties>({});

const nextTheme = computed(() =>
  colorMode.value === "dark" ? "light" : "dark"
);

const switchTheme = () => {
  colorMode.preference = nextTheme.value;
};

const runFallbackAnimation = async (event: MouseEvent) => {
  if (isAnimating.value) return;

  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  isAnimating.value = true;

  animationOverlayStyle.value = {
    clipPath: `circle(0px at ${x}px ${y}px)`,
    backgroundColor:
      nextTheme.value === "dark" ? "hsl(222.2 84% 4.9%)" : "hsl(0 0% 100%)",
  };

  await nextTick();

  animationOverlayStyle.value.clipPath = `circle(${endRadius}px at ${x}px ${y}px)`;

  setTimeout(() => {
    switchTheme();
    isAnimating.value = false;
  }, 600);
};

const toggleTheme = (event: MouseEvent) => {
  if (document.startViewTransition) {
    const isDark = colorMode.value === "dark";

    const transition = document.startViewTransition(() => {
      switchTheme();
    });

    transition.ready.then(() => {
      const x = event.clientX;
      const y = event.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 600,
          easing: "cubic-bezier(.76,.32,.29,.99)",
          pseudoElement: isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    });
  } else {
    runFallbackAnimation(event);
  }
};
</script>

<template>
  <div>
    <div
      v-if="isAnimating"
      class="theme-transition-overlay"
      :style="animationOverlayStyle"
    />

    <ClientOnly>
      <UiButton
        variant="ghost"
        size="icon"
        class="relative h-8 w-8 p-0"
        aria-label="Toggle theme"
        @click="toggleTheme"
      >
        <Icon
          name="lucide:moon"
          class="absolute inset-0 m-auto h-5 w-5 origin-center transform transition-all duration-300 ease-in-out rotate-0 scale-100 dark:-rotate-90 dark:scale-0"
        />
        <Icon
          name="lucide:sun"
          class="absolute inset-0 m-auto h-5 w-5 origin-center transform transition-all duration-300 ease-in-out rotate-90 scale-0 dark:rotate-0 dark:scale-100"
        />
      </UiButton>
    </ClientOnly>
  </div>
</template>

<style>
.theme-transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
  transition: clip-path 600ms cubic-bezier(0.76, 0.32, 0.29, 0.99);
}

::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

.dark::view-transition-new(root) {
  z-index: 9999;
}
.dark::view-transition-old(root) {
  z-index: 1;
}

html:not(.dark)::view-transition-old(root) {
  z-index: 9999;
}
html:not(.dark)::view-transition-new(root) {
  z-index: 1;
}
</style>
