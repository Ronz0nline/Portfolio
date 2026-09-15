import './style.css';
import { initSmoothScroll } from './ui/smoothScroll.js';
import { portfolioData } from './data/portfolioData.js';
import { ThreeEngine } from './three/engine.js';
import { initScrollTimeline } from './ui/scrollTimeline.js';
import { initRagDemo } from './ui/ragDemo.js';
import { initContactForm } from './ui/contactForm.js';
import { initMobileMenu } from './ui/mobileMenu.js';
import { initSignatureIntro } from './ui/signatureIntro.js';
import { initAeroBackground } from './ui/aeroBackground.js';
import { initGlowCursor } from './ui/glowCursor.js';
import { initBlurText, triggerBlurText } from './ui/blurText.js';
import { initBorderGlow } from './ui/borderGlow.js';
import { initClickSparkle } from './ui/clickSparkle.js';
import { initMagicRings } from './ui/MagicRings.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Set current year dynamically
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialise Lenis + GSAP Smooth Scroll Engine
  initSmoothScroll();

  // Initialise ambient aero background shades
  initAeroBackground();

  // Initialise interactive glow cursor (React Bits inspired)
  initGlowCursor();

  // Initialise click sparkle effect (React Bits inspired)
  initClickSparkle();

  // Initialise card spotlight border glow (React Bits inspired)
  initBorderGlow();

  // Initialise blur text effect (React Bits inspired)
  initBlurText();

  // Initialise React Bits <MagicRings /> component
  initMagicRings('[data-magic-rings]', {
    color: '#aa571e',
    colorTwo: '#d96f25',
    ringCount: 6,
    speed: 1.1,
    attenuation: 10,
    lineThickness: 2,
    baseRadius: 0.35,
    radiusStep: 0.1,
    scaleRate: 0.1,
    opacity: 0.85,
    blur: 0,
    noiseAmount: 0,
    rotation: 0,
    ringGap: 1.5,
    fadeIn: 0.7,
    fadeOut: 0.5,
    followMouse: true,
    mouseInfluence: 0.25,
    hoverScale: 1.0,
    parallax: 0.06,
    clickBurst: true,
  });

  // Initialise the Three.js engine immediately — it renders silently
  // behind the signature intro overlay.
  const threeEngine = new ThreeEngine('webgl-canvas-container');

  // ── Signature intro (locks scroll until first user scroll) ──────────
  // Returns a promise that resolves once the user triggers the transition.
  await initSignatureIntro(threeEngine);

  // ── Activate the portfolio narrative ────────────────────────────────
  // Only starts AFTER the intro has been dismissed — this prevents
  // GSAP ScrollTrigger from reacting to any scroll position during intro.
  initScrollTimeline(threeEngine);

  // Trigger blur text reveal for Chapter 00 headline
  triggerBlurText();

  // ── Secondary UI ────────────────────────────────────────────────────
  initMobileMenu();
  initRagDemo(threeEngine);
  initContactForm();

  // Dev helpers
  window.__rohanEngine = threeEngine;
  window.__portfolioData = portfolioData;
});

