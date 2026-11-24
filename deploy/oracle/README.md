# Mudar el backend a Oracle Cloud (gratis)

Guía para pasar el backend de Render a un servidor **Always Free** de Oracle Cloud. Al final, `https://api.sakufilms.com` apunta al servidor nuevo. El frontend (Vercel), MongoDB Atlas y Cloudinary no cambian.

Tiempo estimado: 45 a 60 minutos.

**Antes de empezar, tené a mano:**
- Los valores de las variables de entorno del backend en Render: en tu servicio, **Environment**. Copialos a un archivo de texto en tu computadora.
- Acceso al panel donde administrás el dominio `sakufilms.com`.
- Acceso a MongoDB Atlas.

---

## 1. Crear la cuenta de Oracle Cloud

1. Entrá a https://www.oracle.com/cloud/free/ y tocá **Start for free**.
2. Elegí una **Home Region** cercana, por ejemplo *Brazil East (São Paulo)*, *Chile Central (Santiago)* o *US East (Ashburn)*. **No se puede cambiar después**, y los servidores gratis solo se crean en esa región.
3. Cargá la tarjeta. Es solo para verificar la cuenta y no te cobra.

## 2. Pasar la cuenta a "Pay As You Go" y poner un aviso de presupuesto

Las cuentas 100 % gratis pueden perder el servidor si casi no se usa durante 7 días, y este backend usa muy poco. Con **Pay As You Go** esa regla no se aplica, y seguís pagando **$0** mientras uses solo recursos *Always Free*.

1. En el menú, entrá a **Billing & Cost Management → Upgrade and Manage Payment** y elegí **Upgrade to Pay As You Go**. La aprobación puede tardar unas horas; mientras tanto podés seguir con los pasos.
2. Entrá a **Billing & Cost Management → Budgets → Create Budget**:
   - Monto: **1 USD** por mes.
   - Alerta: al **1 %** del presupuesto, con tu email.

   Así te avisa por mail si alguna vez aparece un cobro.

## 3. Crear el servidor

1. Entrá a **Compute → Instances → Create instance**.
2. **Name:** `sakufilms-backend`.
3. **Image:** tocá *Change image* y elegí **Canonical Ubuntu 24.04**.
4. **Shape:** tocá *Change shape* y elegí una de estas dos, que deben decir **Always Free Eligible**:
   - **Ampere → VM.Standard.A1.Flex** con 1 OCPU y 6 GB de RAM. Es la mejor opción si hay lugar.
   - Si aparece *Out of capacity*: **Specialty and previous generation → VM.Standard.E2.1.Micro**. Tiene 1 GB de RAM y alcanza para este backend.
5. **Networking:** dejá que cree la red nueva y verificá que esté marcado **Assign a public IPv4 address**.
6. **Add SSH keys:** elegí **Generate a key pair for me** y descargá **las dos llaves**. Guardalas bien, porque sin ellas no podés entrar al servidor.
7. Tocá **Create** y esperá a que el estado diga **Running**.
8. Anotá la **Public IP address** que aparece en la página del servidor.

## 4. Abrir los puertos 80 y 443 en Oracle

Oracle tiene un firewall propio, además del de Ubuntu. El script se encarga del de Ubuntu; este lo abrís vos:

1. En la página del servidor, tocá la **Virtual Cloud Network** y después la **Subnet**.
2. Abrí la **Security List** (*Default Security List…*) y tocá **Add Ingress Rules**.
3. Agregá esta regla:
   - **Source CIDR:** `0.0.0.0/0`
   - **IP Protocol:** TCP
   - **Destination Port Range:** `80,443`
4. Guardá.

## 5. Entrar al servidor

Desde la terminal de tu computadora (en Windows, PowerShell):

```bash
ssh -i ruta/a/la-llave-privada.key ubuntu@IP_DEL_SERVIDOR
```

En Mac o Linux, si te dice que la llave tiene permisos muy abiertos, corré primero `chmod 600 ruta/a/la-llave-privada.key`.

## 6. Instalar todo con el script

Ya dentro del servidor:

```bash
curl -fsSL https://raw.githubusercontent.com/AxelCasco32/SakuFilms/main/deploy/oracle/setup.sh -o setup.sh
sudo bash setup.sh
```

Tarda unos 5 a 10 minutos. El script hace esto:
- actualiza Ubuntu y activa las actualizaciones de seguridad automáticas;
- instala Node.js 22, Nginx, Certbot (HTTPS) y fail2ban (bloquea intentos de entrar por la fuerza);
- crea 2 GB de memoria swap si el servidor es chico;
- crea el usuario `saku`, para que el backend no corra como administrador;
- descarga el código en `/opt/sakufilms` e instala las dependencias;
- registra el backend como servicio, así arranca solo y se reinicia si se cae;
- configura Nginx para `api.sakufilms.com` y abre los puertos 80 y 443 en Ubuntu.

