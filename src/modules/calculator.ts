/* ================================================================
   WATER TREATMENT CALCULATOR
   ================================================================
   Two calculators in a tabbed interface:

   1. Chlorine Dosage Calculator
      - Input: water volume (L), target concentration (mg/L),
        stock solution strength (%)
      - Output: volume of stock solution to add (mL)
      - Formula: V_stock = (C_target × V_water) / (C_stock × 10)
        where C_stock is in % (i.e. g/100mL → ×10 for g/L = mg/mL)

   2. Dilution Calculator (C₁V₁ = C₂V₂)
      - Input: C₁ (initial conc), C₂ (target conc), V₂ (target volume)
      - Output: V₁ (initial volume to use)
      - Also shows the amount of water to add

   All functions are modular and independently testable.
   ================================================================ */

import katex from 'katex'

/* --- Chlorine dosage calculation --- */
function calculateChlorineDosage(
  volumeL: number,
  targetMgL: number,
  stockPercent: number
): { volumeMl: number; totalChlorineMg: number; isWarning: boolean } {
  // Stock solution: X% = X g per 100 mL = X * 10 g/L = X * 10000 mg/L
  const stockMgL = stockPercent * 10000
  // Total chlorine needed (mg)
  const totalChlorineMg = targetMgL * volumeL
  // Volume of stock to add (mL)
  // stockMgL is mg/L, so volume in L = totalChlorineMg / stockMgL
  // Convert to mL: × 1000
  const volumeMl = (totalChlorineMg / stockMgL) * 1000

  // WHO recommends 0.2–5 mg/L for drinking water
  const isWarning = targetMgL < 0.2 || targetMgL > 5

  return { volumeMl, totalChlorineMg, isWarning }
}

/* --- Dilution calculation (C1V1 = C2V2) --- */
function calculateDilution(
  c1: number,
  c2: number,
  v2: number
): { v1: number; waterToAdd: number } {
  // C1 * V1 = C2 * V2  →  V1 = (C2 * V2) / C1
  const v1 = (c2 * v2) / c1
  const waterToAdd = v2 - v1
  return { v1, waterToAdd }
}

/* --- Helper: render a KaTeX string into an element --- */
function renderKatex(el: HTMLElement, latex: string): void {
  try {
    katex.render(latex, el, { throwOnError: false, displayMode: false })
  } catch {
    el.textContent = latex
  }
}

/* --- Helper: format a number to a sensible precision --- */
function formatNumber(n: number): string {
  if (n >= 100) return n.toFixed(0)
  if (n >= 10) return n.toFixed(1)
  if (n >= 1) return n.toFixed(2)
  if (n >= 0.01) return n.toFixed(3)
  return n.toFixed(4)
}

/* --- Tab switching --- */
function initTabs(): void {
  const tabs = document.querySelectorAll<HTMLElement>('.calc-tab')
  const panels = document.querySelectorAll<HTMLElement>('.calc-panel')

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset['tab']

      tabs.forEach((t) => {
        t.classList.remove('active')
        t.setAttribute('aria-selected', 'false')
      })
      tab.classList.add('active')
      tab.setAttribute('aria-selected', 'true')

      panels.forEach((panel) => {
        const isActive = panel.id === `panel-${target}`
        panel.classList.toggle('active', isActive)
        if (!isActive) panel.hidden = true
        else panel.hidden = false
      })
    })
  })
}

