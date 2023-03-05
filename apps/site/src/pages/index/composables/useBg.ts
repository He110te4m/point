import type { Ref } from 'vue'
import { drawFractalTree } from '~/utils/graphics/fractal/tree'

export function useBg(canvas: Ref<HTMLCanvasElement | undefined>) {
  onMounted(() => {
    if (!canvas.value) {
      throw new Error('missing html element')
    }

    const { innerWidth: width, innerHeight: height } = window
    canvas.value.width = width
    canvas.value.height = height

    drawFractalTree(canvas.value, {
      origins: [
        { position: [width, height * 0.2], growthDegree: 135 },
      ],
      animate: 60,
      isAlive: depth => (depth < 4 || Math.random() < 0.5),
    })
  })
}
