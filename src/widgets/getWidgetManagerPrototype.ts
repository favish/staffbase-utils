import type { StaffbaseWidgetManagerPrototype } from '../types/widgets/StaffbaseWidgetManagerPrototype'

/**
 * Resolves the host widget-manager prototype (the private fallback API) from the
 * global Staffbase object, or null when it is unavailable.
 * @returns {StaffbaseWidgetManagerPrototype | null} The prototype or null.
 */
export const getWidgetManagerPrototype =
  (): StaffbaseWidgetManagerPrototype | null => {
    if (typeof window === 'undefined') return null
    const proto = (
      window as unknown as {
        staffbase?: {
          content?: {
            widgetMgr?: { prototype?: StaffbaseWidgetManagerPrototype }
          }
        }
      }
    ).staffbase?.content?.widgetMgr?.prototype
    return proto ?? null
  }
