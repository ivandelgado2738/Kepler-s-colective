#include <math.h>
#include "algebra.hpp"

using namespace std;

float iluminationAngle(lunar::Vec3 lightDirection, Triangle t);

bool intersectsPolyhedron(lunar::Vec3 Q1, lunar::Vec3 Q2, Triangle polyhedron, int numTriangles);

float illumination(lunar::Vec3 SunPosition, lunar::Vec3 MoonPosition, Triangle polyhedron, int numTriangles);

float communication(lunar::Vec3 EarthPosition, lunar::Vec3 MoonPosition, Triangle polyhedron, int numTriangles);