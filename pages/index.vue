<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div>
  <ClientOnly>
  </ClientOnly>
    <h1>Nuxt Routing set up successfully!</h1>
    <p>Current route: {{ route.path }}</p>
    <a href="/game">GAME</a>
  </div>
</template>
