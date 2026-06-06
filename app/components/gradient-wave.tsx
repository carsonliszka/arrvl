'use client'

import { useEffect, useRef } from 'react'

const VERT = `#version 300 es
precision highp float;
in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_uv;
void main() {
  v_uv = a_texCoord;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

#define NUM_COLORS 4

uniform vec4 u_colors[NUM_COLORS];
uniform int u_colors_length;
uniform float u_seed;
uniform float u_waveSpeed;
uniform float u_waveFreqX;
uniform float u_waveFreqY;
uniform float u_waveAngle;
uniform float u_waveAmplitude;
uniform float u_maskSoftness;
uniform float u_blendAmount;

uniform float u_time;
uniform vec2 u_resolution;

#define S(a,b,t) smoothstep(a,b,t)

mat2 Rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

vec2 hash(vec2 p) {
  float s = u_seed;
  vec2 k1 = vec2(2127.1 + s * 13.37, 81.17 + s * 7.31);
  vec2 k2 = vec2(1269.5 + s * 11.13, 283.37 + s * 5.79);
  p = vec2(dot(p, k1), dot(p, k2));
  return fract(sin(p) * (43758.5453 + s * 1.618));
}

float noise(in vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float n = mix(
    mix(dot(-1.0 + 2.0 * hash(i), f),
        dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
  return 0.5 + 0.5 * n;
}

vec3 getColor(int idx) {
  if (u_colors_length < 1) return vec3(0.0);
  int safeIdx = clamp(idx, 0, u_colors_length - 1);
  return u_colors[safeIdx].rgb;
}

float seedF(float base) {
  return base * (1.0 + 0.5 * sin(u_seed * 3.17 + base));
}

vec2 warpUV(vec2 uv) {
  float t = u_time * u_waveSpeed;
  float angleOffset = sin(u_seed * 2.73) * 30.0;
  mat2 dirRot = Rot(radians(u_waveAngle + angleOffset));
  vec2 ruv = dirRot * uv;

  float fxMod = seedF(u_waveFreqX);
  float fyMod = seedF(u_waveFreqY);

  float phaseX = fract(sin(u_seed * 7.19) * 437.58) * 6.2832;
  float phaseY = fract(cos(u_seed * 3.41) * 291.37) * 6.2832;

  float harmonic = sin(u_seed * 1.23) * 0.5;
  float a = fyMod * ruv.y - sin(ruv.x * fxMod + ruv.y - t + phaseX);
  a += harmonic * sin(ruv.x * fxMod * 2.0 + ruv.y * 0.5 + t * 0.7 + phaseY);

  a = smoothstep(
    cos(a) * u_maskSoftness,
    sin(a) * u_maskSoftness + 3.,
    cos(a - fyMod * ruv.y) - sin(a - fxMod * ruv.x)
  );

  a *= u_waveAmplitude;

  uv = cos(a) * uv + sin(a) * vec2(-uv.y, uv.x);
  return uv;
}

void main() {
  vec2 fragCoord = v_uv * u_resolution;
  vec2 uv = fragCoord / u_resolution.xy;
  float ratio = u_resolution.x / u_resolution.y;
  float t = u_time * u_waveSpeed;

  vec2 tuv = uv - 0.5;

  vec2 seedShift = vec2(sin(u_seed * 4.37), cos(u_seed * 5.91)) * 100.0;
  float degree = noise(vec2(t * 0.1, tuv.x * tuv.y) + seedShift);
  tuv.y *= 1.0 / ratio;
  tuv *= Rot(radians((degree - 0.5) * 720.0 + 180.0));
  tuv.y *= ratio;

  vec2 uv2 = (fragCoord * 2.0 - u_resolution.xy) / (u_resolution.x + u_resolution.y) * 2.0;
  float preRotAngle = fract(sin(u_seed * 5.63) * 173.29) * 6.2832;
  uv2 *= Rot(preRotAngle);
  vec2 warped = warpUV(uv2) * 0.5 + 0.5;

  vec2 blendUV = mix(tuv, warped - 0.5, u_blendAmount);

  float layerRot1 = -5.0 + sin(u_seed * 1.83) * 20.0;
  float layerRot2 = 10.0 + cos(u_seed * 2.47) * 20.0;

  vec3 c0 = getColor(0);
  vec3 c1 = getColor(1);
  vec3 c2 = getColor(2);
  vec3 c3 = getColor(3);

  vec3 layer1 = mix(c0, c2, S(-0.3, 0.3, (blendUV * Rot(radians(layerRot1))).x));
  vec3 layer2 = mix(c3, c1, S(-0.3, 0.3, (blendUV * Rot(radians(layerRot2))).x));
  vec3 col = mix(layer1, layer2, S(0.3, -0.3, blendUV.y));

  col = mix(col, col * col + 0.5 * sqrt(col), 0.3);

  fragColor = vec4(col, 1.0);
}`

const COLORS = [
  0.0313725508749485, 0.0313725508749485, 0.0313725508749485, 1,
  0.07058823853731155, 0.07058823853731155, 0.07058823853731155, 1,
  0.0196078438311815, 0.0196078438311815, 0.0196078438311815, 1,
  0, 0, 0, 0,
]

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('GradientWave shader error:', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export function GradientWave({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false })
    if (!gl) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('GradientWave link error:', gl.getProgramInfoLog(prog))
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1, 0, 0,
        1, -1, 1, 0,
        -1, 1, 0, 1,
        -1, 1, 0, 1,
        1, -1, 1, 0,
        1, 1, 1, 1,
      ]),
      gl.STATIC_DRAW
    )
    const aPos = gl.getAttribLocation(prog, 'a_position')
    const aTex = gl.getAttribLocation(prog, 'a_texCoord')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0)
    gl.enableVertexAttribArray(aTex)
    gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 16, 8)

    gl.uniform4fv(gl.getUniformLocation(prog, 'u_colors'), COLORS)
    gl.uniform1i(gl.getUniformLocation(prog, 'u_colors_length'), 3)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_seed'), 34)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_waveSpeed'), 0.63)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_waveFreqX'), 0.9)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_waveFreqY'), 6)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_waveAngle'), 105)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_waveAmplitude'), 2.1)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_maskSoftness'), 0.74)
    gl.uniform1f(gl.getUniformLocation(prog, 'u_blendAmount'), 0.54)
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes = gl.getUniformLocation(prog, 'u_resolution')

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }

    let rafId = 0
    const start = performance.now() - 8277
    const render = (now: number) => {
      resize()
      gl.uniform1f(uTime, (now - start) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      if (!prefersReduced) rafId = requestAnimationFrame(render)
    }
    rafId = requestAnimationFrame(render)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
