/**
 * BORDER GLOW (SPOTLIGHT CARDS)
 * Inspired by React Bits Spotlight Card / Glowing Border components.
 * 
 * Tracks pointer movement across cards and sets CSS variables --mouse-x
 * and --mouse-y so a mask-composite radial gradient illuminates the 1px card
 * border and casts an ambient surface glow directly beneath the cursor.
 */

export function initBorderGlow(selector = '.border-glow-card') {
  const cards = document.querySelectorAll(selector);
  if (!cards.length) return;

  const onPointerMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x.toFixed(1)}px`);
    card.style.setProperty('--mouse-y', `${y.toFixed(1)}px`);
  };

  cards.forEach((card) => {
    card.addEventListener('pointermove', onPointerMove, { passive: true });
  });

  return () => {
    cards.forEach((card) => {
      card.removeEventListener('pointermove', onPointerMove);
    });
  };
}
