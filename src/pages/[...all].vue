<template>
  <div class="w-full">
    <HeaderBanner title="Página no encontrada" />
  </div>

  <div class="p-20 text-center">
    <h1 class="mb-5">404</h1>
    <p class="p-5 max-w-[1000px] mx-auto">
      La página que buscas no existe o fue movida. Revisa la dirección o vuelve al inicio.
    </p>

    <div class="flex flex-wrap gap-5 justify-center items-center mt-5">
      <router-link to="/" class="underline">Ir al inicio</router-link>
      <router-link to="/contact" class="underline">Contáctanos</router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted } from "vue";
import HeaderBanner from "../components/HeaderBanner.vue";

let robots: HTMLMetaElement | null = null;

onMounted(() => {
  robots = document.createElement("meta");
  robots.name = "robots";
  robots.content = "noindex";
  document.head.appendChild(robots);
});

onBeforeUnmount(() => {
  robots?.remove();
  robots = null;
});
</script>
