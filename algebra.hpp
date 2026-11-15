#include <math.h>
struct Vector3D {
    float x, y, z;
};

struct Triangle {
    Vector3D v1, v2, v3;
};

struct Matrix3x3 {
    float m[3][3];
};

struct Matrix4x4 {
    float m[4][4];
};

float vectorNorm(Vector3D v);

float vectorDotProduct(Vector3D v1, Vector3D v2);

Vector3D vectorAddition(Vector3D v1, Vector3D v2);

Vector3D vectorSubstraction(Vector3D v1, Vector3D v2);

Vector3D productByScalar(Vector3D v, float scalar);

Vector3D vectorCrossProduct(Vector3D v1, Vector3D v2);

Vector3D normalize(Vector3D v);


float determinant3x3(Matrix3x3 m);

float determinant4x4(Matrix4x4 m);

Vector3D normalVectorTriangle(Triangle t);

int sign(float f);

float signedTetrahedronVolume (Vector3D v, Triangle t);

bool intersectsTriangle(Vector3D Q1, Vector3D Q2, Triangle t);

Vector3D cartesianToSpherical(Vector3D v);

Vector3D sphericalToCartesian(Vector3D v);

Vector3D latitudeLongitudeAltitudeToCartesian(float latitude, float longitude, float altitude);