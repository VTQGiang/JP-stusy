/* ============================================================
 * app.js  —  Shared utilities: navbar, toast, speech, confetti
 * ============================================================ */

/* -------------------------------------------------------
   NAVBAR active link
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });

  renderToastContainer();
});

/* -------------------------------------------------------
   TOAST NOTIFICATIONS
   ------------------------------------------------------- */
function renderToastContainer() {
  if (!document.getElementById('toast-container')) {
    const el = document.createElement('div');
    el.id = 'toast-container';
    document.body.appendChild(el);
  }
}

function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '📢'}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

/* -------------------------------------------------------
   TEXT-TO-SPEECH (Web Speech API)
   ------------------------------------------------------- */
function speak(text, lang = 'ja-JP') {
  if (!window.speechSynthesis) {
    showToast('Trình duyệt không hỗ trợ phát âm.', 'warning');
    return;
  }
  window.speechSynthesis.cancel();
  const utt  = new SpeechSynthesisUtterance(text);
  utt.lang   = lang;
  utt.rate   = 0.85;
  utt.pitch  = 1;

  // Try to find a Japanese voice
  const voices = window.speechSynthesis.getVoices();
  const jpVoice = voices.find(v => v.lang.startsWith('ja'));
  if (jpVoice) utt.voice = jpVoice;

  window.speechSynthesis.speak(utt);
}

/* -------------------------------------------------------
   CONFETTI
   ------------------------------------------------------- */
function launchConfetti(duration = 3000) {
  let canvas = document.getElementById('confetti-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;';
    document.body.appendChild(canvas);
  }
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx      = canvas.getContext('2d');
  const particles = [];
  const colors   = ['#7C6FFF','#FF6B9D','#2ECC9A','#FFB347','#38F9D7','#FF4757'];
  const count    = 120;

  for (let i = 0; i < count; i++) {
    particles.push({
      x:    Math.random() * canvas.width,
      y:    -10 - Math.random() * 100,
      size: Math.random() * 9 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * 360,
      spin:  (Math.random() - 0.5) * 6,
      drift: (Math.random() - 0.5) * 2,
    });
  }

  const start = Date.now();
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = Date.now() - start;
    const alpha   = Math.max(0, 1 - (elapsed - duration * 0.6) / (duration * 0.4));

    particles.forEach(p => {
      p.y     += p.speed;
      p.x     += p.drift;
      p.angle += p.spin;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    });

    if (elapsed < duration) requestAnimationFrame(draw);
    else { ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.remove(); }
  }
  requestAnimationFrame(draw);
}

/* -------------------------------------------------------
   PROGRESS BAR helper
   ------------------------------------------------------- */
function setProgressBar(el, pct) {
  const bar = el.querySelector ? el.querySelector('.progress-bar') : el;
  if (bar) bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
}

/* -------------------------------------------------------
   PROGRESS RING helper
   ------------------------------------------------------- */
function setProgressRing(svgEl, pct) {
  const fill = svgEl.querySelector('.progress-ring-fill');
  if (!fill) return;
  const r    = fill.getAttribute('r');
  const circ = 2 * Math.PI * r;
  fill.style.strokeDasharray  = circ;
  fill.style.strokeDashoffset = circ * (1 - pct / 100);
}

/* -------------------------------------------------------
   COMMON NAVBAR HTML  (injected by each page)
   ------------------------------------------------------- */
function renderNavbar(activePage) {
  const setId = getSetIdFromURL();
  const backHref = setId ? `study-set.html?set=${setId}` : 'index.html';

  return `
  <nav class="navbar">
    <div class="navbar-inner">
      <a href="index.html" class="navbar-brand">
        <div class="brand-logo">🌸</div>
        <span class="brand-name">NihonGo</span>
      </a>
      <ul class="navbar-nav hide-mobile">
        <li><a href="index.html" ${activePage==='home'?'class="active"':''}>🏠 Trang chủ</a></li>
        <li><a href="create.html" ${activePage==='create'?'class="active"':''}>➕ Tạo bộ thẻ</a></li>
      </ul>
      <div class="navbar-actions">
        ${setId ? `<a href="${backHref}" class="btn btn-ghost btn-sm">← Về trước</a>` : ''}
        <button class="btn btn-primary btn-sm" onclick="window.location.href='create.html'" title="Tạo bộ thẻ mới">
          + Tạo mới
        </button>
      </div>
    </div>
  </nav>`;
}

/* -------------------------------------------------------
   Keyboard shortcut helper
   ------------------------------------------------------- */
function onKey(key, callback) {
  document.addEventListener('keydown', e => {
    if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
    if (e.key === key) callback(e);
  });
}

/* -------------------------------------------------------
   Format number helpers
   ------------------------------------------------------- */
function pct(n, d) { return d ? Math.round((n / d) * 100) : 0; }

function levelBadge(level) {
  return `<span class="badge-${level.toLowerCase()}">${level}</span>`;
}
