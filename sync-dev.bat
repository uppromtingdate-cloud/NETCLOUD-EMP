@echo off
REM sync-dev.bat - Sincroniza cambios de src/ a dist/

echo.
echo ========================================
echo  SINCRONIZANDO src/ ^-^> dist/
echo ========================================
echo.

REM Validar que src/ existe
if not exist "src" (
    echo [ERROR] Carpeta 'src' no encontrada
    exit /b 1
)

REM Crear dist/ si no existe
if not exist "dist" (
    echo Creando carpeta dist...
    mkdir dist
)

REM Sincronizar archivos
PowerShell -Command "Copy-Item -Path 'src/*' -Destination 'dist' -Recurse -Force" 2>nul
if errorlevel 1 (
    echo [ERROR] Fallo en sincronizacion
    exit /b 1
)

echo.
echo [OK] Sincronizacion completada
echo ========================================
echo.
