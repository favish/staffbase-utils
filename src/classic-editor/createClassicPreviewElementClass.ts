import { createRoot, type Root } from 'react-dom/client'

import { ensureShadowMount } from '../shadow/react/ensureShadowMount'
import type { ShadowMount } from '../types/shadow/ShadowMount'
import { classicPreviewCss } from './classicPreviewCss'
import { openClassicConfigModal } from './openClassicConfigModal'
import { renderClassicPreview } from './renderClassicPreview'
import type { ClassicEditorSupportConfig } from './types/ClassicEditorSupportConfig'

/**
 * Builds the preview custom-element class scoped to one iframe's realm. Custom
 * elements must extend the HTMLElement of the realm whose registry defines them,
 * so the iframe's own HTMLElement is used as the base. The element renders the
 * widget's preview (in a shadow mount) and opens the config dialog on
 * double-click.
 * @param {Window} win - The iframe window whose realm the class belongs to.
 * @param {ClassicEditorSupportConfig} config - The widget's support config.
 * @returns {CustomElementConstructor} The realm-bound preview element class.
 */
export const createClassicPreviewElementClass = (
  win: Window,
  config: ClassicEditorSupportConfig,
): CustomElementConstructor => {
  const RealmHTMLElement = (win as Window & typeof globalThis).HTMLElement

  return class ClassicPreviewElement extends RealmHTMLElement {
    private mount: ShadowMount | undefined
    private root: Root | undefined

    /**
     *
     */
    public static get observedAttributes(): string[] {
      return config.attributes
    }

    /**
     *
     */
    public connectedCallback(): void {
      this.mount ??= ensureShadowMount(this, {
        cacheKey: `${config.element}-classic`,
        cssText: `${config.widgetCss}\n${classicPreviewCss}`,
      })
      this.root ??= createRoot(this.mount.reactMountEl)
      this.renderPreview()
      this.addEventListener('dblclick', this.handleEdit)
    }

    /**
     *
     */
    public attributeChangedCallback(): void {
      this.renderPreview()
    }

    /**
     *
     */
    public disconnectedCallback(): void {
      this.root?.unmount()
      this.root = undefined
      this.mount = undefined
      this.removeEventListener('dblclick', this.handleEdit)
    }

    /**
     *
     */
    private readonly renderPreview = (): void => {
      if (this.root && this.mount) {
        renderClassicPreview(this.root, this.mount, this, config)
      }
    }

    /**
     *
     */
    private readonly handleEdit = (): void => {
      openClassicConfigModal(this, config)
    }
  }
}
