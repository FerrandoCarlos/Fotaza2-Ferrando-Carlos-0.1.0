/**
 * @fileoverview Toggle del menú hamburguesa para mobile.
 */

const toggle = document.getElementById('navbar-toggle');
const menu = document.getElementById('navbar-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');

toggle.addEventListener('click', () => {
  const isOpen = !menu.classList.contains('hidden');
  if (isOpen) {
    menu.classList.add('hidden');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
  } else {
    menu.classList.remove('hidden');
    iconOpen.classList.add('hidden');
    iconClose.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
  }
});
