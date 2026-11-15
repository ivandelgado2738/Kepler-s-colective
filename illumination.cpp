#include <math.h>
#include "algebra.hpp"
#include "illumination.hpp"

using namespace std;




double illuminationAngle(lunar::Vec3 lightDirection, Triangle t) {
    return abs(acos(vectorDotProduct(lightDirection, normalVectorTriangle(t))));
};

bool intersectsPolyhedron(lunar::Vec3 Q1, lunar::Vec3 Q2, vector<Triangle> polyhedron, int numTriangles){
    for (int i = 0; i < numTriangles; i++) {
        if (intersectsTriangle(Q1, Q2, polyhedron[i])) {
            return true;
        }
    }
    return false;
};

//We assume that polyhedron[0] is the face that the base is standing on
double illumination(lunar::Vec3 SunPosition, lunar::Vec3 MoonPosition, vector<Triangle> polyhedron, int numTriangles) {
    lunar::Vec3 lightDirection = normalize({SunPosition.x - MoonPosition.x, SunPosition.y - MoonPosition.y, SunPosition.z - MoonPosition.z});
    double angle = illuminationAngle(lightDirection, polyhedron[0]);
    // Elevate the MoonPosition slightly along the normal of the triangle to avoid being illuminated by the Sun when it is actually in shadow
    lunar::Vec3 elevatedMoonPosition;
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

double communication(lunar::Vec3 EarthPosition, lunar::Vec3 MoonPosition, vector<Triangle> polyhedron, int numTriangles) {
    if (intersectsPolyhedron(MoonPosition, EarthPosition, polyhedron, numTriangles)) {
        return 0.0f; // Blocked
    } else {
        return 1.0f; // Clear line of sight
    }
};