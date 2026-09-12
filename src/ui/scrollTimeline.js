import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll Timeline & Metamorphic Trigger System
 */

export function initScrollTimeline(threeEngine) {
  const sections = document.querySelectorAll('section[data-chapter]');
  const navHeader = document.getElementById('main-nav-header');
  const hudChId = document.getElementById('hud-chapter-id');
  const hudChTitle = document.getElementById('hud-chapter-title');
  const dots = document.querySelectorAll('.ch-dot');
  const disciplineCards = document.querySelectorAll('.discipline-interactive-card');

  // 1. Initial State: Minimal Navigation is hidden at origin (Chapter 00)
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
          ease: 'power2.out'
        });
      },
      onEnterBack: () => {
        gsap.to(navHeader, {
          opacity: 0,
          y: -12,
          pointerEvents: 'none',
          duration: 0.35,
          ease: 'power2.in'
        });
      }
    });
  }

  // 2. Track each chapter section with ScrollTrigger
  sections.forEach((section) => {
    const chIdx = parseInt(section.getAttribute('data-chapter'), 10);
    const chTitle = section.getAttribute('data-title') || '';

    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter: () => activateChapter(chIdx, chTitle),
      onEnterBack: () => activateChapter(chIdx, chTitle)
    });

    // Subtle entrance reveals for section content
    const animElements = section.querySelectorAll('.reveal-on-scroll');
    if (animElements.length > 0) {
      gsap.fromTo(animElements, 
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  });

  function activateChapter(idx, title) {
    // Update Chapter HUD
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

    // Invoke 3D Metamorphic Sculpture update
    if (threeEngine) {
      threeEngine.setChapter(idx);
    }
  }

  // 3. Discipline Hover Interactions
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

  // 4. Smooth Anchor Link Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
