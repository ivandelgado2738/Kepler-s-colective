#include "algebra.hpp"

Triangle readPolyhedron (FILE * s);

void readPosition (FILE *f, double &latitude, double &longitude);

double readAltitude (FILE *f, double latitude, double longitude);