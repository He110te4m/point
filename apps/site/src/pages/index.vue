<script setup lang="ts">
import { drawFractalTree } from '~/utils/graphics/fractal/tree'

const canvas = ref<HTMLCanvasElement>()

onMounted(() => {
  if (!canvas.value) {
    throw new Error('missing html element')
  }

  drawFractalTree(canvas.value, {
    origins: [
      // top
      { position: [256, 512], growthDegree: 270 },
      // left
      { position: [256, 0], growthDegree: 90 },
      // right
      { position: [512, 256], growthDegree: 180 },
      // bottom
      { position: [0, 256], growthDegree: 0 },
    ],
    animate: 60,
    isAlive: () => Math.random() < 0.5,
  })
})
</script>

<template>
  <div>
    <canvas ref="canvas" width="512" height="512" class="bg-canvas" />
  </div>
</template>

<style scoped>
.bg-canvas {
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  width: 512px;
  height: 512px;
}
</style>
