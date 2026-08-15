/* ================================================================
   SCROLL PROGRESS BAR
   ================================================================
   Updates the thin bar at the top of the page to reflect
   how far the user has scrolled through the document.
   ================================================================ */

export function initScrollProgress(): void {
  const bar = document.getElementById('scrollProgress')
  if (!bar) return
  const progressBar: HTMLElement = bar

  let ticking = false

  function update(): void {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
    progressBar.style.width = `${progress}%`
    ticking = false
  }

  function onScroll(): void {
    if (!ticking) {
      window.requestAnimationFrame(update)
      ticking = true
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  update()
}
