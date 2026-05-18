// ─────────────────────────────────────────────────────────────────────────────
//  DIVINA COMMEDIA — bootstrap
// ─────────────────────────────────────────────────────────────────────────────
import './style.css';
import { gsap } from 'gsap';
import { World } from './world.js';
import { buildContent } from './content.js';
import { initScroll } from './scroll.js';
import { initAudio } from './audio.js';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
scrollTo(0, 0);

buildContent(document.getElementById('app'));
const world = new World(document.getElementById('world'));

// preload the relics that greet you first; the rest stream in lazily
const FIRST = ['ang-6', 'ang-1', 'ang-2', 'dem-5', 'dem-1'].map((n) => `/assets/figures/${n}.png`);
const pre = document.getElementById('preloader');
const countEl = pre.querySelector('.pre-count');
const enterBtn = document.getElementById('enter');
let done = 0, ready = false;
const tick = () => { countEl.textContent = Math.min(100, Math.round((done / (FIRST.length + 1)) * 100)); };
const finish = () => {
  if (ready) return;
  ready = true; countEl.textContent = '100';
  enterBtn.disabled = false; enterBtn.classList.add('ready');
};
FIRST.forEach((src) => {
  const im = new Image();
  im.onload = im.onerror = () => { done++; tick(); if (done >= FIRST.length) finish(); };
  im.src = src;
});
(document.fonts?.ready ?? Promise.resolve()).then(() => { done++; tick(); });
setTimeout(finish, 6000);

const lenis = initScroll(world);
lenis.stop();
window.__world = world;
window.__lenis = lenis;

let entered = false;
function enter() {
  if (entered || !ready) return;
  entered = true;
  pre.classList.add('open');
  setTimeout(() => { pre.style.display = 'none'; }, 1500);
  lenis.scrollTo(0, { immediate: true });
  scrollTo(0, 0);
  world.jumpProgress(0);
  requestAnimationFrame(() => { lenis.scrollTo(0, { immediate: true }); lenis.start(); });
  const heroLines = document.querySelectorAll('.hero .line, .hero .figure-wrap');
  gsap.fromTo(heroLines,
    { opacity: 0, y: 70, filter: 'blur(16px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'power3.out', stagger: 0.13, delay: 0.5 });
}
enterBtn.addEventListener('click', enter);
addEventListener('keydown', (e) => { if (e.key === 'Enter' && ready) enter(); });

initAudio(world);
