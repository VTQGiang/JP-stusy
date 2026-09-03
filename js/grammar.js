/* ============================================================
 * grammar.js — Logic for Grammar management, Auto Exercise Generator,
 * Interactive Practice modal, and optional Gemini AI call.
 * ============================================================ */

let currentPracticeList = [];
let practiceQuestions = [];
let currentQIndex = 0;
let practiceScore = { correct: 0, wrong: 0 };
let userReorderPicked = [];

document.addEventListener('DOMContentLoaded', () => {
  renderGrammarList();
  renderDateFilters();
  initForm();
  loadSavedApiKey();
});

/* -------------------------------------------------------
   RENDER LIST
   ------------------------------------------------------- */
function renderGrammarList() {
  const list = GrammarDB.getAll();
  const container = document.getElementById('grammar-grid');
  const countBadge = document.getElementById('grammar-total-badge');
  const todayBadge = document.getElementById('today-count-badge');
  
  const today = new Date().toISOString().split('T')[0];
  const todayCount = list.filter(g => g.date === today).length;

  if (countBadge) countBadge.textContent = `${list.length} mẫu`;
  if (todayBadge) todayBadge.textContent = `${todayCount} mẫu`;

  if (!container) return;

  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">📖</div>
        <h3>Chưa có mẫu ngữ pháp nào</h3>
        <p>Hãy thêm mẫu ngữ pháp bạn học hôm nay ở form bên dưới!</p>
      </div>`;
    return;
  }

  container.innerHTML = list.map(g => {
    const isToday = g.date === today;
    return `
      <div class="card-glass anim-cardEnter" style="padding:var(--sp-5);display:flex;flex-direction:column;gap:var(--sp-3);position:relative;">
        <div class="flex items-center justify-between gap-2">
          <span class="tag ${isToday ? 'tag-success' : ''}">${isToday ? '🔥 Hôm nay' : g.date || 'N5'}</span>
          <span class="badge-n5">${g.level || 'N5'}</span>
        </div>
        
        <div>
          <h3 style="color:var(--clr-primary-light);font-size:1.25rem;margin-bottom:4px;" class="japanese">${escapeHtml(g.pattern)}</h3>
          <div style="font-weight:600;font-size:.95rem;color:var(--text-primary);">${escapeHtml(g.meaning)}</div>
        </div>

        ${g.connection ? `
          <div style="background:rgba(255,255,255,.04);padding:6px 10px;border-radius:var(--r-xs);font-size:.8rem;color:var(--clr-warning);border-left:3px solid var(--clr-warning);">
            <strong>Kết nối:</strong> ${escapeHtml(g.connection)}
          </div>
        ` : ''}

        <div style="font-size:.82rem;color:var(--text-secondary);line-height:1.4;">
          ${escapeHtml(g.note || '')}
        </div>

        <div style="margin-top:auto;padding-top:var(--sp-2);display:flex;gap:var(--sp-2);">
          <button class="btn btn-primary btn-sm flex-1" onclick="startPracticeForSingle('${g.id}')">
            🎯 Luyện tập (${g.examples ? g.examples.length : 0} câu)
          </button>
          <button class="btn btn-icon btn-sm" onclick="viewGrammarDetail('${g.id}')" title="Xem ví dụ chi tiết">
            👁️
          </button>
          <button class="btn btn-icon btn-sm" style="color:var(--clr-danger);" onclick="deleteGrammar('${g.id}')" title="Xóa mẫu">
            🗑️
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderDateFilters() {
  const list = GrammarDB.getAll();
  const select = document.getElementById('filter-grammar-date');
  if (!select) return;

  const dates = [...new Set(list.map(g => g.date).filter(Boolean))].sort().reverse();
  select.innerHTML = `<option value="">Tất cả thời gian</option>` + dates.map(d => `<option value="${d}">${d}</option>`).join('');
}

function filterGrammar() {
  const keyword = (document.getElementById('search-grammar')?.value || '').toLowerCase();
  const date = document.getElementById('filter-grammar-date')?.value || '';

  const all = GrammarDB.getAll();
  const filtered = all.filter(g => {
    const matchKey = !keyword || g.pattern.toLowerCase().includes(keyword) || g.meaning.toLowerCase().includes(keyword) || (g.note && g.note.toLowerCase().includes(keyword));
    const matchDate = !date || g.date === date;
    return matchKey && matchDate;
  });

  const container = document.getElementById('grammar-grid');
  if (!container) return;

  if (!filtered.length) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon">🔍</div>
        <h3>Không tìm thấy mẫu phù hợp</h3>
        <p>Thử tìm với từ khóa khác hoặc xóa bộ lọc thời gian.</p>
      </div>`;
    return;
  }

  // Render filtered
  container.innerHTML = filtered.map(g => `
    <div class="card-glass anim-cardEnter" style="padding:var(--sp-5);display:flex;flex-direction:column;gap:var(--sp-3);">
      <div class="flex items-center justify-between gap-2">
        <span class="tag">${g.date || 'N5'}</span>
        <span class="badge-n5">${g.level || 'N5'}</span>
      </div>
      <div>
        <h3 style="color:var(--clr-primary-light);font-size:1.25rem;margin-bottom:4px;" class="japanese">${escapeHtml(g.pattern)}</h3>
        <div style="font-weight:600;font-size:.95rem;color:var(--text-primary);">${escapeHtml(g.meaning)}</div>
      </div>
      ${g.connection ? `
        <div style="background:rgba(255,255,255,.04);padding:6px 10px;border-radius:var(--r-xs);font-size:.8rem;color:var(--clr-warning);border-left:3px solid var(--clr-warning);">
          <strong>Kết nối:</strong> ${escapeHtml(g.connection)}
        </div>
      ` : ''}
      <div style="font-size:.82rem;color:var(--text-secondary);line-height:1.4;">${escapeHtml(g.note || '')}</div>
      <div style="margin-top:auto;padding-top:var(--sp-2);display:flex;gap:var(--sp-2);">
        <button class="btn btn-primary btn-sm flex-1" onclick="startPracticeForSingle('${g.id}')">
          🎯 Luyện tập (${g.examples ? g.examples.length : 0} câu)
        </button>
        <button class="btn btn-icon btn-sm" onclick="viewGrammarDetail('${g.id}')" title="Xem ví dụ chi tiết">👁️</button>
        <button class="btn btn-icon btn-sm" style="color:var(--clr-danger);" onclick="deleteGrammar('${g.id}')" title="Xóa">🗑️</button>
      </div>
    </div>
  `).join('');
}

/* -------------------------------------------------------
   ADD GRAMMAR (FORM)
   ------------------------------------------------------- */
function initForm() {
  const addExBtn = document.getElementById('btn-add-example-row');
  if (addExBtn) addExBtn.addEventListener('click', () => addExampleRow());
}

function addExampleRow(jp = '', vn = '') {
  const container = document.getElementById('example-rows-container');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'flex gap-2 items-center ex-row anim-fadeIn';
  row.style.marginBottom = '8px';
  row.innerHTML = `
    <input type="text" class="form-input ex-jp japanese" style="flex:1;" placeholder="Câu tiếng Nhật (Ví dụ: わたしは学生です。)" value="${escapeHtml(jp)}">
    <input type="text" class="form-input ex-vn" style="flex:1;" placeholder="Nghĩa tiếng Việt (Tôi là học sinh)" value="${escapeHtml(vn)}">
    <button type="button" class="btn btn-icon btn-sm" style="color:var(--clr-danger);" onclick="this.parentElement.remove()" title="Xóa dòng">✕</button>
  `;
  container.appendChild(row);
}

function saveGrammar(andPractice = false) {
  const pattern = document.getElementById('input-pattern')?.value.trim();
  const meaning = document.getElementById('input-meaning')?.value.trim();
  const connection = document.getElementById('input-connection')?.value.trim();
  const note = document.getElementById('input-note')?.value.trim();
  const level = document.getElementById('input-level')?.value || 'N5';
  const customDate = document.getElementById('input-date')?.value || new Date().toISOString().split('T')[0];

  if (!pattern || !meaning) {
    showToast('Vui lòng nhập Tên mẫu ngữ pháp và Ý nghĩa!', 'error');
    return;
  }

  // Collect examples
  const rows = document.querySelectorAll('.ex-row');
  const examples = [];
  rows.forEach(r => {
    const jp = r.querySelector('.ex-jp')?.value.trim();
    const vn = r.querySelector('.ex-vn')?.value.trim();
    if (jp) {
      examples.push({ jp, reading: jp, vn: vn || '' });
    }
  });

  if (!examples.length) {
    // If no example entered, create a fallback basic example from pattern
    examples.push({ jp: pattern.replace(/～/g, '___'), reading: '', vn: meaning });
  }

  const newGrammar = {
    id: 'g-user-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    pattern,
    meaning,
    connection,
    note,
    level,
    date: customDate,
    examples
  };

  GrammarDB.save(newGrammar);
  showToast(`Đã lưu mẫu "${pattern}" vào sổ tay! 🎉`, 'success');

  // Clear form
  document.getElementById('input-pattern').value = '';
  document.getElementById('input-meaning').value = '';
  document.getElementById('input-connection').value = '';
  document.getElementById('input-note').value = '';
  document.getElementById('example-rows-container').innerHTML = '';
  addExampleRow(); // reset with 1 empty row

  renderGrammarList();
  renderDateFilters();

  if (andPractice) {
    startPracticeForSingle(newGrammar.id);
  }
}

function deleteGrammar(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa mẫu ngữ pháp này?')) return;
  GrammarDB.delete(id);
  showToast('Đã xóa mẫu ngữ pháp', 'info');
  renderGrammarList();
  renderDateFilters();
}

/* -------------------------------------------------------
   VIEW DETAIL MODAL
   ------------------------------------------------------- */
function viewGrammarDetail(id) {
  const g = GrammarDB.getById(id);
  if (!g) return;

  const modal = document.getElementById('grammar-detail-modal');
  const body = document.getElementById('grammar-detail-body');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="margin-bottom:16px;">
      <span class="badge-n5">${g.level || 'N5'}</span>
      <h2 style="color:var(--clr-primary-light);margin-top:6px;" class="japanese">${escapeHtml(g.pattern)}</h2>
      <div style="font-size:1.1rem;font-weight:600;color:var(--text-primary);margin-top:2px;">${escapeHtml(g.meaning)}</div>
    </div>

    ${g.connection ? `
      <div style="background:rgba(255,255,255,.05);padding:10px 14px;border-radius:var(--r-sm);border-left:4px solid var(--clr-warning);margin-bottom:16px;">
        <div style="font-size:.8rem;color:var(--text-muted);font-weight:600;">CẤU TRÚC KẾT NỐI:</div>
        <div style="font-size:1rem;color:var(--clr-warning);font-weight:600;margin-top:2px;">${escapeHtml(g.connection)}</div>
      </div>
    ` : ''}

    ${g.note ? `
      <div style="background:rgba(255,255,255,.03);padding:10px 14px;border-radius:var(--r-sm);margin-bottom:16px;font-size:.9rem;color:var(--text-secondary);line-height:1.5;">
        <strong>Giải thích & Lưu ý:</strong><br>${escapeHtml(g.note)}
      </div>
    ` : ''}

    <h3 style="font-size:1rem;margin-bottom:10px;">Ví dụ thực tế (${g.examples ? g.examples.length : 0} câu):</h3>
    <div class="flex-col gap-2">
      ${(g.examples || []).map((ex, i) => `
        <div class="word-item" style="padding:10px 14px;">
          <div>
            ${ex.reading && ex.reading !== ex.jp ? `<div style="font-size:.85rem;color:var(--clr-primary-light);letter-spacing:.03em;margin-bottom:2px;font-family:'Noto Sans JP',sans-serif;">${escapeHtml(ex.reading)}</div>` : ''}
            <div class="japanese" style="font-size:1.1rem;font-weight:600;">${escapeHtml(ex.jp)}</div>
            <div style="font-size:.85rem;color:var(--text-secondary);margin-top:4px;">${escapeHtml(ex.vn)}</div>
          </div>
          <button class="btn btn-icon btn-sm" onclick="speak('${escapeQuote(ex.jp)}')">🔊</button>
        </div>
      `).join('')}
    </div>

    <div style="margin-top:20px;display:flex;gap:10px;justify-content:flex-end;">
      <button class="btn btn-secondary" onclick="closeDetailModal()">Đóng</button>
      <button class="btn btn-primary" onclick="closeDetailModal(); startPracticeForSingle('${g.id}');">🎯 Luyện tập mẫu này</button>
    </div>
  `;

  modal.classList.remove('hidden');
}

function closeDetailModal() {
  document.getElementById('grammar-detail-modal')?.classList.add('hidden');
}

/* -------------------------------------------------------
   AUTO-EXERCISE GENERATOR (Client-Side, Super Lightweight)
   ------------------------------------------------------- */
function generateQuestionsForItems(grammarItems) {
  const questions = [];
  const commonParticles = ['は', 'が', 'を', 'に', 'で', 'へ', 'も', 'と', 'から', 'まで'];
  const commonForms = ['てください', 'てもいいです', 'てはいけません', 'たいです', 'ないでください', 'ました', 'ません'];

  grammarItems.forEach(item => {
    const cleanPattern = item.pattern.replace(/～/g, '').trim();

    (item.examples || []).forEach((ex, idx) => {
      // 1. Dạng Điền khuyết (Cloze Test)
      let blankSentence = '';
      let correctAnswer = '';
      let choices = [];

      // Check if the clean pattern appears in the Japanese sentence
      if (cleanPattern && ex.jp.includes(cleanPattern)) {
        correctAnswer = cleanPattern;
        blankSentence = ex.jp.replace(cleanPattern, '【 _____ 】');
        
        // Pick 3 distractors
        const pool = commonForms.concat(commonParticles).filter(x => x !== correctAnswer);
        choices = shuffle(pool).slice(0, 3);
        choices.push(correctAnswer);
        choices = shuffle(choices);
      } else {
        // Find if any particle is in the sentence
        let matchedP = commonParticles.find(p => ex.jp.includes(p));
        if (matchedP) {
          correctAnswer = matchedP;
          blankSentence = ex.jp.replace(matchedP, '【 _____ 】');
          const dist = shuffle(commonParticles.filter(p => p !== matchedP)).slice(0, 3);
          choices = shuffle([correctAnswer, ...dist]);
        }
      }

      if (blankSentence && correctAnswer) {
        questions.push({
          type: 'cloze',
          pattern: item.pattern,
          prompt: blankSentence,
          fullJp: ex.jp,
          meaning: ex.vn,
          correct: correctAnswer,
          choices,
          note: item.connection || item.meaning
        });
      }

      // 2. Dạng Sắp xếp câu (Sentence Reorder)
      const chunks = splitSentenceToChunks(ex.jp);
      if (chunks && chunks.length >= 3) {
        questions.push({
          type: 'reorder',
          pattern: item.pattern,
          meaning: ex.vn,
          fullJp: ex.jp,
          chunks: shuffle([...chunks]),
          correctSequence: chunks,
          note: `Thứ tự đúng: ${ex.jp}`
        });
      }
    });

    // 3. Dạng hỏi ý nghĩa / cấu trúc ngữ pháp
    questions.push({
      type: 'meaning',
      pattern: item.pattern,
      prompt: `Mẫu ngữ pháp 「${item.pattern}」 có ý nghĩa là gì?`,
      correct: item.meaning,
      choices: shuffle([
        item.meaning,
        'Biểu thị nguyên nhân, lý do vì...',
        'Biểu thị sự so sánh hơn kém',
        'Biểu thị khả năng có thể làm được'
      ]),
      note: item.connection ? `Công thức: ${item.connection}` : ''
    });
  });

  return shuffle(questions);
}

function splitSentenceToChunks(jp) {
  // Simple heuristic splitter by punctuation, particles, or spaces
  const clean = jp.replace(/。$/, '');
  const tokens = clean.split(/(は|が|を|に|で|へ|も|と|から|まで|、)/g).filter(Boolean);

  // Group pairs if single character particles
  const chunks = [];
  let temp = '';
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (['は','が','を','に','で','へ','も','と','から','まで','、'].includes(t)) {
      if (temp) {
        chunks.push(temp + t);
        temp = '';
      } else {
        chunks.push(t);
      }
    } else {
      if (temp) chunks.push(temp);
      temp = t;
    }
  }
  if (temp) chunks.push(temp);

  return chunks.length >= 2 ? chunks : null;
}

