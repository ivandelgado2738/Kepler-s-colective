// lunar_dem.hpp
// -----------------------------------------------------------------------------
// Lee un trozo de un DEM polar lunar en GeoTIFF (p.ej. ldem_87s_5mpp.tif de LOLA,
// 5 m/pixel, estereografica polar sur) alrededor de un punto y lo devuelve como
// una malla regular lista para triangular.
//
//   - Un solo header, C++14 o superior, SIN dependencias (ni GDAL ni libtiff).
//   - Soporta TIFF y BigTIFF, en tiles o en strips, sin comprimir / LZW / Deflate,
//     predictor 1, 2 y 3, little y big endian, float32/float64/int/uint.
//   - Solo descomprime los bloques que tocan la region pedida (el archivo de
//     3,3 GB nunca se carga entero).
//
// Convenios (los del producto de la NASA/PGDA):
//   - Proyeccion: estereografica polar SUR sobre esfera de R = 1 737 400 m,
//     escala verdadera en el polo. Longitud 0 hacia +Y (arriba en la imagen),
//     longitud 90E hacia +X (derecha).
//   - Altura h: metros sobre la esfera de 1737.4 km, medida en direccion radial.
//   - XYZ: sistema MOON_ME (fijo a la Luna), metros desde el centro de la Luna.
//     +Z = polo norte, +X = (lat 0, lon 0). Es el mismo sistema de las efemerides.
//
// Uso minimo:
//     lunar::Dem dem("ldem_87_5mpp.tif");
//     lunar::Parche p = dem.region_latlon(-89.45, 222.69, 1000.0);  // +-1 km
//     auto tris = p.triangulos();
//     const lunar::Vec3& A = p.xyz[tris[0].a];
// -----------------------------------------------------------------------------
#ifndef LUNAR_DEM_HPP
#define LUNAR_DEM_HPP

#if !defined(_WIN32) && !defined(_FILE_OFFSET_BITS)
#define _FILE_OFFSET_BITS 64
#endif
#if defined(_MSC_VER) && !defined(_CRT_SECURE_NO_WARNINGS)
#define _CRT_SECURE_NO_WARNINGS  // Visual Studio: permitir fopen
#endif

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <limits>
#include <stdexcept>
#include <string>
#include <vector>

namespace lunar {

constexpr double PI = 3.14159265358979323846;
constexpr double GRAD = PI / 180.0;  // grados -> radianes

struct Vec3 {
    double x, y, z;
};

// Indices de los 3 vertices dentro de Parche::xyz / Parche::h
struct Triangulo {
    std::uint32_t a, b, c;
};

// -----------------------------------------------------------------------------
// Parche: la estructura que devuelve el lector. Malla regular filas x cols.
//   Nodo (i, j): i = fila (crece hacia -Y del mapa), j = columna (crece hacia +X).
//   Todo esta guardado por filas: k = i * cols + j.
// -----------------------------------------------------------------------------
struct Parche {
    int filas = 0, cols = 0;      // tamano de la malla (siempre impar x impar)
    int fila_c = 0, col_c = 0;    // nodo que cae en el punto pedido (el centro)
    double paso_m = 0.0;          // separacion entre nodos vecinos [m]
    double lat_c = 0.0, lon_c = 0.0;  // lat/lon [deg] del nodo central
    long long fila0 = 0, col0 = 0;    // pixel del raster del nodo (0,0)
    int paso_px = 1;                  // pixeles del raster entre nodos

    std::vector<float> h;   // altura [m] sobre la esfera de 1737.4 km; NaN = sin dato
    std::vector<Vec3> xyz;  // posicion MOON_ME [m]; NaN si no hay dato

    std::size_t idx(int i, int j) const { return std::size_t(i) * std::size_t(cols) + std::size_t(j); }
    bool valido(int i, int j) const { return !std::isnan(h[idx(i, j)]); }
    float altura(int i, int j) const { return h[idx(i, j)]; }
    const Vec3& punto(int i, int j) const { return xyz[idx(i, j)]; }

    // 2 triangulos por celda. Orden de vertices antihorario visto desde fuera de
    // la Luna => la normal (B-A)x(C-A) apunta hacia el cielo. Se saltan las celdas
    // que tengan algun nodo sin dato.
    std::vector<Triangulo> triangulos() const {
        std::vector<Triangulo> t;
        if (filas < 2 || cols < 2) return t;
        t.reserve(std::size_t(filas - 1) * std::size_t(cols - 1) * 2);
        for (int i = 0; i + 1 < filas; ++i) {
            for (int j = 0; j + 1 < cols; ++j) {
                const std::uint32_t a = std::uint32_t(idx(i, j));          // arriba-izq
                const std::uint32_t b = std::uint32_t(idx(i, j + 1));      // arriba-der
                const std::uint32_t c = std::uint32_t(idx(i + 1, j));      // abajo-izq
                const std::uint32_t d = std::uint32_t(idx(i + 1, j + 1));  // abajo-der
                const bool va = !std::isnan(h[a]), vb = !std::isnan(h[b]);
                const bool vc = !std::isnan(h[c]), vd = !std::isnan(h[d]);
                if (va && vc && vb) t.push_back({a, c, b});
                if (vb && vc && vd) t.push_back({b, c, d});
            }
        }
        return t;
    }
};

// =============================================================================
// Detalles internos: archivo de 64 bits y descompresores
// =============================================================================
namespace detalle {

class Archivo {
    std::FILE* f_ = nullptr;

public:
    explicit Archivo(const std::string& ruta) {
        f_ = std::fopen(ruta.c_str(), "rb");
        if (!f_) throw std::runtime_error("No se puede abrir el archivo: " + ruta);
    }
    ~Archivo() {
        if (f_) std::fclose(f_);
    }
    Archivo(const Archivo&) = delete;
    Archivo& operator=(const Archivo&) = delete;

