import { createElement, Fragment } from 'react'
import type { Root } from 'react-dom/client'

import type { ShadowMount } from '../types/shadow/ShadowMount'
import { LimitedEditorBanner } from './LimitedEditorBanner'
import type { ClassicEditorSupportConfig } from './types/ClassicEditorSupportConfig'

/**
 * Renders the limited-editor warning plus the widget's own editor-preview view
 * into the placed element's shadow mount, using the bundle's React root. The
 * widget's preview lives in the shadow root and is never serialized on save.
 * Built with createElement (no JSX) to avoid a JSX-runtime build coupling.
 * @param {Root} root - The bundle's React root for this element.
 * @param {ShadowMount} mount - The element's shadow mount.
 * @param {HTMLElement} element - The placed widget element.
 * @param {ClassicEditorSupportConfig} config - The widget's support config.
 * @returns {void}
 */
export const renderClassicPreview = (
  root: Root,
  mount: ShadowMount,
  element: HTMLElement,
  config: ClassicEditorSupportConfig,
): void => {
  root.render(
    createElement(
      Fragment,
      null,
      createElement(LimitedEditorBanner),
      config.renderEditorPreview({
        /**
         *
         * @param name
         */
        getAttribute: (name) => element.getAttribute(name),
        mount,
      }),
    ),
  )
}
