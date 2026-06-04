/**
 * Options for ensureShadowMount.
 */
export interface EnsureShadowMountOptions {
  /**
   * Stable, unique key. Namespaces the mount's internal element ids (so an editor
   * and a runtime mount on the same host never collide) and is used as the
   * Emotion cache key.
   */
  cacheKey: string
  /** The widget's shadow CSS text, injected into the shadow root. */
  cssText: string
}
