import { isShadowRoot } from './isShadowRoot'

/**
 * Injects a CSS string into a ShadowRoot as a `<style>` element.
 *
 * Idempotent: reuses the element with the given id and only updates it when the
 * CSS changed. Throws when the target is not a ShadowRoot, so styles can never
 * leak outside the shadow tree.
 * @param {ShadowRoot} shadowRoot - The shadow root to inject into (required for isolation).
 * @param {string} cssText - The CSS to inject.
 * @param {string} styleElementId - Stable id for the injected `<style>` element.
 * @returns {void} Nothing.
 * @throws {Error} When `shadowRoot` is not a ShadowRoot instance.
 */
export const injectShadowStyles = (
  shadowRoot: ShadowRoot,
  cssText: string,
  styleElementId: string,
): void => {
  if (!isShadowRoot(shadowRoot)) {
    throw new Error(
      'injectShadowStyles: shadowRoot must be a ShadowRoot instance. ' +
        'CSS must never be injected outside shadowRoot for style isolation.',
    )
  }

  const existing = shadowRoot.getElementById(styleElementId)
  if (existing instanceof HTMLStyleElement) {
    if (existing.textContent !== cssText) {
      existing.textContent = cssText
    }
    return
  }

  const styleEl = document.createElement('style')
  styleEl.id = styleElementId
  styleEl.textContent = cssText
  shadowRoot.appendChild(styleEl)
}
