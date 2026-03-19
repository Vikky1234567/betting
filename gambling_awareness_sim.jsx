<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VegaBet — Gambling Awareness Simulation</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
/* ============================================================
   CSS VARIABLES & RESET
   ============================================================ */
:root {
  --bg: #07070f;
  --bg2: #0d0d1a;
  --bg3: #141420;
  --border: #1e1e30;
  --border2: #2a2a40;
  --accent: #ff6b35;
  --accent2: #ff3300;
  --green: #00ff88;
  --red: #ff4444;
  --gold: #ffd700;
  --text: #e0e0f0;
  --text2: #9090aa;
  --text3: #606078;
  --font-display: 'Orbitron', sans-serif;
  --font-body: 'Rajdhani', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  min-height: 100vh;
  overflow-x: hidden;
}
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }
input, button { font-family: var(--font-body); }
button { cursor: pointer; border: none; outline: none; }

/* ============================================================
   UTILITY
   ============================================================ */
.glow-accent { text-shadow: 0 0 20px var(--accent), 0 0 40px #ff3a0088; }
.glow-green  { text-shadow: 0 0 15px var(--green); color: var(--green); }
.glow-red    { text-shadow: 0 0 15px var(--red); color: var(--red); }
.mono        { font-family: var(--font-mono); }
.hidden      { display: none !important; }

/* ============================================================
   ANIMATIONS
   ============================================================ */
@keyframes pulse      { 0%,100%{opacity:1} 50%{opacity:.4} }
@keyframes spin       { to{transform:rotate(360deg)} }
@keyframes slideInR   { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
@keyframes slideInU   { from{transform:translateY(30px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes popIn      { 0%{transform:scale(.6);opacity:0} 70%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
@keyframes flashGreen { 0%,100%{background:transparent} 50%{background:#00ff8820} }
@keyframes flashRed   { 0%,100%{background:transparent} 50%{background:#ff444420} }
@keyframes glitch     { 0%,100%{transform:none} 20%{transform:skewX(-3deg)} 40%{transform:skewX(2deg)} }
@keyframes scanline   { 0%{top:-10%} 100%{top:110%} }
@keyframes countDown  { from{stroke-dashoffset:0} to{stroke-dashoffset:126} }
@keyframes reel       { 0%{transform:translateY(0)} 100%{transform:translateY(-300px)} }
@keyframes crashRise  { from{transform:scale(.8) translateY(10px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
@keyframes neonBorder { 0%,100%{box-shadow:0 0 8px var(--accent)} 50%{box-shadow:0 0 24px var(--accent),0 0 40px var(--accent2)} }
@keyframes floatUp    { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-60px);opacity:0} }
@keyframes shake      { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }

.pulse      { animation: pulse 2s infinite; }
.spin-anim  { animation: spin .6s linear infinite; }

/* ============================================================
   LAYOUT
   ============================================================ */
#app {
  display: grid;
  grid-template-rows: 40px 1fr;
  min-height: 100vh;
}

/* TOP DISCLAIMER BAR */
#disclaimer-bar {
  background: linear-gradient(90deg, #1a0800, #0d0d1a, #1a0800);
  border-bottom: 1px solid #ff6b3530;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-size: 11px;
  color: var(--accent);
  font-family: var(--font-mono);
  position: sticky;
  top: 0;
  z-index: 1000;
}
#disclaimer-bar .reality-btn {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-family: var(--font-mono);
  transition: all .2s;
  white-space: nowrap;
}
#disclaimer-bar .reality-btn:hover,
#disclaimer-bar .reality-btn.active {
  background: var(--accent);
  color: #000;
}

/* MAIN GRID */
#main-grid {
  display: grid;
  grid-template-columns: 220px 1fr 260px;
  height: calc(100vh - 40px);
  overflow: hidden;
}

/* LEFT SIDEBAR */
#sidebar-left {
  background: var(--bg2);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  gap: 12px;
  overflow-y: auto;
}

/* CENTER CONTENT */
#content-area {
  overflow-y: auto;
  padding: 24px;
  background: radial-gradient(ellipse at 50% 0%, #1a0a0020 0%, transparent 60%), var(--bg);
}

/* RIGHT SIDEBAR */
#sidebar-right {
  background: var(--bg2);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ============================================================
   CARDS
   ============================================================ */
.card {
  background: linear-gradient(135deg, var(--bg3), var(--bg2));
  border: 1px solid var(--border2);
  border-radius: 10px;
  padding: 16px;
  position: relative;
}
.card-accent {
  border-color: #ff6b3540;
  background: linear-gradient(135deg, #1a0e0a, #140d0a);
}
.card-green {
  border-color: #00ff8830;
  background: linear-gradient(135deg, #0a1a0f, #0d1a12);
}

/* ============================================================
   LOGO
   ============================================================ */
.logo-wrap {
  text-align: center;
  padding: 8px 0 12px;
  border-bottom: 1px solid var(--border);
}
.logo-text {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 2px;
}
.logo-text span { color: var(--accent); }
.logo-sub {
  font-size: 9px;
  color: var(--text3);
  font-family: var(--font-mono);
  letter-spacing: 3px;
  margin-top: 2px;
}

/* ============================================================
   WALLET CARD
   ============================================================ */
.wallet-card { text-align: center; }
.wallet-label { font-size: 10px; color: var(--text3); font-family: var(--font-mono); letter-spacing: 2px; margin-bottom: 4px; }
.wallet-amount {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  transition: color .3s;
}
.wallet-amount.low { color: var(--red); animation: pulse 1s infinite; }
.wallet-pnl { font-size: 12px; margin-top: 4px; }
.wallet-btns { display: flex; gap: 8px; margin-top: 10px; }
.btn-deposit {
  flex: 1;
  background: linear-gradient(135deg, #00c853, #00e676);
  color: #000;
  padding: 8px;
  border-radius: 6px;
  font-size: 12px;
  font-family: var(--font-display);
  font-weight: 700;
  transition: all .2s;
}
.btn-deposit:hover { transform: scale(1.04); box-shadow: 0 0 16px #00e67660; }
.btn-withdraw {
  flex: 1;
  background: transparent;
  border: 1px solid var(--border2);
  color: var(--text2);
  padding: 8px;
  border-radius: 6px;
  font-size: 12px;
  transition: all .2s;
  position: relative;
}
.btn-withdraw:hover { border-color: var(--accent); color: var(--accent); }

/* ============================================================
   NAV
   ============================================================ */
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text2);
  font-size: 14px;
  font-family: var(--font-body);
  font-weight: 600;
  transition: all .2s;
  text-align: left;
  width: 100%;
}
.nav-item:hover { border-color: #ff6b3540; color: var(--accent); }
.nav-item.active { background: #ff6b3315; border-color: #ff6b3545; color: var(--accent); }
.nav-icon { font-size: 16px; width: 20px; text-align: center; }

/* ============================================================
   ADDICTION SCORE
   ============================================================ */
.addict-bar-wrap {
  height: 6px;
  background: var(--bg);
  border-radius: 3px;
  overflow: hidden;
  margin: 6px 0;
}
.addict-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 1s, background .5s;
}

/* ============================================================
   BUTTONS
   ============================================================ */
.btn-primary {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #fff;
  padding: 11px 22px;
  border-radius: 7px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 1px;
  transition: all .2s;
  border: none;
}
.btn-primary:hover:not(:disabled) { transform: scale(1.04); box-shadow: 0 0 20px #ff6b3550; }
.btn-primary:disabled { opacity: .45; cursor: not-allowed; }

.btn-green-big {
  background: linear-gradient(135deg, #00c853, #00e676);
  color: #000;
  padding: 14px 28px;
  border-radius: 8px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 15px;
  transition: all .2s;
  border: none;
}
.btn-green-big:hover { transform: scale(1.05); box-shadow: 0 0 24px #00e67660; }

.btn-secondary {
  background: transparent;
  border: 1px solid var(--border2);
  color: var(--text2);
  padding: 10px 18px;
  border-radius: 7px;
  font-size: 13px;
  transition: all .2s;
}
.btn-secondary:hover { border-color: var(--accent); color: var(--accent); }

.btn-ghost {
  background: transparent;
  border: none;
  color: var(--text3);
  font-size: 11px;
  padding: 6px 10px;
  border-radius: 4px;
  transition: all .2s;
}
.btn-ghost:hover { color: var(--accent); }

/* ============================================================
   TABS
   ============================================================ */
.tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; }
.tab-btn {
  padding: 7px 14px;
  border-radius: 6px;
  border: 1px solid var(--border2);
  background: transparent;
  color: var(--text2);
  font-size: 13px;
  font-family: var(--font-body);
  font-weight: 600;
  transition: all .2s;
}
.tab-btn:hover { border-color: var(--accent); color: var(--accent); }
.tab-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }

/* ============================================================
   REALITY TAG
   ============================================================ */
.reality-tag {
  position: absolute;
  top: -8px;
  right: 8px;
  background: var(--accent);
  color: #000;
  font-size: 9px;
  font-family: var(--font-mono);
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 3px;
  z-index: 10;
  white-space: nowrap;
  pointer-events: none;
}
.reality-outline { outline: 2px solid var(--accent) !important; outline-offset: 3px; }

/* ============================================================
   LIVE FEED (RIGHT SIDEBAR)
   ============================================================ */
#feed-header {
  padding: 14px 14px 10px;
  border-bottom: 1px solid var(--border);
  font-family: var(--font-display);
  font-size: 11px;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.live-dot {
  width: 7px; height: 7px;
  background: var(--accent);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}
#feed-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}
.feed-item {
  padding: 7px 10px;
  margin-bottom: 5px;
  border-radius: 6px;
  border-left: 3px solid;
  font-size: 12px;
  animation: slideInR .3s ease-out;
  line-height: 1.4;
}
.feed-item.win { border-color: var(--green); background: #00ff8808; color: #aaffcc; }
.feed-item.loss { border-color: var(--accent); background: #ff6b3508; color: #ffccaa; }
.feed-time { font-size: 10px; color: var(--text3); margin-top: 2px; }

#leaderboard {
  padding: 12px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}
.lb-header {
  font-family: var(--font-display);
  font-size: 10px;
  color: var(--text3);
  letter-spacing: 2px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.lb-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
  font-size: 12px;
}
.lb-item:last-child { border-bottom: none; }

/* ============================================================
   SCREENS
   ============================================================ */
.screen { display: none; animation: slideInU .25s ease-out; }
.screen.active { display: block; }

/* ---- PAGE HEADERS ---- */
.page-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 900;
  margin-bottom: 6px;
}
.page-sub { font-size: 13px; color: var(--text2); margin-bottom: 20px; }

/* ============================================================
   GAME LOBBY
   ============================================================ */
.game-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }
.game-card {
  background: linear-gradient(135deg, var(--bg3), var(--bg2));
  border: 1px solid var(--border2);
  border-radius: 12px;
  padding: 22px 18px;
  cursor: pointer;
  transition: all .2s;
  position: relative;
  overflow: hidden;
}
.game-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--accent) 0%, transparent 60%);
  opacity: 0;
  transition: opacity .3s;
}
.game-card:hover::before { opacity: .06; }
.game-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px #ff6b3520; border-color: #ff6b3540; }
.game-card.selected { border-color: var(--accent); background: linear-gradient(135deg, #1a1020, var(--bg2)); }
.game-emoji { font-size: 40px; margin-bottom: 8px; display: block; }
.game-name { font-family: var(--font-display); font-size: 14px; font-weight: 700; margin-bottom: 4px; }
.game-desc { font-size: 12px; color: var(--text2); }
.game-cta { margin-top: 10px; font-size: 12px; color: var(--accent); font-weight: 600; }
.game-odds {
  position: absolute; top: 8px; right: 8px;
  background: #ff6b3520; border: 1px solid #ff6b3540;
  color: var(--accent); font-size: 10px;
  font-family: var(--font-mono); padding: 2px 7px; border-radius: 3px;
  display: none;
}
body.reality-on .game-odds { display: block; }

/* ============================================================
   GAME SCREEN
   ============================================================ */
.game-title { font-family: var(--font-display); font-size: 22px; font-weight: 900; margin-bottom: 18px; }

/* Result banner */
#result-banner {
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 18px;
  text-align: center;
  animation: popIn .4s ease-out;
  display: none;
}
#result-banner.win { background: #00ff8812; border: 1px solid var(--green); animation: popIn .4s ease-out, flashGreen .5s ease-out; }
#result-banner.loss { background: #ff444412; border: 1px solid var(--red); animation: popIn .4s ease-out, flashRed .5s ease-out; }
#result-banner.near { background: #ffaa0012; border: 1px solid #ffaa00; animation: popIn .4s ease-out; }
.result-icon { font-size: 28px; }
.result-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; margin: 4px 0; }
.result-amount { font-family: var(--font-mono); font-size: 22px; font-weight: 700; }
.reality-prob-note { font-size: 11px; color: var(--accent); margin-top: 8px; display: none; }
body.reality-on .reality-prob-note { display: block; }

/* Bet Amount */
.bet-section { margin-bottom: 14px; }
.bet-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--text3); margin-bottom: 6px; font-family: var(--font-mono); }
.bet-amount-display { color: var(--accent); font-size: 16px; font-weight: 700; }
#bet-slider { width: 100%; accent-color: var(--accent); margin-bottom: 10px; }
.bet-presets { display: flex; gap: 6px; flex-wrap: wrap; }
.bet-preset {
  background: transparent; border: 1px solid var(--border2);
  color: var(--text2); padding: 5px 10px;
  border-radius: 5px; font-size: 12px;
  transition: all .2s;
}
.bet-preset:hover { border-color: var(--accent); color: var(--accent); }
.bet-preset.allin { border-color: var(--red) !important; color: var(--red) !important; }

/* COIN */
.coin-wrap { text-align: center; padding: 20px 0; }
.coin {
  font-size: 80px;
  display: inline-block;
  transition: transform .8s cubic-bezier(.36,.07,.19,.97);
  cursor: default;
}
.coin.flipping { animation: spin .4s linear infinite; }
.coin-choice-btns { display: flex; gap: 14px; justify-content: center; margin-top: 16px; }

/* DICE */
.dice-wrap { text-align: center; padding: 16px 0; }
.dice-display { font-size: 80px; margin-bottom: 8px; transition: all .3s; }
.dice-display.rolling { animation: shake .1s linear infinite; }
.dice-choices { display: flex; gap: 8px; justify-content: center; margin-bottom: 14px; }
.dice-choice {
  width: 44px; height: 44px;
  border-radius: 8px;
  border: 2px solid var(--border2);
  background: transparent;
  color: var(--text2);
  font-size: 18px; font-weight: 700;
  transition: all .2s;
}
.dice-choice:hover { border-color: var(--accent); color: var(--accent); }
.dice-choice.selected { border-color: var(--accent); background: #ff6b3320; color: var(--accent); }

/* SLOTS */
.slots-wrap { text-align: center; padding: 16px 0; }
.slot-reels { display: flex; gap: 12px; justify-content: center; margin-bottom: 16px; }
.slot-reel {
  width: 70px; height: 80px;
  background: var(--bg);
  border: 2px solid var(--border2);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 42px;
  overflow: hidden;
  position: relative;
}
.slot-reel.spinning .slot-symbol { animation: reel .15s linear infinite; }
.near-match { border-color: #ffaa0080 !important; box-shadow: 0 0 12px #ffaa0040; }

/* CRASH */
.crash-wrap { text-align: center; }
.crash-screen {
  background: radial-gradient(ellipse at 50% 100%, #ff6b3510, transparent 60%), var(--bg);
  border: 1px solid var(--border2);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
}
.crash-screen::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  top: 50%;
  left: -50%;
  animation: scanline 3s linear infinite;
  opacity: .15;
}
.crash-multiplier {
  font-family: var(--font-display);
  font-size: 60px;
  font-weight: 900;
  transition: color .2s;
  animation: crashRise .3s ease-out;
}
.crash-multiplier.crashed { color: var(--red) !important; animation: shake .3s ease-out; }
.crash-multiplier.cashed { color: var(--green) !important; }
.crash-status { font-size: 14px; color: var(--text2); margin-top: 4px; }
.crash-potential { font-size: 13px; color: var(--text2); margin: 10px 0; }

/* ============================================================
   DASHBOARD
   ============================================================ */
.stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 18px; }
.stat-card { text-align: center; }
.stat-label { font-size: 10px; color: var(--text3); font-family: var(--font-mono); letter-spacing: 1px; margin-bottom: 4px; }
.stat-value { font-family: var(--font-display); font-size: 20px; font-weight: 700; }

.chart-wrap { margin-bottom: 18px; }
.chart-svg { width: 100%; height: 130px; }

.winloss-bar-wrap { height: 18px; border-radius: 6px; overflow: hidden; display: flex; margin: 8px 0; }
.winloss-green { background: var(--green); transition: width 1s; }
.winloss-red { flex: 1; background: var(--red); }

.bet-history { margin-top: 4px; }
.bh-header { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; font-size: 10px; color: var(--text3); font-family: var(--font-mono); padding: 0 0 8px; border-bottom: 1px solid var(--border); }
.bh-row { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; font-size: 12px; padding: 7px 0; border-bottom: 1px solid var(--bg2); align-items: center; }

/* ============================================================
   AWARENESS
   ============================================================ */
.awareness-section { border-left: 3px solid var(--accent); padding-left: 16px; margin-bottom: 16px; }
.awareness-section h3 { font-weight: 700; font-size: 15px; margin-bottom: 5px; }
.awareness-section p { color: var(--text2); font-size: 13px; line-height: 1.7; }
.helpline-item { padding: 10px 12px; background: var(--bg2); border-radius: 7px; margin-bottom: 6px; font-size: 13px; }

/* ============================================================
   PHISHING DEMO
   ============================================================ */
.phishing-step { display: none; animation: slideInU .3s ease-out; }
.phishing-step.active { display: block; }
.fake-url-bar {
  background: #1a0a00;
  border: 1px solid var(--accent);
  border-radius: 6px;
  padding: 7px 12px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--accent);
  margin-bottom: 14px;
}
.phishing-card {
  background: linear-gradient(135deg, var(--bg3), var(--bg2));
  border: 1px solid var(--border2);
  border-radius: 12px;
  padding: 32px 28px;
  text-align: center;
}
.form-field { text-align: left; margin-bottom: 12px; }
.form-field label { display: block; font-size: 11px; color: var(--text3); margin-bottom: 4px; font-family: var(--font-mono); }
.form-field input {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border2);
  border-radius: 7px;
  padding: 10px 12px;
  color: var(--text);
  font-size: 14px;
  font-family: var(--font-body);
  transition: border-color .2s;
}
.form-field input:focus { outline: none; border-color: var(--accent); }
.otp-input {
  text-align: center !important;
  font-size: 26px !important;
  letter-spacing: 14px !important;
  font-family: var(--font-mono) !important;
}

/* ============================================================
   MODALS
   ============================================================ */
.modal-overlay {
  position: fixed; inset: 0;
  background: #000000cc;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  display: none;
}
.modal-overlay.open { display: flex; }
.modal-box {
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: 14px;
  padding: 28px;
  max-width: 460px;
  width: 100%;
  position: relative;
  animation: popIn .3s ease-out;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-title { font-family: var(--font-display); font-size: 17px; color: var(--accent); margin-bottom: 14px; }
.modal-close {
  position: absolute; top: 14px; right: 14px;
  background: none; border: none;
  color: var(--text3); font-size: 20px; line-height: 1;
}
.modal-close:hover { color: var(--accent); }

/* Withdraw steps */
.withdraw-step { display: none; }
.withdraw-step.active { display: block; }
.step-indicator { font-size: 11px; color: var(--text3); font-family: var(--font-mono); margin-bottom: 12px; }
.friction-note {
  background: #ff6b3315;
  border: 1px solid #ff6b3540;
  border-radius: 7px;
  padding: 10px 12px;
  font-size: 12px;
  color: var(--accent);
  margin-bottom: 12px;
  display: none;
}
body.reality-on .friction-note { display: block; }

/* Bonus popup */
#bonus-popup .modal-box { border-color: #9b59b660; text-align: center; }
.bonus-icon { font-size: 52px; margin-bottom: 12px; }
.bonus-title { font-family: var(--font-display); font-size: 20px; color: var(--accent); margin-bottom: 8px; }
.bonus-sub { color: var(--text2); font-size: 13px; margin-bottom: 20px; line-height: 1.6; }
.bonus-small { font-size: 11px; color: var(--text3); }
.bonus-decline { font-size: 11px; color: var(--text3) !important; border-color: var(--text3) !important; }

/* Terms popup */
#terms-modal .modal-box { max-height: 60vh; }
.terms-body p { font-size: 11px; color: var(--text3); line-height: 1.7; margin-bottom: 10px; }

/* ============================================================
   FLOATING NOTIFICATIONS
   ============================================================ */
#notif-container {
  position: fixed;
  top: 48px; right: 14px;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}
.notif-item {
  background: var(--bg2);
  border: 1px solid #ff6b3530;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  max-width: 280px;
  box-shadow: 0 4px 20px #00000080;
  animation: slideInR .3s ease-out;
  pointer-events: all;
}

/* ============================================================
   PERSONALIZED MESSAGE BANNER
   ============================================================ */
#personal-msg {
  position: fixed;
  top: 80px; left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, var(--bg2), #1a0a2a);
  border: 1px solid #9b59b660;
  border-radius: 10px;
  padding: 11px 20px;
  font-size: 13px;
  text-align: center;
  z-index: 2500;
  box-shadow: 0 0 30px #9b59b620;
  max-width: 360px;
  animation: popIn .3s ease-out;
  display: none;
}
#personal-msg .reality-tag { position: static; display: none; margin-bottom: 4px; font-size: 9px; }
body.reality-on #personal-msg .reality-tag { display: inline-block; }

/* ============================================================
   COUNTDOWN TIMER
   ============================================================ */
#countdown-banner {
  position: fixed;
  bottom: 80px; left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #ff2200, var(--accent));
  border-radius: 10px;
  padding: 10px 22px;
  font-family: var(--font-display);
  font-size: 13px;
  z-index: 2500;
  box-shadow: 0 0 20px #ff3a0060;
  animation: neonBorder 1.5s infinite;
  display: none;
  white-space: nowrap;
  position: relative;
}

/* ============================================================
   CHAT BOT
   ============================================================ */
#chatbot {
  position: fixed;
  bottom: 18px; right: 274px;
  width: 310px;
  background: var(--bg2);
  border: 1px solid #00ff8840;
  border-radius: 12px;
  z-index: 1500;
  overflow: hidden;
  box-shadow: 0 0 30px #00ff8815;
  display: none;
}
#chatbot.open { display: block; animation: slideInU .3s ease-out; }
.chat-header {
  background: #0d1a0d;
  padding: 11px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #00ff8820;
}
.chat-header-title { color: var(--green); font-family: var(--font-display); font-size: 11px; }
.chat-messages {
  height: 220px;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.chat-msg {
  padding: 7px 11px;
  border-radius: 7px;
  font-size: 12px;
  max-width: 88%;
  line-height: 1.5;
}
.chat-msg.bot { background: #00ff8810; border: 1px solid #00ff8825; align-self: flex-start; }
.chat-msg.user { background: #ff6b3515; border: 1px solid #ff6b3530; align-self: flex-end; }
.chat-input-row { display: flex; gap: 6px; padding: 8px; border-top: 1px solid #00ff8820; }
.chat-input-row input {
  flex: 1; background: #0d1a0d;
  border: 1px solid #1a2a1a;
  border-radius: 6px; padding: 7px 10px;
  color: var(--text); font-size: 12px;
}
.chat-input-row input:focus { outline: none; border-color: var(--green); }
.chat-send { background: var(--green); color: #000; border-radius: 6px; padding: 7px 11px; font-weight: 700; font-size: 13px; transition: all .2s; }
.chat-send:hover { transform: scale(1.08); }

/* ============================================================
   CHAT TOGGLE BTN
   ============================================================ */
.chat-toggle-btn {
  background: #0d1a0d;
  border: 1px solid #00ff8830;
  border-radius: 7px;
  padding: 9px 12px;
  color: var(--green);
  font-size: 12px;
  font-family: var(--font-body);
  font-weight: 600;
  transition: all .2s;
  width: 100%;
  text-align: center;
}
.chat-toggle-btn:hover { border-color: var(--green); background: #0d220d; }

/* ============================================================
   FLOAT EFFECT (win/loss amounts)
   ============================================================ */
.float-text {
  position: fixed;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 900;
  pointer-events: none;
  z-index: 9999;
  animation: floatUp 1s ease-out forwards;
}

/* ============================================================
   REALITY MODE GLOBAL STYLES
   ============================================================ */
body.reality-on #reality-overlay-hint {
  position: fixed;
  bottom: 18px; left: 240px;
  background: #ff6b3320;
  border: 1px solid var(--accent);
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 12px;
  color: var(--accent);
  z-index: 100;
  font-family: var(--font-mono);
}

/* ============================================================
   MOBILE RESPONSIVE
   ============================================================ */
@media (max-width: 900px) {
  #main-grid { grid-template-columns: 1fr; grid-template-rows: auto 1fr auto; }
  #sidebar-left { flex-direction: row; flex-wrap: wrap; padding: 10px; border-right: none; border-bottom: 1px solid var(--border); overflow-x: auto; height: auto; }
  #sidebar-right { border-left: none; border-top: 1px solid var(--border); max-height: 200px; }
  .stats-grid { grid-template-columns: repeat(2,1fr); }
  .game-grid { grid-template-columns: 1fr; }
  #chatbot { right: 10px; bottom: 10px; width: 290px; }
}
</style>
</head>
<body>
<div id="app">

  <!-- ============================================================
       TOP DISCLAIMER BAR
       ============================================================ -->
  <div id="disclaimer-bar">
    <span>⚠️ SIMULATION ONLY — Educational project demonstrating gambling risks & manipulative design patterns. No real money involved.</span>
    <button class="reality-btn" id="reality-toggle-btn" onclick="toggleReality()">👁 Reveal Truth</button>
  </div>

  <!-- ============================================================
       MAIN GRID
       ============================================================ -->
  <div id="main-grid">

    <!-- LEFT SIDEBAR -->
    <div id="sidebar-left">
      <!-- Logo -->
      <div class="logo-wrap">
        <div class="logo-text">VEGA<span>BET</span></div>
        <div class="logo-sub">SIMULATION</div>
      </div>

      <!-- Wallet -->
      <div class="card wallet-card" id="wallet-card">
        <div class="wallet-label">BALANCE</div>
        <div class="wallet-amount glow-green" id="wallet-display">₹1,000</div>
        <div class="wallet-pnl" id="wallet-pnl">± ₹0</div>
        <div class="wallet-btns">
          <button class="btn-deposit" onclick="deposit()">+ Deposit</button>
          <button class="btn-withdraw" onclick="openWithdraw()" id="withdraw-btn">
            <span class="reality-tag" id="withdraw-rt" style="display:none">🚫 FRICTION</span>
            Withdraw
          </button>
        </div>
      </div>

      <!-- Nav -->
      <nav style="display:flex;flex-direction:column;gap:4px;">
        <button class="nav-item active" id="nav-lobby" onclick="showScreen('lobby')">
          <span class="nav-icon">🎮</span> Games
        </button>
        <button class="nav-item" id="nav-game" onclick="showScreen('game')">
          <span class="nav-icon">🎯</span> Play Now
        </button>
        <button class="nav-item" id="nav-dashboard" onclick="showScreen('dashboard')">
          <span class="nav-icon">📊</span> Dashboard
        </button>
        <button class="nav-item" id="nav-awareness" onclick="showScreen('awareness')">
          <span class="nav-icon">🧠</span> Awareness
        </button>
        <button class="nav-item" id="nav-phishing" onclick="showScreen('phishing')">
          <span class="nav-icon">🎣</span> Phishing Demo
        </button>
      </nav>

      <!-- Addiction Score -->
      <div class="card" style="margin-top:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
          <span style="font-size:10px;color:var(--text3);font-family:var(--font-mono);">ADDICTION RISK</span>
          <span id="addict-score-val" style="font-size:13px;font-weight:700;color:var(--green)">0/100</span>
        </div>
        <div class="addict-bar-wrap">
          <div class="addict-bar" id="addict-bar" style="width:0%;background:var(--green)"></div>
        </div>
        <div id="addict-warn" style="font-size:11px;color:var(--red);margin-top:5px;display:none">⚠️ High risk behavior detected</div>
      </div>

      <!-- Chat toggle -->
      <button class="chat-toggle-btn" onclick="toggleChat()">🤖 Safety AI Assistant</button>
    </div>

    <!-- CENTER CONTENT AREA -->
    <div id="content-area">

      <!-- ==================== LOBBY SCREEN ==================== -->
      <div class="screen active" id="screen-lobby">
        <h1 class="page-title glow-accent">GAME LOBBY</h1>
        <p class="page-sub">Choose your game. Remember — the house always wins.</p>

        <div id="reality-lobby-note" class="card card-accent" style="display:none;margin-bottom:16px;font-size:12px;color:var(--accent);line-height:1.8;">
          🔍 <strong>REALITY MODE ON:</strong><br>
          • Win probability starts at 72% to hook you, then drops to 22% after 15 rounds<br>
          • "Near miss" results are deliberately injected every ~3rd loss<br>
          • Live feed users are entirely fabricated — no real players exist<br>
          • Odds displayed are higher than actual programmed values
        </div>

        <div class="game-grid">
          <div class="game-card" id="gc-coin" onclick="selectGame('coin')">
            <span class="game-odds">~45% actual</span>
            <span class="game-emoji">🪙</span>
            <div class="game-name">COIN TOSS</div>
            <div class="game-desc">Simple 50/50… or is it?</div>
            <div class="game-cta">PLAY NOW →</div>
          </div>
          <div class="game-card" id="gc-dice" onclick="selectGame('dice')">
            <span class="game-odds">~38% actual</span>
            <span class="game-emoji">🎲</span>
            <div class="game-name">DICE ROLL</div>
            <div class="game-desc">Pick 1-6, beat the house</div>
            <div class="game-cta">PLAY NOW →</div>
          </div>
          <div class="game-card" id="gc-slots" onclick="selectGame('slots')">
            <span class="game-odds">~28% actual</span>
            <span class="game-emoji">🎰</span>
            <div class="game-name">SLOT MACHINE</div>
            <div class="game-desc">Match 3 symbols to win</div>
            <div class="game-cta">PLAY NOW →</div>
          </div>
          <div class="game-card" id="gc-crash" onclick="selectGame('crash')">
            <span class="game-odds">~35% actual</span>
            <span class="game-emoji">📈</span>
            <div class="game-name">CRASH GAME</div>
            <div class="game-desc">Cash out before it crashes!</div>
            <div class="game-cta">PLAY NOW →</div>
          </div>
        </div>

        <!-- Recent bets preview -->
        <div class="card" id="recent-bets-card" style="display:none">
          <div style="font-family:var(--font-display);font-size:11px;color:var(--text3);letter-spacing:2px;margin-bottom:10px;">RECENT BETS</div>
          <div id="recent-bets-list"></div>
        </div>
      </div>

      <!-- ==================== GAME SCREEN ==================== -->
      <div class="screen" id="screen-game">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;">
          <h1 class="game-title" id="game-title">🪙 COIN TOSS</h1>
          <div id="streak-badge" style="display:none;background:var(--bg2);border:1px solid #ff6b3540;border-radius:6px;padding:4px 10px;font-size:13px;"></div>
        </div>

        <!-- Reality mode info -->
        <div id="reality-game-note" class="card card-accent" style="display:none;margin-bottom:14px;font-size:12px;color:#ff9955;line-height:1.7;">
          📊 Actual win probability: <strong id="actual-prob-display">72%</strong> (after <span id="rounds-display">0</span> rounds) |
          Near-miss injection: every ~3rd loss | House edge: <strong id="house-edge-display">28%</strong>
        </div>

        <!-- Result Banner -->
        <div id="result-banner">
          <div class="result-icon" id="result-icon">🎉</div>
          <div class="result-title" id="result-title">YOU WON!</div>
          <div class="result-amount" id="result-amount">+₹100</div>
          <div class="reality-prob-note" id="result-prob-note"></div>
        </div>

        <!-- Bet Amount -->
        <div class="card bet-section" id="bet-card" style="margin-bottom:14px;position:relative;">
          <span class="reality-tag" id="bet-rt" style="display:none">💸 LOSS ACCELERATOR</span>
          <div class="bet-label">
            <span>BET AMOUNT</span>
            <span class="bet-amount-display" id="bet-display">₹50</span>
          </div>
          <input type="range" id="bet-slider" min="10" max="5000" step="10" value="50" oninput="updateBet(this.value)">
          <div class="bet-presets">
            <button class="bet-preset" onclick="setBet(50)">₹50</button>
            <button class="bet-preset" onclick="setBet(100)">₹100</button>
            <button class="bet-preset" onclick="setBet(200)">₹200</button>
            <button class="bet-preset" onclick="setBet(500)">₹500</button>
            <button class="bet-preset" onclick="setBet(1000)">₹1,000</button>
            <button class="bet-preset allin" onclick="betAllIn()">ALL IN 🔥</button>
          </div>
        </div>

        <!-- Game areas -->
        <div class="card" id="game-area-coin">
          <div class="coin-wrap">
            <div class="coin" id="coin-display">🪙</div>
            <div id="coin-result" style="font-size:15px;margin:8px 0;color:var(--text2);text-transform:uppercase;"></div>
            <div class="coin-choice-btns">
              <button class="btn-primary" style="min-width:140px;position:relative;" onclick="playCoin('heads')" id="btn-heads">
                <span class="reality-tag" id="heads-rt" style="display:none;top:-10px">~prob shown here</span>
                HEADS
              </button>
              <button class="btn-primary" style="min-width:140px;" onclick="playCoin('tails')" id="btn-tails">TAILS</button>
            </div>
          </div>
        </div>

        <div class="card" id="game-area-dice" style="display:none;">
          <div class="dice-wrap">
            <div class="dice-display" id="dice-display">🎲</div>
            <div style="font-size:12px;color:var(--text3);margin-bottom:8px;">PICK A NUMBER (1-6)</div>
            <div class="dice-choices" id="dice-choices">
              <button class="dice-choice selected" onclick="selectDice(1)">1</button>
              <button class="dice-choice" onclick="selectDice(2)">2</button>
              <button class="dice-choice" onclick="selectDice(3)">3</button>
              <button class="dice-choice" onclick="selectDice(4)">4</button>
              <button class="dice-choice" onclick="selectDice(5)">5</button>
              <button class="dice-choice" onclick="selectDice(6)">6</button>
            </div>
            <button class="btn-primary" id="btn-roll" onclick="playDice()" style="margin-top:8px;">🎲 ROLL DICE</button>
            <div id="dice-result-text" style="margin-top:10px;font-size:14px;"></div>
          </div>
        </div>

        <div class="card" id="game-area-slots" style="display:none;">
          <div class="slots-wrap">
            <div class="slot-reels">
              <div class="slot-reel" id="reel0"><span class="slot-symbol">🍒</span></div>
              <div class="slot-reel" id="reel1"><span class="slot-symbol">🍋</span></div>
              <div class="slot-reel" id="reel2"><span class="slot-symbol">🔔</span></div>
            </div>
            <div id="slots-msg" style="font-size:14px;margin-bottom:12px;min-height:20px;"></div>
            <button class="btn-primary" id="btn-spin" onclick="playSlots()" style="min-width:180px;">🎰 SPIN!</button>
            <div style="margin-top:8px;font-size:11px;color:var(--text3);">3 match = 3× | 2 match = near-miss</div>
          </div>
        </div>

        <div id="game-area-crash" style="display:none;">
          <div class="crash-screen">
            <div class="crash-multiplier" id="crash-mult">1.00×</div>
            <div class="crash-status" id="crash-status">Press START to begin</div>
            <div class="crash-potential" id="crash-potential"></div>
          </div>
          <div style="display:flex;gap:12px;justify-content:center;">
            <button class="btn-primary" id="btn-crash-start" onclick="crashStart()" style="min-width:160px;">🚀 START GAME</button>
            <button class="btn-green-big" id="btn-crash-cashout" onclick="crashCashout()" style="display:none;min-width:180px;">💰 CASH OUT!</button>
          </div>
          <div id="crash-reality-note" style="display:none;margin-top:10px;font-size:11px;color:var(--accent);text-align:center;">
            📊 Crash games trigger maximum FOMO — rising multiplier activates greed; crashing triggers panic & re-bet
          </div>
        </div>
      </div>

      <!-- ==================== DASHBOARD SCREEN ==================== -->
      <div class="screen" id="screen-dashboard">
        <h1 class="page-title glow-accent">📊 ANALYTICS DASHBOARD</h1>
        <div id="reality-dash-note" class="card card-accent" style="display:none;margin-bottom:16px;font-size:12px;color:var(--accent);line-height:1.8;">
          💡 This dashboard shows your actual gambling behavior. Real platforms hide this data to prevent you seeing losses clearly.
        </div>

        <div class="stats-grid">
          <div class="card stat-card">
            <div class="stat-label">TOTAL BETS</div>
            <div class="stat-value" id="stat-total-bets" style="color:var(--text)">0</div>
          </div>
          <div class="card stat-card">
            <div class="stat-label">WIN RATE</div>
            <div class="stat-value" id="stat-win-rate">0%</div>
          </div>
          <div class="card stat-card">
            <div class="stat-label">NET P&L</div>
            <div class="stat-value" id="stat-net-pnl">₹0</div>
          </div>
          <div class="card stat-card">
            <div class="stat-label">TIME SPENT</div>
            <div class="stat-value" id="stat-time" style="color:#ffaa00">0m 0s</div>
          </div>
        </div>

        <!-- Balance Chart -->
        <div class="card chart-wrap">
          <div style="font-family:var(--font-display);font-size:11px;color:var(--text3);letter-spacing:2px;margin-bottom:10px;">BALANCE OVER TIME</div>
          <svg class="chart-svg" id="balance-chart" viewBox="0 0 600 120" preserveAspectRatio="none">
            <text x="300" y="65" text-anchor="middle" fill="#333" font-size="13" font-family="Rajdhani">Place some bets to see your balance history</text>
          </svg>
          <div style="display:flex;gap:16px;font-size:11px;color:var(--text3);margin-top:6px;">
            <span>— Starting balance</span>
            <span id="chart-legend" style="color:var(--green)">— Your balance</span>
          </div>
        </div>

        <!-- Win/Loss bar -->
        <div class="card" style="margin-bottom:14px;">
          <div style="font-family:var(--font-display);font-size:11px;color:var(--text3);letter-spacing:2px;margin-bottom:10px;">WIN / LOSS BREAKDOWN</div>
          <div class="winloss-bar-wrap">
            <div class="winloss-green" id="wl-green" style="width:0%"></div>
            <div class="winloss-red"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-top:4px;">
            <span style="color:var(--green)">✅ Wins: <span id="stat-wins">0</span></span>
            <span style="color:var(--red)">❌ Losses: <span id="stat-losses">0</span></span>
          </div>
          <div id="reality-wl-note" style="display:none;margin-top:10px;font-size:11px;color:var(--accent);background:var(--bg);border-radius:6px;padding:8px;"></div>
        </div>

        <!-- Bet history -->
        <div class="card">
          <div style="font-family:var(--font-display);font-size:11px;color:var(--text3);letter-spacing:2px;margin-bottom:10px;">RECENT HISTORY</div>
          <div class="bh-header">
            <span>GAME</span><span>AMOUNT</span><span>RESULT</span><span>P&L</span>
          </div>
          <div id="bet-history-list">
            <div style="text-align:center;color:var(--text3);padding:20px;font-size:13px;">No bets yet. Start playing!</div>
          </div>
        </div>
      </div>

      <!-- ==================== AWARENESS SCREEN ==================== -->
      <div class="screen" id="screen-awareness">
        <h1 class="page-title glow-accent">🧠 AWARENESS EDUCATION</h1>
        <p class="page-sub">Understanding the tactics used to manipulate gamblers</p>

        <div class="tabs">
          <button class="tab-btn active" onclick="showAwareTab('psych',this)">🧠 Psychology</button>
          <button class="tab-btn" onclick="showAwareTab('math',this)">📊 Mathematics</button>
          <button class="tab-btn" onclick="showAwareTab('ux',this)">🎨 Dark UX</button>
          <button class="tab-btn" onclick="showAwareTab('cyber',this)">🔐 Cybersecurity</button>
        </div>

        <div id="aware-psych" class="aware-content">
          <div class="card" style="margin-bottom:14px;">
            <div class="awareness-section">
              <h3>Intermittent Reward Schedules</h3>
              <p>Gambling platforms use variable ratio reinforcement — the same mechanism that makes slot machines addictive. Wins are unpredictable, which creates stronger behavioral conditioning than consistent rewards. Your brain releases dopamine not just on wins, but on anticipation.</p>
            </div>
            <div class="awareness-section">
              <h3>Near-Miss Effect</h3>
              <p>When you "almost win" (two matching slots, dice landing one off), your brain processes it similarly to an actual win. Platforms deliberately engineer near-misses to maintain motivation without paying out. This simulation injects near-misses every ~3rd loss.</p>
            </div>
            <div class="awareness-section">
              <h3>Loss Chasing</h3>
              <p>After losses, the brain enters a hyperactivated state seeking to "recover" losses. Platforms exploit this with "Second Chance" bonuses and streak messaging, keeping users in a perpetual spending loop.</p>
            </div>
            <div class="awareness-section" style="border-color:var(--green)">
              <h3>Sunk Cost Fallacy</h3>
              <p>"I've already lost so much, I might as well keep going." This cognitive bias is amplified by time-limited bonus offers, countdown timers, and personalized messages. Every element of the UI is designed to prevent you from stopping.</p>
            </div>
          </div>
        </div>

        <div id="aware-math" class="aware-content" style="display:none;">
          <div class="card" style="margin-bottom:14px;">
            <div class="awareness-section">
              <h3>House Edge — The Mathematical Guarantee</h3>
              <p>Every game has a built-in house advantage. A coin toss paying 1.9× instead of 2× creates a 5% house edge. Over 1,000 bets of ₹100 each, you're expected to lose ₹5,000 regardless of luck.</p>
            </div>
            <div class="awareness-section">
              <h3>Gambler's Fallacy</h3>
              <p>Past results don't affect future odds. After 10 losses in a row, the probability of the next bet winning is identical to the first bet. Platforms exploit this by showing "hot streak" data and "due" number displays.</p>
            </div>
            <div class="awareness-section">
              <h3>Expected Value Calculation</h3>
              <p>If a coin toss pays 2× but has a 45% win rate: EV = (0.45 × ₹200) + (0.55 × ₹0) − ₹100 = −₹10 per bet. You're mathematically expected to lose ₹10 for every ₹100 wagered. Long-term profit is mathematically impossible.</p>
            </div>
            <div class="awareness-section" style="border-color:#ffaa00">
              <h3>This Simulation's Algorithm</h3>
              <p>Round 1-3: 72% win rate (hook phase). Round 4-7: 48% win rate. Round 8-15: 32% win rate. Round 16+: 22% win rate. Enable Reality Mode to see these probabilities in real-time while you play.</p>
            </div>
          </div>
        </div>

        <div id="aware-ux" class="aware-content" style="display:none;">
          <div class="card" style="margin-bottom:14px;">
            <div class="awareness-section">
              <h3>Asymmetric Button Design</h3>
              <p>Deposit buttons are bright green, prominent, and one-click. Withdrawal buttons are grey, hidden, and require 5 steps with a 3-5 day wait. This platform replicates this dark pattern — try clicking "Withdraw."</p>
            </div>
            <div class="awareness-section">
              <h3>Fake Urgency (Countdown Timers)</h3>
              <p>"Offer ends in 10 seconds!" creates artificial scarcity and pressures quick decisions without rational consideration. The offer is usually fake — it resets or extends automatically.</p>
            </div>
            <div class="awareness-section">
              <h3>Fabricated Social Proof</h3>
              <p>Live feeds showing "User123 just won ₹5,000!" are often entirely fabricated or heavily filtered to show only wins. This simulation's live feed is 100% computer-generated. Real loss data is never displayed publicly.</p>
            </div>
            <div class="awareness-section" style="border-color:var(--red)">
              <h3>Predatory Bonus Terms</h3>
              <p>Bonuses come with "wagering requirements" buried in 47-page terms. A ₹500 bonus might require ₹10,000 in bets before withdrawal — mathematically designed to be nearly impossible to clear profitably.</p>
            </div>
          </div>
        </div>

        <div id="aware-cyber" class="aware-content" style="display:none;">
          <div class="card" style="margin-bottom:14px;">
            <div class="awareness-section">
              <h3>Phishing Gambling Sites</h3>
              <p>Fraudulent gambling sites mimic real ones pixel-for-pixel to steal payment info and credentials. They allow early wins to build trust before the scam. See our Phishing Demo screen for an interactive walkthrough.</p>
            </div>
            <div class="awareness-section">
              <h3>Behavioral Data Harvesting</h3>
              <p>Real gambling platforms collect extensive data — bet frequency, loss patterns, session times, emotional state indicators — to build psychological profiles and optimize manipulation strategies per user.</p>
            </div>
            <div class="awareness-section">
              <h3>Unlicensed Operators</h3>
              <p>Many online gambling sites operate without proper licensing. Payouts can be refused citing obscure terms. Legal recourse is minimal. Always verify licensing with DGCA or MHA before any real-money platform.</p>
            </div>
          </div>
        </div>

        <!-- Help resources -->
        <div class="card card-green">
          <div style="font-family:var(--font-display);font-size:14px;color:var(--green);margin-bottom:12px;">🆘 Get Help — India Resources</div>
          <div class="helpline-item">📞 iCall (TISS): <strong>9152987821</strong></div>
          <div class="helpline-item">🌐 Gamblers Anonymous India: <strong>gamblersanonymous.org</strong></div>
          <div class="helpline-item">📱 NIMHANS Helpline: <strong>080-46110007</strong></div>
          <div class="helpline-item">🏥 Vandrevala Foundation: <strong>1860-2662-345</strong> (24×7)</div>
        </div>
      </div>

      <!-- ==================== PHISHING DEMO SCREEN ==================== -->
      <div class="screen" id="screen-phishing">
        <h1 class="page-title glow-accent">🎣 PHISHING DEMO</h1>
        <div class="card card-accent" style="margin-bottom:20px;font-size:13px;color:var(--accent);">
          ⚠️ EDUCATIONAL DEMO ONLY — Demonstrates how fake gambling sites steal credentials. No data is collected or stored anywhere.
        </div>

        <!-- Step 0: Info -->
        <div class="phishing-step active" id="ph-step0">
          <div class="card" style="margin-bottom:16px;">
            <div style="font-family:var(--font-display);font-size:15px;margin-bottom:16px;">How Phishing Gambling Sites Work</div>
            <div style="display:flex;flex-direction:column;gap:14px;font-size:14px;color:var(--text2);line-height:1.7;">
              <div style="display:flex;gap:12px;">
                <span style="background:var(--accent);color:#000;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;font-size:13px;">1</span>
                <span><strong style="color:var(--text)">Lure:</strong> SMS/email "You've won ₹10,000! Click to claim." URL mimics real site (v3gabets.xyz vs vegabet.com). Only 1-2 characters differ.</span>
              </div>
              <div style="display:flex;gap:12px;">
                <span style="background:var(--accent);color:#000;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;font-size:13px;">2</span>
                <span><strong style="color:var(--text)">Trust Building:</strong> Fake site lets you "win" small amounts initially. Virtual balance appears. Victims trust the platform and deposit real money.</span>
              </div>
              <div style="display:flex;gap:12px;">
                <span style="background:var(--accent);color:#000;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;font-size:13px;">3</span>
                <span><strong style="color:var(--text)">Credential Theft:</strong> Login page harvests your email + password. OTP pages capture your banking tokens for account takeover.</span>
              </div>
              <div style="display:flex;gap:12px;">
                <span style="background:var(--red);color:#fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;font-size:13px;">4</span>
                <span><strong style="color:var(--text)">Financial Loss:</strong> Attackers drain your email, reset banking passwords using stolen OTPs, and empty your accounts within minutes.</span>
              </div>
            </div>
          </div>
          <button class="btn-primary" style="width:100%;padding:14px;" onclick="nextPhishStep()">▶ Experience the Demo →</button>
        </div>

        <!-- Step 1: Fake login -->
        <div class="phishing-step" id="ph-step1">
          <div class="fake-url-bar">🔴 http://v3gabets-winprize.xyz/login — NOT the real site!</div>
          <div class="phishing-card">
            <div style="font-family:var(--font-display);font-size:22px;font-weight:900;color:var(--accent);margin-bottom:4px;">V3GABETS</div>
            <div style="color:var(--green);font-size:14px;margin-bottom:24px;">🎉 You've been selected! Claim your ₹10,000 prize!</div>
            <div style="max-width:320px;margin:0 auto;text-align:left;">
              <div class="form-field">
                <label>Email Address</label>
                <input type="email" id="ph-email" placeholder="your@email.com">
              </div>
              <div class="form-field">
                <label>Password</label>
                <input type="password" id="ph-pass" placeholder="••••••••">
              </div>
              <button class="btn-primary" style="width:100%;padding:13px;margin-top:4px;" onclick="nextPhishStep()">CLAIM MY ₹10,000 →</button>
              <div style="margin-top:10px;font-size:11px;color:var(--text3);text-align:center;">By continuing you agree to our Terms & Privacy Policy</div>
            </div>
          </div>
        </div>

        <!-- Step 2: OTP steal -->
        <div class="phishing-step" id="ph-step2">
          <div class="fake-url-bar">🔴 http://v3gabets-winprize.xyz/verify — Stealing bank OTP now!</div>
          <div class="phishing-card">
            <div style="font-size:52px;margin-bottom:12px;">🏦</div>
            <div style="font-family:var(--font-display);font-size:16px;margin-bottom:8px;">Bank Verification Required</div>
            <div style="color:var(--text2);font-size:14px;margin-bottom:24px;line-height:1.6;">To transfer your prize of ₹10,000, please enter the OTP sent to your registered bank mobile number.</div>
            <div style="max-width:240px;margin:0 auto;">
              <input type="text" class="otp-input" id="ph-otp" placeholder="••••••" maxlength="6" style="width:100%;background:var(--bg);border:1px solid var(--border2);border-radius:8px;padding:14px;color:var(--text);font-size:28px;text-align:center;letter-spacing:12px;font-family:var(--font-mono);">
              <button class="btn-primary" style="width:100%;padding:13px;margin-top:12px;" onclick="nextPhishStep()">VERIFY & CLAIM →</button>
            </div>
          </div>
        </div>

        <!-- Step 3: Reveal -->
        <div class="phishing-step" id="ph-step3">
          <div class="card card-green" style="text-align:center;padding:40px;">
            <div style="font-size:52px;margin-bottom:16px;">🎓</div>
            <div style="font-family:var(--font-display);font-size:20px;color:var(--green);margin-bottom:12px;">DEMO COMPLETE</div>
            <p style="color:var(--text2);font-size:14px;line-height:1.8;max-width:420px;margin:0 auto 20px;">
              In a real phishing attack, you just surrendered your email, password, and banking OTP.
              Attackers can now access your email, reset all linked accounts, and drain your bank within minutes.
            </p>
            <div style="text-align:left;background:var(--bg);border-radius:8px;padding:16px;margin-bottom:16px;font-size:13px;">
              <strong style="color:var(--accent)">🛡️ Protect Yourself:</strong>
              <ul style="color:var(--text2);margin-top:8px;padding-left:16px;line-height:2.2;">
                <li>Always check the EXACT URL before entering any credentials</li>
                <li>Never enter your bank OTP on any gambling site</li>
                <li>Use unique passwords for every website</li>
                <li>Enable 2FA on email and banking apps</li>
                <li>Verify prize claims through official channels only</li>
                <li>Real prize notifications never ask for OTPs</li>
              </ul>
            </div>
            <button class="btn-secondary" onclick="resetPhish()">← Restart Demo</button>
          </div>
        </div>
      </div>

    </div><!-- end content-area -->

    <!-- RIGHT SIDEBAR -->
    <div id="sidebar-right">
      <div id="feed-header">
        <div class="live-dot"></div>
        LIVE ACTIVITY
        <span id="feed-fake-tag" style="display:none;font-size:9px;background:var(--accent);color:#000;padding:2px 5px;border-radius:3px;font-family:var(--font-mono);">FAKE</span>
      </div>
      <div id="feed-list"></div>
      <div id="leaderboard">
        <div class="lb-header">
          🏆 TOP WINNERS TODAY
          <span id="lb-fake-tag" style="display:none;font-size:9px;background:var(--accent);color:#000;padding:2px 5px;border-radius:3px;font-family:var(--font-mono);">FABRICATED</span>
        </div>
        <div id="lb-list"></div>
      </div>
    </div>

  </div><!-- end main-grid -->
</div><!-- end app -->

<!-- ============================================================
     NOTIFICATIONS CONTAINER
     ============================================================ -->
<div id="notif-container"></div>

<!-- ============================================================
     PERSONALIZED MESSAGE
     ============================================================ -->
<div id="personal-msg">
  <span class="reality-tag">🎯 AI PROFILING</span>
  <span id="personal-msg-text"></span>
</div>

<!-- ============================================================
     COUNTDOWN BANNER
     ============================================================ -->
<div id="countdown-banner">
  <span id="countdown-reality-tag" style="display:none;background:#000;color:var(--accent);font-size:9px;padding:2px 6px;border-radius:3px;margin-right:8px;font-family:var(--font-mono);">⏰ FAKE URGENCY</span>
  🔥 SPECIAL OFFER — DOUBLE WINNINGS ENDS IN <span id="countdown-val">10</span>s!
</div>

<!-- ============================================================
     CHATBOT
     ============================================================ -->
<div id="chatbot">
  <div class="chat-header">
    <span class="chat-header-title">🤖 SAFETY AI ASSISTANT</span>
    <button class="modal-close" onclick="toggleChat()">×</button>
  </div>
  <div class="chat-messages" id="chat-messages">
    <div class="chat-msg bot">👋 Hi! I'm your responsible gaming assistant. I monitor your behavior and will warn you about risk patterns.</div>
  </div>
  <div class="chat-input-row">
    <input type="text" id="chat-input" placeholder="Ask about gambling risks..." onkeydown="if(event.key==='Enter')sendChat()">
    <button class="chat-send" onclick="sendChat()">↑</button>
  </div>
</div>

<!-- ============================================================
     MODALS
     ============================================================ -->

<!-- WITHDRAW MODAL -->
<div class="modal-overlay" id="withdraw-modal">
  <div class="modal-box">
    <button class="modal-close" onclick="closeModal('withdraw-modal')">×</button>
    <div class="modal-title">Withdraw Funds</div>

    <div class="friction-note">
      🎯 DARK PATTERN: Deposits = 1 click, instant. Withdrawals = 5 friction-filled steps + 3-5 day wait. This is deliberate.
    </div>

    <div class="withdraw-step active" id="ws0">
      <div class="step-indicator">Step 1 of 5 — Identity Verification</div>
      <p style="color:var(--text2);font-size:13px;margin-bottom:14px;">Before withdrawing, please complete our mandatory KYC verification process.</p>
      <div class="form-field"><label>Aadhaar Number</label><input type="text" placeholder="XXXX XXXX XXXX"></div>
      <div class="form-field"><label>Date of Birth</label><input type="text" placeholder="DD/MM/YYYY"></div>
    </div>
    <div class="withdraw-step" id="ws1">
      <div class="step-indicator">Step 2 of 5 — PAN Card Upload</div>
      <div style="border:2px dashed var(--border2);border-radius:8px;padding:30px;text-align:center;color:var(--text3);margin:12px 0;cursor:pointer;">
        📄 Click to upload PAN Card (front & back)<br><span style="font-size:11px;">JPG, PNG, PDF accepted. Max 5MB.</span>
      </div>
    </div>
    <div class="withdraw-step" id="ws2">
      <div class="step-indicator">Step 3 of 5 — Bank Account Verification</div>
      <div class="form-field"><label>Account Number</label><input type="text" placeholder="Enter account number"></div>
      <div class="form-field"><label>IFSC Code</label><input type="text" placeholder="SBIN0001234"></div>
      <div class="form-field"><label>Account Holder Name</label><input type="text" placeholder="As per bank records"></div>
    </div>
    <div class="withdraw-step" id="ws3">
      <div class="step-indicator">Step 4 of 5 — Bonus Rollover Check</div>
      <div style="background:#1a0800;border:1px solid #ff6b3540;border-radius:8px;padding:12px;margin:10px 0;font-size:12px;color:var(--accent);cursor:pointer;" onclick="openModal('terms-modal')">
        ⚠️ You must complete 10× rollover of all bonuses before withdrawal. <u>View Terms (47 pages)</u>
      </div>
      <p style="color:var(--text2);font-size:12px;">Remaining rollover requirement: <strong style="color:var(--red)">₹<span id="rollover-req">6,200</span></strong></p>
    </div>
    <div class="withdraw-step" id="ws4">
      <div class="step-indicator">Step 5 of 5 — Final Confirmation</div>
      <div class="card card-green" style="margin:10px 0;font-size:13px;">
        ✅ Withdrawal request submitted.<br>
        <span style="color:var(--text2);font-size:12px;">Processing time: 3–5 business days<br>Withdrawal fee: 2.5%<br>Minimum amount: ₹1,000</span>
      </div>
    </div>

    <div style="display:flex;gap:10px;margin-top:14px;">
      <button class="btn-primary" id="ws-next-btn" onclick="nextWithdrawStep()" style="flex:2;">Continue →</button>
      <button class="btn-secondary" onclick="closeModal('withdraw-modal');resetWithdraw();" style="flex:1;">Cancel</button>
    </div>
    <button class="btn-deposit" style="width:100%;margin-top:10px;padding:11px;" onclick="deposit();closeModal('withdraw-modal');resetWithdraw();">
      💳 DEPOSIT INSTEAD (Instant!)
    </button>
  </div>
</div>

<!-- BONUS POPUP -->
<div class="modal-overlay" id="bonus-popup">
  <div class="modal-box" style="text-align:center;border-color:#9b59b650;">
    <button class="modal-close" onclick="closeModal('bonus-popup')">×</button>
    <div id="bonus-reality-tag" style="display:none;background:var(--accent);color:#000;font-size:10px;padding:3px 10px;border-radius:4px;font-family:var(--font-mono);margin-bottom:8px;display:inline-block;">🎪 MANIPULATION TACTIC</div>
    <div class="bonus-icon">🎁</div>
    <div class="bonus-title">SECOND CHANCE BONUS!</div>
    <p class="bonus-sub">We noticed your bad luck streak! Here's a <strong>50% bonus</strong> on your next bet — because we care about your experience!<br><span class="bonus-small">*10× wagering requirement applies before withdrawal</span></p>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
      <button class="btn-primary" onclick="claimBonus()">🎁 Claim Bonus!</button>
      <button class="btn-secondary bonus-decline" onclick="closeModal('bonus-popup')">No thanks (give up winning)</button>
    </div>
  </div>
</div>

<!-- TERMS MODAL -->
<div class="modal-overlay" id="terms-modal">
  <div class="modal-box">
    <button class="modal-close" onclick="closeModal('terms-modal')">×</button>
    <div class="modal-title">Terms & Conditions (47 pages)</div>
    <div class="terms-body" id="terms-body"></div>
    <button class="btn-primary" style="width:100%;margin-top:12px;" onclick="closeModal('terms-modal')">I Agree ✓ (didn't read)</button>
  </div>
</div>

<!-- ============================================================
     JAVASCRIPT
     ============================================================ -->
<script>
'use strict';

// ============================================================
// STATE
// ============================================================
const STATE = {
  wallet: 1000,
  totalDeposited: 1000,
  bets: [],
  timeSpent: 0,
  lossStreak: 0,
  winStreak: 0,
  addictionScore: 0,
  realityMode: false,
  currentGame: 'coin',
  betAmount: 50,
  isPlaying: false,
  // game-specific
  diceChoice: 1,
  slotSymbols: ['🍒','🍋','🔔'],
  crashMultiplier: 1.0,
  crashState: 'idle', // idle | running | crashed | cashed
  crashBet: 0,
  crashInterval: null,
  withdrawStep: 0,
  phishStep: 0,
  chatHistory: []
};

const SYMBOLS = ['🍒','🍋','🔔','⭐','💎','7️⃣'];
const FAKE_USERS = ['Arjun_K','Priya99','BetKing','LuckyRaj','Sneha_P','ViratFan','Rohit_X','CricketGod','MoneyMind','NightOwl','FastBet','RichQuick','GoldRush','NeonPunter','SkyHigh','SpinMaster','LuckyDev','NightBettor'];
const CURRENCY = '₹';

// ============================================================
// UTILITY
// ============================================================
function rand(min, max) { return Math.floor(Math.random()*(max-min+1))+min; }
function randChoice(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function fmtCurr(n) { return CURRENCY + Math.abs(n).toLocaleString('en-IN'); }

function getWinProb(rounds) {
  if (rounds < 3)  return 0.72;
  if (rounds < 7)  return 0.48;
  if (rounds < 15) return 0.32;
  return 0.22;
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  updateWalletDisplay();
  startFeedSimulation();
  buildLeaderboard();
  buildTerms();
  startTimer();
  showScreen('lobby');
});

// ============================================================
// TIMER
// ============================================================
function startTimer() {
  setInterval(() => {
    STATE.timeSpent++;
    updateAddictionScore();
    updateDashboard();
  }, 1000);
}

function formatTime(s) {
  return Math.floor(s/60) + 'm ' + (s%60) + 's';
}

// ============================================================
// SCREENS
// ============================================================
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  document.getElementById('nav-' + name)?.classList.add('active');
  if (name === 'dashboard') updateDashboard();
}

// ============================================================
// GAME SELECTION
// ============================================================
function selectGame(game) {
  STATE.currentGame = game;
  document.querySelectorAll('.game-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('gc-' + game).classList.add('selected');

  const titles = { coin:'🪙 COIN TOSS', dice:'🎲 DICE ROLL', slots:'🎰 SLOT MACHINE', crash:'📈 CRASH GAME' };
  document.getElementById('game-title').textContent = titles[game];

  ['coin','dice','slots','crash'].forEach(g => {
    const el = document.getElementById('game-area-' + g);
    if (el) el.style.display = g === game ? 'block' : 'none';
  });

  hideResultBanner();
  showScreen('game');
}

// ============================================================
// BET AMOUNT
// ============================================================
function updateBet(val) {
  STATE.betAmount = parseInt(val);
  document.getElementById('bet-display').textContent = fmtCurr(STATE.betAmount);
  document.getElementById('bet-slider').value = val;
  const max = Math.min(STATE.wallet, 5000);
  document.getElementById('bet-slider').max = max;
}

function setBet(amount) {
  updateBet(Math.min(amount, STATE.wallet));
}

function betAllIn() {
  updateBet(STATE.wallet);
}

// ============================================================
// WIN PROBABILITY & CORE BET LOGIC
// ============================================================
function resolveBet(betAmount) {
  const rounds = STATE.bets.length;
  const winProb = getWinProb(rounds);
  const roll = Math.random();
  const won = roll < winProb;
  const nearMiss = !won && (rounds % 3 === 2);

  if (won) { STATE.winStreak++; STATE.lossStreak = 0; }
  else     { STATE.lossStreak++; STATE.winStreak = 0; }

  const pnl = won ? betAmount : -betAmount;
  STATE.wallet += pnl;
  STATE.wallet = Math.max(0, STATE.wallet);

  const record = {
    id: Date.now(),
    game: STATE.currentGame,
    amount: betAmount,
    won,
    pnl,
    nearMiss,
    roundsPlayed: rounds,
    actualWinProb: winProb,
    time: new Date().toLocaleTimeString()
  };
  STATE.bets.unshift(record);
  updateAddictionScore();
  updateWalletDisplay();
  updateStreakBadge();
  updateRecentBets();

  // Triggers
  if (STATE.lossStreak >= 3) setTimeout(() => showBonusPopup(), 1200);
  if (STATE.wallet < 200) addNotification('💳 Low balance! Deposit now to keep playing!');
  if (STATE.bets.length === 5) showPersonalMsg('🎯 You tend to win more in the evening! Your lucky streak is coming...');
  if (STATE.lossStreak === 2) showPersonalMsg('💫 Second chance bonus activated! Your next bet has better odds!');
  if (STATE.bets.length > 0 && STATE.bets.length % 5 === 0) startCountdown();

  // Float text
  spawnFloat(pnl, nearMiss);

  // AI warning
  if (STATE.lossStreak >= 3) {
    const msgs = [
      '⚠️ You\'ve lost several bets in a row — a pattern designed to keep you playing and chasing losses.',
      '🧠 Loss streaks trigger "chasing losses" behavior. The house edge increases as you play more rounds.',
      '📊 Your current loss streak is being exploited. This is a designed feature, not bad luck.'
    ];
    addChatMessage('bot', msgs[Math.min(STATE.lossStreak-3, msgs.length-1)]);
  }

  return { won, nearMiss, pnl, winProb };
}

// ============================================================
// COIN TOSS
// ============================================================
function playCoin(choice) {
  if (STATE.isPlaying) return;
  if (STATE.betAmount > STATE.wallet) { addNotification('❌ Insufficient balance!'); return; }
  STATE.isPlaying = true;
  hideResultBanner();

  const coin = document.getElementById('coin-display');
  const coinResult = document.getElementById('coin-result');
  coin.classList.add('flipping');
  coinResult.textContent = '';
  document.getElementById('btn-heads').disabled = true;
  document.getElementById('btn-tails').disabled = true;

  setTimeout(() => {
    const { won, nearMiss, pnl, winProb } = resolveBet(STATE.betAmount);
    const side = Math.random() < 0.5 ? 'heads' : 'tails';
    coin.classList.remove('flipping');
    coin.textContent = side === 'heads' ? '⭕' : '🔵';
    coinResult.textContent = side.toUpperCase();

    showResultBanner(won, nearMiss, pnl, winProb);
    document.getElementById('btn-heads').disabled = false;
    document.getElementById('btn-tails').disabled = false;
    STATE.isPlaying = false;
  }, 900);
}

// ============================================================
// DICE
// ============================================================
function selectDice(num) {
  STATE.diceChoice = num;
  document.querySelectorAll('.dice-choice').forEach((b,i) => {
    b.classList.toggle('selected', i+1 === num);
  });
}

function playDice() {
  if (STATE.isPlaying) return;
  if (STATE.betAmount > STATE.wallet) { addNotification('❌ Insufficient balance!'); return; }
  STATE.isPlaying = true;
  hideResultBanner();

  const dice = document.getElementById('dice-display');
  const btn = document.getElementById('btn-roll');
  const resultText = document.getElementById('dice-result-text');
  const FACES = ['','⚀','⚁','⚂','⚃','⚄','⚅'];

  btn.disabled = true;
  dice.classList.add('rolling');
  resultText.textContent = '';

  let ticks = 0;
  const interval = setInterval(() => {
    dice.textContent = FACES[rand(1,6)];
    if (++ticks > 10) {
      clearInterval(interval);
      dice.classList.remove('rolling');
      const result = rand(1,6);
      dice.textContent = FACES[result];

      const { won, nearMiss, pnl, winProb } = resolveBet(STATE.betAmount);
      resultText.textContent = `Rolled: ${result} — ${result === STATE.diceChoice ? '✅ Match! You won!' : '❌ No match.'}`;
      resultText.style.color = result === STATE.diceChoice ? 'var(--green)' : 'var(--red)';

      showResultBanner(won, nearMiss, pnl, winProb);
      btn.disabled = false;
      STATE.isPlaying = false;
    }
  }, 80);
}

// ============================================================
// SLOTS
// ============================================================
function playSlots() {
  if (STATE.isPlaying) return;
  if (STATE.betAmount > STATE.wallet) { addNotification('❌ Insufficient balance!'); return; }
  STATE.isPlaying = true;
  hideResultBanner();

  const btn = document.getElementById('btn-spin');
  const msg = document.getElementById('slots-msg');
  btn.disabled = true;
  btn.textContent = '🎰 SPINNING...';
  msg.textContent = '';

  const rounds = STATE.bets.length;
  const winProb = getWinProb(rounds);
  const won = Math.random() < winProb;

  let finalSymbols;
  if (won) {
    const s = randChoice(SYMBOLS);
    finalSymbols = [s, s, s];
  } else if (Math.random() < 0.4 && rounds % 3 === 2) {
    // Near-miss: two matching
    const s = randChoice(SYMBOLS);
    const other = SYMBOLS.filter(x=>x!==s);
    finalSymbols = [s, s, randChoice(other)];
  } else {
    finalSymbols = [randChoice(SYMBOLS), randChoice(SYMBOLS), randChoice(SYMBOLS)];
    while(finalSymbols[0]===finalSymbols[1] && finalSymbols[1]===finalSymbols[2])
      finalSymbols[2] = randChoice(SYMBOLS);
  }

  // Animate reels
  const reels = [document.getElementById('reel0'), document.getElementById('reel1'), document.getElementById('reel2')];
  reels.forEach(r => r.classList.add('spinning'));

  let tick = 0;
  const interval = setInterval(() => {
    reels.forEach(r => r.querySelector('.slot-symbol').textContent = randChoice(SYMBOLS));
    if (++tick > 12) {
      clearInterval(interval);
      reels.forEach((r,i) => {
        r.classList.remove('spinning');
        r.querySelector('.slot-symbol').textContent = finalSymbols[i];
        r.classList.toggle('near-match', finalSymbols[0]===finalSymbols[1] && i<2 && !won);
      });

      const nearMiss = !won && finalSymbols[0]===finalSymbols[1];
      const multiplier = won ? 3 : 0;
      const pnl = won ? STATE.betAmount * 2 : -STATE.betAmount;

      // Update state manually for slots
      STATE.wallet += pnl;
      STATE.wallet = Math.max(0, STATE.wallet);
      if (won) { STATE.winStreak++; STATE.lossStreak = 0; }
      else     { STATE.lossStreak++; STATE.winStreak = 0; }

      const record = { id:Date.now(), game:'slots', amount:STATE.betAmount, won, pnl, nearMiss, roundsPlayed:rounds, actualWinProb:winProb, time:new Date().toLocaleTimeString() };
      STATE.bets.unshift(record);
      updateAddictionScore();
      updateWalletDisplay();
      updateStreakBadge();

      if (nearMiss) {
        msg.textContent = '😱 SO CLOSE! Two matching symbols!';
        msg.style.color = '#ffaa00';
        addNotification('😱 SO CLOSE! Two matching! Try again!');
      }

      showResultBanner(won, nearMiss, pnl, winProb);
      spawnFloat(pnl, nearMiss);

      if (STATE.lossStreak >= 3) setTimeout(() => showBonusPopup(), 1200);
      if (STATE.wallet < 200) addNotification('💳 Low balance! Deposit now!');
      if (STATE.bets.length % 5 === 0) startCountdown();

      btn.disabled = false;
      btn.textContent = '🎰 SPIN!';
      STATE.isPlaying = false;
    }
  }, 100);
}

// ============================================================
// CRASH GAME
// ============================================================
function crashStart() {
  if (STATE.betAmount > STATE.wallet) { addNotification('❌ Insufficient balance!'); return; }
  STATE.wallet -= STATE.betAmount;
  STATE.crashBet = STATE.betAmount;
  STATE.crashState = 'running';
  STATE.crashMultiplier = 1.0;
  updateWalletDisplay();

  const crashAt = 1 + Math.random()*2.5 + (Math.random() < 0.3 ? 0 : Math.random()*5);
  const multEl = document.getElementById('crash-mult');
  const statusEl = document.getElementById('crash-status');
  const potEl = document.getElementById('crash-potential');
  const startBtn = document.getElementById('btn-crash-start');
  const cashBtn = document.getElementById('btn-crash-cashout');

  startBtn.style.display = 'none';
  cashBtn.style.display = 'inline-block';
  multEl.style.color = 'var(--accent)';
  multEl.classList.remove('crashed','cashed');
  statusEl.textContent = '🚀 Game running — cash out before it crashes!';

  STATE.crashInterval = setInterval(() => {
    STATE.crashMultiplier = parseFloat((STATE.crashMultiplier + 0.04 + STATE.crashMultiplier * 0.015).toFixed(2));
    multEl.textContent = STATE.crashMultiplier.toFixed(2) + '×';
    potEl.textContent = 'Potential win: ' + fmtCurr(Math.floor(STATE.crashBet * STATE.crashMultiplier));

    if (STATE.crashMultiplier >= crashAt) {
      clearInterval(STATE.crashInterval);
      STATE.crashState = 'crashed';
      multEl.classList.add('crashed');
      multEl.textContent = STATE.crashMultiplier.toFixed(2) + '× 💥';
      statusEl.textContent = 'CRASHED! You lost your bet.';
      potEl.textContent = '';
      cashBtn.style.display = 'none';
      startBtn.style.display = 'inline-block';
      startBtn.textContent = '🔄 Play Again';

      const nearMiss = STATE.crashMultiplier > crashAt - 0.5;
      STATE.lossStreak++; STATE.winStreak = 0;
      STATE.bets.unshift({ id:Date.now(), game:'crash', amount:STATE.crashBet, won:false, pnl:-STATE.crashBet, nearMiss, roundsPlayed:STATE.bets.length, actualWinProb:0.4, time:new Date().toLocaleTimeString() });
      updateAddictionScore();
      showResultBanner(false, nearMiss, -STATE.crashBet, 0.4);
      spawnFloat(-STATE.crashBet, nearMiss);
      if (STATE.lossStreak >= 3) setTimeout(() => showBonusPopup(), 1200);
    }
  }, 100);
}

function crashCashout() {
  if (STATE.crashState !== 'running') return;
  clearInterval(STATE.crashInterval);
  STATE.crashState = 'cashed';
  const winnings = Math.floor(STATE.crashBet * STATE.crashMultiplier);
  STATE.wallet += winnings;
  const pnl = winnings - STATE.crashBet;
  STATE.winStreak++; STATE.lossStreak = 0;
  STATE.bets.unshift({ id:Date.now(), game:'crash', amount:STATE.crashBet, won:true, pnl, nearMiss:false, roundsPlayed:STATE.bets.length, actualWinProb:0.4, time:new Date().toLocaleTimeString() });
  updateAddictionScore(); updateWalletDisplay();

  const multEl = document.getElementById('crash-mult');
  multEl.classList.add('cashed');
  document.getElementById('crash-status').textContent = `💰 Cashed out at ${STATE.crashMultiplier.toFixed(2)}×!`;
  document.getElementById('crash-potential').textContent = '';
  document.getElementById('btn-crash-cashout').style.display = 'none';
  document.getElementById('btn-crash-start').style.display = 'inline-block';
  document.getElementById('btn-crash-start').textContent = '🔄 Play Again';

  addNotification(`💰 Cashed out at ${STATE.crashMultiplier.toFixed(2)}×! Won ${fmtCurr(winnings)}!`);
  showResultBanner(true, false, pnl, 0.4);
  spawnFloat(pnl, false);
}

// ============================================================
// RESULT BANNER
// ============================================================
function showResultBanner(won, nearMiss, pnl, winProb) {
  const banner = document.getElementById('result-banner');
  const icon = document.getElementById('result-icon');
  const title = document.getElementById('result-title');
  const amount = document.getElementById('result-amount');
  const note = document.getElementById('result-prob-note');

  banner.className = '';
  banner.style.display = 'block';

  if (nearMiss && !won) {
    banner.classList.add('near');
    icon.textContent = '😱';
    title.textContent = 'SO CLOSE!';
    title.style.color = '#ffaa00';
    amount.textContent = 'You almost won!';
    amount.style.color = '#ffaa00';
    note.textContent = '⚡ Near-miss deliberately injected to encourage continued play.';
    addNotification('😱 You ALMOST won! Try again!');
  } else {
    banner.classList.add(won ? 'win' : 'loss');
    icon.textContent = won ? '🎉' : '😔';
    title.textContent = won ? 'YOU WON!' : 'YOU LOST';
    title.style.color = won ? 'var(--green)' : 'var(--red)';
    amount.textContent = (won ? '+' : '-') + fmtCurr(Math.abs(pnl));
    amount.style.color = won ? 'var(--green)' : 'var(--red)';
    note.textContent = `Actual programmed win probability: ${(winProb*100).toFixed(0)}% | Round ${STATE.bets.length}`;
  }

  // Update reality note
  const rounds = STATE.bets.length;
  const wp = getWinProb(rounds);
  document.getElementById('actual-prob-display').textContent = (wp*100).toFixed(0) + '%';
  document.getElementById('rounds-display').textContent = rounds;
  document.getElementById('house-edge-display').textContent = (100-wp*100).toFixed(0) + '%';

  setTimeout(() => hideResultBanner(), 3500);
}

function hideResultBanner() {
  document.getElementById('result-banner').style.display = 'none';
}

// ============================================================
// WALLET
// ============================================================
function updateWalletDisplay() {
  const netPnL = STATE.wallet - STATE.totalDeposited;
  const wEl = document.getElementById('wallet-display');
  wEl.textContent = fmtCurr(STATE.wallet);
  wEl.className = 'wallet-amount ' + (STATE.wallet < 300 ? 'glow-red low' : 'glow-green');

  const pnlEl = document.getElementById('wallet-pnl');
  pnlEl.textContent = (netPnL >= 0 ? '▲ +' : '▼ ') + fmtCurr(netPnL) + ' ' + (netPnL >= 0 ? 'profit' : 'loss');
  pnlEl.style.color = netPnL >= 0 ? 'var(--green)' : 'var(--red)';

  const slider = document.getElementById('bet-slider');
  if (slider) slider.max = Math.min(STATE.wallet, 5000);
}

function deposit() {
  STATE.wallet += 500;
  STATE.totalDeposited += 500;
  updateWalletDisplay();
  addNotification('💳 ₹500 deposited instantly! ✨');
}

// ============================================================
// STREAK BADGE
// ============================================================
function updateStreakBadge() {
  const badge = document.getElementById('streak-badge');
  if (STATE.winStreak > 1) {
    badge.textContent = `🔥 ${STATE.winStreak} win streak!`;
    badge.style.display = 'block';
  } else if (STATE.lossStreak > 0) {
    badge.textContent = `❄️ ${STATE.lossStreak} loss streak`;
    badge.style.display = 'block';
  } else {
    badge.style.display = 'none';
  }
}

// ============================================================
// ADDICTION SCORE
// ============================================================
function updateAddictionScore() {
  const score = Math.min(100, Math.floor(
    STATE.bets.length * 2 +
    STATE.lossStreak * 8 +
    (STATE.timeSpent / 60) * 4 +
    (STATE.wallet < STATE.totalDeposited * 0.3 ? 20 : 0)
  ));
  STATE.addictionScore = score;

  document.getElementById('addict-score-val').textContent = score + '/100';
  document.getElementById('addict-score-val').style.color =
    score > 70 ? 'var(--red)' : score > 40 ? '#ffaa00' : 'var(--green)';

  const bar = document.getElementById('addict-bar');
  bar.style.width = score + '%';
  bar.style.background = score > 70 ? 'var(--red)' : score > 40 ? '#ffaa00' : 'var(--green)';

  const warn = document.getElementById('addict-warn');
  warn.style.display = score > 60 ? 'block' : 'none';
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function addNotification(text) {
  const container = document.getElementById('notif-container');
  const el = document.createElement('div');
  el.className = 'notif-item';
  el.textContent = text;
  container.prepend(el);
  setTimeout(() => el.remove(), 4500);
}

// ============================================================
// FLOAT TEXT (win/loss amounts)
// ============================================================
function spawnFloat(pnl, nearMiss) {
  const el = document.createElement('div');
  el.className = 'float-text';
  el.style.left = (40 + Math.random() * 40) + '%';
  el.style.top = '50%';
  el.style.color = nearMiss ? '#ffaa00' : pnl > 0 ? 'var(--green)' : 'var(--red)';
  el.textContent = nearMiss ? 'NEAR MISS!' : (pnl > 0 ? '+' : '') + fmtCurr(pnl);
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

// ============================================================
// PERSONALIZED MESSAGE
// ============================================================
function showPersonalMsg(text) {
  const el = document.getElementById('personal-msg');
  document.getElementById('personal-msg-text').textContent = text;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5500);
}

// ============================================================
// COUNTDOWN TIMER
// ============================================================
let countdownInterval = null;
function startCountdown() {
  if (countdownInterval) return;
  const banner = document.getElementById('countdown-banner');
  const val = document.getElementById('countdown-val');
  let sec = 10;
  val.textContent = sec;
  banner.style.display = 'block';
  banner.style.position = 'fixed';
  banner.style.bottom = '80px';
  banner.style.left = '50%';
  banner.style.transform = 'translateX(-50%)';
  countdownInterval = setInterval(() => {
    sec--;
    val.textContent = sec;
    if (sec <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      banner.style.display = 'none';
    }
  }, 1000);
}

// ============================================================
// REALITY MODE
// ============================================================
function toggleReality() {
  STATE.realityMode = !STATE.realityMode;
  const body = document.body;
  const btn = document.getElementById('reality-toggle-btn');

  if (STATE.realityMode) {
    body.classList.add('reality-on');
    btn.classList.add('active');
    btn.textContent = '🔴 Truth Mode ON';
    // Show all reality tags
    document.querySelectorAll('.reality-tag').forEach(t => t.style.display = 'block');
    document.getElementById('reality-lobby-note').style.display = 'block';
    document.getElementById('reality-game-note').style.display = 'block';
    document.getElementById('reality-dash-note').style.display = 'block';
    document.getElementById('feed-fake-tag').style.display = 'inline-block';
    document.getElementById('lb-fake-tag').style.display = 'inline-block';
    document.getElementById('withdraw-rt').style.display = 'block';
    document.getElementById('bet-rt').style.display = 'block';
    document.getElementById('crash-reality-note').style.display = 'block';
    document.getElementById('countdown-reality-tag').style.display = 'inline-block';
    document.getElementById('bonus-reality-tag').style.display = 'inline-block';
    updateRealityWLNote();
    addNotification('👁 Reality Mode ON — seeing true probabilities & manipulation tactics');
  } else {
    body.classList.remove('reality-on');
    btn.classList.remove('active');
    btn.textContent = '👁 Reveal Truth';
    document.querySelectorAll('.reality-tag').forEach(t => t.style.display = 'none');
    document.getElementById('reality-lobby-note').style.display = 'none';
    document.getElementById('reality-game-note').style.display = 'none';
    document.getElementById('reality-dash-note').style.display = 'none';
    document.getElementById('feed-fake-tag').style.display = 'none';
    document.getElementById('lb-fake-tag').style.display = 'none';
    document.getElementById('withdraw-rt').style.display = 'none';
    document.getElementById('bet-rt').style.display = 'none';
    document.getElementById('crash-reality-note').style.display = 'none';
    document.getElementById('countdown-reality-tag').style.display = 'none';
    document.getElementById('bonus-reality-tag').style.display = 'none';
    document.getElementById('reality-wl-note').style.display = 'none';
  }
}

function updateRealityWLNote() {
  if (!STATE.realityMode) return;
  const rounds = STATE.bets.length;
  if (rounds > 5) {
    const wp = getWinProb(rounds);
    const note = document.getElementById('reality-wl-note');
    note.innerHTML = `🔍 Programmed odds at round ${rounds}: <strong>${(wp*100).toFixed(0)}%</strong> win probability. Displayed odds suggested 50%. You're experiencing a <strong>${(50-wp*100).toFixed(0)}%</strong> manipulation disadvantage.`;
    note.style.display = 'block';
  }
}

// ============================================================
// DASHBOARD
// ============================================================
function updateDashboard() {
  const totalBets = STATE.bets.length;
  const wins = STATE.bets.filter(b=>b.won).length;
  const losses = totalBets - wins;
  const netPnL = STATE.wallet - STATE.totalDeposited;
  const winRate = totalBets ? (wins/totalBets*100).toFixed(1) : 0;

  document.getElementById('stat-total-bets').textContent = totalBets;
  document.getElementById('stat-wins').textContent = wins;
  document.getElementById('stat-losses').textContent = losses;

  const wrEl = document.getElementById('stat-win-rate');
  wrEl.textContent = winRate + '%';
  wrEl.style.color = winRate > 50 ? 'var(--green)' : 'var(--red)';

  const pnlEl = document.getElementById('stat-net-pnl');
  pnlEl.textContent = (netPnL >= 0 ? '+' : '') + fmtCurr(netPnL);
  pnlEl.style.color = netPnL >= 0 ? 'var(--green)' : 'var(--red)';

  document.getElementById('stat-time').textContent = formatTime(STATE.timeSpent);

  // Win/loss bar
  document.getElementById('wl-green').style.width = totalBets ? (wins/totalBets*100) + '%' : '0%';

  // Balance chart
  drawBalanceChart();

  // History
  updateBetHistory();

  if (STATE.realityMode) updateRealityWLNote();
}

function drawBalanceChart() {
  const svg = document.getElementById('balance-chart');
  if (STATE.bets.length < 1) return;

  const balances = [];
  let bal = STATE.totalDeposited;
  balances.push(bal);
  STATE.bets.slice().reverse().forEach(b => { bal += b.pnl; balances.push(Math.max(0,bal)); });

  const W = 600, H = 110;
  const max = Math.max(...balances, STATE.totalDeposited + 100);
  const min = Math.max(0, Math.min(...balances) - 50);
  const range = max - min || 1;
  const n = balances.length;
  const stepX = W / Math.max(n-1, 1);
  const color = STATE.wallet >= STATE.totalDeposited ? '#00ff88' : '#ff4444';

  const pts = balances.map((b,i) => `${i*stepX},${H - ((b-min)/range)*H}`).join(' ');
  const areaPath = `${0},${H} ${pts} ${(n-1)*stepX},${H}`;

  const baseline = H - ((STATE.totalDeposited-min)/range)*H;

  svg.innerHTML = `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <polygon points="${areaPath}" fill="url(#bg)"/>
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <line x1="0" y1="${baseline}" x2="${W}" y2="${baseline}" stroke="#444" stroke-width="1" stroke-dasharray="5,5"/>
  `;
  document.getElementById('chart-legend').style.color = color;
}

function updateBetHistory() {
  const list = document.getElementById('bet-history-list');
  if (STATE.bets.length === 0) {
    list.innerHTML = '<div style="text-align:center;color:var(--text3);padding:20px;font-size:13px;">No bets yet. Start playing!</div>';
    return;
  }
  list.innerHTML = STATE.bets.slice(0,12).map(b => `
    <div class="bh-row">
      <span>${b.game}</span>
      <span>${fmtCurr(b.amount)}</span>
      <span style="color:${b.won?'var(--green)':'var(--red)'}">${b.won?'WIN':'LOSS'}${b.nearMiss?' 🎯':''}</span>
      <span style="color:${b.pnl>=0?'var(--green)':'var(--red)'};font-family:var(--font-mono)">${b.pnl>=0?'+':''}${b.pnl}</span>
    </div>
  `).join('');
}

function updateRecentBets() {
  const card = document.getElementById('recent-bets-card');
  const list = document.getElementById('recent-bets-list');
  card.style.display = STATE.bets.length > 0 ? 'block' : 'none';
  list.innerHTML = STATE.bets.slice(0,5).map(b => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid var(--bg2);font-size:13px;">
      <span>${b.game} — ${b.won?'WIN':'LOSS'}</span>
      <span style="color:${b.pnl>=0?'var(--green)':'var(--red)'};font-family:var(--font-mono)">${b.pnl>=0?'+':''}${b.pnl}</span>
    </div>
  `).join('');
}

// ============================================================
// LIVE FEED
// ============================================================
function startFeedSimulation() {
  setInterval(() => {
    const user = randChoice(FAKE_USERS);
    const amount = rand(50, 2500);
    const won = Math.random() > 0.38;
    const el = document.createElement('div');
    el.className = 'feed-item ' + (won ? 'win' : 'loss');
    el.innerHTML = `${won ? `${user} just won ${CURRENCY}${amount}! 🎉` : `${user} placed ${CURRENCY}${amount} bet`}<div class="feed-time">${new Date().toLocaleTimeString()}</div>`;
    const list = document.getElementById('feed-list');
    list.prepend(el);
    while (list.children.length > 20) list.lastChild.remove();

    if (Math.random() > 0.72) {
      addNotification(won ? `🔥 ${user} is on a hot streak!` : `💫 ${user} keeps playing strong!`);
    }
  }, 2600);
}

function buildLeaderboard() {
  const lb = document.getElementById('lb-list');
  const medals = ['🥇','🥈','🥉','4.','5.'];
  const colors = ['var(--gold)','#c0c0c0','#cd7f32','var(--text2)','var(--text3)'];
  lb.innerHTML = FAKE_USERS.slice(0,5).map((u,i) => `
    <div class="lb-item">
      <span style="color:${colors[i]}">${medals[i]} ${u}</span>
      <span style="color:var(--green)">+${CURRENCY}${rand(5000,80000).toLocaleString()}</span>
    </div>
  `).join('');
}

// ============================================================
// MODALS
// ============================================================
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// WITHDRAW
function openWithdraw() {
  STATE.withdrawStep = 0;
  document.getElementById('rollover-req').textContent = rand(3000,10000).toLocaleString();
  resetWithdraw();
  openModal('withdraw-modal');
}

function resetWithdraw() {
  for(let i=0;i<5;i++){
    const el = document.getElementById('ws'+i);
    if(el) el.classList.toggle('active', i===0);
  }
  document.getElementById('ws-next-btn').textContent = 'Continue →';
}

function nextWithdrawStep() {
  const curr = document.getElementById('ws'+STATE.withdrawStep);
  if(curr) curr.classList.remove('active');
  STATE.withdrawStep++;
  if(STATE.withdrawStep < 5) {
    const next = document.getElementById('ws'+STATE.withdrawStep);
    if(next) next.classList.add('active');
    if(STATE.withdrawStep === 4) document.getElementById('ws-next-btn').textContent = 'Done';
  } else {
    closeModal('withdraw-modal');
    resetWithdraw();
    STATE.withdrawStep = 0;
    addNotification('⏳ Withdrawal under review (3-5 business days)');
  }
}

// BONUS
function showBonusPopup() {
  openModal('bonus-popup');
}

function claimBonus() {
  closeModal('bonus-popup');
  addNotification('🎁 50% Bonus activated! *10× rollover required before withdrawal');
}

// TERMS
function buildTerms() {
  const body = document.getElementById('terms-body');
  body.innerHTML = Array.from({length:10}, (_,i) => `
    <p>${i+1}. This platform reserves the right to modify, suspend, or terminate any bonus offer at any time without prior notice. Bonus wagering requirements of 10× the bonus amount must be completed within 30 calendar days of crediting. All games contribute differently to rollover requirements — slot games contribute 100%, table games contribute 10%, crash games contribute 25%. The platform may void any winnings if fraudulent activity is suspected, as determined solely by the platform. Players may not withdraw any funds until all active bonus wagering requirements are met in full. By clicking "I Agree," you confirm you have read all 47 pages of these terms and conditions in their entirety.</p>
  `).join('');
}

// ============================================================
// PHISHING DEMO
// ============================================================
let phishStep = 0;

function nextPhishStep() {
  document.querySelectorAll('.phishing-step').forEach(s => s.classList.remove('active'));
  phishStep++;
  document.getElementById('ph-step'+phishStep).classList.add('active');
}

function resetPhish() {
  phishStep = 0;
  document.querySelectorAll('.phishing-step').forEach(s => s.classList.remove('active'));
  document.getElementById('ph-step0').classList.add('active');
}

// ============================================================
// AWARENESS TABS
// ============================================================
function showAwareTab(name, btn) {
  document.querySelectorAll('.aware-content').forEach(c => c.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('aware-'+name).style.display = 'block';
  btn.classList.add('active');
}

// ============================================================
// CHAT
// ============================================================
function toggleChat() {
  const chat = document.getElementById('chatbot');
  chat.classList.toggle('open');
}

async function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  addChatMessage('user', text);

  try {
    const netPnL = STATE.wallet - STATE.totalDeposited;
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a responsible gambling awareness AI embedded in an educational simulation platform. Help users understand psychological manipulation, addiction risks, and gambling mathematics. NEVER encourage gambling. Keep responses to 2-3 sentences max.
Current user stats: Bets: ${STATE.bets.length}, Balance: ₹${STATE.wallet} (started ₹${STATE.totalDeposited}), Net P&L: ₹${netPnL}, Loss streak: ${STATE.lossStreak}, Time: ${Math.floor(STATE.timeSpent/60)} minutes, Addiction risk: ${STATE.addictionScore}/100.`,
        messages: [...STATE.chatHistory.slice(-6), { role: 'user', content: text }]
      })
    });
    const data = await resp.json();
    const reply = data.content?.map(b => b.text || '').join('') || "The house always wins in the long run. Your stats reflect the designed house edge.";
    addChatMessage('bot', reply);
    STATE.chatHistory.push({ role:'user', content:text }, { role:'assistant', content:reply });
  } catch(e) {
    addChatMessage('bot', `⚠️ After ${STATE.bets.length} bets, your expected loss is ₹${Math.floor(STATE.bets.length * STATE.betAmount * 0.3).toLocaleString()}. The house edge compounds with every round.`);
  }
}

function addChatMessage(role, text) {
  const msgs = document.getElementById('chat-messages');
  const el = document.createElement('div');
  el.className = 'chat-msg ' + role;
  el.textContent = text;
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;

  // Open chat if a bot warning comes in
  if (role === 'bot' && STATE.lossStreak >= 3) {
    document.getElementById('chatbot').classList.add('open');
  }
}

</script>
</body>
</html>
