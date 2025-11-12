/* app-producto.js · JR Químicos – Módulo Inventario
   Páginas soportadas:
   - Registrar:  #eg-form, #eg-tipo, #eg-resp, #eg-items, #eg-add, #eg-subtotal, #eg-igv, #eg-total
   - Mostrar:    #ce-filtros, #ce-body, #ce-empty, #ce-detalle
   - Modificar:  #me-filtros, #me-body, #me-empty, #me-form
   - Baja:       #de-filtros, #de-body, #de-empty, #de-form

   Estándares:
   - Código de producto: PR-00XX
   - ID de movimiento = código del producto (PR-00XX)
   - IGV = 18% (solo usado en el resumen de Registrar)
   - Botón de acciones “Seleccionar” (azul) y para baja “Seleccionar” (rojo)
*/

(function () {
  "use strict";

  // --------------------- Helpers UI ---------------------
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function toast(msg) {
    const t = $("#toast");
    if (!t) return console.log("[toast]", msg);
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 1800);
  }

  const PEN = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 2 });

  const fmtDate = (iso) => {
    if (!iso) return "—";
    try {
      const d = new Date(iso + "T00:00:00");
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth()+1).padStart(2, "0");
      const yy = d.getFullYear();
      return `${yy}-${mm}-${dd}`;
    } catch { return iso; }
  };

  // --------------------- Storage & semillas ---------------------
  const K_PROD = "jrq:inv:productos:v1";
  const K_MOVS = "jrq:inv:movs:v1";
  const K_RESP = "jrq:inv:responsables:v1";
  const K_LASTSEL = "jrq:inv:lastsel:v1"; // para recordar selección entre pantallas (opcional)

  const seedProductos = [
    // Insumos
    { cod:"PR-0001", tipo:"insumo",   nombre:"Hipoclorito 5%",    stock: 120, costo:  5.50 },
    { cod:"PR-0002", tipo:"insumo",   nombre:"Tensoactivo X",     stock:  70, costo: 18.00 },
    { cod:"PR-0003", tipo:"insumo",   nombre:"Fragancia Floral",  stock:  15, costo: 41.50 },
    { cod:"PR-0004", tipo:"insumo",   nombre:"Envase PET 1L",     stock: 800, costo:  0.78 },
    // Productos terminados
    { cod:"PR-0005", tipo:"producto", nombre:"Detergente 1L",     stock: 200, costo: 11.90 },
    { cod:"PR-0006", tipo:"producto", nombre:"Lavavajilla 500ml", stock: 180, costo:  3.50 },
    { cod:"PR-0007", tipo:"producto", nombre:"Limpiavidrios 500", stock: 140, costo:  4.10 }
  ];

  const seedResponsables = ["A. Salazar", "M. Torres", "K. Paredes", "L. Quispe", "S. Huamán"];

  /* Movimientos semilla (mezcla de ingresos y egresos)
     - id: PR-00XX (no único; se diferencia por fecha cuando se requiere)
     - cantidad > 0 : ingreso
     - cantidad < 0 : egreso (Venta/Consumo/Ajuste/Devolución)
  */
  const seedMovs = [
    // Ingresos
    { id:"PR-0001", fecha:"2025-11-01", tipoMov:"Ingreso", prod:"PR-0001", prodNombre:"Hipoclorito 5%",    cantidad:  20, costo:  5.50, resp:"A. Salazar", obs:"Compra local",     estado:"Activo" },
    { id:"PR-0004", fecha:"2025-11-02", tipoMov:"Ingreso", prod:"PR-0004", prodNombre:"Envase PET 1L",     cantidad: 200, costo:  0.78, resp:"M. Torres",  obs:"Proveedor PETsac",  estado:"Activo" },
    { id:"PR-0003", fecha:"2025-11-03", tipoMov:"Ingreso", prod:"PR-0003", prodNombre:"Fragancia Floral",  cantidad:   5, costo: 41.50, resp:"L. Quispe",  obs:"Ingreso parcial",   estado:"Activo" },

    // Egresos
    { id:"PR-0006", fecha:"2025-11-03", tipoMov:"Consumo interno",     prod:"PR-0006", prodNombre:"Lavavajilla 500ml", cantidad:  5, costo:  3.50, resp:"K. Paredes", obs:"Merma",             estado:"Activo" },
    { id:"PR-0001", fecha:"2025-11-04", tipoMov:"Consumo interno",     prod:"PR-0001", prodNombre:"Hipoclorito 5%",    cantidad:  3, costo:  5.50, resp:"S. Huamán",  obs:"Limpieza área",     estado:"Activo" },
    { id:"PR-0002", fecha:"2025-11-05", tipoMov:"Ajuste",              prod:"PR-0002", prodNombre:"Tensoactivo X",     cantidad: 10, costo: 18.00, resp:"A. Salazar", obs:"Lote mal estado",   estado:"Activo" },
    { id:"PR-0005", fecha:"2025-11-06", tipoMov:"Venta",               prod:"PR-0005", prodNombre:"Detergente 1L",     cantidad: 12, costo: 11.90, resp:"M. Torres",  obs:"Pedido #1024",      estado:"Activo" },
    { id:"PR-0007", fecha:"2025-11-06", tipoMov:"Devolución a proveedor", prod:"PR-0007", prodNombre:"Limpiavidrios 500", cantidad:  7, costo:  4.10, resp:"K. Paredes", obs:"Envase defectuoso", estado:"Activo" }
  ];

  function getJSON(k, fallback) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) { localStorage.setItem(k, JSON.stringify(fallback)); return JSON.parse(JSON.stringify(fallback)); }
      const data = JSON.parse(raw);
      if (data == null) throw new Error("null");
      return data;
    } catch {
      localStorage.setItem(k, JSON.stringify(fallback));
      return JSON.parse(JSON.stringify(fallback));
    }
  }

  const getProductos  = () => getJSON(K_PROD, seedProductos);
  const setProductos  = (v) => localStorage.setItem(K_PROD, JSON.stringify(v));
  const getMovs       = () => getJSON(K_MOVS, seedMovs);
  const setMovs       = (v) => localStorage.setItem(K_MOVS, JSON.stringify(v));
  const getRespons    = () => getJSON(K_RESP, seedResponsables);
  const setRespons    = (v) => localStorage.setItem(K_RESP, JSON.stringify(v));

  // --------------------- Utilidades de inventario ---------------------
  const findProd = (cod) => getProductos().find(p => p.cod === cod);
  function upsertProdStock(cod, delta) {
    const list = getProductos();
    const p = list.find(x => x.cod === cod);
    if (!p) return;
    p.stock = Math.max(0, (Number(p.stock)||0) + Number(delta||0));
    setProductos(list);
  }

  // --------------------- REGISTRAR: ingreso con Ítems ---------------------
  (function initRegistrar() {
    const form  = $("#eg-form");
    if (!form) return;

    const ddTipo = $("#eg-tipo");
    const ddResp = $("#eg-resp");
    const tb     = $("#eg-items");
    const btnAdd = $("#eg-add");
    const outSub = $("#eg-subtotal");
    const outIGV = $("#eg-igv");
    const outTot = $("#eg-total");
    const inFecha= $("#eg-fecha");
    const inObs  = $("#eg-obs");

    // poblar responsables
    const resp = getRespons();
    ddResp.innerHTML = resp.map(r => `<option>${r}</option>`).join("");

    // fecha hoy por defecto
    inFecha && (inFecha.value = fmtDate(new Date().toISOString().slice(0,10)));

    function productosPorTipo(tipo) {
      return getProductos().filter(p => p.tipo === (tipo === "insumo" ? "insumo" : "producto"));
    }

    function filaItem(tipoActual) {
      const tr = document.createElement("tr");
      const prods = productosPorTipo(tipoActual);
      tr.innerHTML = `
        <td>
          <select class="eg-item-prod">
            ${prods.map(p => `<option value="${p.cod}">${p.cod} · ${p.nombre}</option>`).join("")}
          </select>
        </td>
        <td class="eg-item-costo">—</td>
        <td class="eg-item-stock">—</td>
        <td><input type="number" min="1" value="1" class="eg-item-cant" style="max-width:90px"></td>
        <td class="eg-item-sub">S/ 0.00</td>
        <td><button type="button" class="btn mid eg-del">Quitar</button></td>
      `;
      return tr;
    }

    function recomputa() {
      let subtotal = 0;
      $$("#eg-items tr").forEach(tr => {
        const sel = $(".eg-item-prod", tr);
        const p = findProd(sel.value);
        const costoEl = $(".eg-item-costo", tr);
        const stockEl = $(".eg-item-stock", tr);
        const cantEl  = $(".eg-item-cant", tr);
        const subEl   = $(".eg-item-sub", tr);
        if (p) {
          costoEl.textContent = PEN.format(p.costo);
          stockEl.textContent = String(p.stock);
          const cant = Math.max(1, parseInt(cantEl.value||"1",10));
          const sub = cant * Number(p.costo);
          subEl.textContent = PEN.format(sub);
          subtotal += sub;
        } else {
          costoEl.textContent = "—";
          stockEl.textContent = "—";
          subEl.textContent   = PEN.format(0);
        }
      });
      const igv = subtotal * 0.18;
      const tot = subtotal + igv;
      outSub.textContent = PEN.format(subtotal);
      outIGV.textContent = PEN.format(igv);
      outTot.textContent = PEN.format(tot);
    }

    function refrescaFilasPorTipo() {
      const tipo = ddTipo.value || "insumo";
      const rows = $$("#eg-items tr");
      if (!rows.length) {
        tb.appendChild(filaItem(tipo));
      } else {
        rows.forEach(tr => {
          const sel = $(".eg-item-prod", tr);
          const prev = sel?.value;
          const prods = productosPorTipo(tipo);
          sel.innerHTML = prods.map(p => `<option value="${p.cod}">${p.cod} · ${p.nombre}</option>`).join("");
          if (prev && prods.some(p => p.cod === prev)) sel.value = prev;
        });
      }
      recomputa();
    }

    ddTipo.addEventListener("change", refrescaFilasPorTipo);

    btnAdd.addEventListener("click", () => {
      const tipo = ddTipo.value || "insumo";
      tb.appendChild(filaItem(tipo));
      recomputa();
    });

    tb.addEventListener("change", (ev) => {
      if (ev.target.matches(".eg-item-prod") || ev.target.matches(".eg-item-cant")) {
        recomputa();
      }
    });
    tb.addEventListener("input", (ev) => {
      if (ev.target.matches(".eg-item-cant")) recomputa();
    });
    tb.addEventListener("click", (ev) => {
      if (ev.target.closest(".eg-del")) {
        ev.target.closest("tr").remove();
        recomputa();
      }
    });

    $("#eg-clear")?.addEventListener("click", () => {
      tb.innerHTML = "";
      refrescaFilasPorTipo();
      inObs.value = "";
      recomputa();
    });

    // Inicial
    refrescaFilasPorTipo();

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const fecha = inFecha.value || fmtDate(new Date().toISOString().slice(0,10));
      const respV = ddResp.value || seedResponsables[0];
      const obs   = (inObs.value || "").trim();
      const tipo  = ddTipo.value || "insumo";

      const rows = $$("#eg-items tr");
      if (!rows.length) { toast("Agrega al menos 1 ítem."); return; }

      const movs = getMovs();
      let itemsOK = 0;

      rows.forEach(tr => {
        const sel = $(".eg-item-prod", tr);
        const cantEl = $(".eg-item-cant", tr);
        const p = findProd(sel.value);
        if (!p) return;
        const cant = Math.max(1, parseInt(cantEl.value||"1",10));

        // ID del movimiento = código de producto
        const id = p.cod;

        const reg = {
          id,
          fecha,
          tipoMov: "Ingreso",
          prod: p.cod,
          prodNombre: p.nombre,
          cantidad: cant,          // Ingreso => positivo
          costo: Number(p.costo),
          resp: respV,
          obs: obs || `Ingreso de ${cant} × ${p.cod}`,
          estado: "Activo"
        };
        movs.push(reg);

        // Actualizar stock (ingreso suma)
        upsertProdStock(p.cod, cant);
        itemsOK++;
      });

      if (!itemsOK) { toast("No se pudo registrar: ítems inválidos."); return; }

      setMovs(movs);
      toast("Ingreso registrado.");
      form.reset();
      tb.innerHTML = "";
      ddTipo.value = tipo; // mantener tipo elegido
      refrescaFilasPorTipo();
      recomputa();
    });
  })();

  // --------------------- MOSTRAR: listado y detalle ---------------------
  (function initMostrar() {
    const form = $("#ce-filtros");
    const tbody = $("#ce-body");
    if (!form || !tbody) return;
    const empty = $("#ce-empty");
    const det = $("#ce-detalle");

    const fDesde = $("#ce-desde");
    const fHasta = $("#ce-hasta");
    const fTipo  = $("#ce-tipo");     // Venta / Consumo interno / Ajuste / Devolución a proveedor (o "")
    const fResp  = $("#ce-resp");

    // Poblar responsables
    const resp = getRespons();
    fResp.innerHTML = `<option value="">(Todos)</option>` + resp.map(r => `<option>${r}</option>`).join("");

    function pasaFiltros(m) {
      const d = (fDesde.value || "");
      const h = (fHasta.value || "");
      if (d && m.fecha < d) return false;
      if (h && m.fecha > h) return false;
      if (fTipo.value && m.tipoMov !== fTipo.value) return false; // si vacío, muestra todos (incluye Ingreso)
      if (fResp.value && m.resp !== fResp.value) return false;
      return true;
    }

    function render() {
      const list = getMovs().filter(pasaFiltros);
      tbody.innerHTML = "";
      if (!list.length) { empty.style.display = "block"; return; }
      empty.style.display = "none";

      const frag = document.createDocumentFragment();
      list.forEach(m => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${m.id}</td>
          <td>${fmtDate(m.fecha)}</td>
          <td>${m.tipoMov}</td>
          <td>${m.prod} · ${m.prodNombre}</td>
          <td>${m.cantidad}</td>
          <td>${m.resp}</td>
          <td>${m.obs || "—"}</td>
          <td><button class="btn mid ce-sel" data-id="${m.id}" data-fecha="${m.fecha}">Seleccionar</button></td>
        `;
        frag.appendChild(tr);
      });
      tbody.appendChild(frag);
    }

    form.addEventListener("submit", (ev) => { ev.preventDefault(); render(); });
    form.addEventListener("reset", () => setTimeout(render, 0));

    tbody.addEventListener("click", (ev) => {
      const b = ev.target.closest(".ce-sel");
      if (!b) return;
      const id = b.dataset.id, fecha = b.dataset.fecha;
      const m = getMovs().find(x => x.id === id && x.fecha === fecha) || getMovs().find(x => x.id === id);
      if (!m) return;
      det.style.display = "block";
      $('[data-det="id"]', det).textContent     = m.id;
      $('[data-det="fecha"]', det).textContent  = fmtDate(m.fecha);
      $('[data-det="tipo"]', det).textContent   = m.tipoMov;
      $('[data-det="producto"]', det).textContent = `${m.prod} · ${m.prodNombre}`;
      $('[data-det="cant"]', det).textContent   = String(m.cantidad);
      $('[data-det="resp"]', det).textContent   = m.resp;
      $('[data-det="obs"]', det).textContent    = m.obs || "—";
      localStorage.setItem(K_LASTSEL, JSON.stringify({id:m.id,fecha:m.fecha}));
      toast(`Seleccionado ${m.id}`);
    });

    render();
  })();

  // --------------------- MODIFICAR: editar movimiento ---------------------
  (function initModificar() {
    const formF = $("#me-filtros");
    const body  = $("#me-body");
    const empty = $("#me-empty");
    const formE = $("#me-form");
    if (!formF || !body || !formE) return;

    const fDesde = $("#me-desde");
    const fHasta = $("#me-hasta");
    const fTipoF = $("#me-tipo");   // Insumo / Producto Fabricado / "" (para filtrar por tipo del producto)
    const fRespF = $("#me-resp");

    const eId    = $("#me-eid");
    const eFecha = $("#me-fecha");
    const eProd  = $("#me-prod");
    const eCant  = $("#me-cant");
    const eTipo  = $("#me-tipo-edit");   // Insumo / Producto Fabricado (solo referencial aquí)
    const eResp  = $("#me-resp-edit");
    const eObs   = $("#me-obs");
    const btnCancel = $("#me-cancel");

    // Poblar responsables
    const respL = getRespons();
    fRespF.innerHTML = `<option value="">(Todos)</option>` + respL.map(r => `<option>${r}</option>`).join("");
    eResp.innerHTML  = respL.map(r => `<option>${r}</option>`).join("");

    function pasaFiltros(m) {
      const id = ($("#me-id")?.value || "").trim();
      if (id && m.id !== id) return false;
      const d = (fDesde.value || "");
      const h = (fHasta.value || "");
      if (d && m.fecha < d) return false;
      if (h && m.fecha > h) return false;
      if (fTipoF.value) {
        const tipoProd = (findProd(m.prod)?.tipo === "insumo" ? "Insumo" : "Producto Fabricado");
        if (tipoProd !== fTipoF.value) return false;
      }
      if (fRespF.value && m.resp !== fRespF.value) return false;
      return true;
    }

    function render() {
      const lst = getMovs().filter(pasaFiltros);
      body.innerHTML = "";
      if (!lst.length) { empty.style.display = "block"; return; }
      empty.style.display = "none";

      const frag = document.createDocumentFragment();
      lst.forEach(m => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${m.id}</td>
          <td>${fmtDate(m.fecha)}</td>
          <td>${m.tipoMov}</td>
          <td>${m.prod} · ${m.prodNombre}</td>
          <td>${m.cantidad}</td>
          <td>${m.resp}</td>
          <td><button type="button" class="btn mid me-sel" data-id="${m.id}" data-fecha="${m.fecha}">Seleccionar</button></td>
        `;
        frag.appendChild(tr);
      });
      body.appendChild(frag);
    }

    formF.addEventListener("submit", (ev) => { ev.preventDefault(); render(); });
    formF.addEventListener("reset", () => setTimeout(render, 0));

    body.addEventListener("click", (ev) => {
      const b = ev.target.closest(".me-sel");
      if (!b) return;
      const id = b.dataset.id, fecha = b.dataset.fecha;
      const m = getMovs().find(x => x.id === id && x.fecha === fecha) || getMovs().find(x => x.id === id);
      if (!m) return;

      eId.value    = m.id;
      eFecha.value = fmtDate(m.fecha);
      eProd.value  = `${m.prod} · ${m.prodNombre}`;
      eCant.value  = Math.abs(m.cantidad);
      eTipo.value  = (findProd(m.prod)?.tipo === "insumo" ? "Insumo" : "Producto Fabricado");
      eResp.value  = m.resp;
      eObs.value   = m.obs || "";
      toast(`Cargado ${m.id}`);
    });

    btnCancel?.addEventListener("click", () => { formE.reset(); });

    formE.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const id = eId.value;
      if (!id) { toast("Selecciona un registro primero."); return; }

      const movs = getMovs();
      // Ubicar por id + fecha mostrada
      const mIdx = movs.findIndex(x => x.id === id && fmtDate(x.fecha) === fmtDate(eFecha.value));
      const m = movs[mIdx] || movs.find(x => x.id === id);
      if (!m) { toast("No se encontró el movimiento."); return; }

      const nuevaCantAbs = Math.max(1, parseInt(eCant.value||"1",10));
      const nuevoResp = eResp.value || m.resp;
      const nuevoObs  = (eObs.value || "").trim();

      // Ajuste de stock según delta (respetando signo original)
      const signo = m.cantidad >= 0 ? 1 : -1;
      const nuevaCant = nuevaCantAbs * signo;
      const delta = nuevaCant - m.cantidad; // cuánto cambia realmente
      upsertProdStock(m.prod, delta);       // si delta > 0 aumenta; si < 0 disminuye

      // Actualizar movimiento
      m.cantidad = nuevaCant;
      m.resp = nuevoResp;
      m.obs  = nuevoObs;

      setMovs(movs);
      toast("Cambios guardados.");
      render();
    });

    render();
  })();

  // --------------------- BAJA: eliminar / inactivar ---------------------
  (function initBaja() {
    const formF = $("#de-filtros");
    const tbody = $("#de-body");
    const empty = $("#de-empty");
    const formC = $("#de-form");
    if (!formF || !tbody || !formC) return;

    const fId = $("#de-id");
    const fDesde = $("#de-desde");
    const fHasta = $("#de-hasta");
    const fTipo  = $("#de-tipo"); // Venta/Consumo/Ajuste/Devolución o "" (muestra todos)
    const fResp  = $("#de-resp");

    const cId = $("#de-sel-id");
    const cFe = $("#de-sel-fecha");
    const cPr = $("#de-sel-prod");
    const cCt = $("#de-sel-cant");
    const cTp = $("#de-sel-tipo");
    const cRp = $("#de-sel-resp");
    const cMo = $("#de-motivo");
    const btnInac = $("#de-inactivar");

    // Poblar responsables
    const respL = getRespons();
    fResp.innerHTML = `<option value="">(Todos)</option>` + respL.map(r => `<option>${r}</option>`).join("");

    function pasaFiltros(m) {
      const id = (fId.value || "").trim();
      if (id && m.id !== id) return false;
      const d = (fDesde.value || "");
      const h = (fHasta.value || "");
      if (d && m.fecha < d) return false;
      if (h && m.fecha > h) return false;
      if (fTipo.value && m.tipoMov !== fTipo.value) return false;
      if (fResp.value && m.resp !== fResp.value) return false;
      return true;
    }

    function render() {
      const list = getMovs().filter(pasaFiltros);
      tbody.innerHTML = "";
      if (!list.length) { empty.style.display = "block"; return; }
      empty.style.display = "none";

      const frag = document.createDocumentFragment();
      list.forEach(m => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${m.id}</td>
          <td>${fmtDate(m.fecha)}</td>
          <td>${m.tipoMov}</td>
          <td>${m.prod} · ${m.prodNombre}</td>
          <td>${m.cantidad}</td>
          <td>${m.resp}</td>
          <td>
            <button class="btn danger de-select"
              data-id="${m.id}"
              data-fecha="${m.fecha}">
              Seleccionar
            </button>
          </td>
        `;
        frag.appendChild(tr);
      });
      tbody.appendChild(frag);
    }

    formF.addEventListener("submit", (ev) => { ev.preventDefault(); render(); });
    formF.addEventListener("reset", () => setTimeout(render, 0));

    tbody.addEventListener("click", (ev) => {
      const b = ev.target.closest(".de-select");
      if (!b) return;
      const id = b.dataset.id, fecha = b.dataset.fecha;
      const m = getMovs().find(x => x.id === id && x.fecha === fecha) || getMovs().find(x => x.id === id);
      if (!m) return;
      cId.value = m.id;
      cFe.value = fmtDate(m.fecha);
      cPr.value = `${m.prod} · ${m.prodNombre}`;
      cCt.value = m.cantidad;
      cTp.value = m.tipoMov;
      cRp.value = m.resp;
      cMo.value = "";
      toast(`Seleccionado ${m.id}`);
    });

    formC.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const id = (cId.value || "").trim();
      const fecha = (cFe.value || "").trim();
      if (!id || !fecha) { toast("Selecciona un registro."); return; }
      if (!cMo.value.trim()) { toast("Indica un motivo."); cMo.focus(); return; }
      if (!confirm(`¿Confirmas dar de baja definitiva al registro ${id}?`)) return;

      const movs = getMovs();
      const idx = movs.findIndex(x => x.id === id && fmtDate(x.fecha) === fmtDate(fecha));
      if (idx < 0) { toast("No se encontró el registro."); return; }

      const m = movs[idx];
      // Reponer stock en baja definitiva (reversa de la cantidad)
      //  - si era ingreso (+n), baja => -n (resta stock)
      //  - si era egreso  (-n), baja => -(-n)=+n (suma stock)
      upsertProdStock(m.prod, -m.cantidad);

      movs.splice(idx, 1);
      setMovs(movs);
      formC.reset();
      render();
      toast("Registro dado de baja.");
    });

    btnInac?.addEventListener("click", () => {
      const id = (cId.value || "").trim();
      const fecha = (cFe.value || "").trim();
      if (!id || !fecha) { toast("Selecciona un registro."); return; }
      if (!cMo.value.trim()) { toast("Indica un motivo."); cMo.focus(); return; }
      if (!confirm(`¿Confirmas marcar como INACTIVO el registro ${id}?`)) return;

      const movs = getMovs();
      const m = movs.find(x => x.id === id && fmtDate(x.fecha) === fmtDate(fecha));
      if (!m) { toast("No se encontró el registro."); return; }
      m.estado = "Inactivo";
      setMovs(movs);
      toast("Registro inactivado.");
      render();
    });

    render();
  })();

})();
