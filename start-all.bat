@echo off
echo 🚀 Iniciando Sistema de Livraria...
echo.

REM Verificar se o PowerShell está disponível
powershell -Command "Get-Host" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PowerShell não encontrado
    pause
    exit /b 1
)

REM Executar o script PowerShell
powershell -ExecutionPolicy Bypass -File "%~dp0start-all.ps1"

pause
