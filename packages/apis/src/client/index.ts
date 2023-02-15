type FetchFn = typeof fetch

export interface ClientOptions {
  fetch: FetchFn
}

export class ApiClient {
  #fetch: FetchFn

  constructor({ fetch }: ClientOptions) {
    this.#fetch = fetch
  }
}
