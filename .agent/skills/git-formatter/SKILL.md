# Skill: Git Commit Formatter

## Goal
Generate a conventional git commit message based on the staged changes.

## Instructions
1. Review the staged changes using `git diff --cached`.
2. Analyze the changes to determine the primary `type` (feat, fix, docs, style, refactor).
3. Identify the `scope` if applicable.
4. Write a concise `description` in the imperative mood (e.g., "add feature" not "added feature").
5. Output the final commit message in the format: `<type>(<scope>): <description>`.

## Constraints
- Do not use emojis.
- Do not exceed 50 characters in the subject line.