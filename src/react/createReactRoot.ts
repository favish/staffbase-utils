import type { ReactElement } from 'react'
import * as ReactDOM from 'react-dom'
import type { ReactRoot } from '../types/react/ReactRoot'

interface LegacyReactDom {
  render: (element: ReactElement, container: Element) => void
  unmountComponentAtNode: (container: Element) => void
}

interface ConcurrentReactDom {
  createRoot: (container: Element) => {
    render: (element: ReactElement) => void
    unmount: () => void
  }
}

/**
 * Mounts React into a container using whichever API the host's React provides.
 *
 * Staffbase widgets run against a host-supplied React that may be 18+ (concurrent
 * `createRoot`) or legacy 17 (`render`). This adapter picks the right one so a
 * widget mounts identically on both, returning a uniform render/unmount handle.
 * @param {Element} container - The element to mount into.
 * @returns {ReactRoot} The render/unmount handle.
 */
export const createReactRoot = (container: Element): ReactRoot => {
  const reactDom = ReactDOM as unknown as
    | ConcurrentReactDom
    | (LegacyReactDom & Partial<ConcurrentReactDom>)

  if (typeof reactDom.createRoot === 'function') {
    const root = reactDom.createRoot(container)
    return {
      render(element: ReactElement) {
        root.render(element)
      },
      unmount() {
        root.unmount()
      },
    }
  }

  const legacy = reactDom as LegacyReactDom
  return {
    render(element: ReactElement) {
      legacy.render(element, container)
    },
    unmount() {
      legacy.unmountComponentAtNode(container)
    },
  }
}
