#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const TAB = process.env.CLAUDE_TAB || String(process.ppid);
const HISTORY_DIR = path.join(os.homedir(), '.conv-timer');
const HISTORY_FILE = path.join(HISTORY_DIR, 'history.jsonl');
const TEMP_FILE = `/tmp/.conv_timer_start_${TAB}`;
const LAST_FILE = path.join(HISTORY_DIR, `last_${TAB}.txt`);

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatDuration(ms) {
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const mins = Math.floor(ms / 60000);
  const secs = Math.round((ms % 60000) / 1000);
  return `${mins}m ${secs}s`;
}

function ensureDir() {
  if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
  }
}

function appendHistory(record) {
  ensureDir();
  fs.appendFileSync(HISTORY_FILE, JSON.stringify(record) + '\n', 'utf8');
}

function readTodayRecords() {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  const today = new Date().toDateString();
  const lines = fs.readFileSync(HISTORY_FILE, 'utf8').split('\n').filter(Boolean);
  return lines
    .map(l => { try { return JSON.parse(l); } catch (_) { return null; } })
    .filter(r => r && new Date(r.endTime).toDateString() === today);
}

const args = process.argv.slice(2);

if (args[0] === 'start') {
  // UserPromptSubmit hook — record when user sends message
  fs.writeFileSync(TEMP_FILE, new Date().toISOString(), 'utf8');
} else if (args[0] === 'status') {
  // statusLine mode (for users without OMC HUD)
  try {
    const raw = fs.readFileSync(LAST_FILE, 'utf8').trim();
    const time = raw.match(/\d{2}:\d{2}:\d{2}/)?.[0] || '';
    console.log(time ? `⏱ turn ended: ${time}` : '');
  } catch (_) {
    console.log('');
  }
} else if (args[0] === 'stats') {
  const records = readTodayRecords();
  if (records.length === 0) {
    console.log('No data for today yet.');
    process.exit(0);
  }
  const totalMs = records.reduce((sum, r) => sum + (r.durationMs || 0), 0);
  const avgMs = totalMs / records.length;
  console.log('--- Today\'s Claude Stats ---');
  console.log(`Turns      : ${records.length}`);
  console.log(`Total wait : ${formatDuration(totalMs)}`);
  console.log(`Avg / turn : ${formatDuration(avgMs)}`);
} else {
  // Stop hook mode
  const now = new Date();

  let durationMs = null;
  try {
    const raw = fs.readFileSync(TEMP_FILE, 'utf8');
    const startTime = new Date(raw.trim());
    durationMs = now - startTime;
  } catch (_) {}

  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const durationStr = durationMs !== null ? ` (took ${formatDuration(durationMs)})` : '';
  const message = `[${date} ${time}] Turn ended${durationStr}\n`;

  ensureDir();
  fs.writeFileSync(LAST_FILE, message, 'utf8');

  appendHistory({ endTime: now.toISOString(), durationMs });
  fs.writeFileSync(TEMP_FILE, now.toISOString(), 'utf8');
}
