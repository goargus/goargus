import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PortfolioOfPages from '../components/PortfolioOfPages.vue'

describe('PortfolioOfPages', () => {
  const mockProps = {
    title: 'Mi Portafolio'
  }

  it('mounts properly', () => {
    const wrapper = mount(PortfolioOfPages, {
      props: mockProps
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the title correctly', () => {
    const wrapper = mount(PortfolioOfPages, {
      props: mockProps
    })
    const title = wrapper.find('h2')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe(mockProps.title)
    expect(title.classes()).toContain('text-6xl')
    expect(title.classes()).toContain('tracking-tighter')
    expect(title.classes()).toContain('leading-none')
    expect(title.classes()).toContain('lowercase')
  })

  it('renders the Carousel component', () => {
    const wrapper = mount(PortfolioOfPages, {
      props: mockProps
    })
    const carousel = wrapper.findComponent({ name: 'Carousel' })
    expect(carousel.exists()).toBe(true)
  })

  it('passes correct projects data to Carousel', () => {
    const wrapper = mount(PortfolioOfPages, {
      props: mockProps
    })
    const carousel = wrapper.findComponent({ name: 'Carousel' })
    const projects = carousel.props('projects')

    // Verify projects array has items with expected structure
    expect(projects.length).toBeGreaterThan(0)
    projects.forEach(project => {
      expect(project).toHaveProperty('imagesrc')
      expect(project).toHaveProperty('imageAlt')
      expect(project).toHaveProperty('link')
      expect(typeof project.imagesrc).toBe('string')
      expect(typeof project.imageAlt).toBe('string')
      expect(typeof project.link).toBe('string')
    })
  })

  it('has correct section layout and classes', () => {
    const wrapper = mount(PortfolioOfPages, {
      props: mockProps
    })
    const section = wrapper.find('section')

    expect(section.classes()).toContain('flex')
    expect(section.classes()).toContain('flex-col')
    expect(section.classes()).toContain('w-full')
    expect(section.classes()).toContain('text-center')
    expect(section.classes()).toContain('text-neutral-600')
    expect(section.classes()).toContain('max-md:max-w-full')
  })

  it('requires title prop', () => {
    const wrapper = mount(PortfolioOfPages, {
      props: mockProps
    })

    const props = wrapper.vm.$options.props
    expect(props.title.required).toBe(true)
  })

  it('has correct responsive classes', () => {
    const wrapper = mount(PortfolioOfPages, {
      props: mockProps
    })
    const title = wrapper.find('h2')

    expect(title.classes()).toContain('max-md:max-w-full')
    expect(title.classes()).toContain('max-md:text-4xl')
  })
}) 