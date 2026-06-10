/**
 * Context passed to a widget's config-form renderer in the classic editor. The
 * widget renders its own configuration UI (e.g. its RJSF form) and reports the
 * edited attribute map via onSubmit; the library writes it back onto the element
 * and persists it.
 */
export interface ClassicConfigRenderContext {
  /** The placed widget's current attributes (kebab keys), as strings. */
  initial: Record<string, string>
  /** Persist the edited attribute map and close the dialog. */
  onSubmit: (values: Record<string, string>) => void
  /** Close the dialog without saving. */
  onCancel: () => void
}
