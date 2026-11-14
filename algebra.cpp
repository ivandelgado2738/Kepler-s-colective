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

float vectorNorm(Vector3D v) {
    return sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
};

float vectorDotProduct(Vector3D v1, Vector3D v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};

Vector3D vectorCrossProduct(Vector3D v1, Vector3D v2) {
    return {v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x};
};

Vector3D normalize(Vector3D v) {
    float norm = vectorNorm(v);
    return {v.x / norm, v.y / norm, v.z / norm};
};


float determinant3x3(Matrix3x3 m) {
    return m.m[0][0] * (m.m[1][1] * m.m[2][2] - m.m[1][2] * m.m[2][1]) -
           m.m[0][1] * (m.m[1][0] * m.m[2][2] - m.m[1][2] * m.m[2][0]) +
           m.m[0][2] * (m.m[1][0] * m.m[2][1] - m.m[1][1] * m.m[2][0]);
};

float determinant4x4(Matrix4x4 m) {
    float det = 0.0f;
    for (int i = 0; i < 4; ++i) {
        Matrix3x3 subMatrix;
        for (int j = 1; j < 4; ++j) {
            int colIndex = 0;
            for (int k = 0; k < 4; ++k) {
                if (k == i) continue;
                subMatrix.m[j - 1][colIndex] = m.m[j][k];
                colIndex++;
            }
        }
        det += (i % 2 == 0 ? 1 : -1) * m.m[0][i] * determinant3x3(subMatrix);
    }
    return det;
};

Vector3D normalVectorTriangle(Triangle t) {
    Vector3D edge1 = {t.v2.x - t.v1.x, t.v2.y - t.v1.y, t.v2.z - t.v1.z};
    Vector3D edge2 = {t.v3.x - t.v1.x, t.v3.y - t.v1.y, t.v3.z - t.v1.z};
    Vector3D normal = vectorCrossProduct(edge1, edge2);
    return normalize(normal);
};

int sign(float f){
    if(f < 0) return -1;
    if(f > 0) return 1;
    return 0;   
};

float signedTetrahedronVolume (Vector3D v, Triangle t){
    Matrix4x4 m;
    m.m[0][0] = v.x; m.m[0][1] = v.y; m.m[0][2] = v.z; m.m[0][3] = 1.0f;
    m.m[1][0] = t.v1.x; m.m[1][1] = t.v1.y; m.m[1][2] = t.v1.z; m.m[1][3] = 1.0f;
    m.m[2][0] = t.v2.x; m.m[2][1] = t.v2.y; m.m[2][2] = t.v2.z; m.m[2][3] = 1.0f;
    m.m[3][0] = t.v3.x; m.m[3][1] = t.v3.y; m.m[3][2] = t.v3.z; m.m[3][3] = 1.0f;

    return determinant4x4(m) / 6.0f;
};

bool intersectsTriangle(Vector3D Q1, Vector3D Q2, Triangle t) {
    float i,j,k;
    Triangle t1, t2, t3;
    t1 = {t.v1, Q1, t.v2};
    t2 = {t.v3, t.v2, Q1};
    t3 = {t.v1, t.v3, Q1};
    i = sign(signedTetrahedronVolume(Q2, t1));
    j = sign(signedTetrahedronVolume(Q2, t2));
    k = sign(signedTetrahedronVolume(Q2, t3));
    if(i == j && j == k && k == 1) return true;
    else if(i == j && j == k && k == -1) return true;
    else return false;
};


