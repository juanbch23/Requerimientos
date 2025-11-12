/* app.js — JR Químicos · Finanzas
 * Soporta:
 *  - Registrar Transacción (fx-*)
 *  - Estados de Cuenta (ec-*)
 *  - Cancelar Transacción (del-*)
 * Persistencia: localStorage
 * Códigos: Transacción = "TX-2025-00XX"
 */

// ============================
// Utilidades
// ============================
const LS_KEYS = {
  CUENTAS: 'jrq_finanzas_cuentas',
  TXNS: 'jrq_finanzas_txns',
  VENTAS: 'jrq_finanzas_ventas',
  INGRESOS: 'jrq_finanzas_ingresos'
};

const PEN = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });
const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const fmtMoney = (m, mon) => mon === 'USD' ? USD.format(m) : PEN.format(m);

function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return alert(msg);
  t.textContent = msg;
  t.style.opacity = 1;
  setTimeout(() => (t.style.opacity = 0), 2000);
}

function pad2(n) { return n.toString().padStart(2, '0'); }
function pad4(n) { return n.toString().padStart(4, '0'); }

function nextTxCode(txns) {
  // Formato: TX-2025-00XX (memoria del usuario)
  const year = '2025';
  const prefix = `TX-${year}-`;
  const nums = txns
    .map(t => t.id)
    .filter(id => id && id.startsWith(prefix))
    .map(id => parseInt(id.split('-').pop(), 10))
    .filter(n => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) + 1 : 1);
  return `${prefix}${pad4(next)}`;
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// ============================
// Seed de datos (si no existen)
// ============================
function seedIfNeeded() {
  if (!localStorage.getItem(LS_KEYS.CUENTAS)) {
    const cuentas = [
      { id: 'C1', nombre: 'BCP - Cta Corriente',  moneda: 'PEN', numero: '191-12345678-0-12', cci: '00219100012345678901', saldoInicial: 5000.00 },
      { id: 'C2', nombre: 'BBVA - Ahorros',       moneda: 'USD', numero: '0011-22223333',      cci: '01100220003334445556', saldoInicial: 1200.00 },
      { id: 'C3', nombre: 'Caja Chica',           moneda: 'PEN', numero: '—',                  cci: '',                     saldoInicial: 800.00 },
      { id: 'C4', nombre: 'Interbank - Cta Corr', moneda: 'PEN', numero: '300-99887766',       cci: '00330099887766554433', saldoInicial: 3000.00 },
    ];
    localStorage.setItem(LS_KEYS.CUENTAS, JSON.stringify(cuentas));
  }

  if (!localStorage.getItem(LS_KEYS.TXNS)) {
    // conciliado = boolean; estado = 'OK' | 'En espera' | 'Cancelado'
    const txns = [
      { id:'TX-2025-0001', fecha:'2025-11-02', tipo:'Ingreso', cuenta:'C1', moneda:'PEN', monto:2350.00, medio:'Transferencia', glosa:'Cobro VTA-2025-0015', cpe:'F001-000123', ventaRef:'VTA-2025-0015', ingresoRef:'', conciliado:false, estado:'OK' },
      { id:'TX-2025-0002', fecha:'2025-11-03', tipo:'Gasto',   cuenta:'C3', moneda:'PEN', monto:180.50,  medio:'Efectivo',      glosa:'Útiles de oficina', cpe:'',               ventaRef:'',               ingresoRef:'EG-2025-0200', conciliado:false, estado:'OK' },
      { id:'TX-2025-0003', fecha:'2025-11-04', tipo:'Ingreso', cuenta:'C2', moneda:'USD', monto:420.00,  medio:'Transferencia', glosa:'Abono cliente exterior', cpe:'B001-000456', ventaRef:'VTA-2025-0016', ingresoRef:'', conciliado:true, estado:'OK' },
      { id:'TX-2025-0004', fecha:'2025-11-06', tipo:'Gasto',   cuenta:'C4', moneda:'PEN', monto:950.00,  medio:'Transferencia', glosa:'Pago proveedor', cpe:'F002-000078', ventaRef:'', ingresoRef:'EG-2025-0235', conciliado:false, estado:'OK' }
    ];
    localStorage.setItem(LS_KEYS.TXNS, JSON.stringify(txns));
  }

  if (!localStorage.getItem(LS_KEYS.VENTAS)) {
    const ventas = [
      { id:'VTA-2025-0015', fecha:'2025-11-02', cliente:'Comercial Andina', total: 2763.00, cpe:'F001-000123', estado:'Facturada' },
      { id:'VTA-2025-0016', fecha:'2025-11-04', cliente:'ExportCo LLC',     total:  420.00, cpe:'B001-000456', estado:'Confirmada' },
      { id:'VTA-2025-0017', fecha:'2025-11-08', cliente:'Químicos Pacífico', total: 950.00, cpe:'',             estado:'Registrada' }
    ];
    localStorage.setItem(LS_KEYS.VENTAS, JSON.stringify(ventas));
  }

  if (!localStorage.getItem(LS_KEYS.INGRESOS)) {
    const ingresos = [
      { id:'EG-2025-0200', fecha:'2025-10-28', tipo:'Insumo',   ref:'PR-0012', detalle:'Etanol 96%', total: 800.00 },
      { id:'EG-2025-0235', fecha:'2025-11-05', tipo:'Producto', ref:'PR-0022', detalle:'Lote detergente', total: 1500.00 }
    ];
    localStorage.setItem(LS_KEYS.INGRESOS, JSON.stringify(ingresos));
  }
}

