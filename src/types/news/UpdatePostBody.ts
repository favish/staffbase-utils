import type { components } from './generated/newsApi'

/**
 * Request body for updating a news post (`PUT /posts/{postID}`).
 *
 * Thin alias over the machine-generated News API schema so the public name
 * stays stable even if `generated/newsApi.ts` is regenerated. Run
 * `pnpm run codegen:news` to refresh the underlying generated types.
 */
export type UpdatePostBody = components['schemas']['UpdatePost']
