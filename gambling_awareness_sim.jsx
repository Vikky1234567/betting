// ⚠️ EDUCATIONAL SIMULATION ONLY - Demonstrates gambling manipulation tactics
// This is NOT a real gambling platform. No real money involved.

import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// CONSTANTS & CONFIG
// ============================================================
const FAKE_USERS = ["Arjun_K","Priya99","BetKing","LuckyRaj","Sneha_P","ViratFan","Rohit_X","CricketGod","MoneyMind","NightOwl","FastBet","RichQuick","GoldRush","NeonPunter","SkyHigh"];
const CURRENCY = "₹";

// Psychological manipulation: win probability decreases over time
function getWinProbability(roundsPlayed) {
  if (roundsPlayed < 3) return 0.72; // Hook phase - high wins
  if (roundsPlayed < 7) return 0.48; // Transition
  if (roundsPlayed < 15) return 0.32; // House advantage kicks in
  return 0.22; // Long-term house edge
}

// Near-miss injection
function injectNearMiss(result, type) {
  if (type === "slots") {
    // Two matching + one off = near miss
    const symbols = ["🍒","🍋","🔔","⭐","💎","7️⃣"];
    const match = symbols[Math.floor(Math.random()*symbols.length)];
    const near = symbols.filter(s=>s!==match)[Math.floor(Math.random()*5)];
    return [match, match, near];
  }
  return result;
}

