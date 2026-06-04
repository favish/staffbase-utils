import type { RefObject } from 'react'
import { useEffect } from 'react'

import type { UseRenderWidgetsOptions } from '../../types/widgets/UseRenderWidgetsOptions'
import { renderWidgets } from '../renderWidgets'

/**
 * React adapter for renderWidgets. Renders on mount and whenever `deps` change,
 * using `ref.current` as the cancelKey. With `observe: true` it mounts a
 * debounced MutationObserver (childList + subtree) that re-renders on article
 * HTML changes and cleans up on unmount. Absorbs the render/observe glue that
 * the widgets repeat in their Article loaders.
 * @param {RefObject<HTMLElement | null>} ref - Ref to the widget container.
 * @param {UseRenderWidgetsOptions} options - renderWidgets options plus observe/deps.
 * @returns {void}
 */
export const useRenderWidgets = (
  ref: RefObject<HTMLElement | null>,
  options: UseRenderWidgetsOptions = {},
): void => {
  const { observe = false, deps = [], ...renderOptions } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const opts = { ...renderOptions, cancelKey: el }
    void renderWidgets(el, opts)

    if (!observe) return

    let timer: ReturnType<typeof setTimeout>
    const observer = new MutationObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(() => void renderWidgets(ref.current, opts), 100)
    })
    observer.observe(el, { childList: true, subtree: true })

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, deps)
}
