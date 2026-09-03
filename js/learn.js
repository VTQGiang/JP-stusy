/* ============================================================
 * learn.js  —  Smart Learn mode (SM-2 powered)
 * ============================================================ */

let LRN = {
  set:       null,
  queue:     [],   // cards to study this session
  qIndex:    0,
  correct:   0,
  incorrect: 0,
  mode:      'mcq', // 'mcq' | 'type'
  answered:  false,
  sessionSize: 20,
};

/* -------------------------------------------------------
   INIT
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const setId = getSetIdFromURL();
  if (!setId) { window.location.href = 'index.html'; return; }

  LRN.set = DB.getSet(setId);
  if (!LRN.set) { window.location.href = 'index.html'; return; }

  document.getElementById('navbar-placeholder').innerHTML = renderNavbar('learn');
  document.getElementById('set-title').textContent = LRN.set.name;

  buildQueue();
  renderQuestion();
});

/* -------------------------------------------------------
   BUILD STUDY QUEUE  (SM-2 priority)
   ------------------------------------------------------- */
function buildQueue() {
  const cards   = LRN.set.cards;
  const due     = SM2.getDueCards(LRN.set.id, cards);

  // Fill remaining with shuffle of all cards if not enough due
  let pool = due.length >= 10 ? due : shuffle(cards);
  pool = pool.slice(0, LRN.sessionSize);

  // Alternate between MCQ and type-in
  LRN.queue   = pool;
  LRN.qIndex  = 0;
  LRN.correct = 0;
  LRN.incorrect = 0;
}

/* -------------------------------------------------------
   RENDER QUESTION
   ------------------------------------------------------- */
function renderQuestion() {
  LRN.answered = false;

  if (LRN.qIndex >= LRN.queue.length) { showLearningComplete(); return; }

  const card = LRN.queue[LRN.qIndex];

  // Alternate modes: even = MCQ JP→VN, odd = type VN→JP
  const isEven = LRN.qIndex % 3 !== 2;
  LRN.mode = isEven ? 'mcq' : 'type';

  updateSessionHeader();

  document.getElementById('question-area').innerHTML = buildQuestionHTML(card, LRN.mode);

  // Bind answer events
  if (LRN.mode === 'mcq') {
    document.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => answerMCQ(btn, card));
    });
  } else {
    document.getElementById('type-submit').addEventListener('click', () => answerType(card));
    document.getElementById('type-field').addEventListener('keydown', e => {
      if (e.key === 'Enter') answerType(card);
    });
    document.getElementById('type-field').focus();
  }
}

/* -------------------------------------------------------
   BUILD QUESTION HTML
   ------------------------------------------------------- */
function buildQuestionHTML(card, mode) {
  const allCards = LRN.set.cards;

  if (mode === 'mcq') {
    // Question: show Japanese, pick Vietnamese meaning
    const wrong = shuffle(allCards.filter(c => c.id !== card.id)).slice(0, 3);
    const choices = shuffle([card, ...wrong]);

    return `
      <div class="learn-question anim-fadeIn">
        <div class="learn-qtype">Chọn nghĩa đúng 🎯</div>
        <div class="learn-qtext">
          ${card.romaji ? `<div style="font-size:1.15rem;font-weight:600;color:var(--clr-primary-light);letter-spacing:.08em;margin-bottom:2px;">[ ${card.romaji} ]</div>` : ''}
          ${card.hiragana && card.hiragana !== card.front ? `<div style="color:var(--text-secondary);font-family:'Noto Sans JP',sans-serif;font-size:1.1rem;margin-bottom:6px;">${card.hiragana}</div>` : ''}
          <div class="japanese-lg">${card.front}</div>
        </div>
        <button class="btn btn-icon" style="position:absolute;top:16px;right:16px;" onclick="speak('${card.front.replace(/'/g,"\\'")}')">🔊</button>
      </div>
      <div class="learn-choices" id="choices-wrap">
        ${choices.map((c, i) => `
          <button class="choice-btn" data-id="${c.id}" data-correct="${c.id === card.id}">
            <span class="choice-label">${['A','B','C','D'][i]}</span>
            <span>${c.back}</span>
          </button>
        `).join('')}
      </div>
      <div id="feedback-area"></div>
    `;
  } else {
    // Type-in: show Vietnamese, type Japanese reading
    return `
      <div class="learn-question anim-fadeIn">
        <div class="learn-qtype">Nhập Hiragana ✍️</div>
        <div class="learn-qtext">
          <div style="font-size:1.8rem;font-weight:700;">${card.back}</div>
          ${card.example ? `<div style="color:var(--text-muted);font-size:.85rem;margin-top:10px;font-family:'Noto Sans JP',sans-serif;">${card.example}</div>` : ''}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <input id="type-field" class="type-input" placeholder="Nhập Hiragana hoặc nghĩa tiếng Nhật..." autocomplete="off" spellcheck="false">
        <div style="display:flex;gap:10px;">
          <button id="type-submit" class="btn btn-primary flex-1">Kiểm tra ↵</button>
          <button class="btn btn-ghost" onclick="skipCard()">Bỏ qua</button>
        </div>
      </div>
      <div id="feedback-area"></div>
    `;
  }
}

