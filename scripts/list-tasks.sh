#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║  LIST TASKS — Shows all active task worktrees               ║
# ╚══════════════════════════════════════════════════════════════╝

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo ""
echo "  Active task workspaces:"
echo "  ─────────────────────────────────────────"

cd "$REPO_ROOT"
FOUND=0
git worktree list | while read -r line; do
  if echo "$line" | grep -q "task/"; then
    FOUND=1
    WPATH=$(echo "$line" | awk '{print $1}')
    BRANCH=$(echo "$line" | grep -o '\[.*\]' | tr -d '[]')
    COMMIT=$(echo "$line" | awk '{print $2}')
    echo "  Branch:   $BRANCH"
    echo "  Path:     $WPATH"
    echo "  Commit:   $COMMIT"
    echo ""
  fi
done

if [ "$FOUND" = "0" ]; then
  echo "  No active tasks. Create one with:"
  echo "    ./scripts/new-task.sh \"description\""
fi

echo ""
