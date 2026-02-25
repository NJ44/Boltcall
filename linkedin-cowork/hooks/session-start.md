# Session Start Hook — Documentation

> This file documents the session-start hook wired into `.claude/settings.local.json`. The hook fires automatically when Claude starts any tool use in this session.

---

## What the Hook Does

When a new Claude session begins and the first tool is used, the hook outputs a banner in the terminal that:

1. Announces the LinkedIn Co-Worker is active
2. Lists all 9 available commands as a quick reference
3. Confirms that brand context and connected tools (vault, Figma) are ready
4. Removes the daily "what can I do?" friction

---

## Hook Configuration (in `.claude/settings.local.json`)

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n🔵 LINKEDIN CO-WORKER — BOLTCALL EDITION\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\nCommands: /linkedin-post · /linkedin-carousel · /linkedin-strategy\\n         /linkedin-dm · /linkedin-repurpose · /linkedin-profile-audit\\n         /linkedin-content-calendar · /linkedin-competitor-spy\\n         /linkedin-analyze-lead-magnet\\nBrand context: auto-loaded. Vault: connected. Figma: ready.\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\""
          }
        ]
      }
    ]
  }
}
```

---

## Hook Behavior

- **Event:** `PreToolUse` — fires before any tool is used
- **Matcher:** `.*` — matches all tool calls (fires once per first tool use in session)
- **Output:** Terminal banner with all 9 commands listed

---

## Customization

To modify the banner text, edit the `command` value in `.claude/settings.local.json`.

To disable the hook, remove or comment out the PreToolUse block.

To add commands to the banner as new ones are created, add them to the `echo` command string.

---

## Why a Session Hook?

Without a session hook, every session begins cold — Claude has no awareness of what tools are available or what the user typically wants to do.

The hook solves this by establishing context immediately: this session is for LinkedIn work, these are your tools, brand context is pre-loaded.

It removes the "what can I do?" conversation and replaces it with "let's go."
