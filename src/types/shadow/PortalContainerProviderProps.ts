import type { ReactNode } from 'react'

/**
 * Props for PortalContainerProvider.
 */
export interface PortalContainerProviderProps {
  /** The DOM element portalled content should render into (inside the shadow root). */
  portalContainer: HTMLElement
  children: ReactNode
}
