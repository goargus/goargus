import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactForm from '../../components/ContactForm.vue'

describe('ContactForm', () => {
  it('Mounts properly', () => {
    const wrapper = mount(ContactForm)
    expect(wrapper.exists()).toBe(true)
  })

  it('Has required form fields', () => {
    const wrapper = mount(ContactForm)
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.findAll('input').length).toBe(4)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('Renders all input fields with correct attributes', () => {
    const wrapper = mount(ContactForm)
    const inputs = wrapper.findAll('input')

    const expectedFields = [
      { type: 'text', placeholder: 'Nombre', pattern: '^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]+$', title: 'El nombre solo puede contener letras y espacios' },
      { type: 'text', placeholder: 'Apellido', pattern: '^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]+$', title: 'El apellido solo puede contener letras y espacios' },
      { type: 'email', placeholder: 'Correo', title: 'Por favor ingresa un correo electrónico válido' },
      { type: 'tel', placeholder: 'Teléfono', pattern: '^[\\d\\s+()\\-]+$', title: 'El teléfono solo puede contener números, espacios, +, paréntesis y guiones' }
    ]

    expectedFields.forEach((field, index) => {
      expect(inputs[index].attributes('type')).toBe(field.type)
      expect(inputs[index].attributes('placeholder')).toBe(field.placeholder)
      if (field.pattern) {
        expect(inputs[index].attributes('pattern')).toBe(field.pattern)
      }
      expect(inputs[index].attributes('title')).toBe(field.title)
      expect(inputs[index].attributes('required')).toBeDefined()
    })
  })

  it('Has a textarea for messages with correct attributes', () => {
    const wrapper = mount(ContactForm)
    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect(textarea.attributes('placeholder')).toBe('Mensaje')
    expect(textarea.attributes('minlength')).toBe('5')
    expect(textarea.attributes('title')).toBe('El mensaje debe tener al menos 5 caracteres')
    expect(textarea.attributes('required')).toBeDefined()
  })

  it('Has a submit button with correct text', () => {
    const wrapper = mount(ContactForm)
    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Enviar')
  })

  it('Form submission works correctly', async () => {
    const wrapper = mount(ContactForm)
    const form = wrapper.find('form')
    
    await wrapper.setData({
      form: {
        name: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        phone: '+1 (234) 567-8900',
        message: 'This is a test message with more than 10 characters'
      }
    })

    await form.trigger('submit.prevent')
    
    expect(wrapper.vm.message).toBeDefined()
  })
}) 