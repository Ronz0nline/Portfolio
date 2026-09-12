/**
 * CLICK SPARK
 * Direct implementation of React Bits <ClickSpark /> component
 * Source & Specification: https://reactbits.dev/animations/click-sparkle
 * 
 * Renders directional spark lines radiating outward from click coordinates
 * with easing, scaling distance, and line decay.
 */

export function initClickSparkle(options = {}) {
  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const {
    sparkColor = '#ffffff',
    sparkSize = 10,
    sparkRadius = 15,
    sparkCount = 8,
    duration = 400,
    easing = 'ease-out',
    extraScale = 1.0,
  } = options;

  // Create persistent full-screen canvas overlay
  const canvas = document.createElement('canvas');
  canvas.id = 'click-spark-canvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 10003;
    display: block;
    user-select: none;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let sparks = [];
  let animationId = null;

  const easeFunc = (t) => {
    switch (easing) {
      case 'linear':
        return t;
      case 'ease-in':
        return t * t;
      case 'ease-in-out':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      default:
        return t * (2 - t); // 'ease-out'
    }
  };

  const resizeCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const draw = (timestamp) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    sparks = sparks.filter((spark) => {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= duration) {
        return false;
      }

      const progress = elapsed / duration;
      const eased = easeFunc(progress);

      const distance = eased * sparkRadius * extraScale;
      const lineLength = sparkSize * (1 - eased);

      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      ctx.strokeStyle = sparkColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      return true;
    });

    if (sparks.length > 0) {
      animationId = requestAnimationFrame(draw);
    } else {
      animationId = null;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  };

  const handleClick = (e) => {
    // Only trigger on primary left click
    if (e.button !== 0 && e.button !== undefined) return;

    const x = e.clientX;
    const y = e.clientY;
    const now = performance.now();

    const newSparks = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now,
    }));

    sparks.push(...newSparks);

    if (!animationId) {
      animationId = requestAnimationFrame(draw);
    }
  };

  window.addEventListener('pointerdown', handleClick, { passive: true });

  return () => {
    window.removeEventListener('resize', resizeCanvas);
    window.removeEventListener('pointerdown', handleClick);
    if (animationId) cancelAnimationFrame(animationId);
    canvas.remove();
  };
}
