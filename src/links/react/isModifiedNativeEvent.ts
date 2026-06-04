import type { NativeLinkEvent } from '../../types/links/NativeLinkEvent'
import { hasMouseEventProperties } from './hasMouseEventProperties'

/**
 * Whether a native link event is "modified" and should be left to the browser
 * (default prevented, a non-primary mouse button, or a modifier key held).
 * @param {NativeLinkEvent} e - The native event.
 * @returns {boolean} True when the event should not be intercepted.
 */
export const isModifiedNativeEvent = (e: NativeLinkEvent): boolean => {
  const hasMouseProps = hasMouseEventProperties(e)
  const button = hasMouseProps && 'button' in e ? e.button : undefined
  const metaKey = hasMouseProps ? e.metaKey : false
  const ctrlKey = hasMouseProps ? e.ctrlKey : false
  const shiftKey = hasMouseProps ? e.shiftKey : false
  const altKey = hasMouseProps ? e.altKey : false

  return Boolean(
    e.defaultPrevented ||
      (typeof button === 'number' && button !== 0) ||
      metaKey ||
      ctrlKey ||
      shiftKey ||
      altKey,
  )
}
