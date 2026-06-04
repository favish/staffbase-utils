/**
 * The host's widget-manager constructor (`window.staffbase.content.widgetMgr`).
 * The signature is internal; most builds accept `(unused, isEditor?)` and the
 * instance exposes a `render(container)` method.
 */
export type StaffbaseWidgetManagerConstructor = new (...args: unknown[]) => {
  render?: (container: HTMLElement) => Promise<void> | void
}
