# claude-turn-stamper

A Claude Code tool that stamps and displays the end time of each conversation turn in the HUD statusline.

> You told Claude to handle it, swore you'd be "right back" — and came back to find it finished who-knows-how-long ago. Sound familiar? That's exactly why this exists. Stop wasting time. Know when Claude's done.

> 한국어 문서: [README.ko.md](./README.ko.md)

---

## Features

- ⏱ Stamps the end time of each conversation turn
- 📊 View today's stats (turns, total wait time, avg)
- 🖥 Display in HUD statusline
- 🔀 Multi-instance support (multiple tabs + IDE simultaneously)

---

## Requirements

- Node.js
- Claude Code

---

## Installation

### 1. Install globally

```bash
npm install -g claude-turn-stamper
```

### 2. Register Stop hook

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "turn-stamper"
          }
        ]
      }
    ]
  }
}
```

### 3. Configure statusLine

**Option A: With oh-my-claudecode (OMC)**

Download [`omc-hud-wrapper.sh`](./omc-hud-wrapper.sh) to `~/.claude/hud/` and add to `settings.json`:

```json
"statusLine": {
  "type": "command",
  "command": "zsh ~/.claude/hud/omc-hud-wrapper.sh"
}
```

Result:
```
[OMC] claude-sonnet-4-6 45% session:12m | ⏱ turn ended: 18:32:05
```

**Option B: Without OMC**

```json
"statusLine": {
  "type": "command",
  "command": "turn-stamper status"
}
```

Result:
```
⏱ turn ended: 18:32:05
```

---

## Commands

| Command | Description |
|---------|-------------|
| `turn-stamper` | Stop hook — records turn end time |
| `turn-stamper stats` | Show today's stats |
| `turn-stamper status` | statusLine output (Option B) |

### `turn-stamper stats` example

```
--- Today's Claude Stats ---
Turns      : 12
Total wait : 8m 43s
Avg / turn : 43.6s
```

---

## How it works

1. Claude Code fires the `Stop` hook when a response ends
2. `turn-stamper` records the timestamp to `~/.conv-timer/last_<id>.txt`
3. The statusLine command reads this file and displays the time

Each Claude Code instance is tracked separately using `CLAUDE_TAB` env var or process PID — supporting multiple terminal tabs and IDE windows simultaneously.

---

## License

MIT