    void leer(std::uint64_t pos, void* dst, std::size_t n) {
#ifdef _WIN32
        const int r = _fseeki64(f_, static_cast<long long>(pos), SEEK_SET);
#else
        const int r = fseeko(f_, static_cast<off_t>(pos), SEEK_SET);
#endif
        if (r != 0 || std::fread(dst, 1, n, f_) != n)
            throw std::runtime_error("Error de lectura en el TIFF (archivo truncado o corrupto)");
    }
};

inline bool host_little() {
    const std::uint16_t u = 1;
    unsigned char c;
    std::memcpy(&c, &u, 1);
    return c == 1;
}

template <class T>
inline T entero(const unsigned char* p, bool le) {
    T v = 0;
    for (std::size_t i = 0; i < sizeof(T); ++i)
        v = T(v | (T(p[i]) << (8 * (le ? i : sizeof(T) - 1 - i))));
    return v;
}

// ---------------------------- Deflate (zlib) ---------------------------------
struct BitsLsb {
    const unsigned char* p;
    std::size_t n;
    std::size_t pos = 0;
    std::uint32_t buf = 0;
    int cnt = 0;
    int bits(int need) {
        std::uint32_t val = buf;
        while (cnt < need) {
            if (pos == n) throw std::runtime_error("Deflate: datos truncados");
            val |= std::uint32_t(p[pos++]) << cnt;
            cnt += 8;
        }
        buf = val >> need;
        cnt -= need;
        return int(val & ((1u << need) - 1u));
    }
};

struct Huff {
    short count[16];
    short symbol[288];
};

inline void construir(Huff& h, const short* length, int n) {
    for (int l = 0; l <= 15; ++l) h.count[l] = 0;
    for (int s = 0; s < n; ++s) h.count[length[s]]++;
    short offs[16];
    offs[1] = 0;
    for (int l = 1; l < 15; ++l) offs[l + 1] = short(offs[l] + h.count[l]);
    for (int s = 0; s < n; ++s)
        if (length[s] != 0) h.symbol[offs[length[s]]++] = short(s);
}

inline int decodificar(BitsLsb& s, const Huff& h) {
    int code = 0, first = 0, index = 0;
    for (int len = 1; len <= 15; ++len) {
        code |= s.bits(1);
        const int count = h.count[len];
        if (code - count < first) return h.symbol[index + (code - first)];
        index += count;
        first += count;
        first <<= 1;
        code <<= 1;
    }
    throw std::runtime_error("Deflate: codigo Huffman invalido");
}

// Descomprime un flujo zlib y exige exactamente `cap` bytes de salida.
inline void inflar(const unsigned char* in, std::size_t n, unsigned char* out, std::size_t cap) {
    static const short lens[29] = {3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27,
                                   31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258};
    static const short lext[29] = {0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2,
                                   2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0};
    static const short dists[30] = {1, 2, 3, 4, 5, 7, 9, 13, 17, 25,
                                    33, 49, 65, 97, 129, 193, 257, 385, 513, 769,
                                    1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577};
    static const short dext[30] = {0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6,
                                   6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13};
    static const short orden[19] = {16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15};

    if (n < 2) throw std::runtime_error("Deflate: bloque vacio");
    BitsLsb s{in + 2, n - 2};  // saltar cabecera zlib (2 bytes)
    std::size_t o = 0;
    int ultimo = 0;
    while (!ultimo && o < cap) {
        ultimo = s.bits(1);
        const int tipo = s.bits(2);
        if (tipo == 0) {  // bloque almacenado
            s.buf = 0;
            s.cnt = 0;
            if (s.pos + 4 > s.n) throw std::runtime_error("Deflate: datos truncados");
            const std::size_t len = std::size_t(s.p[s.pos]) | (std::size_t(s.p[s.pos + 1]) << 8);
            s.pos += 4;
            if (s.pos + len > s.n) throw std::runtime_error("Deflate: datos truncados");
            const std::size_t c = std::min(len, cap - o);
            std::memcpy(out + o, s.p + s.pos, c);
            o += c;
            s.pos += len;
        } else if (tipo == 1 || tipo == 2) {
            Huff lc, dc;
            short lengths[320];
            if (tipo == 1) {  // Huffman fijo
                int sym = 0;
                for (; sym < 144; ++sym) lengths[sym] = 8;
                for (; sym < 256; ++sym) lengths[sym] = 9;
                for (; sym < 280; ++sym) lengths[sym] = 7;
                for (; sym < 288; ++sym) lengths[sym] = 8;
                construir(lc, lengths, 288);
                for (sym = 0; sym < 30; ++sym) lengths[sym] = 5;
                construir(dc, lengths, 30);
            } else {  // Huffman dinamico
                const int nlen = s.bits(5) + 257;
                const int ndist = s.bits(5) + 1;
                const int ncode = s.bits(4) + 4;
                if (nlen > 286 || ndist > 30) throw std::runtime_error("Deflate: cabecera invalida");
                int i = 0;
                for (; i < ncode; ++i) lengths[orden[i]] = short(s.bits(3));
                for (; i < 19; ++i) lengths[orden[i]] = 0;
                construir(lc, lengths, 19);
                i = 0;
                while (i < nlen + ndist) {
                    const int sym = decodificar(s, lc);
                    if (sym < 16) {
                        lengths[i++] = short(sym);
                    } else {
                        short len = 0;
                        int rep;
                        if (sym == 16) {
                            if (i == 0) throw std::runtime_error("Deflate: cabecera invalida");
                            len = lengths[i - 1];
                            rep = 3 + s.bits(2);
                        } else if (sym == 17) {
                            rep = 3 + s.bits(3);
                        } else {
                            rep = 11 + s.bits(7);
                        }
                        if (i + rep > nlen + ndist) throw std::runtime_error("Deflate: cabecera invalida");
                        while (rep--) lengths[i++] = len;
                    }
                }
                construir(lc, lengths, nlen);
                construir(dc, lengths + nlen, ndist);
            }
            while (o < cap) {
                int sym = decodificar(s, lc);
                if (sym < 256) {
                    out[o++] = static_cast<unsigned char>(sym);
                } else if (sym == 256) {
                    break;
                } else {
                    sym -= 257;
                    if (sym >= 29) throw std::runtime_error("Deflate: simbolo invalido");
                    int len = lens[sym] + s.bits(lext[sym]);
                    const int ds = decodificar(s, dc);
                    if (ds >= 30) throw std::runtime_error("Deflate: distancia invalida");
                    const std::size_t dist = std::size_t(dists[ds]) + std::size_t(s.bits(dext[ds]));
                    if (dist > o) throw std::runtime_error("Deflate: distancia fuera de rango");
                    while (len-- > 0 && o < cap) {
                        out[o] = out[o - dist];
                        ++o;
                    }
                }
            }
        } else {
            throw std::runtime_error("Deflate: tipo de bloque invalido");
        }
    }
    if (o != cap) throw std::runtime_error("Deflate: bloque mas corto de lo esperado");
}

// ------------------------------ LZW (TIFF) -----------------------------------
// Variante TIFF 6.0: codigos MSB-first, 9..12 bits, "early change".
inline void lzw(const unsigned char* in, std::size_t n, unsigned char* out, std::size_t cap) {
    std::vector<std::uint16_t> pref(4096), lon(4096);
    std::vector<unsigned char> suf(4096), prim(4096);
    for (int i = 0; i < 256; ++i) {
        pref[i] = 0;
        lon[i] = 1;
        suf[i] = prim[i] = static_cast<unsigned char>(i);
    }
    std::size_t pos = 0, o = 0;
    std::uint32_t acc = 0;
    int nb = 0;
    int nbits = 9, next = 258, old = -1;
    while (o < cap) {
        while (nb < nbits && pos < n) {
            acc = (acc << 8) | in[pos++];
            nb += 8;
        }
        if (nb < nbits) break;  // se acabaron los datos
        const int code = int((acc >> (nb - nbits)) & ((1u << nbits) - 1u));
        nb -= nbits;
        if (code == 257) break;  // fin de informacion
        if (code == 256) {       // limpiar tabla
            nbits = 9;
            next = 258;
            old = -1;
            continue;
        }
        if (old < 0) {
            if (code > 255) throw std::runtime_error("LZW: flujo corrupto");
            out[o++] = static_cast<unsigned char>(code);
            old = code;
            continue;
        }
        if (code > next || (code == next && next >= 4096)) throw std::runtime_error("LZW: flujo corrupto");
        if (next < 4096) {
            pref[next] = std::uint16_t(old);
            prim[next] = prim[old];
            suf[next] = (code < next) ? prim[code] : prim[old];
            lon[next] = std::uint16_t(lon[old] + 1);
            ++next;
        }
        const std::size_t L = lon[code];
        const std::size_t libre = cap - o;
        int c = code;
        for (std::size_t k = L; k-- > 0;) {
            if (k < libre) out[o + k] = suf[c];
            c = pref[c];
        }
        o += std::min(L, libre);
        old = code;
        if (next >= (1 << nbits) - 1 && nbits < 12) ++nbits;
    }
    if (o != cap) throw std::runtime_error("LZW: bloque mas corto de lo esperado");
}

}  // namespace detalle

// =============================================================================
// Dem: abre el GeoTIFF (solo lee la cabecera) y saca regiones bajo demanda
// =============================================================================
class Dem {
public:
    explicit Dem(const std::string& ruta) : arch_(ruta) { leer_cabecera(); }

