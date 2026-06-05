import type { DependencyList, RefObject } from 'react'
import { useLayoutEffect } from 'react'

/**
 * Resets a scroll container to the top whenever `deps` change.
 *
 * Resets synchronously, then again on the next frame and after a short delay to
 * defeat iOS Safari's scroll restoration, which can re-apply the old position
 * after layout. Failures (detached node) are swallowed.
 * @param {RefObject<HTMLElement | null>} targetRef - The scroll container ref.
 * @param {DependencyList} deps - Dependencies that should trigger a reset.
 * @returns {void} Nothing.
 */
export const useResetScrollPosition = (
  targetRef: RefObject<HTMLElement | null>,
  deps: DependencyList,
): void => {
  useLayoutEffect(() => {
    /**
     * Scrolls the target container back to the top, ignoring detached-node errors.
     * @returns {void} Nothing.
     */
    const reset = (): void => {
      try {
        if (targetRef.current) targetRef.current.scrollTop = 0
      } catch {
        // Ignore: the node may be detached mid-transition.
      }
    }

    reset()
    let timeoutId: number | null = null
    const frameId = window.requestAnimationFrame(() => {
      reset()
      timeoutId = window.setTimeout(reset, 100)
    })

    return () => {
      window.cancelAnimationFrame(frameId)
      if (timeoutId !== null) window.clearTimeout(timeoutId)
    }
  }, [targetRef, ...deps])
}
