@echo off
REM run-dev.bat - Inicia el servidor de desarrollo
REM Uso: .\run-dev.bat [puerto]
REM Ejemplo: .\run-dev.bat 8001

setlocal enabledelayedexpansion

echo.
echo ========================================
echo  DASHBOARD ADMINISTRATIVO
echo  Servidor de Desarrollo
echo ========================================
echo.

REM Validar que dist/ existe
if not exist "dist" (
    echo [ERROR] Carpeta 'dist' no encontrada
    echo Creando carpeta dist...
    mkdir dist
)

REM Sincronizar archivos
echo Sincronizando archivos src/ ^-^> dist/...
call sync-dev.bat
if errorlevel 1 (
    echo [ERROR] Fallo en sincronizacion
    pause
    exit /b 1
)

REM Determinar puerto
set PORT=8000
if not "%~1"=="" set PORT=%~1

REM Verificar que Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no está instalado o no está en PATH
    echo Descarga Python desde: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo.
echo [OK] Sincronizacion completada
echo.
echo Iniciando servidor en http://localhost:%PORT%
echo Presiona Ctrl+C para detener
echo.

cd dist
python -m http.server %PORT%

pause
