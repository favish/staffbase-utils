import type { ReactElement } from 'react'

/**
 * A minimal render/unmount handle over a mounted React tree, abstracting the
 * React 18 `createRoot` API and the legacy React 17 `render` API.
 */
export interface ReactRoot {
  /**
   * Renders (or re-renders) the given element into the container.
   * @param {ReactElement} element - The element to render.
   * @returns {void} Nothing.
   */
  render: (element: ReactElement) => void
  /**
   * Unmounts the tree and releases the container.
   * @returns {void} Nothing.
   */
  unmount: () => void
}
