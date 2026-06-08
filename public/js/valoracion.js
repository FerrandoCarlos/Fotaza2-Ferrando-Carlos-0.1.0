/**
 * @fileoverview Manejo de estrellas de valoración.
 */
const estrellas = document.querySelectorAll('.estrella-input');
const labels = document.querySelectorAll('.estrella-label');

estrellas.forEach((input, index) => {
  input.addEventListener('change', () => {
    labels.forEach((label, i) => {
      if (i < index + 1) {
        label.classList.add('text-amber-400');
        label.classList.remove('text-zinc-600');
      } else {
        label.classList.remove('text-amber-400');
        label.classList.add('text-zinc-600');
      }
    });
  });
});
