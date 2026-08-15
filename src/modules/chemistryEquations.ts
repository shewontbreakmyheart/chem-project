/* ================================================================
   CHEMISTRY EQUATIONS — KaTeX RENDERING
   ================================================================
   Finds all elements with data-equation attributes and renders
   the chemical formula using KaTeX. Uses mhchem extension for
   chemical equation syntax (\ce{...}).
   ================================================================ */

import katex from 'katex'

export function initChemistryEquations(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-equation]')
  if (elements.length === 0) return

  elements.forEach((el) => {
    const equation = el.dataset['equation']
    if (!equation) return

    try {
      katex.render(equation, el, {
        throwOnError: false,
        displayMode: true,
      })
    } catch {
      // Fallback: show raw text
      el.textContent = equation
    }
  })
}
