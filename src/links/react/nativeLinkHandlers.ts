import type { NativeLinkEvent } from '../../types/links/NativeLinkEvent'

/**
 * Tracks the capture-phase handler installed per container element, so the same
 * container is never wired twice and can be cleanly torn down on unmount.
 */
export const nativeLinkHandlers = new WeakMap<
  HTMLElement,
  (e: NativeLinkEvent) => void
>()
