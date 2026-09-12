/**
 * BLUR TEXT EFFECT
 * Inspired by React Bits (https://reactbits.dev/text-animations/blur-text)
 * 
 * Splits target typography into individual words and animates them sequentially
 * from an atmospheric gaussian blur + vertical offset to crystal-clear sharpness.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initBlurText(selector = '[data-blur-text]', options = {}) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  elements.forEach((el) => {
    const rawText = el.textContent.trim();
    if (!rawText) return;

    // Split text into words while preserving spaces
    const words = rawText.split(/\s+/);
    el.innerHTML = '';
    el.classList.add('blur-text-container');

    const wordSpans = words.map((word, i) => {
      const span = document.createElement('span');
      span.className = 'blur-text-word inline-block';
      span.textContent = word;

      el.appendChild(span);

      // Add trailing space between words (except last word)
      if (i < words.length - 1) {
        const space = document.createTextNode('\u00A0');
        el.appendChild(space);
      }

      return span;
    });

    if (prefersReduced) {
      // Instant reveal on reduced motion
      gsap.set(wordSpans, { opacity: 1, filter: 'none', y: 0 });
      return;
    }

    // Set initial blurred & offset state
    gsap.set(wordSpans, {
      opacity: 0,
      filter: 'blur(16px)',
      y: 20,
      willChange: 'filter, opacity, transform',
    });

    const duration = options.duration || 0.85;
    const stagger = options.stagger || 0.12;

    // Build timeline
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        // Clear will-change to release GPU memory after animation finishes
        wordSpans.forEach(span => {
          span.style.willChange = 'auto';
        });
      }
    });

    tl.to(wordSpans, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      duration: duration,
      stagger: stagger,
      ease: 'power3.out',
    });

    el.__blurTimeline = tl;
    el.__playBlurAnimation = () => tl.play(0);

    // ScrollTrigger to play when entering view
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => tl.play(),
    });

    // If autoPlay requested or already in view, trigger play
    if (options.autoPlay) {
      tl.play();
    }
  });

  // Refresh ScrollTrigger after DOM text wrapping
  ScrollTrigger.refresh();
}

export function triggerBlurText(selector = '#ch00 [data-blur-text]') {
  document.querySelectorAll(selector).forEach(el => {
    if (el.__playBlurAnimation) {
      el.__playBlurAnimation();
    }
  });
}

