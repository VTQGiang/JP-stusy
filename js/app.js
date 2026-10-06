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
        <li><a href="grammar.html" ${activePage==='grammar'?'class="active"':''}>📖 Ngữ pháp</a></li>
        <li><a href="create.html" ${activePage==='create'?'class="active"':''}>➕ Tạo bộ thẻ</a></li>
      </ul>
      <div class="navbar-actions">
        ${setId ? `<a href="${backHref}" class="btn btn-ghost btn-sm">← Về trước</a>` : ''}
        <button class="btn btn-outline btn-sm" onclick="openSyncModal()" title="Đồng bộ giữa máy tính và điện thoại">🔄 Đồng bộ</button>
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

/* ============================================================
   CLIPBOARD & SYNC HELPERS
   ============================================================ */
function copyToClipboard(text, successMsg = 'Đã sao chép vào bộ nhớ tạm!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg, 'success');
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast(successMsg, 'success');
  } catch (e) {
    showToast('Không thể sao chép tự động. Vui lòng sao chép thủ công!', 'error');
  }
  document.body.removeChild(ta);
}

function encodeSyncCode(obj) {
  try {
    const json = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(json);
    let bin = '';
    bytes.forEach(b => bin += String.fromCharCode(b));
    return 'NIHONGO_' + btoa(bin);
  } catch (e) {
    return JSON.stringify(obj);
  }
}

function decodeSyncCode(code) {
  code = (code || '').trim();
  if (code.startsWith('NIHONGO_')) {
    const bin = atob(code.replace(/^NIHONGO_/, ''));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  }
  return JSON.parse(code);
}

/* ============================================================
   GLOBAL SYNC & BACKUP MODAL
   ============================================================ */
let currentSyncTargetSetId = null;

