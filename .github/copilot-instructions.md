# Copilot instructions for Kepler-s-colective

- This repository is a very small algorithmic prototype, not a large application. The core logic lives in `main.cpp` and `Ranking.cpp`, and both currently implement the same routine: `buscar_rango_maxima_media(datos, n_objetivo, margen=0)`.
- The purpose of the code is to find the continuous time window whose average value is maximal, while constraining the window size around a target count (`n_objetivo ± margen`). The implementation is a single-purpose utility, not a framework-based app.
- Data contract: each item is a tuple like `("YYYY-MM-DD HH:MM", valor)`, where the first element is a timestamp string and the second is numeric. Keep sorting by timestamp and numeric conversion consistent when changing the routine.
- The algorithm pattern is: sort by date, compute prefix sums, then scan candidate start positions and window sizes to compare averages. This is intentionally self-contained and uses a simple O(N^2) window search with prefix sums to avoid a more complex structure.
- Important invariants in the current implementation:
  - `min_len = max(1, n_objetivo - margen)`
  - `max_len = min(m, n_objetivo + margen)`
  - the result is recorded as a dictionary with keys like `fecha_inicio`, `fecha_fin`, `num_datos`, `media_maxima`, `indice_inicio`, and `indice_fin`
- `main.cpp` and `Ranking.cpp` appear to be duplicate snapshots of the same logic. If you update one file, check the other for parity, especially function signatures and return-field names.
- Avoid introducing new project layers or dependency injection patterns. This codebase does not have services, modules, or a runtime architecture to integrate with; keep changes local and minimal.
- There is no README, build script, or test suite in the repo to rely on. Treat this as a minimal algorithm exercise and validate with the simplest direct execution path available for the actual file language.
- Do not assume a standard C++ build flow. `main.cpp` currently contains Python-like syntax, so verify the target file’s language before suggesting compile/run commands or adding tooling.
- Keep naming consistent with the existing Spanish identifiers (`buscar_rango_maxima_media`, `media_maxima`, etc.) rather than renaming to a more generic English style.
- If you add or modify logic, preserve the existing behavior of selecting the window with the highest average among valid sizes; do not change the date-sorting or prefix-sum assumptions without a clear reason.
- This repo is intentionally small and should stay that way. Favor one-file edits and compact helper logic over multi-file architecture or abstractions.
- When in doubt, follow the existing implementation in `Ranking.cpp` as the reference for algorithmic behavior and data shape.
