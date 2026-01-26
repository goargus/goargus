<template>
  <div class="gallery" v-if="images && images.length > 0">
    <div
      class="gallery-container"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div
        class="gallery-track"
        :style="`transform: translateX(-${currentIndex * 100}%)`"
      >
        <div
          v-for="(image, index) in images"
          :key="index"
          class="gallery-slide"
        >
          <img
            :src="image.src"
            :alt="image.alt"
            class="gallery-image"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button
      v-if="images.length > 1"
      @click="prevSlide"
      class="gallery-arrow gallery-arrow--left"
      aria-label="Imagen anterior"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button
      v-if="images.length > 1"
      @click="nextSlide"
      class="gallery-arrow gallery-arrow--right"
      aria-label="Siguiente imagen"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Caption -->
    <p v-if="currentImage?.caption" class="gallery-caption">
      {{ currentImage.caption }}
    </p>

    <!-- Dot Indicators -->
    <div v-if="images.length > 1" class="gallery-dots">
      <button
        v-for="(_, index) in images"
        :key="index"
        @click="goToSlide(index)"
        class="gallery-dot"
        :class="{ 'gallery-dot--active': currentIndex === index }"
        :aria-label="`Ir a imagen ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { ProjectImage } from '../../types/project'

const props = defineProps<{
  images: ProjectImage[] | undefined
}>()

const currentIndex = ref(0)
const touchStartX = ref(0)
const touchEndX = ref(0)
const minSwipeDistance = 50

const currentImage = computed(() =>
  props.images ? props.images[currentIndex.value] : null
)

const nextSlide = () => {
  if (!props.images) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prevSlide = () => {
  if (!props.images) return
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

const goToSlide = (index: number) => {
  currentIndex.value = index
}

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
}

const handleTouchMove = (e: TouchEvent) => {
  touchEndX.value = e.touches[0].clientX
}

const handleTouchEnd = () => {
  const swipeDistance = touchStartX.value - touchEndX.value

  if (Math.abs(swipeDistance) > minSwipeDistance) {
    if (swipeDistance > 0) {
      nextSlide()
    } else {
      prevSlide()
    }
  }

  touchStartX.value = 0
  touchEndX.value = 0
}
</script>

<style scoped>
.gallery {
  @apply relative;
}

.gallery-container {
  @apply relative overflow-hidden rounded-xl;
}

.gallery-track {
  @apply flex transition-transform duration-300 ease-out;
}

.gallery-slide {
  @apply flex-none w-full;
}

.gallery-image {
  @apply w-full h-auto object-cover rounded-xl;
  max-height: 400px;
}

.gallery-arrow {
  @apply absolute top-1/2 -translate-y-1/2;
  @apply w-10 h-10 rounded-full;
  @apply bg-white/90 shadow-lg backdrop-blur-sm;
  @apply flex items-center justify-center;
  @apply transition-all duration-300;
  @apply hover:bg-white hover:scale-110;
  @apply focus:outline-none focus:ring-2 focus:ring-lightGreen;
}

.gallery-arrow--left {
  @apply left-2;
}

.gallery-arrow--right {
  @apply right-2;
}

.gallery-caption {
  @apply text-center text-gray text-sm mt-3;
}

.gallery-dots {
  @apply flex justify-center gap-2 mt-4;
}

.gallery-dot {
  @apply w-2 h-2 rounded-full bg-gray/30;
  @apply transition-all duration-300;
  @apply focus:outline-none focus:ring-2 focus:ring-lightGreen focus:ring-offset-2;
}

.gallery-dot--active {
  @apply bg-lightGreen w-6;
}
</style>
