import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ContactForm from '../../components/ContactForm.vue'

const SUCCESS_MESSAGE = '¡Mensaje enviado con éxito!'
const ERROR_MESSAGE = 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.'

const filledForm = {
  name: 'John',
  lastName: 'Doe',
  email: 'test@example.com',
  phone: '+1 (234) 567-8900',
  message: 'This is a test message with more than 10 characters',
}

function jsonResponse(body, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body }
}

async function submitFilledForm() {
  const wrapper = mount(ContactForm)
  await wrapper.setData({ form: { ...filledForm } })
  await wrapper.find('form').trigger('submit.prevent')
  await flushPromises()
  return wrapper
}

describe('ContactForm', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

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

  it('Posts the form values to the contact endpoint on submit', async () => {
    fetch.mockResolvedValue(jsonResponse({ ok: true }))

    await submitFilledForm()

    expect(fetch).toHaveBeenCalledTimes(1)

    const [url, options] = fetch.mock.calls[0]
    expect(url).toBe('/api/contact')
    expect(options.method).toBe('POST')
    expect(options.headers['content-type']).toBe('application/json')
    expect(JSON.parse(options.body)).toEqual(filledForm)
  })

  it('Never sends a credential from the browser', async () => {
    fetch.mockResolvedValue(jsonResponse({ ok: true }))

    await submitFilledForm()

    const [, options] = fetch.mock.calls[0]
    expect(options.headers.authorization).toBeUndefined()
    expect(JSON.stringify(options)).not.toMatch(/api[_-]?key|bearer|re_/i)
  })

  it('Shows the success feedback when the request resolves', async () => {
    fetch.mockResolvedValue(jsonResponse({ ok: true }))

    const wrapper = await submitFilledForm()
    const feedback = wrapper.find('.message-feedback')

    expect(feedback.exists()).toBe(true)
    expect(feedback.text()).toBe(SUCCESS_MESSAGE)
    expect(feedback.classes()).toContain('message-success')
    expect(wrapper.vm.isSuccess).toBe(true)
    expect(wrapper.vm.isSubmitting).toBe(false)
    expect(wrapper.vm.form.name).toBe('')
    expect(wrapper.vm.form.message).toBe('')
  })

  it('Shows the error feedback when the endpoint returns a failure status', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetch.mockResolvedValue(jsonResponse({ error: 'not_configured' }, 500))

    const wrapper = await submitFilledForm()
    const feedback = wrapper.find('.message-feedback')

    expect(feedback.exists()).toBe(true)
    expect(feedback.text()).toBe(ERROR_MESSAGE)
    expect(feedback.classes()).toContain('message-error')
    expect(wrapper.vm.isSuccess).toBe(false)
    expect(wrapper.vm.isSubmitting).toBe(false)
    expect(wrapper.vm.form.message).toBe(filledForm.message)
    expect(consoleError).toHaveBeenCalledTimes(1)

    consoleError.mockRestore()
  })

  it('Shows the error feedback when the request itself rejects', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    fetch.mockRejectedValue(new TypeError('Failed to fetch'))

    const wrapper = await submitFilledForm()
    const feedback = wrapper.find('.message-feedback')

    expect(feedback.text()).toBe(ERROR_MESSAGE)
    expect(feedback.classes()).toContain('message-error')
    expect(wrapper.vm.isSuccess).toBe(false)
    expect(wrapper.vm.form.message).toBe(filledForm.message)
    expect(consoleError).toHaveBeenCalledTimes(1)

    consoleError.mockRestore()
  })
})
