# Script para inicializar datos en la base de datos (Windows PowerShell)
# Uso: .\init-data.ps1

$ErrorActionPreference = "Stop"

Write-Host "🔍 Esperando a que PostgreSQL esté listo..." -ForegroundColor Cyan
do {
    $ready = docker compose exec -T postgres pg_isready -U postgres 2>$null
    if (-not $ready) {
        Write-Host "   Esperando PostgreSQL..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
} while (-not $ready)
Write-Host "✅ PostgreSQL está listo" -ForegroundColor Green

Write-Host ""
Write-Host "🔍 Esperando a que el backend aplique las migraciones..." -ForegroundColor Cyan
Write-Host "   Monitoreando logs del backend..." -ForegroundColor Yellow

$timeout = 60
$counter = 0
$backendReady = $false

while ($counter -lt $timeout -and -not $backendReady) {
    $logs = docker compose logs backend 2>$null
    
    if ($logs -match "Server running on" -or $logs -match "Prisma Migrate resolved successfully") {
        Write-Host "✅ Backend ha iniciado correctamente" -ForegroundColor Green
        $backendReady = $true
        break
    }
    
    Write-Host "   Esperando migraciones... ($counter/$timeout)" -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    $counter += 2
}

if (-not $backendReady) {
    Write-Host "⚠️  Timeout esperando el backend. Continuando de todas formas..." -ForegroundColor Yellow
}

# Esperar 3 segundos adicionales para asegurar
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🔍 Verificando que las tablas existen..." -ForegroundColor Cyan
$tables = docker compose exec -T postgres psql -U postgres -d sigestei_db -c "\dt" 2>$null

if ($tables -match "roles") {
    Write-Host "✅ Tablas encontradas" -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: Las tablas no existen. Las migraciones no se aplicaron correctamente." -ForegroundColor Red
    Write-Host "   Revisa los logs del backend: docker compose logs backend" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📥 Cargando datos iniciales desde data.sql..." -ForegroundColor Cyan
try {
    Get-Content "sigestei-backend/src/db/data.sql" | docker compose exec -T postgres psql -U postgres -d sigestei_db
    Write-Host "✅ Datos cargados exitosamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 ¡Inicialización completa!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Puedes verificar los datos con:" -ForegroundColor Cyan
    Write-Host "  docker compose exec postgres psql -U postgres -d sigestei_db -c 'SELECT * FROM roles;'" -ForegroundColor Yellow
} catch {
    Write-Host "❌ ERROR: Falló la carga de datos" -ForegroundColor Red
    Write-Host "   Verifica el archivo sigestei-backend/src/db/data.sql" -ForegroundColor Yellow
    exit 1
}