    long long ancho() const { return W_; }
    long long alto() const { return H_; }
    double pixel_m() const { return sx_; }
    double radio_ref() const { return R_; }  // 1 737 400 m

    // ---- Proyeccion (estereografica polar sur, esfera) ----------------------
    // lat/lon en grados (lon Este positiva) <-> X/Y del mapa en metros
    void latlon_a_xy(double lat_deg, double lon_deg, double& x, double& y) const {
        const double rho = 2.0 * R_ * std::tan(0.5 * (PI / 2.0 + lat_deg * GRAD));
        const double dl = lon_deg * GRAD - lon0_;
        x = rho * std::sin(dl);
        y = rho * std::cos(dl);
    }
    void xy_a_latlon(double x, double y, double& lat_deg, double& lon_deg) const {
        const double rho = std::hypot(x, y);
        lat_deg = (-PI / 2.0 + 2.0 * std::atan(rho / (2.0 * R_))) / GRAD;
        double lon = (lon0_ + std::atan2(x, y)) / GRAD;
        if (lon < 0.0) lon += 360.0;
        if (lon >= 360.0) lon -= 360.0;
        lon_deg = lon;
    }
    // (lat, lon, altura sobre la esfera) -> XYZ MOON_ME en metros
    Vec3 a_moon_me(double lat_deg, double lon_deg, double h) const {
        const double la = lat_deg * GRAD, lo = lon_deg * GRAD, r = R_ + h;
        return {r * std::cos(la) * std::cos(lo), r * std::cos(la) * std::sin(lo), r * std::sin(la)};
    }

