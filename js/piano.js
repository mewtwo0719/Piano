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

keyMap.forEach((k) => {
  const div = document.createElement("div");
  div.className = "key";
  div.dataset.key = k.keys[0];
  div.innerHTML = `<span>${k.keys[0].toUpperCase()}</span>`;
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
  const g = 0.22 * loudnessCompensation(mapping.note);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(g, now + 0.05);

  osc.connect(gain).connect(masterGain);
  osc.start();

  activeNotes.set(key, { osc, gain });
  document
    .querySelector(`[data-key="${mapping.keys[0]}"]`)
    ?.classList.add("active");
}

function stopNote(key) {
  const note = activeNotes.get(key);
  if (!note) return;

  const now = audioCtx.currentTime;
  note.gain.gain.linearRampToValueAtTime(0, now + 0.25);
  note.osc.stop(now + 0.3);

  activeNotes.delete(key);
  const mapping = findNote(key);
  document
    .querySelector(`[data-key="${mapping.keys[0]}"]`)
    ?.classList.remove("active");
}

document.onkeydown = (e) => !e.repeat && startNote(e.key.toLowerCase());
document.onkeyup = (e) => stopNote(e.key.toLowerCase());
