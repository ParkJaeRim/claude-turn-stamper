# claude-turn-stamper

**[KR]** Claude Code 대화 턴 종료 시각을 기록하고 HUD statusline에 표시하는 툴
**[EN]** A Claude Code tool that stamps and displays the end time of each conversation turn in the HUD statusline.

---

## Features / 기능

- ⏱ 매 턴 종료 시각 기록 / Stamps the end time of each conversation turn
- 📊 오늘 통계 확인 / View today's stats (turns, total wait time, avg)
- 🖥 HUD statusline 표시 / Display in HUD statusline
- 🔀 멀티 인스턴스 지원 / Multi-instance support (multiple tabs + IDE simultaneously)

---

## Requirements / 요구사항

- Node.js
- Claude Code

---

## Installation / 설치

### 1. Install globally / 전역 설치

```bash
npm install -g claude-turn-stamper
```

### 2. Register Stop hook / Stop 훅 등록

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

### 3. Configure statusLine / statusLine 설정

**Option A: With oh-my-claudecode (OMC) / OMC 사용 시**

Download [`omc-hud-wrapper.sh`](./omc-hud-wrapper.sh) to `~/.claude/hud/` and add to `settings.json`:

```json
"statusLine": {
  "type": "command",
  "command": "zsh ~/.claude/hud/omc-hud-wrapper.sh"
}
```

Result / 결과:
```
[OMC] claude-sonnet-4-6 45% session:12m | ⏱ turn ended: 18:32:05
```

**Option B: Without OMC / OMC 미사용 시**

```json
"statusLine": {
  "type": "command",
  "command": "turn-stamper status"
}
```

Result / 결과:
```
⏱ turn ended: 18:32:05
```

---

## Commands / 커맨드

| Command | Description (EN) | 설명 (KR) |
|---------|-----------------|-----------|
| `turn-stamper` | Stop hook — records turn end time | Stop 훅 실행 — 턴 종료 시각 기록 |
| `turn-stamper stats` | Show today's stats | 오늘 통계 출력 |
| `turn-stamper status` | statusLine output (Option B) | statusLine용 출력 (Option B) |

### `turn-stamper stats` example / 예시

```
--- Today's Claude Stats ---
Turns      : 12
Total wait : 8m 43s
Avg / turn : 43.6s
```

---

## How it works / 동작 방식

**[EN]**
1. Claude Code fires the `Stop` hook when a response ends
2. `turn-stamper` records the timestamp to `~/.conv-timer/last_<id>.txt`
3. The statusLine command reads this file and displays the time

**[KR]**
1. Claude Code가 응답을 완료하면 `Stop` 훅 실행
2. `turn-stamper`가 `~/.conv-timer/last_<id>.txt`에 시각 기록
3. statusLine 커맨드가 해당 파일을 읽어 화면에 표시

Each Claude Code instance is tracked separately using `CLAUDE_TAB` env var or process PID — supporting multiple terminal tabs and IDE windows simultaneously.
각 Claude Code 인스턴스는 `CLAUDE_TAB` 환경변수 또는 프로세스 PID로 구분되어, 터미널 탭과 IDE를 동시에 사용해도 각각 독립적으로 기록됩니다.

---

## License

MIT
