<template>
  <!-- Desktop Navigation -->
  <nav class="nav-container nav-font nav-shadow hidden lg:inline-flex">
    <RouterLink v-for="(item, index) in navItems" :key="index" :to="item.href"
      :class="index === 0 ? 'home-link menu-item' : 'menu-item'">
      {{ item.title }}
    </RouterLink>
  </nav>

  <!-- Mobile Navigation -->
  <div class="lg:hidden flex items-center">
    <!-- Hamburger Button -->
    <button
      @click="toggleMobileMenu"
      class="mobile-menu-button"
      :aria-expanded="isMobileMenuOpen"
      aria-label="Toggle navigation menu"
    >
      <span class="hamburger-line" :class="{ 'rotate-45 translate-y-2': isMobileMenuOpen }"></span>
      <span class="hamburger-line" :class="{ 'opacity-0': isMobileMenuOpen }"></span>
      <span class="hamburger-line" :class="{ '-rotate-45 -translate-y-2': isMobileMenuOpen }"></span>
    </button>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="mobile-overlay"
        @click="closeMobileMenu"
      ></div>
    </Transition>

    <!-- Mobile Menu Panel -->
    <Transition name="slide">
      <nav
        v-if="isMobileMenuOpen"
        class="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div class="mobile-menu-header">
          <button
            @click="closeMobileMenu"
            class="close-button"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mobile-menu-content">
          <RouterLink
            v-for="(item, index) in navItems"
            :key="index"
            :to="item.href"
            class="mobile-menu-item"
            :style="{ animationDelay: `${index * 100}ms` }"
            @click="closeMobileMenu"
          >
            {{ item.title }}
          </RouterLink>
        </div>
      </nav>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { NavItem } from '../types/navItem'
import { useRoute } from 'vue-router'

defineProps<{
  navItems: NavItem[];
}>();

const isMobileMenuOpen = ref(false)
const route = useRoute()

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu()
  }
}

watch(() => route.path, () => {
  closeMobileMenu()
})

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
@reference "../style.css";
.nav-container {
  @apply items-center gap-8 xl:gap-[79px] py-4 xl:py-6 px-8 xl:pr-[65px] xl:pl-[74px] rounded-[62px] shadow-3xl;
}

.nav-font {
  @apply text-xl xl:text-3xl text-gray font-normal;
}

.home-link {
  @apply text-gray font-inter text-xl xl:text-[30px] leading-normal;
}

.menu-item {
  @apply self-stretch my-auto relative transition-colors duration-300;
}

.menu-item::after {
  content: '';
  @apply absolute left-0 -bottom-1 h-[2px] bg-lightGreen scale-x-0 transition-transform duration-300 ease-in-out;
  width: 100%;
}

.menu-item:hover::after {
  @apply scale-x-100;
}

/* Mobile Menu Button */
.mobile-menu-button {
  @apply flex flex-col justify-center items-center w-12 h-12 rounded-xl shadow-3xl bg-snowGray p-2 z-50 relative;
}

.hamburger-line {
  @apply w-6 h-0.5 bg-gray rounded-full transition-all duration-300 ease-in-out;
  margin: 3px 0;
}

/* Mobile Overlay */
.mobile-overlay {
  @apply fixed inset-0 bg-black/50 z-40 backdrop-blur-sm;
}

/* Mobile Menu Panel */
.mobile-menu {
  @apply fixed top-0 right-0 h-full w-full max-w-sm bg-snowGray z-50 shadow-xl;
}

.mobile-menu-header {
  @apply flex justify-end p-6;
}

.close-button {
  @apply text-gray hover:text-lightGreen transition-colors duration-300 p-2 rounded-full shadow-3xl;
}

.mobile-menu-content {
  @apply flex flex-col items-center justify-center gap-8 pt-10;
}

.mobile-menu-item {
  @apply text-2xl text-gray font-inter relative transition-all duration-300 opacity-0;
  animation: fadeInUp 0.5s ease-out forwards;
}

.mobile-menu-item:hover {
  @apply text-lightGreen;
}

.mobile-menu-item::after {
  content: '';
  @apply absolute left-0 -bottom-1 h-[2px] bg-lightGreen scale-x-0 transition-transform duration-300 ease-in-out w-full;
}

.mobile-menu-item:hover::after {
  @apply scale-x-100;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
