import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useScrollAnimation(
  options: ScrollAnimationOptions = {}
): {
  elementRef: Ref<HTMLElement | null>
  isVisible: Ref<boolean>
} {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options

  const elementRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!elementRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            if (triggerOnce && observer && elementRef.value) {
              observer.unobserve(elementRef.value)
            }
          } else if (!triggerOnce) {
            isVisible.value = false
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(elementRef.value)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return { elementRef, isVisible }
}

export function useMultipleScrollAnimations(
  count: number,
  options: ScrollAnimationOptions = {}
): {
  refs: Ref<(HTMLElement | null)[]>
  visibleStates: Ref<boolean[]>
} {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options

  const refs = ref<(HTMLElement | null)[]>(Array(count).fill(null))
  const visibleStates = ref<boolean[]>(Array(count).fill(false))
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = refs.value.findIndex((el) => el === entry.target)
          if (index !== -1) {
            if (entry.isIntersecting) {
              visibleStates.value[index] = true
              if (triggerOnce && observer) {
                observer.unobserve(entry.target)
              }
            } else if (!triggerOnce) {
              visibleStates.value[index] = false
            }
          }
        })
      },
      { threshold, rootMargin }
    )

    refs.value.forEach((el) => {
      if (el && observer) {
        observer.observe(el)
      }
    })
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return { refs, visibleStates }
}
