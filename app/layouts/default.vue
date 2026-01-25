<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="border-b">
      <AppHeader />
    </header>

    <main class="grow container mx-auto px-4 py-6">
      <slot />
    </main>

    <footer class="border-t mt-auto">
      <AppFooter />
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>