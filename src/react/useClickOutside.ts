import type { RefObject } from 'react'
import { useEffect } from 'react'

/**
 * Calls `onOutside` when a pointer/touch press lands outside every referenced
 * element, while `active` is true.
 *
 * Accepts multiple refs (e.g. a trigger plus its popover) so clicks on any of
 * them count as inside. Listens in the capture phase on `pointerdown` and
 * `touchstart` to fire before click handlers. Shadow-DOM safe: it compares
 * against the refs' nodes, not document containment.
 * @param {ReadonlyArray<RefObject<HTMLElement | null>>} refs - Elements treated as inside.
 * @param {() => void} onOutside - Called on an outside press.
 * @param {boolean} [active] - Whether the listener is attached (default true).
 * @returns {void} Nothing.
 */
export const useClickOutside = (
  refs: ReadonlyArray<RefObject<HTMLElement | null>>,
  onOutside: () => void,
  active = true,
): void => {
  useEffect(() => {
    if (!active) return

    /**
     * Fires `onOutside` when the press target is outside every referenced element.
     * @param {Event} event - The pointer/touch event.
     * @returns {void} Nothing.
     */
    const handle = (event: Event): void => {
      const target = event.target as Node | null
      if (!target) return

      const isInside = refs.some((ref) => ref.current?.contains(target))
      if (!isInside) onOutside()
    }

    document.addEventListener('pointerdown', handle, true)
    document.addEventListener('touchstart', handle, true)
    return () => {
      document.removeEventListener('pointerdown', handle, true)
      document.removeEventListener('touchstart', handle, true)
    }
  }, [refs, onOutside, active])
}
