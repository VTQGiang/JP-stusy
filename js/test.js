/* ============================================================
 * test.js  —  Test mode: mixed question types, timer, results
 * ============================================================ */

let TEST = {
  set:       null,
  questions: [],
  qIndex:    0,
  answers:   [],
  timer:     null,
  timeLeft:  0,
  timeLimit: 0,
  started:   false,
};

/* -------------------------------------------------------
   INIT
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const setId = getSetIdFromURL();
  if (!setId) { window.location.href = 'index.html'; return; }

  TEST.set = DB.getSet(setId);
  if (!TEST.set) { window.location.href = 'index.html'; return; }

  document.getElementById('navbar-placeholder').innerHTML = renderNavbar('test');
  document.getElementById('set-title').textContent = TEST.set.name;

  showTestConfig();
});

/* -------------------------------------------------------
   CONFIG SCREEN
   ------------------------------------------------------- */
function showTestConfig() {
  const n = Math.min(TEST.set.cards.length, 20);
  document.getElementById('config-count').value = n;
  document.getElementById('config-count').max   = TEST.set.cards.length;
  document.getElementById('config-max').textContent = TEST.set.cards.length;
  document.getElementById('test-config').style.display   = 'block';
  document.getElementById('test-session').style.display  = 'none';
  document.getElementById('test-results').style.display  = 'none';
}

function startTest() {
  const count     = parseInt(document.getElementById('config-count').value) || 10;
  const timerOn   = document.getElementById('config-timer').checked;
  const timeSec   = parseInt(document.getElementById('config-time').value) || 60;
  const direction = document.getElementById('config-dir').value; // 'jp2vn' | 'vn2jp' | 'mixed'

  TEST.questions = buildQuestions(count, direction);
  TEST.answers   = [];
  TEST.qIndex    = 0;

  document.getElementById('test-config').style.display   = 'none';
  document.getElementById('test-session').style.display  = 'block';
  document.getElementById('total-q').textContent = TEST.questions.length;

  if (timerOn) {
    TEST.timeLimit = timeSec;
    TEST.timeLeft  = timeSec;
    startTimer();
  } else {
    document.getElementById('timer-wrap').style.display = 'none';
  }

  renderTestQuestion();
}

/* -------------------------------------------------------
   BUILD QUESTIONS
   ------------------------------------------------------- */
function buildQuestions(count, direction) {
  const pool  = shuffle([...TEST.set.cards]).slice(0, count);
  const all   = TEST.set.cards;
  const qs    = [];

  pool.forEach((card, i) => {
    const types  = ['mcq-jp2vn', 'mcq-vn2jp', 'true-false'];
    let   type;

    if (direction === 'jp2vn')  type = 'mcq-jp2vn';
    else if (direction === 'vn2jp') type = 'mcq-vn2jp';
    else {
      // Mixed: rotate through types
      type = types[i % types.length];
    }

    const wrong4 = shuffle(all.filter(c => c.id !== card.id)).slice(0, 3);

    if (type === 'mcq-jp2vn') {
      qs.push({
        type,
        prompt:  card.front,
        reading: card.hiragana !== card.front ? card.hiragana : '',
        label:   'Chọn nghĩa tiếng Việt đúng:',
        correct: card.back,
        choices: shuffle([card.back, ...wrong4.map(c => c.back)]),
        card,
      });
    } else if (type === 'mcq-vn2jp') {
      qs.push({
        type,
        prompt:  card.back,
        reading: '',
        label:   'Chọn từ tiếng Nhật đúng:',
        correct: card.front,
        choices: shuffle([card.front, ...wrong4.map(c => c.front)]),
        card,
      });
    } else {
      // True / False: 50% chance wrong pair
      const isTrueQ = Math.random() > 0.5;
      const paired  = isTrueQ ? card : shuffle(all.filter(c => c.id !== card.id))[0];
      qs.push({
        type,
        prompt:  card.front,
        reading: card.hiragana !== card.front ? card.hiragana : '',
        label:   `Nghĩa của từ này có phải là: <strong>"${paired.back}"</strong>?`,
        correct: isTrueQ ? 'Đúng' : 'Sai',
        choices: ['Đúng', 'Sai'],
        card,
      });
    }
  });

  return qs;
}

/* -------------------------------------------------------
   RENDER QUESTION
   ------------------------------------------------------- */
