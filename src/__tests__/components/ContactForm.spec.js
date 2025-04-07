import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactForm from '../../components/ContactForm.vue'

describe('ContactForm', () => {
  it('mounts properly', () => {
    const wrapper = mount(ContactForm)
    expect(wrapper.exists()).toBe(true)
  })

  it('has required form fields', () => {
    const wrapper = mount(ContactForm)
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.findAll('input').length).toBe(4)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('renders all input fields with correct attributes', () => {
    const wrapper = mount(ContactForm)
    const inputs = wrapper.findAll('input')

    const expectedFields = [
      { type: 'text', placeholder: 'Nombre' },
      { type: 'text', placeholder: 'Apellido' },
      { type: 'email', placeholder: 'Correo' },
      { type: 'tel', placeholder: 'Teléfono' }
    ]

    expectedFields.forEach((field, index) => {
      expect(inputs[index].attributes('type')).toBe(field.type)
      expect(inputs[index].attributes('placeholder')).toBe(field.placeholder)
    })
  })

  it('has a textarea for messages', () => {
    const wrapper = mount(ContactForm)
    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect(textarea.attributes('placeholder')).toBe('Mensaje')
  })

  it('has a submit button with correct text', () => {
    const wrapper = mount(ContactForm)
    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Enviar')
  })

  describe('Form Validations', () => {
    const setupTest = () => {
      const wrapper = mount(ContactForm)
      return {
        wrapper,
        nameInput: wrapper.find('input[placeholder="Nombre"]'),
        lastNameInput: wrapper.find('input[placeholder="Apellido"]'),
        emailInput: wrapper.find('input[placeholder="Correo"]'),
        phoneInput: wrapper.find('input[placeholder="Teléfono"]')
      }
    }

    describe('Name and Last Name Validation', () => {
      it('validates required field', async () => {
        const { wrapper, nameInput } = setupTest()
        await nameInput.setValue('')
        await nameInput.trigger('input')
        expect(wrapper.vm.errors.name).toBe('Este campo es obligatorio')
      })

      it('validates format with invalid characters', async () => {
        const { wrapper, nameInput } = setupTest()
        await nameInput.setValue('John123')
        await nameInput.trigger('input')
        expect(wrapper.vm.errors.name).toBe('Solo se permiten letras y espacios')
      })

      it('accepts valid input', async () => {
        const { wrapper, nameInput } = setupTest()
        await nameInput.setValue('John Doe')
        await nameInput.trigger('input')
        expect(wrapper.vm.errors.name).toBe('')
      })
    })

    describe('Email Validation', () => {
      it('validates required field', async () => {
        const { wrapper, emailInput } = setupTest()
        await emailInput.setValue('')
        await emailInput.trigger('input')
        expect(wrapper.vm.errors.email).toBe('Este campo es obligatorio')
      })

      it('validates email format', async () => {
        const { wrapper, emailInput } = setupTest()
        await emailInput.setValue('invalid-email')
        await emailInput.trigger('input')
        expect(wrapper.vm.errors.email).toBe('Correo inválido')
      })

      it('accepts valid email', async () => {
        const { wrapper, emailInput } = setupTest()
        await emailInput.setValue('test@example.com')
        await emailInput.trigger('input')
        expect(wrapper.vm.errors.email).toBe('')
      })
    })

    describe('Phone Validation', () => {
      it('validates required field', async () => {
        const { wrapper, phoneInput } = setupTest()
        await phoneInput.setValue('')
        await phoneInput.trigger('input')
        expect(wrapper.vm.errors.phone).toBe('Este campo es obligatorio')
      })

      it('validates invalid characters', async () => {
        const { wrapper, phoneInput } = setupTest()
        await phoneInput.setValue('123@456')
        await phoneInput.trigger('input')
        expect(wrapper.vm.errors.phone).toBe('Solo se permiten números, espacios, +, paréntesis y guiones')
      })

      it('accepts various valid formats', async () => {
        const { wrapper, phoneInput } = setupTest()
        const validFormats = [
          '+55 (11) 8765-4321',
          '(+504) 9999-9999',
          '+1 234-567-8900',
          '(123) 456-7890',
          '1234567890',
          '+1234567890',
          '123-456-7890'
        ]

        for (const format of validFormats) {
          await phoneInput.setValue(format)
          await phoneInput.trigger('input')
          expect(wrapper.vm.errors.phone).toBe('')
        }
      })
    })
  })
}) 