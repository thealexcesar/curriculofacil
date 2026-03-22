const TOAST_DURATION = 4000;

const TOAST_VARIANTS = {
  success: { bg: '#1a2e1a', border: '#16a34a', text: '#fff', muted: '#86efac', icon: 'check_circle' },
  error:   { bg: '#2e1a1a', border: '#dc2626', text: '#fff', muted: '#fca5a5', icon: 'cancel'        },
  warning: { bg: '#2e251a', border: '#d97706', text: '#fff', muted: '#fcd34d', icon: 'warning'       },
  info:    { bg: '#1a1e2e', border: '#2563eb', text: '#fff', muted: '#93c5fd', icon: 'info'          }
};

function showToast(message, variant = 'info', title = '') {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const v = TOAST_VARIANTS[variant] ?? TOAST_VARIANTS.info;

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <div class="toast-inner">
      <span class="material-symbols-outlined toast-icon" style="color:${v.border}">${v.icon}</span>
      <div class="toast-body">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message" style="color:${title ? v.muted : '#fff'}">${message}</div>
      </div>
      <button class="toast-close" onclick="document.getElementById('toast').remove()" title="Fechar">
        <span class="material-symbols-outlined" style="font-size:18px">close</span>
      </button>
    </div>
    <div class="toast-progress">
      <div class="toast-progress-bar" style="background:${v.border};animation-duration:${TOAST_DURATION}ms"></div>
    </div>
  `;

  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '12px',
    right:        '12px',
    background:   v.bg,
    border:       `1px solid ${v.border}33`,
    borderRadius: '10px',
    boxShadow:    '0 8px 32px rgba(0,0,0,0.35)',
    zIndex:       '9999',
    opacity:      '0',
    transform:    'translateY(16px)',
    transition:   'opacity 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
    overflow:     'hidden',
    minWidth:     '280px',
    maxWidth:     '360px',
    fontFamily:   'Inter, sans-serif'
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  const timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
    setTimeout(() => toast?.remove(), 300);
  }, TOAST_DURATION);

  toast.querySelector('.toast-close').onclick = () => {
    clearTimeout(timer);
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
    setTimeout(() => toast?.remove(), 300);
  };
}