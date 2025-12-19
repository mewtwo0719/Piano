const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const masterGain = audioCtx.createGain();
masterGain.gain.value = 0.6;

const compressor = audioCtx.createDynamicsCompressor();
compressor.threshold.value = -30;
compressor.knee.value = 40;
compressor.ratio.value = 16;
compressor.attack.value = 0.003;
compressor.release.value = 0.35;

const lowpass = audioCtx.createBiquadFilter();
lowpass.type = "lowpass";
lowpass.frequency.value = 6000;

masterGain.connect(compressor).connect(lowpass).connect(audioCtx.destination);
