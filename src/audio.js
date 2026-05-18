// ─────────────────────────────────────────────────────────────────────────────
//  DIVINA COMMEDIA — generative ambience (no audio files)
//  A warm consonant pad in the light; a low, breathing abyss-drone in the deep.
//  Cross-faded by the same descent progress that drives the visuals.
// ─────────────────────────────────────────────────────────────────────────────
export function initAudio(world) {
  const btn = document.getElementById('sound');
  let ctx = null, on = false, raf = 0;
  let master, heavenGain, hellGain;

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // ── heaven : a soft major pad (just-intonation triad + octave) ───────
    heavenGain = ctx.createGain();
    heavenGain.gain.value = 0.0;
    const hFilter = ctx.createBiquadFilter();
    hFilter.type = 'lowpass';
    hFilter.frequency.value = 2200;
    heavenGain.connect(hFilter).connect(master);
    [220, 275, 330, 440].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 3 ? 'triangle' : 'sine';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.12 / (i + 1);
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.017;
      const lg = ctx.createGain();
      lg.gain.value = 0.04;
      lfo.connect(lg).connect(g.gain);
      o.connect(g).connect(heavenGain);
      o.start(); lfo.start();
    });

    // ── hell : a detuned low drone + filtered wind ───────────────────────
    hellGain = ctx.createGain();
    hellGain.gain.value = 0.0;
    hellGain.connect(master);
    [41.2, 43.65, 61.7].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.06;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 240;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.03 + i * 0.01;
      const lg = ctx.createGain(); lg.gain.value = 30;
      lfo.connect(lg).connect(lp.frequency);
      o.connect(g).connect(lp).connect(hellGain);
      o.start(); lfo.start();
    });
    // wind : looping filtered noise
    const buf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
    const noise = ctx.createBufferSource();
    noise.buffer = buf; noise.loop = true;
    const nf = ctx.createBiquadFilter();
    nf.type = 'bandpass'; nf.frequency.value = 360; nf.Q.value = 0.6;
    const ng = ctx.createGain(); ng.gain.value = 0.18;
    noise.connect(nf).connect(ng).connect(hellGain);
    noise.start();

    const tick = () => {
      const p = world.progress;
      heavenGain.gain.value += ((1 - Math.min(1, p * 2.2)) - heavenGain.gain.value) * 0.05;
      hellGain.gain.value += (Math.min(1, Math.max(0, (p - 0.28) * 1.7)) - hellGain.gain.value) * 0.05;
      raf = requestAnimationFrame(tick);
    };
    tick();
  }

  async function toggle() {
    if (!ctx) build();
    if (ctx.state === 'suspended') await ctx.resume();
    on = !on;
    btn.classList.toggle('on', on);
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.linearRampToValueAtTime(on ? 0.5 : 0.0, now + (on ? 2.0 : 0.6));
  }

  btn?.addEventListener('click', toggle);
  return { toggle };
}
