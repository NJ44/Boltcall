#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║  LIST TASKS — Shows all active task worktrees               ║
# ╚══════════════════════════════════════════════════════════════╝

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo ""
echo "  Active task workspaces:"
echo "  ─────────────────────────────────────────"

cd "$REPO_ROOT"
TASK_LINES=$(git worktree list | grep "task/")

if [ -z "$TASK_LINES" ]; then
  echo "  No active tasks. Create one with:"
  echo "    ./scripts/new-task.sh \"description\""
else
  echo "$TASK_LINES" | while read -r line; do
    WPATH=$(echo "$line" | awk '{print $1}')
    BRANCH=$(echo "$line" | grep -o '\[.*\]' | tr -d '[]')
    COMMIT=$(echo "$line" | awk '{print $2}')
    echo "  Branch:   $BRANCH"
    echo "  Path:     $WPATH"
    echo "  Commit:   $COMMIT"
    echo ""
  done
fi

echo ""
