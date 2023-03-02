import { onUnmounted } from 'vue'
import { klona } from 'klona/full'
import type { Arrayable, Cancelable, EmptyFn } from '../types'

type WindowEventName = keyof WindowEventMap
type DocumentEventName = keyof DocumentEventMap
type HTMLEventName = keyof HTMLElementEventMap

interface WindowEventListenerOptions<TEvent extends WindowEventName> {
  /** event name */
  name: TEvent
  /** event callback */
  callback: (this: Window, ev: WindowEventMap[TEvent]) => void
  /** event listener options */
  options?: AddEventListenerOptions
  /** event target */
  target?: Window
}

interface DocumentEventListenerOptions<TEvent extends DocumentEventName> {
  /** event target */
  target: DocumentOrShadowRoot
  /** event name */
  name: TEvent
  /** event callback */
  callback: (this: Document, ev: DocumentEventMap[TEvent]) => void
  /** event listener options */
  options?: AddEventListenerOptions
}

interface HTMLEventListenerOptions<TEvent extends HTMLEventName> {
  /** event target */
  target: HTMLElement
  /** event name */
  name: TEvent
  /** event callback */
  callback: (ev: HTMLElementEventMap[TEvent]) => void
  /** event listener options */
  options?: AddEventListenerOptions
}

interface OtherEventListenerOptions<TEvent extends string> {
  /** event target */
  target: EventTarget
  /** event name */
  name: TEvent
  /** event callback */
  callback: (evt: Event) => void
  /** event listener options */
  options?: AddEventListenerOptions
}

type GetEventKeys<TEvent extends string> = WindowEventListenerOptions<TEvent & WindowEventName>
| DocumentEventListenerOptions<TEvent & DocumentEventName>
| HTMLEventListenerOptions<TEvent & HTMLEventName>
| OtherEventListenerOptions<TEvent>

interface EventListenerOptions {
  /** event name */
  name: string
  /** event callback */
  callback: (evt: Event) => void
  /** event listener options */
  options: AddEventListenerOptions
  /** event target */
  target: EventTarget
}

export function useEventListener<TEvent extends WindowEventName>(options: Arrayable<WindowEventListenerOptions<TEvent>>): Cancelable
export function useEventListener<TEvent extends DocumentEventName>(options: Arrayable<DocumentEventListenerOptions<TEvent>>): Cancelable
export function useEventListener<TEvent extends HTMLEventName>(options: Arrayable<HTMLEventListenerOptions<TEvent>>): Cancelable
export function useEventListener<TEvent extends string>(options: Arrayable<GetEventKeys<TEvent>>): Cancelable {
  const initList: GetEventKeys<TEvent>[] = []
  const list = initList.concat(options)
  if (list.some(item => item.options?.signal)) {
    throw new Error('[useEventListener]: Do not pass in the signal for the event, which will be generated and managed internally by the function.')
  }

  // cache listener cancel fn
  const map = new Map<EventListenerOptions, EmptyFn>()

  // abort all listener
  const controller = new AbortController()

  list.forEach((item) => {
    // generate listener option
    const opt = formatOption(item)
    opt.options.signal = controller.signal

    // cancel prev listener
    const cancelPrevListener = map.get(opt)
    if (cancelPrevListener) {
      cancelPrevListener()
    }

    // register event listener and cache it
    const cancelFn = addEventListener(opt)
    map.set(opt, cancelFn)
  })

  const cancel = () => {
    map.clear()
    controller.abort()
  }

  // dispose on component destroyed
  onUnmounted(cancel)

  return {
    cancel,
  }
}

function addEventListener({ name, callback, options, target }: EventListenerOptions) {
  target.addEventListener(name, callback, options)

  return () => target.removeEventListener(name, callback, options)
}

function formatOption<TEvent extends string>(item: GetEventKeys<TEvent>): EventListenerOptions {
  const opt = klona(item)

  return {
    ...opt,
    target: opt.target ?? window,
    options: opt.options ?? {},
  } as EventListenerOptions
}
