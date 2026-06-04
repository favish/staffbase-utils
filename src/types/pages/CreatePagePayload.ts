import type { components } from './generated/pagesApi'

/**
 * Request body for creating a page (`POST /api/pages`).
 *
 * Thin alias over the machine-generated Pages API schema so the public name
 * stays stable even if `generated/pagesApi.ts` is regenerated. Unlike the read
 * side, the write side of the Pages spec is properly schematized, so this is
 * sourced directly from codegen (`CreatePagePayloadSchema`, itself an alias of
 * `PagePayloadSchema`).
 */
export type CreatePagePayload = components['schemas']['CreatePagePayloadSchema']
