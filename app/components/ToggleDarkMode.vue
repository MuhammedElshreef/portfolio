<script setup lang="ts">
// const colorMode = useColorMode();
// const switchTheme = () => {
//   colorMode.value = colorMode.value === "dark" ? "light" : "dark";
// };
const colorMode = useColorMode();

const nextTheme = computed(() =>
  colorMode.value === "dark" ? "light" : "dark"
);

const switchTheme = () => {
  colorMode.preference = nextTheme.value;
};
const startViewTransition = (event: MouseEvent) => {
  if (!document.startViewTransition) {
    switchTheme();
    return;
  }

  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const transition = document.startViewTransition(() => {
    switchTheme();
  });

  transition.ready.then(() => {
    const duration = 600;
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: duration,
        easing: "cubic-bezier(.76,.32,.29,.99)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });
};
</script>

<template>
  <ClientOnly>
    <UiButton
      variant="ghost"
      size="icon"
      class="relative h-8 w-8 p-0"
      @click="startViewTransition"
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
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-new(root) {
  z-index: 9999;
}
::view-transition-old(root) {
  z-index: 1;
}
</style>
