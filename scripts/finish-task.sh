#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║  FINISH TASK — Merges a task branch back into main          ║
# ╚══════════════════════════════════════════════════════════════╝
#
# Usage:
#   ./scripts/finish-task.sh task/fix-dashboard-buttons
#   ./scripts/finish-task.sh    (auto-detects if run from a worktree)
#
# What it does:
#   1. Commits any uncommitted changes in the task worktree
#   2. Merges the task branch into main
#   3. Pushes main
#   4. Removes the worktree and branch

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Detect branch — passed as arg or auto-detect from current dir
if [ -n "$1" ]; then
  BRANCH="$1"
else
  # Try to detect from current directory
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
  if [[ "$CURRENT_BRANCH" == task/* ]]; then
    BRANCH="$CURRENT_BRANCH"
  else
    echo ""
    echo "  Usage: ./scripts/finish-task.sh <branch-name>"
    echo ""
    echo "  Active task branches:"
    git worktree list | grep -v "$REPO_ROOT " | while read -r line; do
      echo "    $line"
    done
    echo ""
    exit 1
  fi
fi

echo ""
echo "  Finishing task: $BRANCH"
echo ""

# Find the worktree path for this branch
WORKTREE_PATH=$(git worktree list --porcelain | grep -B2 "branch refs/heads/$BRANCH" | grep "worktree " | sed 's/worktree //')

if [ -z "$WORKTREE_PATH" ]; then
  echo "  ERROR: No worktree found for branch '$BRANCH'"
  exit 1
fi

# Check for uncommitted changes in the worktree
cd "$WORKTREE_PATH"
if [ -n "$(git status --porcelain)" ]; then
  echo "  Committing remaining changes in worktree..."
  git add -A
  git commit -m "chore: final changes from $BRANCH

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
fi

# Switch to main repo and merge
cd "$REPO_ROOT"
git checkout main 2>/dev/null
git pull origin main 2>/dev/null || true

echo "  Merging $BRANCH into main..."
git merge "$BRANCH" --no-edit

echo "  Pushing to remote..."
git push origin main

# Clean up worktree and branch
echo "  Cleaning up worktree..."
git worktree remove "$WORKTREE_PATH" --force 2>/dev/null || true
git branch -D "$BRANCH" 2>/dev/null || true

echo ""
echo "  ✅ Task complete! Branch merged into main and cleaned up."
echo ""
