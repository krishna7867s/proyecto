(function() {
  const SESION_KEY = 'usuariosDaliMedicaSesion';

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESION_KEY));
    } catch (error) {
      return null;
    }
  }

  function setSession(session) {
    localStorage.setItem(SESION_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(SESION_KEY);
  }

  function buildNav(session) {
    const links = [
      { href: 'index.html', label: 'Inicio' },
      { href: 'productos.html', label: 'Productos' }
    ];

    if (session && session.rol === 'admin') {
      links.push({ href: '../pagina privada/dashboard.html', label: 'Dashboard' });
      links.push({ href: '#logout', label: 'Cerrar sesión', isLogout: true });
    } else if (session) {
      links.push({ href: '#logout', label: 'Cerrar sesión', isLogout: true });
    } else {
      links.push({ href: 'login.html', label: 'Iniciar sesión' });
    }

    return links;
  }

  function renderHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    const logo = header.querySelector('.logo');
    const navList = header.querySelector('nav ul');

    if (!navList || !logo) return;
    const session = getSession();
    const links = buildNav(session);

    navList.innerHTML = links.map(link => {
      if (link.isLogout) {
        return `<li><a id="logoutLink" href="${link.href}">${link.label}</a></li>`;
      }
      return `<li><a href="${link.href}">${link.label}</a></li>`;
    }).join('');

    if (session && session.nombre) {
      let badge = header.querySelector('.session-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'session-badge';
        logo.parentNode.insertBefore(badge, logo.nextSibling);
      }
      badge.textContent = `Hola, ${session.nombre}`;
    } else {
      const badge = header.querySelector('.session-badge');
      if (badge) badge.remove();
    }

    if (session && session.rol === 'admin') {
      logo.textContent = 'dali medica •';
    } else {
      logo.textContent = 'dali medica';
    }
  }

  function attachLogout() {
    const logoutLink = document.getElementById('logoutLink');
    if (!logoutLink) return;

    logoutLink.addEventListener('click', function(event) {
      event.preventDefault();
      clearSession();
      window.location.href = 'index.html';
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    renderHeader();
    attachLogout();
  });
})();