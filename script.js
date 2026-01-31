function analyzeOdds() {
  const input = document.getElementById("oddsInput").value.trim();
  const odds = input
    .split("\n")
    .map(x => parseFloat(x))
    .filter(x => !isNaN(x));

  if (odds.length < 20) {
    alert("Please enter at least 20 odds.");
    return;
  }

  const low = odds.filter(x => x < 1.5).length;
  const mid = odds.filter(x => x >= 1.5 && x < 3).length;
  const high = odds.filter(x => x >= 3).length;
  const veryHigh = odds.filter(x => x >= 10).length;

  const avg = (odds.reduce((a, b) => a + b, 0) / odds.length).toFixed(2);

  document.getElementById("stats").innerHTML = `
    <h3>📊 Analysis</h3>
    Total Rounds: ${odds.length}<br>
    Avg Multiplier: ${avg}x<br><br>
    🔴 Below 1.5x: ${((low/odds.length)*100).toFixed(1)}%<br>
    🟡 1.5x – 3x: ${((mid/odds.length)*100).toFixed(1)}%<br>
    🟢 Above 3x: ${((high/odds.length)*100).toFixed(1)}%<br>
    🔵 10x+: ${((veryHigh/odds.length)*100).toFixed(1)}%
  `;

  generateExpectedOdds();
}

function generateExpectedOdds() {
  let expected = [];
  const rounds = Math.floor(Math.random() * 31) + 20; // 20–50

  for (let i = 0; i < rounds; i++) {
    const r = Math.random();

    if (r < 0.55) {
      expected.push((1 + Math.random() * 0.4).toFixed(2)); // 1.00–1.40
    } else if (r < 0.80) {
      expected.push((1.5 + Math.random() * 1.5).toFixed(2)); // 1.5–3.0
    } else if (r < 0.95) {
      expected.push((3 + Math.random() * 4).toFixed(2)); // 3–7
    } else {
      expected.push((10 + Math.random() * 30).toFixed(2)); // 10–40+
    }
  }

  document.getElementById("expected").innerHTML = `
    <h3>🔮 Expected Next ${rounds} Odds (Simulation)</h3>
    ${expected.map(x => `<span>${x}x</span>`).join(" , ")}
    <br><br>
    🎯 Suggested safer cash-out zone: <b>1.4x – 2.0x</b>
  `;
}
