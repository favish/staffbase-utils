/**
 * A focus trap registered with the focusTrapRegistry.
 */
export interface RegisteredFocusTrap {
  /** Unique id (used to de-duplicate and to identify the top-most trap). */
  id: string
  /**
   * Resolves the trap's current container, or null when not mounted.
   * @returns {HTMLElement | null} The container element, or null.
   */
  getContainer: () => HTMLElement | null
  /**
   * Optional callback to restore focus when the trap is removed.
   * @returns {void} Nothing.
   */
  restoreFocus?: () => void
}
