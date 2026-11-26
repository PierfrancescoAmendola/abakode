export const cardVertex = /* glsl */ `
varying vec2 vUv;
varying float vDist;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vDist = distance(wp.xyz, cameraPosition);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

// Cards face the centre: seen from outside we hit the back face, so flip U to keep images unmirrored.
// Cards fade when the camera passes through them and darken on the far side of the sphere.
export const cardFragment = /* glsl */ `
uniform sampler2D uMap;
uniform float uOpacity;
uniform float uDim;
varying vec2 vUv;
varying float vDist;
void main() {
  vec2 uv = vUv;
  if (!gl_FrontFacing) uv.x = 1.0 - uv.x;
  vec3 c = texture2D(uMap, uv).rgb;
  float near = smoothstep(0.6, 3.0, vDist);
  // Depth relative to the sphere centre (origin): front side < 0 < back side. Off when the camera is inside.
  float camR = length(cameraPosition);
  float depth = vDist - camR;
  float far = 1.0 - smoothstep(-2.0, 8.0, depth) * 0.94 * smoothstep(10.0, 18.0, camR);
  // Far side fades out (not to black) so the backdrop shows through the sphere.
  gl_FragColor = vec4(c * uDim, uOpacity * near * far);
  #include <colorspace_fragment>
}
`
