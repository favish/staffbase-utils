import type { NativeLinkEvent } from './NativeLinkEvent'

/**
 * Window augmented with the host's content link-open surface
 * (`window.staffbase.content.*.openLink`), the helper Staffbase's own widget
 * manager uses for in-content links. Every level is optional because the host
 * API is undocumented and may be absent.
 */
export interface StaffbaseContentWindow {
  staffbase?: {
    content?: {
      link?: { openLink?: ContentLinkOpener }
      links?: { openLink?: ContentLinkOpener }
      loader?: { link?: { openLink?: ContentLinkOpener } }
    }
  }
}

/**
 * The host's content link opener signature.
 * @param {{ useDefault: boolean }} options - Whether to fall back to default handling.
 * @param {NativeLinkEvent} event - The originating native event.
 * @returns {void} Nothing.
 */
type ContentLinkOpener = (
  options: { useDefault: boolean },
  event: NativeLinkEvent,
) => void
