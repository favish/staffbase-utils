/**
 * Options for useForceFullScreenOverlay.
 */
export interface ForceFullScreenOverlayOptions {
  /** `pointer-events` value to enforce (default `'auto'`). */
  pointerEvents?: 'auto' | 'none'
  /** `z-index` to enforce, when the overlay must sit above host content. */
  zIndex?: number
}
