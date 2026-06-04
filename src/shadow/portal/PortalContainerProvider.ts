import type { ReactElement } from 'react'
import { createElement } from 'react'

import type { PortalContainerProviderProps } from '../../types/shadow/PortalContainerProviderProps'
import { PortalContainerContext } from './PortalContainerContext'

/**
 * Provides the portal container element to descendants. Built with createElement
 * (no JSX) so the library has no JSX-runtime build coupling.
 * @param {PortalContainerProviderProps} props - The portal container and children.
 * @returns {ReactElement} The provider element wrapping the children.
 */
export const PortalContainerProvider = ({
  portalContainer,
  children,
}: PortalContainerProviderProps): ReactElement =>
  createElement(
    PortalContainerContext.Provider,
    { value: portalContainer },
    children,
  )
