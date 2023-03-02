type NullableKeys<T> = { [K in keyof T]-?: undefined extends T[K] ? K : never }[keyof T]

declare global {
  type EmptyFn = () => void

  //#region any type

  type AnyKey = keyof any
  type AnyObject = Record<AnyKey, any>
  type AnyFn = (...args: any[]) => any

  //#endregion

  type OmitPartial<TObj extends AnyObject> = Pick<TObj, NullableKeys<TObj>>
}

export {}
