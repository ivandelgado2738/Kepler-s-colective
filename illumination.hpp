#include <math.h>
#include "algebra.hpp"

using namespace std;

double iluminationAngle(Vector3D lightDirection, Triangle t);

bool intersectsPolyhedron(Vector3D Q1, Vector3D Q2, Triangle polyhedron[], int numTriangles);

double illumination(Vector3D SunPosition, Vector3D MoonPosition, Triangle polyhedron[], int numTriangles);

double communication(Vector3D EarthPosition, Vector3D MoonPosition, Triangle polyhedron[], int numTriangles);