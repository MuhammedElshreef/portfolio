<script setup lang="ts">
import { type CSSProperties, computed, ref } from "vue";
const colorMode = useColorMode();

const isAnimating = ref(false);
const animationOverlayStyle = ref<CSSProperties>({});
const fadeOut = ref(false);

const nextTheme = computed(() =>
  colorMode.value === "dark" ? "light" : "dark"
);

const switchTheme = () => {
  colorMode.preference = nextTheme.value;
};

const runFallbackAnimation = () => {
  if (isAnimating.value) return;

  // Fullscreen overlay instantly
  animationOverlayStyle.value = {
    clipPath: "none",
    backgroundColor: nextTheme.value === "dark" ? "#0a0a0a" : "#ffffff",
    opacity: "0",
  };

  isAnimating.value = true;
  fadeOut.value = false;

  // Fade in quickly
  setTimeout(() => {
    animationOverlayStyle.value.opacity = "1";
  }, 10);

  // Switch theme mid-animation
  setTimeout(() => {
    switchTheme();
    fadeOut.value = true;
  }, 300);

  // Remove overlay after fade-out
  setTimeout(() => {
    isAnimating.value = false;
  }, 500);
};

const toggleTheme = (event: MouseEvent) => {
  if (document.startViewTransition) {
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
    runFallbackAnimation();
  }
};
</script>

<template>
  <div>
    <div
      v-if="isAnimating"
      class="theme-transition-overlay"
      :class="{ 'fade-out': fadeOut }"
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
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  transition: opacity 300ms ease;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  opacity: 1;
}

.theme-transition-overlay.fade-out {
  opacity: 0;
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
