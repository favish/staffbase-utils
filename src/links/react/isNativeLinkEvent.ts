import type { NativeLinkEvent } from '../../types/links/NativeLinkEvent'

/**
 * Whether a value is a real native DOM event (as opposed to a React synthetic
 * event-like object), so the Staffbase content open-link path can be tried.
 * @param {NativeLinkEvent | { preventDefault?: () => void; stopPropagation?: () => void } | undefined} e - The candidate.
 * @returns {boolean} True when the value is a native Event.
 */
export const isNativeLinkEvent = (
  e:
    | { preventDefault?: () => void; stopPropagation?: () => void }
    | NativeLinkEvent
    | undefined,
): e is NativeLinkEvent => {
  return e !== undefined && 'target' in e && e instanceof Event
}
