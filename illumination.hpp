#include <math.h>
#include "algebra.hpp"

using namespace std;

float iluminationAngle(Vector3D lightDirection, Triangle t);

bool intersectsPolyhedron(Vector3D Q1, Vector3D Q2, Triangle polyhedron[], int numTriangles);

float illumination(Vector3D SunPosition, Vector3D MoonPosition, Triangle polyhedron[], int numTriangles);

float communication(Vector3D EarthPosition, Vector3D MoonPosition, Triangle polyhedron[], int numTriangles);