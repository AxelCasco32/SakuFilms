#!/usr/bin/env bash
# Publica en el servidor los últimos cambios del backend (lo que antes Render hacía solo).
#
# Uso, desde el servidor:
#   sudo bash /opt/sakufilms/deploy/oracle/update.sh
set -euo pipefail

APP_USER="saku"
APP_DIR="/opt/sakufilms"

if [[ $EUID -ne 0 ]]; then
  echo "Corré el script con sudo: sudo bash $0" >&2
  exit 1
fi

echo "==> Bajando cambios"
sudo -u "$APP_USER" git -C "$APP_DIR" pull --ff-only

echo "==> Instalando dependencias"
sudo -u "$APP_USER" bash -c "cd '$APP_DIR/backend' && npm ci --omit=dev"

echo "==> Reiniciando el backend"
systemctl restart sakufilms

# Espera a que responda
for _ in $(seq 1 15); do
  if curl -fsS http://127.0.0.1:4000/api/health >/dev/null 2>&1; then
    echo "Backend funcionando ✓"
    exit 0
  fi
  sleep 2
done

echo "El backend no respondió. Revisá los logs con:  sudo journalctl -u sakufilms -n 50" >&2
exit 1
