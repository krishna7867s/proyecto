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

        <a
          class="service-item"
          href="${isPrivate ? '../pagina publica/productos.html' : 'productos.html'}"
        >
          <span class="service-icon">🔧</span>

          <span class="service-content">
            <strong>Mantenimiento de Equipos</strong>
            <small>
              Revisión preventiva y correctiva de equipos médicos:
              monitores, ventiladores, bombas de infusión y más.
            </small>
          </span>
        </a>

        <a
          class="service-item"
          href="${isPrivate ? '../pagina publica/contactos.html' : 'contactos.html'}"
        >
          <span class="service-icon">🩺</span>

          <span class="service-content">
            <strong>Calibración de Dispositivos</strong>
            <small>
              Ajuste y certificación de equipos de diagnóstico:
              tensiómetros, glucómetros, oxímetros y electrocardiógrafos.
            </small>
          </span>
        </a>

        <a
          class="service-item"
          href="${isPrivate ? '../pagina publica/contactos.html' : 'contactos.html'}"
        >
          <span class="service-icon">🚑</span>

          <span class="service-content">
            <strong>Instalación de Equipos</strong>
            <small>
              Puesta en marcha de equipos nuevos con capacitación
              al personal clínico y pruebas de funcionamiento.
            </small>
          </span>
        </a>

        <a
          class="service-item"
          href="${isPrivate ? '../pagina publica/productos.html' : 'productos.html'}"
        >
          <span class="service-icon">📦</span>

          <span class="service-content">
            <strong>Gestión de Insumos</strong>
            <small>
              Control de inventario de insumos desechables:
              guantes, jeringas, catéteres y materiales de curación.
            </small>
          </span>
        </a>

        <a
          class="service-item"
          href="${isPrivate ? '../pagina publica/productos.html' : 'productos.html'}"
        >
          <span class="service-icon">💊</span>

          <span class="service-content">
            <strong>Distribución de Medicamentos</strong>
            <small>
              Entrega controlada de medicamentos con cadena de frío
              y trazabilidad por lote y fecha de vencimiento.
            </small>
          </span>
        </a>

        <a
          class="service-item"
          href="${isPrivate ? '../pagina publica/contactos.html' : 'contactos.html'}"
        >
          <span class="service-icon">🛡️</span>

          <span class="service-content">
            <strong>Soporte Técnico Especializado</strong>
            <small>
              Atención de averías en equipos de imagen:
              ultrasonido, rayos X y endoscopios con respaldo de fábrica.
            </small>
          </span>
        </a>

        <a
          class="service-item"
          href="${isPrivate ? '../pagina publica/contactos.html' : 'contactos.html'}"
        >
          <span class="service-icon">📋</span>

          <span class="service-content">
            <strong>Auditoría de Inventario</strong>
            <small>
              Verificación periódica del stock físico contra registros
              del sistema para detectar diferencias.
            </small>
          </span>
        </a>

        <a
          class="service-item"
          href="${isPrivate ? '../pagina publica/contactos.html' : 'contactos.html'}"
        >
          <span class="service-icon">🔬</span>

          <span class="service-content">
            <strong>Asesoría en Prótesis</strong>
            <small>
              Orientación clínica y logística para la selección
              y entrega de prótesis e implantes ortopédicos.
            </small>
          </span>
        </a>

      </div>
    `;

    // =====================================================
    // SERVICIOS DESPUÉS DE PRODUCTOS
    // =====================================================

    if (navList.children.length >= 2) {
      navList.insertBefore(li, navList.children[2]);
    } else {
      navList.appendChild(li);
    }

    const button = li.querySelector('.services-menu-btn');
    const dropdown = li.querySelector('.services-dropdown');

    button.addEventListener('click', function(event) {

      event.stopPropagation();

      const wasOpen =
        dropdown.classList.contains('show');

      document
        .querySelectorAll('.services-dropdown.show')
        .forEach(function(menu) {
          menu.classList.remove('show');
        });

      document
        .querySelectorAll('.services-menu-btn.open')
        .forEach(function(btn) {

          btn.classList.remove('open');

          btn.setAttribute(
            'aria-expanded',
            'false'
          );

        });

      if (!wasOpen) {

        dropdown.classList.add('show');

        button.classList.add('open');

        button.setAttribute(
          'aria-expanded',
          'true'
        );

      }
    });

    dropdown.addEventListener(
      'click',
      function(event) {
        event.stopPropagation();
      }
    );
  }

  // =====================================================
  // ESTILOS DEL MENÚ DE SERVICIOS
  // =====================================================

  function addServicesStyles() {

    if (
      document.getElementById('servicesMenuStyles')
    ) {
      return;
    }

    const style = document.createElement('style');

    style.id = 'servicesMenuStyles';

    style.textContent = `

      header nav ul li.services-menu {
        position: relative !important;
        display: flex !important;
        align-items: center !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      header .services-menu-btn {

        appearance: none !important;
        -webkit-appearance: none !important;

        display: inline-flex !important;

        align-items: center !important;
        justify-content: center !important;

        height: auto !important;
        min-height: 0 !important;

        box-sizing: border-box !important;

        padding: 0.6rem 1.1rem !important;

        margin: 0 !important;

        border:
          1px solid
          rgba(0,199,253,.14) !important;

        border-radius: 8px !important;

        background: transparent !important;

        color: #cbd5e1 !important;

        font: inherit !important;

        font-weight: 600 !important;
        font-size: .9rem !important;

        line-height: normal !important;

        cursor: pointer !important;

        gap: 6px !important;

        white-space: nowrap !important;

        transition: .2s ease !important;
      }

      header .services-menu-btn:hover,
      header .services-menu-btn.open {

        color: #fff !important;

        background:
          rgba(0,199,253,.08) !important;

        border-color:
          rgba(0,199,253,.28) !important;

        box-shadow:
          0 0 14px
          rgba(0,199,253,.12) !important;
      }

      .services-arrow {

        display: inline-block !important;

        font-size: 12px !important;

        line-height: 1 !important;

        transition:
          transform .2s ease !important;
      }

      .services-menu-btn.open .services-arrow {

        transform:
          rotate(180deg) !important;
      }

      header .services-dropdown {

        position: absolute !important;

        top:
          calc(100% + 10px) !important;

        right: 0 !important;
        left: auto !important;

        width: 365px !important;

        max-width:
          calc(100vw - 24px) !important;

        max-height:
          min(
            480px,
            calc(100vh - 90px)
          ) !important;

        overflow-y: auto !important;
        overflow-x: hidden !important;

        padding: 8px !important;

        box-sizing: border-box !important;

        background: #091322 !important;

        border:
          1px solid
          rgba(0,199,253,.18) !important;

        border-radius: 12px !important;

        box-shadow:
          0 18px 45px
          rgba(0,0,0,.5),
          0 0 25px
          rgba(0,199,253,.07) !important;

        opacity: 0 !important;

        visibility: hidden !important;

        transform:
          translateY(-8px) !important;

        transform-origin:
          top right !important;

        transition:
          opacity .18s ease,
          transform .18s ease,
          visibility .18s ease !important;

        z-index: 99999 !important;

        scrollbar-width: thin;

        scrollbar-color:
          rgba(0,199,253,.35)
          transparent;
      }

      header .services-dropdown.show {

        opacity: 1 !important;

        visibility: visible !important;

        transform:
          translateY(0) !important;
      }

      .services-dropdown-title {

        padding:
          9px 10px 11px !important;

        margin-bottom: 3px !important;

        color:
          #00c7fd !important;

        font-size: .78rem !important;

        font-weight: 700 !important;

        border-bottom:
          1px solid
          rgba(255,255,255,.07) !important;
      }

      header .services-dropdown .service-item {

        display: flex !important;

        align-items: center !important;

        width: 100% !important;

        min-height: 54px !important;

        padding: 7px 8px !important;

        margin: 1px 0 !important;

        gap: 10px !important;

        border-radius: 8px !important;

        border:
          1px solid transparent !important;

        text-decoration: none !important;

        box-sizing: border-box !important;

        transition:
          background .16s ease,
          border-color .16s ease,
          transform .16s ease !important;
      }

      header .services-dropdown
      .service-item:hover {

        background:
          rgba(0,199,253,.065) !important;

        border-color:
          rgba(0,199,253,.1) !important;

        transform:
          translateX(2px) !important;
      }

      header .services-dropdown
      .service-icon {

        display: flex !important;

        align-items: center !important;

        justify-content: center !important;

        width: 30px !important;

        min-width: 30px !important;

        height: 30px !important;

        border-radius: 8px !important;

        background:
          rgba(255,255,255,.045) !important;

        font-size: 14px !important;

        line-height: 1 !important;
      }

      header .services-dropdown
      .service-content {

        display: block !important;

        min-width: 0 !important;

        flex: 1 !important;
      }

      header .services-dropdown
      .service-content strong {

        display: block !important;

        color: #f8fafc !important;

        font-size: .72rem !important;

        font-weight: 700 !important;

        line-height: 1.25 !important;

        margin: 0 0 2px !important;
      }

      header .services-dropdown
      .service-content small {

        display: block !important;

        color: #8393a7 !important;

        font-size: .61rem !important;

        line-height: 1.35 !important;

        margin: 0 !important;
      }

      .services-dropdown::-webkit-scrollbar {
        width: 5px;
      }

      .services-dropdown::-webkit-scrollbar-track {
        background: transparent;
      }

      .services-dropdown::-webkit-scrollbar-thumb {

        background:
          rgba(0,199,253,.28);

        border-radius: 10px;
      }

      @media (max-width: 680px) {

        header .services-dropdown {

          width: 350px !important;

          left: auto !important;

          right: 0 !important;

          transform:
            translateY(-8px) !important;
        }

        header .services-dropdown.show {

          transform:
            translateY(0) !important;
        }
      }

      @media (max-width: 420px) {

        header .services-dropdown {

          width:
            calc(100vw - 20px) !important;

          right: -8px !important;
        }
      }

    `;

    document.head.appendChild(style);
  }

  // =====================================================
  // HEADER
  // =====================================================

  function renderHeader() {

    const header =
      document.querySelector('header');

    if (!header) return;

    const session =
      getSession();

    const isPrivate =
      window.location.pathname.includes(
        '/pagina privada/'
      ) ||
      window.location.pathname.includes(
        '/pagina%20privada/'
      );

    header.innerHTML = `

      <div class="logo">
        dali medica
        <span class="logo-dot"></span>
      </div>

      <nav>
        <ul id="siteNav"></ul>
      </nav>

    `;

    const navList =
      header.querySelector('#siteNav');

    // =================================================
    // ORDEN:
    // Inicio | Productos | Servicios | Nosotros | Contacto
    // =================================================

    const publicLinks = [

      {
        href:
          isPrivate
            ? '../pagina publica/index.html'
            : 'index.html',

        label: 'Inicio'
      },

      {
        href:
          isPrivate
            ? '../pagina publica/productos.html'
            : 'productos.html',

        label: 'Productos'
      },

      {
        href:
          isPrivate
            ? '../pagina publica/nosotros.html'
            : 'nosotros.html',

        label: 'Nosotros'
      },

      {
        href:
          isPrivate
            ? '../pagina publica/contactos.html'
            : 'contactos.html',

        label: 'Contacto'
      }

    ];

    publicLinks.forEach(
      function(link) {

        const li =
          document.createElement('li');

        li.innerHTML =
          `<a href="${link.href}">${link.label}</a>`;

        navList.appendChild(li);

      }
    );

    // Servicios después de Productos
    addServicesMenu(
      navList,
      isPrivate
    );

    // =================================================
    // DASHBOARD
    // =================================================

    if (
      !isPrivate &&
      session &&
      (
        session.rol === 'admin' ||
        session.rol === 'empleado'
      )
    ) {

      const liDash =
        document.createElement('li');

      liDash.innerHTML =
        '<a href="../pagina privada/dashboard.html">Dashboard</a>';

      navList.appendChild(liDash);
    }

    // =================================================
    // LOGIN / LOGOUT
    // =================================================

    if (session) {

      const liLogout =
        document.createElement('li');

      liLogout.innerHTML =
        '<a id="logout" href="#logout">Cerrar sesión</a>';

      navList.appendChild(liLogout);

      const badge =
        document.createElement('span');

      badge.className =
        'session-badge';

      badge.textContent =
        `Hola, ${session.nombre}`;

      header
        .querySelector('.logo')
        .after(badge);

    } else {

      const liLogin =
        document.createElement('li');

      liLogin.innerHTML =
        `<a href="${
          isPrivate
            ? '../pagina publica/login.html'
            : 'login.html'
        }">Iniciar sesión</a>`;

      navList.appendChild(liLogin);
    }

    // =================================================
    // LOGO
    // =================================================

    const logo =
      header.querySelector('.logo');

    logo.style.cursor =
      'pointer';

    logo.addEventListener(
      'click',
      function() {

        window.location.href =
          isPrivate
            ? '../pagina publica/index.html'
            : 'index.html';

      }
    );
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  function attachLogout() {

    const logoutLink =
      document.getElementById('logout');

    if (!logoutLink) return;

    logoutLink.addEventListener(
      'click',
      function(event) {

        event.preventDefault();

        clearSession();

        const isPrivate =
          window.location.pathname.includes(
            '/pagina privada/'
          ) ||
          window.location.pathname.includes(
            '/pagina%20privada/'
          );

        window.location.href =
          isPrivate
            ? '../pagina publica/index.html'
            : 'index.html';
      }
    );
  }

  // =====================================================
  // CERRAR MENÚ AL HACER CLIC AFUERA
  // =====================================================

  document.addEventListener(
    'click',
    function(event) {

      if (
        event.target.closest(
          '.services-menu'
        )
      ) {
        return;
      }

      document
        .querySelectorAll(
          '.services-dropdown.show'
        )
        .forEach(
          function(menu) {

            menu.classList.remove('show');

          }
        );

      document
        .querySelectorAll(
          '.services-menu-btn.open'
        )
        .forEach(
          function(button) {

            button.classList.remove('open');

            button.setAttribute(
              'aria-expanded',
              'false'
            );

          }
        );
    }
  );

  // =====================================================
  // INICIALIZACIÓN
  // =====================================================

  document.addEventListener(
    'DOMContentLoaded',
    function() {

      addServicesStyles();

      renderHeader();

      attachLogout();

    }
  );

})();


