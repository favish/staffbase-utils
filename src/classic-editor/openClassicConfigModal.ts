import { createRoot } from 'react-dom/client'

import { commitWidgetAttributes } from './commitWidgetAttributes'
import { readWidgetAttributes } from './readWidgetAttributes'
import type { ClassicEditorSupportConfig } from './types/ClassicEditorSupportConfig'

/**
 * Opens the widget's configuration form for a placed element. Mounts the form
 * (provided by the widget via config.renderConfigForm) into the top document via
 * the bundle's own React; on submit, writes the edited attributes back onto the
 * element and persists them. A fixed host id guards against stacking dialogs.
 * @param {HTMLElement} element - The placed widget element to configure.
 * @param {ClassicEditorSupportConfig} config - The widget's support config.
 * @returns {void}
 */
export const openClassicConfigModal = (
  element: HTMLElement,
  config: ClassicEditorSupportConfig,
): void => {
  const hostId = `sbu-classic-config-${config.element}`
  if (window.document.getElementById(hostId)) return

  const host = window.document.createElement('div')
  host.id = hostId
  window.document.body.appendChild(host)
  const root = createRoot(host)

  /**
   *
   */
  const close = (): void => {
    root.unmount()
    host.remove()
  }

  root.render(
    config.renderConfigForm({
      initial: readWidgetAttributes(element, config.attributes),
      onCancel: close,
      /**
       *
       * @param values
       */
      onSubmit: (values) => {
        commitWidgetAttributes(element, values)
        close()
      },
    }),
  )
}