    // X/Y del mapa [m] del centro de un pixel, y pixel que contiene un X/Y
    double x_de_col(long long col) const { return xc0_ + double(col) * sx_; }
    double y_de_fila(long long fila) const { return yc0_ - double(fila) * sy_; }
    long long col_de_x(double x) const { return std::llround((x - xc0_) / sx_); }
    long long fila_de_y(double y) const { return std::llround((yc0_ - y) / sy_); }

    // ---- Lectura ------------------------------------------------------------
    // Region cuadrada centrada en el pixel mas cercano a (lat, lon), que cubre
    // +-radio_m en X y en Y del mapa. paso = 1 -> resolucion completa (5 m);
    // paso = 4 -> coge 1 de cada 4 pixeles (20 m), para regiones grandes.
    // Lo que caiga fuera del archivo se devuelve como NaN.
    Parche region_latlon(double lat_deg, double lon_deg, double radio_m, int paso = 1) {
        double x, y;
        latlon_a_xy(lat_deg, lon_deg, x, y);
        return region_xy(x, y, radio_m, paso);
    }

    // Igual, pero dando el punto en coordenadas X/Y del mapa [m]
    Parche region_xy(double x_m, double y_m, double radio_m, int paso = 1) {
        if (paso < 1) throw std::invalid_argument("paso debe ser >= 1");
        if (!(radio_m >= 0.0)) throw std::invalid_argument("radio_m debe ser >= 0");
        const long long cc = col_de_x(x_m), fc = fila_de_y(y_m);
        if (cc < 0 || cc >= W_ || fc < 0 || fc >= H_)
            throw std::out_of_range("El punto pedido cae fuera del area que cubre el archivo");
        const double nn = std::floor(radio_m / (sx_ * double(paso)) + 1e-9);
        if (nn > 20000.0)
            throw std::invalid_argument("Region demasiado grande: sube `paso` o baja `radio_m`");
        return leer_ventana(fc, cc, int(nn), paso);
    }

    // Altura [m] del pixel mas cercano a (lat, lon). NaN si no hay dato.
    float altura(double lat_deg, double lon_deg) { return region_latlon(lat_deg, lon_deg, 0.0).h[0]; }

    // Resumen legible de lo que hay en el archivo (para comprobar que cuadra)
    std::string info() const {
        char b[1024];
        const char* comp = comp_ == 1 ? "ninguna" : comp_ == 5 ? "LZW" : "Deflate";
        const char* fmt = fmt_ == 3 ? "float" : fmt_ == 2 ? "int" : "uint";
        std::snprintf(b, sizeof b,
                      "Raster: %lld x %lld px, %s%d, %s\n"
                      "Bloques: %s de %lld x %lld px, compresion %s, predictor %d\n"
                      "Pixel: %.6g m | X: [%.1f, %.1f] m | Y: [%.1f, %.1f] m\n"
                      "Proyeccion: estereografica polar sur, R = %.1f m, lon0 = %.4f deg\n"
                      "Sin dato: %s",
                      W_, H_, fmt, bps_ * 8, big_ ? "BigTIFF" : "TIFF clasico",
                      tiled_ ? "tiles" : "strips", bw_, bh_, comp, pred_,
                      sx_, xc0_ - 0.5 * sx_, x_de_col(W_ - 1) + 0.5 * sx_,
                      y_de_fila(H_ - 1) - 0.5 * sy_, yc0_ + 0.5 * sy_,
                      R_, lon0_ / GRAD,
                      hay_nodata_ ? std::to_string(nodata_).c_str() : "(no declarado)");
        return b;
    }

private:
    detalle::Archivo arch_;
    bool le_ = true, big_ = false, swap_ = false;
    long long W_ = 0, H_ = 0;
    int bps_ = 0;      // bytes por muestra
    int fmt_ = 1;      // 1 uint, 2 int, 3 float
    int comp_ = 1;     // 1 ninguna, 5 LZW, 8 Deflate
    int pred_ = 1;     // 1 ninguno, 2 horizontal, 3 coma flotante
    bool tiled_ = false;
    long long bw_ = 0, bh_ = 0, nbx_ = 0, nby_ = 0;  // tamano y numero de bloques
    std::vector<std::uint64_t> off_, cnt_;
    double sx_ = 0, sy_ = 0, xc0_ = 0, yc0_ = 0;  // pixel y centro del pixel (0,0)
    double R_ = 1737400.0, lon0_ = 0.0;           // lon0 en radianes
    bool hay_nodata_ = false;
    double nodata_ = 0.0;

