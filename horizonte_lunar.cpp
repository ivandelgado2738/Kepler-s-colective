// horizonte_lunar.cpp - Kepler's Collective (NASA Space Apps 2026)
//
// Calcula la silueta del horizonte de un sitio del polo sur lunar a partir de
// los mapas de alturas de LOLA y, con ella, dice si el Sol o la Tierra se ven.
// Misma logica y mismos convenios que horizonte_lunar.py.
//
// Convenios:
//   - Marco MOON_ME, Luna esferica de radio R = 1 737 400 m.
//   - Acimut: 0 = norte, 90 = este. Elevacion: sobre el plano horizontal local.
//
// Compilar leyendo GeoTIFF directamente (necesita GDAL):
//   g++ -O2 -std=c++17 -DCON_GDAL horizonte_lunar.cpp -o horizonte $(gdal-config --cflags --libs)
// Compilar sin dependencias (lee .bin + .hdr, ver leer_bin mas abajo):
//   g++ -O2 -std=c++17 horizonte_lunar.cpp -o horizonte
//
// Uso:
//   ./horizonte --lat -89.45 --lon 222.8 --lejos LDEM_80S_80MPP_ADJ.TIF
//               [--cerca ldem_87s_5mpp.tif] [--h 2.0] [--naz 720] [--salida horizonte.json]

#include <algorithm>
#include <array>
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <fstream>
#include <limits>
#include <stdexcept>
#include <string>
#include <vector>

#ifdef CON_GDAL
#include "gdal_priv.h"
#endif

