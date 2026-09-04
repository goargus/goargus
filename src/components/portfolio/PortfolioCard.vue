<template>
  <article
    class="portfolio-card"
    :class="{ 'portfolio-card--featured': featured }"
    @click="$emit('select', project)"
    role="button"
    tabindex="0"
    @keydown.enter="$emit('select', project)"
    @keydown.space.prevent="$emit('select', project)"
  >
    <div class="card-image-container">
      <img
        :src="project.thumbnail.src"
        :alt="project.thumbnail.alt"
        class="card-image"
        loading="lazy"
      />
      <div class="card-overlay">
        <span class="card-view-text">Ver proyecto</span>
      </div>
    </div>

    <div class="card-content">
      <span class="card-category">{{ categoryLabel }}</span>
      <h3 class="card-title">{{ project.title }}</h3>
      <p class="card-description">{{ project.shortDescription }}</p>

      <div class="card-technologies">
        <span
          v-for="tech in displayedTechnologies"
          :key="tech"
          class="tech-badge"
        >
          {{ tech }}
        </span>
        <span v-if="remainingTechCount > 0" class="tech-badge tech-badge--more">
          +{{ remainingTechCount }}
        </span>
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Project } from '../../types/project'
import { getCategoryLabel } from '../../data/projects'

const props = defineProps<{
  project: Project
  featured?: boolean
}>()

defineEmits<{
  select: [project: Project]
}>()

const categoryLabel = computed(() => getCategoryLabel(props.project.category))

const maxTechnologies = 3
const displayedTechnologies = computed(() =>
  props.project.technologies.slice(0, maxTechnologies)
)
const remainingTechCount = computed(() =>
  Math.max(0, props.project.technologies.length - maxTechnologies)
)
</script>

<style scoped>
@reference "../../style.css";
.portfolio-card {
  @apply rounded-2xl shadow-3xl overflow-hidden cursor-pointer;
  @apply transition-all duration-300 ease-out;
  @apply hover:scale-[1.02] hover:shadow-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-lightGreen focus:ring-offset-2;
  @apply bg-white;
}

.card-image-container {
  @apply relative overflow-hidden;
  aspect-ratio: 16 / 9;
}

.card-image {
  @apply w-full h-full object-cover transition-transform duration-500;
}

.portfolio-card:hover .card-image {
  @apply scale-110;
}

.card-overlay {
  @apply absolute inset-0 bg-black/0 transition-all duration-300;
  @apply flex items-center justify-center;
}

.portfolio-card:hover .card-overlay {
  @apply bg-black/40;
}

.card-view-text {
  @apply text-white text-lg font-medium opacity-0 transform translate-y-4;
  @apply transition-all duration-300;
}

.portfolio-card:hover .card-view-text {
  @apply opacity-100 translate-y-0;
}

.card-content {
  @apply p-5;
}

.card-category {
  @apply inline-block text-xs uppercase tracking-wider text-lightGreen font-medium mb-2;
}

.card-title {
  @apply text-xl font-bold text-txtcolor mb-2 lowercase;
}

.card-description {
  @apply text-sm text-gray mb-4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-technologies {
  @apply flex flex-wrap gap-2;
}

.tech-badge {
  @apply text-xs px-3 py-1 rounded-full bg-snowGray text-gray;
}

.tech-badge--more {
  @apply bg-lightGreen/10 text-lightGreen;
}
</style>
