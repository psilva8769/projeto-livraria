# Script para executar todas as aplicações da livraria
# Execute este script a partir da raiz do projeto

Write-Host "🚀 Iniciando Sistema de Livraria..." -ForegroundColor Green
Write-Host ""

# Função para verificar se uma porta está em uso
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Verificar se o MongoDB está rodando
Write-Host "🔍 Verificando MongoDB..." -ForegroundColor Yellow
$mongoRunning = Test-Port -Port 27017
if (-not $mongoRunning) {
    Write-Host "❌ MongoDB não está rodando na porta 27017" -ForegroundColor Red
    Write-Host "   Inicie o MongoDB antes de continuar:" -ForegroundColor Yellow
    Write-Host "   - Windows: net start MongoDB" -ForegroundColor White
    Write-Host "   - Ou inicie o MongoDB Compass" -ForegroundColor White
    Write-Host ""
    Read-Host "Pressione Enter após iniciar o MongoDB"
}
else {
    Write-Host "✅ MongoDB está rodando" -ForegroundColor Green
}

# Verificar se as dependências estão instaladas
Write-Host ""
Write-Host "📦 Verificando dependências..." -ForegroundColor Yellow

$folders = @("backend", "frontend", "admin", "e2e")
foreach ($folder in $folders) {
    if (Test-Path "$folder/node_modules") {
        Write-Host "✅ Dependências do $folder instaladas" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Dependências do $folder não instaladas" -ForegroundColor Red
        Write-Host "   Instalando dependências do $folder..." -ForegroundColor Yellow
        Set-Location $folder
        npm install
        Set-Location ..
        Write-Host "✅ Dependências do $folder instaladas" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🚀 Iniciando aplicações..." -ForegroundColor Green
Write-Host ""

# Iniciar Backend
Write-Host "🔧 Iniciando Backend (porta 4000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run server" -WindowStyle Normal

Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "🌐 Iniciando Frontend (porta 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 2

# Iniciar Admin
Write-Host "👨‍💼 Iniciando Admin (porta 5174)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\admin'; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "🎉 Todas as aplicações foram iniciadas!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 URLs das aplicações:" -ForegroundColor Yellow
Write-Host "   Frontend (Cliente): http://localhost:5173" -ForegroundColor White
Write-Host "   Admin (Painel):     http://localhost:5174" -ForegroundColor White
Write-Host "   Backend (API):      http://localhost:4000" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Para parar as aplicações, feche as janelas do PowerShell abertas" -ForegroundColor Yellow
Write-Host ""
Read-Host "Pressione Enter para sair"
