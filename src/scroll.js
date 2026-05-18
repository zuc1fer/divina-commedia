// ─────────────────────────────────────────────────────────────────────────────
//  DIVINA COMMEDIA — scroll orchestration
//  Lenis → GSAP → ScrollTrigger. One descent, a screen-tear at the gate,
//  figure parallax, and an endless loop back into the light.
// ─────────────────────────────────────────────────────────────────────────────
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScroll(world) {
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true, syncTouch: true });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); world.update(); });
  gsap.ticker.lagSmoothing(0);

  const stageEl = document.getElementById('hud-stage');
  const barEl = document.getElementById('hud-bar');
  const cue = document.getElementById('scrollcue');
  const scenes = [...document.querySelectorAll('.scene:not(.loop-sentinel)')];
  const ritorno = document.querySelector('[data-scene="ritorno"]');
  let active = null;

  // progress 0 at the Empyrean … exactly 1.0 at the end of the Ritorno,
  // so the redemption light returns and the loop seam is invisible.
  // the falling knight
  const spin = document.querySelector('.faller-spin');
  const knightImg = document.querySelector('#faller img');
  const lerp = (a, b, t) => a + (b - a) * t;
  const darknessAt = (p) => {
    const fall = gsap.utils.clamp(0, 1, (p - 0.30) / 0.30);
    const rise = gsap.utils.clamp(0, 1, (p - 0.955) / 0.044);
    return fall * fall * (3 - 2 * fall) * (1 - rise);
  };

  const denom = () => Math.max(1, ritorno.offsetTop + ritorno.offsetHeight - innerHeight);
  function syncProgress() {
    const p = Math.min(1, Math.max(0, lenis.scroll / denom()));
    world.setProgress(p);
    if (barEl) barEl.style.transform = `scaleX(${p})`;
    cue?.classList.toggle('gone', p > 0.015);

    if (spin) {
      // tumbles the whole way down, then rights itself and rises in the Ritorno
      const settle = gsap.utils.clamp(0, 1, (p - 0.93) / 0.07);
      const rot = p * 540 * (1 - settle) + settle * 720;
      const sc = p < 0.93 ? 1 - p * 0.16 : lerp(0.85, 1.16, settle);
      spin.style.transform = `rotate(${rot}deg) scale(${sc})`;
      if (knightImg) {
        const d = darknessAt(p);
        const g = [Math.round(lerp(150, 80, d)), Math.round(lerp(150, 150, d)), Math.round(lerp(120, 200, d))];
        knightImg.style.filter =
          `drop-shadow(0 0 ${lerp(30, 22, d)}px rgba(${lerp(220,90,d)|0},${lerp(180,150,d)|0},${lerp(110,190,d)|0},.34))` +
          ` drop-shadow(0 0 72px rgba(${g[0]},${g[1]},${g[2]},.45))`;
      }
    }
    scanActive();
  }

  ScrollTrigger.create({
    trigger: document.body, start: 'top top', end: 'bottom bottom',
    onUpdate: syncProgress, onRefresh: syncProgress,
  });
  lenis.on('scroll', syncProgress);

  // the world rips once, as Purgatorio gives way to the Inferno
  const gate = document.querySelector('[data-scene="inferno-gate"]');
  if (gate) {
    const tv = { v: 0 };
    const rip = gsap.timeline({ paused: true })
      .to(tv, { v: 0.9, duration: 0.45, ease: 'power2.in', onUpdate: () => world.setTear(tv.v) })
      .to(tv, { v: 0.0, duration: 0.7, ease: 'power2.out', onUpdate: () => world.setTear(tv.v) });
    ScrollTrigger.create({
      trigger: gate, start: 'top 65%',
      onEnter: () => rip.restart(), onEnterBack: () => rip.restart(),
    });
  }

  // a gentler shiver as the light first fails, entering Purgatorio
  const purg = document.querySelector('[data-scene="purgatorio"]');
  if (purg) {
    const sv = { v: 0 };
    const shiver = gsap.timeline({ paused: true })
      .to(sv, { v: 0.42, duration: 0.4, ease: 'power2.in', onUpdate: () => world.setTear(sv.v) })
      .to(sv, { v: 0.0, duration: 0.8, ease: 'power2.out', onUpdate: () => world.setTear(sv.v) });
    ScrollTrigger.create({
      trigger: purg, start: 'top 62%',
      onEnter: () => shiver.restart(), onEnterBack: () => shiver.restart(),
    });
  }

  function scanActive() {
    const mid = innerHeight * 0.5;
    let best = null, bd = Infinity;
    for (const s of scenes) {
      const r = s.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const dd = Math.abs(r.top + r.height / 2 - mid);
      if (dd < bd) { bd = dd; best = s; }
    }
    if (best && best !== active) { active = best; activate(best); }
  }

  function activate(scene) {
    const stage = scene.dataset.stage || '';
    if (stageEl && stageEl.textContent !== stage) {
      gsap.fromTo(stageEl, { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      stageEl.textContent = stage;
    }
    document.body.dataset.mood = scene.dataset.mood || 'empyrean';
  }

  // ── per-scene : text reveal + figure parallax (replays every loop) ─────
  scenes.forEach((scene) => {
    if (scene.classList.contains('hero')) return; // the intro animates the hero
    const lines = scene.querySelectorAll('.line');
    if (lines.length) {
      gsap.set(lines, { opacity: 0, y: 60, filter: 'blur(12px)' });
      gsap.to(lines, {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 1.1, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: scene, start: 'top 74%', end: 'bottom 40%',
          toggleActions: 'play reverse play reverse' },
      });
    }
    // figure : reveal + scroll parallax on the wrapper (the inner <img>
    // owns the continuous CSS bob, so transforms never collide)
    const fig = scene.querySelector('.figure-wrap');
    if (fig) {
      gsap.fromTo(fig, { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, ease: 'power2.out',
          scrollTrigger: { trigger: scene, start: 'top 85%', end: 'top 38%', scrub: 1 } });
      gsap.fromTo(fig, { yPercent: 16 }, { yPercent: -16, ease: 'none',
        scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    }
  });

  // ── the endless loop : the climb begins again ──────────────────────────
  let wrapping = false, armed = false;          // the loop only arms once underway
  const maxScroll = () => Math.max(
    document.documentElement.scrollHeight - innerHeight,
    Number(lenis.limit) || 0);
  function wrap(toBottom) {
    if (wrapping || !armed) return;
    const m = maxScroll();
    if (m < 200) return;
    wrapping = true; armed = false;             // re-arms after the journey resumes
    world.jumpProgress(toBottom ? 1 : 0);
    lenis.scrollTo(toBottom ? m - 10 : 10, { immediate: true, force: true });
    syncProgress();
    setTimeout(() => { wrapping = false; }, 240);
  }
  lenis.on('scroll', ({ scroll, velocity }) => {
    if (!armed && Math.min(1, scroll / denom()) > 0.05) armed = true;
    const m = maxScroll();
    if (m < 200) return;
    if (scroll >= m - 2 && velocity > 0.5) wrap(false);
    else if (scroll <= 2 && velocity < -0.5) wrap(true);
  });
  // at the hard clamp the wheel still has to carry us through the loop
  addEventListener('wheel', (e) => {
    const m = maxScroll();
    if (m < 200 || !armed) return;
    if (lenis.scroll >= m - 3 && e.deltaY > 0) wrap(false);
    else if (lenis.scroll <= 3 && e.deltaY < 0) wrap(true);
  }, { passive: true });

  requestAnimationFrame(scanActive);
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
  setTimeout(() => { ScrollTrigger.refresh(); scanActive(); }, 1200);

  return lenis;
}
