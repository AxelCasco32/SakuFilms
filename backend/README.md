# SAKU FILMS — Backend

Backend del sitio de SAKU FILMS hecho con **Node.js, Express y MongoDB**.

## ¿Qué hace?

1. **Proyectos (films y fotografía)**: se cargan desde el panel admin y aparecen en el carrusel del home.
2. **Carrusel de "Nosotros"**: guarda las fotos con su destino (Japón, Grecia…) que muestra la sección About.
3. **Ajustes del sitio**: WhatsApp y redes sociales, que el frontend usa en el footer y en el botón flotante.
4. **Formulario de contacto**: guarda las consultas en la base y, si hay SMTP configurado, también avisa por email.
5. **Panel de administración** (`/admin`): login con usuario y contraseña para gestionar todo lo anterior.

## 1. Requisitos

- Node.js 18 o superior (`node -v`).
- MongoDB, con una de estas dos opciones:
  - **Local**: instalar MongoDB Community Server.
  - **En la nube (más simple y gratis)**: un cluster de [MongoDB Atlas](https://www.mongodb.com/atlas).

### Opción A: MongoDB local

En Ubuntu/Debian:

```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

En Windows o Mac se usa el instalador de mongodb.com/try/download/community. El servicio queda escuchando en `mongodb://127.0.0.1:27017`. No hace falta crear la base ni las colecciones, porque Mongoose las crea solas.

### Opción B: MongoDB Atlas

1. Crear una cuenta gratis en https://www.mongodb.com/atlas
2. Crear un cluster gratuito (M0).
3. En "Database Access", crear un usuario y una contraseña.
4. En "Network Access", agregar tu IP (o `0.0.0.0/0` mientras desarrollás).
5. Copiar el "Connection String" (algo como `mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/`).

> `src/db.js` usa los DNS 8.8.8.8 y 1.1.1.1 para que las direcciones `mongodb+srv://` de Atlas resuelvan bien en redes con DNS problemáticos.

## 2. Instalación

```bash
cd backend
npm install
cp .env.example .env
```

## 3. Variables de entorno (`.env`)

| Variable | Obligatoria | Descripción |
|---|---|---|
| `MONGODB_URI` | Sí | `mongodb://127.0.0.1:27017/saku_films`, o el connection string de Atlas con `/saku_films` agregado antes del `?` |
| `JWT_SECRET` | Sí | Texto largo y random. Se puede generar con `openssl rand -hex 32` |
| `ADMIN_USER` | Sí | Usuario del panel (por ejemplo `admin`) |
| `ADMIN_PASSWORD_HASH` | Sí | Hash de la contraseña, generado en el paso 4 |
| `FRONTEND_URL` | No | Orígenes extra permitidos por CORS, separados por coma y sin `/` al final |
| `NODE_ENV` | No | Con `production`, deja de aceptar cualquier `localhost` o IP local en CORS |
| `PORT` | No | Por defecto `4000` |
| `CLOUDINARY_URL` | No | `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`. Si está definida, las imágenes se suben a Cloudinary; si no, se guardan en `uploads/` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO_EMAIL` | No | Aviso por email de cada consulta (ver paso 5) |

## 4. Crear la contraseña del panel admin

**Importante**: `ADMIN_PASSWORD_HASH` tiene que llevar un *hash*, nunca la contraseña en texto plano.

```bash
npm run create-admin
```

El comando pide una contraseña y devuelve una línea como esta:

```
ADMIN_PASSWORD_HASH=$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Esa línea se pega completa en `.env`.

## 5. (Opcional) Email al recibir una consulta

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=una_contraseña_de_aplicación_de_gmail
CONTACT_TO_EMAIL=donde_querés_recibir_los_avisos@gmail.com
```

Con Gmail hay que usar una "Contraseña de aplicación" de la configuración de seguridad de Google, no la contraseña normal. Sin SMTP, las consultas se guardan igual y se ven en `/admin`.

## 6. Correr el backend

```bash
npm run dev       # desarrollo, con recarga automática
npm start         # producción
```

Si todo está bien, se ve esto:

```
✅ Conectado a MongoDB
✅ SAKU backend corriendo en http://localhost:4000
   Panel admin: http://localhost:4000/admin
```

Si aparece `❌ No se pudo conectar a MongoDB`, hay que revisar que Mongo esté corriendo (`sudo systemctl status mongod`) o que el connection string de Atlas sea correcto.

Para cargar las fotos iniciales del carrusel de "Nosotros" (el comando no duplica las que ya existen):

```bash
npm run seed:carousel
```

## 7. Panel admin

Se abre en **http://localhost:4000/admin**, con el usuario de `ADMIN_USER` y la contraseña del paso 4. La sesión dura 12 horas.

- **Proyectos**: nombre de la pareja o título, ubicación, año, orden y categorías.
  - *Wedding Films* y/o *Trailers*: llevan link de YouTube. Si no se sube portada, se usa la miniatura del video.
  - *Wedding Photography*: va sola (no se combina con las otras) y lleva una galería de hasta 60 fotos, subidas o como URLs.
- **Ajustes del sitio**: WhatsApp (solo dígitos, con código de país), mensaje predeterminado y redes sociales.
- **Carrusel de "Nosotros"**: subir fotos o pegar URLs, cada una con su destino.
- **Consultas de contacto**: listado y borrado.

## 8. API

Las rutas marcadas con 🔒 requieren el header `Authorization: Bearer <token>`.

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/login` | `{ user, password }` → `{ token }` |
| `GET` | `/api/films` | Lista los proyectos ordenados por `position` |
| `GET` | `/api/films/categories` | Categorías válidas |
| `POST` | `/api/films` 🔒 | Crea un proyecto (`multipart/form-data`) |
| `PUT` | `/api/films/:id` 🔒 | Edita un proyecto (`keepImages` = fotos de la galería que se conservan) |
| `DELETE` | `/api/films/:id` 🔒 | Borra un proyecto |
| `GET` | `/api/carousel` | Fotos del carrusel de "Nosotros" |
| `POST` | `/api/carousel` 🔒 | Agrega fotos: archivos en `photos`, más `destinations` y `links` en JSON |
| `PUT` | `/api/carousel/:id` 🔒 | Cambia el destino de una foto |
| `DELETE` | `/api/carousel/:id` 🔒 | Quita una foto (y la borra de Cloudinary si se subió desde el panel) |
| `GET` | `/api/settings` | WhatsApp y redes |
| `PUT` | `/api/settings` 🔒 | Guarda WhatsApp y redes |
| `POST` | `/api/contact` | Recibe una consulta (`nombre` y `email` son obligatorios) |
| `GET` | `/api/contact` 🔒 | Lista las consultas |
| `DELETE` | `/api/contact/:id` 🔒 | Borra una consulta |
| `GET` | `/api/health` | `{ ok: true }` |

Campos de un proyecto (`POST`/`PUT /api/films`):

- `couple`, `location`, `year`, `position`.
- `categories`: separadas por coma o en JSON.
- `videoUrl`.
- `img` (URL de portada) o un archivo en `image`.
- `photos` (archivos) o `imageUrls` (URLs).

Las imágenes pueden pesar hasta 15 MB cada una.

## 9. Producción

- Usar `NODE_ENV=production` y correr con `npm start` (bajo `pm2`, systemd o el hosting).
- En hostings con disco efímero (Render, Railway) hay que definir `CLOUDINARY_URL`; si no, las imágenes de `uploads/` se pierden en cada deploy.
- Para la base, usar Atlas o un servidor propio, nunca una instancia local.
- En el frontend, `VITE_API_URL` tiene que apuntar a la URL pública del backend (por ejemplo `https://api.sakufilms.com`).
- Los orígenes `sakufilms.com`, `www.sakufilms.com` y `api.sakufilms.com` ya están permitidos en `src/server.js`. Para agregar otros se usa `FRONTEND_URL`.

## Estructura

```
backend/
  src/
    server.js              arranca Express, CORS, rutas y manejo de errores
    db.js                  conexión a MongoDB
    create-admin.js        genera el hash de la contraseña del admin
    seedCarousel.js        carga las fotos iniciales del carrusel de "Nosotros"
    middleware/
      auth.js              valida el token JWT
      asyncHandler.js      pasa los errores de las rutas async al manejador de errores
    models/
      Film.js              proyecto: categorías, portada, galería y video
      CarouselPhoto.js     foto del carrusel con su destino
      Settings.js          WhatsApp y redes (un único documento)
      Contact.js           consulta del formulario
    routes/
      auth.js  films.js  carousel.js  settings.js  contact.js
  public/index.html        panel admin (servido en /admin)
  uploads/                 imágenes subidas en local (no se versionan)
```
