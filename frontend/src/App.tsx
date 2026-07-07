import { useEffect, useState } from 'react'
import es from './locales/es.json'
import en from './locales/en.json'

type Lang = 'es' | 'en'

const dictionaries = { es, en }

interface Links {
  github: string
  linkedin: string
  email: string
}

const fallbackLinks: Links = {
  github: 'https://github.com/jjlagunamoreno',
  linkedin: 'https://www.linkedin.com/in/jaime-laguna-moreno/',
  email: 'jjlagunamoreno@gmail.com',
}

const linkClass =
  'px-5 py-2.5 rounded-xl border border-zinc-800 font-semibold text-zinc-100 no-underline transition hover:-translate-y-0.5 hover:border-purple-500 hover:text-purple-400'

function App() {
  const [lang, setLang] = useState<Lang>(() =>
    localStorage.getItem('lang') === 'en' ? 'en' : 'es',
  )
  const [links, setLinks] = useState<Links>(fallbackLinks)

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    fetch('/api/profile/')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { links?: Links }) => {
        if (data.links) setLinks(data.links)
      })
      .catch(() => setLinks(fallbackLinks))
  }, [])

  const t = dictionaries[lang]
  const initials = t.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-6 p-6 text-zinc-100">
      <div className="fixed top-5 right-5 flex gap-1 p-1 rounded-xl border border-zinc-800 bg-zinc-900">
        {(['es', 'en'] as const).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold uppercase transition ${
              lang === code
                ? 'bg-purple-500 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {code}
          </button>
        ))}
      </div>

      <div className="w-full max-w-lg flex items-center justify-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-lg font-bold text-amber-200">
        🚧 {t.underConstruction}
      </div>

      <section className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-800 text-3xl font-bold text-white">
          {initials}
        </div>
        <h1 className="text-2xl font-bold">{t.name}</h1>
        <p className="mt-1 font-semibold text-purple-400">{t.role}</p>
        <p className="mb-5 text-sm text-zinc-400">{t.location}</p>
        <p className="mx-auto mb-7 max-w-md leading-relaxed text-zinc-400">{t.bio}</p>

        <nav className="flex flex-wrap justify-center gap-3" aria-label="Links">
          <a className={linkClass} href={links.github} target="_blank" rel="noreferrer">
            {t.nav.github}
          </a>
          <a className={linkClass} href={links.linkedin} target="_blank" rel="noreferrer">
            {t.nav.linkedin}
          </a>
          <a className={linkClass} href={`mailto:${links.email}`}>
            {t.nav.email}
          </a>
        </nav>
      </section>

      <footer className="text-sm text-zinc-400">
        &copy; {new Date().getFullYear()} {t.name} · {t.rights}
      </footer>
    </main>
  )
}

export default App
