import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import routes from 'pages-generated'
import NotFound from '../../pages/[...all].vue'

const stubs = { HeaderBanner: true, RouterLink: { template: '<a><slot /></a>' } }

const clearRobots = () => {
  document.head.querySelectorAll('meta[name="robots"]').forEach((tag) => tag.remove())
}

describe('the catch-all page', () => {
  beforeEach(clearRobots)
  afterEach(clearRobots)

  it('is registered on the router as a catch-all', () => {
    const catchAll = routes.filter((route) => route.path.includes(':'))
    expect(catchAll).toHaveLength(1)
    expect(catchAll[0].path).toBe('/:all(.*)*')
  })

  it('renders the branded not-found copy rather than an empty view', () => {
    const wrapper = mount(NotFound, { global: { stubs } })
    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain('La página que buscas no existe')
  })

  it('offers a way back to the homepage and to Contacto', () => {
    const wrapper = mount(NotFound, { global: { stubs } })
    expect(wrapper.text()).toContain('Ir al inicio')
    expect(wrapper.text()).toContain('Contáctanos')
  })

  it('adds a noindex robots tag while it is mounted', () => {
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull()
    const wrapper = mount(NotFound, { global: { stubs } })
    const tag = document.head.querySelector('meta[name="robots"]')
    expect(tag).not.toBeNull()
    expect(tag.getAttribute('content')).toBe('noindex')
    wrapper.unmount()
  })

  it('removes the noindex tag on unmount so real pages stay indexable', () => {
    const wrapper = mount(NotFound, { global: { stubs } })
    expect(document.head.querySelector('meta[name="robots"]')).not.toBeNull()
    wrapper.unmount()
    expect(document.head.querySelector('meta[name="robots"]')).toBeNull()
  })
})
