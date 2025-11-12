/* app-ventas.js  — JR Químicos · Módulo Ventas (demo con localStorage)
 * Cubre: Registrar, Mostrar, Modificar y Cancelar ventas.
 * Formatos: Cliente = CL-00XX, Producto = PR-00XX, Venta = VTA-2025-00XX
 */

/* ============================
   Utilidades
============================ */
const PEN = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });
const fmt = (n) => PEN.format(Number(n || 0));
const todayStr = () => new Date().toISOString().slice(0,10);
const dom = (sel) => document.querySelector(sel);
const domAll = (sel) => Array.from(document.querySelectorAll(sel));

function toast(msg, type="info") {
  const t = dom("#toast");
  if (!t) return alert(msg);
  t.textContent = msg;
  t.classList.remove("show","error","ok");
  if (type === "error") t.classList.add("error");
  if (type === "ok") t.classList.add("ok");
  requestAnimationFrame(()=> {
    t.classList.add("show");
    setTimeout(()=> t.classList.remove("show"), 2500);
  });
}

function lsGet(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function lsSet(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

/* ============================
   Datos semilla (demo)
============================ */
// Clientes (CL-00XX)
const seedClientes = [
  { id:"CL-0001", nombre:"Comercial Andina S.A.C.", ruc:"20512345678" },
  { id:"CL-0002", nombre:"Distribuidora Santa Rosa EIRL", ruc:"20600456789" },
  { id:"CL-0003", nombre:"Inversiones El Molino S.A.", ruc:"20112233445" },
];

// Productos (PR-00XX) con precio y stock (demo)
const seedProductos = [
  { id:"PR-0001", nombre:"Detergente Líquido 1L", precio: 9.50, stock: 240 },
  { id:"PR-0002", nombre:"Lejía 1L",            precio: 4.80, stock: 380 },
  { id:"PR-0003", nombre:"Suavizante 1L",       precio: 8.20, stock: 120 },
  { id:"PR-0004", nombre:"Desinfectante 900ml", precio: 7.40, stock: 90  },
  { id:"PR-0005", nombre:"Detergente en polvo 5kg", precio: 39.90, stock: 35 },
];

const formasPago = ["Contado", "Yape/Plin", "Transferencia", "Crédito 15d"];

// Ventas con formato VTA-2025-00XX
const seedVentas = [
  {
    id:"VTA-2025-0001",
    fecha:"2025-11-01",
    cliente:"CL-0001",
    pago:"Transferencia",
    obs:"Urgente",
    estado:"Registrada",
    cpe:null, // {tipo:"Factura", serie:"F001", numero:123} si existiera
    items:[
      { pr:"PR-0001", nombre:"Detergente Líquido 1L", precio:9.50, cant:10, subtotal:95.00 },
      { pr:"PR-0002", nombre:"Lejía 1L", precio:4.80, cant:5, subtotal:24.00 },
    ],
    totales:{ sub:119.00, igv:21.42, tot:140.42 }
  },
  {
    id:"VTA-2025-0002",
    fecha:"2025-11-03",
    cliente:"CL-0002",
    pago:"Contado",
    obs:"",
    estado:"Confirmada",
    cpe:{tipo:"Boleta", serie:"B001", numero:4567},
    items:[
      { pr:"PR-0003", nombre:"Suavizante 1L", precio:8.20, cant:8, subtotal:65.60 }
    ],
    totales:{ sub:65.60, igv:11.81, tot:77.41 }
  },
  {
    id:"VTA-2025-0003",
    fecha:"2025-11-05",
    cliente:"CL-0003",
    pago:"Crédito 15d",
    obs:"Entrega parcial",
    estado:"Facturada",
    cpe:{tipo:"Factura", serie:"F001", numero:2345},
    items:[
      { pr:"PR-0005", nombre:"Detergente en polvo 5kg", precio:39.90, cant:3, subtotal:119.70 }
    ],
    totales:{ sub:119.70, igv:21.55, tot:141.25 }
  }
];

/* Inicialización de almacenamiento */
(function initSeed(){
  if (!localStorage.getItem("clientes")) lsSet("clientes", seedClientes);
  if (!localStorage.getItem("productos")) lsSet("productos", seedProductos);
  if (!localStorage.getItem("ventas")) lsSet("ventas", seedVentas);
  if (!localStorage.getItem("ventas_seq")) {
    // establecer correlativo inicial basado en seed
    lsSet("ventas_seq", 3); // ya existen 3 ventas en la semilla
  }
})();

/* ============================
   Generación de códigos
============================ */
function nextVentaId(){
  let n = lsGet("ventas_seq", 0) + 1;
  lsSet("ventas_seq", n);
  // VTA-2025-00XX
  return `VTA-2025-${String(n).padStart(4,"0")}`;
}

/* ============================
   Repositorios (localStorage)
============================ */
const Repo = {
  clientes: () => lsGet("clientes", []),
  productos: () => lsGet("productos", []),
  ventas: () => lsGet("ventas", []),
  saveVentas: (arr) => lsSet("ventas", arr),
  updStock: (prId, delta) => {
    const prods = Repo.productos().map(p => {
      if (p.id === prId) return { ...p, stock: (p.stock ?? 0) + delta };
      return p;
    });
    lsSet("productos", prods);
  }
};

/* ============================
   Registrar Venta (rv-*)
============================ */
(function registrarVenta(){
  const form = dom("#rv-form");
  if (!form) return;

  const selCli = dom("#rv-cliente");
  const selPago = dom("#rv-pago");
  const tbody = dom("#rv-items");
  const btnAdd = dom("#rv-add");
  const vSub = dom("#rv-subtotal");
  const vIgv = dom("#rv-igv");
  const vTot = dom("#rv-total");

  const resumen = dom("#resumen");
  const rsVenta = dom("#rs-venta");
  const rsFecha = dom("#rs-fecha");
  const rsCliente = dom("#rs-cliente");
  const rsPago = dom("#rs-pago");
  const rsItems = dom("#rs-items");
  const rsSubtotal = dom("#rs-subtotal");
  const rsIgv = dom("#rs-igv");
  const rsTotal = dom("#rs-total");

  // poblar combos
  Repo.clientes().forEach(c=>{
    const op = document.createElement("option");
    op.value = c.id; op.textContent = `${c.nombre} (${c.id})`;
    selCli.appendChild(op);
  });
  formasPago.forEach(fp=>{
    const op = document.createElement("option");
    op.value = fp; op.textContent = fp;
    selPago.appendChild(op);
  });

  // helpers items
  function makeRow(){
    const tr = document.createElement("tr");

    const tdProd = document.createElement("td");
    const selProd = document.createElement("select");
    Repo.productos().forEach(p=>{
      const op = document.createElement("option");
      op.value = p.id; op.textContent = `${p.nombre} (${p.id})`;
      selProd.appendChild(op);
    });
    tdProd.appendChild(selProd);

    const tdPrecio = document.createElement("td");
    const inpPrecio = document.createElement("input");
    inpPrecio.type = "number"; inpPrecio.step="0.01"; inpPrecio.min="0";
    tdPrecio.appendChild(inpPrecio);

    const tdStock = document.createElement("td");
    const stockView = document.createElement("span");
    tdStock.appendChild(stockView);

    const tdCant = document.createElement("td");
    const inpCant = document.createElement("input");
    inpCant.type = "number"; inpCant.min = "1"; inpCant.value = "1";
    tdCant.appendChild(inpCant);

    const tdSub = document.createElement("td");
    const subView = document.createElement("span");
    tdSub.appendChild(subView);

    const tdAcc = document.createElement("td");
    const btnDel = document.createElement("button");
    btnDel.type="button"; btnDel.className="btn mid";
    btnDel.textContent="Quitar";
    tdAcc.appendChild(btnDel);

    tr.append(tdProd, tdPrecio, tdStock, tdCant, tdSub, tdAcc);

    function syncFromProduct(){
      const p = Repo.productos().find(x=> x.id === selProd.value);
      if (!p) return;
      inpPrecio.value = p.precio.toFixed(2);
      stockView.textContent = p.stock ?? 0;
      recalc();
    }

    function recalc(){
      const price = Number(inpPrecio.value || 0);
      const qty = Number(inpCant.value || 0);
      const sub = price * qty;
      subView.textContent = fmt(sub);
      recalcTotals();
    }

    function recalcTotals(){
      let sub=0;
      tbody.querySelectorAll("tr").forEach(row=>{
        const s = row.children[4].querySelector("span")?.textContent || "S/ 0.00";
        // bruto: leer de input para precisión
        const price = Number(row.children[1].querySelector("input").value || 0);
        const qty = Number(row.children[3].querySelector("input").value || 0);
        sub += price*qty;
      });
      const igv = +(sub*0.18).toFixed(2);
      const tot = +(sub+igv).toFixed(2);
      vSub.textContent = fmt(sub);
      vIgv.textContent = fmt(igv);
      vTot.textContent = fmt(tot);
    }

    selProd.addEventListener("change", syncFromProduct);
    inpPrecio.addEventListener("input", recalc);
    inpCant.addEventListener("input", recalc);
    btnDel.addEventListener("click", ()=> {
      tr.remove();
      recalcTotals();
    });

    syncFromProduct();
    return tr;
  }

  btnAdd?.addEventListener("click", ()=> {
    tbody.appendChild(makeRow());
  });

  // al cargar, agrega una fila
  btnAdd?.click();

  form.addEventListener("submit", (ev)=>{
    ev.preventDefault();
    if (!selCli.value) return toast("Selecciona un cliente.", "error");
    if (!tbody.children.length) return toast("Agrega al menos un producto.", "error");

    // Validar stock
    for (const tr of tbody.querySelectorAll("tr")){
      const pr = tr.children[0].querySelector("select").value;
      const qty = Number(tr.children[3].querySelector("input").value || 0);
      const p = Repo.productos().find(x=> x.id === pr);
      if (!p) return toast("Producto inválido.", "error");
      if ((p.stock ?? 0) < qty) {
        return toast(`Stock insuficiente para ${p.nombre} (${p.id}).`, "error");
      }
    }

    // Construir venta
    const id = nextVentaId();
    const fecha = todayStr();
    const cliente = selCli.value;
    const pago = selPago.value;
    const obs = ""; // en esta pantalla no pediste obs
    const items = [];
    let sub=0;

    tbody.querySelectorAll("tr").forEach(tr=>{
      const pr = tr.children[0].querySelector("select").value;
      const p = Repo.productos().find(x=> x.id === pr);
      const price = Number(tr.children[1].querySelector("input").value || 0);
      const qty = Number(tr.children[3].querySelector("input").value || 0);
      const subtotal = +(price*qty).toFixed(2);
      sub += subtotal;
      items.push({
        pr,
        nombre: p?.nombre || pr,
        precio: price,
        cant: qty,
        subtotal
      });
    });
    const igv = +(sub*0.18).toFixed(2);
    const tot = +(sub+igv).toFixed(2);

    // Descontar stock (demo)
    items.forEach(it => Repo.updStock(it.pr, -it.cant));

    // Guardar
    const ventas = Repo.ventas();
    ventas.push({
      id, fecha, cliente, pago, obs, estado:"Registrada", cpe:null, items,
      totales:{ sub:+sub.toFixed(2), igv, tot }
    });
    Repo.saveVentas(ventas);

    // Resumen
    const cli = Repo.clientes().find(c=> c.id===cliente);
    rsVenta.textContent = id;
    rsFecha.textContent = new Date().toLocaleString("es-PE");
    rsCliente.textContent = cli ? `${cli.nombre} (${cli.id})` : cliente;
    rsPago.textContent = pago;

    rsItems.innerHTML = "";
    items.forEach(it=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${it.nombre}</td><td>${it.cant}</td><td>${fmt(it.precio)}</td><td>${fmt(it.subtotal)}</td>`;
      rsItems.appendChild(tr);
    });
    rsSubtotal.textContent = fmt(sub);
    rsIgv.textContent = fmt(igv);
    rsTotal.textContent = fmt(tot);
    resumen.style.display = "block";

    toast(`Venta ${id} registrada.`, "ok");
    // limpiar tabla de items
    tbody.innerHTML = "";
    btnAdd.click();
    // reset totales
    vSub.textContent = fmt(0); vIgv.textContent = fmt(0); vTot.textContent = fmt(0);
  });
})();

/* ============================
   Mostrar Ventas (hv-*)
============================ */
(function mostrarVentas(){
  const tbody = dom("#hv-body");
  if (!tbody) return;

  const fDesde = dom("#hv-desde");
  const fHasta = dom("#hv-hasta");
  const fCli = dom("#hv-cliente");
  const fTipo = dom("#hv-tipo");
  const vacio = dom("#hv-empty");

  // Popular combos
  const clientes = Repo.clientes();
  clientes.forEach(c=>{
    const op = document.createElement("option");
    op.value = c.id; op.textContent = `${c.nombre} (${c.id})`;
    fCli.appendChild(op);
  });
  ["Factura","Boleta","(Sin comprobante)"].forEach(t=>{
    const op = document.createElement("option");
    op.value = t; op.textContent = t;
    fTipo.appendChild(op);
  });

  function cumpleFiltros(v){
    const d = fDesde.value ? fDesde.value : "0000-01-01";
    const h = fHasta.value ? fHasta.value : "9999-12-31";
    if (v.fecha < d || v.fecha > h) return false;
    if (fCli.value && v.cliente !== fCli.value) return false;
    if (fTipo.value){
      if (fTipo.value === "(Sin comprobante)" && v.cpe) return false;
      if (fTipo.value !== "(Sin comprobante)" && (!v.cpe || v.cpe.tipo !== fTipo.value)) return false;
    }
    return true;
  }

  function render(){
    tbody.innerHTML = "";
    const ventas = Repo.ventas().filter(cumpleFiltros);
    ventas.forEach(v=>{
      const cli = clientes.find(c=> c.id===v.cliente);
      const tr = document.createElement("tr");
      const cpe = v.cpe ? `${v.cpe.tipo} ${v.cpe.serie}-${String(v.cpe.numero).padStart(8,"0")}` : "—";
      tr.innerHTML = `
        <td>${v.id}</td>
        <td>${v.fecha}</td>
        <td>${cli ? cli.nombre : v.cliente}</td>
        <td>${fmt(v.totales?.tot||0)}</td>
        <td>${cpe}</td>
        <td><!-- reservado para acciones/detalle --></td>
      `;
      tbody.appendChild(tr);
    });
    vacio.style.display = ventas.length ? "none" : "block";
  }

  [fDesde, fHasta, fCli, fTipo].forEach(el=> el?.addEventListener("change", render));
  render();
})();

/* ============================
   Modificar Venta (mv-*)
============================ */
(function modificarVenta(){
  const tbody = dom("#mv-body");
  if (!tbody) return;

  const vacio = dom("#mv-empty");
  const tpl = dom("#tpl-mv-row");
  const form = dom("#mv-form");
  const q = dom("#mv-q"), d = dom("#mv-desde"), h = dom("#mv-hasta");
  const selCli = dom("#mv-cliente");
  const selPago = dom("#mv-pago");
  const totalView = dom("#mv-total-view");

  // carga combos del form
  Repo.clientes().forEach(c=>{
    const op = document.createElement("option");
    op.value = c.id; op.textContent = `${c.nombre} (${c.id})`;
    selCli.appendChild(op);
  });
  formasPago.forEach(fp=>{
    const op = document.createElement("option");
    op.value = fp; op.textContent = fp;
    selPago.appendChild(op);
  });

  function filtrar(v){
    const txt = (q.value||"").toLowerCase();
    const okTxt = !txt || v.id.toLowerCase().includes(txt) ||
                  Repo.clientes().find(c=> c.id===v.cliente)?.nombre.toLowerCase().includes(txt);
    const min = d.value || "0000-01-01";
    const max = h.value || "9999-12-31";
    return okTxt && v.fecha >= min && v.fecha <= max;
  }

  function render(){
    tbody.innerHTML = "";
    const ventas = Repo.ventas().filter(filtrar);
    ventas.forEach(v=>{
      const row = tpl.content.firstElementChild.cloneNode(true);
      row.querySelector('[data-col="venta"]').textContent = v.id;
      row.querySelector('[data-col="fecha"]').textContent = v.fecha;
      row.querySelector('[data-col="cliente"]').textContent = Repo.clientes().find(c=> c.id===v.cliente)?.nombre || v.cliente;
      row.querySelector('[data-col="total"]').textContent = fmt(v.totales?.tot||0);

      const btn = row.querySelector(".mv-select");
      btn.dataset.venta = v.id;
      btn.dataset.fecha = v.fecha;
      btn.dataset.cliente = v.cliente;
      btn.dataset.total = v.totales?.tot||0;
      tbody.appendChild(row);
    });
    vacio.style.display = ventas.length ? "none" : "block";
  }

  dom("#mv-table")?.addEventListener("click", (ev)=>{
    const btn = ev.target.closest(".mv-select");
    if (!btn) return;
    dom("#mv-venta").value = btn.dataset.venta;
    dom("#mv-fecha").value = btn.dataset.fecha;
    selCli.value = btn.dataset.cliente;
    // estimación de pago original
    const v = Repo.ventas().find(x=> x.id===btn.dataset.venta);
    selPago.value = v?.pago || formasPago[0];
    totalView.innerHTML = `<b>${fmt(btn.dataset.total)}</b>`;
    dom("#mv-obs").value = v?.obs || "";
    toast(`Venta ${btn.dataset.venta} cargada.`, "ok");
  });

  form?.addEventListener("submit", (ev)=>{
    ev.preventDefault();
    const id = dom("#mv-venta").value;
    if (!id) return toast("Selecciona una venta del listado.", "error");
    const ventas = Repo.ventas();
    const idx = ventas.findIndex(v=> v.id===id);
    if (idx<0) return toast("Venta no encontrada.", "error");
    ventas[idx] = {
      ...ventas[idx],
      fecha: dom("#mv-fecha").value || ventas[idx].fecha,
      cliente: selCli.value || ventas[idx].cliente,
      pago: selPago.value || ventas[idx].pago,
      obs: dom("#mv-obs").value || ""
    };
    Repo.saveVentas(ventas);
    toast(`Venta ${id} actualizada.`, "ok");
    render();
  });

  dom("#mv-filtros")?.addEventListener("submit", (e)=>{ e.preventDefault(); render(); });
  dom("#mv-clear")?.addEventListener("click", ()=> { q.value=""; d.value=""; h.value=""; render(); });

  render();
})();

/* ============================
   Cancelar Venta (cv-*)
============================ */
(function cancelarVenta(){
  const table = dom("#cv-table");
  if (!table) return;

  const body = dom("#cv-body");
  const vacio = dom("#cv-empty");
  const form = dom("#cv-form");

  const q = dom("#cv-q");
  const d = dom("#cv-desde");
  const h = dom("#cv-hasta");
  const est = dom("#cv-estado");

  function match(v){
    const txt = (q.value||"").toLowerCase();
    const okTxt = !txt || v.id.toLowerCase().includes(txt) ||
      (Repo.clientes().find(c=> c.id===v.cliente)?.nombre.toLowerCase().includes(txt));
    const min = d.value || "0000-01-01";
    const max = h.value || "9999-12-31";
    const okRng = v.fecha >= min && v.fecha <= max;
    const okEst = !est.value || v.estado === est.value;
    return okTxt && okRng && okEst;
  }

  function render(){
    body.innerHTML = "";
    const ventas = Repo.ventas().filter(match);
    ventas.forEach(v=>{
      const tr = document.createElement("tr");
      const cli = Repo.clientes().find(c=> c.id===v.cliente);
      tr.innerHTML = `
        <td>${v.id}</td>
        <td>${v.fecha}</td>
        <td>${cli ? cli.nombre : v.cliente}</td>
        <td>${fmt(v.totales?.tot||0)}</td>
        <td>${v.estado}</td>
        <td>
          <button class="btn danger cv-select"
            data-venta="${v.id}"
            data-fecha="${v.fecha}"
            data-cliente="${cli ? cli.nombre : v.cliente}"
            data-total="${v.totales?.tot||0}"
            data-estado="${v.estado}">
            Seleccionar
          </button>
        </td>
      `;
      body.appendChild(tr);
    });
    vacio.style.display = ventas.length ? "none" : "block";
  }

  dom("#cv-filtros")?.addEventListener("submit", (e)=>{ e.preventDefault(); render(); });
  dom("#cv-clear")?.addEventListener("click", ()=> { q.value=""; d.value=""; h.value=""; est.value=""; render(); });

  table.addEventListener("click", (ev)=>{
    const btn = ev.target.closest(".cv-select");
    if (!btn) return;
    dom("#cv-venta").value = btn.dataset.venta;
    dom("#cv-fecha").value = btn.dataset.fecha;
    dom("#cv-cliente").value = btn.dataset.cliente;
    dom("#cv-total").value = fmt(btn.dataset.total);
    dom("#cv-estado-actual").value = btn.dataset.estado;
    toast(`Venta ${btn.dataset.venta} seleccionada.`, "ok");
  });

  // Confirmación
  form?.addEventListener("submit", (e)=>{
    e.preventDefault();
    const id = dom("#cv-venta").value;
    const motivo = dom("#cv-motivo").value.trim();
    if (!id) return toast("Selecciona una venta del listado.", "error");
    if (!motivo) return toast("Indica el motivo de cancelación.", "error");

    const ventas = Repo.ventas();
    const i = ventas.findIndex(v=> v.id===id);
    if (i<0) return toast("Venta no encontrada.", "error");
    const estado = ventas[i].estado;
    if (["Entregada","Anulada"].includes(estado)) {
      return toast(`La venta ${id} está en estado ${estado}. No se puede cancelar.`, "error");
    }

    ventas[i] = { ...ventas[i], estado:"Anulada", obs:`[CANCELADA] Motivo: ${motivo}` };
    Repo.saveVentas(ventas);
    toast(`Venta ${id} cancelada.`, "ok");
    render();
    form.reset();
  });

  // Inactivar (alternativo)
  dom("#cv-inactivar")?.addEventListener("click", ()=>{
    const id = dom("#cv-venta").value;
    const motivo = dom("#cv-motivo").value.trim();
    if (!id) return toast("Selecciona una venta del listado.", "error");
    if (!motivo) return toast("Indica el motivo para inactivar.", "error");

    const ventas = Repo.ventas();
    const i = ventas.findIndex(v=> v.id===id);
    if (i<0) return toast("Venta no encontrada.", "error");
    ventas[i] = { ...ventas[i], obs:`[INACTIVO] Motivo: ${motivo}` };
    Repo.saveVentas(ventas);
    toast(`Venta ${id} marcada como inactiva.`, "ok");
    render();
  });

  render();
})();
