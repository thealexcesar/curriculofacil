/**
 * Step 2 — Professional profile with char counter
 */

const PROFILE_MAX_CHARS = 400;

function initStep2Profile() {
  const textarea = document.getElementById('profile');
  const counter  = document.getElementById('profile-count');
  const hint     = document.getElementById('profile-hint');

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    counter.textContent = len;

    if (len > PROFILE_MAX_CHARS) {
      counter.parentElement.classList.add('over');
      hint.innerHTML  = '<span class="material-symbols-outlined">error</span> Limite de 400 caracteres atingido';
      hint.className  = 'field-hint error';
      textarea.value  = textarea.value.slice(0, PROFILE_MAX_CHARS);
      counter.textContent = PROFILE_MAX_CHARS;
    } else {
      counter.parentElement.classList.remove('over');
      hint.innerHTML = '';
      hint.className = 'field-hint';
    }
  });
}
