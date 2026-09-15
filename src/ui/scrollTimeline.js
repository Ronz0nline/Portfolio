import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToTarget } from './smoothScroll.js';

gsap.registerPlugin(ScrollTrigger);

// ── Global ScrollTrigger Engine Optimizations ────────────────────────
ScrollTrigger.config({
  limitCallbacks: true,      // Disregards intermediate callbacks during high-speed scrubbing
  ignoreMobileResize: true,  // Eliminates address-bar height twitching on mobile viewports
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize'
});

ScrollTrigger.defaults({
  fastScrollEnd: true,       // Force tweens to terminal state on rapid scroll sweeps
  preventOverlaps: true      // Prevents overlapping tweens from competing
});

/**
 * Scroll Timeline & Metamorphic Trigger System (Optimized)
 */
export function initScrollTimeline(threeEngine) {
  const sections = document.querySelectorAll('section[data-chapter]');
  const navHeader = document.getElementById('main-nav-header');
  const hudChId = document.getElementById('hud-chapter-id');
  const hudChTitle = document.getElementById('hud-chapter-title');
  const dots = document.querySelectorAll('.ch-dot');
  const disciplineCards = document.querySelectorAll('.discipline-interactive-card');
  const progressBar = document.getElementById('scroll-progress-bar');

  // 1. Top Telemetry Scroll Progress Bar (Scrubbed with zero lag)
  if (progressBar) {
    gsap.set(progressBar, { scaleX: 0, transformOrigin: 'left center' });
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.15,
      }
    });
  }

  // 2. Navigation Header Visibility (Hidden at Origin, Revealed on Narrative Descent)
  if (navHeader) {
    ScrollTrigger.create({
      trigger: '#ch00',
      start: 'top top',
      end: 'bottom 60%',
      onLeave: () => {
        gsap.to(navHeader, {
          opacity: 1,
          y: 0,
          pointerEvents: 'auto',
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      },
      onEnterBack: () => {
        gsap.to(navHeader, {
          opacity: 0,
          y: -12,
          pointerEvents: 'none',
          duration: 0.35,
          ease: 'power2.in',
          overwrite: 'auto'
        });
      }
    });
  }

  // 3. Track each chapter section with optimized ScrollTriggers
  sections.forEach((section) => {
    const chIdx = parseInt(section.getAttribute('data-chapter'), 10);
    const chTitle = section.getAttribute('data-title') || '';

    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      id: `chapter-${chIdx}`,
      onEnter:     () => activateChapter(chIdx, chTitle),
      onEnterBack: () => activateChapter(chIdx, chTitle)
    });
  });

  // 4. Batch-Optimized Content Entrance Reveals (ScrollTrigger.batch)
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if (reveals.length > 0) {
    // Initial hidden state with GPU-composited layers
    gsap.set(reveals, {
      opacity: 0,
      y: 26,
      willChange: 'transform, opacity'
    });

    ScrollTrigger.batch('.reveal-on-scroll', {
      interval: 0.08, // Group elements entering within an 80ms slice
      batchMax: 4,    // Max batch stagger count to keep cadence crisp
      start: 'top 88%',
      once: true,     // Reveal once for seamless portfolio scrollytelling
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.09,
          ease: 'power2.out',
          overwrite: 'auto',
          onComplete: () => {
            // Relieve GPU composition memory once settled
            batch.forEach((el) => {
              el.style.willChange = 'auto';
            });
          }
        });
      }
    });
  }

  function activateChapter(idx, title) {
    // Update Chapter HUD Telemetry
    if (hudChId) {
      hudChId.textContent = idx < 10 ? `0${idx}` : `${idx}`;
    }
    if (hudChTitle) {
      hudChTitle.textContent = title;
    }

    // Update Lateral Indicator Dots
    dots.forEach((dot) => {
      const dotCh = parseInt(dot.getAttribute('data-ch'), 10);
      if (dotCh === idx) {
        dot.className = 'ch-dot block w-2 h-2 rounded-full bg-clay transition-all duration-300';
      } else {
        dot.className = 'ch-dot block w-1 h-1 rounded-full bg-white/20 hover:bg-stone transition-all duration-300';
      }
    });

    // Invoke 3D Metamorphic Sculpture Chapter State
    if (threeEngine) {
      threeEngine.setChapter(idx);
    }
  }

  // 5. Discipline Card Interactive Highlights
  disciplineCards.forEach((card) => {
    const id = parseInt(card.getAttribute('data-discipline-id'), 10);
    card.addEventListener('mouseenter', () => {
      if (threeEngine) threeEngine.highlightDiscipline(id);
    });
    card.addEventListener('mouseleave', () => {
      if (threeEngine) threeEngine.resetDisciplineHighlight();
    });
    card.addEventListener('focus', () => {
      if (threeEngine) threeEngine.highlightDiscipline(id);
    });
    card.addEventListener('blur', () => {
      if (threeEngine) threeEngine.resetDisciplineHighlight();
    });
  });

  // 6. Anchor links routed through smooth scroll controller
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      e.preventDefault();
      scrollToTarget(targetId);
    });
  });

  // Recalibrate all trigger measurements
  ScrollTrigger.refresh();
}
