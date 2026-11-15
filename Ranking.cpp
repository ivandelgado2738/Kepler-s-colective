int main(){
    from datetime import datetime


def buscar_rango_maxima_media(datos, n_objetivo, margen=0, intervalos_excluidos=None):
    datos_ord = sorted(datos, key=lambda d: d[0])
    m = len(datos_ord)

    if m == 0:
        return None

    if intervalos_excluidos is None:
        intervalos_excluidos = set()

    min_len = max(1, n_objetivo - margen)
    max_len = min(m, n_objetivo + margen)

    pref = [0.0] * (m + 1)
    for k in range(m):
        pref[k + 1] = pref[k] + float(datos_ord[k][1])

    mejor_media = float("-inf")
    mejor_rango = None

    for i in range(m - min_len + 1):
        for tam in range(min_len, max_len + 1):
            j = i + tam
            if j > m:
                break

            indice_fin = j - 1
            if (i, indice_fin) in intervalos_excluidos:
                continue

            media = (pref[j] - pref[i]) / tam
            if media > mejor_media:
                mejor_media = media
                mejor_rango = {
                    "fecha_inicio": datos_ord[i][0],
                    "fecha_fin": datos_ord[indice_fin][0],
                    "num_datos": tam,
                    "media_maxima": media,
                    "indice_inicio": i,
                    "indice_fin": indice_fin,
                    "i": i,
                    "j": indice_fin,
                }

    return mejor_rango


def buscar_top_20_rangos(datos, n_objetivo, margen=0, top_n=20):
    mejores = []
    usados = set()

    for _ in range(top_n):
        mejor = buscar_rango_maxima_media(datos, n_objetivo, margen, usados)
        if mejor is None:
            break
        mejores.append(mejor)
        usados.add((mejor["indice_inicio"], mejor["indice_fin"]))

    return mejores
}