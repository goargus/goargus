import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PortfolioCard from '../../components/portfolio/PortfolioCard.vue'

const mockProject = {
  id: '1',
  slug: 'test-project',
  title: 'Test Project',
  shortDescription: 'A test project description',
  category: 'landing-page',
  size: 'major',
  featured: true,
  thumbnail: {
    src: '/test-image.jpg',
    alt: 'Test image'
  },
  heroImage: {
    src: '/test-hero.jpg',
    alt: 'Test hero'
  },
  technologies: ['Vue', 'Tailwind', 'Node.js', 'PostgreSQL'],
  completedDate: '2025-01-01',
  order: 1
}

describe('PortfolioCard', () => {
  it('mounts properly', () => {
    const wrapper = mount(PortfolioCard, {
      props: { project: mockProject }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('renders project title', () => {
    const wrapper = mount(PortfolioCard, {
      props: { project: mockProject }
    })
    const title = wrapper.find('.card-title')
    expect(title.text()).toBe(mockProject.title)
  })

  it('renders project description', () => {
    const wrapper = mount(PortfolioCard, {
      props: { project: mockProject }
    })
    const description = wrapper.find('.card-description')
    expect(description.text()).toBe(mockProject.shortDescription)
  })

  it('renders category label', () => {
    const wrapper = mount(PortfolioCard, {
      props: { project: mockProject }
    })
    const category = wrapper.find('.card-category')
    expect(category.exists()).toBe(true)
    expect(category.text()).toBe('Landing Page')
  })

  it('renders thumbnail image', () => {
    const wrapper = mount(PortfolioCard, {
      props: { project: mockProject }
    })
    const img = wrapper.find('.card-image')
    expect(img.attributes('src')).toBe(mockProject.thumbnail.src)
    expect(img.attributes('alt')).toBe(mockProject.thumbnail.alt)
  })

  it('displays max 3 technologies', () => {
    const wrapper = mount(PortfolioCard, {
      props: { project: mockProject }
    })
    const techBadges = wrapper.findAll('.tech-badge')

    // 3 visible + 1 "+1" badge = 4 total
    expect(techBadges.length).toBe(4)
    expect(techBadges[3].text()).toBe('+1')
  })

  it('emits select event on click', async () => {
    const wrapper = mount(PortfolioCard, {
      props: { project: mockProject }
    })

    await wrapper.find('.portfolio-card').trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')[0]).toEqual([mockProject])
  })

  it('emits select event on enter key', async () => {
    const wrapper = mount(PortfolioCard, {
      props: { project: mockProject }
    })

    await wrapper.find('.portfolio-card').trigger('keydown.enter')
    expect(wrapper.emitted('select')).toBeTruthy()
  })

  it('emits select event on space key', async () => {
    const wrapper = mount(PortfolioCard, {
      props: { project: mockProject }
    })

    await wrapper.find('.portfolio-card').trigger('keydown.space')
    expect(wrapper.emitted('select')).toBeTruthy()
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(PortfolioCard, {
      props: { project: mockProject }
    })
    const card = wrapper.find('.portfolio-card')

    expect(card.attributes('role')).toBe('button')
    expect(card.attributes('tabindex')).toBe('0')
  })
})
