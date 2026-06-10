import { isClassicEditorPage } from './isClassicEditorPage'
import { registerWidgetInIframe } from './registerWidgetInIframe'
import type { ClassicEditorSupportConfig } from './types/ClassicEditorSupportConfig'

/**
 * Makes an externally-hosted Staffbase widget usable in the classic page editor.
 *
 * The classic editor runs the bundle in the top window but never defines the
 * custom element inside its tinymce canvas iframe, so placed elements stay inert
 * there and have no edit affordance. Call this once from the bundle entry (after
 * defineBlock). It watches for tinymce canvas iframes and, in each, defines a
 * preview element that renders the widget's editor view (with a limited-editor
 * warning) and opens the widget's config form on double-click, persisting edits
 * via Staffbase's classic-editor save model.
 *
 * No-op outside the classic editor (?isClassic=true) and on cross-origin iframes.
 * @param {ClassicEditorSupportConfig} config - The widget's support config.
 * @returns {void}
 */
export const installClassicEditorSupport = (
  config: ClassicEditorSupportConfig,
): void => {
  if (!isClassicEditorPage()) return

  /**
   *
   * @param iframe
   */
  const register = (iframe: HTMLIFrameElement): void => {
    registerWidgetInIframe(iframe, config)
  }

  document.querySelectorAll('iframe').forEach(register)

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof HTMLIFrameElement) {
          register(node)
          node.addEventListener('load', () => register(node), { once: true })
        } else if (node instanceof Element) {
          node.querySelectorAll('iframe').forEach(register)
        }
      }
    }
  })
  observer.observe(document.documentElement, { childList: true, subtree: true })
}
