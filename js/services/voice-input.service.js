/**
 * Voice dictation for long text fields, using the browser's native Web
 * Speech API. There is no server-side or paid transcription involved -
 * this is a no-op (button never appears) on browsers without support,
 * mainly Firefox. Chrome/Edge/Safari support it natively, for free.
 *
 * Note: Chrome's implementation streams audio to a Google server to
 * transcribe it, so recognition also fails (silently, without a
 * permission prompt) when that endpoint is unreachable - e.g. no
 * internet access, or a firewall/proxy blocking it.
 *
 * Also a no-op on iOS/iPadOS, regardless of which browser app is used:
 * Apple requires every iOS browser to run on WebKit under the hood, and
 * WebKit's speech recognition repeatedly fails to reuse a granted mic
 * permission there - a platform bug with no code-level fix.
 */

import {t} from './i18n.js';
import {showToast} from '../components/toast/toast.component.js';

const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition;

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/** Error codes that don't need a toast - purely user-driven, not failures. */
const SILENT_ERRORS = new Set(['aborted']);

/** Error codes meaning the mic itself is inaccessible (permission or hardware). */
const PERMISSION_ERRORS = new Set(['not-allowed', 'service-not-allowed', 'audio-capture']);

/** @type {Record<string, string>} */
const LOCALE_TO_SPEECH_LANG = {
  'pt-BR': 'pt-BR',
  en: 'en-US',
  de: 'de-DE',
};

/**
 * Adds a microphone button to a textarea's field wrapper. Clicking it
 * dictates speech and appends the transcript to the current value.
 *
 * @param {HTMLTextAreaElement|null} textarea
 * @returns {void}
 */
export function attachVoiceInput(textarea) {
  if (!SpeechRecognitionCtor || !textarea || isIOS) return;

  const field = textarea.closest('.field');
  if (!field) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'voice-btn';
  btn.setAttribute('aria-label', t('a11y.voiceInput.aria'));
  btn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-mic"></use></svg>';
  field.appendChild(btn);

  const recognition = new SpeechRecognitionCtor();
  recognition.continuous = false;
  recognition.interimResults = false;

  let listening = false;

  btn.addEventListener('click', () => {
    if (listening) {
      recognition.stop();
      return;
    }
    recognition.lang = LOCALE_TO_SPEECH_LANG[document.documentElement.lang] ?? 'pt-BR';
    try {
      recognition.start();
    } catch (err) {
      console.error('[voice-input] start() threw', err);
      showToast(t('voice.error'), 'error');
    }
  });

  recognition.addEventListener('start', () => {
    listening = true;
    btn.classList.add('is-listening');
  });

  recognition.addEventListener('end', () => {
    listening = false;
    btn.classList.remove('is-listening');
  });

  recognition.addEventListener('error', event => {
    listening = false;
    btn.classList.remove('is-listening');

    console.error('[voice-input] recognition error:', event.error);
    if (SILENT_ERRORS.has(event.error)) return;

    if (event.error === 'no-speech') {
      showToast(t('voice.noSpeech'), 'warning');
      return;
    }

    const message = PERMISSION_ERRORS.has(event.error) ? t('voice.permissionDenied') : t('voice.error');
    showToast(message, 'error');
  });

  recognition.addEventListener('result', event => {
    const transcript = event.results[0][0].transcript;
    const separator = textarea.value.trim() ? ' ' : '';
    textarea.value = textarea.value + separator + transcript;
    textarea.dispatchEvent(new Event('input', {bubbles: true}));
  });
}
