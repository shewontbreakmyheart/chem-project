/* ================================================================
   DISTILLATION ANIMATION
   ================================================================
   Step-by-step animation of the distillation process.
   The Start button triggers a sequence of visual stages:
   1. Flame appears, water heats
   2. Steam particles rise from flask
   3. Steam travels through delivery tube
   4. Steam condenses in the condenser
   5. Pure water drips into collection flask
   ================================================================ */

export function initDistillation(): void {
  const startBtn = document.getElementById('distillStart') as HTMLButtonElement | null
  const resetBtn = document.getElementById('distillReset') as HTMLButtonElement | null
  const steps = document.querySelectorAll<HTMLElement>('.dist-step')
  const steamGroup = document.getElementById('steamGroup')
  const condensedGroup = document.getElementById('condensedDroplets')
  const collectedWater = document.getElementById('collectedWater')
  const flaskWater = document.getElementById('flaskWater')
  const flame = document.getElementById('flame')

  if (
    !startBtn || !resetBtn || !steamGroup || !condensedGroup ||
    !collectedWater || !flaskWater || !flame
  ) return

  // After guard, all are non-null — assign to typed consts for closure use
  const _startBtn: HTMLButtonElement = startBtn
  const _resetBtn: HTMLButtonElement = resetBtn
  const _steamGroup: HTMLElement = steamGroup
  const _condensedGroup: HTMLElement = condensedGroup
  const _collectedWater: HTMLElement = collectedWater
  const _flaskWater: HTMLElement = flaskWater
  const _flame: HTMLElement = flame

  let running = false
  let timeouts: ReturnType<typeof setTimeout>[] = []
  let animationFrame: number | null = null

  function clearAll(): void {
    timeouts.forEach(clearTimeout)
    timeouts = []
    if (animationFrame !== null) cancelAnimationFrame(animationFrame)
    _steamGroup.innerHTML = ''
    _condensedGroup.innerHTML = ''
    _collectedWater.setAttribute('opacity', '0')
    _flame.style.opacity = '0'
    steps.forEach((s) => {
      s.classList.remove('active', 'done')
    })
  }

  function setStep(index: number): void {
    steps.forEach((s, i) => {
      if (i < index) {
        s.classList.add('done')
        s.classList.remove('active')
      } else if (i === index) {
        s.classList.add('active')
        s.classList.remove('done')
      } else {
        s.classList.remove('active', 'done')
      }
    })
  }

  /* Create a steam particle at the flask mouth */
  function createSteamParticle(): void {
    const svgNS = 'http://www.w3.org/2000/svg'
    const particle = document.createElementNS(svgNS, 'circle')
    particle.setAttribute('cx', '110')
    particle.setAttribute('cy', '200')
    particle.setAttribute('r', String(4 + Math.random() * 3))
    particle.setAttribute('class', 'steam-particle')
    particle.style.fill = 'var(--neutral-200)'
    _steamGroup.appendChild(particle)

    const startTime = performance.now()
    const duration = 2500
    const path = [
      { x: 110, y: 200 },
      { x: 160, y: 185 },
      { x: 220, y: 180 },
      { x: 280, y: 195 },
      { x: 380, y: 200 },
    ]

    function animate(now: number): void {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const segmentCount = path.length - 1
      const segProgress = progress * segmentCount
      const segIndex = Math.min(Math.floor(segProgress), segmentCount - 1)
      const localProgress = segProgress - segIndex

      const p0 = path[segIndex]
      const p1 = path[segIndex + 1]
      const x = p0.x + (p1.x - p0.x) * localProgress
      const y = p0.y + (p1.y - p0.y) * localProgress

      particle.setAttribute('cx', String(x))
      particle.setAttribute('cy', String(y))
      particle.setAttribute('opacity', String(Math.sin(progress * Math.PI) * 0.6))

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate)
      } else {
        particle.remove()
        createCondensedDroplet()
      }
    }
    animationFrame = window.requestAnimationFrame(animate)
  }

  /* Create a condensed water droplet falling into collection flask */
  function createCondensedDroplet(): void {
    const svgNS = 'http://www.w3.org/2000/svg'
    const drop = document.createElementNS(svgNS, 'circle')
    drop.setAttribute('cx', '560')
    drop.setAttribute('cy', '220')
    drop.setAttribute('r', '3')
    drop.setAttribute('class', 'cond-droplet')
    drop.style.fill = 'var(--primary-400)'
    _condensedGroup.appendChild(drop)

    const startTime = performance.now()
    const duration = 600
    const startY = 220
    const endY = 255

    function animate(now: number): void {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const y = startY + (endY - startY) * progress
      drop.setAttribute('cy', String(y))
      drop.setAttribute('opacity', String(progress < 0.9 ? 0.8 : (1 - progress) * 8))

      if (progress < 1) {
        window.requestAnimationFrame(animate)
      } else {
        drop.remove()
        const currentOpacity = parseFloat(_collectedWater.getAttribute('opacity') || '0')
        _collectedWater.setAttribute('opacity', String(Math.min(currentOpacity + 0.15, 1)))
      }
    }
    window.requestAnimationFrame(animate)
  }

  /* Start the distillation sequence */
  function start(): void {
    if (running) return
    running = true
    clearAll()
    _startBtn.disabled = true
    _resetBtn.disabled = false

    timeouts.push(
      setTimeout(() => {
        _flame.style.opacity = '1'
        setStep(0)
      }, 200)
    )

    timeouts.push(
      setTimeout(() => {
        setStep(1)
        _flaskWater.setAttribute('opacity', '0.4')
      }, 1500)
    )

    timeouts.push(
      setTimeout(() => {
        setStep(2)
        const steamInterval = setInterval(() => {
          if (!running) {
            clearInterval(steamInterval)
            return
          }
          createSteamParticle()
        }, 400)
        timeouts.push(steamInterval)
      }, 2500)
    )

    timeouts.push(
      setTimeout(() => {
        setStep(3)
      }, 4000)
    )

    timeouts.push(
      setTimeout(() => {
        setStep(4)
        steps[4]?.classList.add('done')
      }, 6000)
    )

    timeouts.push(
      setTimeout(() => {
        running = false
      }, 8000)
    )
  }

  function reset(): void {
    running = false
    clearAll()
    _flaskWater.setAttribute('opacity', '0.6')
    _startBtn.disabled = false
    _resetBtn.disabled = true
  }

  _startBtn.addEventListener('click', start)
  _resetBtn.addEventListener('click', reset)

  _flame.style.opacity = '0'
  _flame.style.transition = 'opacity 0.5s ease'
}
