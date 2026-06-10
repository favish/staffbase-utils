import type { ShadowMount } from '../../types/shadow/ShadowMount'

/**
 * Context passed to a widget's editor-preview renderer in the classic editor.
 * The widget wraps its preview view in its own providers (e.g. the Emotion cache
 * and portal container from the mount) and reads its attributes via getAttribute.
 */
export interface ClassicPreviewRenderContext {
  /** The shadow mount (Emotion cache, portal container, mount node). */
  mount: ShadowMount
  /** Reads an attribute off the placed widget element. */
  getAttribute: (name: string) => string | null
}
