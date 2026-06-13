#!/usr/bin/env bash
#
# Configures git to use the repo's .githooks/ directory.
# Run once after cloning.
#
set -e

cd "$(git rev-parse --show-toplevel)"

git config core.hooksPath .githooks
chmod +x .githooks/pre-commit

echo "✓ git hooks configured."
echo "  pre-commit will run 'npm run check' (frontend) + 'make check' (backend)"
echo "  if either fails, the commit is blocked."
