#!/bin/bash

# Script para inicializar datos en la base de datos
# Uso: ./init-data.sh

set -e

echo "🔍 Esperando a que PostgreSQL esté listo..."
until docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
  echo "   Esperando PostgreSQL..."
  sleep 2
done
echo "✅ PostgreSQL está listo"

echo ""
echo "🔍 Esperando a que el backend aplique las migraciones..."
echo "   Monitoreando logs del backend..."

# Esperar hasta ver el mensaje de que el servidor está corriendo
timeout=60
counter=0
while [ $counter -lt $timeout ]; do
  if docker compose logs backend 2>/dev/null | grep -q "Server running on"; then
    echo "✅ Backend ha iniciado correctamente"
    break
  fi
  
  if docker compose logs backend 2>/dev/null | grep -q "Prisma Migrate resolved successfully"; then
    echo "✅ Migraciones aplicadas correctamente"
    break
  fi
  
  echo "   Esperando migraciones... ($counter/$timeout)"
  sleep 2
  counter=$((counter + 2))
done

if [ $counter -ge $timeout ]; then
  echo "⚠️  Timeout esperando el backend. Continuando de todas formas..."
fi

# Esperar 3 segundos adicionales para asegurar
sleep 3

echo ""
echo "🔍 Verificando que las tablas existen..."
if docker compose exec -T postgres psql -U postgres -d sigestei_db -c "\dt" 2>/dev/null | grep -q "roles"; then
  echo "✅ Tablas encontradas"
else
  echo "❌ ERROR: Las tablas no existen. Las migraciones no se aplicaron correctamente."
  echo "   Revisa los logs del backend: docker compose logs backend"
  exit 1
fi

echo ""
echo "📥 Cargando datos iniciales desde data.sql..."
if docker compose exec -T postgres psql -U postgres -d sigestei_db < sigestei-backend/src/db/data.sql; then
  echo "✅ Datos cargados exitosamente"
  echo ""
  echo "🎉 ¡Inicialización completa!"
  echo ""
  echo "Puedes verificar los datos con:"
  echo "  docker compose exec postgres psql -U postgres -d sigestei_db -c 'SELECT * FROM roles;'"
else
  echo "❌ ERROR: Falló la carga de datos"
  echo "   Verifica el archivo sigestei-backend/src/db/data.sql"
  exit 1
fi
