// Zero-width characters that JS's \s does not match but that creep into
// CMS-pasted content: zero-width space (U+200B), non-joiner (U+200C), joiner
// (U+200D) and the byte-order mark (U+FEFF). Built from code points to keep the
// source strictly ASCII.
const ZERO_WIDTH_PATTERN = new RegExp('\\u200B|\\u200C|\\u200D|\\uFEFF', 'g')

/**
 * Normalizes text for case-insensitive comparison and matching.
 *
 * Lowercases, trims, strips zero-width characters, and collapses all remaining
 * whitespace (which `\s` already covers, including NBSP and ideographic spaces)
 * into single ASCII spaces, so visually-identical strings compare equal.
 * @param {string | null | undefined} text - The text to normalize.
 * @returns {string} The normalized text.
 */
export const normalizeText = (text: string | null | undefined): string => {
  if (!text) return ''

  return text
    .toLowerCase()
    .trim()
    .replace(ZERO_WIDTH_PATTERN, '')
    .replace(/\s+/g, ' ')
}
