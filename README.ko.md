# claude-turn-stamper

Claude Code 대화 턴 종료 시각을 기록하고 HUD statusline에 표시하는 툴

> Claude에게 일을 시켜놓고 딴짓하러 갔다가, 한참 만에 돌아와서야 이미 오래전에 끝났다는 걸 알게 되는 그 묘한 죄책감. 아시죠? 그걸 줄이기 위해 만들었습니다.

> English docs: [README.md](./README.md)

---

## 기능

- ⏱ 매 턴 종료 시각 기록
- 📊 오늘 통계 확인 (턴 수, 총 대기 시간, 평균)
- 🖥 HUD statusline 표시
- 🔀 멀티 인스턴스 지원 (터미널 탭 + IDE 동시 사용)

---

## 요구사항

- Node.js
- Claude Code

---

## 설치

### 1. 전역 설치

```bash
npm install -g claude-turn-stamper
```

### 2. Stop 훅 등록

`~/.claude/settings.json`에 추가:

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

### 3. statusLine 설정

**Option A: oh-my-claudecode (OMC) 사용 시**

[`omc-hud-wrapper.sh`](./omc-hud-wrapper.sh)를 `~/.claude/hud/`에 다운로드 후 `settings.json`에 추가:

```json
"statusLine": {
  "type": "command",
  "command": "zsh ~/.claude/hud/omc-hud-wrapper.sh"
}
```

결과:
```
[OMC] claude-sonnet-4-6 45% session:12m | ⏱ turn ended: 18:32:05
```

**Option B: OMC 미사용 시**

```json
"statusLine": {
  "type": "command",
  "command": "turn-stamper status"
}
```

결과:
```
⏱ turn ended: 18:32:05
```

---

## 커맨드

| 커맨드 | 설명 |
|--------|------|
| `turn-stamper` | Stop 훅 실행 — 턴 종료 시각 기록 |
| `turn-stamper stats` | 오늘 통계 출력 |
| `turn-stamper status` | statusLine용 출력 (Option B) |

### `turn-stamper stats` 예시

```
--- Today's Claude Stats ---
Turns      : 12
Total wait : 8m 43s
Avg / turn : 43.6s
```

---

## 동작 방식

1. Claude Code가 응답을 완료하면 `Stop` 훅 실행
2. `turn-stamper`가 `~/.conv-timer/last_<id>.txt`에 시각 기록
3. statusLine 커맨드가 해당 파일을 읽어 화면에 표시

각 Claude Code 인스턴스는 `CLAUDE_TAB` 환경변수 또는 프로세스 PID로 구분되어, 터미널 탭과 IDE를 동시에 사용해도 각각 독립적으로 기록됩니다.

---

## 라이선스

MIT
