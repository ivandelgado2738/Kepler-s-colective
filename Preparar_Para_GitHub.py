import pathlib
import re
import shutil

BASE_DIR = pathlib.Path(__file__).resolve().parent
DOCS_DIR = BASE_DIR / 'docs'


def extraer_body_actual(html_text: str) -> str:
    m = re.search(r'<body[^>]*>\s*(.*?)\s*<script>', html_text, flags=re.DOTALL | re.IGNORECASE)
    if not m:
        raise RuntimeError('No se pudo localizar el bloque <body>...<script> dentro de index.html')
    return m.group(1).strip()


def ensamblar_index_html() -> str:
    css = (BASE_DIR / 'style.css').read_text(encoding='utf-8')
    js = (BASE_DIR / 'app.js').read_text(encoding='utf-8')
    if '</script>' in js.lower():
        raise RuntimeError('app.js contiene </script> literal y rompería el HTML embebido.')

    index_actual = (BASE_DIR / 'index.html').read_text(encoding='utf-8')
    body = extraer_body_actual(index_actual)

    html = (
        '<!DOCTYPE html>\n'
        '<html lang="es">\n'
        '<head>\n'
        '  <meta charset="UTF-8" />\n'
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n'
        '  <title>NASA LunarBooking • eDreams Polo Sur Lunar (Niño / Intermedio / Avanzado + Esféricas)</title>\n'
        '  <link rel="preconnect" href="https://fonts.googleapis.com" />\n'
        '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n'
        '  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />\n'
        '  <link rel="stylesheet" href="style.css" />\n'
        '  <style>\n'
        f'{css}\n'
        '  </style>\n'
        '</head>\n'
        '<body class="nivel-estandar">\n'
        f'{body}\n'
        '  <script>\n'
        f'{js}\n'
        '  </script>\n'
        '</body>\n'
        '</html>\n'
    )
    (BASE_DIR / 'index.html').write_text(html, encoding='utf-8')
    return html


def preparar_gitignore_y_readme():
    gitignore_path = BASE_DIR / '.gitignore'
    gitignore_content = (
        '# Binarios compilados y temporales locales\n'
        '*.exe\n'
        '*.o\n'
        '*.obj\n'
        '*.pdb\n'
        '__pycache__/\n'
        '.vscode/\n'
    )
    gitignore_path.write_text(gitignore_content, encoding='utf-8')

    # Archivo marcador para evitar que Jekyll oculte recursos estáticos en GitHub Pages
    (BASE_DIR / '.nojekyll').write_text('', encoding='utf-8')

    readme_path = BASE_DIR / 'README.md'
    readme_content = (
        '# NASA LunarBooking & eDreams Artemis (Polo Sur Lunar 84°S–90°S)\n\n'
        'Planificador visual de misiones lunares al **Polo Sur de la Luna** con motor físico en **C++17** '
        'y versión web pública automática para **GitHub Pages**.\n\n'
        '## Cómo publicar para que todo el mundo acceda con un enlace (GitHub Pages)\n'
        '1. Ejecuta `Convertir_Para_GitHub.bat` (o `python Preparar_Para_GitHub.py`).\n'
        '2. Sube el proyecto completo a tu repositorio de GitHub (`git push`).\n'
        '3. En GitHub ve a **Settings → Pages → Build and deployment**:\n'
        '   - **Source**: `Deploy from a branch`\n'
        '   - **Branch**: `main` y carpeta **`/docs`** (o **`/ (root)`**, ambos funcionan).\n'
        '4. En ~1 minuto tendrás tu enlace público `https://<tu-usuario>.github.io/<tu-repositorio>/`.\n\n'
        '> En el enlace público de GitHub Pages la web detecta automáticamente el entorno estático y ejecuta '
        'el motor espejo en JavaScript sin errores ni esperas de red.\n\n'
        '## Ejecución local con el Motor Nativo C++17\n'
        '```bash\n'
        'g++ -std=c++17 -O2 -static servidor_lunar_booking.cpp -o servidor_lunar_booking.exe -lws2_32 -pthread\n'
        './servidor_lunar_booking.exe\n'
        '```\n'
        'Después abre `http://127.0.0.1:8085/index.html`.\n\n'
        '## Documentación e Integración de Datos Reales\n'
        '- [DOCUMENTACION_CODIGO_Y_FUNCIONES_NASA_LUNAR.pdf](DOCUMENTACION_CODIGO_Y_FUNCIONES_NASA_LUNAR.pdf)\n'
        '- [POSICIONES_LLAMADA_DATOS.txt](POSICIONES_LLAMADA_DATOS.txt)\n'
    )
    readme_path.write_text(readme_content, encoding='utf-8')


def exportar_carpeta_docs():
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    img_dst = DOCS_DIR / 'img'
    img_dst.mkdir(parents=True, exist_ok=True)

    for nombre in ('index.html', 'style.css', 'app.js', 'DOCUMENTACION_CODIGO_Y_FUNCIONES_NASA_LUNAR.pdf'):
        src = BASE_DIR / nombre
        if src.exists():
            shutil.copy2(src, DOCS_DIR / nombre)

    img_src = BASE_DIR / 'img'
    if img_src.exists():
        for item in img_src.iterdir():
            if item.is_file():
                shutil.copy2(item, img_dst / item.name)

    (DOCS_DIR / '.nojekyll').write_text('', encoding='utf-8')

    # Verificación de rutas relativas en index.html
    html = (DOCS_DIR / 'index.html').read_text(encoding='utf-8')
    imgs_referenciadas = set(re.findall(r'img/[A-Za-z0-9_.\-]+', html))
    faltantes = [p for p in sorted(imgs_referenciadas) if not (DOCS_DIR / p).exists()]
    print('Carpeta docs/ generada en:', DOCS_DIR)
    print('Archivos totales en docs/:', sum(1 for _ in DOCS_DIR.rglob('*') if _.is_file()))
    print('Imagenes referenciadas:', len(imgs_referenciadas), '| Faltantes:', len(faltantes))
    if faltantes:
        raise RuntimeError(f'Faltan imagenes en docs/: {faltantes}')


if __name__ == '__main__':
    ensamblar_index_html()
    preparar_gitignore_y_readme()
    exportar_carpeta_docs()
    print('CONVERSION PARA GITHUB COMPLETADA CON EXITO.')
