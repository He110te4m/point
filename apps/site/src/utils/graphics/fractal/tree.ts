import { Vector2D } from '~/utils/graphics/common/Vector2D'

interface FractalTreeConditionConfig {
  startValue?: number
  endValue?: number
  reductionRate?: number
}

interface FractalTreePoint {
  position: [number, number]
  growthDegree: number
  degressOffset?: number
  length?: number | FractalTreeConditionConfig
  thickness?: number | FractalTreeConditionConfig
}

type FractalTreePointGlobalConfig = Record<'length' | 'thickness', Required<FractalTreeConditionConfig>> & Pick<Required<FractalTreePoint>, 'degressOffset'>

interface FractalTreeAnimate {
  enable?: boolean
  timeGap?: number
}

interface FractalTreeDrawConfig {
  start: Vector2D
  growthDegree: number
  length: number
  thickness: number
}

type PruningFn = (config: FractalTreeDrawConfig) => boolean

type FractalTreeOption = {
  origins: FractalTreePoint[]
  animate?: FractalTreeAnimate | number
  isAlive?: boolean | PruningFn
} & OmitPartial<FractalTreePoint>

type ConfigFields = 'length' | 'thickness'

interface FractalTreeGenerationConfig {
  rate: Record<ConfigFields, (currentValue: number) => number> & { growthDegree: (degree: number) => number[] }
  limit: Record<ConfigFields, (currentValue: number) => boolean>
}

interface FractalTreeParsedConfig {
  draw: FractalTreeDrawConfig
  generation: FractalTreeGenerationConfig
  isAlive: PruningFn
}

const defaultAnimationTime = 1000
const maxAnimationTime = 60 * 1000

export function drawFractalTree(canvasEl: HTMLCanvasElement, options: FractalTreeOption) {
  const ctx = initContext(canvasEl)
  const { animate: animationUserConfig, ...drawUserConfig } = options
  const animationConfig = formatAnimateConfig(animationUserConfig)
  const drawConfigs = formatTreeOriginsOption(drawUserConfig)
  drawConfigs.forEach(config => drawAllBranch(ctx, config, animationConfig))
}

//#region draw branch

function drawAllBranch(ctx: CanvasRenderingContext2D, { draw, generation, isAlive }: FractalTreeParsedConfig, { enable, timeGap }: Required<FractalTreeAnimate>) {
  const configsList = [[draw]]
  const interval = enable ? timeGap : 0
  const animationID = -1
  const run = makeRun({ ctx, interval, configsList, generation, pruning: isAlive })
  run({
    startTime: performance.now(),
    lastAnimationID: animationID,
  })
}

interface MakeRunOptions {
  ctx: CanvasRenderingContext2D
  generation: FractalTreeGenerationConfig
  interval: number
  configsList: FractalTreeDrawConfig[][]
  pruning: PruningFn
}

interface RunOptions {
  startTime: number
  lastAnimationID: number
}

function makeRun({ ctx, generation, interval, configsList, pruning }: MakeRunOptions) {
  return function run({ startTime, lastAnimationID }: RunOptions) {
    const animationID = requestAnimationFrame(() => {
      const currentTime = performance.now()
      if (currentTime < startTime + interval) {
        run({ startTime, lastAnimationID: animationID })
        return
      }
      if (!configsList.length) {
        cancelAnimationFrame(lastAnimationID)
        return
      }

      const configs = configsList.shift()!
      configs.forEach(config => drawBranch(ctx, config))

      const nextConfigs = getNextConfigs(generation, configs)
        .filter(pruning)
      configsList.push(nextConfigs)
      run({ startTime: currentTime, lastAnimationID: animationID })
    })
  }
}

function drawBranch(ctx: CanvasRenderingContext2D, config: FractalTreeDrawConfig) {
  const end = getEndVector(config)
  const { start, thickness } = config

  ctx.save()

  ctx.lineWidth = thickness
  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)
  ctx.stroke()

  ctx.restore()
}

//#endregion

//#region generate next branchs

