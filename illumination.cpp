#include <math.h>
#include "algebra.hpp"
#include "illumination.hpp"

using namespace std;

float illuminationAngle(Vector3D lightDirection, Triangle t) {
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

//We assume that polyhedron[0] is the face that the base is standing on
float illumination(Vector3D SunPosition, Vector3D MoonPosition, Triangle polyhedron[], int numTriangles) {
    Vector3D lightDirection = normalize({SunPosition.x - MoonPosition.x, SunPosition.y - MoonPosition.y, SunPosition.z - MoonPosition.z});
    float angle = illuminationAngle(lightDirection, polyhedron[0]);
    // Elevate the MoonPosition slightly along the normal of the triangle to avoid being illuminated by the Sun when it is actually in shadow
    Vector3D elevatedMoonPosition;
    if(sign(vectorDotProduct(normalVectorTriangle(polyhedron[0]), lightDirection)) < 0) {
        elevatedMoonPosition = vectorAddition(MoonPosition, productByScalar(normalVectorTriangle(polyhedron[0]), 0.01f));
    }
    else {
        elevatedMoonPosition = vectorSubstraction(MoonPosition, productByScalar(normalVectorTriangle(polyhedron[0]), 0.01f));
    }
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