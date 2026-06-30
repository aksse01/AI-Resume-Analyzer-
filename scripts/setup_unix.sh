#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

npm install
npx prisma generate

echo "Setup complete. Run ./scripts/run_unix.sh to start the app."
