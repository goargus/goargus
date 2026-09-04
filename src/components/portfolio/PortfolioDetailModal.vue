<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="project"
        class="modal-backdrop"
        @click.self="$emit('close')"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'modal-title-' + project.id"
      >
        <div class="modal-container" ref="modalContainer">
          <!-- Close Button -->
          <button
            class="modal-close"
            @click="$emit('close')"
            aria-label="Cerrar modal"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Modal Content -->
          <div class="modal-content">
            <!-- Hero Image -->
            <div class="modal-hero">
              <img
                :src="project.heroImage.src"
                :alt="project.heroImage.alt"
                class="modal-hero-image"
              />
            </div>

            <!-- Project Info -->
            <div class="modal-body">
              <div class="modal-header">
                <span class="modal-category">{{ categoryLabel }}</span>
                <h2
                  :id="'modal-title-' + project.id"
                  class="modal-title"
                >
                  {{ project.title }}
                </h2>
                <p v-if="project.clientName" class="modal-client">
                  Cliente: {{ project.clientName }}
                </p>
              </div>

              <!-- Description -->
              <div class="modal-description">
                <p>{{ project.fullDescription || project.shortDescription }}</p>
              </div>

              <!-- Technologies -->
              <div class="modal-section">
                <h3 class="modal-section-title">Tecnologias</h3>
                <div class="modal-technologies">
                  <span
                    v-for="tech in project.technologies"
                    :key="tech"
                    class="tech-badge"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>

              <!-- Gallery -->
              <div v-if="project.gallery && project.gallery.length > 0" class="modal-section">
                <h3 class="modal-section-title">Galeria</h3>
                <ProjectGallery :images="project.gallery" />
              </div>

              <!-- Testimonial -->
              <div v-if="project.testimonial" class="modal-section">
                <h3 class="modal-section-title">Testimonio</h3>
                <ProjectTestimonial :testimonial="project.testimonial" />
              </div>

              <!-- CTA -->
              <div class="modal-cta">
                <a
                  v-if="project.liveUrl && project.liveUrl !== '#'"
                  :href="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="cta-button cta-button--primary"
                >
                  Ver sitio web
                </a>
                <router-link
                  to="/contact"
                  class="cta-button cta-button--secondary"
                  @click="$emit('close')"
                >
                  Solicitar proyecto similar
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, watch, ref, onMounted, onUnmounted } from 'vue'
import type { Project } from '../../types/project'
import { getCategoryLabel } from '../../data/projects'
import ProjectGallery from './ProjectGallery.vue'
import ProjectTestimonial from './ProjectTestimonial.vue'

const props = defineProps<{
  project: Project | null
}>()

const emit = defineEmits<{
  close: []
}>()

const modalContainer = ref<HTMLElement | null>(null)

const categoryLabel = computed(() =>
  props.project ? getCategoryLabel(props.project.category) : ''
)

// Handle Escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.project) {
    emit('close')
  }
}

// Lock body scroll when modal is open
watch(() => props.project, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
@reference "../../style.css";
.modal-backdrop {
  @apply fixed inset-0 z-50 bg-black/60 backdrop-blur-sm;
  @apply flex items-start justify-center;
  @apply overflow-y-auto py-8 px-4;
}

.modal-container {
  @apply relative bg-white rounded-2xl shadow-2xl;
  @apply w-full max-w-3xl;
  @apply my-auto;
}

.modal-close {
  @apply absolute top-4 right-4 z-10;
  @apply w-10 h-10 rounded-full bg-white/90 shadow-lg;
  @apply flex items-center justify-center;
  @apply transition-all duration-300;
  @apply hover:bg-white hover:scale-110;
  @apply focus:outline-none focus:ring-2 focus:ring-lightGreen;
}

.modal-content {
  @apply overflow-hidden rounded-2xl;
}

.modal-hero {
  @apply w-full bg-snowGray;
  aspect-ratio: 16 / 9;
}

.modal-hero-image {
  @apply w-full h-full object-cover;
}

.modal-body {
  @apply p-6;
}

@media (min-width: 768px) {
  .modal-body {
    padding: 2rem;
  }
}

.modal-header {
  @apply mb-6;
}

.modal-category {
  @apply inline-block text-xs uppercase tracking-wider text-lightGreen font-medium mb-2;
}

.modal-title {
  @apply text-3xl font-bold text-txtcolor lowercase;
}

@media (min-width: 768px) {
  .modal-title {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
}

.modal-client {
  @apply text-gray mt-2;
}

.modal-description {
  @apply text-txtcolor leading-relaxed mb-6;
}

.modal-section {
  @apply mb-6;
}

.modal-section-title {
  @apply text-lg font-semibold text-txtcolor mb-3 lowercase;
}

.modal-technologies {
  @apply flex flex-wrap gap-2;
}

.tech-badge {
  @apply text-sm px-4 py-1.5 rounded-full bg-snowGray text-gray;
}

.modal-cta {
  @apply flex flex-col gap-3 pt-4 border-t border-snowGray;
}

@media (min-width: 640px) {
  .modal-cta {
    flex-direction: row;
  }
}

.cta-button {
  @apply px-6 py-3 rounded-full font-medium text-center;
  @apply transition-all duration-300;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.cta-button--primary {
  @apply bg-lightGreen text-white;
  @apply hover:bg-lightGreen/90 hover:shadow-lg;
  @apply focus:ring-lightGreen;
}

.cta-button--secondary {
  @apply bg-snowGray text-txtcolor;
  @apply hover:bg-gray/10;
  @apply focus:ring-gray;
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  @apply transition-all duration-300;
}

.modal-enter-from,
.modal-leave-to {
  @apply opacity-0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  @apply scale-95 opacity-0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  @apply transition-all duration-300;
}
</style>
