/**
 * MAGIC RINGS
 * Implementation of React Bits <MagicRings /> component
 * Source & Specification: https://reactbits.dev (JavaScript + Three.js + CSS)
 * 
 * Renders concentric luminous glowing rings with custom shaders, cutaways,
 * noise, hover scaling, depth parallax, and optional click burst.
 */

import * as THREE from 'three';
import './MagicRings.css';

const vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime, uAttenuation, uLineThickness;
uniform float uBaseRadius, uRadiusStep, uScaleRate;
uniform float uOpacity, uNoiseAmount, uRotation, uRingGap;
uniform float uFadeIn, uFadeOut;
uniform float uMouseInfluence, uHoverAmount, uHoverScale, uParallax, uBurst;
uniform float uCoverageAlpha;
uniform vec2 uResolution, uMouse;
uniform vec3 uColor, uColorTwo;
uniform int uRingCount;

const float HP = 1.5707963;
const float CYCLE = 3.45;

float fade(float t) {
  return t < uFadeIn ? smoothstep(0.0, uFadeIn, t) : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
}

float ring(vec2 p, float ri, float cut, float t0, float px) {
  float t = mod(uTime + t0, CYCLE);
  float r = ri + t / CYCLE * uScaleRate;
  float d = abs(length(p) - r);
  float a = atan(abs(p.y), abs(p.x)) / HP;
  float th = max(1.0 - a, 0.5) * px * uLineThickness;
  float h = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
  d += pow(cut * a, 3.0) * r;
  return h * exp(-uAttenuation * d) * fade(t);
}

