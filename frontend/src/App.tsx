import { useEffect, useState } from 'react'
import './App.css'
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

function App() {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('lang')
    return saved === 'en' ? 'en' : 'es'
  })
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
    <main className="page">
      <div className="lang-switch" role="group" aria-label="Idioma / Language">
        <button
          type="button"
          className={`lang-btn ${lang === 'es' ? 'active' : ''}`}
          onClick={() => setLang('es')}
          aria-pressed={lang === 'es'}
        >
          ES
        </button>
        <button
          type="button"
          className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
          onClick={() => setLang('en')}
          aria-pressed={lang === 'en'}
        >
          EN
        </button>
      </div>

      <section className="card">
        <div className="badge">🚧 {t.underConstruction}</div>

        <div className="avatar" aria-hidden="true">
          {initials}
        </div>
        <h1 className="name">{t.name}</h1>
        <p className="role">{t.role}</p>
        <p className="location">{t.location}</p>
        <p className="bio">{t.bio}</p>

        <nav className="links" aria-label="Links">
          <a className="link" href={links.github} target="_blank" rel="noreferrer">
            {t.nav.github}
          </a>
          <a className="link" href={links.linkedin} target="_blank" rel="noreferrer">
            {t.nav.linkedin}
          </a>
          <a className="link" href={`mailto:${links.email}`}>
            {t.nav.email}
          </a>
        </nav>
      </section>

      <footer className="footer">
        <span>
          &copy; {new Date().getFullYear()} {t.name} · {t.rights}
        </span>
      </footer>
    </main>
  )
}

export default App
