import { stripHtmlTags } from '../html/stripHtmlTags'
import { normalizeText } from './normalizeText'

// Punctuation removed before indexing so "alpha-beta" and "alpha beta" match.
const PUNCTUATION_PATTERN = /[.,!?;:"'()[\]\-_/\\]/g

/**
 * Produces a plain, normalized search string from possibly-HTML content.
 *
 * Strips tags, removes punctuation, then applies the shared text normalization
 * (lowercase, zero-width removal, whitespace collapse). Suitable for building
 * full-text indexes (e.g. lunr) or matching free-text queries.
 * @param {string | null | undefined} html - Content that may contain HTML.
 * @returns {string} The normalized, tag-free search text.
 */
export const normalizeTextForSearch = (
  html: string | null | undefined,
): string =>
  normalizeText(stripHtmlTags(html ?? '').replace(PUNCTUATION_PATTERN, ' '))
