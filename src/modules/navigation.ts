/* ================================================================
   NAVIGATION
   ================================================================
   - Sticky nav background appears on scroll
   - Mobile hamburger menu toggle
   - Active section highlighting via IntersectionObserver
   - Smooth scroll handled by CSS scroll-behavior
   ================================================================ */

export function initNavigation(): void {
  const navEl = document.getElementById('siteNav')
  const toggle = document.getElementById('navToggle')
  const links = document.getElementById('navLinks')
  if (!navEl || !toggle || !links) return
  const nav: HTMLElement = navEl

  /* Solid background on scroll */
  let ticking = false
  function onScroll(): void {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          nav.classList.add('scrolled')
        } else {
          nav.classList.remove('scrolled')
        }
        ticking = false
      })
      ticking = true
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  /* Mobile menu toggle */
  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open')
    links.classList.toggle('open', isOpen)
    toggle.setAttribute('aria-expanded', String(isOpen))
  })

  /* Close mobile menu when a link is clicked */
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open')
      links.classList.remove('open')
      toggle.setAttribute('aria-expanded', 'false')
    })
  })

  /* Active section highlighting */
  const sections = document.querySelectorAll('main section[id], main header[id]')
  const navLinkMap = new Map<string, HTMLAnchorElement>()
  links.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href')
    if (href && href.startsWith('#')) {
      navLinkMap.set(href.slice(1), a)
    }
  })

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id')
          if (!id) return
          navLinkMap.forEach((link, key) => {
            link.classList.toggle('active', key === id)
          })
        }
      })
    },
    { rootMargin: '-40% 0px -55% 0px' }
  )

  sections.forEach((s) => observer.observe(s))
}
