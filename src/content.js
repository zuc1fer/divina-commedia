// ─────────────────────────────────────────────────────────────────────────────
//  DIVINA COMMEDIA  ·  the descent and the return, told as one poem
//  ▼▼▼  EDIT THIS LINE WITH YOUR NAME  ▼▼▼
export const NAME  = 'YOUR NAME';
export const EMAIL = 'bgivenb@gmail.com';
//  ▲▲▲                                  ▲▲▲
// ─────────────────────────────────────────────────────────────────────────────

// scene := { scene, stage, mood, side, fig, eyebrow, title, tag, body, ledger?, verse? }
const SCENES = [
  // ── PARADISO : the Empyrean and the nine spheres, falling ────────────────
  {
    scene: 'empyrean', stage: 'EMPYREAN', mood: 'empyrean', side: 'left',
    fig: 'ang-6', hero: true, eyebrow: 'CANTICA · PARADISO', title: NAME,
    tag: 'Software engineer. This is where the light begins.',
    body: `I was made in the light, and for a long while I only built with it.
      At Lumae.AI I taught the machines to make a mortgage gentle, so a stranger
      could carry their house home without being afraid of the paperwork.
      This was the high country. I did not know yet that altitude is a thing
      you are allowed to lose.`,
    ledger: 'Lumae.AI · production full-stack',
  },
  {
    scene: 'primum-mobile', stage: 'IX · PRIMUM MOBILE', mood: 'paradiso',
    side: 'right', fig: 'ang-1', eyebrow: 'THE NINTH SPHERE', title: 'PRIMUM MOBILE',
    tag: 'the first motion',
    body: `Everything I shipped began here, in the part that quietly moves the rest.
      Architecture. The still thing that turns the product without being seen.
      I loved how clean it was. Cleanliness, I would learn much later, is not
      the same thing as innocence.`,
    ledger: 'system architecture',
  },
  {
    scene: 'fixed-stars', stage: 'VIII · THE FIXED STARS', mood: 'paradiso',
    side: 'left', fig: 'ang-2', eyebrow: 'THE EIGHTH SPHERE', title: 'THE FIXED STARS',
    tag: 'the grammar that keeps its promises',
    body: `HTML, CSS, the alphabet that does not change its mind. I knew it the
      way you know a prayer, without having to look. The fixed stars are easy
      to love, because they never ask you to choose anything.`,
    ledger: 'HTML · CSS · JavaScript',
  },
  {
    scene: 'saturn', stage: 'VII · SATURN', mood: 'paradiso',
    side: 'right', fig: 'ang-3', eyebrow: 'THE SEVENTH SPHERE', title: 'SATURN',
    tag: 'the patient and the cold',
    body: `Node, the long quiet services that refuse to sleep. I learned patience
      on this planet. Patience, it turns out, is also the way you wait for a
      thing you have already decided, in private, that you want.`,
    ledger: 'Node.js · always-on services',
  },
  {
    scene: 'jupiter', stage: 'VI · JUPITER', mood: 'paradiso',
    side: 'left', fig: 'ang-4', eyebrow: 'THE SIXTH SPHERE', title: 'JUPITER',
    tag: 'the just',
    body: `Fair systems. Fail the request kindly, meter the stranger gently.
      I wrote justice into software and felt righteous holding it. I did not
      yet ask, out loud, exactly who the justice was being kept for.`,
    ledger: 'reliability · fair design',
  },
  {
    scene: 'mars', stage: 'V · MARS', mood: 'paradiso',
    side: 'right', fig: 'ang-5', eyebrow: 'THE FIFTH SPHERE', title: 'MARS',
    tag: 'the resilient',
    body: `Retries, timeouts, the discipline of refusing to break. I was proud
      of how hard I had become to kill. A thing that is hard to kill, given
      enough time alone, learns that it can also be a weapon.`,
    ledger: 'resilience engineering',
  },
  {
    scene: 'sun', stage: 'IV · THE SUN', mood: 'paradiso',
    side: 'left', fig: 'ang-2', eyebrow: 'THE FOURTH SPHERE', title: 'THE SUN',
    tag: 'where the wise are kept',
    body: `Python, FastAPI, models that could read a mortgage and not flinch.
      Here I felt closest to something true. The brightest light is also the
      one that throws the longest shadow, and I was already standing inside it.`,
    ledger: 'Python · FastAPI · ML services',
  },
  {
    scene: 'venus', stage: 'III · VENUS', mood: 'paradiso',
    side: 'right', fig: 'ang-4', eyebrow: 'THE THIRD SPHERE', title: 'VENUS',
    tag: 'the lovers',
    body: `React, the surface that people actually put their hands on. I made
      it beautiful and told myself it was because I loved them. A love that
      lives only on the surface is the first lie a person learns to tell well.`,
    ledger: 'React · interface craft',
  },
  {
    scene: 'mercury', stage: 'II · MERCURY', mood: 'paradiso',
    side: 'left', fig: 'ang-1', eyebrow: 'THE SECOND SPHERE', title: 'MERCURY',
    tag: 'the swift and the ambitious',
    body: `Speed. The endpoints answered before the question had finished asking.
      Ambition is Mercury's wound and Mercury's gift, and somewhere on this
      sphere I lost the ability to tell which of the two I was carrying.`,
    ledger: 'low-latency APIs',
  },
  {
    scene: 'moon', stage: 'I · THE MOON', mood: 'paradiso',
    side: 'right', fig: 'ang-5', eyebrow: 'THE FIRST SPHERE', title: 'THE MOON',
    tag: 'the inconstant',
    body: `The lowest heaven, where the ones who broke a quiet vow are kept.
      A promise I had made only to myself went silent here, and I told no one.
      Falling never announces itself. It simply stops being flight.`,
  },

  // ── PURGATORIO : the colourless threshold ────────────────────────────────
  {
    scene: 'purgatorio', stage: 'PURGATORIO', mood: 'purgatorio',
    side: 'left', fig: 'ang-3', eyebrow: 'CANTICA · PURGATORIO', title: 'PURGATORIO',
    tag: 'the country with no colour',
    body: `Then the colour drained out of everything. Purgatory is grey on
      purpose. It is the land between the person you were and the thing you
      are about to do, and no one is ever sent here. You walk in on your own feet.`,
  },
  {
    scene: 'the-descent', stage: 'THE STAIR', mood: 'purgatorio',
    side: 'right', fig: 'dem-1', eyebrow: 'THE THRESHOLD', title: 'THE DESCENT',
    tag: 'a step that only goes down',
    body: `There was a stair that led nowhere upward. For a long time I said
      I was only studying it. Curiosity is the apology careful people prepare
      in advance, so the fall can later be called research.`,
  },

  // ── INFERNO : the gate and the nine circles ──────────────────────────────
  {
    scene: 'inferno-gate', stage: 'INFERNO', mood: 'inferno', side: 'center',
    fig: 'dem-5', eyebrow: 'CANTICA · INFERNO', title: 'PER ME SI VA',
    verse: `Through me the way into the suffering city.<br/>
      Through me the way among the people lost.`,
    tag: '',
    body: `I stopped pretending I had wandered in by accident.
      I had come here on purpose, and I had become very good at it.`,
  },
  {
    scene: 'circle-1', stage: 'I · LIMBO', mood: 'inferno', n: 'I',
    side: 'left', fig: 'dem-6', eyebrow: 'THE FIRST CIRCLE', title: 'LIMBO',
    tag: 'those who came before mastery',
    body: `Limbo first. Years of Python in the half light, scripts that asked
      the questions no door wanted to hear. No fire on this floor. Only the
      patience I had carried all the way down from Saturn.`,
    ledger: 'Python · the long apprenticeship',
  },
  {
    scene: 'circle-2', stage: 'II · LUST', mood: 'inferno', n: 'II',
    side: 'right', fig: 'dem-6', eyebrow: 'THE SECOND CIRCLE', title: 'LUST',
    tag: 'insatiable',
    body: `Then the hunger. Never one more request, always ten thousand.
      Asynchronous, pipelined, tireless. Ten thousand checks a minute, and
      underneath the numbers, nothing but the wanting.`,
    ledger: 'async pipelines · 10k+ checks / min',
  },
  {
    scene: 'circle-3', stage: 'III · GLUTTONY', mood: 'inferno', n: 'III',
    side: 'left', fig: 'dem-1', eyebrow: 'THE THIRD CIRCLE', title: 'GLUTTONY',
    tag: 'the devourer',
    body: `I learned to swallow things whole. Login, token, refresh, an entire
      authentication taken down without choking. Volume stopped being a metric
      and quietly became an appetite I fed every day.`,
    ledger: 'high-volume account checkers',
  },
  {
    scene: 'circle-4', stage: 'IV · GREED', mood: 'inferno', n: 'IV',
    side: 'right', fig: 'dem-2', eyebrow: 'THE FOURTH CIRCLE', title: 'GREED',
    tag: 'the hoard that never closes',
    body: `Fifty clients. Two hundred deliveries, and still counting. A vault
      of configs, each one tuned, each one sold, each one kept. I called it
      craft, so that I would not have to call it anything else.`,
    ledger: 'OpenBullet / SilverBullet · 50+ clients · 200+ projects',
  },
  {
    scene: 'circle-5', stage: 'V · WRATH', mood: 'inferno', n: 'V',
    side: 'left', fig: 'dem-3', eyebrow: 'THE FIFTH CIRCLE', title: 'WRATH',
    tag: 'the siege that never raises its voice',
    body: `The marsh, where defences drown without making a sound. I beat rate
      limits with a patience that wore the face of mercy. The softest assault
      still arrives, and arrives, and arrives.`,
    ledger: 'rate-limit defeat · distributed timing',
  },
  {
    scene: 'circle-6', stage: 'VI · HERESY', mood: 'inferno', n: 'VI',
    side: 'right', fig: 'dem-2', eyebrow: 'THE SIXTH CIRCLE', title: 'HERESY',
    tag: 'forbidden doctrine',
    body: `I read what had been sealed. Reverse engineered the closed and the
      undocumented, rebuilt protocols straight off the wire. The heresy is
      small and total: nothing people build stays shut forever.`,
    ledger: 'reverse engineering · protocol analysis',
  },
  {
    scene: 'circle-7', stage: 'VII · VIOLENCE', mood: 'inferno', n: 'VII',
    side: 'left', fig: 'dem-3', eyebrow: 'THE SEVENTH CIRCLE', title: 'VIOLENCE',
    tag: 'war on the watchers',
    body: `Cloudflare. Akamai. DataDome. The JA3 of a handshake forged byte
      for byte. I studied how a machine tells a man from a machine until I
      was certain of it, and then I was neither.`,
    ledger: 'anti-bot research · TLS / JA3 fingerprinting',
  },
  {
    scene: 'circle-8', stage: 'VIII · FRAUD', mood: 'inferno', n: 'VIII',
    side: 'right', fig: 'dem-4', eyebrow: 'THE EIGHTH CIRCLE', title: 'FRAUD',
    tag: 'the perfect lie',
    body: `Behaviour emulated down to the tremor. Residential exits, a hand on
      a mouse that no model would think to doubt. Geryon carries you down on
      the strength of a face that was never yours.`,
    ledger: 'behavioral emulation · residential proxies',
  },
  {
    scene: 'circle-9', stage: 'IX · TREACHERY', mood: 'inferno', n: 'IX',
    side: 'left', fig: 'dem-5', eyebrow: 'THE NINTH CIRCLE', title: 'TREACHERY',
    tag: 'the frozen floor of everything',
    body: `The bottom, and it is ice, not fire. Rust and Go, low and merciless
      and fast. The cold kept the work sharp, and it kept me sharp along with
      it. This was as far down as down was willing to go.`,
    ledger: 'Rust · Go · low-level maximum-throughput systems',
  },

  // ── IL RITORNO : redemption, and the loop ────────────────────────────────
  {
    scene: 'ritorno', stage: 'IL RITORNO', mood: 'ritorno', side: 'center',
    fig: 'ang-6', eyebrow: 'CANTICA · IL RITORNO', title: 'AND THE STARS',
    tag: 'the way out runs through the centre',
    body: `At the very floor there is a trick the place does not advertise.
      To leave, you climb down the thing that damns you until down, very
      slowly, becomes up. I had every tool to break out, because I had built
      all of them to break in. The same hands. I only had to turn them around.
      The first thing I made on the way up was a door that closed honestly.
      The light came back the way it had left, one sphere at a time. I do not
      get to be only the height, or only the depth. I get to be the one who
      knew both, and chose the climb, and keeps on choosing it.`,
    verse: `E quindi uscimmo a riveder le stelle.<br/>
      And so we came back out, and saw the stars again.`,
    note: 'the climb begins again',
  },
];

