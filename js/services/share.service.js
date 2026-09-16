const DEV_WHATSAPP_NUMBER = '5547997365756';
const FEEDBACK_TEXT = 'Oi Alex! Testei o Currículo Fácil (https://curriculo.facil.cc) e quero deixar um feedback:\n\n';

/**
 * Opens WhatsApp with the developer's own number, pre-filled with an intro
 * text so the user only has to write their opinion and hit send.
 *
 * @returns {void}
 */
export function initFeedbackShare() {
  document.getElementById('feedback-share-btn')?.addEventListener('click', () => {
    window.open(`https://wa.me/${DEV_WHATSAPP_NUMBER}?text=${encodeURIComponent(FEEDBACK_TEXT)}`, '_blank', 'noopener');
  });
}
