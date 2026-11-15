@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================================================
echo   CONVERTIDOR Y PREPARADOR PARA GITHUB PAGES - NASA LUNARBOOKING (POLO SUR)
echo ============================================================================
echo.

python Preparar_Para_GitHub.py
if errorlevel 1 (
    echo [ERROR] Fallo al ejecutar Preparar_Para_GitHub.py
    pause
    exit /b 1
)

echo.
where git >nul 2>&1
if errorlevel 1 (
    echo [AVISO] Git no esta instalado en PATH. Sube la carpeta "docs" o todo el proyecto manualmente a GitHub.
    pause
    exit /b 0
)

if not exist ".git" (
    echo [INFO] Inicializando repositorio Git local en rama main...
    git init -b main
)

git add .
git status -s
echo.
set /p HACER_COMMIT="Deseas crear un commit automatico ahora? (S/N): "
if /I "%HACER_COMMIT%"=="S" (
    git commit -m "Actualizar NASA LunarBooking Polo Sur listo para GitHub Pages"
)

echo.
git remote -v | findstr "origin" >nul
if errorlevel 1 (
    echo ----------------------------------------------------------------------------
    echo PASOS FINALES PARA SUBIR A TU GITHUB Y OBTENER ENLACE PUBLICO:
    echo   1. Crea un repositorio publico vacio en https://github.com/new
    echo   2. Ejecuta en esta carpeta:
    echo        git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
    echo        git push -u origin main
    echo   3. En GitHub: Settings / Pages / Deploy from branch: main / carpeta /docs
    echo   4. En ~1 minuto tendras tu web publica para compartir con cualquier persona.
    echo ----------------------------------------------------------------------------
) else (
    set /p HACER_PUSH="Ya existe remoto origin. Deseas hacer git push ahora? (S/N): "
    if /I "%HACER_PUSH%"=="S" (
        git push
    )
)

pause
