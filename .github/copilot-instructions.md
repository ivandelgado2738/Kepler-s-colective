# Copilot instructions for Kepler-s-colective

- The repository contains a small algorithmic prototype.
- `maximum_average.cpp` implements `findMaximumAverageRange`, which finds the
  continuous time window with the highest average value.
- `Ranking.cpp` implements `findTopAverageRanges` by repeatedly selecting the
  best non-overlapping range through `findMaximumAverageRange`.
- Each `DataPoint` contains a timestamp string and a numeric value.
- The algorithms sort timestamps, compute prefix sums, and scan candidate
  window sizes around `targetCount ± margin`.
- `AverageRange` contains the start and end timestamps, number of data points,
  maximum average, and the selected indices.
- Keep the public declarations in `maximum_average.hpp` and `ranking.hpp`
  synchronized with their `.cpp` implementations.
- Preserve the current date-sorting and prefix-sum behavior when changing the
  algorithms.
