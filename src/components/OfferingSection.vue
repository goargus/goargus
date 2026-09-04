<template>
  <section
    ref="sectionRef"
    class="flex flex-col w-full text-center max-w-[1167px] text-neutral-600 px-4"
  >
    <h2
      class="section-title opacity-0"
      :class="{ 'animate-fade-in-up': isVisible }"
    >
      {{ title }}
    </h2>
    <article class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-12 md:mt-24 w-full justify-items-center">
      <OfferingCard
        v-for="(offering, index) in offerings"
        :key="index"
        :image-src="offering.imageSrc"
        :image-alt="offering.imageAlt"
        :title="offering.title"
        :description="offering.description"
        :animation-delay="index * 150"
      />
    </article>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import OfferingCard from '../components/OfferingCard.vue'
import webDesignImage from '../assets/websiteIcon.svg'
import phoneImage from '../assets/phoneIcon.svg'
import checkIcon from '../assets/checkIcon.svg'

defineProps<{
  title: string
}>()

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

const offerings = [
  {
    imageSrc: webDesignImage,
    imageAlt: 'Diseño de Páginas Web',
    title: 'Diseño de Páginas Web',
    description:
      'Creamos páginas web optimizadas para convertir visitantes en clientes potenciales, utilizando un diseño atractivo y una clara llamada a la acción.',
  },
  {
    imageSrc: phoneImage,
    imageAlt: 'Diseño Responsivo',
    title: 'Diseño Responsivo',
    description:
      'Nuestros diseños son responsivos, asegurando que cada página web se vea genial y funcione perfectamente en todos los dispositivos, desde ordenadores hasta móviles.',
  },
  {
    imageSrc: checkIcon,
    imageAlt: 'Soporte y Mantenimiento',
    title: 'Soporte y Mantenimiento',
    description:
      'Ofrecemos soporte y mantenimiento continuo para que nuestros clientes no tengan que preocuparse por la parte técnica de sus sitios web.',
  },
]

onMounted(() => {
  if (!sectionRef.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  observer.observe(sectionRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
@reference "../style.css";
.section-title {
  @apply text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-none lowercase;
}
</style>
