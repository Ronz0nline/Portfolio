/**
 * Mobile Hamburger Menu Controller
 * - Slides in a drawer panel from the right on mobile screens (< md)
 * - Animates hamburger bars → X on open, X → bars on close
 * - Closes on: close button, backdrop click, nav link click, Escape key
 * - Locks body scroll while drawer is open
 * - Syncs the mobile chapter HUD from the desktop HUD spans
 */

export function initMobileMenu() {
  const btn       = document.getElementById('mobile-menu-btn');
  const closeBtn  = document.getElementById('mobile-menu-close');
  const drawer    = document.getElementById('mobile-menu-drawer');
  const backdrop  = document.getElementById('mobile-menu-backdrop');
  const panel     = document.getElementById('mobile-menu-panel');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Burger bar elements for morphing to ×
  const burgerTop    = document.getElementById('burger-top');
  const burgerMid    = document.getElementById('burger-mid');
  const burgerBottom = document.getElementById('burger-bottom');

  if (!btn || !drawer || !backdrop || !panel) return;

  let isOpen = false;

  function open() {
    isOpen = true;
    drawer.classList.remove('pointer-events-none');
    drawer.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');

    // Fade in backdrop
    backdrop.classList.remove('opacity-0');
    backdrop.classList.add('opacity-100');

    // Slide panel in
    panel.classList.remove('translate-x-full');
    panel.classList.add('translate-x-0');

    // Morph hamburger → ×
    if (burgerTop && burgerMid && burgerBottom) {
      burgerTop.style.transform    = 'translateY(6px) rotate(45deg)';
      burgerMid.style.opacity      = '0';
      burgerMid.style.transform    = 'scaleX(0)';
      burgerBottom.style.transform = 'translateY(-6px) rotate(-45deg)';
    }

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Trap focus: move to close button after transition
    setTimeout(() => closeBtn?.focus(), 310);

    // Sync mobile HUD from desktop HUD values
    syncMobileHud();
  }

  function close() {
    isOpen = false;
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');
    panel.classList.add('translate-x-full');
    panel.classList.remove('translate-x-0');
    drawer.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');

    // Revert hamburger → bars
    if (burgerTop && burgerMid && burgerBottom) {
      burgerTop.style.transform    = '';
      burgerMid.style.opacity      = '';
      burgerMid.style.transform    = '';
      burgerBottom.style.transform = '';
    }

    // Restore body scroll
    document.body.style.overflow = '';

    // Return focus to trigger
    setTimeout(() => {
      drawer.classList.add('pointer-events-none');
      btn?.focus();
    }, 310);
  }

  function toggle() {
    isOpen ? close() : open();
  }

  function syncMobileHud() {
    const desktopId    = document.getElementById('hud-chapter-id');
    const desktopTitle = document.getElementById('hud-chapter-title');
    const mobileId     = document.getElementById('hud-chapter-id-mobile');
    const mobileTitle  = document.getElementById('hud-chapter-title-mobile');

    if (desktopId    && mobileId)    mobileId.textContent    = desktopId.textContent;
    if (desktopTitle && mobileTitle) mobileTitle.textContent = desktopTitle.textContent;
  }

  // Keep mobile HUD in sync whenever desktop HUD changes (MutationObserver)
  const desktopId    = document.getElementById('hud-chapter-id');
  const desktopTitle = document.getElementById('hud-chapter-title');
  const observer = new MutationObserver(syncMobileHud);
  if (desktopId)    observer.observe(desktopId,    { childList: true, characterData: true, subtree: true });
  if (desktopTitle) observer.observe(desktopTitle, { childList: true, characterData: true, subtree: true });

  // Event bindings
  btn.addEventListener('click', toggle);
  closeBtn?.addEventListener('click', close);
  backdrop.addEventListener('click', close);

  // Close drawer when a mobile nav link is tapped (smooth scroll handled elsewhere)
  mobileLinks.forEach((link) => link.addEventListener('click', () => {
    if (isOpen) close();
  }));

  // Escape key closes drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });

  // Resize: auto-close drawer if window is widened past md breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && isOpen) close();
  });
}
