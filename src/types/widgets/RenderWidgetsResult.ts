/**
 * Result of a renderWidgets call. `rendered` is the number of widgets rendered
 * via the prototype path; it is 0 when the host constructor path handled
 * rendering (the count is not observable there).
 */
export type RenderWidgetsResult =
  | { ok: true; rendered: number }
  | {
      ok: false
      reason:
        | 'no-container'
        | 'manager-unavailable'
        | 'no-widgets'
        | 'cancelled'
    }