    // ---- cabecera TIFF --------------------------------------------------------
    struct Entrada {
        int tipo = 0;
        std::uint64_t n = 0;
        std::vector<unsigned char> datos;
    };

    std::vector<double> valores(const Entrada& e) const {
        std::vector<double> v(std::size_t(e.n));
        const unsigned char* d = e.datos.data();
        using namespace detalle;
        for (std::size_t i = 0; i < v.size(); ++i) {
            switch (e.tipo) {
                case 1: case 2: case 7: v[i] = d[i]; break;
                case 6: v[i] = static_cast<signed char>(d[i]); break;
                case 3: v[i] = entero<std::uint16_t>(d + 2 * i, le_); break;
                case 8: v[i] = static_cast<std::int16_t>(entero<std::uint16_t>(d + 2 * i, le_)); break;
                case 4: case 13: v[i] = entero<std::uint32_t>(d + 4 * i, le_); break;
                case 9: v[i] = static_cast<std::int32_t>(entero<std::uint32_t>(d + 4 * i, le_)); break;
                case 16: case 18: v[i] = double(entero<std::uint64_t>(d + 8 * i, le_)); break;
                case 17: v[i] = double(static_cast<std::int64_t>(entero<std::uint64_t>(d + 8 * i, le_))); break;
                case 11: {
                    const std::uint32_t u = entero<std::uint32_t>(d + 4 * i, le_);
                    float f;
                    std::memcpy(&f, &u, 4);
                    v[i] = f;
                    break;
                }
                case 12: {
                    const std::uint64_t u = entero<std::uint64_t>(d + 8 * i, le_);
                    double f;
                    std::memcpy(&f, &u, 8);
                    v[i] = f;
                    break;
                }
                case 5: v[i] = double(entero<std::uint32_t>(d + 8 * i, le_)) /
                               double(entero<std::uint32_t>(d + 8 * i + 4, le_)); break;
                default: v[i] = 0.0;
            }
        }
        return v;
    }

