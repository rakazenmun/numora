#!/usr/bin/env bash
set -euo pipefail

if ! command -v emcc >/dev/null 2>&1; then
  echo "emscripten is required: https://emscripten.org/docs/getting_started/downloads.html"
  exit 1
fi

eval "$(/usr/bin/env emcc --show-config 2>/dev/null | head -n 1 || true)" >/dev/null 2>&1 || true

emcc numora.cpp \
  -O2 \
  -s WASM=1 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME='createNumoraModule' \
  -s EXPORTED_RUNTIME_METHODS='["ccall","cwrap","UTF8ToString","_free"]' \
  -s EXPORTED_FUNCTIONS='["_compute_stats","_free"]' \
  -o numora.js

echo "built: numora.js and numora.wasm"
