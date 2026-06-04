import type { components } from './generated/groupsApi'

/**
 * Request body for creating a group.
 *
 * Thin alias over the machine-generated groups API schema so the public name
 * stays stable even if `generated/groupsApi.ts` is regenerated. The write side
 * of the spec is properly schematized, so this is sourced directly from codegen
 * (unlike `Group`, whose read shape had to be curated from prod because
 * the spec's `Group` schema does not match the runtime).
 */
export type CreateGroupBody = components['schemas']['GroupCreate']
