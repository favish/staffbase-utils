import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  TouchEvent as ReactTouchEvent,
} from 'react'
import { useCallback, useEffect, useRef } from 'react'

import type { NativeLinkEvent } from '../../types/links/NativeLinkEvent'
import type { UseInAppLinkHandlingOptions } from '../../types/links/UseInAppLinkHandlingOptions'
import type { UseInAppLinkHandlingReturn } from '../../types/links/UseInAppLinkHandlingReturn'
import { getInAppOpenLinkTarget } from '../getInAppOpenLinkTarget'
import { normalizeInAppLinks } from '../normalizeInAppLinks'
import { openStaffbaseAware } from '../openStaffbaseAware'
import { isModifiedNativeEvent } from './isModifiedNativeEvent'
import { isNativeLinkEvent } from './isNativeLinkEvent'
import { isTouchLinkEvent } from './isTouchLinkEvent'
import { nativeLinkHandlers } from './nativeLinkHandlers'
import { tryStaffbaseContentOpenLink } from './tryStaffbaseContentOpenLink'

const SUPPRESS_CLICK_WINDOW_MS = 700

/**
 * Centralizes in-content link handling for Staffbase mobile/webview environments.
 *
 * Always attempts Staffbase-aware navigation (the host openLink when available,
 * otherwise same-tab navigation). It exposes React handlers for click/touchend/
 * pointerup and, when `containerRef` is given, installs a more reliable native
 * capture-phase handler. Touch/pointer/click are de-duplicated within a short
 * window so a single tap never fires navigation twice in iOS webviews.
 * @param {UseInAppLinkHandlingOptions} options - Origin, after-open callback and optional container ref.
 * @returns {UseInAppLinkHandlingReturn} prepareHtmlContent plus the React event handlers.
 */
export const useInAppLinkHandling = ({
  staffbaseOrigin,
  onAfterOpen,
  containerRef,
}: UseInAppLinkHandlingOptions): UseInAppLinkHandlingReturn => {
  const lastTouchAtRef = useRef<number | null>(null)
  const lastHandledAtRef = useRef<number | null>(null)
  const lastHandledTypeRef = useRef<'touch' | 'pointer' | null>(null)
  const lastHandledAnchorRef = useRef<HTMLAnchorElement | null>(null)

  const prepareHtmlContent = useCallback(
    (content: HTMLElement): HTMLElement => {
      normalizeInAppLinks(content, staffbaseOrigin)
      return content
    },
    [staffbaseOrigin],
  )

  const handleAnchor = useCallback(
    (
      anchor: HTMLAnchorElement,
      e?:
        | { preventDefault?: () => void; stopPropagation?: () => void }
        | NativeLinkEvent,
    ) => {
      const linkToOpen = getInAppOpenLinkTarget(
        anchor.getAttribute('href') ?? anchor.href ?? null,
        staffbaseOrigin,
      )
      if (!linkToOpen) return

      // Handle both React synthetic event-like objects and native events.
      if (e && 'preventDefault' in e) {
        e.preventDefault?.()
        e.stopPropagation?.()
      }

      // Prefer Staffbase's own content link handler when this is a native event.
      if (isNativeLinkEvent(e)) {
        // Touch events in some webviews don't trigger Staffbase openLink reliably.
        if (isTouchLinkEvent(e)) {
          openStaffbaseAware(linkToOpen)
          onAfterOpen?.()
          return
        }
        if (!tryStaffbaseContentOpenLink(e)) {
          openStaffbaseAware(linkToOpen)
        }
      } else {
        openStaffbaseAware(linkToOpen)
      }
      onAfterOpen?.()
    },
    [onAfterOpen, staffbaseOrigin],
  )

  const handleContentClick = useCallback(
    (e: ReactMouseEvent<HTMLElement>) => {
      if (e.defaultPrevented) return
      if (
        lastTouchAtRef.current &&
        Date.now() - lastTouchAtRef.current < SUPPRESS_CLICK_WINDOW_MS
      ) {
        return
      }

      const target = e.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a')
      if (!anchor) return
      handleAnchor(anchor, e)
    },
    [handleAnchor],
  )

  const handleContentTouchEnd = useCallback(
    (e: ReactTouchEvent<HTMLElement>) => {
      if (e.defaultPrevented) return
      const target = e.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a')
      if (!anchor) return

      if (
        lastHandledAtRef.current &&
        lastHandledTypeRef.current === 'pointer' &&
        lastHandledAnchorRef.current === anchor &&
        Date.now() - lastHandledAtRef.current < SUPPRESS_CLICK_WINDOW_MS
      ) {
        return
      }

      lastTouchAtRef.current = Date.now()
      lastHandledAtRef.current = lastTouchAtRef.current
      lastHandledTypeRef.current = 'touch'
      lastHandledAnchorRef.current = anchor
      handleAnchor(anchor, e.nativeEvent)
    },
    [handleAnchor],
  )

  const handleContentPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (e.defaultPrevented) return
      const target = e.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a')
      if (!anchor) return

      if (
        lastHandledAtRef.current &&
        lastHandledTypeRef.current === 'touch' &&
        lastHandledAnchorRef.current === anchor &&
        Date.now() - lastHandledAtRef.current < SUPPRESS_CLICK_WINDOW_MS
      ) {
        return
      }

      lastTouchAtRef.current = Date.now()
      lastHandledAtRef.current = lastTouchAtRef.current
      lastHandledTypeRef.current = 'pointer'
      lastHandledAnchorRef.current = anchor
      handleAnchor(anchor, e.nativeEvent)
    },
    [handleAnchor],
  )

  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    if (nativeLinkHandlers.has(container)) return

    /**
     * Capture-phase handler intercepting link activations on the container.
     * @param {NativeLinkEvent} e - The native click/touchend/pointerup event.
     * @returns {void} Nothing.
     */
    const handler = (e: NativeLinkEvent) => {
      try {
        if (isModifiedNativeEvent(e)) return
        const target = e.target
        if (!(target instanceof Element)) return

        const anchor = target.closest('a')
        if (!anchor) return

        const now = Date.now()
        if (
          lastHandledAtRef.current &&
          lastHandledAnchorRef.current === anchor &&
          now - lastHandledAtRef.current < SUPPRESS_CLICK_WINDOW_MS
        ) {
          return
        }

        lastHandledAtRef.current = now
        lastHandledTypeRef.current = isTouchLinkEvent(e) ? 'touch' : 'pointer'
        lastHandledAnchorRef.current = anchor
        handleAnchor(anchor, e)
      } catch {
        // Capture-phase handler must never throw into the host event loop.
      }
    }

    nativeLinkHandlers.set(container, handler)
    container.addEventListener('click', handler, true)
    container.addEventListener('touchend', handler, true)
    // Pointer events may be enabled in some webviews; harmless if unused.
    container.addEventListener('pointerup', handler, true)

    return () => {
      container.removeEventListener('click', handler, true)
      container.removeEventListener('touchend', handler, true)
      container.removeEventListener('pointerup', handler, true)
      nativeLinkHandlers.delete(container)
    }
  }, [containerRef, handleAnchor])

  return {
    prepareHtmlContent,
    handleContentClick,
    handleContentTouchEnd,
    handleContentPointerUp,
  }
}
