<template>
  <div
    class="relative mt-4 overflow-hidden h-[400px] sm:h-[500px] md:h-[600px] lg:h-[680px]"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div
      class="flex carousel-transition"
      :style="`transform: translateX(-${currentIndex * 100}%)`"
    >
      <div
        v-for="(project, index) in projects"
        :key="index"
        class="flex-none w-full flex flex-col justify-center items-center relative px-4"
      >
        <div class="bg-square"></div>
        <img
          :src="project.imagesrc"
          :alt="project.imageAlt"
          class="image-size"
        />
        <a
          :href="project.link"
          class="button-website"
          target="_blank"
        >
          Ver Website
        </a>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button
      @click="prevSlide"
      class="arrow-button arrow-left"
      aria-label="Previous slide"
    >
      <img src="../assets/arrow.svg" alt="Arrow left" class="w-6 h-6 md:w-8 md:h-8" />
    </button>
    <button
      @click="nextSlide"
      class="arrow-button arrow-right"
      aria-label="Next slide"
    >
      <img src="../assets/arrow2.svg" alt="Arrow right" class="w-6 h-6 md:w-8 md:h-8" />
    </button>

    <!-- Dot Indicators -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(_, index) in projects"
        :key="index"
        @click="goToSlide(index)"
        class="dot-indicator"
        :class="{ 'dot-active': currentIndex === index }"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Project } from '../types/project'

const props = defineProps<{
  projects: Project[]
}>()

const currentIndex = ref(0)
const touchStartX = ref(0)
const touchEndX = ref(0)
const minSwipeDistance = 50

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.projects.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + props.projects.length) % props.projects.length
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
.carousel-transition {
  @apply transition-transform duration-300 ease-out;
}

.bg-square {
  @apply absolute rounded-[20px] md:rounded-[30px] shadow-3xl border-2 border-white z-0;
  width: 80%;
  height: 85%;
  top: 5%;
}

@media (min-width: 768px) {
  .bg-square {
    width: 60%;
    height: 100%;
  }
}

.image-size {
  @apply relative z-10 object-contain max-w-[90%] md:max-w-full rounded-[20px] md:rounded-[30px];
  max-height: 70%;
}

.button-website {
  @apply mt-4 z-20 inline-block px-10 md:px-20 py-2 md:py-2.5;
  @apply shadow-3xl rounded-3xl border-solid border-2 border-white;
  @apply text-sm md:text-base transition-all duration-300;
  @apply hover:bg-lightGreen hover:text-white hover:border-lightGreen;
}

.arrow-button {
  @apply absolute top-1/2 -translate-y-1/2 rounded-full p-2 md:p-3;
  @apply bg-white/80 shadow-lg backdrop-blur-sm;
  @apply transition-all duration-300;
  @apply hover:bg-white hover:scale-110;
}

.arrow-left {
  @apply left-2 sm:left-4 md:left-8 lg:left-20;
}

.arrow-right {
  @apply right-2 sm:right-4 md:right-8 lg:right-20;
}

.dot-indicator {
  @apply w-2 h-2 md:w-3 md:h-3 rounded-full bg-gray/30;
  @apply transition-all duration-300;
}

.dot-active {
  @apply bg-lightGreen w-4 md:w-6;
}
</style>
