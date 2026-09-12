import './style.css';
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

document.addEventListener('DOMContentLoaded', async () => {
  // Set current year dynamically
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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

