/* app-prod.js · JR Químicos · Módulo Producción
   Páginas soportadas:
   - Validar OP (registrar-orden.html):      #frm, #prod, #qty, #ini, #fin, #tbl-req, #avail, #resumen
   - Asignar recursos (asignar-recursos):    #frm-recursos, #r-op, #r-operario, #r-maq, #r-turno, #r-desde, #r-hasta
   - Actualizar estado (actualizar-estado):  #av-q, #av-body, #av-empty, template#tpl-av-row
   - Monitorear orden (monitorear-orden):    #av-q, #av-estado, #av-operario, #av-desde, #av-hasta, #av-filtrar, #av-body, template#tpl-avance-row

   Estándares recordados:
   - Estados: Planeada, En proceso, En pausa, QC, Completada, Cancelada.
   - Botón azul “Guardar estado” que persiste el cambio.
*/

(function () {
  "use strict";

  // --------------------- Helpers ---------------------
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function toast(msg) {
    const t = $("#toast");
    if (!t) return console.log("[toast]", msg);
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2000);
  }

  const fmtDate = (d) => {
    if (!d) return "—";
    const dt = (d instanceof Date) ? d : new Date(d);
    if (isNaN(dt.getTime())) return "—";
    // yyyy-mm-dd (para mostrar simple)
    return dt.toISOString().slice(0, 10);
  };

  const overlap = (aStart, aEnd, bStart, bEnd) => {
    const A1 = new Date(aStart).getTime();
    const A2 = new Date(aEnd).getTime();
    const B1 = new Date(bStart).getTime();
    const B2 = new Date(bEnd).getTime();
    if ([A1,A2,B1,B2].some(isNaN)) return false;
    return (A1 <= B2) && (B1 <= A2);
  };

  // --------------------- Storage ---------------------
  const KEY = "jrq:prod:v1";
  const seed = {
    // Catálogo de productos y BOM (unidades por 1 unidad de producto)
    productos: [
      { id:"PR-0001", nombre:"Detergente Líquido 1L" },
      { id:"PR-0002", nombre:"Lavavajillas 500ml" },
      { id:"PR-0003", nombre:"Desinfectante 1L" }
    ],
    bom: {
      "PR-0001": [
        { insumo:"Agua destilada", unidad:"L", porUnidad:0.80, stock:1200, reservado:100 },
        { insumo:"Tensoactivo",   unidad:"kg", porUnidad:0.12, stock:300,  reservado:10  },
        { insumo:"Fragancia",     unidad:"ml", porUnidad:3.00, stock:5000, reservado:200 },
        { insumo:"Botella 1L",    unidad:"u",  porUnidad:1.00, stock:1500, reservado:50  },
        { insumo:"Tapa 1L",       unidad:"u",  porUnidad:1.00, stock:1600, reservado:60  },
        { insumo:"Etiqueta 1L",   unidad:"u",  porUnidad:1.00, stock:1700, reservado:70  }
      ],
      "PR-0002": [
        { insumo:"Base lavavajillas", unidad:"ml", porUnidad:350, stock:200000, reservado:2000 },
        { insumo:"Tensioactivo A",    unidad:"ml", porUnidad:80,  stock:80000,  reservado:1000 },
        { insumo:"Botella 500ml",     unidad:"u",  porUnidad:1,   stock:8000,   reservado:500  }
      ],
      "PR-0003": [
        { insumo:"Base amonio cuaternario", unidad:"ml", porUnidad:900, stock:100000, reservado:500 },
        { insumo:"Envase 1L",               unidad:"u",  porUnidad:1,   stock:6000,   reservado:100 }
      ]
    },

    // Operarios, maquinaria y turnos disponibles
    operarios: [
      { id:"T-0003", nombre:"S. Paredes" },
      { id:"T-0007", nombre:"D. Huamán"  },
      { id:"T-0011", nombre:"F. Chávez"  }
    ],
    maquinaria: [
      { id:"MQ-01", nombre:"Mezcladora A" },
      { id:"MQ-02", nombre:"Mezcladora B" },
      { id:"L-ENVS", nombre:"Línea Envasado" }
    ],
    turnos: ["Mañana (06-14)", "Tarde (14-22)", "Noche (22-06)"],

    // OPs registradas (muestra)
    ops: [
      { op:"OP-2025-0001", producto:"PR-0001", cantidad: 500, ini:"2025-11-05", fin:"2025-11-12" },
      { op:"OP-2025-0002", producto:"PR-0002", cantidad: 800, ini:"2025-11-07", fin:"2025-11-14" },
      { op:"OP-2025-0003", producto:"PR-0003", cantidad: 300, ini:"2025-11-09", fin:"2025-11-15" }
    ],

    // Estado y progreso por OP
    estado: [
      { op:"OP-2025-0001", estado:"En proceso", progreso:35 },
      { op:"OP-2025-0002", estado:"Planeada",   progreso:0  },
      { op:"OP-2025-0003", estado:"QC",         progreso:80 }
    ],

    // Asignaciones de recursos por OP
    asignaciones: [
      { op:"OP-2025-0001", operario:"T-0003", maquinaria:"MQ-01", turno:"Mañana (06-14)", desde:"2025-11-06", hasta:"2025-11-10" },
      { op:"OP-2025-0002", operario:"T-0007", maquinaria:"MQ-02", turno:"Tarde (14-22)",  desde:"2025-11-08", hasta:"2025-11-13" }
    ]
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return JSON.parse(JSON.stringify(seed)); }
      const data = JSON.parse(raw);
      // saneo básico
      ["productos","bom","ops","estado","asignaciones","operarios","maquinaria","turnos"].forEach(k=>{
        if (data[k] == null) data[k] = JSON.parse(JSON.stringify(seed[k]));
      });
      return data;
    } catch {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return JSON.parse(JSON.stringify(seed));
    }
  }
  function save(data) { localStorage.setItem(KEY, JSON.stringify(data)); }

  // --------------------- Utilidades de negocio ---------------------
  function nextOpCode(list) {
    // OP-YYYY-#### incremental por año
    const year = (new Date()).getFullYear();
    let max = 0;
    list.forEach(x => {
      const m = String(x.op||"").match(/^OP-(\d{4})-(\d{4})$/);
      if (m && +m[1] === year) max = Math.max(max, parseInt(m[2],10));
    });
    return `OP-${year}-${String(max+1).padStart(4,"0")}`;
  }

  function opLookup(op) {
    const db = load();
    return {
      op: db.ops.find(o => o.op === op) || null,
      est: db.estado.find(e => e.op === op) || null,
      asg: db.asignaciones.find(a => a.op === op) || null
    };
  }

  function nombreProd(id) {
    const p = load().productos.find(x => x.id === id);
    return p ? p.nombre : id;
  }

  // --------------------- VALIDAR OP ---------------------
  (function initValidarOP(){
    const form = $("#frm");
    const ddProd = $("#prod");
    const inQty  = $("#qty");
    const inIni  = $("#ini");
    const inFin  = $("#fin");
    const tblReq = $("#tbl-req tbody");
    const avail  = $("#avail");
    const resumen = $("#resumen");
    if (!form || !ddProd || !tblReq) return;

    // Llenar productos
    const db0 = load();
    ddProd.innerHTML = db0.productos.map(p => `<option value="${p.id}">${p.nombre}</option>`).join("");

    function renderBOM() {
      const db = load();
      const pid = ddProd.value;
      const qty = Math.max(1, parseInt(inQty.value||"1",10) || 1);
      const lista = db.bom[pid] || [];
      let okGlobal = true;
      const rows = lista.map(it => {
        const req = it.porUnidad * qty;
        const disponible = it.stock - it.reservado;
        const ok = disponible >= req;
        if (!ok) okGlobal = false;
        const estado = ok ? `<span class="tag">OK</span>` : `<span class="tag danger">Falta</span>`;
        return `<tr>
          <td>${it.insumo}</td>
          <td>${it.unidad}</td>
          <td>${req.toFixed(2)}</td>
          <td>${it.stock}</td>
          <td>${it.reservado}</td>
          <td>${disponible.toFixed(2)}</td>
          <td>${estado}</td>
        </tr>`;
      }).join("");
      tblReq.innerHTML = rows || `<tr><td colspan="7">No hay BOM definido.</td></tr>`;
      avail.className = okGlobal ? "alert success" : "alert danger";
      avail.textContent = okGlobal ? "Insumos suficientes para la producción." : "Faltan insumos para la cantidad solicitada.";
    }

    ddProd.addEventListener("change", renderBOM);
    inQty.addEventListener("input", renderBOM);
    renderBOM();

    form.addEventListener("submit", (ev)=>{
      ev.preventDefault();
      const db = load();
      const pid = ddProd.value;
      const qty = Math.max(1, parseInt(inQty.value||"1",10) || 1);
      const ini = inIni.value || fmtDate(new Date());
      const fin = inFin.value || fmtDate(new Date(Date.now()+3*86400000));

      // Validar disponibilidad (si hay algún "Falta", bloquear)
      const lista = (db.bom[pid]||[]);
      const falta = lista.some(it => (it.stock - it.reservado) < (it.porUnidad*qty));
      if (falta) { toast("No se puede validar: faltan insumos."); return; }

      const code = nextOpCode(db.ops);
      db.ops.push({ op:code, producto:pid, cantidad:qty, ini, fin });
      db.estado.push({ op:code, estado:"Planeada", progreso:0 });
      save(db);

      resumen.innerHTML = `
        <div class="card">
          <h2>OP registrada</h2>
          <div class="grid cols-2">
            <div><b>OP:</b> ${code}</div>
            <div><b>Producto:</b> ${nombreProd(pid)}</div>
            <div><b>Cantidad:</b> ${qty}</div>
            <div><b>Rango:</b> ${ini} → ${fin}</div>
            <div><b>Estado inicial:</b> Planeada</div>
          </div>
        </div>`;
      toast(`OP ${code} validada.`);
      // Opcional: reset parcial
      // form.reset();
      renderBOM();
    });
  })();

  // --------------------- ASIGNAR RECURSOS ---------------------
  (function initAsignar(){
    const form = $("#frm-recursos");
    const ddOP = $("#r-op"), ddOper = $("#r-operario"), ddMaq = $("#r-maq"), ddTurno = $("#r-turno");
    const inDesde = $("#r-desde"), inHasta = $("#r-hasta");
    if (!form || !ddOP) return;

    function cargarCombos() {
      const db = load();
      ddOP.innerHTML   = db.ops.map(x => `<option value="${x.op}">${x.op} · ${nombreProd(x.producto)}</option>`).join("");
      ddOper.innerHTML = db.operarios.map(o => `<option value="${o.id}">${o.id} · ${o.nombre}</option>`).join("");
      ddMaq.innerHTML  = db.maquinaria.map(m => `<option value="${m.id}">${m.id} · ${m.nombre}</option>`).join("");
      ddTurno.innerHTML = db.turnos.map(t => `<option>${t}</option>`).join("");
    }
    cargarCombos();

    form.addEventListener("submit",(ev)=>{
      ev.preventDefault();
      const db = load();
      const op = ddOP.value;
      const oper = ddOper.value;
      const maq  = ddMaq.value;
      const turno = ddTurno.value;
      const desde = inDesde.value;
      const hasta = inHasta.value;

      if (!op || !oper || !maq || !turno || !desde || !hasta) { toast("Completa todos los campos."); return; }

      // Validar solapes operario / maquinaria
      const solape = db.asignaciones.some(a =>
        (a.operario===oper && overlap(a.desde,a.hasta,desde,hasta)) ||
        (a.maquinaria===maq && overlap(a.desde,a.hasta,desde,hasta))
      );
      if (solape) { toast("Solape detectado en agenda (operario o maquinaria)."); return; }

      const idx = db.asignaciones.findIndex(a => a.op === op);
      const reg = { op, operario:oper, maquinaria:maq, turno, desde, hasta };
      if (idx>=0) db.asignaciones[idx] = reg; else db.asignaciones.push(reg);
      save(db);
      toast(`Asignación guardada para ${op}.`);
      // form.reset();  // opcional
    });
  })();

  // --------------------- ACTUALIZAR ESTADO ---------------------
  (function initActualizarEstado(){
    const q = $("#av-q");
    const tbody = $("#av-body");
    const empty = $("#av-empty");
    const tpl = $("#tpl-av-row");
    if (!tbody || !tpl) return;

    const ESTADOS = ["Planeada", "En proceso", "En pausa", "QC", "Completada", "Cancelada"];

    function fila(opItem, estItem) {
      const pNombre = nombreProd(opItem.producto);
      const rango = `${fmtDate(opItem.ini)} → ${fmtDate(opItem.fin)}`;
      const prog  = (estItem?.progreso ?? 0);
      const estado = estItem?.estado || "Planeada";

      const frag = tpl.content.cloneNode(true);
      const tr = frag.querySelector("tr");
      tr.querySelector('[data-col="op"]').textContent = opItem.op;
      tr.querySelector('[data-col="prod"]').textContent = pNombre;
      tr.querySelector('[data-col="cant"]').textContent = opItem.cantidad;
      tr.querySelector('[data-col="fechas"]').textContent = rango;
      tr.querySelector('[data-col="prog"]').textContent = `${prog}%`;
      tr.querySelector('[data-col="estado"]').textContent = estado;

      // Acción: combo + guardar
      const sel = tr.querySelector("select.av-estado");
      const btn = tr.querySelector("button.av-save");
      sel.innerHTML = ESTADOS.map(e => `<option${e===estado?" selected":""}>${e}</option>`).join("");
      sel.dataset.op = opItem.op;
      btn.dataset.op = opItem.op;
      return frag;
    }

    function listaFiltrada() {
      const s = (q?.value || "").trim().toLowerCase();
      const db = load();
      let list = db.ops.slice();
      if (s) {
        list = list.filter(o => {
          const prodName = nombreProd(o.producto).toLowerCase();
          return o.op.toLowerCase().includes(s) || prodName.includes(s);
        });
      }
      return list.map(o => ({ op:o, est: load().estado.find(e => e.op===o.op) || null }));
    }

    function render() {
      const data = listaFiltrada();
      tbody.innerHTML = "";
      if (!data.length) { empty.style.display="block"; return; }
      empty.style.display="none";
      const frag = document.createDocumentFragment();
      data.forEach(({op, est}) => frag.appendChild(fila(op, est)));
      tbody.appendChild(frag);
    }

    q && q.addEventListener("input", render);
    tbody.addEventListener("click", (ev)=>{
      const btn = ev.target.closest(".av-save");
      if (!btn) return;
      const op = btn.dataset.op;
      const sel = btn.closest("td").querySelector('select.av-estado[data-op="'+op+'"]');
      const nuevo = sel ? sel.value : null;
      if (!nuevo) return;

      const db = load();
      let est = db.estado.find(e => e.op===op);
      if (!est) { est = { op, estado:nuevo, progreso:0 }; db.estado.push(est); }
      else { est.estado = nuevo; if (nuevo==="Completada") est.progreso = 100; }
      save(db);
      toast(`Estado guardado (${op}: ${nuevo}).`);
      render();
    });

    render();
  })();

  // --------------------- MONITOREAR ORDEN ---------------------
  (function initMonitorear(){
    const q = $("#av-q");
    const ddEstado = $("#av-estado");
    const ddOper   = $("#av-operario");
    const dDesde   = $("#av-desde");
    const dHasta   = $("#av-hasta");
    const btnFil   = $("#av-filtrar");
    const tbody    = $("#av-body");
    const tpl      = $("#tpl-avance-row");
    const empty    = $("#av-empty");
    if (!tbody || !tpl) return;

    // Poblar operarios únicos
    (function cargarOperarios(){
      if (!ddOper) return;
      const ops = load().operarios;
      ddOper.innerHTML = `<option value="">(Todos)</option>` + ops.map(o=>`<option value="${o.id}">${o.id} · ${o.nombre}</option>`).join("");
    })();

    function fila(opItem, estItem, asgItem) {
      const frag = tpl.content.cloneNode(true);
      const rango = `${fmtDate(opItem.ini)} → ${fmtDate(opItem.fin)}`;
      const prog  = (estItem?.progreso ?? 0);
      const estado = estItem?.estado || "Planeada";

      frag.querySelector('[data-col="op"]').textContent = opItem.op;
      frag.querySelector('[data-col="producto"]').textContent = nombreProd(opItem.producto);
      frag.querySelector('[data-col="cantidad"]').textContent = opItem.cantidad;
      frag.querySelector('[data-col="fechas"]').textContent = rango;
      frag.querySelector('[data-col="progreso"]').textContent = `${prog}%`;
      frag.querySelector('[data-col="estado"]').textContent = estado;
      frag.querySelector('[data-col="operario"]').textContent = asgItem?.operario || "—";
      frag.querySelector('[data-col="maquinaria"]').textContent = asgItem?.maquinaria || "—";
      frag.querySelector('[data-col="turno"]').textContent = asgItem?.turno || "—";
      frag.querySelector('[data-col="programacion"]').textContent =
        asgItem ? `${fmtDate(asgItem.desde)} → ${fmtDate(asgItem.hasta)}` : "—";

      // Acciones sugeridas
      const row = frag.querySelector("tr");
      row.querySelectorAll("[data-op]").forEach(b => b.dataset.op = opItem.op);
      return frag;
    }

    function filtrar() {
      const s = (q?.value || "").trim().toLowerCase();
      const fEstado = ddEstado?.value || "";
      const fOper   = ddOper?.value || "";
      const fDesde  = dDesde?.value || "";
      const fHasta  = dHasta?.value || "";

      const db = load();
      let list = db.ops.map(o => ({ 
        op:o, 
        est: db.estado.find(e => e.op===o.op) || null,
        asg: db.asignaciones.find(a => a.op===o.op) || null
      }));

      if (s) {
        list = list.filter(x => {
          const prodName = nombreProd(x.op.producto).toLowerCase();
          const opName = (x.asg ? x.asg.operario : "").toLowerCase();
          return x.op.op.toLowerCase().includes(s) || prodName.includes(s) || opName.includes(s);
        });
      }
      if (fEstado) list = list.filter(x => (x.est?.estado || "Planeada") === fEstado);
      if (fOper)   list = list.filter(x => (x.asg?.operario || "") === fOper);
      if (fDesde)  list = list.filter(x => !x.asg || !x.asg.desde || (new Date(x.asg.desde) >= new Date(fDesde)));
      if (fHasta)  list = list.filter(x => !x.asg || !x.asg.hasta || (new Date(x.asg.hasta) <= new Date(fHasta)));

      return list;
    }

    function render() {
      const data = filtrar();
      tbody.innerHTML = "";
      if (!data.length) { empty && (empty.style.display="block"); return; }
      empty && (empty.style.display="none");
      const frag = document.createDocumentFragment();
      data.forEach(x => frag.appendChild(fila(x.op, x.est, x.asg)));
      tbody.appendChild(frag);
    }

    q && q.addEventListener("input", render);
    btnFil && btnFil.addEventListener("click", render);
    [ddEstado, ddOper, dDesde, dHasta].forEach(el => el && el.addEventListener("change", render));
    render();
  })();

})();
