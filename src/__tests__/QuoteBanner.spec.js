import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QuoteBanner from '../components/QuoteBanner.vue'
import { createRouter, createWebHistory } from 'vue-router'

describe('QuoteBanner', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/contact', component: {} }
    ]
  })

  it('mounts properly', () => {
    const wrapper = mount(QuoteBanner, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the main heading correctly', () => {
    const wrapper = mount(QuoteBanner, {
      global: {
        plugins: [router]
      }
    })
    const heading = wrapper.find('h2')
    expect(heading.exists()).toBe(true)
    expect(heading.text()).toBe('Y TÚ, ¿YA TIENES WEBSITE?')
    expect(heading.classes()).toContain('quote-title')
  })

  it('renders the website preview image', () => {
    const wrapper = mount(QuoteBanner, {
      global: {
        plugins: [router]
      }
    })
    const image = wrapper.find('img')
    expect(image.exists()).toBe(true)
    expect(image.attributes('alt')).toBe('Website Preview')
    expect(image.classes()).toContain('quote-image')
  })

  it('renders the call to action heading', () => {
    const wrapper = mount(QuoteBanner, {
      global: {
        plugins: [router]
      }
    })
    const ctaHeading = wrapper.find('h3')
    expect(ctaHeading.exists()).toBe(true)
    expect(ctaHeading.text()).toBe('¡Quiero Mi Website!')
    expect(ctaHeading.classes()).toContain('quote-subtitle')
  })

  it('renders the quote button as router-link', () => {
    const wrapper = mount(QuoteBanner, {
      global: {
        plugins: [router]
      }
    })
    const link = wrapper.find('a.quote-button')
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('Cotizar')
    expect(link.attributes('href')).toBe('/contact')
  })

  it('has correct section layout and classes', () => {
    const wrapper = mount(QuoteBanner, {
      global: {
        plugins: [router]
      }
    })
    const section = wrapper.find('section')

    expect(section.classes()).toContain('quote-banner')

    const divs = wrapper.findAll('div')
    expect(divs.length).toBe(3)

    expect(divs[0].classes()).toContain('quote-content')
    expect(divs[1].classes()).toContain('quote-image-container')
    expect(divs[2].classes()).toContain('quote-cta-container')
  })
})
