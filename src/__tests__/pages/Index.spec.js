import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Index from '../../pages/Index.vue'
import HeaderBanner from '../../components/HeaderBanner.vue'

const stubs = { OfferingSection: true, PortfolioOfPages: true, RouterLink: true }

describe('the homepage heading hierarchy', () => {
  it('opens with exactly one h1', () => {
    const wrapper = mount(Index, { global: { stubs } })
    expect(wrapper.findAll('h1')).toHaveLength(1)
    expect(wrapper.get('h1').text()).toBe('ARGUS')
  })

  it('renders no h2 above that h1 in the banner', () => {
    const wrapper = mount(Index, { global: { stubs } })
    expect(wrapper.find('header h2').exists()).toBe(false)
  })
})

describe('the banner heading level', () => {
  const render = (props) => mount(HeaderBanner, { props: { title: 'prueba', ...props }, global: { stubs } })

  it('stays an h2 by default, so pages with their own h1 keep one', () => {
    expect(render().find('h2').exists()).toBe(true)
    expect(render().find('h1').exists()).toBe(false)
  })

  it('becomes the h1 when a page asks for it', () => {
    const wrapper = render({ level: 1 })
    expect(wrapper.get('h1').text()).toBe('prueba')
    expect(wrapper.find('h2').exists()).toBe(false)
  })

  it('keeps the hero styling whichever level it renders', () => {
    expect(render().get('h2').classes()).toContain('hero-title')
    expect(render({ level: 1 }).get('h1').classes()).toContain('hero-title')
  })
})
