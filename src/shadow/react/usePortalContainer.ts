import { useContext } from 'react'

import { PortalContainerContext } from './PortalContainerContext'

/**
 * Returns the portal container element used to keep portals inside the ShadowRoot.
 * @returns {HTMLElement | null} The portal container, or null when not provided.
 */
export const usePortalContainer = (): HTMLElement | null => {
  return useContext(PortalContainerContext)
}
