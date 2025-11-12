/* =========================================================================
   JR QUÍMICOS · APP-REP.JS
   Datos ficticios coherentes + render para pantallas de Reportes:
   - reporte-personal.html   (ids: rp-*)
   - reporte-clientes.html   (ids: rc-*)
   - reporte-produccion.html (ids: rp-* pero con #rp-linea)
   - reporte-inventario.html (ids: ri-*)
   - reporte-estado-cuentas.html (ids: rv-*)
   NOTA: No depende de otros módulos. Usa localStorage sólo para persistir demo.
   ========================================================================= */

(function () {
  "use strict";

  /* ------------------------ Utilidades generales ------------------------ */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const PEN = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });
  const fmtPEN = (n) => PEN.format(Number(n || 0));
  const pad = (n, l = 2) => String(n).padStart(l, "0");

  function ymd(y, m, d) { return `${y}-${pad(m)}-${pad(d)}`; }

  function between(dateStr, desde, hasta) {
    if (!desde && !hasta) return true;
    const v = dateStr;
    if (desde && v < desde) return false;
    if (hasta && v > hasta) return false;
    return true;
  }

  function toast(msg) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 1800);
  }

  /* ------------------------------ SEEDS --------------------------------- */
  // Personal (10)
  const seedPersonal = {
    key: "jrq:rep:personal:v1",
    areas: ["Administración", "Ventas", "Producción", "Logística", "Finanzas"],
    cargos: ["Asistente", "Analista", "Jefe", "Operario", "Coordinador"],
    rows: [
      { cod: "T-0001", nombre: "Ana Salazar", dni: "65432109", area: "Administración", cargo: "Analista", estado: "Activo", creado: ymd(2025, 1, 15) },
      { cod: "T-0002", nombre: "Carlos Rojas", dni: "72411892", area: "Producción", cargo: "Jefe", estado: "Activo", creado: ymd(2025, 1, 20) },
      { cod: "T-0003", nombre: "Lucía Torres", dni: "70553110", area: "Ventas", cargo: "Analista", estado: "Activo", creado: ymd(2025, 2, 3) },
      { cod: "T-0004", nombre: "Diego Huamán", dni: "74001234", area: "Producción", cargo: "Operario", estado: "Inactivo", creado: ymd(2025, 2, 12) },
      { cod: "T-0005", nombre: "María Quispe", dni: "74889912", area: "Finanzas", cargo: "Jefe", estado: "Activo", creado: ymd(2025, 3, 1) },
      { cod: "T-0006", nombre: "Rafael Pérez", dni: "73334567", area: "Finanzas", cargo: "Analista", estado: "Activo", creado: ymd(2025, 3, 18) },
      { cod: "T-0007", nombre: "Sofía Medina", dni: "71991234", area: "Logística", cargo: "Coordinador", estado: "Activo", creado: ymd(2025, 4, 5) },
      { cod: "T-0008", nombre: "Julio Gutiérrez", dni: "70112233", area: "Ventas", cargo: "Analista", estado: "Activo", creado: ymd(2025, 4, 21) },
      { cod: "T-0009", nombre: "Karina Lozano", dni: "70234561", area: "Producción", cargo: "Operario", estado: "Activo", creado: ymd(2025, 5, 2) },
      { cod: "T-0010", nombre: "Pedro Alvarado", dni: "75678901", area: "Producción", cargo: "Operario", estado: "Inactivo", creado: ymd(2025, 5, 14) },
    ],
  };

  // Clientes (10)
  const seedClientes = {
    key: "jrq:rep:clientes:v1",
    tipos: ["Minorista", "Mayorista", "Industrial", "Institucional"],
    rows: [
      { cod: "CL-0001", nombre: "Ferretería El Progreso S.A.C.", doc: "RUC 20608047477", tipo: "Mayorista", estado: "Activo", creado: ymd(2025, 1, 10) },
      { cod: "CL-0002", nombre: "Limpiezas Industriales Lima S.A.", doc: "RUC 20603214567", tipo: "Industrial", estado: "Activo", creado: ymd(2025, 1, 22) },
      { cod: "CL-0003", nombre: "Rosa Huamán Quispe", doc: "DNI 74561234", tipo: "Minorista", estado: "Activo", creado: ymd(2025, 2, 2) },
      { cod: "CL-0004", nombre: "Carlos Pérez Torres", doc: "DNI 72895412", tipo: "Minorista", estado: "Activo", creado: ymd(2025, 2, 9) },
      { cod: "CL-0005", nombre: "Municipalidad de San Miguel", doc: "RUC 20609990001", tipo: "Institucional", estado: "Activo", creado: ymd(2025, 2, 25) },
      { cod: "CL-0006", nombre: "Quimex Andina S.A.C.", doc: "RUC 20123456789", tipo: "Industrial", estado: "Inactivo", creado: ymd(2025, 3, 6) },
      { cod: "CL-0007", nombre: "Yolanda Salazar Rojas", doc: "DNI 70112233", tipo: "Minorista", estado: "Activo", creado: ymd(2025, 3, 21) },
      { cod: "CL-0008", nombre: "Servicios Higiénicos Perú E.I.R.L.", doc: "RUC 20555333449", tipo: "Mayorista", estado: "Activo", creado: ymd(2025, 4, 1) },
      { cod: "CL-0009", nombre: "Consorcio Limpio Total", doc: "RUC 20607770011", tipo: "Institucional", estado: "Activo", creado: ymd(2025, 4, 19) },
      { cod: "CL-0010", nombre: "Textiles San Juan S.A.", doc: "RUC 20112233445", tipo: "Industrial", estado: "Activo", creado: ymd(2025, 5, 3) },
    ],
  };

  // Inventario (10 productos terminados/insumos)
  const seedInventario = {
    key: "jrq:rep:inventario:v1",
    rows: [
      { cod: "PR-0001", desc: "Detergente Líquido 5L", stock: 180, min: 80, max: 400, entradas: 320, salidas: 140, vence: ymd(2026, 3, 15), estado: "OK" },
      { cod: "PR-0002", desc: "Cloro Doméstico 4L", stock: 120, min: 60, max: 300, entradas: 250, salidas: 130, vence: ymd(2026, 5, 10), estado: "OK" },
      { cod: "PR-0003", desc: "Desinfectante 900ml", stock: 350, min: 150, max: 700, entradas: 600, salidas: 250, vence: ymd(2026, 1, 20), estado: "OK" },
      { cod: "PR-0004", desc: "Suavizante 1L", stock: 260, min: 90, max: 500, entradas: 420, salidas: 160, vence: ymd(2026, 2, 28), estado: "OK" },
      { cod: "PR-0005", desc: "Multiusos 1L", stock: 210, min: 100, max: 450, entradas: 380, salidas: 170, vence: ymd(2026, 4, 12), estado: "OK" },
      { cod: "PR-0006", desc: "Hipoclorito 15% (insumo)", stock: 90, min: 80, max: 200, entradas: 150, salidas: 60, vence: ymd(2025, 12, 30), estado: "Bajo" },
      { cod: "PR-0007", desc: "Fragancia Floral (insumo)", stock: 45, min: 30, max: 120, entradas: 80, salidas: 35, vence: ymd(2026, 6, 5), estado: "OK" },
      { cod: "PR-0008", desc: "Envase PET 1L (insumo)", stock: 900, min: 400, max: 2000, entradas: 1500, salidas: 600, vence: "—", estado: "OK" },
      { cod: "PR-0009", desc: "Tapas rosca 28mm (insumo)", stock: 3500, min: 1500, max: 6000, entradas: 6000, salidas: 2500, vence: "—", estado: "OK" },
      { cod: "PR-0010", desc: "Detergente Polvo 5kg", stock: 60, min: 70, max: 200, entradas: 140, salidas: 80, vence: ymd(2025, 11, 30), estado: "Bajo" },
    ],
  };

  // Producción (10 órdenes)
  const seedProduccion = {
    key: "jrq:rep:produccion:v1",
    rows: [
      { op: "OP-2025-0001", linea: "Mezclado", producto: "Detergente Líquido 5L", planif: 500, real: 480, ini: "2025-07-01 08:00", fin: "2025-07-01 17:00", ef: 96, dw: 2.5 },
      { op: "OP-2025-0002", linea: "Envasado", producto: "Detergente Líquido 5L", planif: 480, real: 470, ini: "2025-07-02 08:00", fin: "2025-07-02 16:30", ef: 97.9, dw: 1.8 },
      { op: "OP-2025-0003", linea: "Etiquetado", producto: "Desinfectante 900ml", planif: 800, real: 790, ini: "2025-07-03 08:00", fin: "2025-07-03 17:00", ef: 98.7, dw: 1.2 },
      { op: "OP-2025-0004", linea: "Mezclado", producto: "Suavizante 1L", planif: 600, real: 610, ini: "2025-07-04 08:00", fin: "2025-07-04 17:00", ef: 101.7, dw: 1.0 },
      { op: "OP-2025-0005", linea: "Envasado", producto: "Suavizante 1L", planif: 610, real: 600, ini: "2025-07-05 08:00", fin: "2025-07-05 16:45", ef: 98.4, dw: 1.5 },
      { op: "OP-2025-0006", linea: "Mezclado", producto: "Multiusos 1L", planif: 700, real: 690, ini: "2025-07-06 08:00", fin: "2025-07-06 17:10", ef: 98.6, dw: 2.0 },
      { op: "OP-2025-0007", linea: "Envasado", producto: "Multiusos 1L", planif: 690, real: 680, ini: "2025-07-07 08:00", fin: "2025-07-07 16:40", ef: 98.6, dw: 1.7 },
      { op: "OP-2025-0008", linea: "Mezclado", producto: "Cloro 4L", planif: 450, real: 440, ini: "2025-07-08 08:00", fin: "2025-07-08 16:20", ef: 97.8, dw: 2.2 },
      { op: "OP-2025-0009", linea: "Envasado", producto: "Cloro 4L", planif: 440, real: 430, ini: "2025-07-09 08:00", fin: "2025-07-09 16:30", ef: 97.7, dw: 2.1 },
      { op: "OP-2025-0010", linea: "Etiquetado", producto: "Cloro 4L", planif: 430, real: 428, ini: "2025-07-10 08:00", fin: "2025-07-10 16:20", ef: 99.5, dw: 1.0 },
    ],
  };

  // Ventas / Estado de cuentas (10 ventas)
  const seedVentas = {
    key: "jrq:ventas:v1", // mismo nombre que usa el módulo Ventas de tu demo
    ventas: [
      {
        id: "VTA-2025-0001", fecha: "2025-07-01 10:22",
        cliente: { id: "CL-0001", nombre: "Ferretería El Progreso S.A.C." },
        items: [
          { prod: "Detergente Líquido 5L", cant: 10, precio: 18.5 },
          { prod: "Cloro 4L", cant: 8, precio: 12.9 },
        ],
        cpe: { tipo: "Factura", serie: "F001", numero: 101 },
      },
      {
        id: "VTA-2025-0002", fecha: "2025-07-02 16:45",
        cliente: { id: "CL-0003", nombre: "Rosa Huamán Quispe" },
        items: [{ prod: "Desinfectante 900ml", cant: 6, precio: 8.9 }],
        cpe: { tipo: "Boleta", serie: "B001", numero: 201 },
      },
      {
        id: "VTA-2025-0003", fecha: "2025-07-03 11:05",
        cliente: { id: "CL-0004", nombre: "Carlos Pérez Torres" },
        items: [
          { prod: "Multiusos 1L", cant: 5, precio: 9.2 },
          { prod: "Suavizante 1L", cant: 3, precio: 10.5 },
        ],
        cpe: { tipo: "Boleta", serie: "B001", numero: 202 },
      },
      {
        id: "VTA-2025-0004", fecha: "2025-07-04 09:30",
        cliente: { id: "CL-0002", nombre: "Limpiezas Industriales Lima S.A." },
        items: [{ prod: "Detergente Líquido 5L", cant: 25, precio: 18.5 }],
        cpe: { tipo: "Factura", serie: "F001", numero: 102 },
      },
      {
        id: "VTA-2025-0005", fecha: "2025-07-05 15:10",
        cliente: { id: "CL-0005", nombre: "Municipalidad de San Miguel" },
        items: [
          { prod: "Cloro 4L", cant: 20, precio: 12.9 },
          { prod: "Desinfectante 900ml", cant: 15, precio: 8.9 },
        ],
        cpe: { tipo: "Factura", serie: "F001", numero: 103 },
      },
      {
        id: "VTA-2025-0006", fecha: "2025-07-06 12:05",
        cliente: { id: "CL-0007", nombre: "Yolanda Salazar Rojas" },
        items: [{ prod: "Suavizante 1L", cant: 4, precio: 10.5 }],
        cpe: { tipo: "Boleta", serie: "B001", numero: 203 },
      },
      {
        id: "VTA-2025-0007", fecha: "2025-07-07 14:22",
        cliente: { id: "CL-0006", nombre: "Quimex Andina S.A.C." },
        items: [
          { prod: "Detergente Líquido 5L", cant: 30, precio: 18.5 },
          { prod: "Multiusos 1L", cant: 25, precio: 9.2 },
        ],
        cpe: { tipo: "Factura", serie: "F001", numero: 104 },
      },
      {
        id: "VTA-2025-0008", fecha: "2025-07-08 10:00",
        cliente: { id: "CL-0009", nombre: "Consorcio Limpio Total" },
        items: [{ prod: "Desinfectante 900ml", cant: 50, precio: 8.9 }],
        cpe: { tipo: "Factura", serie: "F001", numero: 105 },
      },
      {
        id: "VTA-2025-0009", fecha: "2025-07-09 18:30",
        cliente: { id: "CL-0010", nombre: "Textiles San Juan S.A." },
        items: [
          { prod: "Cloro 4L", cant: 18, precio: 12.9 },
          { prod: "Suavizante 1L", cant: 12, precio: 10.5 },
        ],
        cpe: { tipo: "Factura", serie: "F001", numero: 106 },
      },
      {
        id: "VTA-2025-0010", fecha: "2025-07-10 11:40",
        cliente: { id: "CL-0008", nombre: "Servicios Higiénicos Perú E.I.R.L." },
        items: [
          { prod: "Multiusos 1L", cant: 40, precio: 9.2 },
          { prod: "Detergente Líquido 5L", cant: 10, precio: 18.5 },
        ],
        cpe: { tipo: "Factura", serie: "F001", numero: 107 },
      },
    ],
  };

  /* ---------------------------- Persistencia demo ---------------------------- */
  function seedIfNeeded(seed) {
    try {
      const cur = JSON.parse(localStorage.getItem(seed.key) || "null");
      if (!cur) localStorage.setItem(seed.key, JSON.stringify(seed));
    } catch {
      localStorage.setItem(seed.key, JSON.stringify(seed));
    }
  }
  // Para ventas: normalizamos con sub/igv/total a partir de items
  function seedVentasIfNeeded() {
    try {
      const cur = JSON.parse(localStorage.getItem(seedVentas.key) || "null");
      if (!cur || !Array.isArray(cur.ventas) || cur.ventas.length === 0) {
        // calcula importes
        const ventas = seedVentas.ventas.map((v) => {
          const sub = v.items.reduce((a, it) => a + it.cant * it.precio, 0);
          const igv = +(sub * 0.18).toFixed(2);
          const total = +(sub + igv).toFixed(2);
          return { ...v, subTotal: +sub.toFixed(2), igv, total };
        });
        localStorage.setItem(seedVentas.key, JSON.stringify({ ventas }));
      }
    } catch {
      const ventas = seedVentas.ventas.map((v) => {
        const sub = v.items.reduce((a, it) => a + it.cant * it.precio, 0);
        const igv = +(sub * 0.18).toFixed(2);
        const total = +(sub + igv).toFixed(2);
        return { ...v, subTotal: +sub.toFixed(2), igv, total };
      });
      localStorage.setItem(seedVentas.key, JSON.stringify({ ventas }));
    }
  }

  seedIfNeeded(seedPersonal);
  seedIfNeeded(seedClientes);
  seedIfNeeded(seedInventario);
  seedIfNeeded(seedProduccion);
  seedVentasIfNeeded();

  /* --------------------------- Reporte: Personal --------------------------- */
  function initReportePersonal() {
    // Detecta si esta pantalla es la de PERSONAL: tiene #rp-body y #rp-area
    const tbody = $("#rp-body");
    const selArea = $("#rp-area");
    if (!tbody || !selArea) return;

    const selCargo = $("#rp-cargo");
    const selEstado = $("#rp-estado");
    const fDesde = $("#rp-desde");
    const fHasta = $("#rp-hasta");
    const kTotal = $("#rp-kpi-total");
    const kAct = $("#rp-kpi-activos");
    const kIna = $("#rp-kpi-inactivos");
    const kAreas = $("#rp-kpi-areas");

    // carga datos
    const data = JSON.parse(localStorage.getItem(seedPersonal.key));
    const rows = data.rows;

    // combos
    selArea.innerHTML = `<option value="">(Todas)</option>` + data.areas.map(a => `<option>${a}</option>`).join("");
    selCargo.innerHTML = `<option value="">(Todos)</option>` + data.cargos.map(c => `<option>${c}</option>`).join("");

    function matches(r) {
      if (!between(r.creado, fDesde.value, fHasta.value)) return false;
      if (selArea.value && r.area !== selArea.value) return false;
      if (selCargo.value && r.cargo !== selCargo.value) return false;
      if (selEstado.value && r.estado !== selEstado.value) return false;
      return true;
    }

    function render() {
      const list = rows.filter(matches);
      tbody.innerHTML = list.map(r => `
        <tr>
          <td>${r.cod}</td>
          <td>${r.nombre}</td>
          <td>${r.dni}</td>
          <td>${r.area}</td>
          <td>${r.cargo}</td>
          <td><span class="tag">${r.estado}</span></td>
        </tr>`).join("");

      $("#rp-empty").style.display = list.length ? "none" : "block";

      // KPIs
      kTotal.textContent = rows.length;
      kAct.textContent = rows.filter(r => r.estado === "Activo").length;
      kIna.textContent = rows.filter(r => r.estado === "Inactivo").length;
      kAreas.textContent = new Set(rows.map(r => r.area)).size;
    }

    ["change", "input"].forEach(ev => {
      [selArea, selCargo, selEstado, fDesde, fHasta].forEach(el => el.addEventListener(ev, render));
    });
    render();
  }

  /* --------------------------- Reporte: Clientes --------------------------- */
  function initReporteClientes() {
    const tbody = $("#rc-body");
    if (!tbody) return;

    const fDesde = $("#rc-desde");
    const fHasta = $("#rc-hasta");
    const selTipo = $("#rc-tipo");
    const selEstado = $("#rc-estado");
    const kTotal = $("#rc-kpi-total");
    const kAct = $("#rc-kpi-activos");
    const kIna = $("#rc-kpi-inactivos");
    const kTipos = $("#rc-kpi-tipos");

    const data = JSON.parse(localStorage.getItem(seedClientes.key));
    const rows = data.rows;

    selTipo.innerHTML = `<option value="">(Todos)</option>` + data.tipos.map(t => `<option>${t}</option>`).join("");

    function matches(r) {
      if (!between(r.creado, fDesde.value, fHasta.value)) return false;
      if (selTipo.value && r.tipo !== selTipo.value) return false;
      if (selEstado.value && r.estado !== selEstado.value) return false;
      return true;
    }

    function render() {
      const list = rows.filter(matches);
      tbody.innerHTML = list.map(r => `
        <tr>
          <td>${r.cod}</td>
          <td>${r.nombre}</td>
          <td>${r.doc}</td>
          <td>${r.tipo}</td>
          <td><span class="tag">${r.estado}</span></td>
        </tr>`).join("");

      $("#rc-empty").style.display = list.length ? "none" : "block";

      // KPIs
      kTotal.textContent = rows.length;
      kAct.textContent = rows.filter(r => r.estado === "Activo").length;
      kIna.textContent = rows.filter(r => r.estado === "Inactivo").length;
      kTipos.textContent = new Set(rows.map(r => r.tipo)).size;
    }

    ["change", "input"].forEach(ev => {
      [fDesde, fHasta, selTipo, selEstado].forEach(el => el.addEventListener(ev, render));
    });
    render();
  }

  /* -------------------------- Reporte: Producción ------------------------- */
  function initReporteProduccion() {
    // Esta pantalla tiene el select #rp-linea (único)
    const selLinea = $("#rp-linea");
    if (!selLinea) return;

    const fDesde = $("#rp-desde");
    const fHasta = $("#rp-hasta");
    const tbody = $("#rp-body");
    const kEf = $("#rp-kpi-ef");
    const kTm = $("#rp-kpi-tm");
    const kDw = $("#rp-kpi-dw");

    const data = JSON.parse(localStorage.getItem(seedProduccion.key));
    const rows = data.rows;

    function matches(r) {
      // usa fecha de inicio (aaaa-mm-dd de ini)
      const fecha = (r.ini || "").slice(0, 10);
      if (!between(fecha, fDesde.value, fHasta.value)) return false;
      if (selLinea.value && r.linea !== selLinea.value) return false;
      return true;
    }

    function render() {
      const list = rows.filter(matches);
      tbody.innerHTML = list.map(r => `
        <tr>
          <td>${r.op}</td>
          <td>${r.linea}</td>
          <td>${r.producto}</td>
          <td>${r.planif}</td>
          <td>${r.real}</td>
          <td>${r.ini} – ${r.fin}</td>
          <td>${r.ef}%</td>
          <td>${r.dw}%</td>
        </tr>`).join("");

      $("#rp-empty") && ($("#rp-empty").style.display = list.length ? "none" : "block");

      // Indicadores simples (promedios)
      if (list.length) {
        const avgEf = (list.reduce((a, r) => a + r.ef, 0) / list.length).toFixed(1);
        const avgDw = (list.reduce((a, r) => a + r.dw, 0) / list.length).toFixed(1);
        // tiempo promedio (horas) aproximado por diferencia fin-ini
        const toH = (s) => {
          const [d, t] = s.split(" ");
          const [Y, M, D] = d.split("-").map(Number);
          const [h, m] = t.split(":").map(Number);
          return new Date(Y, M - 1, D, h, m).getTime();
        };
        const avgHours = (list.reduce((a, r) => a + (toH(r.fin) - toH(r.ini)), 0) / list.length) / 36e5;
        kEf.textContent = `${avgEf}%`;
        kDw.textContent = `${avgDw}%`;
        kTm.textContent = `${avgHours.toFixed(1)} h`;
      } else {
        kEf.textContent = "—%";
        kDw.textContent = "—%";
        kTm.textContent = "— h";
      }
    }

    ["change", "input"].forEach(ev => {
      [fDesde, fHasta, selLinea].forEach(el => el.addEventListener(ev, render));
    });
    render();
  }

  /* -------------------------- Reporte: Inventario ------------------------- */
  function initReporteInventario() {
    const tbody = $("#ri-body");
    if (!tbody) return;

    const selTipo = $("#ri-tipo");
    const fDesde = $("#ri-desde");
    const fHasta = $("#ri-hasta");
    const kTotal = $("#ri-kpi-total");
    const kMax = $("#ri-kpi-max");
    const kMin = $("#ri-kpi-min");
    const kMaxD = $("#ri-kpi-max-detalle");
    const kMinD = $("#ri-kpi-min-detalle");

    const data = JSON.parse(localStorage.getItem(seedInventario.key));
    const rows = data.rows;

    function isInRange(r) {
      // Para demo, usamos fecha de vencimiento si existe como proxy de "período"
      const v = (r.vence && r.vence !== "—") ? r.vence : null;
      if (!fDesde.value && !fHasta.value) return true;
      if (!v) return false;
      return between(v, fDesde.value, fHasta.value);
    }

    function matches(r) {
      if (!isInRange(r)) return false;
      if (selTipo.value === "insumos" && !/insumo/i.test(r.desc)) return false;
      if (selTipo.value === "terminados" && /insumo/i.test(r.desc)) return false;
      return true;
    }

    function render() {
      const list = rows.filter(matches);
      tbody.innerHTML = list.map(r => `
        <tr>
          <td>${r.cod}</td>
          <td>${r.desc}</td>
          <td>${r.stock}</td>
          <td>${r.min}</td>
          <td>${r.max}</td>
          <td>${r.entradas}</td>
          <td>${r.salidas}</td>
          <td>${r.vence}</td>
          <td><span class="tag">${r.estado}</span></td>
        </tr>`).join("");

      $("#ri-empty").style.display = list.length ? "none" : "block";

      // KPIs
      kTotal.textContent = rows.length;
      const maxIt = rows.reduce((a, r) => (a && a.stock > r.stock ? a : r), null);
      const minIt = rows.reduce((a, r) => (a && a.stock < r.stock ? a : r), null);
      if (maxIt) {
        kMax.textContent = maxIt.stock;
        kMaxD.textContent = `${maxIt.cod} · ${maxIt.desc}`;
      } else { kMax.textContent = "—"; kMaxD.textContent = "—"; }
      if (minIt) {
        kMin.textContent = minIt.stock;
        kMinD.textContent = `${minIt.cod} · ${minIt.desc}`;
      } else { kMin.textContent = "—"; kMinD.textContent = "—"; }
    }

    ["change", "input"].forEach(ev => {
      [selTipo, fDesde, fHasta].forEach(el => el.addEventListener(ev, render));
    });
    render();
  }

  /* ---------------------- Reporte: Estado de Cuentas ---------------------- */
  function initReporteEstadoCuentas() {
    const tbody = $("#rv-body");
    if (!tbody) return;

    const fDesde = $("#rv-desde");
    const fHasta = $("#rv-hasta");
    const selCli = $("#rv-cliente");
    const selTipo = $("#rv-tipo");
    const kN = $("#rv-kpi-n");
    const kSub = $("#rv-kpi-sub");
    const kTot = $("#rv-kpi-tot");

    const data = JSON.parse(localStorage.getItem(seedVentas.key));
    const ventas = data.ventas;

    // llenar clientes (únicos)
    const clientes = Array.from(new Set(ventas.map(v => v.cliente.nombre))).sort();
    selCli.innerHTML = `<option value="">(Todos)</option>` + clientes.map(c => `<option>${c}</option>`).join("");

    function matches(v) {
      const f = v.fecha.slice(0, 10);
      if (!between(f, fDesde.value, fHasta.value)) return false;
      if (selCli.value && v.cliente.nombre !== selCli.value) return false;
      if (selTipo.value && (!v.cpe || v.cpe.tipo !== selTipo.value)) return false;
      return true;
    }

    function render() {
      const list = ventas.filter(matches);
      tbody.innerHTML = list.map(v => {
        const prods = v.items.map(i => `${i.prod} (${i.cant})`).join(", ");
        const comp = v.cpe ? `${v.cpe.tipo} ${v.cpe.serie}-${String(v.cpe.numero).padStart(3,"0")}` : "—";
        return `
          <tr>
            <td>${v.id}</td>
            <td>${v.fecha}</td>
            <td>${v.cliente.nombre}</td>
            <td>${prods}</td>
            <td>${comp}</td>
            <td>${fmtPEN(v.subTotal)}</td>
            <td>${fmtPEN(v.igv)}</td>
            <td><b>${fmtPEN(v.total)}</b></td>
          </tr>`;
      }).join("");

      $("#rv-empty").style.display = list.length ? "none" : "block";

      // Totales
      const n = list.length;
      const sub = list.reduce((a, v) => a + v.subTotal, 0);
      const tot = list.reduce((a, v) => a + v.total, 0);
      kN.textContent = n;
      kSub.textContent = fmtPEN(sub);
      kTot.textContent = fmtPEN(tot);
    }

    ["change", "input"].forEach(ev => {
      [fDesde, fHasta, selCli, selTipo].forEach(el => el.addEventListener(ev, render));
    });
    render();
  }

  /* --------------------------------- Boot -------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initReportePersonal();
    initReporteClientes();
    initReporteProduccion();   // detecta por #rp-linea
    initReporteInventario();
    initReporteEstadoCuentas();
    // Aviso sutil
    toast("Datos de demo cargados (APP-REP.JS).");
  });
})();
