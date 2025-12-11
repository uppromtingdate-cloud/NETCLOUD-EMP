@echo off
REM init-git.bat - Inicializa repositorio Git con commits organizados

echo.
echo ========================================
echo  INICIALIZANDO GIT
echo  NETCLOUD Dashboard
echo ========================================
echo.

REM Verificar que Git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git no está instalado
    echo Descarga Git desde: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Inicializar repositorio
echo Inicializando repositorio Git...
git init
if errorlevel 1 (
    echo [ERROR] Fallo al inicializar repositorio
    pause
    exit /b 1
)

REM Configurar usuario (opcional)
echo.
echo Configurando usuario de Git...
echo.
set /p GIT_NAME="Ingresa tu nombre (ej: Juan Pérez): "
set /p GIT_EMAIL="Ingresa tu email (ej: juan@ejemplo.com): "

git config user.name "%GIT_NAME%"
git config user.email "%GIT_EMAIL%"

echo.
echo [OK] Configuración completada
echo.

REM Crear rama main
echo Creando rama main...
git checkout -b main 2>nul

REM Primer commit - Estado base
echo.
echo Creando Checkpoint v1.0.0-base...
git add .
git commit -m "v1.0.0-base: Estado base del proyecto - Arquitectura Core + Plugins, autenticación local, CRM Kanban"
if errorlevel 1 (
    echo [ERROR] Fallo al crear primer commit
    pause
    exit /b 1
)

REM Crear tag para checkpoint
git tag -a v1.0.0-base -m "Checkpoint v1.0.0-base: Estado base del proyecto"

echo [OK] Checkpoint v1.0.0-base creado

REM Crear rama develop
echo.
echo Creando rama develop...
git checkout -b develop

echo.
echo ========================================
echo [OK] Git inicializado correctamente
echo ========================================
echo.
echo Checkpoints creados:
echo - v1.0.0-base: Estado base del proyecto
echo.
echo Ramas disponibles:
echo - main (rama principal)
echo - develop (rama de desarrollo)
echo.
echo Próximos pasos:
echo 1. Edita archivos en src/
echo 2. Ejecuta: git add .
echo 3. Ejecuta: git commit -m "Descripción del cambio"
echo 4. Crea checkpoints: git tag -a vX.X.X -m "Descripción"
echo.
echo Ver historial: git log --oneline
echo Ver tags: git tag
echo.

pause
