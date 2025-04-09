<template>
  <div class="flex items-center justify-center min-h-screen">
    <form @submit.prevent="sendEmail" class="w-full max-w-[725px] space-y-12 p-24">
      <h1 class="h1contact">Escríbenos</h1>

      <div v-for="field in fields" :key="field.name" class="relative">
        <input
          v-model="form[field.name]"
          :name="field.name"
          :type="field.type"
          :placeholder="field.placeholder"
          class="txtbox"
          :pattern="field.pattern"
          :title="field.title"
          required />
      </div>

      <div class="relative">
        <textarea
          v-model="form.message"
          name="message"
          placeholder="Mensaje"
          class="txtboxmsg"
          minlength="5"
          title="El mensaje debe tener al menos 5 caracteres"
          required></textarea>
      </div>

      <div class="flex justify-center">
        <button type="submit" class="hover:bg-gray-300 buttonsend">
          Enviar
        </button>
      </div>

      <p v-if="message" class="text-center text-lg mt-4">{{ message }}</p>
    </form>
  </div>
</template>

<script>
import emailjs from "emailjs-com";

export default {
  data() {
    return {
      form: {
        name: "",
        lastName: "",
        email: "",
        phone: "",
        message: ""
      },
      fields: [
        { name: "name", type: "text", placeholder: "Nombre", pattern: "^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]+$", title: "El nombre solo puede contener letras y espacios" },
        { name: "lastName", type: "text", placeholder: "Apellido", pattern: "^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]+$", title: "El apellido solo puede contener letras y espacios" },
        { name: "email", type: "email", placeholder: "Correo", title: "Por favor ingresa un correo electrónico válido" },
        { name: "phone", type: "tel", placeholder: "Teléfono", pattern: "^[\\d\\s+()\\-]+$", title: "El teléfono solo puede contener números, espacios, +, paréntesis y guiones" },
      ],
      message: ""
    };
  },
  methods: {
    async sendEmail() {
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            name: `${this.form.name} ${this.form.lastName}`,
            email: this.form.email,
            phone: this.form.phone,
            message: this.form.message
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        this.message = "¡Mensaje enviado con éxito!";
        this.form = { name: "", lastName: "", email: "", phone: "", message: "" };
      } catch (error) {
        this.message = "Error al enviar el mensaje.";
        console.error("EmailJS Error:", error);
      }
    }
  }
};
</script>

<style>
.h1contact {
  @apply text-3xl font-semibold text-center text-txtcolor mb-16;
}
.txtbox {
  @apply w-full px-4 py-3 text-gray rounded-full shadow-neumorphic border-0 text-center bg-snowGray text-[22px];
}
.txtboxmsg {
  @apply w-full h-[246px] px-4 py-[110px] text-gray rounded-3xl shadow-neumorphic border-0 focus:outline-none text-center bg-snowGray text-[22px];
}
.buttonsend {
  @apply w-3/5 py-3 mt-2 text-gray rounded-full shadow-3xl focus:outline-none border-white border-2;
}
</style>
