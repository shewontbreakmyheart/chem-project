/* ================================================================
   METHOD CARDS
   ================================================================
   Renders the purification method cards and handles the
   expand/collapse interaction for each card.
   ================================================================ */

interface MethodData {
  name: string
  icon: string
  summary: string
  details: string
  tags: string[]
}

const methods: MethodData[] = [
  {
    name: 'Boiling',
    icon: '🔥',
    summary:
      'The simplest method — heat water to a rolling boil for at least 1 minute to kill pathogens.',
    details:
      'Boiling water at 100°C destroys bacteria, viruses, and parasites by denaturing their proteins. It does NOT remove chemical pollutants or dissolved salts. The water should be boiled for 1 minute at sea level, or 3 minutes at higher altitudes where water boils at a lower temperature.',
    tags: ['Pathogens', 'Simple', 'No chemicals'],
  },
  {
    name: 'Filtration',
    icon: '⬇️',
    summary:
      'Passing water through layers of sand, gravel, and charcoal to remove suspended particles.',
    details:
      'A typical sand filter uses layers arranged from fine to coarse: fine sand at the top traps the smallest particles, coarse sand and gravel below provide drainage and support, and activated charcoal adsorbs dissolved organic compounds and odours. Filtration removes turbidity but not dissolved chemicals or bacteria unless combined with disinfection.',
    tags: ['Turbidity', 'Particles', 'Adsorption'],
  },
  {
    name: 'Chlorination',
    icon: '🧪',
    summary:
      'Adding chlorine to water to kill bacteria and viruses through chemical oxidation.',
    details:
      'Chlorine gas or sodium hypochlorite is added to water, forming hypochlorous acid (HOCl) which penetrates bacterial cell walls and destroys enzymes. It provides residual protection — chlorine stays active in pipes, preventing recontamination. The WHO recommends 0.2–5 mg/L of free chlorine in drinking water.',
    tags: ['Disinfection', 'Residual', 'Oxidation'],
  },
  {
    name: 'Distillation',
    icon: '💨',
    summary:
      'Boiling water and collecting the condensed steam — removes all dissolved substances.',
    details:
      'Distillation produces the purest water. Water is boiled, the steam rises through a delivery tube, and is condensed back to liquid in a water-cooled condenser. Dissolved salts, metals, and most organic compounds are left behind. However, it is slow and energy-intensive, making it impractical for large-scale water supply.',
    tags: ['Purest', 'Dissolved salts', 'Energy-intensive'],
  },
  {
    name: 'Coagulation & Flocculation',
    icon: '🧫',
    summary:
      'Adding alum to form sticky flocs that trap fine particles and settle them out.',
    details:
      'Aluminium sulfate (alum) is added to murky water. It reacts to form aluminium hydroxide, Al(OH)₃ — a fluffy precipitate called "floc." The floc traps fine suspended particles, bacteria, and some dissolved organics as it settles to the bottom. The clear water above is then decanted and filtered.',
    tags: ['Alum', 'Floc', 'Settling'],
  },
  {
    name: 'Reverse Osmosis',
    icon: '🔬',
    summary:
      'Forcing water through a semi-permeable membrane under pressure to remove dissolved salts.',
    details:
      'In reverse osmosis, water is pushed through a membrane with pores so tiny that dissolved salts, minerals, and most molecules cannot pass. Only water molecules get through. It is highly effective but wastes 3–4 litres of water for every litre purified, and requires high pressure (typically 4–8 bar).',
    tags: ['Membrane', 'Dissolved salts', 'High pressure'],
  },
]

export function initMethodCards(): void {
  const grid = document.getElementById('methodGrid')
  if (!grid) return

  /* Render cards */
  grid.innerHTML = methods
    .map(
      (m, i) => `
      <article class="method-card reveal" data-index="${i}" tabindex="0" role="button" aria-expanded="false">
        <div class="method-card-header">
          <div class="method-card-icon" aria-hidden="true">${m.icon}</div>
          <h3 class="method-card-title">${m.name}</h3>
          <svg class="method-card-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        <p class="method-card-summary" style="font-size: var(--fs-sm); color: var(--text-muted); margin-top: var(--sp-1);">${m.summary}</p>
        <div class="method-card-detail">
          <div class="method-card-detail-inner">
            <p>${m.details}</p>
            <div class="method-tags">
              ${m.tags.map((t) => `<span class="method-tag">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      </article>
    `
    )
    .join('')

  /* Toggle expand on click */
  grid.querySelectorAll<HTMLElement>('.method-card').forEach((card) => {
    const toggle = (): void => {
      const isActive = card.classList.toggle('active')
      card.setAttribute('aria-expanded', String(isActive))
    }
    card.addEventListener('click', toggle)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
      }
    })
  })

  /* Re-observe new reveal elements */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          revealObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )
  grid.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))
}
