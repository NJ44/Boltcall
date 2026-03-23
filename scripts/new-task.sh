#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║  NEW TASK — Creates an isolated worktree for parallel work  ║
# ╚══════════════════════════════════════════════════════════════╝
#
# Usage:
#   ./scripts/new-task.sh "fix dashboard buttons"
#   ./scripts/new-task.sh    (auto-generates a name)
#
# What it does:
#   1. Creates a new branch from latest main
#   2. Creates a git worktree in ../boltcall-tasks/<branch-name>
#   3. Opens VS Code in that worktree
#   4. You run Claude Code there — fully isolated from main

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TASKS_DIR="$(cd "$REPO_ROOT/.." && pwd)/boltcall-tasks"

# Generate branch name from description or timestamp
if [ -n "$1" ]; then
  # Slugify the description
  SLUG=$(echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//' | cut -c1-40)
  BRANCH="task/${SLUG}"
else
  BRANCH="task/$(date +%Y%m%d-%H%M%S)"
fi

WORKTREE_PATH="${TASKS_DIR}/${BRANCH##*/}"

echo ""
echo "  Creating isolated workspace..."
echo "  Branch:    $BRANCH"
echo "  Location:  $WORKTREE_PATH"
echo ""

# Make sure we're up to date
cd "$REPO_ROOT"
git fetch origin main 2>/dev/null || true

# Create the tasks directory if needed
mkdir -p "$TASKS_DIR"

# Create worktree from latest main
git worktree add "$WORKTREE_PATH" -b "$BRANCH" origin/main 2>/dev/null || {
  # Branch might already exist
  git worktree add "$WORKTREE_PATH" "$BRANCH" 2>/dev/null || {
    echo "  ERROR: Could not create worktree. Branch '$BRANCH' may already exist."
    echo "  Try a different name or run: ./scripts/list-tasks.sh"
    exit 1
  }
}

# Install dependencies in the worktree (symlink node_modules for speed)
if [ -d "$REPO_ROOT/node_modules" ] && [ ! -d "$WORKTREE_PATH/node_modules" ]; then
  # Use junction on Windows, symlink on Unix
  if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    cmd //c "mklink /J \"$(cygpath -w "$WORKTREE_PATH/node_modules")\" \"$(cygpath -w "$REPO_ROOT/node_modules")\"" 2>/dev/null || true
  else
    ln -s "$REPO_ROOT/node_modules" "$WORKTREE_PATH/node_modules" 2>/dev/null || true
  fi
fi

echo "  ✅ Workspace ready!"
echo ""
echo "  Opening VS Code..."

# Convert to Windows path for VS Code on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  code "$(cygpath -w "$WORKTREE_PATH")"
else
  code "$WORKTREE_PATH"
fi

echo ""
echo "  ┌─────────────────────────────────────────────────┐"
echo "  │  You're now on branch: $BRANCH"
echo "  │  Work freely — this is isolated from main.      │"
echo "  │                                                 │"
echo "  │  When done, run:                                │"
echo "  │    ./scripts/finish-task.sh $BRANCH"
echo "  └─────────────────────────────────────────────────┘"
echo ""
