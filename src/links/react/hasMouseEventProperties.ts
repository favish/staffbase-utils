import type { NativeLinkEvent } from '../../types/links/NativeLinkEvent'

/**
 * Whether a native link event exposes MouseEvent modifier properties.
 * @param {NativeLinkEvent} e - The native event.
 * @returns {boolean} True when the event has `button` and `metaKey`.
 */
export const hasMouseEventProperties = (
  e: NativeLinkEvent,
): e is MouseEvent | PointerEvent => {
  return 'button' in e && 'metaKey' in e
}
