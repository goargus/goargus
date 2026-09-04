import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Contact from '../../pages/Contact.vue'

const stubs = { HeaderBanner: true, ContactForm: true }

const render = () => mount(Contact, { global: { stubs } })

describe('the contact page', () => {
  it('publishes an email address the visitor can click', () => {
    const link = render().get('a[href="mailto:hola@goargus.dev"]')
    expect(link.text()).toBe('hola@goargus.dev')
  })

  it('publishes a phone number the visitor can dial', () => {
    const link = render().get('a[href="tel:+50496243992"]')
    expect(link.text()).toBe('+504 9624-3992')
  })

  it('offers both alternatives even though the form is present', () => {
    const wrapper = render()
    expect(wrapper.html()).toContain('contact-form-stub')
    expect(wrapper.findAll('a[href^="mailto:"], a[href^="tel:"]')).toHaveLength(2)
  })

  it('keeps the dialable href free of spaces and punctuation', () => {
    const href = render().get('a[href^="tel:"]').attributes('href')
    expect(href).toMatch(/^tel:\+\d+$/)
  })
})
