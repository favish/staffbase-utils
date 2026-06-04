import createCache from '@emotion/cache'

import type { EnsureShadowMountOptions } from '../../types/shadow/EnsureShadowMountOptions'
import type { ShadowMount } from '../../types/shadow/ShadowMount'
import { injectShadowStyles } from '../injectShadowStyles'
import { getOrCreateDiv } from './getOrCreateDiv'
import { getOrCreateEmotionInsertionPoint } from './getOrCreateEmotionInsertionPoint'

const STYLE_ELEMENT_ID = 'sbu-shadow-styles'
const REACT_MOUNT_ID = 'sbu-react-root'
const PORTAL_CONTAINER_ID = 'sbu-portal-root'
const EMOTION_INSERTION_POINT_ID = 'sbu-emotion-insertion-point'

/**
 * Ensures a ShadowRoot mount exists on the host element for a widget.
 *
 * Creates stable React-mount and portal-container nodes, injects the widget's CSS
 * into the shadow root only (never into the document), and configures an Emotion
 * cache scoped to the shadow root. All internal ids are namespaced by `cacheKey`
 * so editor and runtime mounts on the same host never collide.
 * @param {HTMLElement} host - The host element to attach the shadow root to.
 * @param {EnsureShadowMountOptions} options - The cache key and the widget's CSS text.
 * @returns {ShadowMount} The shadow root, mount nodes and the scoped Emotion cache.
 */
export const ensureShadowMount = (
  host: HTMLElement,
  { cacheKey, cssText }: EnsureShadowMountOptions,
): ShadowMount => {
  const shadowRoot = host.shadowRoot ?? host.attachShadow({ mode: 'open' })

  const reactMountEl = getOrCreateDiv(
    shadowRoot,
    `${REACT_MOUNT_ID}-${cacheKey}`,
  )
  const portalContainerEl = getOrCreateDiv(
    shadowRoot,
    `${PORTAL_CONTAINER_ID}-${cacheKey}`,
  )
  const insertionPoint = getOrCreateEmotionInsertionPoint(
    shadowRoot,
    `${EMOTION_INSERTION_POINT_ID}-${cacheKey}`,
  )

  injectShadowStyles(shadowRoot, cssText, `${STYLE_ELEMENT_ID}-${cacheKey}`)

  // Emotion's `container` is typed as HTMLElement but supports ShadowRoot targets
  // at runtime; the localized cast keeps the rest of the call type-safe.
  const emotionCache = createCache({
    key: cacheKey,
    container: shadowRoot as unknown as HTMLElement,
    insertionPoint,
  })

  return { shadowRoot, reactMountEl, portalContainerEl, emotionCache }
}
