import type { ReactNode } from 'react'

import type { ClassicConfigRenderContext } from './ClassicConfigRenderContext'
import type { ClassicPreviewRenderContext } from './ClassicPreviewRenderContext'

/**
 * Configuration for installClassicEditorSupport: the per-widget pieces the
 * library needs to render a preview and a config dialog for an externally-hosted
 * widget inside Staffbase's classic page editor.
 */
export interface ClassicEditorSupportConfig {
  /** The custom-element tag name, e.g. "global-content". */
  element: string
  /** Observed attribute names (so the preview re-renders on config change). */
  attributes: string[]
  /** The widget's shadow CSS, injected into the preview shadow root. */
  widgetCss: string
  /** Renders the widget's editor-preview view (wrapped in its own providers). */
  renderEditorPreview: (context: ClassicPreviewRenderContext) => ReactNode
  /** Renders the widget's configuration form shown on double-click. */
  renderConfigForm: (context: ClassicConfigRenderContext) => ReactNode
}
