import type { RefObject } from 'react'
import { useEffect } from 'react'
import type { ForceFullScreenOverlayOptions } from '../types/react/ForceFullScreenOverlayOptions'

/**
 * Forces an element to stay a fixed, full-viewport overlay despite host CSS.
 *
 * Applies the fixed/inset/size rules with `!important` and re-applies them via a
 * MutationObserver whenever the host rewrites the element's `style`, so a widget
 * overlay cannot be shrunk or repositioned by the surrounding app. Only active
 * while `active` is true.
 * @param {RefObject<HTMLElement | null>} elementRef - The overlay element ref.
 * @param {boolean} active - Whether to enforce the overlay.
 * @param {ForceFullScreenOverlayOptions} [options] - pointer-events / z-index overrides.
 * @returns {void} Nothing.
 */
export const useForceFullScreenOverlay = (
  elementRef: RefObject<HTMLElement | null>,
  active: boolean,
  options?: ForceFullScreenOverlayOptions,
): void => {
  const pointerEvents = options?.pointerEvents ?? 'auto'
  const zIndex = options?.zIndex

  useEffect(() => {
    const element = elementRef.current
    if (!active || !element) return

    /**
     * Applies the fixed, full-viewport style rules with `!important`.
     * @returns {void} Nothing.
     */
    const apply = (): void => {
      element.style.setProperty('position', 'fixed', 'important')
      element.style.setProperty('top', '0', 'important')
      element.style.setProperty('right', '0', 'important')
      element.style.setProperty('bottom', '0', 'important')
      element.style.setProperty('left', '0', 'important')
      element.style.setProperty('width', '100vw', 'important')
      element.style.setProperty('height', '100vh', 'important')
      element.style.setProperty('overflow', 'hidden', 'important')
      element.style.setProperty('pointer-events', pointerEvents, 'important')
      if (typeof zIndex === 'number') {
        element.style.setProperty('z-index', String(zIndex), 'important')
      }
    }

    apply()
    const observer = new MutationObserver(() =>
      window.requestAnimationFrame(apply),
    )
    observer.observe(element, { attributes: true, attributeFilter: ['style'] })
    return () => observer.disconnect()
  }, [elementRef, active, pointerEvents, zIndex])
}
