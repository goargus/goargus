<template>
  <blockquote class="testimonial" v-if="testimonial">
    <div class="testimonial-quote-icon">
      <svg class="w-8 h-8 text-lightGreen/30" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
    </div>
    <p class="testimonial-text">{{ testimonial.quote }}</p>
    <footer class="testimonial-footer">
      <cite class="testimonial-author">{{ testimonial.author }}</cite>
      <span v-if="testimonial.role" class="testimonial-role">
        {{ testimonial.role }}<span v-if="testimonial.company">, {{ testimonial.company }}</span>
      </span>
    </footer>
  </blockquote>
</template>

<script lang="ts" setup>
import type { ProjectTestimonial } from '../../types/project'

defineProps<{
  testimonial: ProjectTestimonial | undefined
}>()
</script>

<style scoped>
@reference "../../style.css";
.testimonial {
  @apply relative bg-snowGray rounded-2xl p-6 md:p-8;
}

.testimonial-quote-icon {
  @apply absolute top-4 left-4 md:top-6 md:left-6;
}

.testimonial-text {
  @apply text-txtcolor text-lg md:text-xl italic leading-relaxed;
  @apply pt-8 md:pt-6;
}

.testimonial-footer {
  @apply mt-4 flex flex-col;
}

.testimonial-author {
  @apply text-txtcolor font-semibold not-italic;
}

.testimonial-role {
  @apply text-gray text-sm;
}
</style>
