<script setup lang="ts">
import LayoutHeader from '~/components/layout/Header/index.vue'
import LayoutSidebar from '~/components/layout/Sidebar/index.vue'
import LayoutFooter from '~/components/layout/Footer/index.vue'
</script>

<template>
  <div class="app">
    <LayoutHeader class="header" />
    <LayoutSidebar class="sidebar" />
    <div class="main">
      <RouterView />
    </div>
    <LayoutFooter class="footer" />
  </div>
</template>

<style scoped>
.app {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template:
    "header header" 60px
    "sidebar main" 1fr
    "sidebar footer" 60px
    / 200px 1fr
}

.header {
  grid-area: header;
}
.sidebar {
  grid-area: sidebar;
}
.main {
  grid-area: main;
}
.footer {
  grid-area: footer;
}
</style>
