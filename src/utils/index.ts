/**
 * Local copies of small theme utilities (originally from `astro-pure/utils`).
 *
 * Imported from local source instead of the `astro-pure/utils` package specifier,
 * because Vite pre-bundles that package and fails on its internal `virtual:config`
 * import (see `astro-pure/utils/date.ts`), which would 500/504 the module in dev.
 */

function getTheme() {
  return localStorage.getItem('theme')
}

function listenThemeChange(theme?: string) {
  // If theme is specified, no need to listen window theme change
  if (theme && theme !== 'system') return
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    setTheme(e.matches ? 'dark' : 'light')
  })
}

/** Cycle / apply the site theme (system | dark | light). Mirrors astro-pure's setTheme. */
export function setTheme(theme?: string, save = false) {
  const themes = ['system', 'dark', 'light']
  if (theme) {
    if (!themes.includes(theme)) return
    if (save) localStorage.setItem('theme', theme)
  } else {
    theme = getTheme() ?? undefined
    if (save) {
      // Set theme equals undefined, switch cycle in ['system', 'dark', 'light']
      const currentIndex = themes.indexOf(theme ?? 'system')
      theme = themes[(currentIndex + 1) % themes.length]
      localStorage.setItem('theme', theme) // save theme
    }
  }
  let targetTheme = theme
  if (theme === 'system') {
    targetTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    // Listen theme change
    listenThemeChange(theme)
  }

  // Set theme
  document.documentElement.classList.toggle('dark', targetTheme === 'dark')
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', targetTheme === 'dark' ? '#0B0B10' : '#FCFCFD')

  return theme
}

/** Show a toast via the `toast` event (handled by the theme's ThemeProvider). */
export function showToast(detail: { message: string }) {
  document.dispatchEvent(new CustomEvent('toast', { detail }))
}

/** Simple class-name merger (equivalent of astro-pure's `cn` for string inputs). */
export function cn(...classes: Array<string | undefined | null | false>) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const cls of classes) {
    if (!cls) continue
    for (const part of cls.split(' ')) {
      if (part && !seen.has(part)) {
        seen.add(part)
        out.push(part)
      }
    }
  }
  return out.join(' ')
}
