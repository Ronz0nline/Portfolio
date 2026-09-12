/**
 * CLICK SPARKLE
 * Inspired by React Bits Click Sparkle effect (https://reactbits.dev/animations/click-sparkle)
 * 
 * Spawns an ethereal burst of rotating 4-point star sparkles radiating
 * outward from click coordinates, matching the portfolio's bespoke palette.
 */

export function initClickSparkle() {
  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Create persistent full-screen canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'click-sparkle-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:10003;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const onResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', onResize, { passive: true });

  // Curated theme palette for sparkles
  const colors = [
    '#C8A882', // Antique Gold
    '#B76545', // Warm Clay
    '#D4A270', // Amber Bronze
    '#E8E3D9', // Soft Bone
    '#FFF8EF', // Bright Starlight
  ];

  const sparkles = [];
  let rafId = null;

  function spawnSparkles(originX, originY) {
    const count = 9 + Math.floor(Math.random() * 4); // 9-12 sparkles

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.2 + Math.random() * 4.2;
      const size = 4 + Math.random() * 6.5;

      sparkles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: size,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.22,
        life: 1.0,
        decay: 0.024 + Math.random() * 0.016, // ~500-700ms duration
      });
    }

    if (!rafId) {
      rafId = requestAnimationFrame(render);
    }
  }

  function drawFourPointStar(ctx, x, y, size, rotation, color, alpha) {
    if (size <= 0.1 || alpha <= 0.01) return;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Draw 4-point star curve
    const s = size;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(0, 0, s, 0);
    ctx.quadraticCurveTo(0, 0, 0, s);
    ctx.quadraticCurveTo(0, 0, -s, 0);
    ctx.quadraticCurveTo(0, 0, 0, -s);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const p = sparkles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94; // atmospheric drag
      p.vy *= 0.94;
      p.vy += 0.03; // faint gravity drift
      p.rotation += p.vRot;
      p.life -= p.decay;

      if (p.life <= 0) {
        sparkles.splice(i, 1);
        continue;
      }

      // Parabolic twinkle scale: scale up quickly, then shrink
      const scaleProg = Math.sin(p.life * Math.PI);
      const currentSize = p.size * (0.3 + 0.7 * scaleProg);
      const currentAlpha = Math.min(1, p.life * 1.25);

      drawFourPointStar(ctx, p.x, p.y, currentSize, p.rotation, p.color, currentAlpha);
    }

    if (sparkles.length > 0) {
      rafId = requestAnimationFrame(render);
    } else {
      rafId = null;
      ctx.clearRect(0, 0, width, height);
    }
  }

  const onPointerDown = (e) => {
    // Ignore right clicks
    if (e.button !== 0 && e.button !== undefined) return;
    spawnSparkles(e.clientX, e.clientY);
  };

  window.addEventListener('pointerdown', onPointerDown, { passive: true });

  return () => {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointerdown', onPointerDown);
    if (rafId) cancelAnimationFrame(rafId);
    canvas.remove();
  };
}
