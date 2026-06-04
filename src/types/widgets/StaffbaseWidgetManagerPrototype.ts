/**
 * The host's private widget-manager prototype
 * (`window.staffbase.content.widgetMgr.prototype`). All members are optional
 * because this is an undocumented API that may change.
 */
export interface StaffbaseWidgetManagerPrototype {
  _widgets?: unknown[]
  _extractWidgets?: (container: HTMLElement) => unknown[]
  _renderWidget?: (
    this: StaffbaseWidgetManagerPrototype,
    container: HTMLElement,
    widget: unknown,
  ) => void
}
