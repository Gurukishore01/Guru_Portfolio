/**
 * Web Audio API procedural sound synthesizer for realistic book interactions,
 * including wind/airflow paper flutter physics.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled;
  return soundEnabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * Subtle paper rustle when manually flipping a page forward or backward.
 */
export function playPageFlipSound(direction: 'forward' | 'backward' = 'forward') {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const duration = 0.2;
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      const t = i / bufferSize;
      const envelope = Math.sin(t * Math.PI) * Math.exp(-t * (direction === 'forward' ? 2.8 : 3.2));
      data[i] = (lastOut * 0.7 + white * 0.3) * envelope * 0.55;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    const startFreq = direction === 'forward' ? 1400 : 1100;
    const endFreq = direction === 'forward' ? 700 : 850;

    filter.frequency.setValueAtTime(startFreq, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
    filter.Q.value = 1.4;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
  } catch (err) {
    console.debug('Page flip audio error:', err);
  }
}

/**
 * High-airflow / wind breeze opening sequence:
 * Simulates high air blowing open the cover and fluttering weightless paper sheets
 * rapidly across to the first page.
 */
export function playWindBreezeOpeningSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const startTime = ctx.currentTime;

    // 1. Gentle atmospheric wind rush
    const windDuration = 1.6;
    const windBufferSize = Math.floor(ctx.sampleRate * windDuration);
    const windBuffer = ctx.createBuffer(1, windBufferSize, ctx.sampleRate);
    const windData = windBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < windBufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.08;
      b2 = 0.90 * b2 + white * 0.10;
      const t = i / windBufferSize;
      const windEnv = Math.sin(t * Math.PI) * (0.8 + 0.2 * Math.sin(t * 12 * Math.PI));
      windData[i] = (b0 + b1 + b2) * windEnv * 0.35;
    }

    const windSrc = ctx.createBufferSource();
    windSrc.buffer = windBuffer;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(450, startTime);
    windFilter.frequency.linearRampToValueAtTime(950, startTime + 0.6);
    windFilter.frequency.exponentialRampToValueAtTime(350, startTime + windDuration);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.01, startTime);
    windGain.gain.linearRampToValueAtTime(0.28, startTime + 0.3);
    windGain.gain.exponentialRampToValueAtTime(0.001, startTime + windDuration);

    windSrc.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(ctx.destination);
    windSrc.start(startTime);

    // 2. Cascading weightless paper flutter whooshes as pages catch the breeze
    [0.15, 0.42, 0.68].forEach((offset, idx) => {
      const duration = 0.22;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const flutterBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const flutterData = flutterBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        const env = Math.sin(t * Math.PI) * Math.exp(-t * 2.2);
        flutterData[i] = (Math.random() * 2 - 1) * env * 0.5;
      }

      const flutterSrc = ctx.createBufferSource();
      flutterSrc.buffer = flutterBuffer;

      const flutterFilter = ctx.createBiquadFilter();
      flutterFilter.type = 'bandpass';
      flutterFilter.frequency.setValueAtTime(800 + idx * 250, startTime + offset);
      flutterFilter.frequency.exponentialRampToValueAtTime(500, startTime + offset + duration);
      flutterFilter.Q.value = 1.3;

      const flutterGain = ctx.createGain();
      flutterGain.gain.setValueAtTime(0.01, startTime + offset);
      flutterGain.gain.linearRampToValueAtTime(0.26 + idx * 0.04, startTime + offset + 0.03);
      flutterGain.gain.exponentialRampToValueAtTime(0.001, startTime + offset + duration);

      flutterSrc.connect(flutterFilter);
      flutterFilter.connect(flutterGain);
      flutterGain.connect(ctx.destination);
      flutterSrc.start(startTime + offset);
    });

    // 3. Gentle settle tap as the final page lands smoothly on Page 1
    const settleDuration = 0.12;
    const osc = ctx.createOscillator();
    const settleGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, startTime + 1.1);
    osc.frequency.exponentialRampToValueAtTime(45, startTime + 1.1 + settleDuration);

    settleGain.gain.setValueAtTime(0.18, startTime + 1.1);
    settleGain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.1 + settleDuration);

    osc.connect(settleGain);
    settleGain.connect(ctx.destination);
    osc.start(startTime + 1.1);
    osc.stop(startTime + 1.1 + settleDuration);
  } catch (err) {
    console.debug('Wind breeze audio error:', err);
  }
}

/**
 * Distinct, multi-stage sound for "Contact Me!" rapid flip.
 */
export function playContactMeRapidFlipSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const startTime = ctx.currentTime;

    [0, 0.16, 0.32].forEach((offset, idx) => {
      const duration = 0.18;
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const t = i / bufferSize;
        const env = Math.sin(t * Math.PI) * Math.exp(-t * 2.5);
        data[i] = (Math.random() * 2 - 1) * env * 0.5;
      }

      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const flt = ctx.createBiquadFilter();
      flt.type = 'bandpass';
      flt.frequency.setValueAtTime(1000 + idx * 300, startTime + offset);
      flt.frequency.exponentialRampToValueAtTime(600, startTime + offset + duration);
      flt.Q.value = 1.3;

      const gn = ctx.createGain();
      gn.gain.setValueAtTime(0.01, startTime + offset);
      gn.gain.linearRampToValueAtTime(0.3 + idx * 0.05, startTime + offset + 0.03);
      gn.gain.exponentialRampToValueAtTime(0.001, startTime + offset + duration);

      src.connect(flt);
      flt.connect(gn);
      gn.connect(ctx.destination);

      src.start(startTime + offset);
    });

    // Arrival chime
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();

      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(freq, startTime + 0.52 + i * 0.06);

      chimeGain.gain.setValueAtTime(0.08, startTime + 0.52 + i * 0.06);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.52 + i * 0.06 + 0.35);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);

      chimeOsc.start(startTime + 0.52 + i * 0.06);
      chimeOsc.stop(startTime + 0.52 + i * 0.06 + 0.36);
    });
  } catch (err) {
    console.debug('Contact Me audio error:', err);
  }
}

export function playBookOpenSound() {
  playWindBreezeOpeningSound();
}
