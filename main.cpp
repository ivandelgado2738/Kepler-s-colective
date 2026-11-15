#include <string>
#include "algebra.hpp"
#include "illumination.hpp"
#include "polyhedron.hpp"

#define nyears 11
#define ndaysperyear 365
#define nrowsperday 96

using namespace std;

int main(){
    FILE *f = fopen("sun_earth_ephemerids.txt", "r");
    FILE *g = fopen("moon_position.txt", "r");
    FILE *h = fopen("moon_polyhedron.txt", "r");
    FILE *res = fopen("results.txt", "w");

    int i;
    int Nsides;
    Triangle polyhedron = readPolyhedron(h);
    float latitude, longitude, altitude;
    readPosition(g, latitude, longitude);
    altitude = readAltitude(g, latitude, longitude);
    Vector3D MoonPosition = latitudeLongitudeAltitudeToCartesian(latitude, longitude, altitude);
    // Position in Moon, cartesian

    fprintf(res, "Time (s)\tRelative Illumination\tCommunication (1=clear, 0=blocked)\n");

    for(i = 0; i < nyears * ndaysperyear * nrowsperday; i++){
        float time;

        char * date;

        Vector3D SunPosition, EarthPosition, MoonPosition;

        fscanf(f, "%f %s %f %f %f %f %f %f", &time, &date,
               &EarthPosition.x, &EarthPosition.y, &EarthPosition.z,
               &SunPosition.x, &SunPosition.y, &SunPosition.z
               );

        float illuminationValue = illumination(SunPosition, MoonPosition, polyhedron, Nsides);
        float communicationValue = communication(EarthPosition, MoonPosition, polyhedron, Nsides);

        fprintf(res, "%.2f\t%.6f\t%.1f\n", time, illuminationValue, communicationValue);
    };

    fclose(h);
    fclose(g);
    fclose(f);
    fclose(res);
}