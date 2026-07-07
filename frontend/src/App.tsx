import { useEffect, useState, type ReactNode } from 'react'
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
  'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-800 font-semibold text-zinc-100 no-underline transition hover:-translate-y-0.5 hover:border-purple-500 hover:text-purple-400'

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
)

const EmailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

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

  const contactLinks: { label: string; href: string; icon: ReactNode; external: boolean }[] = [
    { label: t.nav.github, href: links.github, icon: <GitHubIcon />, external: true },
    { label: t.nav.linkedin, href: links.linkedin, icon: <LinkedInIcon />, external: true },
    { label: t.nav.email, href: `mailto:${links.email}`, icon: <EmailIcon />, external: false },
  ]

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

      <section className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-800 text-3xl font-bold text-white">
          {initials}
        </div>
        <h1 className="text-2xl font-bold">{t.name}</h1>
        <p className="mt-1 font-semibold text-purple-400">{t.role}</p>
        <p className="mb-5 text-sm text-zinc-400">{t.location}</p>
        <p className="mx-auto mb-7 max-w-md leading-relaxed text-zinc-400">{t.bio}</p>

        <nav className="flex flex-wrap justify-center gap-3" aria-label="Links">
          {contactLinks.map((item) => (
            <a
              key={item.label}
              className={linkClass}
              href={item.href}
              {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </nav>
      </section>

      <div className="w-full max-w-lg flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-base sm:text-lg font-bold text-amber-200">
        🚧 {t.underConstruction}
      </div>

      <footer className="text-sm text-zinc-400">
        &copy; {new Date().getFullYear()} {t.name} · {t.rights}
      </footer>
    </main>
  )
}

export default App