/* -------------------------------------------------------
   PRACTICE RUNNER
   ------------------------------------------------------- */
function startPracticeForToday() {
  const todayItems = GrammarDB.getTodayItems();
  if (!todayItems.length) {
    showToast('Hôm nay bạn chưa thêm mẫu ngữ pháp nào. Đang mở toàn bộ mẫu!', 'info');
    startPracticeAll();
    return;
  }
  launchPracticeSession(todayItems, 'Luyện tập Ngữ Pháp Hôm Nay');
}

function startPracticeAll() {
  const all = GrammarDB.getAll();
  if (!all.length) {
    showToast('Chưa có dữ liệu ngữ pháp để luyện tập!', 'error');
    return;
  }
  launchPracticeSession(all, 'Luyện tập Tất cả Ngữ Pháp');
}

function startPracticeForSingle(id) {
  const g = GrammarDB.getById(id);
  if (!g) return;
  launchPracticeSession([g], `Luyện tập: ${g.pattern}`);
}

function launchPracticeSession(items, title) {
  currentPracticeList = items;
  practiceQuestions = generateQuestionsForItems(items);

  if (!practiceQuestions.length) {
    showToast('Mẫu này chưa có đủ câu ví dụ để tạo bài tập. Hãy bấm Xem chi tiết hoặc thêm ví dụ!', 'warning');
    return;
  }

  // Cap at 15 questions max per session to avoid fatigue
  practiceQuestions = practiceQuestions.slice(0, 15);
  currentQIndex = 0;
  practiceScore = { correct: 0, wrong: 0 };

  const modal = document.getElementById('grammar-practice-modal');
  document.getElementById('practice-session-title').textContent = title;
  modal.classList.remove('hidden');

  renderPracticeQuestion();
}

