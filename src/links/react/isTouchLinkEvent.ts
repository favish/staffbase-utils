import type { NativeLinkEvent } from '../../types/links/NativeLinkEvent'

/**
 * Whether a native link event is a TouchEvent (has `changedTouches`).
 * @param {NativeLinkEvent} e - The native event.
 * @returns {boolean} True when the event is a TouchEvent.
 */
export const isTouchLinkEvent = (e: NativeLinkEvent): e is TouchEvent => {
  return 'changedTouches' in e
}
