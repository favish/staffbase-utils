import type { Config } from 'dompurify'

/**
 * DOMPurify custom-element handling that preserves embedded-widget custom
 * elements (any hyphenated tag, e.g. `<news-teaser>`) and their kebab-case /
 * `data-` attributes so the host widget manager (renderWidgets) can hydrate
 * them. Without this, DOMPurify's default profile silently strips unknown custom
 * elements AND their attributes, wiping embeds out of the content before they can
 * render. `on*` event-handler attributes are still rejected (defense in depth
 * alongside DOMPurify's own XSS stripping). Promoted from staffbase-global-content.
 */
export const customElementHandling: NonNullable<
  Config['CUSTOM_ELEMENT_HANDLING']
> = {
  // Any valid custom-element tag name (must contain a hyphen per the spec).
  tagNameCheck: /^[a-z][a-z0-9]*-[a-z0-9-]*$/,
  // Allow kebab-case / data- attributes on custom elements, but never `on*`.
  attributeNameCheck: /^(?!on)[a-z][a-z0-9]*([-:][a-z0-9]+)*$/,
  // Permit `<div is="some-widget">`-style customized built-in elements.
  allowCustomizedBuiltInElements: true,
}
