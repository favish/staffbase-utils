interface BodyStyleSnapshot {
  overflow: string
  width: string
  height: string
  touchAction: string
  overscrollBehavior: string
}

// Module-scoped, reference-counted lock state (per bundle). Implemented with
// inline body styles rather than CSS so it works even when all component CSS is
// isolated inside a ShadowRoot, where styling document.body via CSS is
// impossible. Multiple keys (e.g. concurrent drawer instances) share one lock.
const activeKeys = new Set<string>()
let original: BodyStyleSnapshot | null = null

/**
 * Reference-counted body scroll lock for modals/drawers, keyed per instance.
 *
 * The first `lock` snapshots and overwrites `document.body` inline styles to
 * disable scrolling; the last matching `unlock` restores them. Safe to call
 * with an unknown key and in non-browser environments (no-ops).
 */
export const bodyScrollLock = {
  /**
   * Acquires the lock for `key`. The first active key applies the scroll lock.
   * @param {string} key - Unique per-instance lock key.
   * @returns {void} Nothing.
   */
  lock(key: string): void {
    if (typeof document === 'undefined' || !document.body) return
    if (activeKeys.has(key)) return

    if (activeKeys.size === 0) {
      const style = document.body.style
      original = {
        overflow: style.overflow,
        width: style.width,
        height: style.height,
        touchAction: style.touchAction,
        overscrollBehavior: style.overscrollBehavior,
      }
      style.width = '100vw'
      style.height = '100vh'
      style.overflow = 'hidden'
      style.overscrollBehavior = 'none'
      style.touchAction = 'none'
    }

    activeKeys.add(key)
  },

  /**
   * Releases the lock for `key`. Restores body styles once no keys remain.
   * @param {string} key - Unique per-instance lock key.
   * @returns {void} Nothing.
   */
  unlock(key: string): void {
    if (typeof document === 'undefined' || !document.body) return
    if (!activeKeys.has(key)) return

    activeKeys.delete(key)

    if (activeKeys.size === 0 && original) {
      const style = document.body.style
      style.overflow = original.overflow
      style.width = original.width
      style.height = original.height
      style.touchAction = original.touchAction
      style.overscrollBehavior = original.overscrollBehavior
      original = null
    }
  },
}
