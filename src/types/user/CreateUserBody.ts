import type { components } from './generated/userApi'

/**
 * Request body for creating a Staffbase user (`POST /users`).
 *
 * Thin alias over the machine-generated user API schema so the public name
 * stays stable even if `generated/userApi.ts` is regenerated. The write side of
 * the spec is properly schematized, so this is sourced directly from codegen
 * (run the user codegen script to refresh).
 */
export type CreateUserBody = components['schemas']['CreateUser']