function figureBlock(s) {
  if (!s.fig) return '';
  const kind = s.fig.startsWith('ang') ? 'ang' : 'dem';
  const url = `/assets/figures/${s.fig}.png`;
  return `<div class="figure figure-${kind}" aria-hidden="true" style="--fig:url('${url}')">
      <div class="figure-wrap">
        <img loading="lazy" decoding="async" src="${url}" alt="" />
        <span class="figure-sheen"></span>
      </div>
    </div>`;
}

function sceneBlock(s) {
  const num = s.n ? `<span class="numeral" aria-hidden="true">${s.n}</span>` : '';
  const eb = s.eyebrow ? `<div class="eyebrow line">${s.eyebrow}</div>` : '';
  const verse = s.verse ? `<p class="verse line">${s.verse}</p>` : '';
  const tag = s.tag ? `<p class="scene-tag line">${s.tag}</p>` : '';
  const led = s.ledger ? `<p class="ledger line">${s.ledger}</p>` : '';
  return `
  <section class="scene mood-${s.mood} ${s.hero ? 'hero' : ''}"
           data-scene="${s.scene}" data-stage="${s.stage}"
           data-mood="${s.mood}" data-side="${s.side}">
    <div class="scene-glow" aria-hidden="true"></div>
    ${figureBlock(s)}
    <div class="scene-inner">
      ${num}${eb}
      <h2 class="scene-title line">${s.title}</h2>
      ${tag}${verse}
      <p class="scene-body line">${s.body}</p>
      ${led}
    </div>
  </section>`;
}

export function buildContent(app) {
  const tail = `
  <section class="scene loop-sentinel" data-scene="loop" aria-hidden="true"></section>`;
  app.innerHTML = SCENES.map(sceneBlock).join('') + tail;
}

export const SCENE_COUNT = SCENES.length;
