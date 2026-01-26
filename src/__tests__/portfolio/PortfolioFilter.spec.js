import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PortfolioFilter from '../../components/portfolio/PortfolioFilter.vue'

const mockCategories = ['landing-page', 'e-commerce', 'corporate']

describe('PortfolioFilter', () => {
  it('mounts properly', () => {
    const wrapper = mount(PortfolioFilter, {
      props: {
        categories: mockCategories,
        activeCategory: null
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders "Todos" button', () => {
    const wrapper = mount(PortfolioFilter, {
      props: {
        categories: mockCategories,
        activeCategory: null
      }
    })

    const buttons = wrapper.findAll('.filter-button')
    expect(buttons[0].text()).toBe('Todos')
  })

  it('renders button for each category', () => {
    const wrapper = mount(PortfolioFilter, {
      props: {
        categories: mockCategories,
        activeCategory: null
      }
    })

    // +1 for "Todos" button
    const buttons = wrapper.findAll('.filter-button')
    expect(buttons.length).toBe(mockCategories.length + 1)
  })

  it('shows "Todos" as active when no category selected', () => {
    const wrapper = mount(PortfolioFilter, {
      props: {
        categories: mockCategories,
        activeCategory: null
      }
    })

    const todosButton = wrapper.findAll('.filter-button')[0]
    expect(todosButton.classes()).toContain('filter-button--active')
  })

  it('shows category as active when selected', () => {
    const wrapper = mount(PortfolioFilter, {
      props: {
        categories: mockCategories,
        activeCategory: 'landing-page'
      }
    })

    const buttons = wrapper.findAll('.filter-button')
    const todosButton = buttons[0]
    const landingButton = buttons[1] // First category after "Todos"

    expect(todosButton.classes()).not.toContain('filter-button--active')
    expect(landingButton.classes()).toContain('filter-button--active')
  })

  it('emits update:activeCategory with null when clicking Todos', async () => {
    const wrapper = mount(PortfolioFilter, {
      props: {
        categories: mockCategories,
        activeCategory: 'landing-page'
      }
    })

    const todosButton = wrapper.findAll('.filter-button')[0]
    await todosButton.trigger('click')

    expect(wrapper.emitted('update:activeCategory')).toBeTruthy()
    expect(wrapper.emitted('update:activeCategory')[0]).toEqual([null])
  })

  it('emits update:activeCategory with category when clicking category', async () => {
    const wrapper = mount(PortfolioFilter, {
      props: {
        categories: mockCategories,
        activeCategory: null
      }
    })

    const categoryButton = wrapper.findAll('.filter-button')[1]
    await categoryButton.trigger('click')

    expect(wrapper.emitted('update:activeCategory')).toBeTruthy()
    expect(wrapper.emitted('update:activeCategory')[0]).toEqual(['landing-page'])
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(PortfolioFilter, {
      props: {
        categories: mockCategories,
        activeCategory: null
      }
    })

    const container = wrapper.find('.filter-container')
    expect(container.attributes('role')).toBe('tablist')

    const buttons = wrapper.findAll('.filter-button')
    buttons.forEach(button => {
      expect(button.attributes('role')).toBe('tab')
      expect(button.attributes('aria-selected')).toBeDefined()
    })
  })

  it('displays category labels in Spanish', () => {
    const wrapper = mount(PortfolioFilter, {
      props: {
        categories: mockCategories,
        activeCategory: null
      }
    })

    const buttons = wrapper.findAll('.filter-button')
    expect(buttons[1].text()).toBe('Landing Page')
    expect(buttons[2].text()).toBe('E-commerce')
    expect(buttons[3].text()).toBe('Corporativo')
  })
})
