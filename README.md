# NASA LunarBooking & eDreams Artemis (Polo Sur Lunar 84°S–90°S)

Planificador visual de misiones lunares al **Polo Sur de la Luna** con motor físico en **C++17** y versión web pública automática para **GitHub Pages**.

## Cómo publicar para que todo el mundo acceda con un enlace (GitHub Pages)
1. Ejecuta `Convertir_Para_GitHub.bat` (o `python Preparar_Para_GitHub.py`).
2. Sube el proyecto completo a tu repositorio de GitHub (`git push`).
3. En GitHub ve a **Settings → Pages → Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` y carpeta **`/docs`** (o **`/ (root)`**, ambos funcionan).
4. En ~1 minuto tendrás tu enlace público `https://<tu-usuario>.github.io/<tu-repositorio>/`.

> En el enlace público de GitHub Pages la web detecta automáticamente el entorno estático y ejecuta el motor espejo en JavaScript sin errores ni esperas de red.

## Ejecución local con el Motor Nativo C++17
```bash
g++ -std=c++17 -O2 -static servidor_lunar_booking.cpp -o servidor_lunar_booking.exe -lws2_32 -pthread
./servidor_lunar_booking.exe
```
Después abre `http://127.0.0.1:8085/index.html`.

## Documentación e Integración de Datos Reales
- [DOCUMENTACION_CODIGO_Y_FUNCIONES_NASA_LUNAR.pdf](DOCUMENTACION_CODIGO_Y_FUNCIONES_NASA_LUNAR.pdf)
- [POSICIONES_LLAMADA_DATOS.txt](POSICIONES_LLAMADA_DATOS.txt)