function getNextConfigs({ rate, limit }: FractalTreeGenerationConfig, configs: FractalTreeDrawConfig[]): FractalTreeDrawConfig[] {
  return configs.flatMap((config) => {
    const nextLength = rate.length(config.length)
    const nextThickness = rate.thickness(config.thickness)
    if (limit.length(nextLength) || limit.thickness(nextThickness)) {
      return []
    }

    const nextConfigs: FractalTreeDrawConfig[] = rate.growthDegree(config.growthDegree).map(growthDegree => ({
      start: getEndVector(config),
      growthDegree,
      length: nextLength,
      thickness: nextThickness,
    }))

    return nextConfigs
  })
}

function getEndVector({ growthDegree, start, length }: FractalTreeDrawConfig) {
  const step = Vector2D.createXUnitVector().rotate(growthDegree)
  step.length = length

  const end = start.clone().add(step)

  return end
}

//#endregion

//#region init

function initContext(canvasEl: HTMLCanvasElement) {
  const ctx = canvasEl.getContext('2d')
  if (!ctx) {
    throw new Error('can not get canvas context')
  }

  ctx.translate(0, canvasEl.height)
  ctx.scale(1, -1)
  ctx.lineCap = 'round'

  return ctx
}

//#endregion

//#region convert user config to function config

function formatAnimateConfig(animateConfig: FractalTreeOption['animate'] = {}): Required<FractalTreeAnimate> {
  return typeof animateConfig === 'number'
    ? {
        enable: true,
        timeGap: animateConfig,
      }
    : {
        enable: animateConfig.enable ?? false,
        timeGap: Math.min(animateConfig.timeGap ?? defaultAnimationTime, maxAnimationTime),
      }
}

function formatTreeOriginsOption({ origins, isAlive, ...globalUserConfig }: Omit<FractalTreeOption, 'animate'>): FractalTreeParsedConfig[] {
  const globalConfig = getDefaultConfig(globalUserConfig)

  return origins.map(({ position, growthDegree, length, thickness, degressOffset }) => {
    const lengthConfig: Required<FractalTreeConditionConfig> = Object.assign({}, formatConditionConfig(length), globalConfig.length)
    const thicknessConfig: Required<FractalTreeConditionConfig> = Object.assign({}, formatConditionConfig(thickness), globalConfig.thickness)

    const degressCurrentOffset = degressOffset ?? globalConfig.degressOffset

    return {
      draw: {
        start: new Vector2D(...position),
        growthDegree,
        length: lengthConfig.startValue,
        thickness: thicknessConfig.startValue,
      },
      generation: {
        rate: {
          length: makeGenNextNumByRate(lengthConfig.reductionRate),
          thickness: makeGenNextNumByRate(thicknessConfig.reductionRate),
          growthDegree: num => [num - degressCurrentOffset, num + degressCurrentOffset],
        },
        limit: {
          length: makeLimitFn(lengthConfig.endValue),
          thickness: makeLimitFn(lengthConfig.endValue),
        },
      },
      isAlive: makePruningFn(isAlive),
    }
  })
}

function makePruningFn(isAlive: boolean | PruningFn = true): PruningFn {
  return typeof isAlive === 'boolean' ? () => isAlive : isAlive
}

function makeGenNextNumByRate(rate: number) {
  return rate < 1
    ? (num: number) => num * rate
    : (num: number) => num - rate
}

function makeLimitFn(minValue: number) {
  return (num: number) => num < minValue
}

function getDefaultConfig({ length, thickness, degressOffset }: OmitPartial<FractalTreePoint>): FractalTreePointGlobalConfig {
  const lengthConfig = formatConditionConfig(length)
  const thicknessConfig = formatConditionConfig(thickness)

  return {
    length: {
      startValue: lengthConfig.startValue ?? 20,
      endValue: lengthConfig.endValue ?? 1,
      reductionRate: lengthConfig.reductionRate ?? 0.9,
    },
    thickness: {
      startValue: thicknessConfig.startValue ?? 4,
      endValue: thicknessConfig.endValue ?? 1,
      reductionRate: thicknessConfig.reductionRate ?? 0.9,
    },
    degressOffset: degressOffset ?? 15,
  }
}

function formatConditionConfig(config?: number | FractalTreeConditionConfig): FractalTreeConditionConfig {
  return typeof config === 'number' ? { startValue: config } : (config ?? {})
}

//#endregion
