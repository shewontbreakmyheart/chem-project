/* ================================================================
   STAT COUNTER
   ================================================================
   Animates numbers in the stat bar from 0 to their target
   value when the stat bar scrolls into view.
   ================================================================ */

export function initStatCounter(): void {
  const statBar = document.getElementById('statBar')
  if (!statBar) return

  const numbers = statBar.querySelectorAll<HTMLElement>('.stat-number')
  if (numbers.length === 0) return

  let animated = false

  function animateNumber(el: HTMLElement): void {
    const target = parseFloat(el.dataset['target'] || '0')
    const suffix = el.dataset['suffix'] || ''
    const duration = 2000
    const startTime = performance.now()

    function formatValue(value: number): string {
      if (target >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M'
      }
      if (target >= 1000) {
        return Math.round(value).toLocaleString()
      }
      return value.toFixed(1)
    }

    function step(now: number): void {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = target * eased
      el.textContent = formatValue(current) + suffix
      if (progress < 1) {
        window.requestAnimationFrame(step)
      } else {
        el.textContent = formatValue(target) + suffix
      }
    }

    window.requestAnimationFrame(step)
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true
          numbers.forEach(animateNumber)
          observer.disconnect()
        }
      })
    },
    { threshold: 0.4 }
  )

  observer.observe(statBar)
}
