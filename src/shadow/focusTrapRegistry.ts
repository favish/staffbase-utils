import type { RegisteredFocusTrap } from '../types/shadow/RegisteredFocusTrap'
import { getDeepActiveElement } from './getDeepActiveElement'
import { getFocusableElements } from './getFocusableElements'

// Module-scoped stack of active traps and a once-attached global Tab listener.
const focusTraps: RegisteredFocusTrap[] = []
let isTabListenerAttached = false

/**
 * Stack-based focus trap registry for stacked dialogs/drawers.
 *
 * The most recently registered trap is the active one; Tab/Shift+Tab cycle
 * focus within its container, resolving the current focus across shadow roots
 * (so a widget rendered into a ShadowRoot traps correctly). A single global
 * keydown listener is attached lazily on first registration.
 */
export const focusTrapRegistry = {
  /**
   * Attaches the global Tab listener exactly once (no-op without a DOM).
   * @returns {void} Nothing.
   */
  ensureTabListener(): void {
    if (typeof document === 'undefined' || isTabListenerAttached) return

    /**
     * Traps Tab navigation inside the top-most registered container.
     * @param {KeyboardEvent} event - The keydown event.
     * @returns {void} Nothing.
     */
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Tab') return

      const latest = focusTraps[focusTraps.length - 1]
      const container = latest?.getContainer()
      if (!container) return

      const focusable = getFocusableElements(container)
      if (focusable.length === 0) return

      const active = getDeepActiveElement()
      const currentIndex = active ? focusable.indexOf(active) : -1

      const nextIndex = event.shiftKey
        ? currentIndex <= 0
          ? focusable.length - 1
          : currentIndex - 1
        : currentIndex === -1 || currentIndex >= focusable.length - 1
          ? 0
          : currentIndex + 1

      event.preventDefault()
      focusable[nextIndex]?.focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    isTabListenerAttached = true
  },

  /**
   * Registers a trap as the newest (de-duplicated by id) and ensures the
   * global Tab listener is attached.
   * @param {RegisteredFocusTrap} trap - The trap to register.
   * @returns {void} Nothing.
   */
  register(trap: RegisteredFocusTrap): void {
    const existingIndex = focusTraps.findIndex((t) => t.id === trap.id)
    if (existingIndex !== -1) focusTraps.splice(existingIndex, 1)
    focusTraps.push(trap)
    this.ensureTabListener()
  },

  /**
   * Removes a trap by id.
   * @param {string} id - The trap id.
   * @returns {void} Nothing.
   */
  unregister(id: string): void {
    const index = focusTraps.findIndex((t) => t.id === id)
    if (index !== -1) focusTraps.splice(index, 1)
  },

  /**
   * Returns the id of the current top-most trap, if any.
   * @returns {string | null} The top-most trap id, or null.
   */
  getTopMostId(): string | null {
    return focusTraps[focusTraps.length - 1]?.id ?? null
  },
}
