import type { RenderWidgetsOptions } from '../types/widgets/RenderWidgetsOptions'
import type { RenderWidgetsResult } from '../types/widgets/RenderWidgetsResult'

import { defaultWidgetOnError } from './defaultWidgetOnError'
import { getWidgetManagerConstructor } from './getWidgetManagerConstructor'
import { getWidgetManagerPrototype } from './getWidgetManagerPrototype'
import { hasRequiredWidgetManagerMethods } from './hasRequiredWidgetManagerMethods'
import { isKnownStaffbaseRenderError } from './isKnownStaffbaseRenderError'

// Global serialization chain: all renders run one at a time so they never race
// on the host's shared `_widgets` array (unacknowledged-bulletins' lock, made
// queue-based). Per-cancelKey run ids drop superseded renders (alerts' WeakMap
// cancellation; no AbortController, for old webviews). warn-once keeps a missing
// manager observable without spam (alerts).
let queue: Promise<unknown> = Promise.resolve()
const cancelTokens = new WeakMap<object, number>()
let hasWarnedManagerUnavailable = false

/**
 * Runs the retry loop for a single render: constructor path first, prototype
 * fallback, with cancellation checks and known-error swallowing.
 * @param {HTMLElement} container - The container to render widgets into.
 * @param {object} cancelKey - The cancellation key for this render.
 * @param {number} runId - This render's run id for the cancel key.
 * @param {number} maxRetries - Maximum render attempts.
 * @param {number} retryDelay - Delay between attempts, in milliseconds.
 * @param {(error: unknown, context: string) => void} onError - Error reporter.
 * @returns {Promise<RenderWidgetsResult>} The typed render result.
 */
const executeRender = async (
  container: HTMLElement,
  cancelKey: object,
  runId: number,
  maxRetries: number,
  retryDelay: number,
  onError: (error: unknown, context: string) => void,
): Promise<RenderWidgetsResult> => {
  let attempts = 0
  let managerSeen = false

  while (attempts < maxRetries) {
    attempts++
    if (cancelTokens.get(cancelKey) !== runId)
      return { ok: false, reason: 'cancelled' }
    if (typeof container.querySelectorAll !== 'function') {
      return { ok: false, reason: 'no-container' }
    }

    // Prefer Staffbase's real widget manager (closest to host behavior).
    const ctor = getWidgetManagerConstructor()
    if (ctor) {
      managerSeen = true
      try {
        const instance = new ctor(undefined, false)
        if (typeof instance.render === 'function') {
          await instance.render(container)
          return { ok: true, rendered: 0 }
        }
      } catch {
        // Fall back to the private prototype path below.
      }
    }

    const proto = getWidgetManagerPrototype()
    if (proto && hasRequiredWidgetManagerMethods(proto)) {
      managerSeen = true
      if (!Array.isArray(proto._widgets)) proto._widgets = []

      let widgets: unknown[]
      try {
        widgets = proto._extractWidgets(container)
      } catch (error) {
        onError(error, 'extract')
        widgets = []
      }

      if (widgets.length > 0) {
        let rendered = 0
        for (const widget of widgets) {
          if (cancelTokens.get(cancelKey) !== runId) {
            return { ok: false, reason: 'cancelled' }
          }
          try {
            proto._renderWidget.call(proto, container, widget)
            rendered++
          } catch (error) {
            if (!isKnownStaffbaseRenderError(error))
              onError(error, 'render-widget')
          }
        }
        return { ok: true, rendered }
      }
    }

    if (attempts >= maxRetries) break
    await new Promise((resolve) => setTimeout(resolve, retryDelay))
  }

  if (!managerSeen) {
    if (!hasWarnedManagerUnavailable) {
      hasWarnedManagerUnavailable = true
      onError(
        new Error('Staffbase widget manager unavailable after retries.'),
        'manager-unavailable',
      )
    }
    return { ok: false, reason: 'manager-unavailable' }
  }
  return { ok: false, reason: 'no-widgets' }
}

/**
 * Renders the widgets embedded in `container` using the host's private widget
 * manager. Superset of the four widget services: constructor path first with a
 * prototype fallback, a global queue that serializes renders, per-cancelKey
 * cancellation of superseded renders, configurable retries, swallowing of known
 * internal Staffbase errors, and a once-per-session warning when the manager is
 * missing. Returns a typed result so callers can react (e.g. mark a
 * data-widget-render-error attribute).
 * @param {HTMLElement | null} container - The element whose embedded widgets are rendered.
 * @param {RenderWidgetsOptions} options - Retry, error and cancellation options.
 * @returns {Promise<RenderWidgetsResult>} The typed render result.
 */
export const renderWidgets = (
  container: HTMLElement | null,
  options: RenderWidgetsOptions = {},
): Promise<RenderWidgetsResult> => {
  if (!container) return Promise.resolve({ ok: false, reason: 'no-container' })

  const {
    maxRetries = 10,
    retryDelay = 300,
    onError = defaultWidgetOnError,
    cancelKey = container,
  } = options

  // Bump the run id synchronously so any older in-flight/queued render for the
  // same key sees itself as superseded.
  const runId = (cancelTokens.get(cancelKey) ?? 0) + 1
  cancelTokens.set(cancelKey, runId)

  const run = queue.then(() =>
    executeRender(container, cancelKey, runId, maxRetries, retryDelay, onError),
  )
  // Keep the queue chain alive regardless of individual outcomes.
  queue = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}
