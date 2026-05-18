// ─────────────────────────────────────────────────────────────────────────────
//  DIVINA COMMEDIA — shader library
//  uProgress 0 = Empyrean … ~0.46 the Purgatorio cloud-bridge … ~0.55 the rift
//  into the Inferno … ~0.9 Cocytus … 1 = the light again (seamless loop).
// ─────────────────────────────────────────────────────────────────────────────

export const NOISE = /* glsl */ `
  vec3 hash3(vec3 p){
    p = vec3(dot(p,vec3(127.1,311.7,74.7)),
             dot(p,vec3(269.5,183.3,246.1)),
             dot(p,vec3(113.5,271.9,124.6)));
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
  }
  float vnoise(vec3 x){
    vec3 i = floor(x); vec3 f = fract(x);
    vec3 u = f*f*(3.0-2.0*f);
    float n = mix(mix(mix(dot(hash3(i+vec3(0,0,0)),f-vec3(0,0,0)),
                          dot(hash3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),
                      mix(dot(hash3(i+vec3(0,1,0)),f-vec3(0,1,0)),
                          dot(hash3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),
                  mix(mix(dot(hash3(i+vec3(0,0,1)),f-vec3(0,0,1)),
                          dot(hash3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),
                      mix(dot(hash3(i+vec3(0,1,1)),f-vec3(0,1,1)),
                          dot(hash3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);
    return 0.5+0.5*n;
  }
  float fbm(vec3 p){
    float a = 0.5, s = 0.0;
    for(int i=0;i<5;i++){ s += a*vnoise(p); p *= 2.03; a *= 0.5; }
    return s;
  }
  float hash21(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
`;

export const DARKNESS = /* glsl */ `
  float darkness(float p){
    float fall = smoothstep(0.30, 0.60, p);
    float rise = smoothstep(0.955, 0.999, p);
    return clamp(fall * (1.0 - rise), 0.0, 1.0);
  }
  // 0 in open sky, 1 inside the Purgatorio cloud-bridge
  float veil(float p){
    return smoothstep(0.26,0.40,p) * (1.0 - smoothstep(0.46,0.56,p));
  }
  // the curtain tears: a clear rift that opens entering the Inferno
  float rift(float p){
    return smoothstep(0.50,0.62,p) * (1.0 - smoothstep(0.93,0.99,p));
  }
`;

export const BACKDROP_VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;