// =========================================================
// UI: MODAL CONFIRM / ALERT
// =========================================================

(function() {

  const tpl = `

    <div
      id="uiModalOverlay"
      style="
        display:none;
        position:fixed;
        inset:0;
        background:rgba(2,6,23,0.6);
        backdrop-filter:blur(4px);
        z-index:99999;
        align-items:center;
        justify-content:center;
      "
    >

      <div
        id="uiModal"
        style="
          max-width:520px;
          width:90%;
          background:var(--admin-card);
          border-radius:12px;
          padding:20px;
          border:1px solid rgba(255,255,255,0.04);
          box-shadow:0 10px 30px rgba(0,0,0,0.6);
          color:var(--admin-text);
        "
      >

        <div
          id="uiModalMsg"
          style="
            margin-bottom:18px;
            color:var(--admin-text-muted)
          "
        ></div>

        <div
          style="
            display:flex;
            justify-content:flex-end;
            gap:10px;
          "
        >

          <button
            id="uiCancelBtn"
            style="
              padding:8px 12px;
              border-radius:8px;
              background:transparent;
              border:1px solid rgba(255,255,255,0.06);
              color:var(--admin-text);
            "
          >
            Cancelar
          </button>

          <button
            id="uiOkBtn"
            style="
              padding:8px 12px;
              border-radius:8px;
              background:linear-gradient(135deg,#00b4ff,#0090d6);
              border:none;
              color:#021020;
              font-weight:700;
            "
          >
            Aceptar
          </button>

        </div>

      </div>

    </div>

  `;

  document.addEventListener(
    'DOMContentLoaded',
    () => {

      const div =
        document.createElement('div');

      div.innerHTML =
        tpl;

      document.body.appendChild(
        div.firstElementChild
      );

    }
  );

  function ensureElements() {

    const overlay =
      document.getElementById(
        'uiModalOverlay'
      );

    const msg =
      document.getElementById(
        'uiModalMsg'
      );

    const ok =
      document.getElementById(
        'uiOkBtn'
      );

    const cancel =
      document.getElementById(
        'uiCancelBtn'
      );

    return {
      overlay,
      msg,
      ok,
      cancel
    };
  }

  window.showConfirm =
    function(message) {

      return new Promise(
        (resolve) => {

          const {
            overlay,
            msg,
            ok,
            cancel
          } = ensureElements();

          if (!overlay) {
            return resolve(false);
          }

          msg.textContent =
            message;

          overlay.style.display =
            'flex';

          function cleanup() {

            overlay.style.display =
              'none';

            ok.removeEventListener(
              'click',
              onOk
            );

            cancel.removeEventListener(
              'click',
              onCancel
            );
          }

          function onOk() {

            cleanup();

            resolve(true);
          }

          function onCancel() {

            cleanup();

            resolve(false);
          }

          ok.addEventListener(
            'click',
            onOk
          );

          cancel.addEventListener(
            'click',
            onCancel
          );

        }
      );
    };

  window.showAlert =
    function(message) {

      return new Promise(
        (resolve) => {

          const {
            overlay,
            msg,
            ok
          } = ensureElements();

          if (!overlay) {
            return resolve();
          }

          msg.textContent =
            message;

          const cancel =
            document.getElementById(
              'uiCancelBtn'
            );

          cancel.style.display =
            'none';

          overlay.style.display =
            'flex';

          function cleanup() {

            overlay.style.display =
              'none';

            ok.removeEventListener(
              'click',
              onOk
            );

            cancel.style.display =
              '';
          }

          function onOk() {

            cleanup();

            resolve();
          }

          ok.addEventListener(
            'click',
            onOk
          );

        }
      );
    };

})();