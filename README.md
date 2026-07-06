# Portfolio

Web personal de presentación construida con **Django (API REST)** en el backend y
**React (Vite + TypeScript)** en el frontend. Preparada para desplegarse con
Docker en un VPS mediante Dokploy, bajo el dominio
[https://jjlagunastudio.es](https://jjlagunastudio.es).

Muestra una tarjeta con nombre, rol, ubicación, una breve biografía y enlaces a
GitHub, LinkedIn y correo. El frontend obtiene esos datos de `/api/profile/` y,
si la API no responde, usa valores por defecto para seguir funcionando solo.

## Estructura

```
portfolio/
├─ backend/            # Django + Django REST Framework
│  ├─ config/          # settings, urls, wsgi
│  ├─ portfolio_api/   # endpoints /api/health y /api/profile
│  ├─ Dockerfile
│  └─ requirements.txt
├─ frontend/           # React (Vite + TypeScript)
│  ├─ src/             # App.tsx, estilos
│  ├─ Dockerfile       # build + nginx
│  └─ nginx.conf       # sirve el SPA y hace proxy de /api al backend
├─ docker-compose.yml
└─ README.md
```

## Desarrollo local

Los puertos están elegidos para **no chocar** con otros proyectos (MyPublicInbox
o couple-hub): backend en `8002` y frontend en `5175`.

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8002
```

API en `http://localhost:8002/api/profile/`.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

App en `http://localhost:5175`. Las llamadas a `/api` se redirigen al backend
(`8002`) mediante el proxy de `vite.config.ts`.

## Variables de entorno (solo producción)

En local no hace falta configurar nada. En **producción** (Dokploy) define estas
variables en el panel del servicio backend:

| Variable | Valor recomendado |
| --- | --- |
| `DJANGO_SECRET_KEY` | Una clave larga y aleatoria (no la compartas). |
| `DJANGO_DEBUG` | `False` |
| `DJANGO_ALLOWED_HOSTS` | `jjlagunastudio.es,www.jjlagunastudio.es` |
| `CORS_ALLOWED_ORIGINS` | `https://jjlagunastudio.es` |
| `CSRF_TRUSTED_ORIGINS` | `https://jjlagunastudio.es` |

> No hay secretos en el repositorio. Todo lo sensible vive en variables de
> entorno definidas en Dokploy.

## Despliegue en Dokploy

Sigue el mismo patrón que couple-hub (sin publicar puertos en el host; Traefik
enruta el dominio a través de `dokploy-network`):

1. Crea una aplicación de tipo **Compose** en el proyecto `portfolio` apuntando a
   este repositorio de GitHub.
2. Añade las variables de entorno de la tabla anterior en el servicio backend.
3. En la pestaña **Domains**, asigna `jjlagunastudio.es` al servicio `frontend`
   (puerto `80`) y activa HTTPS (Let's Encrypt).
4. Despliega. La imagen se construye en el propio VPS (no hace falta Docker en
   tu máquina).

> El `docker-compose.yml` usa la red externa `dokploy-network`, que solo existe
> en el servidor de Dokploy. Por eso el desarrollo en local se hace con
> `runserver` + `npm run dev` (ver arriba), no con `docker compose`.