function rand(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function randChoice(arr){return arr[Math.floor(Math.random()*arr.length)];}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [screen, setScreen] = useState("lobby"); // lobby | game | dashboard | awareness | phishing
  const [game, setGame] = useState("coin"); // coin | dice | slots | crash
  const [wallet, setWallet] = useState(1000);
  const [totalDeposited, setTotalDeposited] = useState(1000);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [bets, setBets] = useState([]);
  const [feed, setFeed] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [realityMode, setRealityMode] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [betAmount, setBetAmount] = useState(50);
  const [gameResult, setGameResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [crashMultiplier, setCrashMultiplier] = useState(1.0);
  const [crashState, setCrashState] = useState("idle"); // idle | running | crashed | cashed
  const [crashBet, setCrashBet] = useState(0);
  const [slotSymbols, setSlotSymbols] = useState(["🍒","🍋","🔔"]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState(0);
  const [showBonusPopup, setShowBonusPopup] = useState(false);
  const [addictionScore, setAddictionScore] = useState(0);
  const [chatMessages, setChatMessages] = useState([{role:"bot",text:"👋 Hi! I'm your responsible gaming assistant. Play safely!"}]);
  const [chatInput, setChatInput] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [lossStreak, setLossStreak] = useState(0);
  const [winStreak, setWinStreak] = useState(0);
  const [lastBetTime, setLastBetTime] = useState(Date.now());
  const [personalizedMsg, setPersonalizedMsg] = useState("");
  const [countdownTimer, setCountdownTimer] = useState(0);
  const [showBonusTerm, setShowBonusTerm] = useState(false);
  const crashRef = useRef(null);
  const timerRef = useRef(null);
  const feedRef = useRef(null);
  const countdownRef = useRef(null);

  // Time tracking
  useEffect(()=>{
    timerRef.current = setInterval(()=>setTimeSpent(t=>t+1),1000);
    return ()=>clearInterval(timerRef.current);
  },[]);

  // Addiction score calculation
  useEffect(()=>{
    const score = Math.min(100,
      Math.floor((bets.length * 2) +
      (lossStreak * 10) +
      (timeSpent / 60 * 5) +
      (wallet < totalDeposited * 0.3 ? 20 : 0))
    );
    setAddictionScore(score);
  },[bets, lossStreak, timeSpent, wallet, totalDeposited]);

  // AI warning after heavy losses
  useEffect(()=>{
    if(lossStreak >= 3 && showChat) {
      const msgs = [
        "⚠️ I notice you've lost several bets in a row. This is a normal pattern designed to keep you playing.",
        "🧠 Real gambling platforms use loss streaks to trigger 'chasing losses' behavior. Consider taking a break.",
        "📊 Your current loss streak is being exploited. The house edge increases as you play more."
      ];
      const msg = msgs[Math.min(lossStreak-3, msgs.length-1)];
      setChatMessages(prev=>[...prev,{role:"bot",text:msg}]);
    }
  },[lossStreak]);

  // Personalized messages (AI profiling simulation)
  useEffect(()=>{
    if(bets.length===5){
      const hour = new Date().getHours();
      const timeStr = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
      setPersonalizedMsg(`🎯 You tend to win more in the ${timeStr}! Your lucky streak is coming...`);
      setTimeout(()=>setPersonalizedMsg(""),5000);
    }
    if(lossStreak===2){
      setPersonalizedMsg("💫 Second chance bonus activated! Your next bet has better odds!");
      setTimeout(()=>setPersonalizedMsg(""),6000);
    }
  },[bets.length, lossStreak]);

  // Countdown timer for fake offers
  useEffect(()=>{
    if(bets.length>0 && bets.length%5===0){
      setCountdownTimer(10);
      countdownRef.current = setInterval(()=>{
        setCountdownTimer(t=>{
          if(t<=1){clearInterval(countdownRef.current);return 0;}
          return t-1;
        });
      },1000);
    }
    return ()=>clearInterval(countdownRef.current);
  },[bets.length]);

  // Live feed simulation
  useEffect(()=>{
    feedRef.current = setInterval(()=>{
      const user = randChoice(FAKE_USERS);
      const amount = rand(50,2000);
      const won = Math.random() > 0.35;
      const entry = {
        id: Date.now()+Math.random(),
        text: won ? `${user} just won ${CURRENCY}${amount}! 🎉` : `${user} placed ${CURRENCY}${amount} bet`,
        won,
        time: new Date().toLocaleTimeString()
      };
      setFeed(prev=>[entry,...prev].slice(0,20));
      // Random notifications
      if(Math.random()>0.7){
        addNotification(won ? `🔥 ${user} is on a hot streak!` : `💫 ${user} is still playing strong!`);
      }
    },2500);
    return ()=>clearInterval(feedRef.current);
  },[]);

  function addNotification(text){
    const id = Date.now()+Math.random();
    setNotifications(prev=>[{id,text},...prev].slice(0,5));
    setTimeout(()=>setNotifications(prev=>prev.filter(n=>n.id!==id)),4000);
  }

  // ============================================================
  // GAME LOGIC
  // ============================================================
  function placeBet(choice){
    if(betAmount > wallet){ addNotification("❌ Insufficient balance!"); return; }
    if(isSpinning) return;

    const rounds = bets.length;
    const winProb = getWinProbability(rounds);
    const roll = Math.random();
    let won = roll < winProb;

    // Near-miss injection every 3rd loss
    let nearMiss = false;
    if(!won && rounds % 3 === 2) nearMiss = true;

    // Update streaks
    if(won){ setWinStreak(w=>w+1); setLossStreak(0); }
    else { setLossStreak(l=>l+1); setWinStreak(0); }

    const pnl = won ? betAmount : -betAmount;
    const newWallet = wallet + pnl;
    setWallet(newWallet);
    setLastBetTime(Date.now());

    const betRecord = {
      id: Date.now(),
      game,
      amount: betAmount,
      won,
      pnl,
      choice,
      roundsPlayed: rounds,
      actualWinProb: winProb,
      nearMiss,
      time: new Date().toLocaleTimeString()
    };
    setBets(prev=>[betRecord,...prev]);

    setGameResult({won, nearMiss, pnl, choice, winProb});
    setIsSpinning(true);
    setTimeout(()=>{
      setIsSpinning(false);
      if(!won && lossStreak >= 2){
        setTimeout(()=>setShowBonusPopup(true),1000);
      }
    },1000);

    // Auto-suggest deposit if low
    if(newWallet < 200){
      setTimeout(()=>addNotification("💳 Low balance! Deposit now to keep playing!"),2000);
    }
  }

  function runSlots(){
    if(betAmount > wallet){ addNotification("❌ Insufficient balance!"); return; }
    if(isSpinning) return;
    const symbols = ["🍒","🍋","🔔","⭐","💎","7️⃣"];
    setIsSpinning(true);

    const rounds = bets.length;
    const winProb = getWinProbability(rounds);
    const won = Math.random() < winProb;

    let result;
    if(won){
      const s = randChoice(symbols);
      result = [s,s,s];
    } else if(Math.random() < 0.4 && rounds%3===2){
      result = injectNearMiss(null,"slots");
    } else {
      result = [randChoice(symbols),randChoice(symbols),randChoice(symbols)];
      while(result[0]===result[1]&&result[1]===result[2]) result[2]=randChoice(symbols);
    }

    // Animate spinning
    let spins = 0;
    const interval = setInterval(()=>{
      setSlotSymbols([randChoice(symbols),randChoice(symbols),randChoice(symbols)]);
      spins++;
      if(spins>8){
        clearInterval(interval);
        setSlotSymbols(result);
        setIsSpinning(false);
        const nearMiss = !won && result[0]===result[1];
        const pnl = won ? betAmount*3 : -betAmount;
        const newWallet = wallet + pnl;
        setWallet(newWallet);
        if(won) setWinStreak(w=>w+1), setLossStreak(0);
        else setLossStreak(l=>l+1), setWinStreak(0);
        setGameResult({won, nearMiss, pnl, winProb});
        setBets(prev=>[{id:Date.now(),game:"slots",amount:betAmount,won,pnl,nearMiss,roundsPlayed:rounds,actualWinProb:winProb,time:new Date().toLocaleTimeString()},...prev]);
        if(nearMiss) addNotification("😱 SO CLOSE! Two matching symbols! Try again!");
      }
    },100);
  }

  // CRASH GAME
  function startCrash(){
    if(betAmount > wallet){ addNotification("❌ Insufficient balance!"); return; }
    setWallet(w=>w-betAmount);
    setCrashBet(betAmount);
    setCrashMultiplier(1.0);
    setCrashState("running");
    const crashAt = 1 + Math.random()*3 + (Math.random()<0.3?0:Math.random()*5);
    let mult = 1.0;
    crashRef.current = setInterval(()=>{
      mult = parseFloat((mult + 0.05 + mult*0.02).toFixed(2));
      setCrashMultiplier(mult);
      if(mult >= crashAt){
        clearInterval(crashRef.current);
        setCrashState("crashed");
        setBets(prev=>[{id:Date.now(),game:"crash",amount:betAmount,won:false,pnl:-betAmount,nearMiss:mult>crashAt-0.5,roundsPlayed:bets.length,actualWinProb:0.4,time:new Date().toLocaleTimeString()},...prev]);
        setLossStreak(l=>l+1); setWinStreak(0);
      }
    },100);
  }

  function cashOutCrash(){
    if(crashState!=="running") return;
    clearInterval(crashRef.current);
    const winnings = Math.floor(crashBet * crashMultiplier);
    setWallet(w=>w+winnings);
    setCrashState("cashed");
    const pnl = winnings - crashBet;
    setBets(prev=>[{id:Date.now(),game:"crash",amount:crashBet,won:true,pnl,nearMiss:false,roundsPlayed:bets.length,actualWinProb:0.4,time:new Date().toLocaleTimeString()},...prev]);
    setWinStreak(w=>w+1); setLossStreak(0);
    addNotification(`💰 Cashed out at ${crashMultiplier}x! Won ${CURRENCY}${winnings}!`);
  }

  // WITHDRAW LOGIC - Dark pattern: friction steps
  function nextWithdrawStep(){
    if(withdrawStep < 4) setWithdrawStep(s=>s+1);
    else { setShowWithdrawModal(false); setWithdrawStep(0); addNotification("⏳ Withdrawal under review (3-5 business days)"); }
  }

  // CHAT
  async function sendChat(){
    if(!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev=>[...prev,{role:"user",text:userMsg}]);

    // Call Claude API for awareness responses
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:`You are a responsible gambling awareness AI assistant embedded in an educational gambling simulation platform. Your role is to:
1. Help users understand the psychological manipulation tactics being demonstrated
2. Warn about addiction risks
3. Explain the mathematics of gambling (house edge, probability)
4. Encourage breaks and responsible behavior
5. NEVER encourage gambling - this is an educational tool only

The user's current stats:
- Bets placed: ${bets.length}
- Current wallet: ${CURRENCY}${wallet} (started with ${CURRENCY}${totalDeposited})
- Net P&L: ${CURRENCY}${wallet-totalDeposited}
- Loss streak: ${lossStreak}
- Time spent: ${Math.floor(timeSpent/60)} minutes
- Addiction risk score: ${addictionScore}/100

Respond in 2-3 sentences max. Be empathetic but firm about risks.`,
          messages:[{role:"user",content:userMsg}]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b=>b.text||"").join("") || "I'm here to help you understand gambling risks.";
      setChatMessages(prev=>[...prev,{role:"bot",text}]);
    } catch {
      setChatMessages(prev=>[...prev,{role:"bot",text:"⚠️ The house always wins in the long run. Your current net loss reflects the designed house edge."}]);
    }
  }

  // STATS
  const totalBets = bets.length;
  const wins = bets.filter(b=>b.won).length;
  const losses = totalBets - wins;
  const netPnL = wallet - totalDeposited;
  const winRate = totalBets ? (wins/totalBets*100).toFixed(1) : 0;

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div style={{fontFamily:"'Rajdhani',sans-serif",background:"#0a0a0f",color:"#e0e0e0",minHeight:"100vh",position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:#111;} ::-webkit-scrollbar-thumb{background:#ff6b35;}
        .glow{text-shadow:0 0 20px #ff6b35,0 0 40px #ff6b35;}
        .glow-green{text-shadow:0 0 15px #00ff88;}
        .glow-red{text-shadow:0 0 15px #ff4444;}
        .card{background:linear-gradient(135deg,#141420,#1a1a2e);border:1px solid #2a2a3e;border-radius:12px;padding:20px;}
        .btn-primary{background:linear-gradient(135deg,#ff6b35,#ff3300);border:none;color:white;padding:12px 24px;border-radius:8px;cursor:pointer;font-family:'Orbitron',sans-serif;font-weight:700;font-size:14px;transition:all 0.2s;letter-spacing:1px;}
        .btn-primary:hover{transform:scale(1.05);box-shadow:0 0 20px #ff6b3588;}
        .btn-secondary{background:transparent;border:1px solid #444;color:#aaa;padding:10px 20px;border-radius:8px;cursor:pointer;font-family:'Rajdhani',sans-serif;font-size:14px;transition:all 0.2s;}
        .btn-secondary:hover{border-color:#ff6b35;color:#ff6b35;}
        .btn-green{background:linear-gradient(135deg,#00c853,#00e676);border:none;color:#000;padding:12px 24px;border-radius:8px;cursor:pointer;font-family:'Orbitron',sans-serif;font-weight:700;font-size:14px;transition:all 0.2s;}
        .btn-green:hover{transform:scale(1.05);box-shadow:0 0 20px #00e67688;}
        .pulse{animation:pulse 2s infinite;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.6;}}
        .spin{animation:spin 0.5s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .slide-in{animation:slideIn 0.3s ease-out;}
        @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        .bounce{animation:bounce 0.5s ease;}
        @keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        .flash-green{animation:flashGreen 0.5s ease;}
        @keyframes flashGreen{0%{background:#00ff8822}50%{background:#00ff8844}100%{background:transparent}}
        .flash-red{animation:flashRed 0.5s ease;}
        @keyframes flashRed{0%{background:#ff444422}50%{background:#ff444444}100%{background:transparent}}
        .reality-highlight{outline:3px solid #ff6b35 !important;outline-offset:3px;position:relative;}
        .reality-tag{position:absolute;top:-8px;right:-8px;background:#ff6b35;color:black;font-size:9px;font-family:'JetBrains Mono',monospace;padding:2px 6px;border-radius:4px;font-weight:700;z-index:10;white-space:nowrap;}
        input[type=range]{accent-color:#ff6b35;}
        .crash-num{font-family:'Orbitron',sans-serif;font-size:48px;font-weight:900;transition:all 0.1s;}
        .slot-reel{font-size:48px;text-align:center;padding:10px;background:#0d0d1a;border:2px solid #2a2a3e;border-radius:8px;min-width:70px;}
        .tab{padding:8px 16px;border-radius:6px;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:600;transition:all 0.2s;border:1px solid transparent;}
        .tab.active{background:#ff6b35;color:white;border-color:#ff6b35;}
        .tab:not(.active):hover{border-color:#ff6b35;color:#ff6b35;}
        .feed-item{padding:8px 12px;border-radius:6px;margin:4px 0;font-size:13px;border-left:3px solid;animation:slideIn 0.3s ease-out;}
        .near-miss-overlay{position:fixed;inset:0;background:#ff6b3511;pointer-events:none;z-index:999;animation:nmFlash 1s ease-out forwards;}
        @keyframes nmFlash{0%{opacity:1}100%{opacity:0}}
        .addiction-bar{height:6px;border-radius:3px;background:linear-gradient(90deg,#00ff88,#ffff00,#ff4444);position:relative;overflow:hidden;}
        .modal-overlay{position:fixed;inset:0;background:#000000cc;z-index:1000;display:flex;align-items:center;justify-content:center;}
        .modal{background:#1a1a2e;border:1px solid #3a3a5e;border-radius:16px;padding:30px;max-width:480px;width:90%;position:relative;}
      `}</style>

      {/* Google Fonts */}

      {/* DISCLAIMER BANNER */}
      <div style={{background:"linear-gradient(90deg,#1a0a00,#2a1000)",borderBottom:"1px solid #ff6b3544",padding:"8px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <span style={{fontSize:"12px",color:"#ff6b35",fontFamily:"'JetBrains Mono',monospace"}}>
          ⚠️ SIMULATION ONLY — This is an educational project demonstrating gambling risks and manipulative design patterns. No real money involved.
        </span>
        <button className="btn-secondary" style={{fontSize:"11px",padding:"4px 10px"}} onClick={()=>setRealityMode(r=>!r)}>
          {realityMode ? "🔴 Truth Mode ON" : "👁 Reveal Truth"}
        </button>
      </div>

      {/* NOTIFICATIONS */}
      <div style={{position:"fixed",top:"50px",right:"16px",zIndex:200,display:"flex",flexDirection:"column",gap:"8px"}}>
        {notifications.map(n=>(
          <div key={n.id} className="slide-in" style={{background:"#1a1a2e",border:"1px solid #ff6b3544",borderRadius:"8px",padding:"10px 14px",fontSize:"13px",maxWidth:"280px",boxShadow:"0 4px 20px #0008"}}>
            {n.text}
          </div>
        ))}
      </div>

      {/* PERSONALIZED MESSAGE */}
      {personalizedMsg && (
        <div style={{position:"fixed",top:"100px",left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#1a1a2e,#2a1a3e)",border:"1px solid #9b59b6",borderRadius:"10px",padding:"12px 20px",zIndex:300,fontSize:"14px",textAlign:"center",boxShadow:"0 0 30px #9b59b644",maxWidth:"360px"}}>
          {realityMode && <div className="reality-tag">🎯 AI PROFILING</div>}
          {personalizedMsg}
        </div>
      )}

      {/* COUNTDOWN TIMER */}
      {countdownTimer > 0 && (
        <div className="pulse" style={{position:"fixed",bottom:"100px",left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#ff3300,#ff6b35)",borderRadius:"10px",padding:"10px 20px",zIndex:300,fontSize:"14px",textAlign:"center",fontFamily:"'Orbitron',sans-serif"}}>
          {realityMode && <div className="reality-tag">⏰ FAKE URGENCY</div>}
          🔥 SPECIAL OFFER ENDS IN {countdownTimer}s — DOUBLE WINNINGS!
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div style={{display:"grid",gridTemplateColumns:"240px 1fr 280px",minHeight:"calc(100vh - 40px)",gap:"0"}}>

        {/* LEFT SIDEBAR */}
        <div style={{background:"#0d0d1a",borderRight:"1px solid #1a1a2e",padding:"20px 16px",display:"flex",flexDirection:"column",gap:"16px"}}>
          {/* Logo */}
          <div style={{textAlign:"center",padding:"10px 0 20px"}}>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"22px",fontWeight:900}} className="glow">
              VEGA<span style={{color:"#ff6b35"}}>BET</span>
            </div>
            <div style={{fontSize:"10px",color:"#666",fontFamily:"'JetBrains Mono',monospace",marginTop:"2px"}}>SIMULATION PLATFORM</div>
          </div>

          {/* Wallet */}
          <div className="card" style={{textAlign:"center",position:"relative"}}>
            {realityMode && <div className="reality-tag">💰 FAKE MONEY</div>}
            <div style={{fontSize:"11px",color:"#888",marginBottom:"4px"}}>BALANCE</div>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"26px",fontWeight:700,color:wallet<300?"#ff4444":"#00ff88"}} className={wallet<300?"glow-red":"glow-green"}>
              {CURRENCY}{wallet.toLocaleString()}
            </div>
            <div style={{fontSize:"11px",color:netPnL>=0?"#00ff88":"#ff4444",marginTop:"4px"}}>
              {netPnL>=0?"▲":"▼"} {CURRENCY}{Math.abs(netPnL)} {netPnL>=0?"profit":"loss"}
            </div>
            <div style={{display:"flex",gap:"8px",marginTop:"12px"}}>
              <button className="btn-green" style={{flex:1,fontSize:"12px",padding:"8px"}} onClick={()=>{setWallet(w=>w+500);setTotalDeposited(d=>d+500);addNotification("💳 ₹500 deposited instantly!");}}>
                + Deposit
              </button>
              <button className="btn-secondary" style={{flex:1,fontSize:"12px",padding:"8px",position:"relative"}} onClick={()=>setShowWithdrawModal(true)}>
                {realityMode && <span className="reality-tag">🚫 FRICTION</span>}
                Withdraw
              </button>
            </div>
          </div>

          {/* Nav */}
          <nav style={{display:"flex",flexDirection:"column",gap:"4px"}}>
            {[["🎮","Games","lobby"],["📊","Dashboard","dashboard"],["🧠","Awareness","awareness"],["🎣","Phishing Demo","phishing"]].map(([icon,label,scr])=>(
              <button key={scr} onClick={()=>setScreen(scr)} style={{background:screen===scr?"#ff6b3522":"transparent",border:screen===scr?"1px solid #ff6b3544":"1px solid transparent",borderRadius:"8px",padding:"10px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:"10px",color:screen===scr?"#ff6b35":"#aaa",textAlign:"left",fontFamily:"'Rajdhani',sans-serif",fontSize:"15px",fontWeight:600,transition:"all 0.2s"}}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </nav>

          {/* Addiction Score */}
          <div className="card" style={{marginTop:"auto"}}>
            <div style={{fontSize:"11px",color:"#888",marginBottom:"6px",display:"flex",justifyContent:"space-between"}}>
              <span>ADDICTION RISK</span>
              <span style={{color:addictionScore>70?"#ff4444":addictionScore>40?"#ffaa00":"#00ff88",fontWeight:700}}>{addictionScore}/100</span>
            </div>
            <div style={{background:"#0d0d1a",borderRadius:"3px",height:"6px",overflow:"hidden"}}>
              <div style={{width:`${addictionScore}%`,height:"100%",background:`linear-gradient(90deg,#00ff88,${addictionScore>70?"#ff4444":addictionScore>40?"#ffaa00":"#00ff88"})`,transition:"width 1s",borderRadius:"3px"}}/>
            </div>
            {addictionScore > 60 && <div style={{fontSize:"11px",color:"#ff4444",marginTop:"6px"}}>⚠️ High risk behavior detected</div>}
          </div>

          {/* Chat Toggle */}
          <button onClick={()=>setShowChat(c=>!c)} style={{background:"#1a2a1a",border:"1px solid #00ff8833",borderRadius:"8px",padding:"10px",cursor:"pointer",color:"#00ff88",fontSize:"13px",fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>
            🤖 {showChat?"Hide":"Show"} Safety AI
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div style={{padding:"24px",overflowY:"auto",maxHeight:"calc(100vh - 40px)"}}>
          {screen === "lobby" && <LobbyScreen game={game} setGame={setGame} setScreen={setScreen} bets={bets} realityMode={realityMode} />}
          {screen === "game" && (
            <GameScreen
              game={game} wallet={wallet} betAmount={betAmount} setBetAmount={setBetAmount}
              placeBet={placeBet} runSlots={runSlots} isSpinning={isSpinning}
              gameResult={gameResult} slotSymbols={slotSymbols}
              crashMultiplier={crashMultiplier} crashState={crashState}
              startCrash={startCrash} cashOutCrash={cashOutCrash}
              bets={bets} realityMode={realityMode} lossStreak={lossStreak} winStreak={winStreak}
            />
          )}
          {screen === "dashboard" && <DashboardScreen bets={bets} wallet={wallet} totalDeposited={totalDeposited} timeSpent={timeSpent} addictionScore={addictionScore} realityMode={realityMode} />}
          {screen === "awareness" && <AwarenessScreen />}
          {screen === "phishing" && <PhishingScreen />}
        </div>

        {/* RIGHT SIDEBAR - Live Feed */}
        <div style={{background:"#0d0d1a",borderLeft:"1px solid #1a1a2e",padding:"16px",overflowY:"auto",maxHeight:"calc(100vh - 40px)"}}>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"13px",color:"#ff6b35",marginBottom:"12px",display:"flex",alignItems:"center",gap:"8px"}}>
            <span className="pulse" style={{width:"8px",height:"8px",background:"#ff6b35",borderRadius:"50%",display:"inline-block"}}/>
            LIVE ACTIVITY
            {realityMode && <span style={{fontSize:"9px",background:"#ff6b35",color:"black",padding:"2px 6px",borderRadius:"4px",fontFamily:"'JetBrains Mono',monospace"}}>FAKE</span>}
          </div>

          {feed.map(f=>(
            <div key={f.id} className="feed-item" style={{borderColor:f.won?"#00ff88":"#ff6b35",background:f.won?"#00ff8808":"#ff6b3508",color:f.won?"#aaffcc":"#ffccaa"}}>
              {f.text}
              <div style={{fontSize:"10px",color:"#666",marginTop:"2px"}}>{f.time}</div>
            </div>
          ))}

          {/* Leaderboard */}
          <div style={{marginTop:"20px"}}>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"12px",color:"#888",marginBottom:"10px",display:"flex",alignItems:"center",gap:"6px"}}>
              🏆 TOP WINNERS TODAY
              {realityMode && <span style={{fontSize:"9px",background:"#ff6b35",color:"black",padding:"2px 4px",borderRadius:"3px",fontFamily:"'JetBrains Mono',monospace"}}>FABRICATED</span>}
            </div>
            {FAKE_USERS.slice(0,5).map((u,i)=>(
              <div key={u} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #1a1a2e",fontSize:"13px"}}>
                <span style={{color:["#ffd700","#c0c0c0","#cd7f32","#aaa","#888"][i]}}>{["🥇","🥈","🥉","4","5"][i]} {u}</span>
                <span style={{color:"#00ff88"}}>+{CURRENCY}{rand(5000,50000).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHAT */}
      {showChat && (
        <div style={{position:"fixed",bottom:"20px",right:"300px",width:"320px",background:"#1a1a2e",border:"1px solid #00ff8844",borderRadius:"12px",zIndex:500,overflow:"hidden",boxShadow:"0 0 30px #00ff8822"}}>
          <div style={{background:"#0d1a0d",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{color:"#00ff88",fontFamily:"'Orbitron',sans-serif",fontSize:"12px"}}>🤖 SAFETY AI ASSISTANT</span>
            <button onClick={()=>setShowChat(false)} style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:"18px"}}>×</button>
          </div>
          <div style={{height:"240px",overflowY:"auto",padding:"12px",display:"flex",flexDirection:"column",gap:"8px"}}>
            {chatMessages.map((m,i)=>(
              <div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start",background:m.role==="user"?"#ff6b3522":"#00ff8811",border:`1px solid ${m.role==="user"?"#ff6b3544":"#00ff8844"}`,borderRadius:"8px",padding:"8px 12px",fontSize:"13px",maxWidth:"85%"}}>
                {m.text}
              </div>
            ))}
          </div>
          <div style={{padding:"10px",borderTop:"1px solid #1a2a1a",display:"flex",gap:"8px"}}>
            <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Ask about gambling risks..." style={{flex:1,background:"#0d1a0d",border:"1px solid #2a3a2a",borderRadius:"6px",padding:"8px",color:"#e0e0e0",fontSize:"13px",fontFamily:"'Rajdhani',sans-serif"}}/>
            <button onClick={sendChat} className="btn-green" style={{padding:"8px 12px",fontSize:"12px"}}>↑</button>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL - Dark pattern friction */}
      {showWithdrawModal && (
        <div className="modal-overlay">
          <div className="modal" style={{maxWidth:"440px"}}>
            <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:"18px",marginBottom:"16px",color:"#ff6b35"}}>
              Withdraw Funds
            </h2>
            {realityMode && (
              <div style={{background:"#ff6b3522",border:"1px solid #ff6b35",borderRadius:"8px",padding:"12px",marginBottom:"16px",fontSize:"12px",color:"#ff6b35"}}>
                🎯 DARK PATTERN: Withdrawals have 5 friction steps. Deposits are instant 1-click.
              </div>
            )}
            {withdrawStep === 0 && (
              <div>
                <p style={{color:"#aaa",fontSize:"14px",marginBottom:"16px"}}>Please complete KYC verification before withdrawing.</p>
                <p style={{color:"#888",fontSize:"12px",marginBottom:"20px"}}>Step 1 of 5: Identity Verification</p>
                <input placeholder="Aadhaar Number" style={{width:"100%",background:"#0d0d1a",border:"1px solid #333",borderRadius:"8px",padding:"10px",color:"#e0e0e0",marginBottom:"10px",fontFamily:"'Rajdhani',sans-serif",fontSize:"14px"}}/>
              </div>
            )}
            {withdrawStep === 1 && (
              <div>
                <p style={{color:"#aaa",fontSize:"14px",marginBottom:"16px"}}>Step 2 of 5: Upload PAN Card</p>
                <div style={{border:"2px dashed #333",borderRadius:"8px",padding:"30px",textAlign:"center",color:"#666",marginBottom:"16px"}}>📄 Click to upload PAN card image</div>
              </div>
            )}
            {withdrawStep === 2 && (
              <div>
                <p style={{color:"#aaa",fontSize:"14px",marginBottom:"16px"}}>Step 3 of 5: Bank Account Verification</p>
                <input placeholder="Account Number" style={{width:"100%",background:"#0d0d1a",border:"1px solid #333",borderRadius:"8px",padding:"10px",color:"#e0e0e0",marginBottom:"10px",fontFamily:"'Rajdhani',sans-serif",fontSize:"14px"}}/>
                <input placeholder="IFSC Code" style={{width:"100%",background:"#0d0d1a",border:"1px solid #333",borderRadius:"8px",padding:"10px",color:"#e0e0e0",fontFamily:"'Rajdhani',sans-serif",fontSize:"14px"}}/>
              </div>
            )}
            {withdrawStep === 3 && (
              <div>
                <p style={{color:"#aaa",fontSize:"14px",marginBottom:"8px"}}>Step 4 of 5: Bonus Rollover Check</p>
                <div style={{background:"#1a0a00",border:"1px solid #ff6b3544",borderRadius:"8px",padding:"12px",fontSize:"12px",color:"#ff6b35",marginBottom:"16px",cursor:"pointer"}} onClick={()=>setShowBonusTerm(true)}>
                  ⚠️ You must complete 10x rollover of all bonuses before withdrawal. <u>View Terms (47 pages)</u>
                </div>
                <p style={{color:"#888",fontSize:"12px"}}>Remaining rollover requirement: ₹{rand(2000,8000).toLocaleString()}</p>
              </div>
            )}
            {withdrawStep === 4 && (
              <div>
                <p style={{color:"#aaa",fontSize:"14px",marginBottom:"8px"}}>Step 5 of 5: Withdrawal Request</p>
                <div style={{background:"#0a1a0a",border:"1px solid #00ff8833",borderRadius:"8px",padding:"12px",fontSize:"13px",marginBottom:"16px"}}>
                  ✅ Request submitted<br/>
                  <span style={{color:"#888",fontSize:"12px"}}>Processing time: 3-5 business days<br/>Minimum withdrawal: ₹1,000<br/>Fee: 2.5%</span>
                </div>
              </div>
            )}
            <div style={{display:"flex",gap:"10px",marginTop:"8px"}}>
              <button className="btn-primary" onClick={nextWithdrawStep} style={{flex:2}}>
                {withdrawStep < 4 ? "Continue →" : "Done"}
              </button>
              <button className="btn-secondary" style={{flex:1}} onClick={()=>{setShowWithdrawModal(false);setWithdrawStep(0);}}>Cancel</button>
            </div>
            <div style={{marginTop:"12px",textAlign:"center"}}>
              <button style={{background:"linear-gradient(135deg,#00c853,#00e676)",border:"none",color:"#000",borderRadius:"8px",padding:"10px 20px",cursor:"pointer",fontFamily:"'Orbitron',sans-serif",fontWeight:700,fontSize:"13px",width:"100%"}} onClick={()=>{setWallet(w=>w+500);setTotalDeposited(d=>d+500);setShowWithdrawModal(false);setWithdrawStep(0);addNotification("💳 ₹500 deposited instantly!");}}>
                💳 DEPOSIT INSTEAD (Instant!)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BONUS POPUP */}
      {showBonusPopup && (
        <div className="modal-overlay">
          <div className="modal" style={{textAlign:"center"}}>
            {realityMode && <div className="reality-tag">🎪 MANIPULATION TACTIC</div>}
            <div style={{fontSize:"48px",marginBottom:"12px"}}>🎁</div>
            <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:"20px",color:"#ff6b35",marginBottom:"8px"}}>SECOND CHANCE BONUS!</h2>
            <p style={{color:"#aaa",fontSize:"14px",marginBottom:"20px"}}>We noticed your bad luck streak. Here's a 50% bonus on your next bet! <span style={{color:"#888",fontSize:"11px"}}>(wagering requirements apply*)</span></p>
            <div style={{display:"flex",gap:"10px",justifyContent:"center"}}>
              <button className="btn-primary" onClick={()=>{setShowBonusPopup(false);addNotification("🎁 50% Bonus activated! *10x rollover required");}}>Claim Bonus!</button>
              <button className="btn-secondary" onClick={()=>setShowBonusPopup(false)} style={{fontSize:"11px",color:"#555"}}>No thanks (give up)</button>
            </div>
          </div>
        </div>
      )}

      {/* BONUS TERMS */}
      {showBonusTerm && (
        <div className="modal-overlay">
          <div className="modal" style={{maxHeight:"60vh",overflowY:"auto"}}>
            <h3 style={{color:"#ff6b35",marginBottom:"12px"}}>Terms & Conditions (47 pages)</h3>
            {[...Array(8)].map((_,i)=>(
              <p key={i} style={{fontSize:"11px",color:"#666",marginBottom:"8px",lineHeight:"1.6"}}>
                {i+1}. {"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Bonus wagering requirements of 10x must be met within 30 days. Platform reserves the right to void winnings at any time. ".repeat(2)}
              </p>
            ))}
            <button className="btn-primary" onClick={()=>setShowBonusTerm(false)} style={{marginTop:"12px",width:"100%"}}>I Agree (didn't read)</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// LOBBY SCREEN
// ============================================================
function LobbyScreen({game, setGame, setScreen, bets, realityMode}){
  const games = [
    {id:"coin",icon:"🪙",name:"Coin Toss",desc:"50/50 chance... or is it?",odds:"~45% win rate"},
    {id:"dice",icon:"🎲",name:"Dice Roll",desc:"Pick your number",odds:"~38% win rate"},
    {id:"slots",icon:"🎰",name:"Slot Machine",desc:"Three symbols to match",odds:"~28% win rate"},
    {id:"crash",icon:"📈",name:"Crash Game",desc:"Cash out before it crashes!",odds:"~35% win rate"},
  ];
  return (
    <div>
      <div style={{marginBottom:"24px"}}>
        <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:"28px",fontWeight:900}} className="glow">
          GAME LOBBY
        </h1>
        <p style={{color:"#888",fontSize:"14px",marginTop:"4px"}}>Choose your game. Remember: the house always wins.</p>
      </div>

      {realityMode && (
        <div style={{background:"#ff6b3511",border:"1px solid #ff6b35",borderRadius:"10px",padding:"16px",marginBottom:"20px",fontSize:"13px",color:"#ff6b35",lineHeight:"1.8"}}>
          <strong>🔍 REALITY MODE — What's really happening:</strong><br/>
          • Win probability starts high ({">"}70%) to hook you, then drops below 25%<br/>
          • "Near miss" results are deliberately injected to simulate almost-winning<br/>
          • The live feed shows fabricated users — no real players exist<br/>
          • Odds displayed are higher than actual programmed odds
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"16px",marginBottom:"24px"}}>
        {games.map(g=>(
          <div key={g.id}
            onClick={()=>{setGame(g.id);setScreen("game");}}
            style={{
              background:game===g.id?"linear-gradient(135deg,#1a1a2e,#2a1a3e)":"linear-gradient(135deg,#141420,#1a1a2e)",
              border:game===g.id?"1px solid #ff6b35":"1px solid #2a2a3e",
              borderRadius:"12px",padding:"24px",cursor:"pointer",transition:"all 0.2s",position:"relative"
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 30px #ff6b3522";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}
          >
            {realityMode && <div style={{position:"absolute",top:"8px",right:"8px",background:"#ff6b35",color:"black",fontSize:"10px",padding:"2px 6px",borderRadius:"4px",fontFamily:"'JetBrains Mono',monospace"}}>{g.odds}</div>}
            <div style={{fontSize:"40px",marginBottom:"8px"}}>{g.icon}</div>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"16px",fontWeight:700,marginBottom:"4px"}}>{g.name}</div>
            <div style={{color:"#888",fontSize:"13px"}}>{g.desc}</div>
            <div style={{marginTop:"12px",color:"#ff6b35",fontSize:"13px",fontWeight:600}}>PLAY NOW →</div>
          </div>
        ))}
      </div>

      {bets.length > 0 && (
        <div className="card">
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"13px",color:"#888",marginBottom:"12px"}}>RECENT BETS</div>
          {bets.slice(0,5).map(b=>(
            <div key={b.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #1a1a2e",fontSize:"13px"}}>
              <span>{b.game} — {b.won?"WIN":"LOSS"}</span>
              <span style={{color:b.won?"#00ff88":"#ff4444",fontFamily:"'JetBrains Mono',monospace"}}>
                {b.won?"+":""}{b.pnl}
              </span>
              {realityMode && <span style={{fontSize:"10px",color:"#666"}}>prob:{(b.actualWinProb*100).toFixed(0)}%{b.nearMiss?" NEAR-MISS":""}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// GAME SCREEN
// ============================================================
function GameScreen({game,wallet,betAmount,setBetAmount,placeBet,runSlots,isSpinning,gameResult,slotSymbols,crashMultiplier,crashState,startCrash,cashOutCrash,bets,realityMode,lossStreak,winStreak}){
  const [diceResult, setDiceResult] = useState(null);
  const [diceChoice, setDiceChoice] = useState(1);
  const [coinSide, setCoinSide] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);

  function flipCoin(choice){
    if(isFlipping||isSpinning) return;
    setIsFlipping(true);
    setCoinSide(null);
    setTimeout(()=>{
      const result = Math.random()<0.5?"heads":"tails";
      setCoinSide(result);
      setIsFlipping(false);
      placeBet(choice);
    },800);
  }

  function rollDice(){
    if(isSpinning) return;
    const result = Math.floor(Math.random()*6)+1;
    setDiceResult(result);
    placeBet(diceChoice);
  }

  const wonStr = lossStreak===0&&winStreak>1 ? `🔥 ${winStreak} win streak!` : lossStreak>0 ? `❄️ ${lossStreak} loss streak` : "";

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"24px"}}>
        <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:"24px"}} className="glow">
          {game==="coin"?"🪙 COIN TOSS":game==="dice"?"🎲 DICE ROLL":game==="slots"?"🎰 SLOT MACHINE":"📈 CRASH GAME"}
        </h1>
        {wonStr && <span style={{background:"#1a1a2e",border:"1px solid #ff6b3544",borderRadius:"6px",padding:"4px 10px",fontSize:"13px"}}>{wonStr}</span>}
      </div>

      {realityMode && (
        <div style={{background:"#ff6b3311",border:"1px solid #ff6b33",borderRadius:"8px",padding:"12px",marginBottom:"16px",fontSize:"12px",color:"#ff9955",lineHeight:"1.7"}}>
          📊 Actual win probability: <strong>{(getWinProbability(bets.length)*100).toFixed(0)}%</strong> (after {bets.length} rounds) | 
          Near-miss injection: every ~3rd loss | House edge: {(100-getWinProbability(bets.length)*100).toFixed(0)}%
        </div>
      )}

      {/* Result Banner */}
      {gameResult && !isSpinning && (
        <div className={gameResult.won?"flash-green":"flash-red"} style={{
          background:gameResult.won?"#00ff8811":"#ff444411",
          border:`1px solid ${gameResult.won?"#00ff88":"#ff4444"}`,
          borderRadius:"10px",padding:"16px",marginBottom:"20px",textAlign:"center"
        }}>
          {gameResult.nearMiss && !gameResult.won ? (
            <>
              <div style={{fontSize:"24px",marginBottom:"4px"}}>😱</div>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"18px",color:"#ffaa00"}}>SO CLOSE!</div>
              <div style={{color:"#ffaa00",fontSize:"14px"}}>You almost won! Try again!</div>
              {realityMode && <div style={{fontSize:"11px",color:"#ff6b35",marginTop:"8px"}}>⚡ Near-miss deliberately injected to encourage continued play</div>}
            </>
          ) : (
            <>
              <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"22px",color:gameResult.won?"#00ff88":"#ff4444"}}>
                {gameResult.won ? "🎉 YOU WON!" : "😔 YOU LOST"}
              </div>
              <div style={{fontSize:"20px",fontFamily:"'JetBrains Mono',monospace",marginTop:"4px",color:gameResult.won?"#00ff88":"#ff4444"}}>
                {gameResult.won?"+":""}{CURRENCY}{Math.abs(gameResult.pnl)}
              </div>
            </>
          )}
        </div>
      )}

      {/* BET AMOUNT */}
      <div className="card" style={{marginBottom:"16px",position:"relative"}}>
        {realityMode && <div className="reality-tag">💸 LOSS ACCELERATOR</div>}
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px",fontSize:"13px",color:"#888"}}>
          <span>BET AMOUNT</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",color:"#ff6b35",fontSize:"16px",fontWeight:700}}>{CURRENCY}{betAmount}</span>
        </div>
        <input type="range" min="10" max={Math.min(wallet,5000)} step="10" value={betAmount} onChange={e=>setBetAmount(Number(e.target.value))} style={{width:"100%",marginBottom:"10px"}}/>
        <div style={{display:"flex",gap:"8px"}}>
          {[50,100,200,500,1000].map(amt=>(
            <button key={amt} onClick={()=>setBetAmount(Math.min(amt,wallet))} className="btn-secondary" style={{flex:1,padding:"6px 4px",fontSize:"12px"}}>{amt}</button>
          ))}
          <button onClick={()=>setBetAmount(wallet)} className="btn-secondary" style={{flex:1,padding:"6px 4px",fontSize:"12px",color:"#ff4444",borderColor:"#ff4444"}}>ALL IN</button>
        </div>
      </div>

      {/* GAME AREAS */}
      {game==="coin" && (
        <div className="card" style={{textAlign:"center"}}>
          <div style={{fontSize:"80px",margin:"20px 0",transition:"transform 0.8s",transform:isFlipping?"rotateY(720deg)":"rotateY(0)"}}>
            {isFlipping?"🪙":coinSide==="heads"?"⭕":"🔵"}
          </div>
          {coinSide && !isFlipping && <div style={{fontSize:"16px",marginBottom:"16px",color:"#aaa"}}>{coinSide.toUpperCase()}</div>}
          <div style={{display:"flex",gap:"12px",justifyContent:"center"}}>
            <button className="btn-primary" onClick={()=>flipCoin("heads")} disabled={isFlipping||isSpinning} style={{flex:1,maxWidth:"180px",position:"relative"}}>
              {realityMode && <span style={{position:"absolute",top:"-8px",left:"50%",transform:"translateX(-50%)",background:"#ff6b35",color:"black",fontSize:"9px",padding:"1px 6px",borderRadius:"3px",whiteSpace:"nowrap"}}>~{(getWinProbability(bets.length)*100).toFixed(0)}% real odds</span>}
              HEADS
            </button>
            <button className="btn-primary" onClick={()=>flipCoin("tails")} disabled={isFlipping||isSpinning} style={{flex:1,maxWidth:"180px"}}>
              TAILS
            </button>
          </div>
        </div>
      )}

      {game==="dice" && (
        <div className="card" style={{textAlign:"center"}}>
          <div style={{fontSize:"80px",margin:"20px 0"}}>{diceResult?["","⚀","⚁","⚂","⚃","⚄","⚅"][diceResult]:"🎲"}</div>
          <div style={{marginBottom:"16px"}}>
            <div style={{fontSize:"13px",color:"#888",marginBottom:"8px"}}>PICK A NUMBER (1-6)</div>
            <div style={{display:"flex",gap:"8px",justifyContent:"center"}}>
              {[1,2,3,4,5,6].map(n=>(
                <button key={n} onClick={()=>setDiceChoice(n)} style={{
                  width:"44px",height:"44px",borderRadius:"8px",border:`2px solid ${diceChoice===n?"#ff6b35":"#333"}`,
                  background:diceChoice===n?"#ff6b3322":"transparent",color:diceChoice===n?"#ff6b35":"#aaa",
                  fontSize:"18px",cursor:"pointer",fontWeight:700
                }}>{n}</button>
              ))}
            </div>
          </div>
          <button className="btn-primary" onClick={rollDice} disabled={isSpinning} style={{width:"200px"}}>
            🎲 ROLL DICE
          </button>
          {diceResult && <div style={{marginTop:"12px",fontSize:"14px",color:diceResult===diceChoice?"#00ff88":"#ff4444"}}>
            Rolled: {diceResult} — {diceResult===diceChoice?"MATCH! You won!":"No match."}
          </div>}
        </div>
      )}

      {game==="slots" && (
        <div className="card" style={{textAlign:"center"}}>
          <div style={{display:"flex",gap:"12px",justifyContent:"center",margin:"20px 0"}}>
            {slotSymbols.map((s,i)=>(
              <div key={i} className={`slot-reel${isSpinning?" spin":""}`}>{s}</div>
            ))}
          </div>
          {!isSpinning && slotSymbols[0]===slotSymbols[1]&&slotSymbols[1]!==slotSymbols[2] && (
            <div style={{color:"#ffaa00",fontSize:"14px",marginBottom:"12px"}}>😱 TWO MATCHING! SO CLOSE!</div>
          )}
          <button className="btn-primary" onClick={runSlots} disabled={isSpinning} style={{width:"200px"}}>
            {isSpinning ? "🎰 SPINNING..." : "🎰 SPIN!"}
          </button>
          <div style={{marginTop:"8px",fontSize:"12px",color:"#666"}}>
            3 matching = 3x win | 2 matching = near miss
          </div>
        </div>
      )}

      {game==="crash" && (
        <div className="card" style={{textAlign:"center"}}>
          <div className="crash-num" style={{color:crashState==="crashed"?"#ff4444":crashState==="cashed"?"#00ff88":"#ff6b35",margin:"20px 0",fontFamily:"'Orbitron',sans-serif",fontSize:"56px"}}>
            {crashMultiplier.toFixed(2)}x
            {crashState==="crashed" && <div style={{fontSize:"24px",color:"#ff4444"}}>💥 CRASHED!</div>}
            {crashState==="cashed" && <div style={{fontSize:"24px",color:"#00ff88"}}>💰 CASHED OUT!</div>}
          </div>
          {crashState==="idle" && <button className="btn-primary" onClick={startCrash} style={{width:"200px",marginBottom:"12px"}}>🚀 START GAME</button>}
          {crashState==="running" && (
            <>
              <div style={{color:"#aaa",fontSize:"13px",marginBottom:"12px"}}>Potential win: {CURRENCY}{Math.floor(crashBet*crashMultiplier)}</div>
              <button className="btn-green" onClick={cashOutCrash} style={{width:"200px",fontSize:"16px",padding:"14px"}}>💰 CASH OUT NOW!</button>
            </>
          )}
          {(crashState==="crashed"||crashState==="cashed") && (
            <button className="btn-secondary" onClick={()=>{if(typeof startCrash==="function"){}}} style={{width:"200px"}} onClick={()=>{ window.location.reload&&null; document.querySelector(".btn-primary")&&null; }}>
              <span onClick={()=>window.dispatchEvent(new CustomEvent("reset-crash"))}>Play Again</span>
            </button>
          )}
          {realityMode && <div style={{fontSize:"11px",color:"#ff6b35",marginTop:"12px"}}>📊 Crash games create maximum FOMO — the multiplier rising triggers greed, crashing triggers panic</div>}
        </div>
      )}
    </div>
  );
}

// ============================================================
// DASHBOARD SCREEN
// ============================================================
function DashboardScreen({bets, wallet, totalDeposited, timeSpent, addictionScore, realityMode}){
  const wins = bets.filter(b=>b.won).length;
  const losses = bets.length - wins;
  const netPnL = wallet - totalDeposited;
  const winRate = bets.length ? (wins/bets.length*100).toFixed(1) : 0;
  const avgBet = bets.length ? (bets.reduce((s,b)=>s+b.amount,0)/bets.length).toFixed(0) : 0;

  // Calculate running balance for chart
  const runningBalance = [];
  let bal = totalDeposited;
  runningBalance.push(bal);
  bets.slice().reverse().forEach(b=>{ bal+=b.pnl; runningBalance.push(bal); });

  const maxBal = Math.max(...runningBalance);
  const minBal = Math.min(...runningBalance);
  const range = maxBal - minBal || 1;

  return (
    <div>
      <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:"24px",marginBottom:"20px"}} className="glow">
        📊 ANALYTICS DASHBOARD
      </h1>

      {realityMode && (
        <div style={{background:"#ff6b3311",border:"1px solid #ff6b35",borderRadius:"8px",padding:"12px",marginBottom:"16px",fontSize:"12px",color:"#ff9955",lineHeight:"1.7"}}>
          💡 This dashboard shows your actual gambling behavior. Real platforms hide this data to prevent you from seeing your losses clearly.
        </div>
      )}

      {/* Stats Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"20px"}}>
        {[
          {label:"TOTAL BETS",value:bets.length,color:"#aaa"},
          {label:"WIN RATE",value:`${winRate}%`,color:winRate>50?"#00ff88":"#ff4444"},
          {label:"NET P&L",value:`${netPnL>=0?"+":""}${CURRENCY}${netPnL}`,color:netPnL>=0?"#00ff88":"#ff4444"},
          {label:"TIME SPENT",value:`${Math.floor(timeSpent/60)}m ${timeSpent%60}s`,color:"#ffaa00"},
        ].map(s=>(
          <div key={s.label} className="card" style={{textAlign:"center"}}>
            <div style={{fontSize:"10px",color:"#666",marginBottom:"4px",fontFamily:"'JetBrains Mono',monospace"}}>{s.label}</div>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"20px",fontWeight:700,color:s.color}}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Balance Chart */}
      <div className="card" style={{marginBottom:"16px"}}>
        <div style={{fontSize:"13px",color:"#888",marginBottom:"12px",fontFamily:"'Orbitron',sans-serif"}}>BALANCE OVER TIME</div>
        {runningBalance.length > 1 ? (
          <svg viewBox={`0 0 ${runningBalance.length*20} 120`} style={{width:"100%",height:"120px"}}>
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={netPnL>=0?"#00ff88":"#ff4444"} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={netPnL>=0?"#00ff88":"#ff4444"} stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* Line */}
            <polyline
              points={runningBalance.map((b,i)=>`${i*20+10},${110-((b-minBal)/range)*100}`).join(" ")}
              fill="none"
              stroke={netPnL>=0?"#00ff88":"#ff4444"}
              strokeWidth="2"
            />
            {/* Area */}
            <polygon
              points={`10,110 ${runningBalance.map((b,i)=>`${i*20+10},${110-((b-minBal)/range)*100}`).join(" ")} ${(runningBalance.length-1)*20+10},110`}
              fill="url(#balGrad)"
            />
            {/* Baseline */}
            <line x1="10" y1={110-((totalDeposited-minBal)/range)*100} x2={(runningBalance.length-1)*20+10} y2={110-((totalDeposited-minBal)/range)*100} stroke="#555" strokeWidth="1" strokeDasharray="4,4"/>
          </svg>
        ) : (
          <div style={{textAlign:"center",color:"#555",padding:"40px"}}>Place some bets to see your balance history</div>
        )}
        <div style={{display:"flex",gap:"16px",fontSize:"11px",color:"#666",marginTop:"8px"}}>
          <span>── Starting balance: {CURRENCY}{totalDeposited}</span>
          <span style={{color:netPnL>=0?"#00ff88":"#ff4444"}}>── Your balance</span>
        </div>
      </div>

      {/* Win/Loss breakdown */}
      <div className="card" style={{marginBottom:"16px"}}>
        <div style={{fontSize:"13px",color:"#888",marginBottom:"12px",fontFamily:"'Orbitron',sans-serif"}}>WIN / LOSS BREAKDOWN</div>
        <div style={{display:"flex",height:"20px",borderRadius:"6px",overflow:"hidden",marginBottom:"8px"}}>
          <div style={{width:`${wins/(bets.length||1)*100}%`,background:"#00ff88",transition:"width 1s"}}/>
          <div style={{flex:1,background:"#ff4444"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:"13px"}}>
          <span style={{color:"#00ff88"}}>✅ Wins: {wins}</span>
          <span style={{color:"#ff4444"}}>❌ Losses: {losses}</span>
        </div>
        {realityMode && bets.length > 5 && (
          <div style={{marginTop:"12px",fontSize:"12px",color:"#ff6b35",background:"#1a0a00",borderRadius:"6px",padding:"10px"}}>
            🔍 Actual programmed odds at round {bets.length}: {(getWinProbability(bets.length)*100).toFixed(0)}% win probability. 
            Displayed odds suggested 50%. You are experiencing {(50-getWinProbability(bets.length)*100).toFixed(0)}% manipulation disadvantage.
          </div>
        )}
      </div>

      {/* Bet history table */}
      <div className="card">
        <div style={{fontSize:"13px",color:"#888",marginBottom:"12px",fontFamily:"'Orbitron',sans-serif"}}>RECENT HISTORY</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"8px",fontSize:"11px",color:"#666",padding:"0 0 8px",borderBottom:"1px solid #1a1a2e"}}>
          <span>GAME</span><span>AMOUNT</span><span>RESULT</span><span>P&L</span>
        </div>
        {bets.slice(0,10).map(b=>(
          <div key={b.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"8px",fontSize:"13px",padding:"8px 0",borderBottom:"1px solid #0d0d1a",alignItems:"center"}}>
            <span>{b.game}</span>
            <span>{CURRENCY}{b.amount}</span>
            <span style={{color:b.won?"#00ff88":"#ff4444"}}>{b.won?"WIN":"LOSS"}{b.nearMiss?" 🎯":""}</span>
            <span style={{color:b.pnl>=0?"#00ff88":"#ff4444",fontFamily:"'JetBrains Mono',monospace"}}>{b.pnl>=0?"+":""}{b.pnl}</span>
          </div>
        ))}
        {bets.length===0 && <div style={{textAlign:"center",color:"#555",padding:"20px"}}>No bets yet. Start playing!</div>}
      </div>
    </div>
  );
}

// ============================================================
// AWARENESS SCREEN
// ============================================================
function AwarenessScreen(){
  const [activeSection, setActiveSection] = useState(0);
  const sections = [
    {
      title:"🧠 Psychological Manipulation",
      content:[
        {h:"Intermittent Reward Schedules",p:"Gambling platforms use variable ratio reinforcement — the same mechanism that makes slot machines addictive. Wins are unpredictable, which creates stronger behavioral conditioning than consistent rewards."},
        {h:"Near-Miss Effect",p:"When you 'almost win' (two matching slots, dice landing one off), your brain processes it similarly to an actual win. Platforms deliberately engineer near-misses to maintain motivation without paying out."},
        {h:"Loss Chasing",p:"After losses, the brain enters a hyperactivated state seeking to 'recover' losses. Platforms exploit this with 'Second Chance' bonuses, keeping users in a spending loop."},
        {h:"Sunk Cost Fallacy",p:"'I've already lost so much, I might as well keep going to win it back.' This cognitive bias is exploited through time-limited bonus offers and streak messaging."},
      ]
    },
    {
      title:"📊 The Mathematics of Loss",
      content:[
        {h:"House Edge",p:"Every game has a built-in house advantage. A 2-5% house edge means that for every ₹100 bet, the platform keeps ₹2-5 on average. Over time, this guarantees the house profits."},
        {h:"Gambler's Fallacy",p:"Past results don't affect future odds. After 10 losses in a row, the probability of the next bet winning is identical to the first bet. Platforms use streak messaging to exploit this misconception."},
        {h:"Expected Value",p:"If a coin toss pays 2x but has a 45% win rate (not 50%), the expected value per ₹100 bet is: (0.45 × ₹200) + (0.55 × ₹0) − ₹100 = −₹10. You're expected to lose ₹10 per bet."},
      ]
    },
    {
      title:"🎨 Dark UX Patterns",
      content:[
        {h:"Asymmetric Design",p:"Deposit buttons are bright, prominent, and one-click. Withdrawal buttons are hidden, require multiple steps, and have waiting periods of days."},
        {h:"Fake Urgency",p:"Countdown timers ('Offer ends in 30s!') create artificial scarcity and pressure users into quick decisions without rational consideration."},
        {h:"Social Proof Manipulation",p:"Live feeds showing 'User123 just won ₹5000!' are often fabricated or heavily skewed to show wins. Real loss data is never displayed publicly."},
        {h:"Confusing Bonus Terms",p:"Bonuses come with 'wagering requirements' buried in 47-page terms. A ₹500 bonus might require ₹10,000 in bets before withdrawal — often impossible to clear."},
      ]
    },
    {
      title:"🔐 Cybersecurity Risks",
      content:[
        {h:"Fake Platforms",p:"Fraudulent gambling sites mimic real ones to steal payment information. They may allow early wins to build trust before the scam."},
        {h:"Data Harvesting",p:"Real gambling platforms collect extensive behavioral data — your bet frequency, loss patterns, and emotional state — to optimize manipulation strategies."},
        {h:"Unlicensed Operators",p:"Many online gambling sites operate without proper licensing. If you win, they may refuse payouts citing obscure terms. Your legal recourse is minimal."},
        {h:"Payment Traps",p:"Some platforms make it easy to deposit via UPI/cards but require bank transfers for withdrawal with fees eating into any winnings."},
      ]
    }
  ];
  const s = sections[activeSection];
  return (
    <div>
      <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:"24px",marginBottom:"8px"}} className="glow">🧠 AWARENESS EDUCATION</h1>
      <p style={{color:"#888",fontSize:"14px",marginBottom:"20px"}}>Understanding the tactics used to manipulate gamblers</p>

      <div style={{display:"flex",gap:"8px",marginBottom:"20px",flexWrap:"wrap"}}>
        {sections.map((sec,i)=>(
          <button key={i} onClick={()=>setActiveSection(i)} className={`tab${activeSection===i?" active":""}`} style={{fontSize:"13px"}}>
            {sec.title.split(" ")[0]} {sec.title.split(" ").slice(1).join(" ")}
          </button>
        ))}
      </div>

      <div className="card">
        <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:"18px",color:"#ff6b35",marginBottom:"20px"}}>{s.title}</h2>
        <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
          {s.content.map((c,i)=>(
            <div key={i} style={{borderLeft:"3px solid #ff6b35",paddingLeft:"16px"}}>
              <h3 style={{fontWeight:700,marginBottom:"6px",fontSize:"15px"}}>{c.h}</h3>
              <p style={{color:"#aaa",fontSize:"14px",lineHeight:"1.7"}}>{c.p}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{marginTop:"16px",background:"linear-gradient(135deg,#0a1a0a,#0d1a0d)",borderColor:"#00ff8844"}}>
        <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:"16px",color:"#00ff88",marginBottom:"12px"}}>🆘 Get Help</h2>
        <p style={{color:"#aaa",fontSize:"14px",lineHeight:"1.7",marginBottom:"12px"}}>
          If you or someone you know is struggling with gambling addiction, help is available:
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:"8px",fontSize:"14px"}}>
          <div style={{padding:"10px",background:"#0a0a0a",borderRadius:"8px"}}>📞 iCall (India): <strong>9152987821</strong></div>
          <div style={{padding:"10px",background:"#0a0a0a",borderRadius:"8px"}}>🌐 Gamblers Anonymous India: <strong>www.gamblersanonymous.org</strong></div>
          <div style={{padding:"10px",background:"#0a0a0a",borderRadius:"8px"}}>📱 NIMHANS: <strong>080-46110007</strong></div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PHISHING DEMO SCREEN
// ============================================================
function PhishingScreen(){
  const [phase, setPhase] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div>
      <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:"24px",marginBottom:"8px"}} className="glow">🎣 PHISHING DEMO</h1>
      <div style={{background:"#1a0a00",border:"1px solid #ff6b35",borderRadius:"8px",padding:"12px",marginBottom:"20px",fontSize:"13px",color:"#ff6b35"}}>
        ⚠️ EDUCATIONAL DEMO ONLY — This demonstrates how fake gambling sites steal credentials. No data is collected or stored.
      </div>

      {phase===0 && (
        <div>
          <div className="card" style={{marginBottom:"16px"}}>
            <h2 style={{marginBottom:"16px",fontFamily:"'Orbitron',sans-serif",fontSize:"16px"}}>How Phishing Gambling Sites Work</h2>
            <div style={{display:"flex",flexDirection:"column",gap:"12px",fontSize:"14px",color:"#aaa",lineHeight:"1.7"}}>
              <div style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
                <span style={{background:"#ff6b35",color:"black",borderRadius:"50%",width:"24px",height:"24px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0}}>1</span>
                <span><strong style={{color:"#e0e0e0"}}>Lure:</strong> Fake gambling sites send SMS/email "You've won ₹10,000! Click to claim." The URL looks similar to real sites (e.g., v3gabets.com instead of vegabet.com)</span>
              </div>
              <div style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
                <span style={{background:"#ff6b35",color:"black",borderRadius:"50%",width:"24px",height:"24px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0}}>2</span>
                <span><strong style={{color:"#e0e0e0"}}>Trust Building:</strong> The fake site lets you "win" small amounts initially. Real funds appear deposited. Victims trust the platform.</span>
              </div>
              <div style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
                <span style={{background:"#ff6b35",color:"black",borderRadius:"50%",width:"24px",height:"24px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0}}>3</span>
                <span><strong style={{color:"#e0e0e0"}}>Credential Theft:</strong> Login page harvests email/password. OTP pages steal banking credentials.</span>
              </div>
              <div style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
                <span style={{background:"#ff6b35",color:"black",borderRadius:"50%",width:"24px",height:"24px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0}}>4</span>
                <span><strong style={{color:"#e0e0e0"}}>Financial Loss:</strong> Victims deposit real money to "unlock winnings" or attackers use stolen credentials to drain bank accounts.</span>
              </div>
            </div>
          </div>
          <button className="btn-primary" onClick={()=>setPhase(1)} style={{width:"100%"}}>▶ See Phishing Demo</button>
        </div>
      )}

      {phase===1 && (
        <div>
          <div style={{background:"#ff6b3322",border:"2px solid #ff6b35",borderRadius:"4px",padding:"8px 12px",marginBottom:"12px",fontSize:"12px",color:"#ff6b35",fontFamily:"'JetBrains Mono',monospace"}}>
            🔴 FAKE SITE — URL: v3gabets-winprize.xyz (notice: not the real site!)
          </div>
          <div style={{background:"linear-gradient(135deg,#0d0d1a,#1a1a2e)",border:"1px solid #2a2a3e",borderRadius:"12px",padding:"30px",textAlign:"center"}}>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"24px",fontWeight:900,color:"#ff6b35",marginBottom:"4px"}}>V3GABETS</div>
            <div style={{color:"#00ff88",fontSize:"14px",marginBottom:"24px"}}>🎉 You've been selected! Claim your ₹10,000 prize!</div>
            <div style={{textAlign:"left",maxWidth:"340px",margin:"0 auto"}}>
              <div style={{marginBottom:"12px"}}>
                <label style={{fontSize:"12px",color:"#888",display:"block",marginBottom:"4px"}}>Email</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" style={{width:"100%",background:"#0d0d1a",border:"1px solid #333",borderRadius:"8px",padding:"10px",color:"#e0e0e0",fontFamily:"'Rajdhani',sans-serif",fontSize:"14px"}}/>
              </div>
              <div style={{marginBottom:"16px"}}>
                <label style={{fontSize:"12px",color:"#888",display:"block",marginBottom:"4px"}}>Password</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={{width:"100%",background:"#0d0d1a",border:"1px solid #333",borderRadius:"8px",padding:"10px",color:"#e0e0e0",fontFamily:"'Rajdhani',sans-serif",fontSize:"14px"}}/>
              </div>
              <button className="btn-primary" style={{width:"100%"}} onClick={()=>setPhase(2)}>CLAIM MY ₹10,000 →</button>
            </div>
          </div>
        </div>
      )}

      {phase===2 && (
        <div>
          <div style={{background:"#ff444422",border:"2px solid #ff4444",borderRadius:"4px",padding:"8px 12px",marginBottom:"12px",fontSize:"12px",color:"#ff4444",fontFamily:"'JetBrains Mono',monospace"}}>
            🚨 PHISHING STAGE 2 — Now stealing OTP/banking credentials
          </div>
          <div style={{background:"linear-gradient(135deg,#0d0d1a,#1a1a2e)",border:"1px solid #2a2a3e",borderRadius:"12px",padding:"30px",textAlign:"center"}}>
            <div style={{fontSize:"48px",marginBottom:"12px"}}>🏦</div>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:"16px",marginBottom:"8px"}}>Bank Verification Required</div>
            <div style={{color:"#aaa",fontSize:"14px",marginBottom:"20px"}}>Enter OTP sent to your bank to receive prize transfer</div>
            <div style={{maxWidth:"280px",margin:"0 auto"}}>
              <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="6-digit OTP" style={{width:"100%",background:"#0d0d1a",border:"1px solid #333",borderRadius:"8px",padding:"12px",color:"#e0e0e0",textAlign:"center",fontSize:"20px",letterSpacing:"8px",marginBottom:"12px",fontFamily:"'JetBrains Mono',monospace"}}/>
              <button className="btn-primary" style={{width:"100%"}} onClick={()=>setPhase(3)}>VERIFY & CLAIM</button>
            </div>
          </div>
        </div>
      )}

      {phase===3 && (
        <div>
          <div className="card" style={{borderColor:"#00ff8844",background:"linear-gradient(135deg,#0a1a0a,#0d200d)",textAlign:"center",padding:"40px"}}>
            <div style={{fontSize:"48px",marginBottom:"16px"}}>🎓</div>
            <h2 style={{fontFamily:"'Orbitron',sans-serif",color:"#00ff88",marginBottom:"12px"}}>DEMO COMPLETE</h2>
            <p style={{color:"#aaa",fontSize:"14px",lineHeight:"1.8",maxWidth:"400px",margin:"0 auto 20px"}}>
              In a real phishing attack, you would have just given attackers your email, password, and banking OTP. 
              They can now access your email account, reset passwords for banking apps, and drain your accounts.
            </p>
            <div style={{textAlign:"left",background:"#0a0a0a",borderRadius:"8px",padding:"16px",marginBottom:"16px",fontSize:"13px"}}>
              <strong style={{color:"#ff6b35"}}>🛡️ Protect yourself:</strong>
              <ul style={{color:"#aaa",marginTop:"8px",paddingLeft:"16px",lineHeight:"2"}}>
                <li>Always check the exact URL before entering credentials</li>
                <li>Never enter your OTP on gambling sites</li>
                <li>Use unique passwords for every site</li>
                <li>Enable 2FA on your email and banking apps</li>
                <li>Verify prizes through official channels only</li>
              </ul>
            </div>
            <button className="btn-secondary" onClick={()=>setPhase(0)}>← Restart Demo</button>
          </div>
        </div>
      )}
    </div>
  );
}

function getWinProbability(roundsPlayed) {
  if (roundsPlayed < 3) return 0.72;
  if (roundsPlayed < 7) return 0.48;
  if (roundsPlayed < 15) return 0.32;
  return 0.22;
}