function getCuentas() { return JSON.parse(localStorage.getItem(LS_KEYS.CUENTAS) || '[]'); }
function setCuentas(v) { localStorage.setItem(LS_KEYS.CUENTAS, JSON.stringify(v)); }
function getTxns()    { return JSON.parse(localStorage.getItem(LS_KEYS.TXNS) || '[]'); }
function setTxns(v)   { localStorage.setItem(LS_KEYS.TXNS, JSON.stringify(v)); }
function getVentas()  { return JSON.parse(localStorage.getItem(LS_KEYS.VENTAS) || '[]'); }
function getIngresos(){ return JSON.parse(localStorage.getItem(LS_KEYS.INGRESOS) || '[]'); }

// Helpers
function cuentaById(id) { return getCuentas().find(c => c.id === id); }

// ============================
// Registrar Transacción (fx-*)
// ============================
function initRegistrarTransaccion() {
  const $form = document.getElementById('fx-form');
  if (!$form) return;

  const $tipo   = document.getElementById('fx-tipo');
  const $fecha  = document.getElementById('fx-fecha');
  const $moneda = document.getElementById('fx-moneda');
  const $cuenta = document.getElementById('fx-cuenta');
  const $medio  = document.getElementById('fx-medio');
  const $tercero= document.getElementById('fx-tercero');
  const $monto  = document.getElementById('fx-monto');
  const $glosa  = document.getElementById('fx-glosa');

  const $ventaSel   = document.getElementById('fx-venta');
  const $ingresoSel = document.getElementById('fx-ingreso');

  const $resumen = document.getElementById('resumen');
  // Poblar combos
  const cuentas = getCuentas();
  $cuenta.innerHTML = '';
  cuentas.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.nombre} (${c.moneda})`;
    $cuenta.appendChild(opt);
  });

  const ventas = getVentas();
  if ($ventaSel) {
    $ventaSel.innerHTML = '<option value="">(Sin vincular)</option>';
    ventas.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.id;
      opt.textContent = `${v.id} · ${v.cliente} · ${fmtMoney(v.total, 'PEN')}`;
      $ventaSel.appendChild(opt);
    });
  }

  const ingresos = getIngresos();
  if ($ingresoSel) {
    $ingresoSel.innerHTML = '<option value="">(Sin vincular)</option>';
    ingresos.forEach(i => {
      const opt = document.createElement('option');
      opt.value = i.id;
      opt.textContent = `${i.id} · ${i.detalle} · ${fmtMoney(i.total, 'PEN')}`;
      $ingresoSel.appendChild(opt);
    });
  }

  // Por defecto: hoy
  if ($fecha && !$fecha.value) $fecha.value = todayISO();

  // Enviar
  $form.addEventListener('submit', (e) => {
    e.preventDefault();
    const txns = getTxns();
    const id = nextTxCode(txns);

    const cuenta = cuentaById($cuenta.value);
    if (!cuenta) return toast('Cuenta inválida.');

    // Validaciones mínimas
    if (!$monto.value || parseFloat($monto.value) <= 0) return toast('Ingrese un monto válido.');

    // Coherencia de moneda: si deseas, puedes bloquear moneda distinta a la cuenta.
    const mon = $moneda.value;
    const tipo = $tipo.value;

    const nuevo = {
      id,
      fecha: $fecha.value || todayISO(),
      tipo, cuenta: cuenta.id, moneda: mon,
      monto: parseFloat($monto.value),
      medio: $medio.value,
      glosa: $glosa.value || '',
      cpe: document.getElementById('fx-comp-serie') && document.getElementById('fx-comp-numero')
           ? `${(document.getElementById('fx-comp-serie').value || '').toUpperCase()}-${(document.getElementById('fx-comp-numero').value || '').toString().padStart(8, '0')}`
           : '',
      ventaRef: ($ventaSel && $ventaSel.value) ? $ventaSel.value : '',
      ingresoRef: ($ingresoSel && $ingresoSel.value) ? $ingresoSel.value : '',
      conciliado: false,
      estado: 'OK'
    };

    txns.push(nuevo);
    setTxns(txns);

    // Render de resumen
    if ($resumen) {
      $resumen.style.display = '';
      $resumen.innerHTML = `
        <h2>Resumen de la última transacción</h2>
        <div class="grid cols-2">
          <div><b>ID:</b> ${nuevo.id}</div>
          <div><b>Fecha:</b> ${nuevo.fecha}</div>
          <div><b>Tipo:</b> ${nuevo.tipo}</div>
          <div><b>Cuenta:</b> ${cuenta.nombre}</div>
          <div><b>Monto:</b> ${fmtMoney(nuevo.monto, nuevo.moneda)}</div>
          <div><b>Medio:</b> ${nuevo.medio}</div>
          <div><b>Moneda:</b> ${nuevo.moneda}</div>
          <div><b>Glosa:</b> ${nuevo.glosa || '—'}</div>
          <div><b>CPE:</b> ${nuevo.cpe || '—'}</div>
          <div><b>Vinc Venta:</b> ${nuevo.ventaRef || '—'}</div>
          <div><b>Vinc Ingreso:</b> ${nuevo.ingresoRef || '—'}</div>
        </div>
      `;
    }

    toast('Transacción registrada.');
    $form.reset();
    if ($fecha) $fecha.value = todayISO();
  });
}

// ===================================
// Estados de Cuenta (ec-*, resumen)
// ===================================
function initEstadosDeCuenta() {
  const $tablaCuentasBody = document.getElementById('ec-cuentas-body');
  const $tablaCuentasFoot = document.getElementById('ec-cuentas-foot');
  const $fForm = document.getElementById('ec-filtros');
  const $selCuenta = document.getElementById('ec-cuenta');
  const $tbody = document.getElementById('ec-body');
  const $empty = document.getElementById('ec-empty');

  const $kIn = document.getElementById('ec-kpi-in');
  const $kOut = document.getElementById('ec-kpi-out');
  const $kDiff = document.getElementById('ec-kpi-diff');
  const $kLast = document.getElementById('ec-kpi-last');
  const $kConc = document.getElementById('ec-kpi-conc');
  const $kPend = document.getElementById('ec-kpi-pend');

  if (!$tablaCuentasBody || !$tbody) return;

  const cuentas = getCuentas();
  const txns = getTxns();

  // Resumen por cuenta
  $tablaCuentasBody.innerHTML = '';
  let totalInPEN = 0, totalOutPEN = 0;
  cuentas.forEach(c => {
    const movs = txns.filter(t => t.cuenta === c.id && t.estado !== 'Cancelado');
    const ingresos = movs.filter(m => m.tipo === 'Ingreso').reduce((a,b)=>a+(b.moneda==='USD'?b.monto*3.7:b.monto),0);
    const gastos   = movs.filter(m => m.tipo === 'Gasto').reduce((a,b)=>a+(b.moneda==='USD'?b.monto*3.7:b.monto),0);
    const saldoActual = c.saldoInicial + ingresos - gastos;
    const concCount = movs.filter(m => m.conciliado).length;

    if (c.moneda === 'PEN') {
      totalInPEN += ingresos;
      totalOutPEN += gastos;
    }
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.nombre}</td>
      <td>${c.moneda}</td>
      <td>${c.cci || c.numero || '—'}</td>
      <td>${fmtMoney(c.saldoInicial, c.moneda)}</td>
      <td>${fmtMoney(ingresos, 'PEN')}</td>
      <td>${fmtMoney(gastos, 'PEN')}</td>
      <td>${fmtMoney(saldoActual, 'PEN')}</td>
      <td>${concCount}</td>
    `;
    $tablaCuentasBody.appendChild(tr);
  });
  $tablaCuentasFoot.innerHTML = `<tr><td colspan="8">Ingresos PEN: ${fmtMoney(totalInPEN,'PEN')} · Gastos PEN: ${fmtMoney(totalOutPEN,'PEN')}</td></tr>`;

  // Poblar select cuentas
  if ($selCuenta) {
    $selCuenta.innerHTML = '<option value="">(Todas)</option>';
    cuentas.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.nombre;
      $selCuenta.appendChild(opt);
    });
  }

  function aplicarFiltros() {
    const desde = document.getElementById('ec-desde')?.value || '';
    const hasta = document.getElementById('ec-hasta')?.value || '';
    const cuentaId = $selCuenta.value;

    let rows = txns.filter(t => t.estado !== 'Cancelado');
    if (cuentaId) rows = rows.filter(t => t.cuenta === cuentaId);
    if (desde) rows = rows.filter(t => t.fecha >= desde);
    if (hasta) rows = rows.filter(t => t.fecha <= hasta);

    rows.sort((a,b) => a.fecha.localeCompare(b.fecha));

    // KPIs
    const inMonto = rows.filter(r => r.tipo==='Ingreso').reduce((a,b)=>a+(b.moneda==='USD'?b.monto*3.7:b.monto),0);
    const outMonto= rows.filter(r => r.tipo==='Gasto').reduce((a,b)=>a+(b.moneda==='USD'?b.monto*3.7:b.monto),0);
    const conc = rows.filter(r => r.conciliado).length;
    const pend = rows.length - conc;
    const lastConc = rows.filter(r => r.conciliado).sort((a,b)=>b.fecha.localeCompare(a.fecha))[0]?.fecha || '—';

    if ($kIn)   $kIn.textContent = fmtMoney(inMonto, 'PEN');
    if ($kOut)  $kOut.textContent= fmtMoney(outMonto, 'PEN');
    if ($kDiff) $kDiff.textContent= fmtMoney(inMonto - outMonto, 'PEN');
    if ($kConc) $kConc.textContent= conc;
    if ($kPend) $kPend.textContent= pend;
    if ($kLast) $kLast.textContent= lastConc;

    // Render tabla movimientos
    $tbody.innerHTML = '';
    if (!rows.length) {
      $empty.style.display = 'block';
      return;
    }
    $empty.style.display = 'none';

    let saldoCorrido = 0;
    rows.forEach(r => {
      const sign = r.tipo === 'Ingreso' ? +1 : -1;
      const pen = (r.moneda === 'USD') ? r.monto*3.7 : r.monto; // demo
      saldoCorrido += sign * pen;
      const cuenta = cuentaById(r.cuenta);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.fecha}</td>
        <td>${r.tipo}</td>
        <td>${r.medio || '—'}</td>
        <td>${r.glosa || '—'}</td>
        <td>${r.cpe || '—'}</td>
        <td class="right">${fmtMoney(r.monto, r.moneda)}</td>
        <td class="right">${fmtMoney(saldoCorrido, 'PEN')}</td>
        <td>${r.conciliado ? 'Conciliado' : 'Pendiente'}</td>
      `;
      $tbody.appendChild(tr);
    });
  }

  $fForm?.addEventListener('submit', (e) => { e.preventDefault(); aplicarFiltros(); });
  $fForm?.addEventListener('reset', () => setTimeout(aplicarFiltros, 0));
  aplicarFiltros();
}

// ==================================
// Cancelar Transacción (del-*)
// ==================================
function initCancelarTransaccion() {
  const $listBody = document.getElementById('del-body');
  const $tpl = document.getElementById('tpl-del-row');
  const $empty = document.getElementById('del-empty');
  const $fForm = document.getElementById('del-filtros');

  const $selId = document.getElementById('del-sel-id');
  const $selFecha = document.getElementById('del-sel-fecha');
  const $selTipo = document.getElementById('del-sel-tipo');
  const $selCuenta = document.getElementById('del-sel-cuenta');
  const $selMonto = document.getElementById('del-sel-monto');
  const $selGlosa = document.getElementById('del-sel-glosa');
  const $motivo = document.getElementById('del-motivo');

  const $post = document.getElementById('post-cancel');
  const $postMsg = document.getElementById('post-msg');

  if (!$listBody || !$tpl) return;

  // Poblar filtro de cuentas
  const $cuentaFiltro = document.getElementById('del-cuenta');
  if ($cuentaFiltro) {
    $cuentaFiltro.innerHTML = '<option value="">(Todas)</option>';
    getCuentas().forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.nombre;
      $cuentaFiltro.appendChild(opt);
    });
  }

  function renderLista(rows) {
    $listBody.innerHTML = '';
    if (!rows.length) {
      $empty.style.display = 'block';
      return;
    }
    $empty.style.display = 'none';

    rows.forEach(r => {
      const tr = $tpl.content.firstElementChild.cloneNode(true);
      const cta = cuentaById(r.cuenta);

      tr.querySelector('[data-col="id"]').textContent = r.id;
      tr.querySelector('[data-col="fecha"]').textContent = r.fecha;
      tr.querySelector('[data-col="tipo"]').textContent = r.tipo;
      tr.querySelector('[data-col="cuenta"]').textContent = cta ? cta.nombre : r.cuenta;
      tr.querySelector('[data-col="moneda"]').textContent = r.moneda;
      tr.querySelector('[data-col="monto"]').textContent = fmtMoney(r.monto, r.moneda);
      tr.querySelector('[data-col="cpe"]').textContent = r.cpe || '—';
      tr.querySelector('[data-col="conc"]').textContent = r.conciliado ? 'Sí' : 'No';

      const btn = tr.querySelector('.del-select');
      btn.dataset.id = r.id;
      btn.dataset.fecha = r.fecha;
      btn.dataset.tipo = r.tipo;
      btn.dataset.cuenta = cta ? cta.nombre : r.cuenta;
      btn.dataset.moneda = r.moneda;
      btn.dataset.monto = r.monto;
      btn.dataset.cpe = r.cpe || '';
      btn.dataset.conciliado = String(r.conciliado);
      btn.dataset.glosa = r.glosa || '';

      btn.addEventListener('click', () => {
        if (r.conciliado) return toast('No se puede cancelar: transacción conciliada.');
        $selId.value = r.id;
        $selFecha.value = r.fecha;
        $selTipo.value = r.tipo;
        $selCuenta.value = cta ? cta.nombre : r.cuenta;
        $selMonto.value = fmtMoney(r.monto, r.moneda);
        $selGlosa.value = r.glosa || '';
        $post.style.display = 'none';
      });

      $listBody.appendChild(tr);
    });
  }

  function aplicarFiltros() {
    const txns = getTxns().filter(t => t.estado !== 'Cancelado');
    const id = document.getElementById('del-id')?.value.trim().toLowerCase() || '';
    const desde = document.getElementById('del-desde')?.value || '';
    const hasta = document.getElementById('del-hasta')?.value || '';
    const tipo = document.getElementById('del-tipo')?.value || '';
    const cuenta = document.getElementById('del-cuenta')?.value || '';

    const rows = txns.filter(r => {
      const okId = !id || r.id.toLowerCase().includes(id);
      const okTipo = !tipo || r.tipo === tipo;
      const okCuenta = !cuenta || r.cuenta === cuenta;
      const okDesde = !desde || r.fecha >= desde;
      const okHasta = !hasta || r.fecha <= hasta;
      return okId && okTipo && okCuenta && okDesde && okHasta;
    });

    renderLista(rows);
  }

  $fForm?.addEventListener('submit', (e) => { e.preventDefault(); aplicarFiltros(); });
  $fForm?.addEventListener('reset', () => setTimeout(aplicarFiltros, 0));

  // Confirmación: Cancelar definitivamente
  const $confirmForm = document.getElementById('del-form');
  $confirmForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = $selId.value;
    if (!id) return toast('Seleccione una transacción.');
    if (!$motivo.value.trim()) return toast('Indique el motivo.');

    const txns = getTxns();
    const idx = txns.findIndex(t => t.id === id);
    if (idx < 0) return toast('Transacción no encontrada.');

    if (txns[idx].conciliado) return toast('No se puede cancelar: conciliada.');

    txns[idx].estado = 'Cancelado';
    setTxns(txns);
    aplicarFiltros();

    $selId.value = $selFecha.value = $selTipo.value = $selCuenta.value = $selMonto.value = $selGlosa.value = '';
    $motivo.value = '';

    document.getElementById('post-cancel')?.style.setProperty('display', '');
    document.getElementById('post-msg').textContent = `La transacción ${id} fue cancelada correctamente.`;
    toast('Transacción cancelada.');
  });

  // Marcar como en Espera
  const $btnEspera = document.getElementById('btn-anular');
  $btnEspera?.addEventListener('click', () => {
    const id = $selId.value;
    if (!id) return toast('Seleccione una transacción.');
    if (!$motivo.value.trim()) return toast('Indique el motivo.');

    const txns = getTxns();
    const idx = txns.findIndex(t => t.id === id);
    if (idx < 0) return toast('Transacción no encontrada.');

    if (txns[idx].conciliado) return toast('No se puede cambiar: conciliada.');

    txns[idx].estado = 'En espera';
    setTxns(txns);
    aplicarFiltros();

    document.getElementById('post-cancel')?.style.setProperty('display', '');
    document.getElementById('post-msg').textContent = `La transacción ${id} fue marcada como En espera.`;
    toast('Marcada como En espera.');
  });

  aplicarFiltros();
}

// ============================
// Init global
// ============================
document.addEventListener('DOMContentLoaded', () => {
  seedIfNeeded();
  // Inicializar cada pantalla si sus elementos existen
  initRegistrarTransaccion();
  initEstadosDeCuenta();
  initCancelarTransaccion();
});