function renderTestQuestion() {
  const q = TEST.questions[TEST.qIndex];
  if (!q) return;

  document.getElementById('cur-q').textContent = TEST.qIndex + 1;

  // Update session progress bar
  const bar = document.querySelector('#test-session .progress-bar');
  if (bar) bar.style.width = `${pct(TEST.qIndex, TEST.questions.length)}%`;

  const isJP = q.type === 'mcq-jp2vn' || q.type === 'true-false';

  document.getElementById('q-area').innerHTML = `
    <div class="test-question anim-cardEnter">
      <div class="test-qnum">Câu ${TEST.qIndex + 1} / ${TEST.questions.length}</div>
      <div class="test-qtext">
        ${isJP
          ? `<div>
               ${q.card && q.card.romaji ? `<div style="font-size:1.15rem;font-weight:600;color:var(--clr-primary-light);letter-spacing:.08em;margin-bottom:2px;">[ ${q.card.romaji} ]</div>` : ''}
               ${q.reading ? `<div style="color:var(--text-secondary);font-family:'Noto Sans JP',sans-serif;font-size:1.05rem;margin-bottom:6px;">${q.reading}</div>` : ''}
               <div class="japanese-lg">${q.prompt}</div>
             </div>`
          : `<div style="font-size:1.5rem;font-weight:700;">${q.prompt}</div>`
        }
      </div>
      <p style="color:var(--text-secondary);font-size:.9rem;margin-bottom:0;">${q.label}</p>
    </div>
    <div class="learn-choices" id="test-choices">
      ${q.choices.map((c, i) => `
        <button class="choice-btn" data-choice="${c}" data-correct="${c === q.correct}" onclick="answerTest(this)">
          <span class="choice-label">${['A','B','C','D'][i]}</span>
          <span ${q.type === 'mcq-vn2jp' ? 'class="japanese"' : ''}>${c}</span>
        </button>
      `).join('')}
    </div>
    <div id="test-feedback"></div>
  `;

  // Speak Japanese prompt
  if (isJP) speak(q.prompt);
}

/* -------------------------------------------------------
   ANSWER
   ------------------------------------------------------- */
function answerTest(btn) {
  if (btn.disabled) return;

  const isCorrect = btn.dataset.correct === 'true';
  const q         = TEST.questions[TEST.qIndex];

  document.querySelectorAll('#test-choices .choice-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === 'true') b.classList.add('correct');
    else if (b === btn && !isCorrect) b.classList.add('wrong');
  });

  TEST.answers.push({ q, chosen: btn.dataset.choice, isCorrect });

  const fb = document.getElementById('test-feedback');
  fb.innerHTML = `
    <div class="feedback-bar ${isCorrect ? 'correct' : 'wrong'}" style="margin-top:12px;">
      ${isCorrect
        ? `✅ Chính xác! <span style="margin-left:auto;color:var(--text-secondary);font-size:.85rem;">+1 điểm</span>`
        : `❌ Sai! Đáp án đúng: <strong>${q.correct}</strong>`
      }
    </div>
  `;

  setTimeout(() => {
    TEST.qIndex++;
    if (TEST.qIndex >= TEST.questions.length) finishTest();
    else renderTestQuestion();
  }, 1400);
}

/* -------------------------------------------------------
   TIMER
   ------------------------------------------------------- */
function startTimer() {
  document.getElementById('timer-wrap').style.display = 'flex';
  updateTimerDisplay();
  TEST.timer = setInterval(() => {
    TEST.timeLeft--;
    updateTimerDisplay();
    if (TEST.timeLeft <= 0) {
      clearInterval(TEST.timer);
      finishTest();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('timer-display');
  const m  = Math.floor(TEST.timeLeft / 60);
  const s  = TEST.timeLeft % 60;
  el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  el.parentElement.className = `test-timer ${TEST.timeLeft <= 10 ? 'danger' : ''}`;
}

/* -------------------------------------------------------
   FINISH TEST
   ------------------------------------------------------- */
function finishTest() {
  if (TEST.timer) clearInterval(TEST.timer);

  document.getElementById('test-session').style.display  = 'none';
  document.getElementById('test-results').style.display  = 'block';

  const correct  = TEST.answers.filter(a => a.isCorrect).length;
  const total    = TEST.questions.length;
  const accuracy = pct(correct, total);

  document.getElementById('res-score').textContent    = `${correct}/${total}`;
  document.getElementById('res-accuracy').textContent = `${accuracy}%`;
  document.getElementById('res-grade').textContent    = gradeLabel(accuracy);

  // Update SM-2 for all answered questions
  TEST.answers.forEach(({ q, isCorrect }) => {
    SM2.applyReview(TEST.set.id, q.card.id, isCorrect ? 'know' : 'dontknow');
  });
  DB.updateStats(correct, total - correct);

  if (accuracy >= 90) launchConfetti();

  // Render detail list
  renderResultDetail();
}

function gradeLabel(pctVal) {
  if (pctVal >= 90) return '🌟 Xuất sắc!';
  if (pctVal >= 75) return '🎉 Tốt lắm!';
  if (pctVal >= 60) return '👍 Khá!';
  if (pctVal >= 40) return '📚 Cần ôn thêm';
  return '💪 Cố gắng thêm nhé!';
}

function renderResultDetail() {
  const wrap = document.getElementById('result-detail');
  wrap.innerHTML = TEST.answers.map((a, i) => `
    <div class="word-item" style="${a.isCorrect ? '' : 'border-color:rgba(255,71,87,.3);'}">
      <div>
        <div class="japanese">${a.q.card.front}</div>
        <div style="font-size:.8rem;color:var(--text-muted);">${a.q.card.hiragana}</div>
      </div>
      <div>
        <div style="font-size:.9rem;">${a.q.card.back}</div>
        ${!a.isCorrect ? `<div style="font-size:.8rem;color:var(--clr-danger);">Bạn chọn: ${a.chosen}</div>` : ''}
      </div>
      <div>${a.isCorrect ? '✅' : '❌'}</div>
    </div>
  `).join('');
}

function retakeTest() { startTest(); }
function configTest()  { showTestConfig(); }
