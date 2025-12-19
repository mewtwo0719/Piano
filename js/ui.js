let stopRequested = false;

async function playMelody(name) {
  stopMelody();
  stopRequested = false;

  for (const [key, dur] of melodies[name]) {
    if (stopRequested) break;
    startNote(key);
    await new Promise((r) => setTimeout(r, dur));
    stopNote(key);
  }
}

function stopMelody() {
  stopRequested = true;
  activeNotes.forEach((_, k) => stopNote(k));
}

const grid = document.getElementById("melodyGrid");

Object.keys(melodies).forEach((name) => {
  const card = document.createElement("div");
  card.className = "melody-card";
  card.innerHTML = `
    <h3>🎵 ${name}</h3>
    <button onclick="playMelody('${name}')">▶ Play</button>
    <button onclick="stopMelody()">■ Stop</button>
  `;
  grid.appendChild(card);
});
