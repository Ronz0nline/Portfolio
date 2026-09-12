/**
 * GLOW CURSOR
 * Inspired by React Bits & modern interactive web experiences.
 * 
 * Features:
 * - Fluid dual-stage lerp tracking (precise dot + floating ring + ambient glow halo)
 * - Matching color theme: #B76545 (Clay), #C8A882 (Gold), and #7F4636 (Terracotta)
 * - Dynamic interactive hover states (expands on buttons, links, interactive cards)
 * - Click spring compression feedback
 * - Strict touch/mobile deactivation & reduced motion respect
 */

export function initGlowCursor() {
  // Disable on touch devices or fine pointer absence
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return;
  }

  // Disable on reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Build cursor DOM elements
  const cursorRoot = document.createElement('div');
  cursorRoot.id = 'glow-cursor-root';
  cursorRoot.className = 'glow-cursor-root';
  cursorRoot.setAttribute('aria-hidden', 'true');

  const halo = document.createElement('div');
  halo.className = 'glow-cursor-halo';

  const ring = document.createElement('div');
  ring.className = 'glow-cursor-ring';

  const dot = document.createElement('div');
  dot.className = 'glow-cursor-dot';

  cursorRoot.appendChild(halo);
  cursorRoot.appendChild(ring);
  cursorRoot.appendChild(dot);
  document.body.appendChild(cursorRoot);

  // Position state
  let mouseX = -100;
  let mouseY = -100;

  let dotX = -100;
  let dotY = -100;

  let ringX = -100;
  let ringY = -100;

  let haloX = -100;
  let haloY = -100;

  let isHovered = false;
  let isPressed = false;
  let isVisible = false;

  let rafId = null;

  // Mouse event listeners
  const onMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      cursorRoot.classList.add('is-visible');
      dotX = ringX = haloX = mouseX;
      dotY = ringY = haloY = mouseY;
    }
  };

  const onMouseDown = () => {
    isPressed = true;
    cursorRoot.classList.add('is-pressed');
  };

  const onMouseUp = () => {
    isPressed = false;
    cursorRoot.classList.remove('is-pressed');
  };

  const onMouseLeave = () => {
    isVisible = false;
    cursorRoot.classList.remove('is-visible');
  };

  const onMouseEnter = () => {
    isVisible = true;
    cursorRoot.classList.add('is-visible');
  };

  // Interactive element hover detection via event delegation
  const interactiveSelectors = 'a, button, input, textarea, select, [role="button"], .ch-dot, [data-glow-hover]';

  const onPointerOver = (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target) {
      isHovered = true;
      cursorRoot.classList.add('is-hovered');
    }
  };

  const onPointerOut = (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target) {
      isHovered = false;
      cursorRoot.classList.remove('is-hovered');
    }
  };

  // Animation Loop with fluid dual-stage Lerp
  const render = () => {
    if (isVisible) {
      // Dot follows immediately with tight interpolation
      dotX += (mouseX - dotX) * 0.55;
      dotY += (mouseY - dotY) * 0.55;

      // Ring follows with fluid spring lag
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      // Halo floats with smooth ambient lag
      haloX += (mouseX - haloX) * 0.09;
      haloY += (mouseY - haloY) * 0.09;

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      halo.style.transform = `translate3d(${haloX}px, ${haloY}px, 0)`;
    }

    rafId = requestAnimationFrame(render);
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('mousedown', onMouseDown, { passive: true });
  window.addEventListener('mouseup', onMouseUp, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave);
  document.addEventListener('mouseenter', onMouseEnter);
  document.addEventListener('mouseover', onPointerOver, { passive: true });
  document.addEventListener('mouseout', onPointerOut, { passive: true });

  rafId = requestAnimationFrame(render);

  return () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mouseleave', onMouseLeave);
    document.removeEventListener('mouseenter', onMouseEnter);
    document.removeEventListener('mouseover', onPointerOver);
    document.removeEventListener('mouseout', onPointerOut);
    if (rafId) cancelAnimationFrame(rafId);
    cursorRoot.remove();
  };
}
