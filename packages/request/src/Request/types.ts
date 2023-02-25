import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface RequestOptions {
  useRawResponse?: boolean

  usePrefix?: boolean
  urlPrefix?: string

  joinTime?: boolean

  canRepeat?: boolean
  canCancel?: boolean
}

export interface RequestInitOptions extends AxiosRequestConfig {
  transforms?: RequestTransforms
  requestOptions?: RequestOptions
  catchHooks?: RequestCatchHooks
  interceptors?: RequestInterceptors | RequestInterceptors[]
}

export interface RequestTransforms {
  transformBeforeRequest?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig
  transformAfterResponse?: (res: AxiosResponse, options: RequestOptions) => any
}

export interface RequestCatchHooks {
  request?: (e: Error, options: RequestOptions) => Promise<any>
  requestInterceptors?: (e: Error) => void
  responseInterceptors?: (e: Error) => void
}

export interface RequestInterceptors {
  request?: (config: AxiosRequestConfig, options: RequestInitOptions) => AxiosRequestConfig
  response?: (res: AxiosResponse) => AxiosResponse
}
