import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IconCard from '../components/IconCard.vue'

describe('IconCard', () => {
  const mockProps = {
    imageSrc: '/path/to/icon.svg',
    imageAlt: 'Test Icon',
    title: 'Test Title',
    description: 'Test Description'
  }

  // Mock IntersectionObserver
  beforeAll(() => {
    global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
      observe: vi.fn((element) => {
        callback([{ isIntersecting: true, target: element }])
      }),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }))
  })

  afterAll(() => {
    delete global.IntersectionObserver
  })

  it('mounts properly', () => {
    const wrapper = mount(IconCard, {
      props: mockProps
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders with correct props', () => {
    const wrapper = mount(IconCard, {
      props: mockProps
    })

    expect(wrapper.find('h3').text()).toBe(mockProps.title)
    expect(wrapper.find('p').text()).toBe(mockProps.description)

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe(mockProps.imageSrc)
    expect(img.attributes('alt')).toBe(mockProps.imageAlt)
  })

  it('has correct CSS classes', () => {
    const wrapper = mount(IconCard, {
      props: mockProps
    })

    const container = wrapper.find('.icon-card')
    expect(container.exists()).toBe(true)

    const iconWrapper = wrapper.find('.icon-wrapper')
    expect(iconWrapper.exists()).toBe(true)

    const title = wrapper.find('h3')
    expect(title.classes()).toContain('font-bold')

    const description = wrapper.find('p')
    expect(description.exists()).toBe(true)
  })

  it('triggers animation when visible', async () => {
    const wrapper = mount(IconCard, {
      props: mockProps
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('.icon-card').classes()).toContain('animate-visible')
  })
})
