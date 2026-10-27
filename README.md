# SAKU FILMS

Sitio web de **SAKU FILMS** (wedding films y fotografía) con su panel de administración.

- **Frontend** (`frontend/`): React 19, TypeScript, Vite, Tailwind CSS 4 y Motion.
- **Backend** (`backend/`): Node.js, Express, MongoDB (Mongoose) y JWT. También sirve el panel admin en `/admin`.
- **Imágenes**: Cloudinary en producción y la carpeta `backend/uploads/` en local.

```
SakuFilms/
├── backend/            API REST + panel admin   → ver backend/README.md
│   ├── public/         panel admin (HTML + JS plano, sin build)
│   ├── src/            servidor, rutas, modelos y scripts
│   └── uploads/        imágenes subidas en local (no se versionan)
└── frontend/           sitio público (Vite + React)
    ├── public/         video del hero e imágenes estáticas
    └── src/
        ├── components/ secciones de la página
        └── hooks/      useFilms, useSettings, useScrollReveal
```

## Requisitos

- Node.js 18 o superior.
- MongoDB: local o un cluster gratis de [MongoDB Atlas](https://www.mongodb.com/atlas).

## Puesta en marcha rápida

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env        # completar MONGODB_URI y JWT_SECRET
npm run create-admin        # genera ADMIN_PASSWORD_HASH para pegar en .env
npm run dev                 # http://localhost:4000  ·  panel: http://localhost:4000/admin

# 2. Frontend (en otra terminal)
cd frontend
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:4000
npm run dev                 # http://localhost:5173
```

Si el backend no está corriendo, el frontend igual funciona y muestra contenido de respaldo.

## Secciones del sitio

En orden de aparición (`frontend/src/App.tsx`):

| Componente | Qué muestra | De dónde salen los datos |
|---|---|---|
| `Intro` | Animación de entrada | Estático |
| `Navbar` | Menú de navegación | Estático |
| `Hero` | Video principal (`public/hero.mp4`) | Estático |
| `Manifesto` | Texto de presentación | Estático |
| `FilmsCarousel` | Carrusel automático de films (abre YouTube) | `GET /api/films` (solo los de video) |
| `About` | "Nosotros" + carrusel de fotos por destino | `GET /api/carousel` |
| `Films` | Portfolio filtrable por categoría y galería de fotos | Lista fija en `Films.tsx` |
| `Destination` | Bodas de destino | Estático |
| `Services` | Servicios ofrecidos | Estático |
| `Contact` | Formulario de consulta | `POST /api/contact` |
| `Footer` / `SocialLinks` / `WhatsAppButton` | Redes y WhatsApp | `GET /api/settings` |

`CtaIntermediate` y `CtaFinal` existen pero hoy están comentados en `App.tsx`.

## Panel de administración

Está en `http://localhost:4000/admin` (en producción, `https://api.sakufilms.com/admin`). Desde ahí se puede:

- Crear, editar y borrar **proyectos**: *Wedding Films* y *Trailers* (con link de YouTube), o *Wedding Photography* (con una galería de hasta 60 fotos).
- Editar los **ajustes del sitio**: número y mensaje de WhatsApp y links a Instagram, Facebook, TikTok, YouTube y Vimeo.
- Gestionar el **carrusel de "Nosotros"**: subir fotos o pegar URLs, cada una con su destino.
- Ver y borrar las **consultas de contacto**.

## Variables de entorno

| Dónde | Variable | Descripción |
|---|---|---|
| backend | `MONGODB_URI` | Conexión a MongoDB (**obligatoria**) |
| backend | `JWT_SECRET` | Secreto para firmar los tokens del admin (**obligatoria**) |
| backend | `ADMIN_USER` / `ADMIN_PASSWORD_HASH` | Login del panel (el hash se genera con `npm run create-admin`) |
| backend | `FRONTEND_URL` | Orígenes extra permitidos por CORS, separados por coma |
| backend | `NODE_ENV` | `production` en el servidor real |
| backend | `PORT` | Puerto (por defecto `4000`) |
| backend | `CLOUDINARY_URL` | Opcional: si está definida, las imágenes se suben a Cloudinary |
| backend | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL` | Opcional: aviso por email de cada consulta |
| frontend | `VITE_API_URL` | URL del backend, por ejemplo `https://api.sakufilms.com` |

Los archivos `.env` no se suben al repositorio. Hay que usar como plantilla los `.env.example`.

## Scripts

| Carpeta | Comando | Qué hace |
|---|---|---|
| backend | `npm run dev` | Servidor con recarga automática |
| backend | `npm start` | Servidor para producción |
| backend | `npm run create-admin` | Genera el hash de la contraseña del admin |
| backend | `npm run seed:carousel` | Carga en la base las fotos iniciales del carrusel de "Nosotros" (no duplica) |
| frontend | `npm run dev` | Servidor de desarrollo de Vite |
| frontend | `npm run build` | Build de producción en `frontend/dist/` |
| frontend | `npm run preview` | Sirve el build localmente |
| frontend | `npm run format` | Formatea el código con oxfmt |

## Producción

El sitio está publicado así:

| Parte | Plataforma | Dominio | Configuración |
|---|---|---|---|
| Frontend | Vercel | `sakufilms.com` | Root Directory `frontend` · Build `npm run build` · Output `dist` · variable `VITE_API_URL` |
| Backend | Render | `api.sakufilms.com` | Root Directory `backend` · Build `npm install` · Start `npm start` · variables del `.env` |

- Las dos plataformas vuelven a publicar solas cada vez que se sube un cambio a la rama conectada.
- En Render hay que definir `NODE_ENV=production` y `CLOUDINARY_URL`. El disco de Render se borra en cada deploy, así que sin Cloudinary las imágenes subidas se pierden.
- En Vercel, `VITE_API_URL` se lee al momento del build. Si se cambia, hay que volver a publicar (Redeploy).
- Los dominios `sakufilms.com`, `www.sakufilms.com` y `api.sakufilms.com` ya están permitidos por CORS en `backend/src/server.js`. Para agregar otros (por ejemplo, las URLs de preview de Vercel), se usa `FRONTEND_URL` en Render.

Documentación detallada del backend y de la API: [`backend/README.md`](backend/README.md).
