<script lang="ts" setup>
import { type NavItem, useNavs } from './useNavs'

const props = defineProps<{ navs: NavItem[] }>()
const { currentKey, activeTree } = useNavs(props.navs)

const router = useRouter()
function onKeyChange({ children, url }: NavItem) {
  if (!children?.length) {
    router.push(url)
  } else {
    currentKey.value = url
  }
}
</script>

<template>
  <dl class="nav-menu">
    <dd v-for="nav in activeTree" :key="nav.url" class="nav-menu-item" @click="onKeyChange(nav)">
      {{ nav.title }}

      <dl v-if="nav.children?.length" class="nav-sub-menu">
        <dd v-for="item in nav.children" :key="item.url" @click="onKeyChange(item)">
          {{ item.title }}
        </dd>
      </dl>
    </dd>
  </dl>
</template>

<style scoped>
.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-menu-item {
  text-align: center;
  flex: 0 1 auto;
  font-size: 1.6rem;
  position: relative;
}
</style>
