import type { components } from './generated/pagesApi'

/**
 * Request body for updating a page (`PUT /api/pages/{pageId}`).
 *
 * Thin alias over the machine-generated Pages API schema so the public name
 * stays stable even if `generated/pagesApi.ts` is regenerated. The update
 * endpoint reuses the base `PagePayloadSchema` (the same shape the create
 * payload aliases), sourced directly from codegen.
 */
export type UpdatePagePayload = components['schemas']['PagePayloadSchema']