function ensureSyncModal() {
  if (document.getElementById('sync-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'sync-modal';
  modal.className = 'modal-overlay hidden';
  modal.onclick = (e) => { if (e.target === modal) closeSyncModal(); };

  modal.innerHTML = `
    <div class="modal-box sync-modal-box">
      <div class="flex items-center justify-between" style="margin-bottom:var(--sp-4);">
        <div class="modal-title" style="margin-bottom:0;display:flex;align-items:center;gap:8px;">
          <span>🔄</span>
          <span>Đồng bộ & Sao lưu dữ liệu</span>
        </div>
        <button class="btn btn-icon btn-sm" onclick="closeSyncModal()">✕</button>
      </div>

      <!-- TABS -->
      <div class="sync-tabs">
        <button class="sync-tab-btn active" id="tab-btn-export" onclick="switchSyncTab('export')">📤 Xuất dữ liệu (Máy tính)</button>
        <button class="sync-tab-btn" id="tab-btn-import" onclick="switchSyncTab('import')">📥 Nhập dữ liệu (Điện thoại)</button>
        <button class="sync-tab-btn" id="tab-btn-perm" onclick="switchSyncTab('perm')">🌐 Lưu vĩnh viễn trên GitHub</button>
      </div>

      <!-- TAB EXPORT -->
      <div id="sync-panel-export" class="sync-panel">
        <p style="font-size:.85rem;color:var(--text-secondary);margin-bottom:var(--sp-4);">
          Lấy dữ liệu từ máy tính để chuyển sang điện thoại hoặc lưu trữ dự phòng an toàn.
        </p>

        <div id="sync-target-set-box" class="sync-card-option" style="display:none;background:rgba(124,111,255,0.08);border-color:var(--clr-primary);">
          <div style="font-weight:700;font-size:.95rem;color:var(--clr-primary-light);" id="sync-target-set-name">Bộ thẻ</div>
          <p style="font-size:.8rem;color:var(--text-muted);margin:0;">Chỉ xuất riêng bộ thẻ này sang điện thoại.</p>
          <div class="flex gap-2 flex-wrap" style="margin-top:var(--sp-2);">
            <button class="btn btn-primary btn-sm" onclick="downloadCurrentSetJSON()">💾 Tải file JSON bộ này</button>
            <button class="btn btn-outline btn-sm" onclick="copyCurrentSetSyncCode()">📋 Sao chép mã bộ này</button>
          </div>
        </div>

        <div class="sync-card-option">
          <div style="font-weight:700;font-size:.95rem;">📦 Tất cả bộ thẻ & Tiến độ học</div>
          <p style="font-size:.8rem;color:var(--text-muted);margin:0;">Xuất toàn bộ các bộ thẻ bạn đã tạo và lịch sử ôn tập.</p>
          <div class="flex gap-2 flex-wrap" style="margin-top:var(--sp-2);">
            <button class="btn btn-primary btn-sm" onclick="downloadAllJSON()">💾 Tải file (.json)</button>
            <button class="btn btn-outline btn-sm" onclick="copyAllSyncCode()">📋 Sao chép mã đồng bộ</button>
          </div>
        </div>

        <div style="margin-top:var(--sp-3);padding:var(--sp-3);background:rgba(255,255,255,0.03);border-radius:var(--r-md);font-size:.8rem;color:var(--text-muted);line-height:1.5;">
          💡 <b>Mẹo gửi sang điện thoại nhanh nhất:</b><br>
          Bấm <b>"Sao chép mã"</b> ➔ Gửi qua tin nhắn (Zalo, Messenger, Telegram...) cho chính bạn ➔ Mở web trên điện thoại, bấm <b>"Đồng bộ"</b> ➔ chọn tab <b>"Nhập dữ liệu"</b> và dán vào!
        </div>
      </div>

      <!-- TAB IMPORT -->
      <div id="sync-panel-import" class="sync-panel" style="display:none;">
        <p style="font-size:.85rem;color:var(--text-secondary);margin-bottom:var(--sp-4);">
          Nhập bộ thẻ hoặc tiến độ học tập vào trình duyệt của thiết bị này.
        </p>

        <div class="sync-card-option">
          <div style="font-weight:700;font-size:.95rem;">📁 Cách 1: Tải lên file .json</div>
          <p style="font-size:.8rem;color:var(--text-muted);margin:0;">Chọn file sao lưu .json bạn đã tải về từ máy tính.</p>
          <div style="margin-top:var(--sp-2);">
            <input type="file" id="sync-file-input" accept=".json" style="display:none;" onchange="handleSyncFileUpload(event)">
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('sync-file-input').click()">📂 Chọn file JSON...</button>
          </div>
        </div>

        <div class="sync-card-option">
          <div style="font-weight:700;font-size:.95rem;">📝 Cách 2: Dán mã đồng bộ</div>
          <p style="font-size:.8rem;color:var(--text-muted);margin:0;">Dán mã đồng bộ (bắt đầu bằng NIHONGO_ hoặc JSON) bạn đã sao chép:</p>
          <textarea id="sync-paste-input" class="sync-code-area" placeholder="Dán mã đồng bộ vào đây..."></textarea>
          <div class="flex justify-end" style="margin-top:var(--sp-2);">
            <button class="btn btn-primary btn-sm" onclick="handleSyncTextImport()">⚡ Nhập dữ liệu ngay</button>
          </div>
        </div>
      </div>

      <!-- TAB PERMANENT (GITHUB) -->
      <div id="sync-panel-perm" class="sync-panel" style="display:none;">
        <p style="font-size:.85rem;color:var(--text-secondary);margin-bottom:var(--sp-4);">
          Đưa bộ thẻ vào mã nguồn trang web. Khi đó <b>mọi thiết bị (kể cả điện thoại của bạn lẫn người khác)</b> mở link GitHub Pages đều tự động có sẵn bộ thẻ mà không cần đồng bộ thủ công!
        </p>

        <div class="form-group" style="margin-bottom:var(--sp-3);">
          <label class="form-label">Chọn bộ thẻ muốn đưa vào mã nguồn:</label>
          <select id="sync-perm-select" class="form-select" onchange="renderPermSnippet()"></select>
        </div>

        <div style="margin-bottom:var(--sp-3);">
          <div class="flex items-center justify-between" style="margin-bottom:4px;">
            <span style="font-size:.8rem;color:var(--text-muted);">Mã JavaScript của bộ thẻ:</span>
            <button class="btn btn-ghost btn-sm" style="font-size:.75rem;padding:2px 8px;" onclick="copyPermSnippet()">📋 Sao chép mã này</button>
          </div>
          <textarea id="sync-perm-code" class="sync-code-area" readonly></textarea>
        </div>

        <div style="padding:var(--sp-4);background:rgba(255,255,255,0.03);border:1px solid var(--glass-border);border-radius:var(--r-md);font-size:.8rem;line-height:1.6;color:var(--text-secondary);">
          <div style="font-weight:700;color:var(--text-primary);margin-bottom:var(--sp-2);">Các bước thực hiện trên máy tính:</div>
          <div><span class="sync-step-badge">1</span> Bấm nút <b>"Sao chép mã này"</b> ở trên.</div>
          <div style="margin-top:4px;"><span class="sync-step-badge">2</span> Mở file <code>js/data.js</code>, tìm mảng <code>const DEFAULT_SETS = [ ... ]</code> và dán đoạn mã vào cuối mảng (nhớ thêm dấu phẩy ngăn cách).</div>
          <div style="margin-top:4px;"><span class="sync-step-badge">3</span> Mở terminal gõ: <code>git commit -am "Them bo the"</code> và <code>git push</code>.</div>
        </div>
      </div>

      <div class="modal-actions" style="margin-top:var(--sp-6);">
        <button class="btn btn-secondary" onclick="closeSyncModal()">Đóng</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function openSyncModal(initialTab = 'export', targetSetId = null) {
  ensureSyncModal();
  currentSyncTargetSetId = targetSetId || (typeof getSetIdFromURL === 'function' ? getSetIdFromURL() : null);

  const targetBox = document.getElementById('sync-target-set-box');
  if (currentSyncTargetSetId) {
    const s = DB.getSet(currentSyncTargetSetId);
    if (s && targetBox) {
      targetBox.style.display = 'block';
      document.getElementById('sync-target-set-name').textContent = `🎯 Bộ thẻ: "${s.name}" (${s.cards.length} từ)`;
    } else if (targetBox) {
      targetBox.style.display = 'none';
    }
  } else if (targetBox) {
    targetBox.style.display = 'none';
  }

  // Populate sets dropdown in permanent tab
  const permSelect = document.getElementById('sync-perm-select');
  if (permSelect) {
    const sets = DB.getSets();
    permSelect.innerHTML = sets.map(s => `<option value="${s.id}" ${s.id === currentSyncTargetSetId ? 'selected' : ''}>${s.name} (${s.level} · ${s.cards.length} từ)</option>`).join('');
    renderPermSnippet();
  }

  switchSyncTab(initialTab);
  document.getElementById('sync-modal').classList.remove('hidden');
}

function closeSyncModal() {
  document.getElementById('sync-modal')?.classList.add('hidden');
}

function switchSyncTab(tabName) {
  ['export', 'import', 'perm'].forEach(t => {
    const btn = document.getElementById(`tab-btn-${t}`);
    const panel = document.getElementById(`sync-panel-${t}`);
    if (btn) btn.classList.toggle('active', t === tabName);
    if (panel) panel.style.display = (t === tabName) ? 'block' : 'none';
  });
}

function renderPermSnippet() {
  const permSelect = document.getElementById('sync-perm-select');
  const codeBox = document.getElementById('sync-perm-code');
  if (!permSelect || !codeBox) return;
  const setId = permSelect.value;
  const s = DB.getSet(setId);
  if (!s) { codeBox.value = ''; return; }
  codeBox.value = JSON.stringify(s, null, 2) + ',';
}

function copyPermSnippet() {
  const codeBox = document.getElementById('sync-perm-code');
  if (!codeBox || !codeBox.value) return;
  copyToClipboard(codeBox.value, 'Đã sao chép mã! Hãy dán vào DEFAULT_SETS trong file js/data.js.');
}

function downloadCurrentSetJSON() {
  if (!currentSyncTargetSetId) return;
  const setExport = DB.exportSet(currentSyncTargetSetId);
  if (!setExport) { showToast('Không tìm thấy bộ thẻ!', 'error'); return; }
  const s = setExport.set;
  const filename = `nihongo-${(s.name || 'set').replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
  DB.downloadJSON(filename, setExport);
  showToast(`Đã tải file "${filename}"!`, 'success');
}

function copyCurrentSetSyncCode() {
  if (!currentSyncTargetSetId) return;
  const setExport = DB.exportSet(currentSyncTargetSetId);
  if (!setExport) { showToast('Không tìm thấy bộ thẻ!', 'error'); return; }
  const code = encodeSyncCode(setExport);
  copyToClipboard(code, `Đã sao chép mã bộ thẻ "${setExport.set.name}"!`);
}

function downloadAllJSON() {
  const data = DB.exportAll();
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `nihongo-backup-all-${dateStr}.json`;
  DB.downloadJSON(filename, data);
  showToast(`Đã tải file sao lưu "${filename}"!`, 'success');
}

function copyAllSyncCode() {
  const data = DB.exportAll();
  const code = encodeSyncCode(data);
  copyToClipboard(code, 'Đã sao chép mã đồng bộ toàn bộ dữ liệu!');
}

function handleSyncFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      const res = DB.importAll(parsed);
      showToast(`Đã nhập thành công ${res.importedSets || 1} bộ thẻ! 🎉`, 'success');
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showToast('File không đúng định dạng: ' + err.message, 'error');
    }
  };
  reader.readAsText(file, 'UTF-8');
  event.target.value = '';
}

function handleSyncTextImport() {
  const input = document.getElementById('sync-paste-input');
  const text = (input?.value || '').trim();
  if (!text) {
    showToast('Vui lòng dán mã đồng bộ hoặc dữ liệu JSON!', 'warning');
    return;
  }

  try {
    const data = decodeSyncCode(text);
    const res = DB.importAll(data);
    showToast(`Đã đồng bộ thành công ${res.importedSets || 1} bộ thẻ! 🎉`, 'success');
    input.value = '';
    setTimeout(() => window.location.reload(), 1000);
  } catch (err) {
    showToast('Mã đồng bộ không hợp lệ: ' + err.message, 'error');
  }
}

