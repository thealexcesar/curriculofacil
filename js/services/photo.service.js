/**
 * Optional résumé photo. Read locally as a base64 data URL and stored in
 * localStorage with the rest of the resume - no upload, no server, same
 * privacy guarantee as every other field in the app.
 *
 * Kept small on purpose (downscaled before storing): localStorage caps out
 * around 5MB per origin, and a modern phone photo alone can blow past that
 * and break saving for everything else.
 */

import {t} from './i18n.js';
import {showToast} from '../components/toast/toast.component.js';

const MAX_DIMENSION_PX = 400;
const JPEG_QUALITY = 0.8;
const MAX_INPUT_BYTES = 10 * 1024 * 1024;

/** @type {string} */
let currentPhoto = '';

/** @returns {string} */
export function getPhoto() {
  return currentPhoto;
}

/**
 * @param {string} dataUrl
 * @returns {void}
 */
export function setPhoto(dataUrl) {
  currentPhoto = dataUrl ?? '';
  renderPhotoState();
}

/** @returns {void} */
export function initPhotoUpload() {
  const input = /** @type {HTMLInputElement} */ (document.getElementById('photo-input'));
  const chooseBtn = document.getElementById('photo-choose');
  const removeBtn = document.getElementById('photo-remove');
  if (!input || !chooseBtn || !removeBtn) return;

  chooseBtn.addEventListener('click', () => input.click());

  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > MAX_INPUT_BYTES) {
      showToast(t('photo.tooLarge'), 'error');
      input.value = '';
      return;
    }

    try {
      setPhoto(await downscaleToDataUrl(file));
      document.dispatchEvent(new Event('input', { bubbles: true }));
    } catch {
      showToast(t('photo.error'), 'error');
    } finally {
      // Clear so picking the same file again still fires a change event.
      input.value = '';
    }
  });

  removeBtn.addEventListener('click', () => {
    setPhoto('');
    document.dispatchEvent(new Event('input', { bubbles: true }));
  });

  renderPhotoState();
}

/** @returns {void} */
function renderPhotoState() {
  const preview = /** @type {HTMLImageElement} */ (document.getElementById('photo-preview'));
  const removeBtn = document.getElementById('photo-remove');
  const chooseLabel = document.getElementById('photo-choose-label');
  const empty = document.getElementById('photo-empty');
  if (!preview || !removeBtn || !chooseLabel || !empty) return;

  preview.src = currentPhoto;
  preview.hidden = !currentPhoto;
  empty.hidden = Boolean(currentPhoto);
  removeBtn.hidden = !currentPhoto;
  chooseLabel.textContent = currentPhoto ? t('photo.change') : t('photo.choose');
}

/**
 * Scales the image down so its longest side is MAX_DIMENSION_PX, keeping
 * aspect ratio, and re-encodes as JPEG.
 *
 * @param {File} file
 * @returns {Promise<string>} data URL
 */
async function downscaleToDataUrl(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION_PX / Math.max(bitmap.width, bitmap.height));

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}
