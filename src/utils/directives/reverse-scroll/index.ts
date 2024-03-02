import { scroll } from './scroll'

const mount = function (el, binding) {
  let scrolled = false
  const heights = new WeakMap()
  const config = binding.value || {}
  scroll(el)

  el.addEventListener('scroll', () => {
    scrolled = el.scrollTop + el.clientHeight + 1 < el.scrollHeight
    if (scrolled && el.scrollTop === 0) {
      el.dispatchEvent(new Event('v-reverse-scroll:top-reached'))
    }
  })

  new MutationObserver(() => {
    if (config.enabled === false) return
    if (el) el.dispatchEvent(new Event('v-reverse-scroll:mutated', el))
    const scrollTop = el.scrollTop === 0 && heights.has(el) && el.scrollHeight - heights.get(el)
    if (scrollTop) scroll(el, scrollTop)

    heights.set(el, el.scrollHeight)
  }).observe(el, { childList: true, subtree: true })
}

const ReverseScroll = {
  mounted: (el, binding) => {
    mount(el, binding)
  },
  onBeforeUnmount: (el) => {
    el.removeEventListener('scroll')
  },
}

export default ReverseScroll
