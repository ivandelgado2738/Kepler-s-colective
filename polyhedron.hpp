#include "algebra.hpp"

Triangle readPolyhedron (FILE * s);

void readPosition (FILE *f, float &latitude, float &longitude);

float readAltitude (FILE *f, float latitude, float longitude);