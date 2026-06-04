import { stripHtmlTags } from './stripHtmlTags'

/**
 * Normalizes HTML into a lowercase, punctuation-free, single-spaced token string
 * for search indexing/matching. From alerts' cleanHTML; builds on stripHtmlTags
 * so tag removal stays single-sourced.
 * @param {string} html - The HTML string to clean.
 * @returns {string} The cleaned, normalized text.
 */
export const cleanHTML = (html: string): string =>
  stripHtmlTags(html)
    .toLowerCase()
    .replace(/[.,!?;:"'()[\]\-_/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
