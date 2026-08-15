/* ================================================================
   SCROLL REVEAL
   ================================================================
   Adds .visible to elements with .reveal or .reveal-stagger
   when they enter the viewport, triggering CSS transitions.
   ================================================================ */

export function initScrollReveal(): void {
  const elements = document.querySelectorAll('.reveal, .reveal-stagger')
  if (elements.length === 0) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  )

  elements.forEach((el) => observer.observe(el))
}