/* -------------------------------------------------------
   ANSWER: MCQ
   ------------------------------------------------------- */
function answerMCQ(btn, card) {
  if (LRN.answered) return;
  LRN.answered = true;

  const isCorrect = btn.dataset.correct === 'true';
  const rating    = isCorrect ? 'know' : 'dontknow';

  // Highlight all choices
  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === 'true') b.classList.add('correct');
    else if (b === btn && !isCorrect) b.classList.add('wrong');
  });

  applyAnswer(card, rating, isCorrect);
}

/* -------------------------------------------------------
   ANSWER: TYPE-IN
   ------------------------------------------------------- */
function answerType(card) {
  if (LRN.answered) return;
  const input = document.getElementById('type-field');
  const val   = input.value.trim().toLowerCase();
  if (!val) return;

  LRN.answered = true;

  const correct = card.hiragana.toLowerCase();
  const romaji  = card.romaji.toLowerCase();
  const meaning = card.back.toLowerCase();

  const isCorrect = val === correct || val === romaji || val === meaning ||
                    val === card.front.toLowerCase();

  input.classList.add(isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) {
    input.style.animation = 'shake .4s var(--ease)';
  }
  document.getElementById('type-submit').disabled = true;

  applyAnswer(card, isCorrect ? 'know' : 'dontknow', isCorrect);
}

/* -------------------------------------------------------
   APPLY ANSWER (shared)
   ------------------------------------------------------- */
function applyAnswer(card, rating, isCorrect) {
  if (isCorrect) {
    LRN.correct++;
    speak(card.front);
  } else {
    LRN.incorrect++;
    // Re-queue card later in the session
    const ahead = Math.min(LRN.qIndex + 4, LRN.queue.length);
    LRN.queue.splice(ahead, 0, card);
  }

  SM2.applyReview(LRN.set.id, card.id, rating);
  DB.updateStats(isCorrect ? 1 : 0, isCorrect ? 0 : 1);

  // Show feedback
  showFeedback(card, isCorrect);

  // Auto-advance after delay
  setTimeout(() => {
    LRN.qIndex++;
    renderQuestion();
  }, 1600);
}

function skipCard() {
  LRN.qIndex++;
  renderQuestion();
}

/* -------------------------------------------------------
   FEEDBACK BAR
   ------------------------------------------------------- */
function showFeedback(card, isCorrect) {
  const area = document.getElementById('feedback-area');
  if (!area) return;
  area.innerHTML = `
    <div class="feedback-bar ${isCorrect ? 'correct' : 'wrong'}" style="margin-top:12px;">
      <span>${isCorrect ? '✅ Chính xác!' : '❌ Sai rồi!'}</span>
      <span style="margin-left:auto;">
        <strong class="japanese">${card.front}</strong>
        ${card.hiragana !== card.front ? `<span style="color:var(--text-muted);font-size:.85rem;margin-left:6px;">${card.hiragana}</span>` : ''}
        — ${card.back}
      </span>
    </div>
  `;
}

/* -------------------------------------------------------
   SESSION HEADER
   ------------------------------------------------------- */
function updateSessionHeader() {
  const total = LRN.queue.length;
  const done  = LRN.qIndex;
  const pctVal = pct(done, total);

  document.getElementById('s-correct').textContent   = LRN.correct;
  document.getElementById('s-incorrect').textContent = LRN.incorrect;
  document.getElementById('s-current').textContent   = done + 1;
  document.getElementById('s-total').textContent     = total;

  const bar = document.querySelector('.session-progress-wrap .progress-bar');
  if (bar) bar.style.width = `${pctVal}%`;
}

/* -------------------------------------------------------
   COMPLETE SCREEN
   ------------------------------------------------------- */
function showLearningComplete() {
  document.getElementById('question-area').innerHTML = '';
  document.getElementById('learn-complete').style.display = 'block';

  const accuracy = LRN.correct + LRN.incorrect > 0
    ? Math.round((LRN.correct / (LRN.correct + LRN.incorrect)) * 100) : 0;

  document.getElementById('comp-correct').textContent   = LRN.correct;
  document.getElementById('comp-incorrect').textContent = LRN.incorrect;
  document.getElementById('comp-accuracy').textContent  = `${accuracy}%`;

  if (accuracy >= 80) {
    launchConfetti();
    showToast('Xuất sắc! Kết quả tuyệt vời! 🌟', 'success', 4000);
  } else if (accuracy >= 60) {
    showToast('Tốt lắm! Tiếp tục luyện tập nhé! 💪', 'info', 3000);
  } else {
    showToast('Cố lên! Luyện tập thêm sẽ tốt hơn! 📖', 'info', 3000);
  }
}

function restartLearn() {
  document.getElementById('learn-complete').style.display = 'none';
  buildQueue();
  renderQuestion();
}
