#!/usr/bin/env bash
# Instala el backend de SAKU FILMS en un servidor Ubuntu (Oracle Cloud u otro).
#
# Uso, desde el servidor:
#   curl -fsSL https://raw.githubusercontent.com/AxelCasco32/SakuFilms/main/deploy/oracle/setup.sh -o setup.sh
#   sudo bash setup.sh
#
# Se puede correr más de una vez: no rompe lo que ya está instalado.
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/AxelCasco32/SakuFilms.git}"
BRANCH="${BRANCH:-main}"
DOMAIN="${DOMAIN:-api.sakufilms.com}"
APP_USER="saku"
APP_DIR="/opt/sakufilms"
PORT="4000"

if [[ $EUID -ne 0 ]]; then
  echo "Corré el script con sudo: sudo bash setup.sh" >&2
  exit 1
fi

step() { echo -e "\n\033[1;35m==> $*\033[0m"; }

step "Actualizando Ubuntu"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y

step "Instalando herramientas, Nginx, Certbot, fail2ban y actualizaciones automáticas"
apt-get install -y ca-certificates curl git nginx certbot python3-certbot-nginx \
  fail2ban unattended-upgrades iptables-persistent

# Actualizaciones de seguridad automáticas
dpkg-reconfigure -f noninteractive unattended-upgrades

step "Instalando Node.js 22"
if ! command -v node >/dev/null || [[ "$(node -v | cut -d. -f1)" != "v22" ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
node -v

# Los servidores chicos (1 GB de RAM) necesitan swap para instalar dependencias sin quedarse sin memoria
if [[ ! -f /swapfile ]] && (( $(free -m | awk '/Mem:/ {print $2}') < 2000 )); then
  step "Creando 2 GB de swap"
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

step "Creando el usuario $APP_USER (el backend no corre como administrador)"
id "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --shell /usr/sbin/nologin "$APP_USER"

step "Descargando el código"
if [[ -d "$APP_DIR/.git" ]]; then
  sudo -u "$APP_USER" git -C "$APP_DIR" pull --ff-only
else
  mkdir -p "$APP_DIR"
  chown "$APP_USER:$APP_USER" "$APP_DIR"
  sudo -u "$APP_USER" git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
fi

step "Instalando dependencias del backend"
sudo -u "$APP_USER" bash -c "cd '$APP_DIR/backend' && npm ci --omit=dev"
sudo -u "$APP_USER" mkdir -p "$APP_DIR/backend/uploads"

ENV_FILE="$APP_DIR/backend/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  cp "$APP_DIR/backend/.env.example" "$ENV_FILE"
  sed -i "s/^NODE_ENV=.*/NODE_ENV=production/; s/^PORT=.*/PORT=$PORT/" "$ENV_FILE"
  chown "$APP_USER:$APP_USER" "$ENV_FILE"
fi
chmod 600 "$ENV_FILE"

step "Configurando el servicio (arranca solo y se reinicia si se cae)"
cat > /etc/systemd/system/sakufilms.service <<EOF
[Unit]
Description=SAKU FILMS backend
After=network-online.target
Wants=network-online.target

[Service]
User=$APP_USER
WorkingDirectory=$APP_DIR/backend
ExecStart=/usr/bin/node src/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable sakufilms

step "Configurando Nginx para $DOMAIN"
cat > /etc/nginx/sites-available/sakufilms <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    # El panel admin sube muchas fotos a la vez (hasta 60 de 15 MB)
    client_max_body_size 300M;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        # Subir muchas fotos a Cloudinary puede tardar
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}
EOF
ln -sf /etc/nginx/sites-available/sakufilms /etc/nginx/sites-enabled/sakufilms
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

step "Abriendo los puertos 80 y 443 en el firewall de Ubuntu"
# Las imágenes de Ubuntu de Oracle traen reglas de iptables que bloquean todo salvo SSH
for p in 80 443; do
  if ! iptables -C INPUT -p tcp --dport "$p" -m state --state NEW -j ACCEPT 2>/dev/null; then
    # Se inserta antes de la regla REJECT (si existe), para que no quede bloqueado
    reject_line=$(iptables -L INPUT --line-numbers -n | awk '$2 == "REJECT" {print $1; exit}')
    if [[ -n "$reject_line" ]]; then
      iptables -I INPUT "$reject_line" -p tcp --dport "$p" -m state --state NEW -j ACCEPT
    else
      iptables -A INPUT -p tcp --dport "$p" -m state --state NEW -j ACCEPT
    fi
  fi
done
netfilter-persistent save

systemctl enable --now fail2ban

if grep -qE '^(MONGODB_URI=mongodb://127\.0\.0\.1|JWT_SECRET=$|ADMIN_PASSWORD_HASH=$)' "$ENV_FILE"; then
  echo -e "\n\033[1;33mFalta completar $ENV_FILE con tus datos (los mismos que tenías en Render).\033[0m"
  echo "  sudo nano $ENV_FILE"
  echo "Después:"
  echo "  sudo systemctl restart sakufilms"
else
  systemctl restart sakufilms
fi

echo -e "\n\033[1;32mListo.\033[0m Próximos pasos en la guía (deploy/oracle/README.md):"
echo "  1. Completar el .env (si no lo hiciste) y reiniciar el servicio"
echo "  2. Apuntar $DOMAIN a la IP de este servidor"
echo "  3. Activar HTTPS: sudo certbot --nginx -d $DOMAIN --redirect"
