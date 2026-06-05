import type { ReactElement } from 'react'
import { createElement, useEffect, useRef } from 'react'
import type { ShadowStyleProps } from '../types/react/ShadowStyleProps'

const DEFAULT_STYLE_ID = 'staffbase-shadow-style'

/**
 * Injects CSS text into the ShadowRoot that surrounds it.
 *
 * Replaces the per-widget DrawerContentStyles components (identical in the
 * alerts and unacknowledged-bulletins widgets). Renders a hidden anchor, finds
 * the enclosing ShadowRoot via its root node (falling back to
 * `fallbackHostSelector` for content portaled elsewhere), and appends/updates a
 * single `<style>` keyed by `styleId` so re-renders never duplicate it.
 * @param {ShadowStyleProps} props - The CSS and targeting options.
 * @returns {ReactElement} A hidden anchor element.
 */
export const ShadowStyle = ({
  css,
  styleId = DEFAULT_STYLE_ID,
  fallbackHostSelector,
}: ShadowStyleProps): ReactElement => {
  const anchorRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const rootNode = anchorRef.current?.getRootNode()
    const shadowRoot =
      rootNode instanceof ShadowRoot
        ? rootNode
        : fallbackHostSelector
          ? (document.querySelector(fallbackHostSelector)?.shadowRoot ?? null)
          : null

    if (!shadowRoot) return

    const selector = `style[data-shadow-style="${styleId}"]`
    const existing = shadowRoot.querySelector(selector)

    if (existing instanceof HTMLStyleElement) {
      if (existing.textContent !== css) existing.textContent = css
      return
    }

    const styleEl = document.createElement('style')
    styleEl.setAttribute('data-shadow-style', styleId)
    styleEl.textContent = css
    shadowRoot.appendChild(styleEl)
  }, [css, styleId, fallbackHostSelector])

  return createElement('span', {
    ref: anchorRef,
    style: { display: 'none' },
  })
}
