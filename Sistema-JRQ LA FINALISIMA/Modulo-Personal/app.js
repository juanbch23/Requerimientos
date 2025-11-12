/* app.js · JR Químicos · Empleados
   - Registro: valida DNI único, genera código T-00XX incremental.
   - Mostrar: filtros por área/cargo/estado + búsqueda por nombre/DNI.
   - Modificar: busca, selecciona, edita y guarda.
   - Baja: tabla con ÚNICO botón rojo "Seleccionar" que rellena el form inferior;
           botones: "Dar de Baja…" (elimina) y "Marcar como Inactivo".
*/

(function () {
  "use strict";

  // ==========================
  // Utilidades básicas / Toast
  // ==========================
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function toast(msg) {
    const t = $("#toast");
    if (!t) return alert(msg);
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2000); // 2s
  }

  // ==========================
  // Persistencia empleados
  // ==========================
  const KEY = "jrq:empleados:v1";

  // Semilla coherente (12 empleados)
  const seed = {
    empleados: [
      { cod:"T-0001", dni:"74561234", nombres:"Ana Lucía",   apellidos:"Salazar Rojas",   area:"Producción", cargo:"Operario",            salario:1800.00, estado:"Activo",   fechaIngreso:"2025-01-15", direccion:"Av. Los Álamos 123", telefono:"+51 987 111 111" },
      { cod:"T-0002", dni:"72895412", nombres:"Carlos",      apellidos:"Pérez Torres",    area:"Ventas",     cargo:"Vendedor",            salario:2200.00, estado:"Activo",   fechaIngreso:"2025-02-03", direccion:"Jr. Lima 234",      telefono:"+51 987 222 222" },
      { cod:"T-0003", dni:"70654321", nombres:"María",       apellidos:"Quispe Rojas",    area:"Inventario", cargo:"Administrador",       salario:2600.00, estado:"Inactivo", fechaIngreso:"2024-11-22", direccion:"Calle Puno 56",     telefono:"+51 987 333 333" },
      { cod:"T-0004", dni:"71478596", nombres:"Diego",       apellidos:"Huamán Soto",     area:"Producción", cargo:"Operario",            salario:1850.00, estado:"Activo",   fechaIngreso:"2025-03-12", direccion:"Mza. A Lote 8",     telefono:"+51 987 444 444" },
      { cod:"T-0005", dni:"71234567", nombres:"Lucía",       apellidos:"Torres Ramos",    area:"Ventas",     cargo:"Vendedor",            salario:2250.00, estado:"Activo",   fechaIngreso:"2025-04-02", direccion:"Psj. Piura 90",     telefono:"+51 987 555 555" },
      { cod:"T-0006", dni:"70123456", nombres:"Pedro",       apellidos:"Alvarado Vera",   area:"Producción", cargo:"Jefe de Producción",  salario:3500.00, estado:"Activo",   fechaIngreso:"2025-01-28", direccion:"Cdra. 3, Arequipa", telefono:"+51 987 666 666" },
      { cod:"T-0007", dni:"76981234", nombres:"Valeria",     apellidos:"Campos León",     area:"Finanzas",   cargo:"Contador",            salario:3000.00, estado:"Activo",   fechaIngreso:"2025-03-25", direccion:"Av. Grau 777",      telefono:"+51 987 777 777" },
      { cod:"T-0008", dni:"76543219", nombres:"Hugo",        apellidos:"Paredes Díaz",    area:"Producción", cargo:"Operario",            salario:1900.00, estado:"Activo",   fechaIngreso:"2025-05-10", direccion:"Jr. Cusco 12",      telefono:"+51 987 888 888" },
      { cod:"T-0009", dni:"70987654", nombres:"Fiorella",    apellidos:"Chávez Gómez",    area:"Inventario", cargo:"Administrador",       salario:2650.00, estado:"Activo",   fechaIngreso:"2025-06-05", direccion:"Av. Petit 101",     telefono:"+51 987 999 999" },
      { cod:"T-0010", dni:"70012345", nombres:"Ignacio",     apellidos:"Fernández Rojo",  area:"Finanzas",   cargo:"Contador",            salario:3050.00, estado:"Activo",   fechaIngreso:"2025-06-19", direccion:"Calle Sol 404",     telefono:"+51 900 111 222" },
      { cod:"T-0011", dni:"75551234", nombres:"Estefany",    apellidos:"Poma Huertas",    area:"Producción", cargo:"Operario",            salario:1820.00, estado:"Activo",   fechaIngreso:"2025-07-01", direccion:"Mza B Lote 10",     telefono:"+51 900 222 333" },
      { cod:"T-0012", dni:"73334444", nombres:"Rodrigo",     apellidos:"Távara Núñez",    area:"Reportes",   cargo:"Administrador",       salario:2700.00, estado:"Activo",   fechaIngreso:"2025-07-18", direccion:"Av. Chile 800",     telefono:"+51 900 333 444" }
    ]
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        localStorage.setItem(KEY, JSON.stringify(seed));
        return JSON.parse(JSON.stringify(seed));
      }
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.empleados)) {
        localStorage.setItem(KEY, JSON.stringify(seed));
        return JSON.parse(JSON.stringify(seed));
      }
      return data;
    } catch {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return JSON.parse(JSON.stringify(seed));
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function nextCode(empleados) {
    // Genera siguiente T-00XX a partir del máximo existente
    let max = 0;
    empleados.forEach(e => {
      const m = String(e.cod || "").match(/^T-(\d{4})$/);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n > max) max = n;
      }
    });
    const next = (max + 1).toString().padStart(4, "0");
    return `T-${next}`;
  }

  function byCode(list, cod) {
    return list.find(e => e.cod === cod);
  }
  function byDni(list, dni) {
    return list.find(e => e.dni === dni);
  }

  function nombreCompleto(e) {
    return `${e.nombres} ${e.apellidos}`.trim();
  }

  // ==========================
  // Registrar Empleado (rt-*)
  // ==========================
  (function initRegistrar() {
    const form = $("#rt-form");
    if (!form) return;

    const dni = $("#rt-dni");
    const cod = $("#rt-codigo");
    const nom = $("#rt-nombres");
    const ape = $("#rt-apellidos");
    const dir = $("#rt-direccion");
    const tel = $("#rt-telefono");
    const area = $("#rt-area");
    const cargo = $("#rt-cargo");
    const sal = $("#rt-salario");
    const est = $("#rt-estado");
    const fec = $("#rt-fecha");

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = load();

      const vDni = (dni.value || "").trim();
      if (!/^\d{8}$/.test(vDni)) {
        toast("El DNI debe tener 8 dígitos.");
        dni.focus();
        return;
      }
      if (byDni(data.empleados, vDni)) {
        toast("El DNI ya existe en el sistema.");
        dni.focus();
        return;
      }

      let vCod = (cod.value || "").trim();
      if (!/^T-\d{4}$/.test(vCod)) {
        vCod = nextCode(data.empleados); // genera T-00XX
      }

      const reg = {
        cod: vCod,
        dni: vDni,
        nombres: (nom.value || "").trim(),
        apellidos: (ape.value || "").trim(),
        direccion: (dir.value || "").trim(),
        telefono: (tel.value || "").trim(),
        area: area.value,
        cargo: cargo.value,
        salario: parseFloat(sal.value || "0") || 0,
        estado: est.value,
        fechaIngreso: fec.value || new Date().toISOString().slice(0, 10)
      };

      data.empleados.push(reg);
      save(data);
      toast(`Empleado ${reg.cod} registrado.`);
      form.reset();
    });
  })();

  // ==========================
  // Mostrar Empleado (lt-*)
  // ==========================
  (function initListar() {
    const tbody = $("#lt-table tbody");
    if (!tbody) return;

    const ddArea = $("#lt-area");
    const ddCargo = $("#lt-cargo");
    const ddEstado = $("#lt-estado");
    const inpQ = $("#lt-q");
    const empty = $("#lt-empty");
    const detail = $("#lt-detail");

    function cargarFiltros(list) {
      const areas = Array.from(new Set(list.map(e => e.area))).sort();
      const cargos = Array.from(new Set(list.map(e => e.cargo))).sort();
      ddArea.innerHTML = `<option value="">(Todas)</option>` + areas.map(a => `<option>${a}</option>`).join("");
      ddCargo.innerHTML = `<option value="">(Todos)</option>` + cargos.map(c => `<option>${c}</option>`).join("");
    }

    function filtrar(list) {
      const a = ddArea.value;
      const c = ddCargo.value;
      const s = ddEstado.value;
      const q = (inpQ.value || "").trim().toLowerCase();

      return list.filter(e => {
        if (a && e.area !== a) return false;
        if (c && e.cargo !== c) return false;
        if (s && e.estado !== s) return false;

        if (q) {
          const hay = (
            e.dni.toLowerCase().includes(q) ||
            nombreCompleto(e).toLowerCase().includes(q)
          );
          if (!hay) return false;
        }
        return true;
      });
    }

    function render(list) {
      tbody.innerHTML = "";
      if (!list.length) {
        empty.style.display = "block";
        return;
      }
      empty.style.display = "none";

      list.forEach(e => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${e.cod}</td>
          <td>${nombreCompleto(e)}</td>
          <td>${e.dni}</td>
          <td>${e.area}</td>
          <td>${e.cargo}</td>
          <td>S/ ${e.salario.toFixed(2)}</td>
          <td>${e.estado}</td>
          <td>
            <button class="btn mid ver-det" data-cod="${e.cod}">Ver</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function mostrarDetalle(e) {
      detail.innerHTML = `
        <div class="card" style="margin-top:12px">
          <h2>Detalle del empleado</h2>
          <div class="grid cols-2">
            <div><b>Código:</b> ${e.cod}</div>
            <div><b>DNI:</b> ${e.dni}</div>
            <div><b>Nombre:</b> ${nombreCompleto(e)}</div>
            <div><b>Área / Cargo:</b> ${e.area} / ${e.cargo}</div>
            <div><b>Salario:</b> S/ ${e.salario.toFixed(2)}</div>
            <div><b>Estado:</b> ${e.estado}</div>
            <div><b>Ingreso:</b> ${e.fechaIngreso}</div>
            <div><b>Teléfono:</b> ${e.telefono || "—"}</div>
            <div class="grow"><b>Dirección:</b> ${e.direccion || "—"}</div>
          </div>
        </div>
      `;
    }

    const data = load();
    cargarFiltros(data.empleados);
    render(data.empleados);

    ddArea.addEventListener("change", () => render(filtrar(data.empleados)));
    ddCargo.addEventListener("change", () => render(filtrar(data.empleados)));
    ddEstado.addEventListener("change", () => render(filtrar(data.empleados)));
    inpQ.addEventListener("input", () => render(filtrar(data.empleados)));

    // Ver detalle
    tbody.addEventListener("click", (ev) => {
      const b = ev.target.closest(".ver-det");
      if (!b) return;
      const emp = byCode(load().empleados, b.dataset.cod);
      if (emp) mostrarDetalle(emp);
    });
  })();

  // ==========================
  // Modificar Empleado (mt-*)
  // ==========================
  (function initModificar() {
    const q = $("#mt-q");
    const results = $("#mt-results");
    const form = $("#mt-form");
    if (!q || !results || !form) return;

    const fCod = $("#mt-codigo");
    const fDni = $("#mt-dni");
    const fNom = $("#mt-nombre");
    const fEst = $("#mt-estado");
    const fDir = $("#mt-dir");
    const fArea = $("#mt-area");
    const fCargo = $("#mt-cargo");
    const fSal = $("#mt-salario");
    const btnCancel = $("#mt-cancel");

    function buscar(term) {
      const data = load().empleados;
      const t = (term || "").trim().toLowerCase();
      if (!t) return [];
      return data.filter(e =>
        e.dni.toLowerCase().includes(t) ||
        nombreCompleto(e).toLowerCase().includes(t)
      ).slice(0, 10);
    }

    function renderResultados(list) {
      results.innerHTML = "";
      if (!list.length) {
        results.innerHTML = `<div class="alert">Sin coincidencias.</div>`;
        return;
      }
      const frag = document.createDocumentFragment();
      list.forEach(e => {
        const row = document.createElement("div");
        row.className = "row";
        row.style.cssText = "justify-content:space-between;align-items:center;border-bottom:1px solid var(--line);padding:6px 0;";
        row.innerHTML = `
          <div>
            <b>${e.cod}</b> · ${nombreCompleto(e)} · DNI ${e.dni}
            <span class="tag">${e.area}</span>
            <span class="tag">${e.cargo}</span>
            <span class="tag">${e.estado}</span>
          </div>
          <div>
            <button class="btn mid sel-mod" data-cod="${e.cod}">Seleccionar</button>
          </div>
        `;
        frag.appendChild(row);
      });
      results.appendChild(frag);
    }

    q.addEventListener("input", () => {
      renderResultados(buscar(q.value));
    });

    results.addEventListener("click", (ev) => {
      const b = ev.target.closest(".sel-mod");
      if (!b) return;
      const emp = byCode(load().empleados, b.dataset.cod);
      if (!emp) return;

      fCod.value = emp.cod;
      fDni.value = emp.dni;
      fNom.value = nombreCompleto(emp);
      fEst.value = emp.estado;
      fDir.value = emp.direccion || "";
      fArea.value = emp.area;
      fCargo.value = emp.cargo;
      fSal.value = String(emp.salario || "");
      toast(`Empleado ${emp.cod} cargado para edición.`);
    });

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = load();
      const emp = byCode(data.empleados, fCod.value);
      if (!emp) { toast("Selecciona un empleado primero."); return; }

      // Actualiza campos editables
      emp.estado    = fEst.value;
      emp.direccion = (fDir.value || "").trim();
      emp.area      = fArea.value;
      emp.cargo     = fCargo.value;
      emp.salario   = parseFloat(fSal.value || "0") || 0;

      save(data);
      toast(`Cambios guardados para ${emp.cod}.`);
    });

    btnCancel && btnCancel.addEventListener("click", () => {
      form.reset();
      toast("Edición cancelada.");
    });
  })();

  // ==========================
  // Baja Empleado (et-*)
  // ==========================
  (function initBaja() {
    const tbody = $("#et-body");
    const q = $("#et-q");
    const empty = $("#et-empty");
    const form = $("#et-form");
    const fCod = $("#et-cod");
    const fDni = $("#et-dni");
    const fNom = $("#et-nom");
    const fEst = $("#et-est");
    const fMot = $("#et-motivo");
    const btnInactivar = $("#et-inactivar");

    if (!tbody || !q || !form) return;

    function fila(emp) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${emp.cod}</td>
        <td>${nombreCompleto(emp)}</td>
        <td>${emp.dni}</td>
        <td>${emp.area}</td>
        <td>${emp.cargo}</td>
        <td>${emp.estado}</td>
        <td>
          <button class="btn danger et-select"
                  data-cod="${emp.cod}"
                  data-dni="${emp.dni}"
                  data-nom="${nombreCompleto(emp)}"
                  data-est="${emp.estado}">
            Seleccionar
          </button>
        </td>
      `;
      return tr;
    }

    function render(list) {
      tbody.innerHTML = "";
      if (!list.length) {
        empty.style.display = "block";
        return;
      }
      empty.style.display = "none";
      const frag = document.createDocumentFragment();
      list.forEach(e => frag.appendChild(fila(e)));
      tbody.appendChild(frag);
    }

    function filtrar(term) {
      const t = (term || "").trim().toLowerCase();
      const data = load().empleados;
      if (!t) return data;
      return data.filter(e =>
        e.dni.toLowerCase().includes(t) ||
        nombreCompleto(e).toLowerCase().includes(t)
      );
    }

    // Carga inicial
    render(load().empleados);

    // Búsqueda
    q.addEventListener("input", () => {
      render(filtrar(q.value));
    });

    // Seleccionar -> rellena form
    tbody.addEventListener("click", (ev) => {
      const b = ev.target.closest(".et-select");
      if (!b) return;
      fCod.value = b.dataset.cod || "";
      fDni.value = b.dataset.dni || "";
      fNom.value = b.dataset.nom || "";
      fEst.value = b.dataset.est || "";
      fMot.focus();
      toast(`Seleccionado ${fCod.value}`);
    });

    // Dar de Baja (elimina registro)
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const cod = (fCod.value || "").trim();
      if (!cod) { toast("Selecciona un empleado de la lista."); return; }

      if (!confirm(`¿Confirmas dar de baja definitiva al empleado ${cod}?`)) return;

      const data = load();
      const idx = data.empleados.findIndex(e => e.cod === cod);
      if (idx >= 0) {
        data.empleados.splice(idx, 1);
        save(data);
        render(filtrar(q.value)); // refresca lista con filtro actual
        form.reset();
        toast(`Empleado ${cod} dado de baja.`);
      } else {
        toast("No se encontró el registro.");
      }
    });

    // Marcar como Inactivo
    btnInactivar && btnInactivar.addEventListener("click", () => {
      const cod = (fCod.value || "").trim();
      if (!cod) { toast("Selecciona un empleado de la lista."); return; }
      if (!confirm(`¿Confirmas marcar como INACTIVO al empleado ${cod}?`)) return;

      const data = load();
      const emp = byCode(data.empleados, cod);
      if (!emp) { toast("No se encontró el registro."); return; }

      emp.estado = "Inactivo";
      save(data);
      render(filtrar(q.value));
      fEst.value = "Inactivo";
      toast(`Empleado ${cod} marcado como inactivo.`);
    });
  })();

})();
