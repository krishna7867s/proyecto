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

  function clearSession() {
    localStorage.removeItem(NEW_KEY);
    localStorage.removeItem(LEGACY_KEY);
  }

  // =====================================================
  // MENÚ DESPLEGABLE DE SERVICIOS
  // =====================================================

  function addServicesMenu(navList, isPrivate) {
    const li = document.createElement('li');
    li.className = 'services-menu';

    li.innerHTML = `
      <button
        type="button"
        class="services-menu-btn"
        aria-expanded="false"
      >
        <span>Servicios</span>
        <span class="services-arrow">▾</span>
      </button>

      <div class="services-dropdown">
        <div class="services-dropdown-title">
          🏥 Servicios de Dali Medica
        </div>

        <a class="service-item" href="${isPrivate ? '../pagina publica/productos.html' : 'productos.html'}">
          <span class="service-icon">🔧</span>
          <span class="service-content">
            <strong>Mantenimiento de Equipos</strong>
            <small>Revisión preventiva y correctiva de equipos médicos: monitores, ventiladores, bombas de infusión y más.</small>
          </span>
        </a>

        <a class="service-item" href="${isPrivate ? '../pagina publica/contactos.html' : 'contactos.html'}">
          <span class="service-icon">🩺</span>
          <span class="service-content">
            <strong>Calibración de Dispositivos</strong>
            <small>Ajuste y certificación de equipos de diagnóstico: tensiómetros, glucómetros, oxímetros y electrocardiógrafos.</small>
          </span>
        </a>

        <a class="service-item" href="${isPrivate ? '../pagina publica/contactos.html' : 'contactos.html'}">
          <span class="service-icon">🚑</span>
          <span class="service-content">
            <strong>Instalación de Equipos</strong>
            <small>Puesta en marcha de equipos nuevos con capacitación al personal clínico y pruebas de funcionamiento.</small>
          </span>
        </a>

        <a class="service-item" href="${isPrivate ? '../pagina publica/productos.html' : 'productos.html'}">
          <span class="service-icon">📦</span>
          <span class="service-content">
            <strong>Gestión de Insumos</strong>
            <small>Control de inventario de insumos desechables: guantes, jeringas, catéteres y materiales de curación.</small>
          </span>
        </a>

        <a class="service-item" href="${isPrivate ? '../pagina publica/productos.html' : 'productos.html'}">
          <span class="service-icon">💊</span>
          <span class="service-content">
            <strong>Distribución de Medicamentos</strong>
            <small>Entrega controlada de medicamentos con cadena de frío y trazabilidad por lote y fecha de vencimiento.</small>
          </span>
        </a>

        <a class="service-item" href="${isPrivate ? '../pagina publica/contactos.html' : 'contactos.html'}">
          <span class="service-icon">🛡️</span>
          <span class="service-content">
            <strong>Soporte Técnico Especializado</strong>
            <small>Atención de averías en equipos de imagen: ultrasonido, rayos X y endoscopios con respaldo de fábrica.</small>
          </span>
        </a>

        <a class="service-item" href="${isPrivate ? '../pagina publica/contactos.html' : 'contactos.html'}">
          <span class="service-icon">📋</span>
          <span class="service-content">
            <strong>Auditoría de Inventario</strong>
            <small>Verificación periódica del stock físico contra registros del sistema para detectar diferencias.</small>
          </span>
        </a>

        <a class="service-item" href="${isPrivate ? '../pagina publica/contactos.html' : 'contactos.html'}">
          <span class="service-icon">🔬</span>
          <span class="service-content">
            <strong>Asesoría en Prótesis</strong>
            <small>Orientación clínica y logística para la selección y entrega de prótesis e implantes ortopédicos.</small>
          </span>
        </a>
      </div>
    `;

    // Inserta Servicios exactamente después de Productos.
    if (navList.children.length >= 2) {
      navList.insertBefore(li, navList.children[2]);
    } else {
      navList.appendChild(li);
    }

    const button = li.querySelector('.services-menu-btn');
    const dropdown = li.querySelector('.services-dropdown');

    button.addEventListener('click', function(event) {
      event.stopPropagation();

      const wasOpen = dropdown.classList.contains('show');

      document.querySelectorAll('.services-dropdown.show').forEach(menu => {
        menu.classList.remove('show');
      });

      document.querySelectorAll('.services-menu-btn.open').forEach(btn => {
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });

      if (!wasOpen) {
        dropdown.classList.add('show');
        button.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });

    dropdown.addEventListener('click', function(event) {
      event.stopPropagation();
    });
  }

  // =====================================================
  // ESTILOS DEL MENÚ DE SERVICIOS
  // =====================================================

  function addServicesStyles() {
    if (document.getElementById('servicesMenuStyles')) return;

    const style = document.createElement('style');
    style.id = 'servicesMenuStyles';

    style.textContent = `
      .services-menu {
        position: relative;
      }

      .services-menu-btn {
        appearance: none;
        -webkit-appearance: none;
        cursor: pointer;
        background: transparent;
        border: none;
        color: var(--admin-text-muted, #cbd5e1);
        font: inherit;
        font-weight: 600;
        font-size: 0.9rem;
        padding: 8px 14px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
      }

      .services-menu-btn:hover,
      .services-menu-btn.open {
        color: var(--admin-text, #ffffff);
        background: rgba(255, 255, 255, 0.05);
      }

      .services-arrow {
        font-size: 0.75rem;
        line-height: 1;
        transition: transform 0.2s ease;
      }

      .services-menu-btn.open .services-arrow {
        transform: rotate(180deg);
      }

      .services-dropdown {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        width: 420px;
        max-width: calc(100vw - 30px);
        max-height: 70vh;
        overflow-y: auto;
        padding: 10px;
        background: var(--admin-card, #0c1424);
        border: 1px solid rgba(0, 199, 253, 0.15);
        border-radius: 12px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-8px);
        transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
        z-index: 99999;
      }

      .services-dropdown.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .services-dropdown-title {
        padding: 8px 10px 12px;
        margin-bottom: 4px;
        color: var(--admin-accent, #00c7fd);
        font-size: 0.9rem;
        font-weight: 700;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }

      .service-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 10px;
        border-radius: 8px;
        text-decoration: none;
        color: inherit;
        transition: background 0.2s ease;
      }

      .service-item:hover {
        background: rgba(0, 199, 253, 0.06);
      }

      .service-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
        line-height: 1.4;
      }

      .service-content {
        display: block;
      }

      .service-content strong {
        display: block;
        color: var(--admin-text, #ffffff);
        font-size: 0.86rem;
        margin-bottom: 3px;
      }

      .service-content small {
        display: block;
        color: var(--admin-text-muted, #9ca3af);
        font-size: 0.78rem;
        line-height: 1.4;
      }

      @media (max-width: 680px) {
        .services-dropdown {
          left: auto;
          right: 0;
          width: 350px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // =====================================================
  // HEADER
  // =====================================================

  function renderHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    const session = getSession();
    const isPrivate =
      window.location.pathname.includes('/pagina privada/') ||
      window.location.pathname.includes('/pagina%20privada/');

    header.innerHTML = `
      <div class="logo">dali medica<span class="logo-dot"></span></div>
      <nav>
        <ul id="siteNav"></ul>
      </nav>
    `;

    const navList = header.querySelector('#siteNav');

    // Orden exacto:
    // Inicio | Productos | Servicios ▾ | Nosotros | Contacto
    const publicLinks = [
      {
        href: isPrivate ? '../pagina publica/index.html' : 'index.html',
        label: 'Inicio'
      },
      {
        href: isPrivate ? '../pagina publica/productos.html' : 'productos.html',
        label: 'Productos'
      },
      {
        href: isPrivate ? '../pagina publica/nosotros.html' : 'nosotros.html',
        label: 'Nosotros'
      },
      {
        href: isPrivate ? '../pagina publica/contactos.html' : 'contactos.html',
        label: 'Contacto'
      }
    ];

    publicLinks.forEach(link => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${link.href}">${link.label}</a>`;
      navList.appendChild(li);
    });

    // Servicios se coloca entre Productos y Nosotros.
    addServicesMenu(navList, isPrivate);

    // Dashboard para empleados y administradores en páginas públicas.
    if (!isPrivate && session && (session.rol === 'admin' || session.rol === 'empleado')) {
      const liDash = document.createElement('li');
      liDash.innerHTML = '<a href="../pagina privada/dashboard.html">Dashboard</a>';
      navList.appendChild(liDash);
    }

    // Login / logout.
    if (session) {
      const liLogout = document.createElement('li');
      liLogout.innerHTML = '<a id="logout" href="#logout">Cerrar sesión</a>';
      navList.appendChild(liLogout);

      const badge = document.createElement('span');
      badge.className = 'session-badge';
      badge.textContent = `Hola, ${session.nombre}`;
      header.querySelector('.logo').after(badge);
    } else {
      const liLogin = document.createElement('li');
      liLogin.innerHTML = `<a href="${isPrivate ? '../pagina publica/login.html' : 'login.html'}">Iniciar sesión</a>`;
      navList.appendChild(liLogin);
    }

    // Logo: volver al inicio público.
    const logo = header.querySelector('.logo');
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', function() {
      window.location.href = isPrivate ? '../pagina publica/index.html' : 'index.html';
    });
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  function attachLogout() {
    const logoutLink = document.getElementById('logout');
    if (!logoutLink) return;

    logoutLink.addEventListener('click', function(event) {
      event.preventDefault();
      clearSession();

      const isPrivate =
        window.location.pathname.includes('/pagina privada/') ||
        window.location.pathname.includes('/pagina%20privada/');

      window.location.href = isPrivate
        ? '../pagina publica/index.html'
        : 'index.html';
    });
  }

  // =====================================================
  // CERRAR MENÚ AL HACER CLIC AFUERA
  // =====================================================

  document.addEventListener('click', function(event) {
    if (event.target.closest('.services-menu')) return;

    document.querySelectorAll('.services-dropdown.show').forEach(menu => {
      menu.classList.remove('show');
    });

    document.querySelectorAll('.services-menu-btn.open').forEach(button => {
      button.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    });
  });

  // =====================================================
  // INICIALIZACIÓN
  // =====================================================

  document.addEventListener('DOMContentLoaded', function() {
    addServicesStyles();
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