export const BACKDROP_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uProgress;     // eased scroll
  uniform float uScroll;       // raw scroll, for parallax that tracks the wheel
  uniform vec2  uRes;
  ${NOISE}
  ${DARKNESS}

  vec3 paletteFor(float p, float y){
    vec3 emBot=vec3(0.050,0.055,0.090), emMid=vec3(0.155,0.130,0.092), emTop=vec3(0.320,0.255,0.150);
    vec3 em = mix(mix(emBot,emMid,smoothstep(0.0,0.55,y)), emTop, smoothstep(0.55,1.0,y));
    vec3 pa = mix(vec3(0.045,0.060,0.105), vec3(0.110,0.135,0.190), y);
    vec3 pu = mix(vec3(0.085,0.088,0.094), vec3(0.165,0.165,0.168), y);
    vec3 inf= mix(vec3(0.020,0.030,0.040), vec3(0.045,0.062,0.080), y);
    vec3 co = mix(vec3(0.010,0.018,0.026), vec3(0.022,0.034,0.046), y);
    vec3 c = em;
    c = mix(c, pa,  smoothstep(0.04,0.28, p));
    c = mix(c, pu,  smoothstep(0.32,0.44, p));
    c = mix(c, inf, smoothstep(0.52,0.66, p));
    c = mix(c, co,  smoothstep(0.70,0.88, p));
    c = mix(c, em,  smoothstep(0.955,0.999,p));
    return c;
  }

  // a layered, scroll-parallaxed cloud field
  float clouds(vec2 uv, float travel, float scale, float t){
    vec3 q = vec3(uv.x*scale + t*0.04, uv.y*scale - travel, t*0.15);
    return fbm(q + fbm(q*0.55 + t*0.1)*0.8);
  }

  void main(){
    vec2 uv = vUv;
    float y = uv.y;
    float p = uProgress;
    float d = darkness(p);
    float grace = 1.0 - d;
    float t = uTime;

    vec3 col = paletteFor(p, y);

    // parallax: clouds sweep upward as you fall (tracks scroll, three depths)
    float s = uScroll;
    float far  = clouds(uv, s*0.9 + t*0.010, 2.0, t);
    float mid  = clouds(uv, s*1.9 + t*0.018, 3.3, t*1.2);
    float near = clouds(uv, s*3.4 + t*0.030, 5.0, t*1.5);

    float V = veil(p);          // the Purgatorio bridge: you are inside cloud
    float R = rift(p);          // the curtain tears into the Inferno
    float ret = smoothstep(0.955,0.995,p); // gold cloud reforms on return

    // a horizontal rift that opens from the centre entering hell
    float gap = smoothstep(0.0, 0.5, R - abs(uv.y-0.5)*1.7);

    // heaven : a few high luminous banks
    col += grace*(1.0-V) * smoothstep(0.62,0.95,far) * vec3(0.075,0.060,0.034);
    col += grace * pow(smoothstep(0.5,1.0,y),2.0) * 0.16 * vec3(0.28,0.22,0.12);

    // the bridge : dense grey-gold cloud closing the world in
    vec3 bridgeCol = mix(vec3(0.30,0.27,0.22), vec3(0.16,0.16,0.17), smoothstep(0.34,0.46,p));
    float bridge = (smoothstep(0.35,0.95,mid)*0.6 + smoothstep(0.45,0.95,near)*0.7);
    col = mix(col, bridgeCol, clamp(V*bridge,0.0,0.92)*(1.0-gap));

    // the tear : cold void breaks through the parting cloud
    col = mix(col, vec3(0.02,0.05,0.07), R*gap*0.9);
    col += R*gap * smoothstep(0.4,0.9,near) * vec3(0.05,0.13,0.17);

    // inferno : low driving fog + cold storm streaks
    float fog = clouds(uv*vec2(1.2,1.0), s*2.4, 3.0, t*0.7);
    float streak = fbm(vec3(uv.x*1.1 + s*6.0 + t*2.0, uv.y*7.0, t));
    col -= d*(1.0-R*0.5) * smoothstep(0.42,0.0,uv.y) * (0.28*fog) * vec3(0.55,0.58,0.66);
    col += d * smoothstep(0.6,0.95,streak) * 0.05 * vec3(0.26,0.42,0.52);

    // cold aurora deep down
    float deep = smoothstep(0.66,0.86,p) * (1.0 - smoothstep(0.93,0.98,p));
    float aur = fbm(vec3(uv.x*2.0, uv.y*1.2 - t*0.4, t*0.3));
    col += deep * smoothstep(0.62,0.9,aur) * (0.5+0.5*sin(t*0.4))
         * vec3(0.045,0.115,0.150) * smoothstep(0.1,0.8,uv.y);

    // the light returns : gold cloud reforming, lifting
    col += ret * smoothstep(0.45,0.95,far) * vec3(0.12,0.095,0.05);

    // rare cold lightning, mid-inferno only
    float strike = step(0.992, hash21(vec2(floor(t*1.7), 3.0)));
    col += d*(1.0-R) * strike * (1.0-fract(t*1.7)) * smoothstep(0.3,1.0,uv.y)
         * 0.5 * vec3(0.28,0.42,0.52);

    col += (hash21(uv*uRes + fract(t))-0.5)/255.0;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// ── Particles : a golden storm of small leaves → cold cinders → gold ───────
export const PARTICLE_VERT = /* glsl */ `
  precision highp float;
  attribute vec3  aRand;
  attribute float aSize;
  uniform float uTime;
  uniform float uProgress;
  uniform float uPix;
  varying float vD;
  varying float vR;
  varying float vRot;
  varying float vTw;
  ${DARKNESS}

  void main(){
    float p = uProgress;
    float d = darkness(p);
    // the wind howls at the two thresholds (the storm of leaves)
    float gust = veil(p)*0.7 + rift(p)*1.0
               + (1.0 - smoothstep(0.0,0.18,p))*0.25;     // a breath at the very top

    vec3 pos = position;
    float spd  = (mix(0.16, 1.6, d) + aRand.y*0.5) * (1.0 + gust*2.4);
    float yy = mod(pos.y - uTime*spd + aRand.x*16.0, 16.0) - 8.0;
    float wind = uTime*(mix(0.18,0.55,d)+gust*1.2) + sin(uTime*0.5+aRand.z*6.2831)*mix(1.4,0.7,d);
    float swirl = sin(yy*0.6 + uTime*0.8 + aRand.x*6.2831) * (mix(0.9,0.4,d)+gust);
    vec3 wp;
    wp.x = pos.x + wind + swirl + sin(uTime*1.1+aRand.y*6.2831)*0.4;
    wp.y = yy;
    wp.z = pos.z + sin(uTime*0.3+aRand.z*6.2831)*0.6;

    vec4 mv = modelViewMatrix * vec4(wp,1.0);
    gl_Position = projectionMatrix * mv;
    float sz = aSize * mix(1.05, 0.82, d) * (1.0 + gust*0.5);
    gl_PointSize = sz * uPix * (135.0 / max(0.1,-mv.z));

    vD = d; vR = aRand.x;
    vRot = uTime*(0.9+aRand.z*2.8) + aRand.x*30.0 + gust*6.0;
    vTw = 0.55 + 0.45*sin(uTime*(1.4+aRand.z*2.0)+aRand.x*20.0);
  }
`;

export const PARTICLE_FRAG = /* glsl */ `
  precision highp float;
  varying float vD; varying float vR; varying float vRot; varying float vTw;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float si=sin(vRot), co=cos(vRot);
    vec2 q = vec2(c.x*co - c.y*si, c.x*si + c.y*co) * 2.2;
    float bodyW = (1.0 - q.y*q.y) * 0.46;
    float leaf = smoothstep(bodyW, bodyW-0.16, abs(q.x)) * step(abs(q.y),1.0);
    float vein = smoothstep(0.06,0.0,abs(q.x)) * (1.0-abs(q.y));
    float shape = clamp(leaf - vein*0.25, 0.0, 1.0);
    float ember = smoothstep(0.42,0.16,length(c));
    shape = mix(shape, ember, smoothstep(0.55,0.95,vD));
    if(shape < 0.02) discard;

    vec3 gold = mix(vec3(0.97,0.77,0.38), vec3(1.0,0.88,0.55), vR);
    vec3 cold = (vR>0.85) ? vec3(0.42,0.80,0.88)
                          : mix(vec3(0.36,0.42,0.50), vec3(0.52,0.57,0.64), vR);
    vec3 colr = mix(gold, cold, smoothstep(0.55,0.82,vD)); // stay golden far longer
    float a = shape * mix(0.44, 0.32, vD) * (0.62 + 0.38*vTw);
    gl_FragColor = vec4(colr, a);
  }
`;

export const MONOLITH_VERT = /* glsl */ `
  varying vec3 vN; varying vec3 vView;
  void main(){
    vec4 mv = modelViewMatrix * vec4(position,1.0);
    vN = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
export const MONOLITH_FRAG = /* glsl */ `
  precision highp float;
  varying vec3 vN; varying vec3 vView;
  uniform float uShow;
  void main(){
    float fres = pow(1.0 - max(0.0, dot(normalize(vN), normalize(vView))), 2.4);
    vec3 col = vec3(0.010,0.016,0.024) + vec3(0.14,0.40,0.48)*fres;
    gl_FragColor = vec4(col, (0.09 + fres*0.85) * uShow);
  }
`;

export const GRADE_VERT = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position,1.0); }
`;
export const GRADE_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D tDiffuse;
  uniform float uTime; uniform float uProgress; uniform float uTear; uniform vec2 uRes;
  ${NOISE}
  ${DARKNESS}
  void main(){
    vec2 uv = vUv;
    float d = darkness(uProgress);
    float tear = uTear;
    if(tear > 0.001){
      float band = floor(uv.y*14.0);
      uv.x += (hash21(vec2(band, floor(uTime*40.0)))-0.5) * tear * 0.35;
      uv.y += (hash21(vec2(band,7.0))-0.5) * tear * 0.05;
    }
    vec2 dd = uv - 0.5;
    float ca = 0.0011 + d*0.0024 + tear*0.045;
    vec3 col;
    col.r = texture2D(tDiffuse, uv + dd*ca).r;
    col.g = texture2D(tDiffuse, uv).g;
    col.b = texture2D(tDiffuse, uv - dd*ca).b;
    float lum = dot(col, vec3(0.299,0.587,0.114));
    vec3 warm = col*vec3(1.05,1.0,0.92) + smoothstep(0.6,1.0,lum)*vec3(0.05,0.03,0.0);
    vec3 cold = mix(vec3(lum), col, 0.82) * vec3(0.80,0.90,1.04);
    col = mix(warm, cold, d);
    col += (hash21(uv*uRes + fract(uTime*1.3))-0.5) * mix(0.035,0.10,d);
    col -= (sin(uv.y*uRes.y*1.4)*0.5+0.5) * mix(0.0,0.03,d);
    col *= clamp(1.0 - dot(dd,dd)*mix(0.55,1.30,d), 0.0, 1.0);
    col += tear*tear*0.6;
    gl_FragColor = vec4(col,1.0);
  }
`;
