const keyMap = [
  { keys: ["q"], note: 261.63 },
  { keys: ["w"], note: 293.66 },
  { keys: ["e"], note: 329.63 },
  { keys: ["r"], note: 349.23 },
  { keys: ["t"], note: 392.0 },
  { keys: ["y", "z"], note: 440.0 },
  { keys: ["u"], note: 493.88 },
  { keys: ["i"], note: 523.25 },
  { keys: ["o"], note: 587.33 },
  { keys: ["p"], note: 659.25 },
  { keys: ["[", "š"], note: 698.46 },
  { keys: ["]", "đ"], note: 783.99 },
  { keys: ["\\", "ž"], note: 880.0 },
];

const activeNotes = new Map();
const piano = document.getElementById("piano");

// keyMap.forEach((k) => {
//   const div = document.createElement("div");
//   div.className = "key";
//   div.dataset.key = k.keys[0];
//   div.innerHTML = `<span>${k.keys[0].toUpperCase()}</span>`;
//   div.onmousedown = () => startNote(k.keys[0]);
//   div.onmouseup = () => stopNote(k.keys[0]);
//   div.onmouseleave = () => stopNote(k.keys[0]);
//   piano.appendChild(div);
// });

keyMap.forEach((k) => {
  const div = document.createElement("div");
  div.className = "key";
  div.dataset.key = k.keys[0];

  div.innerHTML = `
    <span>${k.keys[0].toUpperCase()}</span>
    <div class="key-progress"></div>
  `;

  div.onmousedown = () => startNote(k.keys[0]);
  div.onmouseup = () => stopNote(k.keys[0]);
  div.onmouseleave = () => stopNote(k.keys[0]);

  piano.appendChild(div);
});

function loudnessCompensation(freq) {
  return Math.pow(440 / freq, 0.3);
}

function findNote(key) {
  return keyMap.find((k) => k.keys.includes(key));
}

function startNote(key) {
  if (activeNotes.has(key)) return;
  audioCtx.resume();

  const mapping = findNote(key);
  if (!mapping) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = mapping.note;

  const now = audioCtx.currentTime;
  const g = 0.33 * loudnessCompensation(mapping.note);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(g, now + 0.05);

  osc.connect(gain).connect(masterGain);
  osc.start();

  activeNotes.set(key, { osc, gain });
  const keyEl = document.querySelector(`[data-key="${mapping.keys[0]}"]`);
  keyEl?.classList.add("active");

  // Animate progress
  const progressEl = keyEl.querySelector(".key-progress");
  if (progressEl) {
    progressEl.style.height = "0%";
    const duration = 1000; // 1 second for full bar
    let startTime = null;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const percent = Math.min((elapsed / duration) * 100, 100);
      progressEl.style.height = percent + "%";

      if (activeNotes.has(key)) {
        requestAnimationFrame(animate);
      } else {
        progressEl.style.height = "0%";
      }
    }

    requestAnimationFrame(animate);
  }
}

function stopNote(key) {
  const note = activeNotes.get(key);
  if (!note) return;

  const now = audioCtx.currentTime;
  note.gain.gain.linearRampToValueAtTime(0, now + 0.5);
  note.osc.stop(now + 0.55);

  activeNotes.delete(key);

  const mapping = findNote(key);
  const keyEl = document.querySelector(`[data-key="${mapping.keys[0]}"]`);
  keyEl?.classList.remove("active");

  // Reset progress bar
  const progressEl = keyEl.querySelector(".key-progress");
  if (progressEl) progressEl.style.height = "0%";
}

document.onkeydown = (e) => !e.repeat && startNote(e.key.toLowerCase());
document.onkeyup = (e) => stopNote(e.key.toLowerCase());
