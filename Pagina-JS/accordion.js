document.addEventListener('DOMContentLoaded', function () {
  const accordions = document.querySelectorAll('.admin-links');
  accordions.forEach((container, idx) => {
    const toggle = document.createElement('button');
    toggle.className = 'accordion-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.textContent = container.dataset.title || 'Enlaces';

    container.style.overflow = 'hidden';
    container.style.transition = 'max-height 300ms ease';
    container.classList.add('accordion-panel');

    container.parentNode.insertBefore(toggle, container);
    container.style.maxHeight = container.scrollHeight + 'px';

    toggle.addEventListener('click', function () {
      const isOpen = container.classList.toggle('open');
      container.style.maxHeight = isOpen ? container.scrollHeight + 'px' : '0px';
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    if (idx !== 0) {
      container.classList.remove('open');
      container.style.maxHeight = '0px';
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
});
