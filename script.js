function cleanOdds(rawText) {
  const odds = rawText
    .replace(/,/g, " ")
    .replace(/x/gi, "")
    .split(/\s+/)
    .map(v => parseFloat(v))
    .filter(v => !isNaN(v) && v >= 1 && v <= 2000);

  // IMPORTANT:
  // User pastes MOST RECENT first, OLDEST last
  // We reverse to chronological order
  return odds.reverse();
}

function analyzeOdds() {
  const raw = document.getElementById("oddsInput").value;
  const odds = cleanOdds(raw);

  if (odds.length < 20) {
    alert(`Detected only ${odds.length} odds. Please provide at least 20.`);
    return;
  }

  const low = odds.filter(x => x < 1.5).length;
  const mid = odds.filter(x => x >= 1.5 && x < 3).length;
  const high = odds.filter(x => x >= 3).length;
  const big = odds.filter(x => x >= 10).length;

  const avg = (odds.reduce((a,b)=>a+b,0)/odds.length).toFixed(2);

  const recent5 = odds.slice(-5);
  const recentLowStreak = recent5.filter(x => x < 1.5).length;

  document.getElementById("stats").innerHTML = `
    <h3>📊 Odds Analysis (Chronological)</h3>
    Total odds: ${odds.length}<br>
    Average crash: ${avg}x<br><br>

    🔴 <1.5x: ${((low/odds.length)*100).toFixed(1)}%<br>
    🟡 1.5–3x: ${((mid/odds.length)*100).toFixed(1)}%<br>
    🟢 >3x: ${((high/odds.length)*100).toFixed(1)}%<br>
    🔵 ≥10x: ${((big/odds.length)*100).toFixed(1)}%<br><br>

    ⏱ Last 5 rounds: ${recent5.map(x=>x+"x").join(", ")}<br>
    ⚠️ Recent low streak: ${recentLowStreak}/5
  `;

  generateExpectedOdds();
}

function generateExpectedOdds() {
  let out = [];
  const rounds = Math.floor(Math.random()*31)+20;

  for(let i=0;i<rounds;i++){
    const r = Math.random();
    if(r < 0.58) out.push((1 + Math.random()*0.4).toFixed(2));
    else if(r < 0.82) out.push((1.5 + Math.random()*1.5).toFixed(2));
    else if(r < 0.95) out.push((3 + Math.random()*5).toFixed(2));
    else out.push((10 + Math.random()*40).toFixed(2));
  }

  document.getElementById("expected").innerHTML = `
    <h3>🔮 Expected Next ${rounds} Rounds (Simulation)</h3>
    ${out.map(x=>x+"x").join(" , ")}
    <br><br>
    🎯 Suggested safer cash-out zone: <b>1.4x – 2.0x</b>
  `;
}

function readImage() {
  const file = document.getElementById("imageInput").files[0];
  if(!file){
    alert("Upload a cropped screenshot of odds");
    return;
  }

  document.getElementById("loading").innerText = "⚡ Fast reading odds…";

  const timeout = setTimeout(() => {
    document.getElementById("loading").innerText = "";
    alert("OCR timed out. Crop tighter and retry.");
  }, 7000);

  Tesseract.recognize(file, "eng", {
    tessedit_char_whitelist: "0123456789.x",
    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK
  })
  .then(({ data: { text } }) => {
    clearTimeout(timeout);
    document.getElementById("loading").innerText = "";

    const odds = cleanOdds(text);

    if (odds.length < 10) {
      alert("Could not read enough odds. Crop tighter.");
      return;
    }

    // Display back in USER format (recent first)
    document.getElementById("oddsInput").value = odds.reverse().join(" ");
    analyzeOdds();
  })
  .catch(() => {
    clearTimeout(timeout);
    document.getElementById("loading").innerText = "";
    alert("OCR failed. Try clearer crop.");
  });
}
