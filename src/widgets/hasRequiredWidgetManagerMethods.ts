import type { StaffbaseWidgetManagerPrototype } from '../types/widgets/StaffbaseWidgetManagerPrototype'

/**
 * Type guard asserting the widget-manager prototype exposes the methods the
 * prototype render path needs.
 * @param {StaffbaseWidgetManagerPrototype} widgetMgr - The resolved prototype.
 * @returns {boolean} True when both _extractWidgets and _renderWidget are functions.
 */
export const hasRequiredWidgetManagerMethods = (
  widgetMgr: StaffbaseWidgetManagerPrototype,
): widgetMgr is StaffbaseWidgetManagerPrototype & {
  _extractWidgets: (container: HTMLElement) => unknown[]
  _renderWidget: (
    this: StaffbaseWidgetManagerPrototype,
    container: HTMLElement,
    widget: unknown,
  ) => void
} =>
  typeof widgetMgr._extractWidgets === 'function' &&
  typeof widgetMgr._renderWidget === 'function'
