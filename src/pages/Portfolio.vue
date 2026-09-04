<template>
  <div class="w-full">
    <header-banner
      title="portafolio"
      subtitle="Descubre nuestros proyectos y el trabajo que hemos realizado"
    />

    <!-- Featured Projects Section -->
    <section class="featured-section" v-if="featuredProjects.length > 0">
      <div class="section-container">
        <h2 class="section-title">proyectos destacados</h2>
        <PortfolioGrid
          :projects="featuredProjects"
          :columns="2"
          @select="openProjectModal"
        />
      </div>
    </section>

    <!-- All Projects Section -->
    <section class="projects-section">
      <div class="section-container">
        <!-- Filter Bar -->
        <div class="filter-bar">
          <PortfolioFilter
            :categories="availableCategories"
            :activeCategory="activeCategory"
            @update:activeCategory="activeCategory = $event"
          />
        </div>

        <!-- Projects Grid -->
        <PortfolioGrid
          :projects="filteredProjects"
          :columns="3"
          @select="openProjectModal"
        />

        <!-- Empty State -->
        <div v-if="filteredProjects.length === 0" class="empty-state">
          <p>No hay proyectos en esta categoria.</p>
          <button
            @click="activeCategory = null"
            class="empty-state-button"
          >
            Ver todos los proyectos
          </button>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-container">
        <h2 class="cta-title">tienes un proyecto en mente?</h2>
        <p class="cta-text">
          Estamos listos para convertir tu idea en realidad. Contactanos y hagamos algo increible juntos.
        </p>
        <router-link to="/contact" class="cta-button">
          Contactanos
        </router-link>
      </div>
    </section>

    <!-- Project Detail Modal -->
    <PortfolioDetailModal
      :project="selectedProject"
      @close="closeProjectModal"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import HeaderBanner from '../components/HeaderBanner.vue'
import { PortfolioGrid, PortfolioFilter, PortfolioDetailModal } from '../components/portfolio'
import {
  getAllProjects,
  getFeaturedProjects,
  getAvailableCategories
} from '../data/projects'
import type { Project, ProjectCategory } from '../types/project'

const allProjects = getAllProjects()
const featuredProjects = getFeaturedProjects()
const availableCategories = getAvailableCategories()

const activeCategory = ref<ProjectCategory | null>(null)
const selectedProject = ref<Project | null>(null)

const filteredProjects = computed(() => {
  if (!activeCategory.value) {
    return allProjects
  }
  return allProjects.filter(p => p.category === activeCategory.value)
})

const openProjectModal = (project: Project) => {
  selectedProject.value = project
}

const closeProjectModal = () => {
  selectedProject.value = null
}
</script>

<style scoped>
@reference "../style.css";
.section-container {
  @apply max-w-6xl mx-auto px-4;
}

.section-title {
  @apply text-3xl md:text-4xl font-bold text-txtcolor text-center mb-10 lowercase;
}

/* Featured Section */
.featured-section {
  @apply py-16 md:py-20;
}

/* Projects Section */
.projects-section {
  @apply py-16 md:py-20 bg-snowGray;
}

.filter-bar {
  @apply mb-10;
}

/* Empty State */
.empty-state {
  @apply text-center py-16;
}

.empty-state p {
  @apply text-gray text-lg mb-4;
}

.empty-state-button {
  @apply text-lightGreen font-medium hover:underline;
  @apply focus:outline-none focus:ring-2 focus:ring-lightGreen focus:ring-offset-2 rounded;
}

/* CTA Section */
.cta-section {
  @apply py-20 md:py-28;
}

.cta-container {
  @apply max-w-2xl mx-auto text-center px-4;
}

.cta-title {
  @apply text-4xl md:text-5xl font-bold text-txtcolor mb-6 lowercase;
}

.cta-text {
  @apply text-lg text-gray mb-10 max-w-lg mx-auto;
}

.cta-button {
  @apply inline-block px-10 py-3 bg-lightGreen text-white rounded-full;
  @apply text-lg font-medium transition-all duration-300;
  @apply hover:shadow-lg hover:scale-105 hover:bg-lightGreen/90;
  @apply focus:outline-none focus:ring-2 focus:ring-lightGreen focus:ring-offset-2;
}
</style>
