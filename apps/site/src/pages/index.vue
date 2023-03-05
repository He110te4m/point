<script setup lang="ts">
import { useBg } from './index/composables/useBg'

const canvas = ref<HTMLCanvasElement>()
useBg(canvas)
</script>

<template>
  <div>
    <canvas ref="canvas" class="bg-canvas" />
  </div>
</template>

<style scoped>
.bg-canvas {
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
