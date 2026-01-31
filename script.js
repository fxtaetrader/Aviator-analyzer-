function readImage() {
  const file = document.getElementById("imageInput").files[0];
  if (!file) {
    alert("Please upload a screenshot.");
    return;
  }

  document.getElementById("loading").innerText = "🔍 Reading image... please wait";

  Tesseract.recognize(
    file,
    'eng',
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    document.getElementById("loading").innerText = "";

    const extracted = extractOdds(text);
    if (extracted.length < 10) {
      alert("Could not detect enough odds. Try a clearer screenshot.");
      return;
    }

    document.getElementById("oddsInput").value = extracted.join("\n");
    analyzeOdds();
  });
}

function extractOdds(text) {
  const matches = text.match(/\d+(\.\d+)?x?/g) || [];
  return matches
    .map(x => parseFloat(x.replace("x", "")))
    .filter(x => x >= 1 && x <= 100)
    .slice(0, 60);
}

function analyzeOdds() {
  const input = document.getElementById("oddsInput").value.trim();
  const odds = input
    .split("\n")
    .map(x => parseFloat(x))
    .filter(x => !isNaN(x));

  if (odds.length < 20) {
    alert("Please provide at least 20 odds.");
    return;
  }

  const low = odds.filter(x => x < 1.5).length;
  const mid = odds.filter(x => x >= 1.5 && x < 3).length;
  const high = odds.filter(x => x >= 3).length;
  const veryHigh = odds.filter(x => x >= 10).length;

  const avg = (odds.reduce((a, b) => a + b, 0) / odds.length).toFixed(2);

  document.getElementById("stats").innerHTML = `
    <h3>📊 Odds Analysis</h3>
    Total Rounds: ${odds.length}<br>
    Average Crash: ${avg}x<br><br>
    🔴 Below 1.5x: ${((low/odds.length)*100).toFixed(1)}%<br>
    🟡 1.5x–3x: ${((mid/odds.length)*100).toFixed(1)}%<br>
    🟢 Above 3x: ${((high/odds.length)*100).toFixed(1)}%<br>
    🔵 10x+: ${((veryHigh/odds.length)*100).toFixed(1)}%
  `;

  generateExpectedOdds();
}

function generateExpectedOdds() {
  let expected = [];
  const rounds = Math.floor(Math.random() * 31) + 20;

  for (let i = 0; i < rounds; i++) {
    const r = Math.random();

    if (r < 0.56) expected.push((1 + Math.random() * 0.4).toFixed(2));
    else if (r < 0.82) expected.push((1.5 + Math.random() * 1.5).toFixed(2));
    else if (r < 0.96) expected.push((3 + Math.random() * 5).toFixed(2));
    else expected.push((10 + Math.random() * 35).toFixed(2));
  }

  document.getElementById("expected").innerHTML = `
    <h3>🔮 Expected Next ${rounds} Rounds (Simulation)</h3>
    ${expected.map(x => `<span>${x}x</span>`).join(" , ")}
    <br><br>
    🎯 Suggested safer cash-out zone: <b>1.4x – 2.0x</b>
  `;
}
