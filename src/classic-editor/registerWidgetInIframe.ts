import { createClassicPreviewElementClass } from './createClassicPreviewElementClass'
import { isTinyMceEditorIframe } from './isTinyMceEditorIframe'
import type { ClassicEditorSupportConfig } from './types/ClassicEditorSupportConfig'

/**
 * Registers the preview element in one same-origin tinymce editor iframe's
 * customElements registry. Idempotent and silent on cross-origin iframes.
 * @param {HTMLIFrameElement} iframe - The candidate iframe.
 * @param {ClassicEditorSupportConfig} config - The widget's support config.
 * @returns {void}
 */
export const registerWidgetInIframe = (
  iframe: HTMLIFrameElement,
  config: ClassicEditorSupportConfig,
): void => {
  if (!isTinyMceEditorIframe(iframe)) return
  const win = iframe.contentWindow
  if (!win || win === window) return
  try {
    // Touch the document to surface a cross-origin SecurityError here.
    void win.document
  } catch {
    return
  }
  const registry = win.customElements
  if (!registry || registry.get(config.element)) return
  try {
    registry.define(
      config.element,
      createClassicPreviewElementClass(win, config),
    )
  } catch {
    // A concurrent define by the host, or a torn-down iframe: nothing to do.
  }
}
