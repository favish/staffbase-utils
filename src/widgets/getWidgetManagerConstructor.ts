import type { StaffbaseWidgetManagerConstructor } from '../types/widgets/StaffbaseWidgetManagerConstructor'

/**
 * Resolves the host widget-manager constructor from the global Staffbase object,
 * or null when it is not a function (older runtimes / platform regression).
 * @returns {StaffbaseWidgetManagerConstructor | null} The constructor or null.
 */
export const getWidgetManagerConstructor =
  (): StaffbaseWidgetManagerConstructor | null => {
    if (typeof window === 'undefined') return null
    const ctor = (
      window as unknown as {
        staffbase?: { content?: { widgetMgr?: unknown } }
      }
    ).staffbase?.content?.widgetMgr
    return typeof ctor === 'function'
      ? (ctor as StaffbaseWidgetManagerConstructor)
      : null
  }