    void leer_cabecera() {
        using namespace detalle;
        static const int tam_tipo[19] = {0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8, 4, 0, 0, 8, 8, 8};

        unsigned char cab[16];
        arch_.leer(0, cab, 16);
        if (cab[0] == 'I' && cab[1] == 'I') le_ = true;
        else if (cab[0] == 'M' && cab[1] == 'M') le_ = false;
        else throw std::runtime_error("El archivo no es un TIFF");
        swap_ = (le_ != host_little());

        const int magic = entero<std::uint16_t>(cab + 2, le_);
        std::uint64_t ifd;
        if (magic == 42) {
            big_ = false;
            ifd = entero<std::uint32_t>(cab + 4, le_);
        } else if (magic == 43) {
            big_ = true;
            ifd = entero<std::uint64_t>(cab + 8, le_);
        } else {
            throw std::runtime_error("El archivo no es un TIFF");
        }

        unsigned char nb[8];
        arch_.leer(ifd, nb, big_ ? 8 : 2);
        const std::uint64_t n_ent = big_ ? entero<std::uint64_t>(nb, le_) : entero<std::uint16_t>(nb, le_);
        if (n_ent == 0 || n_ent > 65535) throw std::runtime_error("TIFF: directorio corrupto");
        const std::size_t te = big_ ? 20 : 12, tc = big_ ? 8 : 4;
        std::vector<unsigned char> dir(std::size_t(n_ent) * te);
        arch_.leer(ifd + (big_ ? 8 : 2), dir.data(), dir.size());

        // Etiquetas que nos interesan
        Entrada e_off, e_cnt, e_escala, e_tie, e_mat, e_gk, e_gd, e_nd;
        double rps = 4294967295.0, spp = 1, bits = 1, fmt = 1, comp = 1, pred = 1, tw = 0, th = 0;
        bool hay_strips = false, hay_tiles = false;

        for (std::uint64_t k = 0; k < n_ent; ++k) {
            const unsigned char* e = dir.data() + std::size_t(k) * te;
            const int tag = entero<std::uint16_t>(e, le_);
            Entrada en;
            en.tipo = entero<std::uint16_t>(e + 2, le_);
            en.n = big_ ? entero<std::uint64_t>(e + 4, le_) : entero<std::uint32_t>(e + 4, le_);
            const unsigned char* campo = e + (big_ ? 12 : 8);
            switch (tag) {
                case 256: case 257: case 258: case 259: case 273: case 277: case 278: case 279:
                case 317: case 322: case 323: case 324: case 325: case 339:
                case 33550: case 33922: case 34264: case 34735: case 34736: case 42113:
                    break;
                default:
                    continue;
            }
            if (en.tipo < 1 || en.tipo > 18 || tam_tipo[en.tipo] == 0) continue;
            const std::uint64_t bytes = en.n * std::uint64_t(tam_tipo[en.tipo]);
            if (bytes > (std::uint64_t(1) << 30)) throw std::runtime_error("TIFF: etiqueta demasiado grande");
            en.datos.resize(std::size_t(bytes));
            if (bytes <= tc) {
                std::memcpy(en.datos.data(), campo, std::size_t(bytes));
            } else {
                const std::uint64_t pos = big_ ? entero<std::uint64_t>(campo, le_)
                                               : entero<std::uint32_t>(campo, le_);
                arch_.leer(pos, en.datos.data(), en.datos.size());
            }
            auto primero = [&]() { return en.n ? valores(en)[0] : 0.0; };
            switch (tag) {
                case 256: W_ = (long long)primero(); break;
                case 257: H_ = (long long)primero(); break;
                case 258: bits = primero(); break;
                case 259: comp = primero(); break;
                case 277: spp = primero(); break;
                case 278: rps = primero(); break;
                case 317: pred = primero(); break;
                case 322: tw = primero(); break;
                case 323: th = primero(); break;
                case 339: fmt = primero(); break;
                case 273: e_off = std::move(en); hay_strips = true; break;
                case 279: if (!hay_tiles) e_cnt = std::move(en); break;
                case 324: e_off = std::move(en); hay_tiles = true; break;
                case 325: e_cnt = std::move(en); break;
                case 33550: e_escala = std::move(en); break;
                case 33922: e_tie = std::move(en); break;
                case 34264: e_mat = std::move(en); break;
                case 34735: e_gk = std::move(en); break;
                case 34736: e_gd = std::move(en); break;
                case 42113: e_nd = std::move(en); break;
                default: break;
            }
        }

        if (W_ <= 0 || H_ <= 0) throw std::runtime_error("TIFF: faltan las dimensiones");
        if (spp != 1) throw std::runtime_error("TIFF: se esperaba 1 banda (un DEM), tiene mas");
        if (bits != 8 && bits != 16 && bits != 32 && bits != 64)
            throw std::runtime_error("TIFF: bits por muestra no soportados");
        bps_ = int(bits) / 8;
        fmt_ = int(fmt);
        const bool fmt_ok = (fmt_ == 3 && (bps_ == 4 || bps_ == 8)) || ((fmt_ == 1 || fmt_ == 2) && bps_ <= 4);
        if (!fmt_ok) throw std::runtime_error("TIFF: formato de muestra no soportado");
        comp_ = int(comp);
        if (comp_ == 32946) comp_ = 8;
        if (comp_ != 1 && comp_ != 5 && comp_ != 8)
            throw std::runtime_error(
                "TIFF: compresion no soportada (codigo " + std::to_string(int(comp)) +
                "). Convierte el archivo una vez con: gdal_translate -co COMPRESS=DEFLATE -co TILED=YES "
                "-co BIGTIFF=YES entrada.tif salida.tif");
        pred_ = int(pred);
        if (pred_ < 1 || pred_ > 3) throw std::runtime_error("TIFF: predictor no soportado");
        if (comp_ == 1) pred_ = 1;

        tiled_ = hay_tiles;
        if (tiled_) {
            if (tw <= 0 || th <= 0) throw std::runtime_error("TIFF: tamano de tile invalido");
            bw_ = (long long)tw;
            bh_ = (long long)th;
        } else {
            if (!hay_strips) throw std::runtime_error("TIFF: no tiene ni strips ni tiles");
            bw_ = W_;
            bh_ = std::min<long long>((long long)rps, H_);
            if (bh_ <= 0) bh_ = H_;
        }
        nbx_ = (W_ + bw_ - 1) / bw_;
        nby_ = (H_ + bh_ - 1) / bh_;
        {
            const std::vector<double> o = valores(e_off), c = valores(e_cnt);
            if ((long long)o.size() < nbx_ * nby_ || c.size() != o.size())
                throw std::runtime_error("TIFF: tabla de bloques incompleta");
            off_.resize(o.size());
            cnt_.resize(c.size());
            for (std::size_t i = 0; i < o.size(); ++i) {
                off_[i] = std::uint64_t(o[i]);
                cnt_[i] = std::uint64_t(c[i]);
            }
        }

        // ---- GeoKeys: tipo de raster, radio y meridiano central --------------
        bool pixel_es_punto = false;
        if (e_gk.n >= 4) {
            const std::vector<double> gk = valores(e_gk), gd = valores(e_gd);
            const std::size_t nk = std::size_t(gk[3]);
            bool hay_polo = false;
            for (std::size_t k = 0; k < nk && 4 + 4 * k + 3 < gk.size(); ++k) {
                const int id = int(gk[4 + 4 * k]), loc = int(gk[5 + 4 * k]);
                const std::size_t val = std::size_t(gk[7 + 4 * k]);
                if (id == 1025 && loc == 0) pixel_es_punto = (val == 2);
                if (loc == 34736 && val < gd.size()) {
                    const double x = gd[val];
                    if (id == 2057 && x > 0) R_ = x;
                    if (id == 3095) { lon0_ = x * GRAD; hay_polo = true; }
                    if (id == 3088 && !hay_polo) lon0_ = x * GRAD;
                    if ((id == 3089 || id == 3081) && x > 0)
                        throw std::runtime_error("Este lector solo soporta la proyeccion polar SUR");
                }
            }
        }

        // ---- Georreferenciacion: centro del pixel (0,0) y tamano de pixel ----
        const double medio = pixel_es_punto ? 0.0 : 0.5;
        if (e_escala.n >= 2 && e_tie.n >= 6) {
            const std::vector<double> s = valores(e_escala), t = valores(e_tie);
            sx_ = s[0];
            sy_ = s[1];
            xc0_ = t[3] + (medio - t[0]) * sx_;
            yc0_ = t[4] - (medio - t[1]) * sy_;
        } else if (e_mat.n >= 16) {
            const std::vector<double> m = valores(e_mat);
            if (m[1] != 0.0 || m[4] != 0.0) throw std::runtime_error("GeoTIFF rotado: no soportado");
            sx_ = m[0];
            sy_ = -m[5];
            xc0_ = m[3] + medio * sx_;
            yc0_ = m[7] - medio * sy_;
        } else {
            throw std::runtime_error("El TIFF no trae georreferenciacion (no es un GeoTIFF)");
        }
        if (!(sx_ > 0.0) || !(sy_ > 0.0)) throw std::runtime_error("GeoTIFF: tamano de pixel invalido");

        // ---- Valor "sin dato" -------------------------------------------------
        if (e_nd.n > 0) {
            const std::string s(e_nd.datos.begin(), e_nd.datos.end());
            char* fin = nullptr;
            const double v = std::strtod(s.c_str(), &fin);
            if (fin != s.c_str() && !std::isnan(v)) {
                hay_nodata_ = true;
                nodata_ = v;
            }
        }
    }

