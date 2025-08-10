<template>
  <div>
    <div
      class="sm:border-x border-border pt-16 min-h-screen antialiased max-w-4xl mx-auto py-16 sm:py-24 px-6"
    >
      <AppHeader />
      <div class="mx-auto sm:px-6 lg:px-8">
        <slot />
      </div>
      <!-- <AppFooter /> -->
    </div>
  </div>
</template>
