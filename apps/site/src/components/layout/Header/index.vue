<script setup lang="ts">
import { navs } from './configs/navs'
import NavMenu from '~/components/NavMenu/index.vue'
const { t } = useI18n()
</script>

<template>
  <div class="header">
    <div class="header-logo">
      {{ t('app.global.site.title') }}
    </div>
    <NavMenu class="header-nav-menu" :navs="navs" />
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
}

.header-logo {
  flex: 0 0 20rem;
  text-align: center;
  font-size: 2rem;
}

.header-nav-menu {
  flex: 1;
}
</style>
