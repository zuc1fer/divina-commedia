# DIVINA COMMEDIA — the descent and the return

A single endless scroll told as one first-person poem. You begin in the
**Empyrean** (production software at Lumae.AI), fall through the **nine spheres
of Paradiso**, cross **Purgatorio**, descend the **nine circles of the Inferno**
(each circle a discipline of the second craft), find the redemption at the frozen
floor, and climb back into the light. Reach the bottom and it loops forever back
to the Empyrean, the seam invisible because the light has already returned.

It is a portfolio shaped like the *Divine Comedy*: the legitimate craft is the
height, the credential-stuffing / anti-bot craft is the depth, and the story is
how the same hands learned both and chose the climb.

## ⚠️ One line to edit

`src/content.js`, line 3:

```js
export const NAME = 'YOUR NAME';   // ← your real name (EMAIL is already set)
```

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview
npm run optimize   # re-compress source plates (scripts/optimize.mjs)
npm run figures    # re-bake the angel/demon cutouts (scripts/figures.mjs)
```

## What it does

- **One fixed, seamless WebGL canvas** (Three.js, custom GLSL): a scroll-driven
  atmosphere that travels gold → cooling celestial twilight → ash → cold void →
  frozen black → back to gold, plus **wind-blown golden leaves** (that turn to
  cold cinders in the Inferno) and cold "silicon" monoliths in the deep.
- **DOM figure cutouts**: every angel and demon is a transparent PNG baked from a
  public-domain engraving (paper removed, ink re-lit gold or cold), placed on the
  side opposite the text, with a continuous bob, a silhouette-masked light sweep,
  scroll parallax and a reveal. Aspect is always preserved (never stretched).
- **Alternating layout**: text left / figure right, then the reverse, all the way
  down. Gate and Ritorno are centered with the figure as a faint watermark.
- **GSAP + ScrollTrigger + Lenis**: smooth scroll, line reveals that replay every
  loop, a screen-tear as Purgatorio gives way to the Inferno, and a true
  infinite wrap (down at the bottom returns to the top, up at the top to the
  bottom) with the world progress remapped so the Ritorno is exactly 1.0.
- Generative Web-Audio ambience (no files), toggle top-right.

## Art & licensing

Every source image is **public domain / CC0** (`public/assets/manifest.json`):
Gustave Doré's engravings for the *Divine Comedy* and *Paradise Lost*, extra
Paradiso/Purgatorio plates, and Met Museum Open Access visions of Ezekiel. The
figures in `public/assets/figures/` are derived from these.

Fonts: Cinzel, Cormorant Garamond, Spectral, JetBrains Mono (Google Fonts, OFL).

## Structure

```
src/main.js      bootstrap + preloader gate
src/content.js   the poem & the 23-scene structure   ← edit NAME
src/world.js     Three.js world (backdrop, leaves, monoliths, post)
src/shaders.js   all GLSL
src/scroll.js    Lenis + GSAP, progress remap, the loop
src/audio.js     generative ambience
src/style.css    alternating layout, figure animation, seam-free design
scripts/         optimize.mjs (plates) · figures.mjs (cutouts)
```

Performance auto-degrades on low-end devices and respects
`prefers-reduced-motion`.
