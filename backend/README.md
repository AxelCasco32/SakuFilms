# SAKU FILMS — Backend

Backend en **Node.js + Express + MongoDB** para el sitio de SAKU FILMS.

## ¿Qué hace?

1. **Formulario de contacto**: recibe las consultas del sitio, las guarda en la base de datos y opcionalmente avisa por email.
2. **Films del carousel y de la sección Films**: un mismo panel de administración carga cada proyecto (pareja, ubicación, categoría, año, imagen y link de YouTube) y ese proyecto aparece automáticamente:
   - en el carousel del home, y
   - en la grilla de la sección Films, ya filtrado por su categoría.
3. **Panel de administración** (`/admin`): login con usuario/contraseña, alta/edición/borrado de films, click en la imagen para reproducir el video de YouTube cargado, y listado de las consultas de contacto recibidas.

## 1. Requisitos

- Node.js 18 o superior (`node -v`).
- MongoDB. Dos opciones, elegí una:
  - **Local**: instalar MongoDB Community Server en tu máquina.
  - **En la nube (más simple, gratis)**: crear un cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/atlas) y usar su cadena de conexión.

## 2. Instalar MongoDB local (opción A)

En Ubuntu/Debian:

```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

En Windows/Mac, descargá el instalador desde mongodb.com/try/download/community y seguí el asistente. Una vez instalado, el servicio queda escuchando en `mongodb://127.0.0.1:27017` por defecto — no hace falta crear la base ni las colecciones a mano, Mongoose las crea solas la primera vez que se usan.

## 3. O usar MongoDB Atlas (opción B, sin instalar nada)

1. Creá una cuenta gratis en https://www.mongodb.com/atlas
2. Creá un cluster gratuito (M0).
3. En "Database Access" creá un usuario y contraseña.
4. En "Network Access" agregá tu IP (o `0.0.0.0/0` mientras desarrollás).
5. Copiá el "Connection String" (algo como `mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/`).

## 4. Instalación del proyecto

Descomprimí esta carpeta `backend/` **al lado** de la carpeta del frontend:

```
tu-proyecto/
  saku-films-design/   <- el frontend
  backend/             <- esto
```

```bash
cd backend
npm install
```

## 5. Configurar variables de entorno

```bash
cp .env.example .env
```

Completá en `.env`:

- `MONGODB_URI`: `mongodb://127.0.0.1:27017/saku_films` si usás Mongo local, o tu connection string de Atlas (agregándole `/saku_films` al final, antes de los `?`).
- `JWT_SECRET`: cualquier texto largo y random. Podés generarlo con `openssl rand -hex 32`.
- `FRONTEND_URL`: `http://localhost:5173` mientras desarrollás.

## 6. Crear la contraseña del panel admin

**Importante**: este campo tiene que llevar un *hash* generado por el comando, nunca la contraseña en texto plano.

```bash
npm run create-admin
```

Te va a pedir una contraseña y te va a devolver una línea como:

```
ADMIN_PASSWORD_HASH=$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Pegá esa línea completa en tu `.env`, reemplazando la que está vacía.

## 7. (Opcional) Email al recibir una consulta

En `.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=una_contraseña_de_aplicación_de_gmail
CONTACT_TO_EMAIL=donde_querés_recibir_los_avisos@gmail.com
```

Si usás Gmail, generá una "Contraseña de aplicación" en la configuración de seguridad de Google (no tu contraseña normal). Si dejás esto vacío, las consultas se guardan igual en la base — simplemente no llega el mail, y las ves en `/admin`.

## 8. Correr el backend

```bash
npm run dev
```

Deberías ver:

```
✅ Conectado a MongoDB
✅ SAKU backend corriendo en http://localhost:4000
   Panel admin: http://localhost:4000/admin
```

Si en cambio ves `❌ No se pudo conectar a MongoDB`, revisá que el servicio de Mongo esté corriendo (`sudo systemctl status mongod`) o que el connection string de Atlas sea correcto.

## 9. Correr el frontend (otra terminal)

```bash
cd ../saku-films-design
npm install
npm run dev
```

Se abre en `http://localhost:5173`, ya conectado al backend.

## 10. Usar el panel admin

**http://localhost:4000/admin**

- Usuario: el de `ADMIN_USER` (por defecto `admin`)
- Contraseña: la que elegiste en el paso 6

Desde ahí:
- Cargás un film con pareja, ubicación, **categoría** (Wedding Films / Trailers / Highlights / Destination Weddings), año, imagen y el **link de YouTube** del video.
- Ese mismo film aparece automáticamente en el carousel del home y en la grilla de la sección Films, ya filtrado por su categoría — es un solo lugar de carga para las dos secciones.
- Haciendo click en la miniatura de la tabla, se abre un reproductor con el video de YouTube cargado.
- También podés ver y borrar las consultas de contacto recibidas.

## 11. Cambios hechos en el frontend para conectar todo esto

- `Contact.tsx`: el formulario ahora hace `POST` real a `/api/contact` en vez de no hacer nada.
- `hooks/useFilms.ts`: hook que trae los films desde el backend (con placeholders de respaldo si el backend no está corriendo). Lo usan tanto el carousel como la sección Films, así quedan sincronizados.
- `FilmsCarousel.tsx`: ahora avanza solo cada 4 segundos (se pausa al pasar el mouse), las imágenes se muestran en blanco y negro y pasan a color al hacer hover, y al hacer click se abre el video de YouTube del proyecto.
- `Films.tsx`: la grilla categorizada ahora lee los mismos films del backend (antes tenía su propia lista separada) y también abre el video al hacer click.
- `components/VideoModal.tsx`: modal compartido que convierte cualquier link de YouTube (watch, youtu.be, shorts) en el reproductor embebido.

## 12. Notas para producción

- Cambiá `FRONTEND_URL` en `.env` por el dominio real del sitio.
- Cambiá `VITE_API_URL` en el frontend por la URL pública del backend (ej: `https://api.sakufilms.com`).
- La carpeta `uploads/` (imágenes subidas) debe persistir entre reinicios del servidor: en hostings con disco efímero (Render, Railway free tier) necesitás un volumen persistente, o migrar a un storage externo (S3, Cloudinary).
- Para Mongo en producción, usá Atlas (o un servidor propio) — no dependas de una instancia local del servidor.
- Corré el backend con un gestor de procesos (`pm2`, o el servicio systemd del servidor) en vez de `npm run dev`, usando `npm start`.

## Estructura del proyecto

```
backend/
  src/
    server.js          -> arranca Express, conecta a Mongo, monta las rutas
    db.js               -> conexión a MongoDB (Mongoose)
    create-admin.js     -> script para generar el hash de contraseña
    models/
      Film.js            -> esquema de Mongoose de un film (incluye categoría y videoUrl)
      Contact.js          -> esquema de Mongoose de una consulta de contacto
    middleware/auth.js  -> valida el token JWT en rutas protegidas
    routes/
      auth.js             -> POST /api/auth/login
      films.js            -> GET/POST/PUT/DELETE /api/films, GET /api/films/categories
      contact.js          -> POST/GET/DELETE /api/contact
  public/index.html      -> panel admin (servido en /admin), con reproductor de YouTube
  uploads/                -> imágenes subidas de los films
```
