/**
 * Contact Transmission Form Handler
 */

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const feedback = document.getElementById('form-feedback');

  if (!form || !submitBtn || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('sender-name')?.value.trim();
    const email = document.getElementById('sender-email')?.value.trim();
    const topic = document.getElementById('sender-topic')?.value;
    const msg = document.getElementById('sender-msg')?.value.trim();

    if (!name || !email || !msg) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="inline-block animate-pulse">TRANSMITTING SIGNAL...</span>
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Signal Transmitted ✓`;
      submitBtn.classList.add('bg-stone', 'cursor-default');

      feedback.classList.remove('hidden');
      feedback.innerHTML = `
        <div class="flex items-start gap-3">
          <span class="text-clay font-bold text-sm">✓</span>
          <div class="space-y-1">
            <div class="font-medium text-on-surface">Transmission Acknowledged</div>
            <p class="text-stone text-[11px] leading-relaxed font-sans">
              Thank you, ${name}. Your message regarding "${topic}" has been logged. Rohan will review and reply to ${email}.
            </p>
          </div>
        </div>
      `;

      form.reset();
    }, 600);
  });
}
