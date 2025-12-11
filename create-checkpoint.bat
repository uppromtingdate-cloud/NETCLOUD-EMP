@echo off
REM create-checkpoint.bat - Crea un checkpoint (tag) en Git
REM Uso: .\create-checkpoint.bat v1.4.0 "Descripción del checkpoint"

setlocal enabledelayedexpansion

if "%~1"=="" (
    echo.
    echo [ERROR] Uso: .\create-checkpoint.bat VERSION "DESCRIPCION"
    echo.
    echo Ejemplo:
    echo   .\create-checkpoint.bat v1.4.0 "Testing validado"
    echo.
    pause
    exit /b 1
)

if "%~2"=="" (
    echo.
    echo [ERROR] Debes proporcionar una descripción
    echo.
    echo Uso: .\create-checkpoint.bat VERSION "DESCRIPCION"
    echo.
    pause
    exit /b 1
)

set VERSION=%~1
set DESCRIPTION=%~2

echo.
echo ========================================
echo  CREANDO CHECKPOINT
echo ========================================
echo.
echo Versión: %VERSION%
echo Descripción: %DESCRIPTION%
echo.

REM Verificar que Git está inicializado
if not exist ".git" (
    echo [ERROR] Repositorio Git no inicializado
    echo Ejecuta primero: .\init-git.bat
    pause
    exit /b 1
)

REM Verificar que no hay cambios sin commitear
git status --porcelain >nul
if not errorlevel 1 (
    echo [ADVERTENCIA] Hay cambios sin commitear
    echo.
    echo Opciones:
    echo 1. Commitea los cambios primero
    echo 2. Descarta los cambios (git reset --hard HEAD)
    echo.
    pause
    exit /b 1
)

REM Crear tag
git tag -a %VERSION% -m "%DESCRIPTION%"
if errorlevel 1 (
    echo [ERROR] Fallo al crear checkpoint
    pause
    exit /b 1
)

echo [OK] Checkpoint %VERSION% creado exitosamente
echo.
echo Descripción: %DESCRIPTION%
echo.
echo Para ver todos los checkpoints:
echo   git tag
echo.
echo Para volver a este checkpoint:
echo   git checkout %VERSION%
echo.

pause
