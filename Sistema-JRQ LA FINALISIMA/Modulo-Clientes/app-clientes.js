/* app-clientes.js · JR Químicos · Módulo Clientes
   Páginas soportadas:
   - Registrar:   #reg-form, #doc-tipo, #doc-num, #cli-nombre, #cli-tipo, #cli-dir, #cli-tel, #cli-correo
   - Mostrar:     #list-tipo, #list-q, #list-body, #list-empty, #cliente-detail
   - Modificar:   #mod-q, #mod-results, #mod-form, #mod-cod, #mod-doc, #mod-nombre, #mod-tipo, #mod-dir, #mod-tel, #mod-correo
                  (Compat: si existiera una tabla tipo #list-body en la misma página, el botón “Seleccionar” llenará el formulario)
   - Dar de baja: #del-q, #del-list, #del-empty, template#tpl-del-row
                  #bc-form, #bc-cod, #bc-doc, #bc-nom, #bc-est, #bc-motivo, #bc-baja, #bc-inactivar

   Estándares aplicados:
   - Código de cliente: CL-00XX (incremental).
   - Tabla de baja con ÚNICO botón rojo “Seleccionar” que rellena el formulario inferior.
   - En confirmación: dos botones (rojo “Dar de Baja…” y “Marcar como Inactivo”).
*/
(function () {
  "use strict";

  // --------------------- Helpers ---------------------
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function toast(msg) {
    const t = $("#toast");
    if (!t) return alert(msg);
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2000);
  }

  const KEY = "jrq:clientes:v1";
  const tiposBase = ["Natural", "Jurídica", "Distribuidor", "Retail"];

  // Semilla coherente (PE: DNI 8 díg., RUC 11 prefijo 10/20)
  const seed = {
    tipos: [...tiposBase],
    clientes: [
      { cod:"CL-0001", tipoDoc:"DNI", doc:"74561234",    nombre:"Yolanda Quispe",               tipo:"Natural",     dir:"Av. Los Álamos 101",    tel:"+51 987 111 111", correo:"yolanda.q@example.pe",          estado:"Activo" },
      { cod:"CL-0002", tipoDoc:"RUC", doc:"20601234567", nombre:"Limpio Total S.A.C.",          tipo:"Jurídica",    dir:"Jr. Lima 234",          tel:"(01) 555-1234",   correo:"contacto@limpiototal.pe",      estado:"Activo" },
      { cod:"CL-0003", tipoDoc:"DNI", doc:"72895412",    nombre:"Carlos Pérez",                 tipo:"Retail",      dir:"Calle Cusco 56",        tel:"+51 987 222 222", correo:"c.perez@example.pe",            estado:"Activo" },
      { cod:"CL-0004", tipoDoc:"RUC", doc:"20123456789", nombre:"Químicos Andinos S.A.",        tipo:"Distribuidor",dir:"Av. Grau 777",           tel:"(01) 500-1111",   correo:"ventas@qandinos.pe",           estado:"Activo" },
      { cod:"CL-0005", tipoDoc:"DNI", doc:"70654321",    nombre:"María Rojas",                  tipo:"Natural",     dir:"Psj. Piura 90",         tel:"+51 987 333 333", correo:"m.rojas@example.pe",            estado:"Inactivo" },
      { cod:"CL-0006", tipoDoc:"RUC", doc:"20567891234", nombre:"Suministros Industriales EIRL",tipo:"Jurídica",    dir:"Av. Petit Thouars 101", tel:"(01) 444-2222",   correo:"adm@suminind.pe",              estado:"Activo" },
      { cod:"CL-0007", tipoDoc:"DNI", doc:"71478596",    nombre:"Diego Huamán",                 tipo:"Retail",      dir:"Mz A Lt 8",             tel:"+51 987 444 444", correo:"diego.h@example.pe",            estado:"Activo" },
      { cod:"CL-0008", tipoDoc:"RUC", doc:"20111222333", nombre:"Servicios & Limpieza S.R.L.",  tipo:"Distribuidor",dir:"Av. Arequipa 3300",      tel:"(01) 555-9876",  correo:"info@servylimp.pe",            estado:"Activo" },
      { cod:"CL-0009", tipoDoc:"DNI", doc:"71234567",    nombre:"Lucía Torres",                 tipo:"Natural",     dir:"Av. Chile 800",         tel:"+51 987 555 555", correo:"lucia.t@example.pe",            estado:"Activo" },
      { cod:"CL-0010", tipoDoc:"RUC", doc:"20654321987", nombre:"Distribuciones Norte S.A.C.",  tipo:"Distribuidor",dir:"Av. Colonial 1200",      tel:"(01) 700-1100",  correo:"comercial@dnn.pe",              estado:"Activo" },
      { cod:"CL-0011", tipoDoc:"DNI", doc:"70987654",    nombre:"Fiorella Chávez",              tipo:"Retail",      dir:"Calle Sol 404",         tel:"+51 987 666 666", correo:"fiorella.c@example.pe",         estado:"Activo" },
      { cod:"CL-0012", tipoDoc:"RUC", doc:"20199887766", nombre:"Hogar & Limpieza SAC",         tipo:"Jurídica",    dir:"Jr. Amazonas 150",      tel:"(01) 650-2200",  correo:"contacto@hogylimp.pe",          estado:"Inactivo" }
    ]
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return JSON.parse(JSON.stringify(seed)); }
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.clientes)) { localStorage.setItem(KEY, JSON.stringify(seed)); return JSON.parse(JSON.stringify(seed)); }
      if (!Array.isArray(data.tipos) || !data.tipos.length) data.tipos = [...tiposBase];
      return data;
    } catch {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return JSON.parse(JSON.stringify(seed));
    }
  }
  function save(data) { localStorage.setItem(KEY, JSON.stringify(data)); }

  function nextCode(list) {
    let max = 0;
    list.forEach(c => {
      const m = String(c.cod || "").match(/^CL-(\d{4})$/);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return `CL-${String(max + 1).padStart(4, "0")}`;
  }

  // Validaciones
  const isEmail   = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhonePE = (v) => /^(\+51\s?\d{9}|\(01\)\s?\d{3,4}-?\d{3,4}|0?\d{7,9}|[+\d\s-]{8,})$/.test(v);
  const isDNI     = (v) => /^\d{8}$/.test(v);
  const isRUC     = (v) => /^(10|20)\d{9}$/.test(v);
  function validDoc(tipoDoc, doc) { return tipoDoc==="DNI" ? isDNI(doc) : tipoDoc==="RUC" ? isRUC(doc) : false; }

  const byDoc  = (list, tipoDoc, doc) => list.find(c => c.tipoDoc === tipoDoc && c.doc === doc);
  const byCode = (list, cod) => list.find(c => c.cod === cod);

  function fillOptions(select, items, emptyText) {
    if (!select) return;
    const opts = (emptyText ? [`<option value="">${emptyText}</option>`] : []);
    items.forEach(x => opts.push(`<option>${x}</option>`));
    select.innerHTML = opts.join("");
  }

  // --------------------- Registrar Cliente ---------------------
  (function initRegistrar() {
    const form = $("#reg-form");
    if (!form) return;

    const ddTipoDoc = $("#doc-tipo");
    const inDoc     = $("#doc-num");
    const inNom     = $("#cli-nombre");
    const ddTipo    = $("#cli-tipo");
    const inDir     = $("#cli-dir");
    const inTel     = $("#cli-tel");
    const inCorreo  = $("#cli-correo");

    const db = load();
    fillOptions(ddTipo, db.tipos, "— Seleccionar —");

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = load();

      const tipoDoc = ddTipoDoc.value || "DNI";
      const doc     = (inDoc.value || "").trim();
      const nombre  = (inNom.value || "").trim();
      const tipo    = ddTipo.value || "Natural";
      const dir     = (inDir.value || "").trim();
      const tel     = (inTel.value || "").trim();
      const correo  = (inCorreo.value || "").trim();

      if (!validDoc(tipoDoc, doc)) {
        toast(tipoDoc === "DNI" ? "DNI inválido (8 dígitos)." : "RUC inválido (11 dígitos, prefijo 10/20).");
        inDoc.focus(); return;
      }
      if (!nombre) { toast("Ingresa el nombre / razón social."); inNom.focus(); return; }
      if (correo && !isEmail(correo)) { toast("Correo inválido."); inCorreo.focus(); return; }
      if (tel && !isPhonePE(tel)) { toast("Teléfono con formato no reconocido."); inTel.focus(); return; }
      if (byDoc(data.clientes, tipoDoc, doc)) { toast("Ya existe un cliente con ese documento."); inDoc.focus(); return; }

      const cod = nextCode(data.clientes);
      data.clientes.push({ cod, tipoDoc, doc, nombre, tipo, dir, tel, correo, estado:"Activo" });
      save(data);

      toast(`Cliente ${cod} registrado.`);
      form.reset();
      ddTipoDoc.value = "DNI";
    });
  })();

  // --------------------- Mostrar Clientes ---------------------
  (function initMostrar() {
    const ddTipo = $("#list-tipo");
    const q      = $("#list-q");
    const tbody  = $("#list-body");
    const empty  = $("#list-empty");
    const detail = $("#cliente-detail");
    if (!ddTipo || !tbody) return;

    function cargarTipos(list) {
      const tipos = Array.from(new Set(list.map(c => c.tipo))).sort();
      ddTipo.innerHTML = `<option value="">(Todos)</option>` + tipos.map(t => `<option>${t}</option>`).join("");
    }

    function filtrar(list) {
      const t = ddTipo.value;
      const s = (q.value || "").trim().toLowerCase();
      return list.filter(c => {
        if (t && c.tipo !== t) return false;
        if (!s) return true;
        return c.nombre.toLowerCase().includes(s) || c.doc.toLowerCase().includes(s);
      });
    }

    function render(list) {
      tbody.innerHTML = "";
      if (!list.length) { empty.style.display = "block"; return; }
      empty.style.display = "none";
      const frag = document.createDocumentFragment();
      list.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${c.cod}</td>
          <td>${c.nombre}</td>
          <td>${c.tipoDoc} ${c.doc}</td>
          <td>${c.tipo}</td>
          <td>${c.estado}</td>
          <td><button class="btn mid ver-cli" data-cod="${c.cod}">Seleccionar</button></td>
        `;
        frag.appendChild(tr);
      });
      tbody.appendChild(frag);
    }

    function showDetail(c) {
      detail.innerHTML = `
        <div class="card" style="margin-top:12px">
          <h2>Detalle del cliente</h2>
          <div class="grid cols-2">
            <div><b>Código:</b> ${c.cod}</div>
            <div><b>Documento:</b> ${c.tipoDoc} ${c.doc}</div>
            <div><b>Nombre/Razón social:</b> ${c.nombre}</div>
            <div><b>Tipo:</b> ${c.tipo}</div>
            <div><b>Estado:</b> ${c.estado}</div>
            <div><b>Teléfono:</b> ${c.tel || "—"}</div>
            <div class="grow"><b>Dirección:</b> ${c.dir || "—"}</div>
            <div class="grow"><b>Correo:</b> ${c.correo || "—"}</div>
          </div>
        </div>`;
    }

    const db0 = load();
    cargarTipos(db0.clientes);
    render(db0.clientes);

    ddTipo.addEventListener("change", () => render(filtrar(load().clientes)));
    q.addEventListener("input", () => render(filtrar(load().clientes)));

    // Click en “Seleccionar” (antes era “Ver”)
    tbody.addEventListener("click", (ev) => {
      const b = ev.target.closest(".ver-cli");
      if (!b) return;
      const c = byCode(load().clientes, b.dataset.cod);
      if (c) {
        // Comportamiento por defecto: mostrar detalle en esta misma página
        showDetail(c);
        // Si por diseño futuro esta tabla se usara dentro de “Modificar” (misma página),
        // intentamos llenar el formulario si existe:
        fillModificarFormIfPresent(c);
      }
    });
  })();

  // --------------------- Modificar Cliente ---------------------
  (function initModificar() {
    const inpQ   = $("#mod-q");
    const resDiv = $("#mod-results");
    const form   = $("#mod-form");
    if (!form) return;

    const fCod = $("#mod-cod"), fDoc = $("#mod-doc"), fNom = $("#mod-nombre");
    const ddTipo = $("#mod-tipo"), fDir = $("#mod-dir"), fTel = $("#mod-tel"), fMail = $("#mod-correo");

    // Llenar tipos
    fillOptions(ddTipo, load().tipos, "— Seleccionar —");

    // 1) Modo “buscador + lista de resultados con Seleccionar”
    if (inpQ && resDiv) {
      function buscar(t) {
        const s = (t || "").trim().toLowerCase();
        if (!s) return [];
        return load().clientes.filter(c =>
          c.doc.toLowerCase().includes(s) || c.nombre.toLowerCase().includes(s)
        ).slice(0, 12);
      }

      function renderResultados(list) {
        resDiv.innerHTML = "";
        if (!list.length) { resDiv.innerHTML = `<div class="alert">Sin coincidencias.</div>`; return; }
        const frag = document.createDocumentFragment();
        list.forEach(c => {
          const row = document.createElement("div");
          row.className = "row";
          row.style.cssText = "justify-content:space-between;align-items:center;border-bottom:1px solid var(--line);padding:6px 0;";
          row.innerHTML = `
            <div>
              <b>${c.cod}</b> · ${c.nombre} · ${c.tipoDoc} ${c.doc}
              <span class="tag">${c.tipo}</span> <span class="tag">${c.estado}</span>
            </div>
            <div><button class="btn mid sel-mod" data-cod="${c.cod}">Seleccionar</button></div>
          `;
          frag.appendChild(row);
        });
        resDiv.appendChild(frag);
      }

      inpQ.addEventListener("input", () => renderResultados(buscar(inpQ.value)));
      resDiv.addEventListener("click", (ev) => {
        const b = ev.target.closest(".sel-mod");
        if (!b) return;
        const c = byCode(load().clientes, b.dataset.cod);
        if (c) fillModificarForm(c, { toastMsg: true });
      });
    }

    // 2) Modo “tabla embebida” (compat): si en esta misma página hay un #list-body
    // porque se migró el listado aquí, entonces el botón “Seleccionar” también llenará el form.
    const tableBodyCompat = $("#list-body");
    if (tableBodyCompat) {
      tableBodyCompat.addEventListener("click", (ev) => {
        const btn = ev.target.closest("button[data-cod], .ver-cli");
        if (!btn) return;
        const cod = btn.dataset.cod;
        const c = byCode(load().clientes, cod);
        if (c) fillModificarForm(c, { toastMsg: true });
      });
    }

    // Guardar cambios
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = load();
      const cl = byCode(data.clientes, fCod.value);
      if (!cl) { toast("Selecciona un cliente primero."); return; }

      if (fMail.value && !isEmail(fMail.value)) { toast("Correo inválido."); fMail.focus(); return; }
      if (fTel.value && !isPhonePE(fTel.value)) { toast("Teléfono con formato no reconocido."); fTel.focus(); return; }

      cl.tipo   = ddTipo.value || cl.tipo;
      cl.dir    = (fDir.value || "").trim();
      cl.tel    = (fTel.value || "").trim();
      cl.correo = (fMail.value || "").trim();

      save(data);
      toast(`Cambios guardados para ${cl.cod}.`);
      form.reset();
    });

    // ---- utils de Modificar ----
    function fillModificarForm(c, { toastMsg=false } = {}) {
      fCod.value = c.cod;
      fDoc.value = `${c.tipoDoc} ${c.doc}`;
      fNom.value = c.nombre;
      ddTipo.value = c.tipo;
      fDir.value = c.dir || "";
      fTel.value = c.tel || "";
      fMail.value = c.correo || "";
      if (toastMsg) toast(`Cliente ${c.cod} cargado para edición.`);
    }

    // Permite a la sección “Mostrar” completar el form si comparten página (compat)
    window.fillModificarFormIfPresent = function(c) {
      if (fCod && fDoc && fNom && ddTipo) fillModificarForm(c, { toastMsg:true });
    };
  })();

  // --------------------- Dar de Baja Cliente ---------------------
  (function initBaja() {
    const q = $("#del-q");
    const tbody = $("#del-list");
    const empty = $("#del-empty");
    const tpl = $("#tpl-del-row");
    const form = $("#bc-form");
    if (!tbody || !tpl || !form) return;

    const fCod = $("#bc-cod"), fDoc = $("#bc-doc"), fNom = $("#bc-nom"), fEst = $("#bc-est"), fMot = $("#bc-motivo");
    const btnInac = $("#bc-inactivar");

    function fila(c) {
      const trFrag = tpl.content.cloneNode(true);
      const tr = trFrag.querySelector("tr");
      tr.querySelector('[data-col="cod"]').textContent = c.cod;
      tr.querySelector('[data-col="nom"]').textContent = c.nombre;
      tr.querySelector('[data-col="doc"]').textContent = `${c.tipoDoc} ${c.doc}`;
      tr.querySelector('[data-col="estado"]').textContent = c.estado;
      const btnSel = tr.querySelector('button[data-act="sel"]');
      btnSel.dataset.id = c.cod;
      return trFrag;
    }

    function render(list) {
      tbody.innerHTML = "";
      if (!list.length) { empty.style.display = "block"; return; }
      empty.style.display = "none";
      const frag = document.createDocumentFragment();
      list.forEach(c => frag.appendChild(fila(c)));
      tbody.appendChild(frag);
    }

    function filtrar(t) {
      const s = (t || "").trim().toLowerCase();
      const list = load().clientes;
      if (!s) return list;
      return list.filter(c =>
        c.nombre.toLowerCase().includes(s) || c.doc.toLowerCase().includes(s)
      );
    }

    render(load().clientes);
    q && q.addEventListener("input", () => render(filtrar(q.value)));

    // Click en ÚNICO botón rojo "Seleccionar"
    tbody.addEventListener("click", (ev) => {
      const b = ev.target.closest('button[data-act="sel"]');
      if (!b) return;
      const c = byCode(load().clientes, b.dataset.id);
      if (!c) return;
      fCod.value = c.cod;
      fDoc.value = `${c.tipoDoc} ${c.doc}`;
      fNom.value = c.nombre;
      fEst.value = c.estado;
      fMot.focus();
      toast(`Seleccionado ${c.cod}`);
    });

    // Dar de Baja (eliminar)
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const cod = (fCod.value || "").trim();
      if (!cod) { toast("Selecciona un cliente de la lista."); return; }
      if (!confirm(`¿Confirmas dar de baja definitiva al cliente ${cod}?`)) return;

      const data = load();
      const idx = data.clientes.findIndex(c => c.cod === cod);
      if (idx >= 0) {
        data.clientes.splice(idx, 1);
        save(data);
        render(filtrar(q?.value || ""));
        form.reset();
        toast(`Cliente ${cod} dado de baja.`);
      } else {
        toast("No se encontró el registro.");
      }
    });

    // Marcar como Inactivo
    btnInac && btnInac.addEventListener("click", () => {
      const cod = (fCod.value || "").trim();
      if (!cod) { toast("Selecciona un cliente de la lista."); return; }
      if (!confirm(`¿Confirmas marcar como INACTIVO al cliente ${cod}?`)) return;

      const data = load();
      const c = byCode(data.clientes, cod);
      if (!c) { toast("No se encontró el registro."); return; }
      c.estado = "Inactivo";
      save(data);
      render(filtrar(q?.value || ""));
      fEst.value = "Inactivo";
      toast(`Cliente ${cod} marcado como inactivo.`);
    });
  })();

})();
