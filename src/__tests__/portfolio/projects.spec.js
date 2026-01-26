import { describe, it, expect } from 'vitest'
import {
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectById,
  getProjectsByCategory,
  getProjectsBySize,
  getAvailableCategories,
  toLegacyProject,
  getFeaturedProjectsLegacy,
  getCategoryLabel,
  categoryLabels
} from '../../data/projects'

describe('Projects Data Layer', () => {
  describe('getAllProjects', () => {
    it('returns all projects sorted by order', () => {
      const projects = getAllProjects()
      expect(projects.length).toBeGreaterThan(0)

      // Verify sorted by order
      for (let i = 1; i < projects.length; i++) {
        expect(projects[i].order).toBeGreaterThanOrEqual(projects[i - 1].order)
      }
    })

    it('returns projects with required fields', () => {
      const projects = getAllProjects()
      projects.forEach(project => {
        expect(project).toHaveProperty('id')
        expect(project).toHaveProperty('slug')
        expect(project).toHaveProperty('title')
        expect(project).toHaveProperty('shortDescription')
        expect(project).toHaveProperty('category')
        expect(project).toHaveProperty('size')
        expect(project).toHaveProperty('featured')
        expect(project).toHaveProperty('thumbnail')
        expect(project).toHaveProperty('heroImage')
        expect(project).toHaveProperty('technologies')
        expect(project).toHaveProperty('completedDate')
        expect(project).toHaveProperty('order')
      })
    })
  })

  describe('getFeaturedProjects', () => {
    it('returns only featured projects', () => {
      const featured = getFeaturedProjects()
      featured.forEach(project => {
        expect(project.featured).toBe(true)
      })
    })

    it('returns projects sorted by order', () => {
      const featured = getFeaturedProjects()
      for (let i = 1; i < featured.length; i++) {
        expect(featured[i].order).toBeGreaterThanOrEqual(featured[i - 1].order)
      }
    })
  })

  describe('getProjectBySlug', () => {
    it('finds project by slug', () => {
      const allProjects = getAllProjects()
      const testSlug = allProjects[0].slug
      const project = getProjectBySlug(testSlug)

      expect(project).toBeDefined()
      expect(project.slug).toBe(testSlug)
    })

    it('returns undefined for non-existent slug', () => {
      const project = getProjectBySlug('non-existent-slug')
      expect(project).toBeUndefined()
    })
  })

  describe('getProjectById', () => {
    it('finds project by id', () => {
      const allProjects = getAllProjects()
      const testId = allProjects[0].id
      const project = getProjectById(testId)

      expect(project).toBeDefined()
      expect(project.id).toBe(testId)
    })

    it('returns undefined for non-existent id', () => {
      const project = getProjectById('non-existent-id')
      expect(project).toBeUndefined()
    })
  })

  describe('getProjectsByCategory', () => {
    it('filters projects by category', () => {
      const categories = getAvailableCategories()
      if (categories.length > 0) {
        const testCategory = categories[0]
        const projects = getProjectsByCategory(testCategory)

        expect(projects.length).toBeGreaterThan(0)
        projects.forEach(project => {
          expect(project.category).toBe(testCategory)
        })
      }
    })

    it('returns empty array for unused category', () => {
      // Find a category that might not be used
      const allProjects = getAllProjects()
      const usedCategories = new Set(allProjects.map(p => p.category))

      // Test with portfolio category if not used
      if (!usedCategories.has('portfolio')) {
        const projects = getProjectsByCategory('portfolio')
        expect(projects).toEqual([])
      }
    })
  })

  describe('getProjectsBySize', () => {
    it('filters projects by major size', () => {
      const majorProjects = getProjectsBySize('major')
      majorProjects.forEach(project => {
        expect(project.size).toBe('major')
      })
    })

    it('filters projects by simple size', () => {
      const simpleProjects = getProjectsBySize('simple')
      simpleProjects.forEach(project => {
        expect(project.size).toBe('simple')
      })
    })
  })

  describe('getAvailableCategories', () => {
    it('returns unique categories from projects', () => {
      const categories = getAvailableCategories()
      const uniqueCategories = new Set(categories)

      expect(categories.length).toBe(uniqueCategories.size)
    })

    it('returns valid category types', () => {
      const validCategories = ['landing-page', 'e-commerce', 'corporate', 'portfolio', 'custom']
      const categories = getAvailableCategories()

      categories.forEach(category => {
        expect(validCategories).toContain(category)
      })
    })
  })

  describe('toLegacyProject', () => {
    it('converts project to legacy format', () => {
      const project = getAllProjects()[0]
      const legacy = toLegacyProject(project)

      expect(legacy).toHaveProperty('imagesrc')
      expect(legacy).toHaveProperty('imageAlt')
      expect(legacy).toHaveProperty('link')
      expect(legacy.imagesrc).toBe(project.thumbnail.src)
      expect(legacy.imageAlt).toBe(project.thumbnail.alt)
    })

    it('uses liveUrl or defaults to #', () => {
      const project = getAllProjects()[0]
      const legacy = toLegacyProject(project)

      if (project.liveUrl) {
        expect(legacy.link).toBe(project.liveUrl)
      } else {
        expect(legacy.link).toBe('#')
      }
    })
  })

  describe('getFeaturedProjectsLegacy', () => {
    it('returns featured projects in legacy format', () => {
      const legacy = getFeaturedProjectsLegacy()

      legacy.forEach(project => {
        expect(project).toHaveProperty('imagesrc')
        expect(project).toHaveProperty('imageAlt')
        expect(project).toHaveProperty('link')
      })
    })
  })

  describe('getCategoryLabel', () => {
    it('returns Spanish label for each category', () => {
      expect(getCategoryLabel('landing-page')).toBe('Landing Page')
      expect(getCategoryLabel('e-commerce')).toBe('E-commerce')
      expect(getCategoryLabel('corporate')).toBe('Corporativo')
      expect(getCategoryLabel('portfolio')).toBe('Portafolio')
      expect(getCategoryLabel('custom')).toBe('Personalizado')
    })
  })

  describe('categoryLabels', () => {
    it('has labels for all category types', () => {
      const expectedCategories = ['landing-page', 'e-commerce', 'corporate', 'portfolio', 'custom']

      expectedCategories.forEach(category => {
        expect(categoryLabels[category]).toBeDefined()
        expect(typeof categoryLabels[category]).toBe('string')
      })
    })
  })
})
