<template>
  <div class="flex items-center justify-center min-h-screen px-4">
    <form @submit.prevent="sendEmail" class="w-full max-w-[725px] space-y-8 md:space-y-12 p-6 sm:p-12 md:p-24">
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
          required
        />
      </div>

      <div class="relative">
        <textarea
          v-model="form.message"
          name="message"
          placeholder="Mensaje"
          class="txtboxmsg"
          minlength="5"
          title="El mensaje debe tener al menos 5 caracteres"
          required
        ></textarea>
      </div>

      <div class="flex justify-center">
        <button
          type="submit"
          class="buttonsend"
          :disabled="isSubmitting"
        >
          <span v-if="!isSubmitting">Enviar</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </span>
        </button>
      </div>

      <Transition name="message">
        <p
          v-if="message"
          class="message-feedback"
          :class="{ 'message-success': isSuccess, 'message-error': !isSuccess }"
        >
          {{ message }}
        </p>
      </Transition>
    </form>
  </div>
</template>

<script>
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
      message: "",
      isSuccess: false,
      isSubmitting: false
    };
  },
  methods: {
    async sendEmail() {
      this.isSubmitting = true;
      this.message = "";

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: this.form.name,
            lastName: this.form.lastName,
            email: this.form.email,
            phone: this.form.phone,
            message: this.form.message
          })
        });

        if (!response.ok) {
          throw new Error(`El servidor respondió ${response.status}`);
        }

        this.message = "¡Mensaje enviado con éxito!";
        this.isSuccess = true;
        this.form = { name: "", lastName: "", email: "", phone: "", message: "" };
      } catch (error) {
        this.message = "Error al enviar el mensaje. Por favor, inténtalo de nuevo.";
        this.isSuccess = false;
        console.error("Contact form error:", error);
      } finally {
        this.isSubmitting = false;

        setTimeout(() => {
          this.message = "";
        }, 5000);
      }
    }
  }
};
</script>

<style scoped>
@reference "../style.css";
.h1contact {
  @apply text-2xl md:text-3xl font-semibold text-center text-txtcolor mb-8 md:mb-16;
}

.txtbox {
  @apply w-full px-4 py-3 text-gray rounded-full shadow-neumorphic border-0 text-center bg-snowGray;
  @apply text-lg md:text-[22px] leading-7;
  @apply transition-all duration-300 ease-out;
  @apply focus:outline-none focus:ring-2 focus:ring-lightGreen focus:ring-offset-2 focus:ring-offset-snowGray;
  @apply hover:shadow-lg;
}

.txtbox:focus {
  box-shadow: -10px -10px 15px 0px #FFF inset, 10px 10px 15px 0px rgba(174, 174, 192, 0.50) inset, 0 0 0 3px rgba(3, 244, 175, 0.2);
}

.txtboxmsg {
  @apply w-full h-[180px] md:h-[246px] px-4 py-6 md:py-8 text-gray rounded-3xl shadow-neumorphic border-0 bg-snowGray;
  @apply text-lg md:text-[22px] leading-7 text-center;
  @apply transition-all duration-300 ease-out resize-none;
  @apply focus:outline-none focus:ring-2 focus:ring-lightGreen focus:ring-offset-2 focus:ring-offset-snowGray;
  @apply hover:shadow-lg;
}

.txtboxmsg:focus {
  box-shadow: -10px -10px 15px 0px #FFF inset, 10px 10px 15px 0px rgba(174, 174, 192, 0.50) inset, 0 0 0 3px rgba(3, 244, 175, 0.2);
}

.buttonsend {
  @apply w-full sm:w-3/5 py-3 mt-2 text-gray rounded-full shadow-3xl border-white border-2;
  @apply transition-all duration-300 ease-out;
  @apply hover:bg-lightGreen hover:text-white hover:border-lightGreen hover:shadow-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-lightGreen focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray;
}

.message-feedback {
  @apply text-center text-lg mt-4 p-4 rounded-xl;
  @apply transition-all duration-300;
}

.message-success {
  @apply bg-lightGreen/10 text-lightGreen border border-lightGreen/30;
}

.message-error {
  @apply bg-red-50 text-red-600 border border-red-200;
}

/* Message transition */
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
