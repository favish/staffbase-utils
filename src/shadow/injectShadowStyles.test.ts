import { injectShadowStyles } from './injectShadowStyles'
import { isShadowRoot } from './isShadowRoot'

const makeShadowHost = (): ShadowRoot => {
  const host = document.createElement('div')
  document.body.appendChild(host)
  return host.attachShadow({ mode: 'open' })
}

describe('isShadowRoot', () => {
  it('is true for a real shadow root', () => {
    expect(isShadowRoot(makeShadowHost())).toBe(true)
  })

  it('is false for a plain element and for null', () => {
    expect(isShadowRoot(document.createElement('div'))).toBe(false)
    expect(isShadowRoot(null)).toBe(false)
  })
})

describe('injectShadowStyles', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('injects a style element with the given id and css', () => {
    const root = makeShadowHost()
    injectShadowStyles(root, '.a{color:red}', 'sbu-style')
    const el = root.getElementById('sbu-style')
    expect(el).toBeInstanceOf(HTMLStyleElement)
    expect(el?.textContent).toBe('.a{color:red}')
  })

  it('is idempotent and updates css in place', () => {
    const root = makeShadowHost()
    injectShadowStyles(root, '.a{color:red}', 'sbu-style')
    injectShadowStyles(root, '.a{color:blue}', 'sbu-style')
    expect(root.querySelectorAll('#sbu-style').length).toBe(1)
    expect(root.getElementById('sbu-style')?.textContent).toBe('.a{color:blue}')
  })

  it('throws when the target is not a shadow root', () => {
    const notShadow = document.createElement('div') as unknown as ShadowRoot
    expect(() => injectShadowStyles(notShadow, '.a{}', 'x')).toThrow()
  })
})
