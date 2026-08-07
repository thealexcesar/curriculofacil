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
      <svg class="icon toast-icon" aria-hidden="true" style="color:${v.border}"><use href="#icon-${v.icon}"></use></svg>
      <div class="toast-body">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message" style="color:${title ? v.muted : v.text}">${message}</div>
      </div>
      <button class="toast-close" title="${t('btn.remove')}" aria-label="${t('toast.close.aria')}">
        <svg class="icon" aria-hidden="true" style="width:18px;height:18px"><use href="#icon-close"></use></svg>
      </button>
    </div>
    <div class="toast-progress">
      <div class="toast-progress-bar" style="background:${v.border};animation-duration:${duration}ms"></div>
    </div>
  `;
}
