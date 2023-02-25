import axios, { type Canceler as AxiosCanceler, type AxiosRequestConfig } from 'axios'
import type { RequestInitOptions } from './types'

type GenKeyFn = (config: AxiosRequestConfig) => string

export interface CancelerInitOptions {
  generatorKeyFn?: GenKeyFn
}

const cacheMap = new Map<string, AxiosCanceler | null>()
const defaultGeneratorKeyFn: GenKeyFn = ({ method, url }) => [method, url].join('&')

export class Canceler {
  #genKeyFn: GenKeyFn

  constructor(opts: CancelerInitOptions = {}) {
    this.#genKeyFn = opts.generatorKeyFn ?? defaultGeneratorKeyFn
  }

  takeOver(config: RequestInitOptions) {
    const { canCancel = true } = config.requestOptions ?? {}
    if (!canCancel || config.cancelToken) {
      return
    }

    let cancelFn: AxiosCanceler | null = null
    config.cancelToken = new axios.CancelToken((cancel) => {
      cancelFn = cancel
    })
    const key = this.#genKeyFn(config)
    cacheMap.set(key, cancelFn)
  }

  cancel(config: RequestInitOptions) {
    const key = this.#genKeyFn(config)
    const cancelFn = cacheMap.get(key)
    cancelFn?.()
    cacheMap.delete(key)
  }

  clear() {
    cacheMap.forEach(cancel => cancel?.())
    this.reset()
  }

  reset() {
    cacheMap.clear()
  }
}
