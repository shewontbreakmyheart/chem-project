/* ================================================================
   WATER PURIFICATION & FILTRATION — MAIN ENTRY POINT
   ================================================================
   This file imports KaTeX, the stylesheet, and all interactive
   modules. Each module is self-contained vanilla JavaScript.
   ================================================================ */

// KaTeX CSS for math rendering
import 'katex/dist/katex.min.css'

// Main stylesheet
import './style.css'

// Interactive modules
import { initScrollProgress } from './modules/scrollProgress'
import { initNavigation } from './modules/navigation'
import { initScrollReveal } from './modules/scrollReveal'
import { initStatCounter } from './modules/statCounter'
import { initMethodCards } from './modules/methodCards'
import { initFiltrationSimulator } from './modules/filtrationSimulator'
import { initDistillation } from './modules/distillation'
import { initChemistryEquations } from './modules/chemistryEquations'
import { initCalculator } from './modules/calculator'
import { initQuiz } from './modules/quiz'
import { initThemeToggle } from './modules/themeToggle'

/* Run all modules after DOM is ready */
function init(): void {
  initScrollProgress()
  initNavigation()
  initScrollReveal()
  initStatCounter()
  initMethodCards()
  initFiltrationSimulator()
  initDistillation()
  initChemistryEquations()
  initCalculator()
  initQuiz()
  initThemeToggle()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
