<script setup lang="ts">
import LayoutHeader from '~/components/layout/Header.vue'
</script>

<template>
  <div class="app">
    <LayoutHeader />
    <div class="container">
      <RouterView />
    </div>
  </div>
</template>