/* --- Chlorine calculator wiring --- */
function initChlorineCalculator(): void {
  const btn = document.getElementById('cl-calculate')
  const resultEl = document.getElementById('cl-result')
  if (!btn || !resultEl) return

  btn.addEventListener('click', () => {
    const volumeInput = document.getElementById('cl-volume') as HTMLInputElement | null
    const targetInput = document.getElementById('cl-target') as HTMLInputElement | null
    const stockInput = document.getElementById('cl-stock') as HTMLInputElement | null
    if (!volumeInput || !targetInput || !stockInput) return

    const volumeL = parseFloat(volumeInput.value)
    const targetMgL = parseFloat(targetInput.value)
    const stockPercent = parseFloat(stockInput.value)

    if (isNaN(volumeL) || isNaN(targetMgL) || isNaN(stockPercent) || volumeL <= 0 || targetMgL <= 0 || stockPercent <= 0) {
      resultEl.innerHTML = `<p class="calc-result-placeholder" style="color: var(--error-500);">Please enter valid positive numbers in all fields.</p>`
      return
    }

    const result = calculateChlorineDosage(volumeL, targetMgL, stockPercent)

    resultEl.innerHTML = `
      <div class="calc-result-box ${result.isWarning ? 'warning' : ''}">
        <p class="calc-result-label">Add this volume of stock solution:</p>
        <p class="calc-result-value">${formatNumber(result.volumeMl)} <span class="calc-result-unit">mL</span></p>
        <div class="calc-result-detail">
          <p>To disinfect <strong>${formatNumber(volumeL)} L</strong> of water to a chlorine concentration of <strong>${formatNumber(targetMgL)} mg/L</strong> using a <strong>${formatNumber(stockPercent)}%</strong> stock solution:</p>
          <p style="margin-top: 8px;">Total chlorine needed: <strong>${formatNumber(result.totalChlorineMg)} mg</strong></p>
          ${
            result.isWarning
              ? '<p style="margin-top: 8px; color: var(--warning-700);"><strong>Warning:</strong> The WHO recommends 0.2–5 mg/L of free chlorine for drinking water. Your target is outside this range.</p>'
              : '<p style="margin-top: 8px; color: var(--success-700);">This concentration is within the WHO-recommended range of 0.2–5 mg/L.</p>'
          }
        </div>
      </div>
    `
  })
}

/* --- Dilution calculator wiring --- */
function initDilutionCalculator(): void {
  const btn = document.getElementById('dil-calculate')
  const resultEl = document.getElementById('dil-result')
  const v1Input = document.getElementById('dil-v1') as HTMLInputElement | null
  if (!btn || !resultEl) return

  btn.addEventListener('click', () => {
    const c1Input = document.getElementById('dil-c1') as HTMLInputElement | null
    const c2Input = document.getElementById('dil-c2') as HTMLInputElement | null
    const v2Input = document.getElementById('dil-v2') as HTMLInputElement | null
    if (!c1Input || !c2Input || !v2Input || !v1Input) return

    const c1 = parseFloat(c1Input.value)
    const c2 = parseFloat(c2Input.value)
    const v2 = parseFloat(v2Input.value)

    if (isNaN(c1) || isNaN(c2) || isNaN(v2) || c1 <= 0 || c2 <= 0 || v2 <= 0) {
      resultEl.innerHTML = `<p class="calc-result-placeholder" style="color: var(--error-500);">Please enter valid positive numbers in all fields.</p>`
      return
    }

    if (c2 > c1) {
      resultEl.innerHTML = `<p class="calc-result-placeholder" style="color: var(--error-500);">Target concentration cannot be higher than the initial concentration. You cannot concentrate a solution by dilution.</p>`
      return
    }

    const result = calculateDilution(c1, c2, v2)

    // Update the V1 field
    v1Input.value = formatNumber(result.v1)

    resultEl.innerHTML = `
      <div class="calc-result-box">
        <p class="calc-result-label">Take this volume of stock solution:</p>
        <p class="calc-result-value">${formatNumber(result.v1)} <span class="calc-result-unit">mL</span></p>
        <div class="calc-result-detail">
          <div id="dil-equation" style="text-align: center; margin-bottom: 8px;"></div>
          <p>Using the dilution formula <strong>C₁V₁ = C₂V₂</strong>:</p>
          <p style="margin-top: 6px;">
            <strong>${formatNumber(c1)}</strong> mol/L × <strong>V₁</strong> = <strong>${formatNumber(c2)}</strong> mol/L × <strong>${formatNumber(v2)}</strong> mL
          </p>
          <p style="margin-top: 6px;">
            V₁ = <strong>${formatNumber(result.v1)} mL</strong> of stock solution
          </p>
          <p style="margin-top: 6px;">
            Then add <strong>${formatNumber(result.waterToAdd)} mL</strong> of water to reach a total volume of <strong>${formatNumber(v2)} mL</strong>.
          </p>
        </div>
      </div>
    `

    // Render the KaTeX equation
    const eqEl = document.getElementById('dil-equation')
    if (eqEl) {
      renderKatex(eqEl, `C_1 V_1 = C_2 V_2 \\implies V_1 = \\frac{C_2 \\times V_2}{C_1} = \\frac{${c2} \\times ${v2}}{${c1}} = ${result.v1.toFixed(2)} \\text{ mL}`)
    }
  })
}

/* --- Main init --- */
export function initCalculator(): void {
  initTabs()
  initChlorineCalculator()
  initDilutionCalculator()
}
