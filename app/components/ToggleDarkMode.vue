<script setup lang="ts">
// Helper to get color mode (works with Nuxt Color Mode)
import { type CSSProperties, computed, ref } from "vue";
const colorMode = useColorMode();

// Refs for the fallback animation state
const isAnimating = ref(false);
const animationOverlayStyle = ref<CSSProperties>({});

const nextTheme = computed(() =>
  colorMode.value === "dark" ? "light" : "dark"
);

const switchTheme = () => {
  colorMode.preference = nextTheme.value;
};

// CORRECTED fallback animation for Safari and other unsupported browsers
const runFallbackAnimation = (event: MouseEvent) => {
  if (isAnimating.value) return;

  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  // 1. PREPARE the initial style for the overlay BEFORE it is rendered.
  // It will start as an invisible 0px circle at the click position.
  animationOverlayStyle.value = {
    clipPath: `circle(0px at ${x}px ${y}px)`,
    // IMPORTANT: Use your actual theme's background colors here.
    // Using CSS variables is the best practice if you have them set up.
    backgroundColor: nextTheme.value === "dark" ? "#0a0a0a" : "#ffffff",
  };

  // 2. NOW, set isAnimating to true. The overlay will be added to the DOM
  // already styled as an invisible circle, preventing any "flash".
  isAnimating.value = true;

  // 3. Use a minimal timeout. This gives the browser a moment to paint the
  // initial state before we ask it to transition to the final state.
  setTimeout(() => {
    animationOverlayStyle.value.clipPath = `circle(${endRadius}px at ${x}px ${y}px)`;
  }, 20); // A tiny delay (20ms) is enough to ensure a smooth start.

  // 4. After the animation duration, switch the theme and clean up.
  // The timeout is the animation duration (600ms) + our small delay (20ms).
  setTimeout(() => {
    switchTheme();
    isAnimating.value = false;
  }, 620);
};

const toggleTheme = (event: MouseEvent) => {
  // This part remains the same, using the modern API when available
  // and the corrected fallback when not.
  if (document.startViewTransition) {
    // ... (Your original, unchanged View Transition logic goes here)
    const isDark = colorMode.value === "dark";
    const transition = document.startViewTransition(() => switchTheme());
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
        { clipPath: isDark ? [...clipPath].reverse() : clipPath },
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
