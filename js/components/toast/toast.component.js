/** @typedef {'success' | 'error' | 'warning' | 'info'} ToastVariant */

/**
 * @typedef {Object} ToastConfig
 * @property {string} bg     - Background color
 * @property {string} border - Border and icon color
 * @property {string} text   - Main text color
 * @property {string} muted  - Secondary text color
 * @property {string} icon   - Material icon name
 */

import {toastTemplate} from "./toast.template.js";

/** @type {Record<ToastVariant, ToastConfig>} */
const TOAST_VARIANTS = {
  success: {bg: '#1a2e1a', border: '#16a34a', text: '#fff', muted: '#86efac', icon: 'check_circle'},
  error: {bg: '#2e1a1a', border: '#dc2626', text: '#fff', muted: '#fca5a5', icon: 'cancel'      },
  warning: {bg: '#2e251a', border: '#d97706', text: '#fff', muted: '#fcd34d', icon: 'warning'     },
  info: {bg: '#1a1e2e', border: '#2563eb', text: '#fff', muted: '#93c5fd', icon: 'info'        },
};

/**
 * Displays a toast notification.
 *
 * @param {string}       message          - Main notification text
 * @param {ToastVariant} [variant='info'] - Visual style variant
 * @param {string}       [title='']      - Optional bold title
 * @returns {void}
 */
export function showToast(message, variant = 'info', title = '', duration = 3000) {
  document.getElementById('toast')?.remove();

  const v = TOAST_VARIANTS[variant] ?? TOAST_VARIANTS.info;

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = toastTemplate(v, message, title, duration);

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '12px',
    right: '12px',
    background: v.bg,
    border: `1px solid ${v.border}33`,
    borderRadius: '10px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
    zIndex: '9999',
    opacity: '0',
    transform: 'translateY(16px)',
    transition: 'opacity 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
    overflow: 'hidden',
    minWidth: '280px',
    maxWidth: '360px',
    fontFamily: 'Inter, sans-serif',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  const dismiss = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
    setTimeout(() => toast?.remove(), 300);
  };

  const timer = setTimeout(dismiss, duration);

  // No inline onclick - addEventListener keeps module scope clean
  toast.querySelector('.toast-close').addEventListener('click', () => {
    clearTimeout(timer);
    dismiss();
  });
}
