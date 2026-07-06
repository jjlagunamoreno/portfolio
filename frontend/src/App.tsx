import { useEffect, useState } from 'react'
import './App.css'

interface Profile {
  name: string
  role: string
  location?: string
  bio: string
  links: {
    github: string
    linkedin: string
    email: string
  }
}

const fallbackProfile: Profile = {
  name: 'Jaime Jesús Laguna Moreno',
  role: 'Full-Stack Developer',
  location: 'Madrid, España',
  bio: 'Desarrollador Full-Stack con experiencia en frontend (React, Angular, Vue) y backend (Python y .NET). Apasionado por la tecnología, la optimización de sistemas y la automatización de procesos.',
  links: {
    github: 'https://github.com/jjlagunamoreno',
    linkedin: 'https://www.linkedin.com/in/jaime-laguna-moreno/',
    email: 'jjlagunamoreno@gmail.com',
  },
}

function App() {
  const [profile, setProfile] = useState<Profile>(fallbackProfile)

  useEffect(() => {
    fetch('/api/profile/')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: Profile) => setProfile(data))
      .catch(() => setProfile(fallbackProfile))
  }, [])

  const { name, role, location, bio, links } = profile
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')

  return (
    <main className="page">
      <section className="card">
        <div className="avatar" aria-hidden="true">
          {initials}
        </div>
        <h1 className="name">{name}</h1>
        <p className="role">{role}</p>
        {location && <p className="location">{location}</p>}
        <p className="bio">{bio}</p>

        <nav className="links" aria-label="Enlaces de contacto">
          <a className="link" href={links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="link" href={links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="link" href={`mailto:${links.email}`}>
            Correo
          </a>
        </nav>
      </section>

      <footer className="footer">
        <span>
          &copy; {new Date().getFullYear()} {name}
        </span>
      </footer>
    </main>
  )
}

export default App
