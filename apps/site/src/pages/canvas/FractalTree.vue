<script setup lang="ts">
import { useBg } from './FractalTree/composables/useBg'

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
  inset: 0;
}
</style>
