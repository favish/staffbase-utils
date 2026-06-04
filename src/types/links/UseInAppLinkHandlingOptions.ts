import type { RefObject } from 'react'

/**
 * Options for the useInAppLinkHandling hook.
 */
export interface UseInAppLinkHandlingOptions {
  /** Staffbase origin used to rewrite/resolve in-app links (injected, no env). */
  staffbaseOrigin: string
  /**
   * Called after navigation starts for an intercepted link (e.g. close a drawer).
   * @returns {void} Nothing.
   */
  onAfterOpen?: () => void
  /**
   * When provided, installs a native capture-phase handler on the container,
   * which is more reliable than React synthetic events in some iOS app webviews.
   */
  containerRef?: RefObject<HTMLElement | null>
}
