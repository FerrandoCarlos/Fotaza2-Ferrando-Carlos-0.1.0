/**
 * @fileoverview Carrusel de imágenes del hero
 */
const carrusel = document.getElementById('carrusel');
const dots = document.querySelectorAll('.carrusel-dot');

if (carrusel && dots.length) {
  let current = 0;

  function goTo(index) {
    current = index;
    carrusel.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('bg-amber-400', i === index);
      d.classList.toggle('bg-zinc-600', i !== index);
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  // Auto avance cada 4 seg
  setInterval(() => {
    goTo((current + 1) % dots.length);
  }, 4000);
  goTo(0);
}
