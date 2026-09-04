<template>
  <div class="w-full">
    <header-banner title="Contáctanos"></header-banner>
    <p class="font-Inter w-full max-w-5xl mx-auto px-4 sm:px-8 pt-10 md:pt-16 pb-6 md:pb-8 text-center text-base md:text-lg">
      ¡Te invitamos a ponerte en contacto con Go Argus! Estamos aquí para ayudarte a llevar tu presencia digital al
      siguiente nivel. Si tienes un proyecto en mente o simplemente quieres saber más sobre nuestros servicios, no dudes
      en escribirnos. Estaremos encantados de trabajar contigo y encontrar la mejor solución para tus necesidades.
      ¡Hablemos y comencemos a crear algo increíble juntos!
    </p>
    <div class="font-Inter w-full max-w-5xl mx-auto px-4 sm:px-8 pb-10 md:pb-16 text-center text-base md:text-lg">
      <p class="mb-4">También puedes escribirnos o llamarnos directamente:</p>
      <div class="flex flex-wrap gap-5 justify-center items-center">
        <a href="mailto:hola@goargus.dev" class="underline">hola@goargus.dev</a>
        <a href="tel:+50496243992" class="underline">+504 9624-3992</a>
      </div>
    </div>
  </div>
  <div>
    <ContactForm />
  </div>
</template>

<script lang="ts" setup>
import HeaderBanner from '../components/HeaderBanner.vue';
import ContactForm from '../components/ContactForm.vue';
</script>
