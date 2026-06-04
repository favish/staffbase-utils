import { createContext } from 'react'

/**
 * Holds the DOM element portalled components should render into, so portals stay
 * inside the widget's ShadowRoot (preserving style isolation).
 */
export const PortalContainerContext = createContext<HTMLElement | null>(null)
