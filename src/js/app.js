/**
 * App entry point — initializes navigation and preview scaling
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  scaleCvPreview();
  window.addEventListener('resize', scaleCvPreview);
});

function scaleCvPreview() {
  const wrapper = document.querySelector('.cv-preview-wrapper');
  const preview = document.getElementById('cv-preview');
  if (!wrapper || !preview) return;
  const scale = wrapper.clientWidth / 794;
  preview.style.transform = `scale(${scale})`;
  preview.style.transformOrigin = 'top left';
  wrapper.style.height = `${Math.round(1123 * scale)}px`;
}