namespace luna {

constexpr double R = 1737400.0;  // m
constexpr double PI = 3.14159265358979323846;
constexpr double GRAD = PI / 180.0;
const double NaN = std::numeric_limits<double>::quiet_NaN();

using Vec3 = std::array<double, 3>;
inline double dot(const Vec3& a, const Vec3& b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
inline double norma(const Vec3& a) { return std::sqrt(dot(a, a)); }
inline Vec3 comb(double a, const Vec3& u, double b, const Vec3& v) {
    return {a * u[0] + b * v[0], a * u[1] + b * v[1], a * u[2] + b * v[2]};
}

// ------------------------------------------------------------ geometria
// Lat/lon (grados) -> X/Y estereografica polar sur (m), como los TIF de LOLA.
inline void latlon_a_xy(double lat, double lon, double& x, double& y) {
    double r = 2 * R * std::tan((90.0 + lat) * GRAD / 2);
    x = r * std::sin(lon * GRAD);
    y = r * std::cos(lon * GRAD);
}

// Vector unitario MOON_ME -> X/Y estereografica polar sur (m).
inline void unitario_a_xy(const Vec3& p, double& x, double& y) {
    double lat = std::asin(std::clamp(p[2], -1.0, 1.0)) / GRAD;
    double lon = std::atan2(p[1], p[0]) / GRAD;
    latlon_a_xy(lat, lon, x, y);
}

struct BaseLocal { Vec3 arriba, este, norte; };

inline BaseLocal base_local(double lat, double lon) {
    double la = lat * GRAD, lo = lon * GRAD;
    BaseLocal b;
    b.arriba = {std::cos(la) * std::cos(lo), std::cos(la) * std::sin(lo), std::sin(la)};
    b.este = {-std::sin(lo), std::cos(lo), 0.0};
    b.norte = {b.arriba[1] * b.este[2] - b.arriba[2] * b.este[1],
               b.arriba[2] * b.este[0] - b.arriba[0] * b.este[2],
               b.arriba[0] * b.este[1] - b.arriba[1] * b.este[0]};
    return b;
}

// ------------------------------------------------------------ mapas
// Cuadricula de alturas (m) en X/Y estereografica. Fila 0 = Y maxima.
struct Mapa {
    std::vector<float> z;
    int ancho = 0, alto = 0;
    double x_izq = 0, y_sup = 0, res = 1;

    // Altura interpolada (bilineal). NaN fuera del mapa o junto a un hueco.
    double altura(double x, double y) const {
        double col = (x - x_izq) / res - 0.5, fil = (y_sup - y) / res - 0.5;
        if (col < 0 || fil < 0 || col > ancho - 1 || fil > alto - 1) return NaN;
        int c0 = std::min((int)col, ancho - 2), f0 = std::min((int)fil, alto - 2);
        if (ancho < 2 || alto < 2) return NaN;
        double fc = col - c0, ff = fil - f0;
        auto v = [&](int f, int c) { return (double)z[(size_t)f * ancho + c]; };
        return (1 - ff) * ((1 - fc) * v(f0, c0) + fc * v(f0, c0 + 1)) +
               ff * ((1 - fc) * v(f0 + 1, c0) + fc * v(f0 + 1, c0 + 1));
    }
};

// Ventana de lectura: todo el mapa, o un cuadrado de +-semilado (m) en torno a (cx, cy).
struct Ventana { int c0, f0, nc, nf; };

inline Ventana ventana(int W, int H, double x_izq, double y_sup, double res,
                       bool recortar, double cx, double cy, double semilado) {
    if (!recortar) return {0, 0, W, H};
    int c0 = std::max((int)((cx - semilado - x_izq) / res), 0);
    int f0 = std::max((int)((y_sup - (cy + semilado)) / res), 0);
    int nc = std::min((int)(2 * semilado / res), W - c0);
    int nf = std::min((int)(2 * semilado / res), H - f0);
    if (nc <= 0 || nf <= 0) throw std::runtime_error("El sitio cae fuera del mapa");
    return {c0, f0, nc, nf};
}

// Formato sin dependencias: <ruta>.bin con float32 little-endian fila a fila, y
// <ruta>.hdr de texto con:  ancho alto x_izq y_sup res [nodata]
// (se genera desde el TIF con:  gdal_translate -of ENVI -ot Float32 mapa.tif mapa.bin
//  y escribiendo el .hdr a mano con los datos de gdalinfo, o con el conversor de Python)
inline Mapa leer_bin(const std::string& ruta, bool recortar, double cx, double cy, double semilado) {
    std::string base = ruta.substr(0, ruta.size() - 4);
    std::ifstream h(base + ".hdr");
    if (!h) throw std::runtime_error("No encuentro " + base + ".hdr");
    int W, H; double x_izq, y_sup, res, nodata = -1e38; bool hay_nodata = false;
    h >> W >> H >> x_izq >> y_sup >> res;
    if (h >> nodata) hay_nodata = true;
    Ventana v = ventana(W, H, x_izq, y_sup, res, recortar, cx, cy, semilado);
    Mapa m; m.ancho = v.nc; m.alto = v.nf; m.res = res;
    m.x_izq = x_izq + v.c0 * res; m.y_sup = y_sup - v.f0 * res;
    m.z.resize((size_t)v.nc * v.nf);
    std::ifstream f(ruta, std::ios::binary);
    if (!f) throw std::runtime_error("No puedo abrir " + ruta);
    for (int i = 0; i < v.nf; ++i) {
        f.seekg(((std::streamoff)(v.f0 + i) * W + v.c0) * 4);
        f.read((char*)&m.z[(size_t)i * v.nc], (std::streamsize)v.nc * 4);
    }
    if (!f) throw std::runtime_error("Lectura incompleta de " + ruta);
    if (hay_nodata) for (auto& a : m.z) if (a == (float)nodata) a = std::numeric_limits<float>::quiet_NaN();
    return m;
}

#ifdef CON_GDAL
inline Mapa leer_tif(const std::string& ruta, bool recortar, double cx, double cy, double semilado) {
    GDALAllRegister();
    GDALDataset* ds = (GDALDataset*)GDALOpen(ruta.c_str(), GA_ReadOnly);
    if (!ds) throw std::runtime_error("No puedo abrir " + ruta);
    double gt[6]; ds->GetGeoTransform(gt);
    double res = gt[1];
    Ventana v = ventana(ds->GetRasterXSize(), ds->GetRasterYSize(), gt[0], gt[3], res, recortar, cx, cy, semilado);
    Mapa m; m.ancho = v.nc; m.alto = v.nf; m.res = res;
    m.x_izq = gt[0] + v.c0 * res; m.y_sup = gt[3] - v.f0 * res;
    m.z.resize((size_t)v.nc * v.nf);
    GDALRasterBand* b = ds->GetRasterBand(1);
    if (b->RasterIO(GF_Read, v.c0, v.f0, v.nc, v.nf, m.z.data(), v.nc, v.nf, GDT_Float32, 0, 0) != CE_None)
        throw std::runtime_error("Error leyendo " + ruta);
    int hay = 0; double nodata = b->GetNoDataValue(&hay);
    double escala = b->GetScale(), offset = b->GetOffset();
    for (auto& a : m.z) {
        if (hay && a == (float)nodata) a = std::numeric_limits<float>::quiet_NaN();
        else a = (float)(a * escala + offset);
    }
    GDALClose(ds);
    return m;
}
#endif

inline Mapa leer_mapa(const std::string& ruta, bool recortar = false, double cx = 0, double cy = 0, double semilado = 0) {
    if (ruta.size() > 4 && ruta.substr(ruta.size() - 4) == ".bin") return leer_bin(ruta, recortar, cx, cy, semilado);
#ifdef CON_GDAL
    return leer_tif(ruta, recortar, cx, cy, semilado);
#else
    throw std::runtime_error("Compilado sin GDAL: pasa un .bin o recompila con -DCON_GDAL");
#endif
}

// ------------------------------------------------------------ horizonte
// Muestras a lo largo de cada direccion: juntas cerca, separadas lejos.
inline std::vector<double> distancias(double paso_min, double d_max, double crecimiento = 0.003) {
    std::vector<double> d{paso_min};
    while (d.back() < d_max) d.push_back(d.back() + std::max(paso_min, crecimiento * d.back()));
    return d;
}

struct Horizonte {
    std::vector<double> az, elev;  // grados
    double z0 = 0;                 // altura del suelo en el sitio (m)
};

// Para cada direccion, la elevacion mas alta a la que llega el terreno visto
// desde el sitio. Geometria exacta en 3D: la curvatura de la Luna va incluida.
inline Horizonte perfil_horizonte(double lat, double lon, const Mapa& lejos, const Mapa* cerca = nullptr,
                                  double h_obs = 2.0, int n_az = 720,
                                  double d_max = 300000.0, double d_cerca = 15000.0) {
    BaseLocal b = base_local(lat, lon);
    double x0, y0; latlon_a_xy(lat, lon, x0, y0);
    Horizonte H;
    H.z0 = (cerca ? *cerca : lejos).altura(x0, y0);
    if (std::isnan(H.z0)) throw std::runtime_error("El sitio cae fuera del mapa");
    double rS = R + H.z0 + h_obs;  // el ojo del observador esta en rS * arriba

    std::vector<double> d = distancias(cerca ? cerca->res : lejos.res, d_max);
    H.az.resize(n_az); H.elev.resize(n_az);
    for (int i = 0; i < n_az; ++i) {
        H.az[i] = i * 360.0 / n_az;
        double a = H.az[i] * GRAD;
        Vec3 dir = comb(std::cos(a), b.norte, std::sin(a), b.este);
        double mejor = -1e9;
        for (double dist : d) {
            double th = dist / R;
            Vec3 p = comb(std::cos(th), b.arriba, std::sin(th), dir);
            double x, y; unitario_a_xy(p, x, y);
            double z = NaN;
            if (cerca && dist <= d_cerca) z = cerca->altura(x, y);
            if (std::isnan(z)) z = lejos.altura(x, y);
            if (std::isnan(z)) continue;
            Vec3 P = comb(R + z, p, -rS, b.arriba);
            mejor = std::max(mejor, std::asin(dot(P, b.arriba) / norma(P)) / GRAD);
        }
        H.elev[i] = mejor;
    }
    return H;
}

// ------------------------------------------------------------ visibilidad
// Posicion de un astro en MOON_ME respecto al CENTRO de la Luna (m) -> acimut y
// elevacion (grados) vistos desde el sitio (corrige el paralaje).
inline void acimut_elevacion(const Vec3& vec_me, double lat, double lon, double z0, double h_obs,
                             double& az, double& el) {
    BaseLocal b = base_local(lat, lon);
    Vec3 v = comb(1.0, vec_me, -(R + z0 + h_obs), b.arriba);
    double n = norma(v);
    el = std::asin(dot(v, b.arriba) / n) / GRAD;
    az = std::fmod(std::atan2(dot(v, b.este), dot(v, b.norte)) / GRAD + 360.0, 360.0);
}

// Altura del horizonte en un acimut cualquiera (interpolacion circular).
inline double horizonte_en(const Horizonte& H, double az) {
    int n = (int)H.az.size();
    double pos = std::fmod(std::fmod(az, 360.0) + 360.0, 360.0) * n / 360.0;
    int i = (int)pos % n, j = (i + 1) % n;
    double f = pos - std::floor(pos);
    return (1 - f) * H.elev[i] + f * H.elev[j];
}

// Fraccion del disco del astro por encima del horizonte (0 a 1).
// semidiametro en grados: Sol ~0.266, Tierra ~0.95, 0 = tratarlo como un punto.
inline double fraccion_visible(double az_astro, double el_astro, const Horizonte& H, double semidiametro = 0.0) {
    double dif = el_astro - horizonte_en(H, az_astro);
    if (semidiametro <= 0) return dif > 0 ? 1.0 : 0.0;
    double u = std::clamp(dif / semidiametro, -1.0, 1.0);
    return (std::acos(-u) + u * std::sqrt(1 - u * u)) / PI;
}

}  // namespace luna

// ---------------------------------------------------------------- principal
#ifndef HORIZONTE_SIN_MAIN
int main(int argc, char** argv) {
    double lat = NAN, lon = NAN, h = 2.0;
    int naz = 720;
    std::string lejos_r, cerca_r, salida = "horizonte.json";
    for (int i = 1; i + 1 < argc; i += 2) {
        std::string k = argv[i], v = argv[i + 1];
        if (k == "--lat") lat = std::stod(v);
        else if (k == "--lon") lon = std::stod(v);
        else if (k == "--h") h = std::stod(v);
        else if (k == "--naz") naz = std::stoi(v);
        else if (k == "--lejos") lejos_r = v;
        else if (k == "--cerca") cerca_r = v;
        else if (k == "--salida") salida = v;
        else { std::fprintf(stderr, "Opcion desconocida: %s\n", k.c_str()); return 2; }
    }
    if (std::isnan(lat) || std::isnan(lon) || lejos_r.empty()) {
        std::fprintf(stderr, "Uso: %s --lat L --lon L --lejos MAPA [--cerca MAPA] [--h 2] [--naz 720] [--salida f.json]\n", argv[0]);
        return 2;
    }
    try {
        double x0, y0; luna::latlon_a_xy(lat, lon, x0, y0);
        luna::Mapa lejos = luna::leer_mapa(lejos_r);
        luna::Mapa cerca;
        bool hay_cerca = !cerca_r.empty();
        if (hay_cerca) cerca = luna::leer_mapa(cerca_r, true, x0, y0, 16000.0);
        luna::Horizonte H = luna::perfil_horizonte(lat, lon, lejos, hay_cerca ? &cerca : nullptr, h, naz);

        std::FILE* f = std::fopen(salida.c_str(), "w");
        if (!f) throw std::runtime_error("No puedo escribir " + salida);
        std::fprintf(f, "{\"lat\": %.6f, \"lon\": %.6f, \"z0_m\": %.3f, \"h_obs_m\": %.3f, \"acimut_deg\": [", lat, lon, H.z0, h);
        for (size_t i = 0; i < H.az.size(); ++i) std::fprintf(f, "%s%.4f", i ? ", " : "", H.az[i]);
        std::fprintf(f, "], \"horizonte_deg\": [");
        for (size_t i = 0; i < H.elev.size(); ++i) std::fprintf(f, "%s%.4f", i ? ", " : "", H.elev[i]);
        std::fprintf(f, "]}\n");
        std::fclose(f);

        auto mm = std::minmax_element(H.elev.begin(), H.elev.end());
        std::printf("Altura del sitio: %.1f m | horizonte entre %.2f y %.2f grados\nGuardado %s\n",
                    H.z0, *mm.first, *mm.second, salida.c_str());
    } catch (const std::exception& e) {
        std::fprintf(stderr, "Error: %s\n", e.what());
        return 1;
    }
    return 0;
}
#endif
