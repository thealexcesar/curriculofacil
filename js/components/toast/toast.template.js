import {t} from '../../services/i18n.js';

/**
 * @param {import('./toast.component.js').ToastConfig} v
 * @param {string} message
 * @param {string} title
 * @param {number} duration
 * @returns {string}
 */
export function toastTemplate(v, message, title, duration) {
  return `
    <div class="toast-inner">
      <span class="material-symbols-outlined toast-icon" aria-hidden="true" style="color:${v.border}">${v.icon}</span>
      <div class="toast-body">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message" style="color:${title ? v.muted : v.text}">${message}</div>
      </div>
      <button class="toast-close" title="${t('btn.remove')}" aria-label="${t('toast.close.aria')}">
        <span class="material-symbols-outlined" aria-hidden="true" style="font-size:18px">close</span>
      </button>
    </div>
    <div class="toast-progress">
      <div class="toast-progress-bar" style="background:${v.border};animation-duration:${duration}ms"></div>
    </div>
  `;
}
