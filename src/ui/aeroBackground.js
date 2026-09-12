/**
 * AERO BACKGROUND SHADES
 * Inspired by React Bits & modern atmospheric aero glass aesthetics.
 * 
 * Provides fluid, drifting, organic ambient mesh orbs tailored to the
 * portfolio palette (#B76545 Clay, #7F4636 Terracotta, #C8A882 Warm Gold).
 * Uses GPU-accelerated CSS animations with subtle mouse parallax depth.
 */

export function initAeroBackground() {
  const container = document.getElementById('aero-background');
  if (!container) return;

  // Check reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    container.classList.add('reduced-motion');
    return;
  }

  // Subtle interactive mouse parallax for aero orbs
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafId = null;

  const onMouseMove = (e) => {
    // Normalised -1 to 1 offset from centre
    targetX = (e.clientX / window.innerWidth - 0.5) * 40;
    targetY = (e.clientY / window.innerHeight - 0.5) * 40;
  };

  const updateParallax = () => {
    // Smooth lerp
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;

    container.style.setProperty('--aero-parallax-x', `${currentX.toFixed(2)}px`);
    container.style.setProperty('--aero-parallax-y', `${currentY.toFixed(2)}px`);

    rafId = requestAnimationFrame(updateParallax);
  };

  // Only bind parallax on devices with hover/mouse pointer
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateParallax);
  }

  return () => {
    window.removeEventListener('mousemove', onMouseMove);
    if (rafId) cancelAnimationFrame(rafId);
  };
}
