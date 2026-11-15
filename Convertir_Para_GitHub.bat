@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================================================
echo   SUBIR PROYECTO A REPOSITORIO GITHUB EXISTENTE (SOLO TU BRANCH / RAMA)
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
    echo [AVISO] Git no esta instalado en PATH. Sube la carpeta "docs" manualmente a tu rama en GitHub.
    pause
    exit /b 0
)

if not exist ".git" (
    echo [INFO] Inicializando repositorio Git local...
    git init
)

echo.
set /p RAMA_OBJETIVO="Escribe el nombre de TU branch (ej. izanc / feature-lunar): "
if "%RAMA_OBJETIVO%"=="" set "RAMA_OBJETIVO=mi-branch-lunar"

git checkout -B "%RAMA_OBJETIVO%"
if errorlevel 1 (
    echo [ERROR] No se pudo cambiar o crear la rama "%RAMA_OBJETIVO%".
    pause
    exit /b 1
)

git add .
git status -s
echo.

set /p HACER_COMMIT="Deseas guardar los cambios en un commit ahora? (S/N): "
if /I "%HACER_COMMIT%"=="S" (
    git commit -m "Subir NASA LunarBooking Polo Sur en rama %RAMA_OBJETIVO%"
)

echo.
set "URL_ACTUAL="
for /f "delims=" %%i in ('git remote get-url origin 2^>nul') do set "URL_ACTUAL=%%i"

if "%URL_ACTUAL%"=="" (
    set /p URL_REPO="Pega aqui el enlace HTTPS del repositorio GitHub ya creado: "
) else (
    echo Remoto actual configurado: %URL_ACTUAL%
    set /p CAMBIAR_URL="Quieres pegar otro enlace de repositorio? Dejalo vacio para usar el actual: "
    if "%CAMBIAR_URL%"=="" (
        set "URL_REPO=%URL_ACTUAL%"
    ) else (
        set "URL_REPO=%CAMBIAR_URL%"
    )
)

if not "%URL_REPO%"=="" (
    if "%URL_ACTUAL%"=="" (
        git remote add origin "%URL_REPO%"
    ) else (
        git remote set-url origin "%URL_REPO%"
    )

    echo.
    set /p HACER_PUSH="Subir ahora UNICAMENTE a la rama '%RAMA_OBJETIVO%'? (S/N): "
    if /I "%HACER_PUSH%"=="S" (
        echo [INFO] Subiendo solo a origin/%RAMA_OBJETIVO%...
        git push -u origin "%RAMA_OBJETIVO%"
        if errorlevel 1 (
            echo.
            echo [AVISO] Si esa rama ya existia en GitHub con archivos previos, puedes traer primero sus cambios o usar un nombre de branch nuevo.
        ) else (
            echo.
            echo [OK] Subido correctamente UNICAMENTE a la rama "%RAMA_OBJETIVO%".
            echo Para compartir la web publica: en GitHub - Settings - Pages - Branch: %RAMA_OBJETIVO% - carpeta /docs
        )
    )
) else (
    echo [AVISO] No se introdujo enlace de repositorio. No se realizo push.
)

pause
