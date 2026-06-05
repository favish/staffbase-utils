import { bodyScrollLock } from './bodyScrollLock'

describe('bodyScrollLock', () => {
  afterEach(() => {
    document.body.removeAttribute('style')
  })

  it('locks on first key and restores after the last unlock', () => {
    bodyScrollLock.lock('a')
    expect(document.body.style.overflow).toBe('hidden')

    bodyScrollLock.unlock('a')
    expect(document.body.style.overflow).toBe('')
  })

  it('stays locked until every key is released (reference counted)', () => {
    bodyScrollLock.lock('a')
    bodyScrollLock.lock('b')

    bodyScrollLock.unlock('a')
    expect(document.body.style.overflow).toBe('hidden')

    bodyScrollLock.unlock('b')
    expect(document.body.style.overflow).toBe('')
  })

  it('ignores unlocking an unknown key', () => {
    bodyScrollLock.unlock('missing')
    expect(document.body.style.overflow).toBe('')
  })
})
