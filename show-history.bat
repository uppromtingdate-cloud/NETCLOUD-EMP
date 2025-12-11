@echo off
REM show-history.bat - Muestra historial de commits y checkpoints

echo.
echo ========================================
echo  HISTORIAL DE COMMITS Y CHECKPOINTS
echo ========================================
echo.

REM Verificar que Git está inicializado
if not exist ".git" (
    echo [ERROR] Repositorio Git no inicializado
    echo Ejecuta primero: .\init-git.bat
    pause
    exit /b 1
)

echo CHECKPOINTS (Tags):
echo ==================
git tag -l
if errorlevel 1 (
    echo [Sin checkpoints aún]
)

echo.
echo HISTORIAL DE COMMITS (Últimos 10):
echo ===================================
git log --oneline -10
if errorlevel 1 (
    echo [Sin commits aún]
)

echo.
echo RAMAS DISPONIBLES:
echo ==================
git branch -a

echo.
echo ESTADO ACTUAL:
echo ==============
git status

echo.
echo COMANDOS ÚTILES:
echo ================
echo Ver todos los commits:
echo   git log --oneline
echo.
echo Ver commits con gráfico:
echo   git log --graph --oneline --all
echo.
echo Volver a un checkpoint:
echo   git checkout v1.0.0-base
echo.
echo Ver cambios sin commitear:
echo   git diff
echo.

pause
