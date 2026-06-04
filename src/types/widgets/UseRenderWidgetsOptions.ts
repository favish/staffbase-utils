import type { DependencyList } from 'react'

import type { RenderWidgetsOptions } from './RenderWidgetsOptions'

/**
 * Options for the useRenderWidgets hook: renderWidgets options plus optional
 * MutationObserver wiring.
 */
export interface UseRenderWidgetsOptions extends RenderWidgetsOptions {
  /**
   * When true, a debounced MutationObserver (childList + subtree) re-renders on
   * article HTML changes (accordions, "View more"), cleaned up on unmount.
   */
  observe?: boolean
  /** Effect dependency list controlling when a render re-runs. Default []. */
  deps?: DependencyList
}
