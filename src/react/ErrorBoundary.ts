import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'
import type { ErrorBoundaryProps } from '../types/react/ErrorBoundaryProps'

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * A render error boundary that isolates a failing subtree.
 *
 * Catches errors thrown during descendant render, shows the optional `fallback`
 * (nothing by default), and forwards the error to `onError` so the widget can
 * log it through its own logger. Written with the class API (no JSX) to match
 * the library's JSX-runtime-free build.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = { hasError: false }

  /**
   * Flips into the error state when a descendant throws.
   * @returns {ErrorBoundaryState} The next state.
   */
  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  /**
   * Forwards the caught error and component stack to the optional handler.
   * @param {Error} error - The thrown error.
   * @param {ErrorInfo} info - React error info (component stack).
   * @returns {void} Nothing.
   */
  public componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info)
  }

  /**
   * Renders the children, or the fallback once an error has been caught.
   * @returns {ReactNode} The children or fallback.
   */
  public render(): ReactNode {
    if (this.state.hasError) return this.props.fallback ?? null

    return this.props.children
  }
}
