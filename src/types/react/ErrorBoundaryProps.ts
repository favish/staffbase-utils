import type { ErrorInfo, ReactNode } from 'react'

/**
 * Props for the ErrorBoundary component.
 */
export interface ErrorBoundaryProps {
  /** The subtree to protect. */
  children?: ReactNode
  /** Rendered when a descendant throws during render. Defaults to nothing. */
  fallback?: ReactNode
  /**
   * Called when a descendant throws, with the error and React's component
   * stack, so the widget can log it through its own logger.
   * @param {Error} error - The thrown error.
   * @param {ErrorInfo} info - React error info (component stack).
   * @returns {void} Nothing.
   */
  onError?: (error: Error, info: ErrorInfo) => void
}
