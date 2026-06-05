/**
 * Props for the ShadowStyle component.
 */
export interface ShadowStyleProps {
  /** The CSS text to inject into the surrounding ShadowRoot. */
  css: string
  /**
   * Stable id distinguishing this style block from others in the same root, so
   * updates replace rather than duplicate it. Defaults to a shared id.
   */
  styleId?: string
  /**
   * CSS selector for a host element whose `shadowRoot` should receive the style
   * when the component is not itself rendered inside a ShadowRoot (e.g. content
   * portaled into a drawer). Optional.
   */
  fallbackHostSelector?: string
}
