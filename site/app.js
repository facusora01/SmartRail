const SIM_ROUTES = {
  recorrido: 'SmartRail-1-Recorrido.html?v=4',
  'por-dentro': 'SmartRail-2-La-red-por-dentro.html?v=4',
  simulacion: 'SmartRail-3-Simulacion.html?v=4'
};

const VALID_SECTIONS = [
  'inicio',
  'recorrido',
  'por-dentro',
  'simulacion',
  'diseno-wan',
  'diagnostico',
  'pasos-nivel',
  'planificacion'
];

function showSection(name) {
  if (!VALID_SECTIONS.includes(name)) name = 'inicio';

  document.querySelectorAll('.nav-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-sec') === name);
  });

  VALID_SECTIONS.forEach((sec) => {
    const el = document.getElementById('sec-' + sec);
    if (!el) return;
    const isActive = sec === name;
    el.classList.toggle('active', isActive);

    if (isActive && SIM_ROUTES[sec]) {
      const frame = el.querySelector('iframe');
      const expectedSrc = frame ? frame.getAttribute('data-src') : '';
      const expectedFile = expectedSrc.split('?')[0];
      let currentPath = '';
      try {
        currentPath = frame && frame.contentWindow ? frame.contentWindow.location.pathname : '';
      } catch (_) {}
      if (frame && (!frame.getAttribute('src') || !currentPath.endsWith('/' + expectedFile))) {
        frame.setAttribute('src', expectedSrc);
      }
    }
  });

  const pop = document.getElementById('popoutBtn');
  if (pop) {
    if (SIM_ROUTES[name]) {
      pop.style.display = 'inline-flex';
      pop.href = SIM_ROUTES[name];
    } else {
      pop.style.display = 'none';
    }
  }

  if (location.hash !== '#' + name) {
    history.replaceState(null, '', '#' + name);
  }
  window.scrollTo(0, 0);
}

function selectSede(id, btn) {
  document.querySelectorAll('.sub-tab').forEach((b) => b.classList.remove('active'));
  document.querySelectorAll('.sede-panel').forEach((p) => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const panel = document.getElementById('sede-' + id);
  if (panel) panel.classList.add('active');
}

function openLightbox(src, caption) {
  const modal = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  if (!modal || !img || !cap) return;
  img.src = src;
  img.alt = caption || 'Imagen ampliada';
  cap.textContent = caption || '';
  modal.classList.add('open');
}

function closeLightbox() {
  const modal = document.getElementById('lightbox');
  if (modal) modal.classList.remove('open');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.getElementById('themeBtn');
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro';
  }
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  localStorage.setItem('smartrail-theme', next);
  applyTheme(next);
}

function filterPlanTable(query) {
  const q = (query || '').trim().toLowerCase();
  document.querySelectorAll('#planTable tbody tr').forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = !q || text.includes(q) ? '' : 'none';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('smartrail-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  document.querySelectorAll('.fig-thumb img').forEach((img) => {
    img.parentElement.addEventListener('click', () => {
      const captionEl = img.closest('.fig-card')?.querySelector('.fig-caption');
      openLightbox(img.src, captionEl ? captionEl.textContent.trim() : img.alt);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  const h = (location.hash || '').replace('#', '');
  if (h) showSection(h);
});
