import type { components } from './generated/newsApi'

/**
 * Request body for creating a news post (`POST /channels/{channelID}/posts`).
 *
 * Thin alias over the machine-generated News API schema so the public name
 * stays stable even if `generated/newsApi.ts` is regenerated. The write side of
 * the spec is properly schematized, so this is sourced directly from codegen
 * (run `pnpm run codegen:news` to refresh).
 */
export type CreatePostBody = components['schemas']['CreatePost']