void main() {
  float px = 1.0 / min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;
  float cr = cos(uRotation), sr = sin(uRotation);
  p = mat2(cr, -sr, sr, cr) * p;
  p -= uMouse * uMouseInfluence;
  float sc = mix(1.0, uHoverScale, uHoverAmount) + uBurst * 0.45;
  p /= sc;
  vec3 c = vec3(0.0);
  float coverage = 0.0;
  float rcf = max(float(uRingCount) - 1.0, 1.0);
  for (int i = 0; i < 10; i++) {
    if (i >= uRingCount) break;
    float fi = float(i);
    vec2 pr = p - fi * uParallax * uMouse;
    vec3 rc = mix(uColor, uColorTwo, fi / rcf);
    float ringAmount = ring(pr, uBaseRadius + fi * uRadiusStep, pow(uRingGap, fi), i == 0 ? 0.0 : 2.95 * fi, px);
    c = mix(c, rc, vec3(ringAmount));
    coverage = max(coverage, ringAmount);
  }
  c *= 1.0 + uBurst * 2.8;
  float n = fract(sin(dot(gl_FragCoord.xy + uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
  c += (n - 0.5) * uNoiseAmount;
  float intensity = max(c.r, max(c.g, c.b));
  vec3 emissiveColor = intensity > 0.0001 ? clamp(c / intensity, 0.0, 1.0) : vec3(0.0);
  vec3 outputColor = mix(emissiveColor, clamp(c, 0.0, 1.0), uCoverageAlpha);
  float outputAlpha = mix(intensity, coverage, uCoverageAlpha);
  gl_FragColor = vec4(outputColor, clamp(outputAlpha * uOpacity, 0.0, 1.0));
}
`;

/**
 * Creates and mounts a MagicRings instance to a DOM element.
 * 
 * @param {HTMLElement|string} target - Container element or CSS selector.
 * @param {Object} options - Configuration options matching React Bits spec.
 * @returns {Object} Controller object with destroy() and updateProps().
 */
export function createMagicRings(target, options = {}) {
  const mount = typeof target === 'string' ? document.querySelector(target) : target;
  if (!mount) return null;

  // Ensure standard container styling
  mount.classList.add('magic-rings-container');

  // Internal mutable props state
  const props = {
    color: '#aa571e',
    colorTwo: '#d96f25',
    speed: 1.1,
    ringCount: 6,
    attenuation: 10,
    lineThickness: 2,
    baseRadius: 0.35,
    radiusStep: 0.1,
    scaleRate: 0.1,
    opacity: 1,
    blur: 0,
    noiseAmount: 0,
    rotation: 0,
    ringGap: 1.5,
    fadeIn: 0.7,
    fadeOut: 0.5,
    followMouse: false,
    mouseInfluence: 0.2,
    hoverScale: 1.0,
    parallax: 0.05,
    clickBurst: true,
    alphaMode: 'luminance',
    ...options,
  };

  if (props.blur > 0) {
    mount.style.filter = `blur(${props.blur}px)`;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch (err) {
    console.warn('MagicRings: WebGLRenderer creation failed', err);
    return null;
  }

  if (!renderer.capabilities.isWebGL2) {
    renderer.dispose();
    console.warn('MagicRings: WebGL2 is required');
    return null;
  }

  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
  camera.position.z = 1;

  const uniforms = {
    uTime: { value: 0 },
    uAttenuation: { value: props.attenuation },
    uResolution: { value: new THREE.Vector2() },
    uColor: { value: new THREE.Color(props.color) },
    uColorTwo: { value: new THREE.Color(props.colorTwo) },
    uLineThickness: { value: props.lineThickness },
    uBaseRadius: { value: props.baseRadius },
    uRadiusStep: { value: props.radiusStep },
    uScaleRate: { value: props.scaleRate },
    uRingCount: { value: props.ringCount },
    uOpacity: { value: props.opacity },
    uNoiseAmount: { value: props.noiseAmount },
    uRotation: { value: (props.rotation * Math.PI) / 180 },
    uRingGap: { value: props.ringGap },
    uFadeIn: { value: props.fadeIn },
    uFadeOut: { value: props.fadeOut },
    uMouse: { value: new THREE.Vector2() },
    uMouseInfluence: { value: props.followMouse ? props.mouseInfluence : 0 },
    uHoverAmount: { value: 0 },
    uHoverScale: { value: props.hoverScale },
    uParallax: { value: props.parallax },
    uBurst: { value: 0 },
    uCoverageAlpha: { value: props.alphaMode === 'coverage' ? 1 : 0 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
  });

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  scene.add(quad);

  // Resize handling
  const resize = () => {
    const w = mount.clientWidth || 300;
    const h = mount.clientHeight || 300;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setSize(w, h);
    renderer.setPixelRatio(dpr);
    uniforms.uResolution.value.set(w * dpr, h * dpr);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const ro = new ResizeObserver(resize);
  ro.observe(mount);

  // Pointer & Interactive Tracking
  const interactiveEl = mount.closest('section') || mount;

  const mouse = [0, 0];
  const smoothMouse = [0, 0];
  let hoverAmount = 0;
  let isHovered = false;
  let burst = 0;

  const onMouseMove = (e) => {
    const rect = mount.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.5;
    mouse[0] = (e.clientX - centerX) / (rect.width * 0.5);
    mouse[1] = -((e.clientY - centerY) / (rect.height * 0.5));
    if (!isHovered) isHovered = true;
  };

  const onMouseEnter = () => {
    isHovered = true;
  };

  const onMouseLeave = (e) => {
    if (e && e.relatedTarget && interactiveEl.contains(e.relatedTarget)) return;
    isHovered = false;
    mouse[0] = 0;
    mouse[1] = 0;
  };

  const triggerBurst = () => {
    if (props.clickBurst) {
      burst = 1.35;
    }
  };

  interactiveEl.addEventListener('mousemove', onMouseMove, { passive: true });
  interactiveEl.addEventListener('mouseenter', onMouseEnter, { passive: true });
  interactiveEl.addEventListener('mouseleave', onMouseLeave, { passive: true });
  interactiveEl.addEventListener('pointerdown', triggerBurst, { passive: true });
  interactiveEl.addEventListener('click', triggerBurst);

  if (interactiveEl !== mount) {
    mount.addEventListener('mousemove', onMouseMove, { passive: true });
    mount.addEventListener('mouseenter', onMouseEnter, { passive: true });
    mount.addEventListener('mouseleave', onMouseLeave, { passive: true });
    mount.addEventListener('pointerdown', triggerBurst, { passive: true });
    mount.addEventListener('click', triggerBurst);
  }

  // Animation Loop with Visibility & Intersection Guard
  let frameId = 0;
  let isVisible = false;
  let isPageVisible = !document.hidden;
  let elapsed = 0;
  let lastT = 0;

  const animate = (t) => {
    frameId = requestAnimationFrame(animate);

    const dt = lastT === 0 ? 0 : Math.min(t - lastT, 100);
    lastT = t;
    elapsed += dt * 0.001 * props.speed;

    smoothMouse[0] += (mouse[0] - smoothMouse[0]) * 0.08;
    smoothMouse[1] += (mouse[1] - smoothMouse[1]) * 0.08;
    hoverAmount += ((isHovered ? 1 : 0) - hoverAmount) * 0.08;
    burst *= 0.935;
    if (burst < 0.001) burst = 0;

    uniforms.uTime.value = elapsed;
    uniforms.uAttenuation.value = props.attenuation;
    uniforms.uColor.value.set(props.color);
    uniforms.uColorTwo.value.set(props.colorTwo);
    uniforms.uLineThickness.value = props.lineThickness;
    uniforms.uBaseRadius.value = props.baseRadius;
    uniforms.uRadiusStep.value = props.radiusStep;
    uniforms.uScaleRate.value = props.scaleRate;
    uniforms.uRingCount.value = props.ringCount;
    uniforms.uOpacity.value = props.opacity;
    uniforms.uNoiseAmount.value = props.noiseAmount;
    uniforms.uRotation.value = (props.rotation * Math.PI) / 180;
    uniforms.uRingGap.value = props.ringGap;
    uniforms.uFadeIn.value = props.fadeIn;
    uniforms.uFadeOut.value = props.fadeOut;
    uniforms.uMouse.value.set(smoothMouse[0], smoothMouse[1]);
    uniforms.uMouseInfluence.value = props.followMouse ? props.mouseInfluence : 0;
    uniforms.uHoverAmount.value = hoverAmount;
    uniforms.uHoverScale.value = props.hoverScale;
    uniforms.uParallax.value = props.parallax;
    uniforms.uBurst.value = props.clickBurst ? burst : 0;
    uniforms.uCoverageAlpha.value = props.alphaMode === 'coverage' ? 1 : 0;

    renderer.render(scene, camera);
  };

  const tryStart = () => {
    if (isVisible && isPageVisible && frameId === 0) {
      lastT = 0;
      frameId = requestAnimationFrame(animate);
    }
  };

  const tryStop = () => {
    if (frameId !== 0) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  };

  const io = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) tryStart();
      else tryStop();
    },
    { threshold: 0.05 }
  );
  io.observe(mount);

  const onVisibility = () => {
    isPageVisible = !document.hidden;
    if (isPageVisible) tryStart();
    else tryStop();
  };
  document.addEventListener('visibilitychange', onVisibility);

  tryStart();

  return {
    element: mount,
    renderer,
    scene,
    camera,
    updateProps(newProps = {}) {
      Object.assign(props, newProps);
      if (props.blur > 0) {
        mount.style.filter = `blur(${props.blur}px)`;
      } else {
        mount.style.filter = '';
      }
    },
    triggerBurst() {
      burst = 1;
    },
    destroy() {
      tryStop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      interactiveEl.removeEventListener('mousemove', onMouseMove);
      interactiveEl.removeEventListener('mouseenter', onMouseEnter);
      interactiveEl.removeEventListener('mouseleave', onMouseLeave);
      interactiveEl.removeEventListener('pointerdown', triggerBurst);
      interactiveEl.removeEventListener('click', triggerBurst);
      if (interactiveEl !== mount) {
        mount.removeEventListener('mousemove', onMouseMove);
        mount.removeEventListener('mouseenter', onMouseEnter);
        mount.removeEventListener('mouseleave', onMouseLeave);
        mount.removeEventListener('pointerdown', triggerBurst);
        mount.removeEventListener('click', triggerBurst);
      }
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      material.dispose();
      quad.geometry.dispose();
    },
  };
}

/**
 * Automatically initializes MagicRings on all selector targets.
 */
export function initMagicRings(selector = '[data-magic-rings]', defaultOptions = {}) {
  const elements = document.querySelectorAll(selector);
  const instances = [];

  elements.forEach((el) => {
    // Read optional inline data attributes
    const opts = { ...defaultOptions };
    if (el.dataset.color) opts.color = el.dataset.color;
    if (el.dataset.colorTwo) opts.colorTwo = el.dataset.colorTwo;
    if (el.dataset.ringCount) opts.ringCount = parseInt(el.dataset.ringCount, 10);
    if (el.dataset.speed) opts.speed = parseFloat(el.dataset.speed);
    if (el.dataset.attenuation) opts.attenuation = parseFloat(el.dataset.attenuation);
    if (el.dataset.followMouse) opts.followMouse = el.dataset.followMouse === 'true';
    if (el.dataset.clickBurst) opts.clickBurst = el.dataset.clickBurst === 'true';

    const instance = createMagicRings(el, opts);
    if (instance) {
      el.__magicRings = instance;
      instances.push(instance);
    }
  });

  return instances;
}

export default createMagicRings;