    // ---- muestras -------------------------------------------------------------
    // p apunta a una muestra en orden de bytes NATIVO
    float muestra(const unsigned char* p) const {
        double v;
        switch (fmt_ * 10 + bps_) {
            case 34: { float f; std::memcpy(&f, p, 4); if (hay_nodata_ && f == float(nodata_)) return NAN_F(); return f; }
            case 38: { std::memcpy(&v, p, 8); break; }
            case 11: v = *p; break;
            case 12: { std::uint16_t u; std::memcpy(&u, p, 2); v = u; break; }
            case 14: { std::uint32_t u; std::memcpy(&u, p, 4); v = u; break; }
            case 21: v = static_cast<signed char>(*p); break;
            case 22: { std::int16_t u; std::memcpy(&u, p, 2); v = u; break; }
            case 24: { std::int32_t u; std::memcpy(&u, p, 4); v = u; break; }
            default: return NAN_F();
        }
        if (hay_nodata_ && v == nodata_) return NAN_F();
        return float(v);
    }
    static float NAN_F() { return std::numeric_limits<float>::quiet_NaN(); }

    void invertir_muestras(unsigned char* p, std::size_t n) const {
        if (bps_ == 1) return;
        for (std::size_t i = 0; i < n; ++i) std::reverse(p + i * bps_, p + (i + 1) * bps_);
    }

    // Descomprime el bloque idx (bw_ x filas_b muestras) y lo deja en orden nativo
    void leer_bloque(std::size_t idx, std::size_t filas_b, std::vector<unsigned char>& out,
                     std::vector<unsigned char>& tmp) {
        const std::uint64_t nbytes64 = std::uint64_t(bw_) * filas_b * std::uint64_t(bps_);
        if (nbytes64 > (std::uint64_t(1) << 31) || cnt_[idx] > (std::uint64_t(1) << 31))
            throw std::runtime_error(
                "TIFF: bloque comprimido gigante. Convierte el archivo a tiles con: gdal_translate "
                "-co TILED=YES -co COMPRESS=DEFLATE -co BIGTIFF=YES entrada.tif salida.tif");
        const std::size_t nbytes = std::size_t(nbytes64);
        out.resize(nbytes);
        tmp.resize(std::size_t(cnt_[idx]));
        arch_.leer(off_[idx], tmp.data(), tmp.size());
        if (comp_ == 5) detalle::lzw(tmp.data(), tmp.size(), out.data(), nbytes);
        else detalle::inflar(tmp.data(), tmp.size(), out.data(), nbytes);

        const std::size_t fila_bytes = std::size_t(bw_) * std::size_t(bps_);
        const std::size_t w = std::size_t(bw_), b = std::size_t(bps_);
        if (pred_ == 3) {
            // Predictor de coma flotante: diferencias byte a byte + planos de bytes (MSB primero)
            tmp.resize(fila_bytes);
            const bool hl = detalle::host_little();
            for (std::size_t r = 0; r < filas_b; ++r) {
                unsigned char* row = out.data() + r * fila_bytes;
                for (std::size_t i = 1; i < fila_bytes; ++i) row[i] = static_cast<unsigned char>(row[i] + row[i - 1]);
                std::memcpy(tmp.data(), row, fila_bytes);
                for (std::size_t c = 0; c < w; ++c)
                    for (std::size_t k = 0; k < b; ++k)
                        row[b * c + k] = tmp[(hl ? (b - 1 - k) : k) * w + c];
            }
        } else {
            if (swap_) invertir_muestras(out.data(), w * filas_b);
            if (pred_ == 2) {
                // Predictor horizontal: suma acumulada entera por fila
                for (std::size_t r = 0; r < filas_b; ++r) {
                    unsigned char* row = out.data() + r * fila_bytes;
                    if (b == 1) {
                        for (std::size_t c = 1; c < w; ++c) row[c] = static_cast<unsigned char>(row[c] + row[c - 1]);
                    } else if (b == 2) {
                        std::uint16_t prev, cur;
                        std::memcpy(&prev, row, 2);
                        for (std::size_t c = 1; c < w; ++c) {
                            std::memcpy(&cur, row + 2 * c, 2);
                            prev = std::uint16_t(prev + cur);
                            std::memcpy(row + 2 * c, &prev, 2);
                        }
                    } else if (b == 4) {
                        std::uint32_t prev, cur;
                        std::memcpy(&prev, row, 4);
                        for (std::size_t c = 1; c < w; ++c) {
                            std::memcpy(&cur, row + 4 * c, 4);
                            prev += cur;
                            std::memcpy(row + 4 * c, &prev, 4);
                        }
                    } else {
                        std::uint64_t prev, cur;
                        std::memcpy(&prev, row, 8);
                        for (std::size_t c = 1; c < w; ++c) {
                            std::memcpy(&cur, row + 8 * c, 8);
                            prev += cur;
                            std::memcpy(row + 8 * c, &prev, 8);
                        }
                    }
                }
            }
        }
    }

