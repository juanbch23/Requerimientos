/* app-usu.js · JR Químicos · Módulo Usuarios
   Páginas soportadas:
   - Login:               #login-form, #login-user, #login-pass
   - Generar credenciales:#rt-form (usar reg-user, reg-pass y cod empleado)
   - Mostrar:             #list-table, #list-body, #list-empty, #tpl-user-row, #user-detail, #list-q, #list-tipo
   - Modificar:           #mod-q, #list-table/#list-body, #tpl-usu-row, #mod-form, #mod-cod, #mod-usuario,
                          #mod-pass-actual, #mod-pass-nueva
   - Baja:                #bu-q, #bu-table/#bu-body, #tpl-bu-row, #bu-form, #bu-cod, #bu-usu, #bu-nom, #bu-est,
                          #bu-motivo, #bu-baja, #bu-inactivar

   Estándares:
   - Cod-Empleado: T-00XX (incremental en RR.HH., aquí se asume existente).
   - Listado de Baja: ÚNICO botón rojo “Seleccionar” por fila → rellena formulario de Confirmación.
   - Confirmación: 2 botones (rojo “Dar de Baja …” + “Marcar como Inactivo”).
*/
(function () {
  "use strict";

  // ---------- Helpers ----------
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  function toast(msg) {
    const t = $("#toast");
    if (!t) return alert(msg);
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2000);
  }

  const KEY = "jrq:usuarios:v1";

  // ---------- Datos seed coherentes ----------
  // Usuarios: cada uno enlazado a un empleado (T-00XX), con doc DNI (8) y correo válido.
  const seed = {
    usuarios: [
      { cod:"T-0001", usuario:"admin",        nombre:"Lucía Gómez",       doc:"74561234", cargo:"Administrador",      correo:"lucia.g@jrq.pe",      estado:"Activo",   pass:"admin123" },
      { cod:"T-0002", usuario:"carlos.p",     nombre:"Carlos Pérez",      doc:"72895412", cargo:"Jefe de Producción", correo:"carlos.p@jrq.pe",     estado:"Activo",   pass:"c4rl0s!"  },
      { cod:"T-0003", usuario:"ana.salazar",  nombre:"Ana Salazar",       doc:"70654321", cargo:"Operario",           correo:"ana.s@jrq.pe",        estado:"Activo",   pass:"an@2025"  },
      { cod:"T-0004", usuario:"diego.h",      nombre:"Diego Huamán",      doc:"71478596", cargo:"Vendedor",           correo:"diego.h@jrq.pe",      estado:"Activo",   pass:"d13g0vta" },
      { cod:"T-0005", usuario:"fiorella.c",   nombre:"Fiorella Chávez",   doc:"70987654", cargo:"Analista de Calidad",correo:"fiorella.c@jrq.pe",   estado:"Inactivo", pass:"calidad*" },
      { cod:"T-0006", usuario:"maria.rojas",  nombre:"María Rojas",       doc:"71234567", cargo:"Asistente Adm.",     correo:"maria.r@jrq.pe",      estado:"Activo",   pass:"mr2025**" },
      { cod:"T-0007", usuario:"jose.alvarez", nombre:"José Álvarez",      doc:"73124568", cargo:"Contador",           correo:"jose.a@jrq.pe",       estado:"Activo",   pass:"cnt-2025" },
      { cod:"T-0008", usuario:"rocio.v",      nombre:"Rocío Valdez",      doc:"72563418", cargo:"Vendedor",           correo:"rocio.v@jrq.pe",      estado:"Activo",   pass:"vent@s"   },
      { cod:"T-0009", usuario:"luis.t",       nombre:"Luis Torres",       doc:"73659841", cargo:"Operario",           correo:"luis.t@jrq.pe",       estado:"Activo",   pass:"op3r@rio" },
      { cod:"T-0010", usuario:"gerente",      nombre:"Pedro Ramos",       doc:"70112233", cargo:"Gerente General",    correo:"gerencia@jrq.pe",     estado:"Activo",   pass:"G3r3nt3!" }
    ]
  };

  // ---------- Persistencia ----------
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return JSON.parse(JSON.stringify(seed)); }
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.usuarios)) { localStorage.setItem(KEY, JSON.stringify(seed)); return JSON.parse(JSON.stringify(seed)); }
      return data;
    } catch {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return JSON.parse(JSON.stringify(seed));
    }
  }
  function save(data) { localStorage.setItem(KEY, JSON.stringify(data)); }

  const byCod  = (list, cod)    => list.find(u => u.cod === cod);
  const byUser = (list, usu)    => list.find(u => u.usuario.toLowerCase() === String(usu||"").toLowerCase());
  const byId   = (list, codUsu) => list.find(u => u.cod === codUsu || u.usuario === codUsu);

  // ---------- LOGIN ----------
  (function initLogin() {
    const form = $("#login-form");
    if (!form) return;
    const inUser = $("#login-user");
    const inPass = $("#login-pass");

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const user = (inUser.value || "").trim();
      const pass = (inPass.value || "").trim();
      if (!user || !pass) { toast("Completa usuario y contraseña."); return; }

      const data = load();
      const u = byUser(data.usuarios, user);
      if (!u) { toast("Usuario no encontrado."); return; }
      if (u.estado !== "Activo") { toast("Usuario inactivo. Contacte a un administrador."); return; }
      if (u.pass !== pass) { toast("Contraseña incorrecta."); return; }

      toast(`¡Bienvenido, ${u.nombre}!`);
      // Aquí podrías redirigir a dashboard si lo deseas:
      // location.href = "../index.html";
      form.reset();
    });
  })();

  // ---------- GENERAR CREDENCIALES ----------
  (function initGenCred() {
    const form = $("#rt-form");
    if (!form) return;

    const fCod  = $("#rt-codigo");
    const fNom  = $("#rt-nombres");
    const fApe  = $("#rt-apellidos");
    const fDoc  = $("#rt-dni");
    const fArea = $("#rt-area");
    const fCar  = $("#rt-cargo");
    const fMail = $("#reg-user");   // usuario
    const fPass = $("#reg-pass");   // contraseña

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = load();

      const cod = (fCod.value || "").trim();        // T-00XX
      const usuario = (fMail.value || "").trim();
      const pass = (fPass.value || "").trim();
      const nombre = `${(fNom.value||"").trim()} ${(fApe.value||"").trim()}`.trim();
      const doc = (fDoc.value || "").trim();
      const cargo = (fCar.value || "").trim() || "Personal";
      const correo = `${usuario}@jrq.pe`; // demo
      const estado = "Activo";

      if (!/^T-\d{4}$/.test(cod)) { toast("Cod-Empleado inválido. Formato T-00XX."); fCod.focus(); return; }
      if (!usuario) { toast("Ingresa el nombre de usuario."); fMail.focus(); return; }
      if (byUser(data.usuarios, usuario)) { toast("Ese usuario ya existe."); fMail.focus(); return; }
      if (byCod(data.usuarios, cod)) { toast("Ese Cod-Empleado ya tiene credenciales."); fCod.focus(); return; }
      if (!/^\d{8}$/.test(doc)) { toast("DNI inválido (8 dígitos)."); return; }
      if (pass.length < 6) { toast("La contraseña debe tener al menos 6 caracteres."); fPass.focus(); return; }

      const reg = { cod, usuario, nombre, doc, cargo, correo, estado, pass };
      data.usuarios.push(reg);
      save(data);
      toast(`Usuario ${usuario} creado para ${cod}.`);
      form.reset();
    });
  })();

  // ---------- MOSTRAR USUARIOS ----------
  (function initMostrar() {
    const tbody = $("#list-body");
    const tpl   = $("#tpl-user-row");
    const empty = $("#list-empty");
    const detail= $("#user-detail");
    const q     = $("#list-q");
    const ddTipo= $("#list-tipo");
    if (!tbody || !tpl) return;

    function cargarTipos(list) {
      // Usamos cargo como "tipo" para el filtro
      const tipos = Array.from(new Set(list.map(u => u.cargo))).sort();
      if (ddTipo) {
        ddTipo.innerHTML = `<option value="">(Todos)</option>` + tipos.map(t=>`<option>${t}</option>`).join("");
      }
    }

    function fila(u) {
      const frag = tpl.content.cloneNode(true);
      frag.querySelector('[data-col="cod"]').textContent    = u.cod;
      frag.querySelector('[data-col="usu"]').textContent    = u.usuario;
      frag.querySelector('[data-col="nombre"]').textContent = u.nombre;
      frag.querySelector('[data-col="doc"]').textContent    = u.doc;
      frag.querySelector('[data-col="carg"]').textContent   = u.cargo;
      frag.querySelector('[data-col="correo"]').textContent = u.correo;
      frag.querySelector('[data-col="estado"]').textContent = u.estado;
      const btn = frag.querySelector(".ver-user");
      if (btn) btn.dataset.id = u.cod; // usamos cod como id
      return frag;
    }

    function filtrar(list) {
      const t = ddTipo ? (ddTipo.value || "") : "";
      const s = q ? (q.value || "").trim().toLowerCase() : "";
      return list.filter(u => {
        if (t && u.cargo !== t) return false;
        if (!s) return true;
        return (
          u.usuario.toLowerCase().includes(s) ||
          u.cod.toLowerCase().includes(s) ||
          u.nombre.toLowerCase().includes(s) ||
          u.doc.toLowerCase().includes(s)
        );
      });
    }

    function render(list) {
      tbody.innerHTML = "";
      if (!list.length) { if (empty) empty.style.display = "block"; return; }
      if (empty) empty.style.display = "none";
      const frag = document.createDocumentFragment();
      list.forEach(u => frag.appendChild(fila(u)));
      tbody.appendChild(frag);
    }

    function renderDetail(u) {
      if (!detail) return;
      detail.innerHTML = `
        <div class="card" style="margin-top:12px">
          <h2>Detalle del usuario</h2>
          <div class="grid cols-2">
            <div><b>Cod-Empleado:</b> ${u.cod}</div>
            <div><b>Usuario:</b> ${u.usuario}</div>
            <div><b>Nombre:</b> ${u.nombre}</div>
            <div><b>Documento:</b> ${u.doc}</div>
            <div><b>Cargo:</b> ${u.cargo}</div>
            <div><b>Correo:</b> ${u.correo}</div>
            <div><b>Estado:</b> ${u.estado}</div>
          </div>
        </div>`;
    }

    const db0 = load();
    cargarTipos(db0.usuarios);
    render(db0.usuarios);

    ddTipo && ddTipo.addEventListener("change", () => render(filtrar(load().usuarios)));
    q && q.addEventListener("input", () => render(filtrar(load().usuarios)));

    tbody.addEventListener("click", (ev) => {
      const b = ev.target.closest(".ver-user");
      if (!b) return;
      const u = byCod(load().usuarios, b.dataset.id);
      if (u) renderDetail(u);
    });
  })();

  // ---------- MODIFICAR USUARIO (listado + seleccionar + cambiar contraseña) ----------
  (function initModificar() {
    const inpQ    = $("#mod-q");
    const tbody   = $("#list-body");
    const tpl     = $("#tpl-usu-row");
    const form    = $("#mod-form");
    const fCod    = $("#mod-cod");
    const fUser   = $("#mod-usuario");
    const fPassA  = $("#mod-pass-actual");
    const fPassN  = $("#mod-pass-nueva");
    if (!tbody || !tpl || !form) return;

    function fila(u) {
      const frag = tpl.content.cloneNode(true);
      frag.querySelector('[data-col="cod"]').textContent   = u.cod;
      frag.querySelector('[data-col="user"]').textContent  = u.usuario;
      frag.querySelector('[data-col="nom"]').textContent   = u.nombre;
      frag.querySelector('[data-col="doc"]').textContent   = u.doc;
      frag.querySelector('[data-col="cargo"]').textContent = u.cargo;
      frag.querySelector('[data-col="mail"]').textContent  = u.correo;
      frag.querySelector('[data-col="est"]').textContent   = u.estado;

      const btn = frag.querySelector(".usu-sel");
      btn.dataset.cod   = u.cod;
      btn.dataset.user  = u.usuario;
      btn.dataset.nom   = u.nombre;
      btn.dataset.doc   = u.doc;
      btn.dataset.cargo = u.cargo;
      btn.dataset.mail  = u.correo;
      btn.dataset.est   = u.estado;
      return frag;
    }

    function render(list) {
      tbody.innerHTML = "";
      const frag = document.createDocumentFragment();
      list.forEach(u => frag.appendChild(fila(u)));
      tbody.appendChild(frag);
    }

    function filtrar(q) {
      const s = (q||"").trim().toLowerCase();
      const list = load().usuarios;
      if (!s) return list;
      return list.filter(u =>
        u.cod.toLowerCase().includes(s) ||
        u.usuario.toLowerCase().includes(s) ||
        u.nombre.toLowerCase().includes(s) ||
        u.doc.toLowerCase().includes(s)
      );
    }

    // Render inicial SIEMPRE con datos existentes
    render(load().usuarios);

    inpQ && inpQ.addEventListener("input", () => render(filtrar(inpQ.value)));

    // Seleccionar → rellena “Datos Seleccionados”
    tbody.addEventListener("click", (ev) => {
      const b = ev.target.closest(".usu-sel");
      if (!b) return;
      fCod.value  = b.dataset.cod;
      fUser.value = b.dataset.user;
      fPassA.value= "********"; // no mostramos la real
      fPassN.value= "";
      toast(`Usuario ${b.dataset.user} cargado.`);
    });

    // Guardar cambios (solo password)
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const cod = (fCod.value||"").trim();
      if (!cod) { toast("Selecciona un usuario del listado."); return; }
      const pw = (fPassN.value||"").trim();
      if (pw.length < 6) { toast("La nueva contraseña debe tener al menos 6 caracteres."); fPassN.focus(); return; }

      const data = load();
      const u = byCod(data.usuarios, cod);
      if (!u) { toast("No se encontró el registro."); return; }
      u.pass = pw;
      save(data);
      toast("Contraseña actualizada.");
      form.reset();
    });
  })();

  // ---------- BAJA DE USUARIO (buscar + seleccionar + confirmar) ----------
  (function initBaja() {
    const q      = $("#bu-q");
    const tbody  = $("#bu-body");
    const tpl    = $("#tpl-bu-row");
    const empty  = $("#bu-empty");
    const form   = $("#bu-form");
    const fCod   = $("#bu-cod");
    const fUsu   = $("#bu-usu");
    const fNom   = $("#bu-nom");
    const fEst   = $("#bu-est");
    const fMot   = $("#bu-motivo");
    const btnInac= $("#bu-inactivar");
    if (!tbody || !tpl || !form) return;

    function fila(u) {
      const frag = tpl.content.cloneNode(true);
      frag.querySelector('[data-col="cod"]').textContent    = u.cod;
      frag.querySelector('[data-col="usu"]').textContent    = u.usuario;
      frag.querySelector('[data-col="nombre"]').textContent = u.nombre;
      frag.querySelector('[data-col="doc"]').textContent    = u.doc;
      frag.querySelector('[data-col="cargo"]').textContent  = u.cargo;
      frag.querySelector('[data-col="correo"]').textContent = u.correo;
      frag.querySelector('[data-col="estado"]').textContent = u.estado;

      const btn = frag.querySelector(".bu-select");
      btn.dataset.cod    = u.cod;
      btn.dataset.usu    = u.usuario;
      btn.dataset.nom    = u.nombre;
      btn.dataset.doc    = u.doc;
      btn.dataset.cargo  = u.cargo;
      btn.dataset.correo = u.correo;
      btn.dataset.estado = u.estado;
      return frag;
    }

    function render(list) {
      tbody.innerHTML = "";
      if (!list.length) { if (empty) empty.style.display = "block"; return; }
      if (empty) empty.style.display = "none";
      const frag = document.createDocumentFragment();
      list.forEach(u => frag.appendChild(fila(u)));
      tbody.appendChild(frag);
    }

    function filtrar(txt) {
      const s = (txt||"").trim().toLowerCase();
      const list = load().usuarios;
      if (!s) return list;
      return list.filter(u =>
        u.cod.toLowerCase().includes(s) ||
        u.usuario.toLowerCase().includes(s) ||
        u.nombre.toLowerCase().includes(s) ||
        u.doc.toLowerCase().includes(s)
      );
    }

    // Inicial
    render(load().usuarios);

    q && q.addEventListener("input", () => render(filtrar(q.value)));

    // Seleccionar → rellena Confirmación
    tbody.addEventListener("click", (ev) => {
      const b = ev.target.closest(".bu-select");
      if (!b) return;
      fCod.value = b.dataset.cod;
      fUsu.value = b.dataset.usu;
      fNom.value = b.dataset.nom;
      fEst.value = b.dataset.estado;
      fMot.focus();
      toast(`Seleccionado ${b.dataset.usu}`);
    });

    // Dar de Baja (eliminar)
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const cod = (fCod.value||"").trim();
      if (!cod) { toast("Selecciona un usuario del listado."); return; }
      if (!confirm(`¿Confirmas la BAJA definitiva del usuario ${fUsu.value} (${cod})?`)) return;

      const data = load();
      const idx = data.usuarios.findIndex(u => u.cod === cod);
      if (idx >= 0) {
        data.usuarios.splice(idx, 1);
        save(data);
        render(filtrar(q ? q.value : ""));
        form.reset();
        toast("Usuario dado de baja.");
      } else {
        toast("No se encontró el registro.");
      }
    });

    // Marcar como Inactivo
    btnInac && btnInac.addEventListener("click", () => {
      const cod = (fCod.value||"").trim();
      if (!cod) { toast("Selecciona un usuario del listado."); return; }
      if (!confirm(`¿Confirmas marcar como INACTIVO al usuario ${fUsu.value} (${cod})?`)) return;

      const data = load();
      const u = byCod(data.usuarios, cod);
      if (!u) { toast("No se encontró el registro."); return; }
      u.estado = "Inactivo";
      save(data);
      render(filtrar(q ? q.value : ""));
      fEst.value = "Inactivo";
      toast("Usuario marcado como Inactivo.");
    });
  })();

})();
