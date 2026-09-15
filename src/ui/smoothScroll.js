/**
 * SMOOTH SCROLL & GSAP SCROLLTRIGGER SYNCHRONIZATION
 * 
 * Powered by Lenis (Darkroom Engineering) + GSAP Ticker Integration.
 * Provides buttery 60/120fps momentum scrolling, eliminates browser scroll jitter,
 * and maintains pixel-perfect synchronization with GSAP ScrollTrigger.
 */

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;
let scrollListeners = [];

export function initSmoothScroll(options = {}) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Configure high-performance Lenis instance
  lenisInstance = new Lenis({
    duration: prefersReduced ? 0.01 : 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Silky exponential ease-out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: !prefersReduced,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.6,
    infinite: false,
    ...options
  });

  // 1. Sync Lenis scroll updates directly into GSAP ScrollTrigger
  lenisInstance.on('scroll', (e) => {
    ScrollTrigger.update();
    scrollListeners.forEach(fn => fn(e));
  });

  // 2. Lock Lenis rendering cycle to GSAP Ticker for zero-lag frame alignment
  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  // Prevent time drift / frame warping between Lenis and GSAP
  gsap.ticker.lagSmoothing(0);

  // 3. High-velocity scroll decoupling (removes hover layout thrashing while scrolling fast)
  let scrollTimeout;
  lenisInstance.on('scroll', () => {
    if (!document.body.classList.contains('is-scrolling')) {
      document.body.classList.add('is-scrolling');
    }
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      document.body.classList.remove('is-scrolling');
    }, 140);
  });

  // 4. Smooth Anchor Link Navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        lenisInstance.scrollTo(targetEl, {
          offset: -20,
          duration: prefersReduced ? 0.01 : 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    });
  });

  // Expose on window for telemetry/dev debugging
  window.__lenis = lenisInstance;

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

export function stopScroll() {
  if (lenisInstance) {
    lenisInstance.stop();
  }
}

export function startScroll() {
  if (lenisInstance) {
    lenisInstance.start();
  }
}

export function scrollToTarget(target, opts = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset: -20,
      duration: 1.2,
      ...opts
    });
  } else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}

export function onSmoothScroll(callback) {
  if (typeof callback === 'function') {
    scrollListeners.push(callback);
    return () => {
      scrollListeners = scrollListeners.filter(fn => fn !== callback);
    };
  }
}
