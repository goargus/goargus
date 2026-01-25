import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FooterMenu from '../components/FooterMenu.vue'
import { createRouter, createWebHistory } from 'vue-router'

describe('FooterMenu', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: {} },
      { path: '/contact', component: {} },
      { path: '/about', component: {} }
    ]
  })

  const mockProps = {
    title: 'Test Footer'
  }

  it('mounts properly', () => {
    const wrapper = mount(FooterMenu, {
      props: mockProps,
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders logo image with correct attributes', () => {
    const wrapper = mount(FooterMenu, {
      props: mockProps,
      global: {
        plugins: [router]
      }
    })
    const logo = wrapper.find('img.footer-logo')
    expect(logo.exists()).toBe(true)
    expect(logo.attributes('loading')).toBe('lazy')
    expect(logo.attributes('alt')).toBe('Go Argus Logo')
  })

  it('renders navigation links correctly', () => {
    const wrapper = mount(FooterMenu, {
      props: mockProps,
      global: {
        plugins: [router]
      }
    })
    const links = wrapper.findAll('a')

    expect(links.length).toBe(4)
    expect(links[0].text()).toBe('Contáctanos')
    expect(links[0].attributes('href')).toBe('/contact')
    expect(links[1].text()).toBe('Acerca de Nosotros')
    expect(links[1].attributes('href')).toBe('/about')
  })

  it('renders social media links with correct attributes', () => {
    const wrapper = mount(FooterMenu, {
      props: mockProps,
      global: {
        plugins: [router]
      }
    })
    const socialLinks = wrapper.findAll('a.social-icon-link')
    const socialImages = wrapper.findAll('img.social-icon')

    expect(socialLinks.length).toBe(2)
    expect(socialImages.length).toBe(2)

    expect(socialImages[0].attributes('alt')).toBe('Facebook')
    expect(socialImages[1].attributes('alt')).toBe('Instagram')
  })

  it('has correct CSS classes and styles', () => {
    const wrapper = mount(FooterMenu, {
      props: mockProps,
      global: {
        plugins: [router]
      }
    })

    const footer = wrapper.find('footer')
    expect(footer.classes()).toContain('footer-container')

    const nav = wrapper.find('nav')
    expect(nav.classes()).toContain('footer-nav')

    const ul = wrapper.find('ul')
    expect(ul.classes()).toContain('footer-links')
  })

  it('requires title prop', () => {
    const wrapper = mount(FooterMenu, {
      props: mockProps,
      global: {
        plugins: [router]
      }
    })

    const props = wrapper.vm.$options.props
    expect(props.title.required).toBe(true)
  })
})
