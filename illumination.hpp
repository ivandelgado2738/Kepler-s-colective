#include <math.h>
#include "algebra.hpp"

using namespace std;

Vector3D sphericalToCartesian(float radius, float theta, float phi) {
    Vector3D cartesian;
    cartesian.x = radius * sin(theta) * cos(phi);
    cartesian.y = radius * sin(theta) * sin(phi);
    cartesian.z = radius * cos(theta);
    return cartesian;
};

Vector3D cartesianToSpherical(Vector3D cartesian) {
    Vector3D spherical;
    spherical.x = sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y + cartesian.z * cartesian.z); // radius
    spherical.y = acos(cartesian.z / spherical.x); // theta
    spherical.z = atan2(cartesian.y, cartesian.x); // phi
    return spherical;
};

Vector3D elevatePoint(Vector3D point, float elevation) {
    Vector3D elevatedPoint;
    elevatedPoint = cartesianToSpherical(point);
    elevatedPoint.z += elevation;
    return elevatedPoint;
};

float iluminationAngle(Vector3D lightDirection, Triangle t) {
    return abs(acos(vectorDotProduct(lightDirection, normalVectorTriangle(t))));
};

bool intersectsPolyhedron(Vector3D Q1, Vector3D Q2, Triangle polyhedron[], int numTriangles){
    for (int i = 0; i < numTriangles; i++) {
        if (intersectsTriangle(Q1, Q2, polyhedron[i])) {
            return true;
        }
    }
    return false;
};

//Se asume que polyhedron[0] es la cara en la que estamos
float ilumination(Vector3D SunPosition, Vector3D MoonPosition, Triangle polyhedron[], int numTriangles) {
    Vector3D lightDirection = {SunPosition.x - MoonPosition.x, SunPosition.y - MoonPosition.y, SunPosition.z - MoonPosition.z};
    float angle = iluminationAngle(lightDirection, polyhedron[0]);
    Vector3D elevatedMoonPosition = elevatePoint(MoonPosition, 1.0f); // Elevate the Moon position by 1 meter
    if (intersectsPolyhedron(elevatedMoonPosition, SunPosition, polyhedron, numTriangles)) {
        return 0.0f; // Shadowed
    } else {
        return angle; // Illuminated
    }
};

float communication(Vector3D EarthPosition, Vector3D MoonPosition, Triangle polyhedron[], int numTriangles) {
    if (intersectsPolyhedron(MoonPosition, EarthPosition, polyhedron, numTriangles)) {
        return 0.0f; // Blocked
    } else {
        return 1.0f; // Clear line of sight
    }
};

