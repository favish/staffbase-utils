import { getDeepActiveElement } from './getDeepActiveElement'

describe('getDeepActiveElement', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('returns the focused element in the top-level document', () => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    expect(getDeepActiveElement()).toBe(input)
  })

  it('descends into a shadow root to find the real focused element', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const shadow = host.attachShadow({ mode: 'open' })
    const button = document.createElement('button')
    shadow.appendChild(button)
    button.focus()

    expect(getDeepActiveElement()).toBe(button)
  })
})
