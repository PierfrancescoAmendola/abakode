export const introVertex = /* glsl */ `
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`

// uT = scroll progress (0 → 5), uTime = wall clock so stars keep moving when the scroll stops.
// The pupil dilates onto a starfield; scrolling on jumps to hyperspace, then drops back to still stars.
export const introFragment = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uT;
uniform float uTime;
uniform sampler2D uIris;

const float IRIS_SCREEN = 0.42; // iris radius in screen-height units at zoom 1
const float PUPIL = 0.27;       // pupil radius in the source photo, in iris-radius units

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float zoomAt(float t) { return exp(0.3 * t + 0.06 * t * t); }

// Pupil "breathes" at rest and opens as the user scrolls.
float pupilAt(float t) {
  float dilation = 0.15 * smoothstep(0.0, 1.9, t) + 0.02 * sin(uTime * 1.3);
  return PUPIL + dilation * (1.0 - PUPIL);
}

// Iris photo; .a = 1 where the pupil opens onto space.
vec4 eye(vec2 q, float z, float t) {
  vec2 p = q / (IRIS_SCREEN * z);
  float r = length(p);
  float pr = pupilAt(t);
  // Remap radius so the pupil grows while the outer rim stays put (fibres compress like a real iris).
  float rs = r < pr ? r / pr * PUPIL : mix(PUPIL, 1.0, clamp((r - pr) / (1.0 - pr), 0.0, 1.0));
  if (r > 1.0) rs = r;
  float a = atan(p.y, p.x) + uTime * 0.02 + 0.12 * t;   // slow drift + twist with scroll
  vec2 uv = 0.5 + vec2(cos(a), sin(a)) * rs * 0.5;
  vec3 col = texture2D(uIris, uv).rgb;
  col *= 0.94 + 0.1 * sin(a * 5.0 - uTime * 0.6 + rs * 8.0) * smoothstep(PUPIL, 0.6, rs); // light shimmer
  col *= smoothstep(1.02, 0.96, r);
  return vec4(col, smoothstep(pr, pr - 0.015, r));
}

// Stars flying out of the centre. Polar bins, one star per bin per layer; depth d in (0,1] projects
// to screen radius K/d. warp 0 = points drifting, warp 1 = long hyperspace streaks.
vec3 space(vec2 q, float warp, float t) {
  float r = length(q);
  float ang = atan(q.y, q.x) / 6.28318 + 0.5;
  vec3 col = vec3(0.0);
  for (int L = 0; L < 3; L++) {
    float fl = float(L);
    float bins = 260.0 + fl * 130.0;
    float cell = ang * bins;
    float id = floor(cell);
    float h = hash(vec2(id, fl * 7.1 + 1.3));
    float h2 = hash(vec2(id * 1.7, fl + 9.0));
    float across = abs(fract(cell) - 0.5) / bins * 6.28318 * r;
    float vel = mix(0.035, 1.5, warp * warp);
    float d = fract(h * 13.7 - uTime * vel * (0.5 + h2) - t * 0.25);
    float head = 0.045 / max(d, 0.015);
    float trail = head * (0.015 + 0.85 * warp);
    float width = mix(0.0016, 0.0026, h2) * (0.6 + 0.6 * smoothstep(0.0, 0.5, r));
    float along = smoothstep(head - trail, head, r) * smoothstep(head + width * 2.0, head, r);
    float bright = smoothstep(1.0, 0.25, d) * (0.45 + 0.55 * h2);
    float line = smoothstep(width, 0.0, across) * along * bright;
    col += mix(vec3(0.82, 0.88, 1.0), vec3(0.55, 0.7, 1.0), h) * line * 1.4;
  }
  // Blue haze around the dark centre while jumping.
  col += vec3(0.12, 0.2, 0.45) * warp * smoothstep(0.05, 0.35, r) * exp(-r * 2.2) * 0.6;
  return col;
}

void main() {
  vec2 q = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float z = zoomAt(min(uT, 4.0));
  float warp = smoothstep(2.4, 3.8, uT) * (1.0 - smoothstep(4.05, 4.45, uT));
  float flash = exp(-pow((uT - 4.12) / 0.09, 2.0));
  vec4 e = eye(q, z, uT);
  // Stars inside the pupil only show once you are close to the eye.
  float near = smoothstep(1.2, 2.1, uT);
  vec3 col = mix(e.rgb, space(q, warp, uT) * near, e.a);
  col += vec3(0.85, 0.92, 1.0) * flash * 0.9;
  col *= 1.0 - 0.35 * smoothstep(0.45, 1.0, length(q));
  gl_FragColor = vec4(col, 1.0);
}
`
