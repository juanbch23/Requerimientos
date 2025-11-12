// home.js
(function () {
  // ---- Slider muy simple ----
  function initSlider(sliderId, dotsId, intervalMs = 3500) {
    const slider = document.getElementById(sliderId);
    const dotsWrap = document.getElementById(dotsId);
    if (!slider || !dotsWrap) return;

    const imgs = Array.from(slider.querySelectorAll('img'));
    const dots = Array.from(dotsWrap.children);
    if (imgs.length === 0 || dots.length === 0) return;

    let i = 0;
    let timer = setInterval(next, intervalMs);

    function next() {
      imgs[i].classList.remove('active');
      dots[i].classList.remove('active');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('active');
      dots[i].classList.add('active');
    }

    // Accesibilidad básica: pausar al pasar el mouse
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', () => (timer = setInterval(next, intervalMs)));

    // Click en dots
    dots.forEach((d, idx) => {
      d.addEventListener('click', () => {
        imgs[i].classList.remove('active');
        dots[i].classList.remove('active');
        i = idx;
        imgs[i].classList.add('active');
        dots[i].classList.add('active');
      });
    });
  }

  // ---- KPIs con conteo suave ----
  function countTo(el, target, ms = 900) {
    if (!el) return;
    const start = 0, t0 = performance.now();
    function step(t) {
      const p = Math.min(1, (t - t0) / ms);
      el.textContent = Math.round(start + (target - start) * p);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Inicializa slider del hero (si existe)
    initSlider('heroSlider', 'sliderDots', 3500);

    // KPIs (usa valores demo; puedes traerlos de API/localStorage si quieres)
    countTo(document.getElementById('kpi1'), 1240);
    countTo(document.getElementById('kpi2'), 4);
    countTo(document.getElementById('kpi3'), 3);

    // Año en el footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