    // ---- lectura de la ventana --------------------------------------------------
    // Nodos: fila = fc + (k - n) * paso, col = cc + (m - n) * paso, con k, m en [0, 2n]
    Parche leer_ventana(long long fc, long long cc, int n, int paso) {
        Parche P;
        P.filas = P.cols = 2 * n + 1;
        P.fila_c = P.col_c = n;
        P.paso_px = paso;
        P.paso_m = sx_ * double(paso);
        P.fila0 = fc - (long long)n * paso;
        P.col0 = cc - (long long)n * paso;
        const std::size_t N = std::size_t(P.filas) * std::size_t(P.cols);
        P.h.assign(N, NAN_F());

        // Rango de nodos que caen dentro del raster
        const int k0 = int(std::max<long long>(0, n - fc / paso));
        const int k1 = int(std::min<long long>(2LL * n, n + (H_ - 1 - fc) / paso));
        const int m0 = int(std::max<long long>(0, n - cc / paso));
        const int m1 = int(std::min<long long>(2LL * n, n + (W_ - 1 - cc) / paso));
        auto fila_de = [&](int k) { return fc + (long long)(k - n) * paso; };
        auto col_de = [&](int m) { return cc + (long long)(m - n) * paso; };

        std::vector<unsigned char> buf, tmp;
        unsigned char s8[8];
        for (int k = k0; k <= k1;) {
            const long long by = fila_de(k) / bh_;
            int kf = k;
            while (kf + 1 <= k1 && fila_de(kf + 1) / bh_ == by) ++kf;
            const std::size_t filas_b = tiled_ ? std::size_t(bh_) : std::size_t(std::min(bh_, H_ - by * bh_));
            for (int m = m0; m <= m1;) {
                const long long bx = col_de(m) / bw_;
                int mf = m;
                while (mf + 1 <= m1 && col_de(mf + 1) / bw_ == bx) ++mf;
                const std::size_t ib = std::size_t(by * nbx_ + bx);
                if (cnt_[ib] != 0) {  // (bloque vacio = sin dato)
                    if (comp_ == 1) {
                        // Sin compresion: leer solo el tramo de fila que hace falta
                        const long long c_ini = col_de(m) - bx * bw_;
                        const std::size_t tramo = (std::size_t(mf - m) * std::size_t(paso) + 1) * std::size_t(bps_);
                        buf.resize(tramo);
                        for (int kk = k; kk <= kf; ++kk) {
                            const long long ri = fila_de(kk) - by * bh_;
                            arch_.leer(off_[ib] + std::uint64_t(ri * bw_ + c_ini) * std::uint64_t(bps_), buf.data(), tramo);
                            for (int mm = m; mm <= mf; ++mm) {
                                const unsigned char* p = buf.data() + std::size_t(mm - m) * std::size_t(paso) * std::size_t(bps_);
                                if (swap_) {
                                    std::reverse_copy(p, p + bps_, s8);
                                    p = s8;
                                }
                                P.h[P.idx(kk, mm)] = muestra(p);
                            }
                        }
                    } else {
                        leer_bloque(ib, filas_b, buf, tmp);
                        for (int kk = k; kk <= kf; ++kk) {
                            const std::size_t ri = std::size_t(fila_de(kk) - by * bh_);
                            for (int mm = m; mm <= mf; ++mm) {
                                const std::size_t ci = std::size_t(col_de(mm) - bx * bw_);
                                P.h[P.idx(kk, mm)] = muestra(buf.data() + (ri * std::size_t(bw_) + ci) * std::size_t(bps_));
                            }
                        }
                    }
                }
                m = mf + 1;
            }
            k = kf + 1;
        }

        // XYZ en MOON_ME de cada nodo
        P.xyz.resize(N);
        const double nan = std::numeric_limits<double>::quiet_NaN();
        for (int i = 0; i < P.filas; ++i) {
            const double y = y_de_fila(P.fila0 + (long long)i * paso);
            for (int j = 0; j < P.cols; ++j) {
                const std::size_t q = P.idx(i, j);
                if (std::isnan(P.h[q])) {
                    P.xyz[q] = {nan, nan, nan};
                    continue;
                }
                const double x = x_de_col(P.col0 + (long long)j * paso);
                double lat, lon;
                xy_a_latlon(x, y, lat, lon);
                P.xyz[q] = a_moon_me(lat, lon, double(P.h[q]));
            }
        }
        xy_a_latlon(x_de_col(cc), y_de_fila(fc), P.lat_c, P.lon_c);
        return P;
    }
};

}  // namespace lunar

#endif  // LUNAR_DEM_HPP
