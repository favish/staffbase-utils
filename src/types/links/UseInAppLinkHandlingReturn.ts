import type { MouseEvent, PointerEvent, TouchEvent } from 'react'

/**
 * Handlers and helpers returned by useInAppLinkHandling.
 */
export interface UseInAppLinkHandlingReturn {
  /**
   * Rewrites in-app links inside the element for iOS-friendly navigation.
   * @param {HTMLElement} content - The content container to mutate.
   * @returns {HTMLElement} The same element, after rewriting.
   */
  prepareHtmlContent: (content: HTMLElement) => HTMLElement
  /**
   * React click handler that routes in-content links through Staffbase-aware navigation.
   * @param {MouseEvent<HTMLElement>} e - The React mouse event.
   * @returns {void} Nothing.
   */
  handleContentClick: (e: MouseEvent<HTMLElement>) => void
  /**
   * React touchend handler (more reliable than click in some webviews).
   * @param {TouchEvent<HTMLElement>} e - The React touch event.
   * @returns {void} Nothing.
   */
  handleContentTouchEnd: (e: TouchEvent<HTMLElement>) => void
  /**
   * React pointerup handler (used when pointer events are enabled).
   * @param {PointerEvent<HTMLElement>} e - The React pointer event.
   * @returns {void} Nothing.
   */
  handleContentPointerUp: (e: PointerEvent<HTMLElement>) => void
}
