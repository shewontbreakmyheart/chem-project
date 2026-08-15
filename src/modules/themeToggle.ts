/* ================================================================
   THEME TOGGLE
   ================================================================
   Toggles between light and dark themes by setting
   data-theme attribute on the <html> element.
   Persists the user's choice in localStorage and respects
   the prefers-color-scheme media query on first visit.
   ================================================================ */

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'purewater-theme'

function getPreferredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  // Respect system preference on first visit
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme)
}

export function initThemeToggle(): void {
  const toggle = document.getElementById('themeToggle')
  if (!toggle) return

  // Apply saved/system theme immediately
  const initialTheme = getPreferredTheme()
  applyTheme(initialTheme)

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') as Theme | null
    const next: Theme = current === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    localStorage.setItem(STORAGE_KEY, next)
  })
}