## 7. Cargar tus datos en el `.env`

```bash
sudo nano /opt/sakufilms/backend/.env
```

Completá cada variable con el valor que tenías en Render:

| Variable | Valor |
|---|---|
| `MONGODB_URI` | El mismo que en Render |
| `JWT_SECRET` | El mismo que en Render |
| `ADMIN_USER` / `ADMIN_PASSWORD_HASH` | Los mismos que en Render |
| `CLOUDINARY_URL` | El mismo que en Render (**obligatorio**, para que las fotos vayan a Cloudinary) |
| `SMTP_*` / `CONTACT_TO_EMAIL` | Los mismos que en Render, si los usabas |
| `FRONTEND_URL` | El mismo que en Render, o vacío |
| `NODE_ENV` | `production` (el script ya lo dejó así) |
| `PORT` | `4000` (el script ya lo dejó así) |

Guardá con `Ctrl+O`, `Enter`, y salí con `Ctrl+X`.

## 8. Permitir el servidor en MongoDB Atlas

1. En Atlas, entrá a **Network Access → Add IP Address**.
2. Poné la IP pública del servidor y confirmá.
3. Si antes tenías `0.0.0.0/0` (abierto a cualquiera, como pedía Render), **borralo cuando termines la mudanza**. Así la base solo acepta conexiones de tu servidor.

## 9. Arrancar el backend y probarlo

```bash
sudo systemctl restart sakufilms
curl http://127.0.0.1:4000/api/health
```

Si responde `{"ok":true}`, está funcionando. Si no, mirá qué pasó con:

```bash
sudo journalctl -u sakufilms -n 50
```

Lo más común es un dato mal copiado en el `.env`, o que falte la IP del servidor en Atlas.

## 10. Apuntar el dominio al servidor nuevo

En el panel de tu dominio, editá el registro de `api`:

- Si hoy es un **CNAME** que apunta a Render, borralo.
- Creá un registro **A**:
  - **Nombre:** `api`
  - **Valor:** la IP pública del servidor
  - **TTL:** el mínimo disponible

El cambio tarda entre unos minutos y un par de horas. Para comprobarlo:

```bash
curl http://api.sakufilms.com/api/health
```

Cuando responda `{"ok":true}`, seguí con el siguiente paso.

## 11. Activar HTTPS

En el servidor:

```bash
sudo certbot --nginx -d api.sakufilms.com --redirect -m TU_EMAIL --agree-tos -n
```

Certbot obtiene el certificado gratis y lo renueva solo. Después probá en el navegador:

- https://api.sakufilms.com/api/health → `{"ok":true}`
- https://api.sakufilms.com/admin → el panel admin
- https://sakufilms.com → los proyectos y el formulario de contacto deberían funcionar

## 12. Terminar

- **UptimeRobot:** no cambia nada, sigue revisando `https://api.sakufilms.com/api/health` y te avisa si algo se cae.
- **Render:** cuando todo funcione, podés borrar el servicio, o dejarlo como respaldo y volver a apuntar el dominio ahí si hiciera falta.
- **MongoDB Atlas:** borrá `0.0.0.0/0` si lo tenías (paso 8).

---

## Publicar cambios del backend

Render publicaba solo con cada merge; acá lo hacés con un comando. Después de hacer merge en GitHub, entrá al servidor y corré:

```bash
sudo bash /opt/sakufilms/deploy/oracle/update.sh
```

Baja los cambios, instala dependencias, reinicia el backend y verifica que responda.

> Los cambios del **frontend** siguen publicándose solos en Vercel.

## Comandos útiles

| Para… | Comando |
|---|---|
| Ver si el backend está corriendo | `sudo systemctl status sakufilms` |
| Ver los últimos logs | `sudo journalctl -u sakufilms -n 100` |
| Seguir los logs en vivo | `sudo journalctl -u sakufilms -f` |
| Reiniciar el backend | `sudo systemctl restart sakufilms` |
| Editar las variables | `sudo nano /opt/sakufilms/backend/.env` y después reiniciar |
| Renovar HTTPS a mano (es automático) | `sudo certbot renew` |

## Problemas frecuentes

- **`curl http://api.sakufilms.com` no conecta:** falta abrir los puertos 80 y 443 en la Security List de Oracle (paso 4), o el dominio todavía no apunta a la IP nueva.
- **El backend arranca y se cae:** mirá `sudo journalctl -u sakufilms -n 50`. Si dice `No se pudo conectar a MongoDB`, falta la IP en Atlas (paso 8) o el `MONGODB_URI` está mal.
- **Certbot falla:** el dominio todavía no apunta al servidor. Esperá un rato y volvé a correrlo.
- **Las fotos no se suben:** revisá que `CLOUDINARY_URL` esté en el `.env`.
