import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { klona } from 'klona/full'
import qs from 'qs'
import type { RequestInitOptions, RequestInterceptors, RequestOptions } from './types'
import { Canceler } from './Canceler'

export class Request {
  readonly #axiosInstance: AxiosInstance
  readonly #initOptions: RequestInitOptions
  readonly #canceler: Canceler

  constructor(options: RequestInitOptions) {
    this.#initOptions = Object.freeze(options)
    this.#axiosInstance = axios.create(options)
    this.#canceler = new Canceler()

    this.registerInterceptors(options.interceptors)
    this.initInterceptorCatch()
  }

  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' }, options)
  }

  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' }, options)
  }

  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT' }, options)
  }

  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE' }, options)
  }

  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: RequestInitOptions = klona(config)

    const opt = Object.assign({}, this.#initOptions.requestOptions, options)
    const { transformBeforeRequest, transformAfterResponse } = this.#initOptions.transforms ?? {}
    const { request: requestCatch } = this.#initOptions.catchHooks ?? {}

    if (transformBeforeRequest) {
      conf = transformBeforeRequest(conf, opt)
    }
    conf.data = this.formatReqData(conf)

    conf.requestOptions = opt

    return new Promise((resolve) => {
      this.#axiosInstance
        .request(conf)
        .then(res => resolve(transformAfterResponse ? transformAfterResponse(res, opt) : res))
        .catch((e: Error | AxiosError) => {
          return requestCatch ? resolve(requestCatch(e, opt)) : resolve({ success: false } as unknown as T)
        })
    })
  }

  setHeader(headers: Record<string, string>) {
    Object.assign(this.#axiosInstance.defaults.headers, headers)
  }

  registerInterceptors(interceptors: RequestInterceptors | RequestInterceptors[] = []) {
    const initInterceptors: RequestInterceptors[] = []
    initInterceptors
      .concat(interceptors)
      .forEach(interceptor => this.addInterceptors(interceptor))

    return this
  }

  private formatReqData(config: AxiosRequestConfig) {
    const headers = config.headers || this.#initOptions.headers
    const contentType = headers?.['Content-Type'] ?? headers?.['content-type']
    if (contentType !== '' || !Reflect.has(config, 'data') || config.method?.toLowerCase() !== 'get') {
      return config.data
    }

    return qs.stringify(config.data, { arrayFormat: 'brackets' })
  }

  private addInterceptors({ request: reqInterceptor, response: resInterceptor }: RequestInterceptors) {
    if (!reqInterceptor && !resInterceptor) {
      return
    }

    const { interceptors } = this.#axiosInstance
    const canceler = this.#canceler
    interceptors.request.use((config: RequestInitOptions) => {
      canceler.takeOver(config)
      if (reqInterceptor) {
        config = reqInterceptor(config, this.#initOptions)
      }

      return config
    })
    interceptors.response.use((res: AxiosResponse) => {
      canceler.cancel(res.config)
      if (resInterceptor) {
        res = resInterceptor(res)
      }

      return res
    })
  }

  private initInterceptorCatch() {
    const { interceptors } = this.#axiosInstance

    const { requestInterceptors: reqCatchHook, responseInterceptors: resCatchHook } = this.#initOptions.catchHooks ?? {}
    if (reqCatchHook) {
      interceptors.request.use(undefined, reqCatchHook)
    }

    if (resCatchHook) {
      interceptors.response.use(undefined, resCatchHook)
    }
  }
}
