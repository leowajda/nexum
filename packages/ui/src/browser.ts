import { Context, Effect, Layer } from "effect"

export type Cleanup = () => void

export interface BrowserService {
  readonly document: Document
  readonly window: Window
  readonly history: History
  readonly location: Location
  readonly navigator: Navigator
  readonly console: Console
  readonly localStorage: Storage | null
}

export class Browser extends Context.Tag("Browser")<Browser, BrowserService>() {}

const resolveLocalStorage = (): Storage | null => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export const BrowserLive = Layer.sync(Browser, () => ({
  document,
  window,
  history: window.history,
  location: window.location,
  navigator: window.navigator,
  console,
  localStorage: resolveLocalStorage()
}))

export const addEventListener = (
  target: EventTarget,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions | boolean
) =>
  Effect.sync(() => {
    target.addEventListener(type, listener, options)
    return () => target.removeEventListener(type, listener, options)
  })

export const combineCleanups = (cleanups: ReadonlyArray<Cleanup>): Cleanup =>
  () => {
    for (const cleanup of [...cleanups].reverse()) {
      cleanup()
    }
  }
