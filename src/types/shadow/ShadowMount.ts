import type { EmotionCache } from '@emotion/cache'

/**
 * The shadow-root mount a widget renders into: the root itself, the React mount
 * node, the portal container node (kept inside the shadow tree for isolation),
 * and the Emotion cache scoped to the shadow root.
 */
export interface ShadowMount {
  shadowRoot: ShadowRoot
  reactMountEl: HTMLDivElement
  portalContainerEl: HTMLDivElement
  emotionCache: EmotionCache
}
