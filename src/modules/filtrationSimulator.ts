/* ================================================================
   FILTRATION SIMULATOR
   ================================================================
   Interactive SVG diagram of a sand-and-gravel filter.
   Clicking each layer updates the info panel with details
   about what that layer removes. Animated water droplets
   fall through the filter continuously.
   ================================================================ */

interface LayerInfo {
  name: string
  badge: string
  description: string
  removes: string[]
}

const layerData: Record<string, LayerInfo> = {
  sand: {
    name: 'Fine Sand Layer',
    badge: 'Top layer',
    description:
      'Fine sand is the primary filtering medium. Its small grain size traps the smallest suspended particles — silt, clay, and some bacteria. Water passes slowly through, allowing physical filtration to take place.',
    removes: ['Fine silt', 'Clay particles', 'Some bacteria', 'Microscopic debris'],
  },
  coarse: {
    name: 'Coarse Sand Layer',
    badge: 'Second layer',
    description:
      'Coarse sand catches larger particles that pass through the fine sand. It also helps distribute water evenly across the filter, preventing channelling where water finds a shortcut through the filter.',
    removes: ['Larger particles', 'Small debris', 'Insects and larvae'],
  },
  gravel: {
    name: 'Gravel Layer',
    badge: 'Third layer',
    description:
      'Gravel provides structural support and drainage. It prevents the finer layers above from clogging the outlet and allows filtered water to flow freely out of the filter.',
    removes: ['Large debris', 'Provides drainage'],
  },
  charcoal: {
    name: 'Activated Charcoal Layer',
    badge: 'Adsorption layer',
    description:
      'Activated charcoal (carbon) has millions of microscopic pores that adsorb dissolved organic compounds, chlorine, and unpleasant odours. This is the layer that improves taste and removes chemicals that physical filtration cannot.',
    removes: ['Chlorine', 'Organic compounds', 'Bad odours', 'Some heavy metals', 'Pesticides'],
  },
  cotton: {
    name: 'Cotton Cloth Layer',
    badge: 'Base layer',
    description:
      'A cotton cloth at the bottom prevents the charcoal and sand from washing out with the filtered water. It acts as a final physical barrier for any remaining particles.',
    removes: ['Fines from upper layers', 'Final polish'],
  },
}

export function initFiltrationSimulator(): void {
  const infoPanel = document.getElementById('simulatorInfo')
  const layers = document.querySelectorAll<SVGGElement>('.filter-layer')
  if (!infoPanel || layers.length === 0) return

  /* Create animated droplets */
  createDroplets()

  /* Layer click handler */
  layers.forEach((layer) => {
    const activate = (): void => {
      const key = layer.dataset['layer']
      if (!key || !layerData[key]) return

      // Update active state
      layers.forEach((l) => l.classList.remove('active'))
      layer.classList.add('active')

      // Update info panel
      const info = layerData[key]
      infoPanel.innerHTML = `
        <div class="layer-detail">
          <h3>${info.name}<span class="layer-badge">${info.badge}</span></h3>
          <p>${info.description}</p>
          <p style="font-weight: var(--fw-medium); color: var(--primary-600); margin-top: var(--sp-2);">What it removes:</p>
          <ul>
            ${info.removes.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `
    }

    layer.addEventListener('click', activate)
    layer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        activate()
      }
    })
  })
}

/* Create animated water droplets inside the SVG */
function createDroplets(): void {
  const group = document.getElementById('dropletsGroup')
  if (!group) return
  const svgNS = 'http://www.w3.org/2000/svg'

  for (let i = 0; i < 5; i++) {
    const drop = document.createElementNS(svgNS, 'circle')
    const x = 80 + Math.random() * 100
    drop.setAttribute('cx', String(x))
    drop.setAttribute('cy', '30')
    drop.setAttribute('r', '3')
    drop.setAttribute('class', 'droplet')
    drop.style.animationDelay = `${i * 0.3}s`

    // Use SMIL-like approach via CSS transform on SVG element
    // We'll use CSS animation with translate
    group.appendChild(drop)
  }
}
