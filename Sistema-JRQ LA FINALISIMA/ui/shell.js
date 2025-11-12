// ui/shell.js — JR Químicos (Header/Footer estándar) — usa tu styles.css global

class JRQHeader extends HTMLElement {
  connectedCallback() {
    const prefix = this.getAttribute('prefix') ?? './';
    let current = this.getAttribute('active') || '';
    if (!current) {
      const p = location.pathname.toLowerCase();
      if (p.includes('/modulo-clientes/'))   current = 'Clientes';
      else if (p.includes('/modulo-finanzas/'))   current = 'Finanzas';
      else if (p.includes('/modulo-inventario/')) current = 'Inventario';
      else if (p.includes('/modulo-personal/'))   current = 'Personal';
      else if (p.includes('/modulo-produccion/')) current = 'Producción';
      else if (p.includes('/modulo-reportes/'))   current = 'Reportes';
      else if (p.includes('/modulo-ventas/'))     current = 'Ventas';
      else if (p.includes('/modulo-usuarios/'))     current = 'Usuarios';
    }

    const mods = [
      { label: 'Personal',   href: `${prefix}Modulo-Personal/(p) registrar-empleado.html` },
      { label: 'Usuarios',     href: `${prefix}Modulo-Usuarios/mostrar-usuarios.html` },
      { label: 'Clientes',   href: `${prefix}Modulo-Clientes/(p) registrar-cliente.html` },
      { label: 'Inventario', href: `${prefix}Modulo-Inventario/(p) registrar-producto.html` },
      { label: 'Ventas',     href: `${prefix}Modulo-Ventas/(p) registrar-venta.html` },
      { label: 'Producción', href: `${prefix}Modulo-Produccion/(p) validar-orden.html` },
      { label: 'Finanzas',   href: `${prefix}Modulo-Finanzas/(p) registrar-transaccion.html` },
      { label: 'Reportes',   href: `${prefix}Modulo-Reportes/reporte-personal.html` },
      
      
    ];

    const links = mods.map(m=>{
      const isActive = m.label === current;
      const cls  = isActive ? ' class="active"' : '';
      const aria = isActive ? ' aria-current="page"' : '';
      return `<a href="${m.href}"${cls}${aria}>${m.label}</a>`;
    }).join('');

    this.innerHTML = `
      <header class="nav" role="banner">
        <a class="brand brand-home" href="${prefix}(p) index.html">JR Químicos-Prototipo</a>
        <nav class="main-nav" aria-label="Módulos">${links}</nav>
        <div class="spacer"></div>
        <a class="btn-login" href="${prefix}Modulo-Usuarios/(p) iniciar-sesion.html">Iniciar sesión</a>
      </header>
    `;
  }
}

class JRQFooter extends HTMLElement {
  connectedCallback() {
    const ctx  = this.getAttribute('context') || ''; // ej: "Inicio", "Registrar OP"
    const year = new Date().getFullYear();
    this.innerHTML = `
      <hr />
      <div class="footer-note">JR QUÍMICOS LA ÚNICA S.A.C. · ${ctx ? `${ctx} · ` : ''}${year}</div>
    `;
  }
}

customElements.define('jrq-header', JRQHeader);
customElements.define('jrq-footer', JRQFooter);

