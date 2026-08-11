(function() {
  const LEGACY_KEY = 'usuariosDaliMedicaSesion';
  const NEW_KEY = 'dm_sesion';

  function getSession() {
    try {
      const raw = localStorage.getItem(NEW_KEY) || localStorage.getItem(LEGACY_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function setSession(session) {
    try {
      localStorage.setItem(NEW_KEY, JSON.stringify(session));
      // Mantener legacy por compatibilidad con scripts antiguos
      localStorage.setItem(LEGACY_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('No se pudo guardar la sesión:', e);
    }
  }

  function clearSession() {
    localStorage.removeItem(NEW_KEY);
    localStorage.removeItem(LEGACY_KEY);
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
    // Render a consistent header structure (logo + nav) across all pages
    const session = getSession();
    const isPrivate = window.location.pathname.includes('/pagina privada/') || window.location.pathname.includes('/pagina%20privada/');

    header.innerHTML = `
      <div class="logo">dali medica<span class="logo-dot"></span></div>
      <nav>
        <ul id="siteNav"></ul>
      </nav>
    `;

    const navList = header.querySelector('#siteNav');

    // Build list depending on context
    const publicLinks = [
      { href: isPrivate ? '../pagina publica/index.html' : 'index.html', label: 'Inicio' },
      { href: isPrivate ? '../pagina publica/productos.html' : 'productos.html', label: 'Productos' },
      { href: isPrivate ? '../pagina publica/nosotros.html' : 'nosotros.html', label: 'Nosotros' },
      { href: isPrivate ? '../pagina publica/contactos.html' : 'contactos.html', label: 'Contactos' }
    ];

    publicLinks.forEach(l => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${l.href}">${l.label}</a>`;
      navList.appendChild(li);
    });

    // Add dashboard link for employees and admins on public pages
    if (!isPrivate && session && (session.rol === 'admin' || session.rol === 'empleado')) {
      const liDash = document.createElement('li');
      liDash.innerHTML = '<a href="../pagina privada/dashboard.html">Dashboard</a>';
      navList.appendChild(liDash);
    }

    // Add login/logout
    if (session) {
      const liLogout = document.createElement('li');
      liLogout.innerHTML = '<a id="logout" href="#logout">Cerrar sesión</a>';
      navList.appendChild(liLogout);

      // session badge next to logo
      const badge = document.createElement('span');
      badge.className = 'session-badge';
      badge.textContent = `Hola, ${session.nombre}`;
      header.querySelector('.logo').after(badge);
    } else {
      const liLogin = document.createElement('li');
      liLogin.innerHTML = `<a href="${isPrivate ? '../pagina publica/login.html' : 'login.html'}">Iniciar sesión</a>`;
      navList.appendChild(liLogin);
    }

    // Make logo clickable to public home
    const logo = header.querySelector('.logo');
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', function() {
      window.location.href = isPrivate ? '../pagina publica/index.html' : 'index.html';
    });
  }

  function attachLogout() {
    const logoutLink = document.getElementById('logout');
    if (!logoutLink) return;

    logoutLink.addEventListener('click', function(event) {
      event.preventDefault();
      clearSession();
      // Redirigir a la página pública principal desde donde estemos
      const isPrivate = window.location.pathname.includes('/pagina privada/') || window.location.pathname.includes('/pagina%20privada/');
      window.location.href = isPrivate ? '../pagina publica/index.html' : 'index.html';
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    renderHeader();
    attachLogout();
  });
})();

// ===== UI: Modal Confirm / Alert =====
(function() {
  const tpl = `
    <div id="uiModalOverlay" style="display:none;position:fixed;inset:0;background:rgba(2,6,23,0.6);backdrop-filter:blur(4px);z-index:99999;align-items:center;justify-content:center;">
      <div id="uiModal" style="max-width:520px;width:90%;background:var(--admin-card);border-radius:12px;padding:20px;border:1px solid rgba(255,255,255,0.04);box-shadow:0 10px 30px rgba(0,0,0,0.6);color:var(--admin-text);">
        <div id="uiModalMsg" style="margin-bottom:18px;color:var(--admin-text-muted)"></div>
        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <button id="uiCancelBtn" style="padding:8px 12px;border-radius:8px;background:transparent;border:1px solid rgba(255,255,255,0.06);color:var(--admin-text);">Cancelar</button>
          <button id="uiOkBtn" style="padding:8px 12px;border-radius:8px;background:linear-gradient(135deg,#00b4ff,#0090d6);border:none;color:#021020;font-weight:700;">Aceptar</button>
        </div>
      </div>
    </div>
  `;

  document.addEventListener('DOMContentLoaded', () => {
    const div = document.createElement('div');
    div.innerHTML = tpl;
    document.body.appendChild(div.firstElementChild);
  });

  function ensureElements() {
    const overlay = document.getElementById('uiModalOverlay');
    const msg = document.getElementById('uiModalMsg');
    const ok = document.getElementById('uiOkBtn');
    const cancel = document.getElementById('uiCancelBtn');
    return { overlay, msg, ok, cancel };
  }

  window.showConfirm = function(message) {
    return new Promise((resolve) => {
      const { overlay, msg, ok, cancel } = ensureElements();
      if (!overlay) return resolve(false);
      msg.textContent = message;
      overlay.style.display = 'flex';

      function cleanup() {
        overlay.style.display = 'none';
        ok.removeEventListener('click', onOk);
        cancel.removeEventListener('click', onCancel);
      }

      function onOk() { cleanup(); resolve(true); }
      function onCancel() { cleanup(); resolve(false); }

      ok.addEventListener('click', onOk);
      cancel.addEventListener('click', onCancel);
    });
  };

  window.showAlert = function(message) {
    return new Promise((resolve) => {
      const { overlay, msg, ok } = ensureElements();
      if (!overlay) return resolve();
      msg.textContent = message;
      const cancel = document.getElementById('uiCancelBtn');
      cancel.style.display = 'none';
      overlay.style.display = 'flex';

      function cleanup() {
        overlay.style.display = 'none';
        ok.removeEventListener('click', onOk);
        cancel.style.display = '';
      }
      function onOk() { cleanup(); resolve(); }
      ok.addEventListener('click', onOk);
    });
  };
})();