function closePracticeModal() {
  document.getElementById('grammar-practice-modal')?.classList.add('hidden');
}

function renderPracticeQuestion() {
  if (currentQIndex >= practiceQuestions.length) {
    showPracticeComplete();
    return;
  }

  const q = practiceQuestions[currentQIndex];
  const container = document.getElementById('practice-question-container');
  const progressText = document.getElementById('practice-progress-text');
  const progressBar = document.getElementById('practice-progress-bar');

  if (progressText) progressText.textContent = `Câu ${currentQIndex + 1} / ${practiceQuestions.length}`;
  if (progressBar) progressBar.style.width = `${pct(currentQIndex, practiceQuestions.length)}%`;

  if (q.type === 'cloze' || q.type === 'meaning') {
    container.innerHTML = `
      <div class="test-question anim-cardEnter" style="margin-bottom:16px;">
        <div class="test-qnum">${q.type === 'cloze' ? '🎯 Điền vào chỗ trống' : '💡 Nhớ ý nghĩa ngữ pháp'} · ${escapeHtml(q.pattern)}</div>
        <div class="test-qtext japanese" style="font-size:1.35rem;line-height:1.5;">${escapeHtml(q.prompt)}</div>
        ${q.meaning ? `<div style="color:var(--text-secondary);font-size:.9rem;margin-top:6px;">Nghĩa: ${escapeHtml(q.meaning)}</div>` : ''}
      </div>

      <div class="learn-choices">
        ${q.choices.map((c, i) => `
          <button class="choice-btn" onclick="checkChoiceAnswer(this, '${escapeQuote(c)}', '${escapeQuote(q.correct)}', '${escapeQuote(q.fullJp || '')}', '${escapeQuote(q.note || '')}')">
            <span class="choice-label">${['A','B','C','D'][i]}</span>
            <span class="japanese">${escapeHtml(c)}</span>
          </button>
        `).join('')}
      </div>
      <div id="practice-feedback-area"></div>
    `;
    if (q.fullJp) speak(q.fullJp);
  } else if (q.type === 'reorder') {
    userReorderPicked = [];
    container.innerHTML = `
      <div class="test-question anim-cardEnter" style="margin-bottom:16px;">
        <div class="test-qnum">🧩 Sắp xếp các cụm từ thành câu đúng · ${escapeHtml(q.pattern)}</div>
        <div style="font-size:1.1rem;font-weight:600;color:var(--text-primary);">${escapeHtml(q.meaning)}</div>
        
        <!-- Drop area -->
        <div id="reorder-dropzone" style="min-height:50px;background:rgba(255,255,255,.05);border:2px dashed var(--glass-border-hi);border-radius:var(--r-md);margin-top:16px;padding:10px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
          <span id="reorder-placeholder" style="color:var(--text-muted);font-size:.85rem;">Bấm vào các từ bên dưới theo thứ tự đúng...</span>
        </div>
      </div>

      <!-- Word chunks -->
      <div style="margin-bottom:20px;">
        <div style="font-size:.8rem;color:var(--text-muted);margin-bottom:8px;">Cụm từ khả dụng (Bấm để chọn):</div>
        <div id="reorder-pool" style="display:flex;flex-wrap:wrap;gap:10px;">
          ${q.chunks.map((word, i) => `
            <button class="btn btn-secondary reorder-tile japanese" id="chunk-${i}" style="font-size:1.1rem;padding:8px 16px;" onclick="pickReorderChunk('${escapeQuote(word)}', 'chunk-${i}')">
              ${escapeHtml(word)}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="flex gap-2">
        <button class="btn btn-ghost btn-sm" onclick="resetReorder()">↺ Chọn lại</button>
        <button class="btn btn-primary flex-1" id="btn-submit-reorder" onclick="checkReorderAnswer('${escapeQuote(q.fullJp)}', '${escapeQuote(q.note)}')">
          Kiểm tra câu ↵
        </button>
      </div>
      <div id="practice-feedback-area"></div>
    `;
  }
}

function checkChoiceAnswer(btn, chosen, correct, fullJp, note) {
  const isCorrect = chosen === correct;
  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b.textContent.includes(correct)) b.classList.add('correct');
    else if (b === btn && !isCorrect) b.classList.add('wrong');
  });

  if (isCorrect) practiceScore.correct++;
  else practiceScore.wrong++;

  const fb = document.getElementById('practice-feedback-area');
  fb.innerHTML = `
    <div class="feedback-bar ${isCorrect ? 'correct' : 'wrong'}" style="margin-top:12px;">
      <span>${isCorrect ? '✅ Chính xác!' : `❌ Chưa đúng! Đáp án: <strong>${correct}</strong>`}</span>
      ${note ? `<span style="margin-left:auto;font-size:.85rem;color:var(--text-muted);">${note}</span>` : ''}
    </div>
  `;

  if (fullJp) speak(fullJp);

  setTimeout(() => {
    currentQIndex++;
    renderPracticeQuestion();
  }, 1600);
}

function pickReorderChunk(word, elId) {
  const el = document.getElementById(elId);
  if (!el || el.disabled) return;

  el.disabled = true;
  el.style.opacity = '0.3';
  userReorderPicked.push({ word, elId });

  updateReorderDropzone();
}

function updateReorderDropzone() {
  const dropzone = document.getElementById('reorder-dropzone');
  const ph = document.getElementById('reorder-placeholder');
  if (!dropzone) return;

  if (userReorderPicked.length > 0) {
    if (ph) ph.style.display = 'none';
    dropzone.innerHTML = userReorderPicked.map((item, idx) => `
      <span class="tag tag-primary japanese" style="font-size:1.1rem;padding:6px 14px;cursor:pointer;" onclick="unpickReorderChunk(${idx})" title="Bấm để hoàn lại">
        ${escapeHtml(item.word)} ✕
      </span>
    `).join('');
  } else {
    dropzone.innerHTML = `<span id="reorder-placeholder" style="color:var(--text-muted);font-size:.85rem;">Bấm vào các từ bên dưới theo thứ tự đúng...</span>`;
  }
}

function unpickReorderChunk(index) {
  const item = userReorderPicked[index];
  if (!item) return;

  const originBtn = document.getElementById(item.elId);
  if (originBtn) {
    originBtn.disabled = false;
    originBtn.style.opacity = '1';
  }

  userReorderPicked.splice(index, 1);
  updateReorderDropzone();
}

function resetReorder() {
  userReorderPicked.forEach(item => {
    const b = document.getElementById(item.elId);
    if (b) { b.disabled = false; b.style.opacity = '1'; }
  });
  userReorderPicked = [];
  updateReorderDropzone();
}

function checkReorderAnswer(fullJp, note) {
  const assembled = userReorderPicked.map(x => x.word).join('');
  const cleanAssembled = assembled.replace(/[、。\s]/g, '');
  const cleanTarget = fullJp.replace(/[、。\s]/g, '');

  const isCorrect = cleanAssembled === cleanTarget;

  if (isCorrect) practiceScore.correct++;
  else practiceScore.wrong++;

  document.getElementById('btn-submit-reorder').disabled = true;

  const fb = document.getElementById('practice-feedback-area');
  fb.innerHTML = `
    <div class="feedback-bar ${isCorrect ? 'correct' : 'wrong'}" style="margin-top:12px;">
      <span>${isCorrect ? '✅ Ghép câu chuẩn xác!' : `❌ Chưa đúng! Câu chuẩn: <strong>${fullJp}</strong>`}</span>
    </div>
  `;

  speak(fullJp);

  setTimeout(() => {
    currentQIndex++;
    renderPracticeQuestion();
  }, 1800);
}

function showPracticeComplete() {
  const container = document.getElementById('practice-question-container');
  const total = practiceQuestions.length;
  const correct = practiceScore.correct;
  const accuracy = pct(correct, total);

  if (accuracy >= 80) launchConfetti();

  container.innerHTML = `
    <div class="complete-screen" style="padding:var(--sp-6) 0;">
      <div class="complete-icon">${accuracy >= 80 ? '🌟' : '📚'}</div>
      <h2>Hoàn thành phiên luyện tập!</h2>
      <p style="margin-top:4px;">Bạn đã hoàn thành các câu hỏi trắc nghiệm & sắp xếp câu ngữ pháp.</p>

      <div class="complete-stats" style="margin:var(--sp-6) 0;">
        <div class="complete-stat">
          <div class="complete-stat-value" style="color:var(--clr-success);">${correct}</div>
          <div class="complete-stat-label">Số câu đúng</div>
        </div>
        <div class="complete-stat">
          <div class="complete-stat-value" style="color:var(--clr-danger);">${practiceScore.wrong}</div>
          <div class="complete-stat-label">Số câu sai</div>
        </div>
        <div class="complete-stat">
          <div class="complete-stat-value" style="color:var(--clr-primary-light);">${accuracy}%</div>
          <div class="complete-stat-label">Độ chính xác</div>
        </div>
      </div>

      <div class="flex gap-3 justify-center">
        <button class="btn btn-primary" onclick="launchPracticeSession(currentPracticeList, 'Luyện tập lại')">🔄 Làm lại bài</button>
        <button class="btn btn-secondary" onclick="closePracticeModal()">Đóng cửa sổ</button>
      </div>
    </div>
  `;
}

/* -------------------------------------------------------
   OPTIONAL: GEMINI AI HELPER (Free & 100% Client-Side)
   ------------------------------------------------------- */
function loadSavedApiKey() {
  const key = GrammarDB.getGeminiKey();
  const input = document.getElementById('input-gemini-key');
  if (input && key) input.value = key;
}

function saveApiKeyFromUI() {
  const key = document.getElementById('input-gemini-key')?.value.trim();
  GrammarDB.saveGeminiKey(key);
  showToast(key ? 'Đã lưu Gemini API Key!' : 'Đã xóa API Key.', 'info');
}

async function requestAIAssist() {
  const pattern = document.getElementById('input-pattern')?.value.trim();
  if (!pattern) {
    showToast('Vui lòng nhập tên mẫu ngữ pháp trước (ví dụ: ～てください)!', 'error');
    return;
  }

  const apiKey = GrammarDB.getGeminiKey();
  if (!apiKey) {
    alert('Để dùng tính năng AI tự động phân tích và sinh ví dụ, vui lòng nhập Gemini API Key miễn phí ở ô cài đặt bên dưới (hoặc bạn có thể tự gõ câu ví dụ bằng tay không cần AI).');
    document.getElementById('input-gemini-key')?.focus();
    return;
  }

  const btn = document.getElementById('btn-ai-generate');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ AI đang phân tích...'; }

  const prompt = `Bạn là giáo viên dạy tiếng Nhật N5. Hãy phân tích mẫu ngữ pháp: "${pattern}".
Trả về kết quả dưới định dạng JSON duy nhất (không bọc trong markdown code block, chỉ plain JSON):
{
  "meaning": "Ý nghĩa tiếng Việt ngắn gọn",
  "connection": "Công thức kết nối (VD: V-te + kudasai)",
  "note": "Giải thích ngắn gọn 1-2 câu",
  "examples": [
    { "jp": "Câu tiếng Nhật tự nhiên có kanji", "reading": "Câu hiragana", "vn": "Dịch nghĩa tiếng Việt" },
    { "jp": "Câu tiếng Nhật 2", "reading": "Câu hiragana 2", "vn": "Dịch nghĩa tiếng Việt 2" }
  ]
}`;

  try {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await resp.json();
    if (data.error) throw new Error(data.error.message || 'Lỗi API');

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanJson = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleanJson);

    if (result.meaning) document.getElementById('input-meaning').value = result.meaning;
    if (result.connection) document.getElementById('input-connection').value = result.connection;
    if (result.note) document.getElementById('input-note').value = result.note;

    if (result.examples && result.examples.length) {
      document.getElementById('example-rows-container').innerHTML = '';
      result.examples.forEach(ex => addExampleRow(ex.jp, ex.vn));
    }

    showToast('AI đã tự động điền ý nghĩa, công thức và câu ví dụ! ✨', 'success');
  } catch (err) {
    alert('Không thể kết nối với Gemini AI: ' + err.message + '\nBạn hãy kiểm tra lại API Key hoặc tự nhập ví dụ thủ công.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '✨ Nhờ AI tự động điền ví dụ'; }
  }
}

/* Helper sanitizers */
function escapeHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function escapeQuote(str) {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}
