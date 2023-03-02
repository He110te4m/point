import type { ComputedRef } from 'vue'
import type { AnyKey } from './any'
import type { EmptyFn } from './empty'

export type Recordable<TValue, TKey extends AnyKey = string> = Record<TKey, TValue>

export type Arrayable<T> = T[] | T

export type Awaitable<T> = Promise<T> | T

export interface Pausable {
  /**
   * A ref indicate whether a pausable instance is active
   */
  isActive: ComputedRef<boolean>

  /**
   * Temporary pause the effect from executing
   */
  pause: EmptyFn

  /**
   * Resume the effects
   */
  resume: EmptyFn
}

export interface Cancelable {
  cancel: EmptyFn
}
