import type { AnyFn, AnyObject } from './any'

type GetFnKeys<TObj extends AnyObject> = {
  [TKey in keyof TObj]: TObj[TKey] extends AnyFn ? TKey : never
}[keyof TObj]

type GetReadonlyKeys<TObj extends AnyObject> = {
  [TKey in keyof TObj]:
  (<S>() => S extends { [TK in TKey]: TObj[TK] } ? 2 : 1) extends
  (<S>() => S extends { -readonly [TK in TKey]: TObj[TK] } ? 2 : 1) ? never : TKey
}[keyof TObj]

export type OmitFn<TObj extends AnyObject> = Omit<TObj, GetFnKeys<TObj>>
export type OmitReadonly<TObj extends AnyObject> = Omit<TObj, GetReadonlyKeys<TObj>>
