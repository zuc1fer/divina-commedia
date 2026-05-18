// ─────────────────────────────────────────────────────────────────────────────
//  DIVINA COMMEDIA — the WebGL world (one fixed, seamless canvas)
//  Atmosphere + wind-borne leaves + cold monoliths + post. The imagery
//  (angels & demons) lives in the DOM as figure cutouts.
// ─────────────────────────────────────────────────────────────────────────────
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import {
  BACKDROP_VERT, BACKDROP_FRAG,
  PARTICLE_VERT, PARTICLE_FRAG,
  MONOLITH_VERT, MONOLITH_FRAG,
  GRADE_VERT, GRADE_FRAG,
} from './shaders.js';

const darkness = (p) => {
  const fall = THREE.MathUtils.smoothstep(p, 0.30, 0.60);
  const rise = THREE.MathUtils.smoothstep(p, 0.955, 0.999);
  return Math.max(0, Math.min(1, fall * (1 - rise)));
};

export class World {
  constructor(canvas) {
    this.canvas = canvas;
    this.progress = 0;
    this._target = 0;
    this.tear = 0;
    this.clock = new THREE.Clock();

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4;
    this.quality = (reduced || cores <= 4 || mem <= 4) ? 'low' : 'high';

    this.renderer = new THREE.WebGLRenderer({
      canvas, antialias: this.quality === 'high',
      powerPreference: 'high-performance', stencil: false,
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.quality === 'high' ? 1.85 : 1.3));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.95;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 200);
    this.camera.position.set(0, 0, 6);
    this.scene.add(this.camera);

    this._buildBackdrop();
    this._buildLeaves();
    this._buildMonoliths();
    this._buildPost();

    addEventListener('resize', () => this._resize());
  }

  _buildBackdrop() {
    this.backU = {
      uTime: { value: 0 }, uProgress: { value: 0 }, uScroll: { value: 0 },
      uRes: { value: new THREE.Vector2(innerWidth, innerHeight) },
    };
    this.backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.ShaderMaterial({
        vertexShader: BACKDROP_VERT, fragmentShader: BACKDROP_FRAG,
        uniforms: this.backU, depthWrite: false, depthTest: false,
      }));
    this.backdrop.frustumCulled = false;
    this.backdrop.renderOrder = -10;
    this._backDist = 50;
    this.backdrop.position.set(0, 0, -this._backDist);
    this.camera.add(this.backdrop);
    this._sizeBackdrop();
  }

  _sizeBackdrop() {
    const D = this._backDist;
    const h = 2 * Math.tan((this.camera.fov * Math.PI / 180) / 2) * D * 1.18;
    this.backdrop.scale.set(h * this.camera.aspect * 1.05, h, 1);
  }

  _buildLeaves() {
    const N = this.quality === 'high' ? 5200 : 2400;
    const pos = new Float32Array(N * 3);
    const rnd = new Float32Array(N * 3);
    const siz = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
      rnd[i * 3] = Math.random();
      rnd[i * 3 + 1] = Math.random();
      rnd[i * 3 + 2] = Math.random();
      siz[i] = 0.5 + Math.random() * 1.1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(siz, 1));

    this.partU = {
      uTime: { value: 0 }, uProgress: { value: 0 },
      uPix: { value: this.renderer.getPixelRatio() },
    };
    this.leaves = new THREE.Points(g, new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERT, fragmentShader: PARTICLE_FRAG,
      uniforms: this.partU, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    this.leaves.frustumCulled = false;
    this.leaves.renderOrder = 2;
    this.scene.add(this.leaves);
  }

  _buildMonoliths() {
    this.monoU = { uShow: { value: 0 } };
    const mat = new THREE.ShaderMaterial({
      vertexShader: MONOLITH_VERT, fragmentShader: MONOLITH_FRAG,
      uniforms: this.monoU, transparent: true, depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.monoliths = new THREE.Group();
    const M = this.quality === 'high' ? 20 : 10;
    for (let i = 0; i < M; i++) {
      const w = 0.6 + Math.random() * 2.0;
      const h = 7 + Math.random() * 26;
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), mat);
      b.position.set((Math.random() - 0.5) * 60, -14 + h / 2 + Math.random() * 4,
        -16 - Math.random() * 34);
      b.rotation.y = Math.random() * Math.PI;
      b.renderOrder = 1;
      this.monoliths.add(b);
    }
    this.monoliths.visible = false;
    this.scene.add(this.monoliths);
  }

  _buildPost() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    if (this.quality === 'high') {
      this.bloom = new UnrealBloomPass(
        new THREE.Vector2(innerWidth, innerHeight), 0.42, 0.55, 0.72);
      this.composer.addPass(this.bloom);
    }
    this.gradeU = {
      tDiffuse: { value: null }, uTime: { value: 0 },
      uProgress: { value: 0 }, uTear: { value: 0 },
      uRes: { value: new THREE.Vector2(innerWidth, innerHeight) },
    };
    this.composer.addPass(new ShaderPass(new THREE.ShaderMaterial({
      uniforms: this.gradeU, vertexShader: GRADE_VERT, fragmentShader: GRADE_FRAG,
    })));
    this.composer.addPass(new OutputPass());
  }

  // Lenis already smooths the scroll value, so track it directly (no lag,
  // fully scroll-reactive, frame-rate independent)
  setProgress(p) { this.progress = this._target = Math.min(1, Math.max(0, p)); }
  jumpProgress(p) { this.progress = this._target = Math.min(1, Math.max(0, p)); }
  setTear(v) { this.tear = v; }

  _resize() {
    const w = innerWidth, h = innerHeight;
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
    this._sizeBackdrop();
    this.backU.uRes.value.set(w, h);
    this.gradeU.uRes.value.set(w, h);
    if (this.bloom) this.bloom.setSize(w, h);
  }

  update() {
    const t = this.clock.getElapsedTime();
    const p = this.progress;
    const d = darkness(p);

    this.backU.uTime.value = t;
    this.backU.uProgress.value = p;
    this.backU.uScroll.value = this._target; // raw, tracks the wheel for parallax
    this.partU.uTime.value = t;
    this.partU.uProgress.value = p;
    this.gradeU.uTime.value = t;
    this.gradeU.uProgress.value = p;
    this.gradeU.uTear.value = this.tear;

    const show = THREE.MathUtils.smoothstep(p, 0.64, 0.84) *
      (1 - THREE.MathUtils.smoothstep(p, 0.93, 0.965));
    this.monoU.uShow.value = show;
    this.monoliths.visible = show > 0.002;
    this.monoliths.rotation.y = t * 0.012;

    this.camera.position.x = Math.sin(t * 0.05) * 0.25;
    this.camera.position.y = Math.cos(t * 0.04) * 0.16 - d * 0.55;
    this.camera.position.z = 6 - Math.sin(p * Math.PI) * 0.8; // dolly in, back out at the ends
    this.camera.rotation.z = Math.sin(t * 0.03) * 0.01 + this.tear * 0.05;

    if (this.bloom) {
      this.bloom.strength = THREE.MathUtils.lerp(0.44, 0.18, d) + this.tear * 0.8;
      this.bloom.threshold = THREE.MathUtils.lerp(0.70, 0.80, d);
    }
    this.composer.render();
  }
}
