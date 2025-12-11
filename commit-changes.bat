@echo off
REM commit-changes.bat - Sincroniza cambios y crea commit
REM Uso: .\commit-changes.bat "Descripción del cambio"

setlocal enabledelayedexpansion

if "%~1"=="" (
    echo.
    echo [ERROR] Debes proporcionar una descripción del commit
    echo.
    echo Uso: .\commit-changes.bat "Descripción del cambio"
    echo.
    echo Ejemplo:
    echo   .\commit-changes.bat "Agregar validación en login"
    echo.
    pause
    exit /b 1
)

set COMMIT_MSG=%~1

echo.
echo ========================================
echo  SINCRONIZANDO Y COMMITEANDO CAMBIOS
echo ========================================
echo.

REM Sincronizar cambios
echo Sincronizando archivos src/ ^-^> dist/...
call sync-dev.bat
if errorlevel 1 (
    echo [ERROR] Fallo en sincronización
    pause
    exit /b 1
)

echo.
echo Agregando cambios a Git...
git add .

echo.
echo Estado actual:
git status

echo.
echo Creando commit...
echo Mensaje: %COMMIT_MSG%
echo.

git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
    echo [ERROR] Fallo al crear commit
    echo Posible causa: No hay cambios para commitear
    pause
    exit /b 1
)

echo.
echo [OK] Commit creado exitosamente
echo.
echo Historial reciente:
git log --oneline -5
echo.

pause
