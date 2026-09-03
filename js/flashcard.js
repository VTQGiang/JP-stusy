/* ============================================================
 * flashcard.js  —  Flashcard mode logic
 * ============================================================ */

let FC = {
  set:     null,
  cards:   [],
  index:   0,
  flipped: false,
  stats:   { know:0, unsure:0, dontknow:0 },
  shuffle: false,
  startDrag: null,
};

/* -------------------------------------------------------
   INIT
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const setId = getSetIdFromURL();
  if (!setId) { window.location.href = 'index.html'; return; }

  FC.set   = DB.getSet(setId);
  if (!FC.set) { window.location.href = 'index.html'; return; }

  FC.cards = [...FC.set.cards];

  document.getElementById('navbar-placeholder').innerHTML = renderNavbar('flashcard');
  document.getElementById('set-title').textContent = FC.set.name;

  bindEvents();
  renderCard();
  updateProgress();
});

/* -------------------------------------------------------
   RENDER CARD
   ------------------------------------------------------- */
function renderCard() {
  const card = FC.cards[FC.index];
  if (!card) { showComplete(); return; }

  FC.flipped = false;

  const fcCard = document.getElementById('fc-card');
  fcCard.classList.remove('flipped');

  // Front
  document.getElementById('fc-front-word').textContent   = card.front;
  document.getElementById('fc-front-reading').textContent = card.hiragana !== card.front ? card.hiragana : '';
  document.getElementById('fc-front-romaji').textContent  = card.romaji || '';
  document.getElementById('fc-front-cat').textContent     = card.category || '';

  // Back
  document.getElementById('fc-back-meaning').textContent  = card.back;
  const backRomajiEl = document.getElementById('fc-back-romaji');
  if (backRomajiEl) backRomajiEl.textContent = card.romaji ? `[ ${card.romaji} ]` : '';
  document.getElementById('fc-back-example').textContent  = card.example || '';
  document.getElementById('fc-back-example-vn').textContent = card.exampleMeaning || '';
  document.getElementById('fc-back-reading').textContent  = card.hiragana || '';

  document.getElementById('fc-counter').textContent = `${FC.index + 1} / ${FC.cards.length}`;

  // Animate in
  const scene = document.getElementById('fc-scene');
  scene.style.animation = 'none';
  scene.offsetHeight; // reflow
  scene.style.animation = 'cardEnter .4s var(--ease) both';

  // Update progress
  updateProgress();

  // Hide rate buttons, show flip hint
  document.getElementById('fc-rate-btns').style.display = 'none';
  document.getElementById('fc-flip-hint').style.display = 'flex';
}

/* -------------------------------------------------------
   FLIP
   ------------------------------------------------------- */
function flipCard() {
  FC.flipped = !FC.flipped;
  document.getElementById('fc-card').classList.toggle('flipped', FC.flipped);
  if (FC.flipped) {
    document.getElementById('fc-rate-btns').style.display = 'flex';
    document.getElementById('fc-flip-hint').style.display = 'none';
    // Auto speak
    speak(FC.cards[FC.index].front);
  }
}

/* -------------------------------------------------------
   RATE CARD
   ------------------------------------------------------- */
function rateCard(rating) {
  const card = FC.cards[FC.index];
  SM2.applyReview(FC.set.id, card.id, rating);
  FC.stats[rating]++;

  if (rating === 'dontknow') {
    // Re-insert card 3 positions ahead so they see it again soon
    const ahead = Math.min(FC.index + 4, FC.cards.length);
    FC.cards.splice(ahead, 0, card);
  }

  FC.index++;
  DB.updateStats(rating === 'know' ? 1 : 0, rating === 'dontknow' ? 1 : 0);
  renderCard();
}

/* -------------------------------------------------------
   NAVIGATION
   ------------------------------------------------------- */
function prevCard() {
  if (FC.index > 0) { FC.index--; renderCard(); }
}

function nextCard() {
  FC.index++;
  renderCard();
}

/* -------------------------------------------------------
   SHUFFLE
   ------------------------------------------------------- */
function toggleShuffle() {
  FC.shuffle = !FC.shuffle;
  const btn = document.getElementById('btn-shuffle');
  if (FC.shuffle) {
    FC.cards = shuffle(FC.cards);
    FC.index = 0;
    btn.style.background = 'var(--clr-primary-glow)';
    btn.style.color       = 'var(--clr-primary-light)';
    btn.style.borderColor = 'var(--clr-primary)';
    showToast('Đã bật chế độ ngẫu nhiên 🔀', 'info');
  } else {
    FC.cards = [...FC.set.cards];
    FC.index = 0;
    btn.style.background = '';
    btn.style.color       = '';
    btn.style.borderColor = '';
    showToast('Đã tắt chế độ ngẫu nhiên', 'info');
  }
  renderCard();
}

/* -------------------------------------------------------
   RESTART
   ------------------------------------------------------- */
function restart() {
  FC.index   = 0;
  FC.stats   = { know:0, unsure:0, dontknow:0 };
  FC.cards   = FC.shuffle ? shuffle([...FC.set.cards]) : [...FC.set.cards];
  document.getElementById('complete-screen').style.display = 'none';
  document.getElementById('main-content').style.display   = 'block';
  renderCard();
}

/* -------------------------------------------------------
   COMPLETE SCREEN
   ------------------------------------------------------- */
function showComplete() {
  document.getElementById('main-content').style.display   = 'none';
  document.getElementById('complete-screen').style.display = 'block';

  const total = FC.cards.length > FC.set.cards.length ? FC.set.cards.length : FC.index;
  document.getElementById('stat-know').textContent     = FC.stats.know;
  document.getElementById('stat-unsure').textContent   = FC.stats.unsure;
  document.getElementById('stat-dontknow').textContent = FC.stats.dontknow;

  if (FC.stats.dontknow === 0 && FC.stats.know > 0) {
    launchConfetti();
    showToast('Tuyệt vời! Bạn đã thuộc tất cả! 🎉', 'success', 4000);
  }
}

/* -------------------------------------------------------
   PROGRESS BAR
   ------------------------------------------------------- */
function updateProgress() {
  const pctVal = Math.round((FC.index / FC.cards.length) * 100);
  const bar    = document.querySelector('.progress-bar');
  if (bar) bar.style.width = `${pctVal}%`;
}

/* -------------------------------------------------------
   SWIPE / DRAG SUPPORT
   ------------------------------------------------------- */
function bindEvents() {
  const scene = document.getElementById('fc-scene');

  // Click to flip
  scene.addEventListener('click', (e) => {
    if (e.target.closest('.fc-speaker, .btn')) return;
    flipCard();
  });

  // Mouse swipe
  scene.addEventListener('mousedown', e => { FC.startDrag = e.clientX; });
  scene.addEventListener('mouseup', e => {
    if (FC.startDrag === null) return;
    const diff = e.clientX - FC.startDrag;
    FC.startDrag = null;
    if (Math.abs(diff) < 50) return; // too short
    if (!FC.flipped) { flipCard(); return; }
    if (diff < 0) rateCard('dontknow');
    else          rateCard('know');
  });

  // Touch swipe
  let touchX = null;
  scene.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive:true });
  scene.addEventListener('touchend', e => {
    if (touchX === null) return;
    const diff = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(diff) < 60) return;
    if (!FC.flipped) { flipCard(); return; }
    if (diff < 0) rateCard('dontknow');
    else          rateCard('know');
  });

  // Keyboard shortcuts
  onKey('ArrowLeft',  () => prevCard());
  onKey('ArrowRight', () => nextCard());
  onKey(' ',          (e) => { e.preventDefault(); flipCard(); });
  onKey('1',          () => { if (FC.flipped) rateCard('know'); });
  onKey('2',          () => { if (FC.flipped) rateCard('unsure'); });
  onKey('3',          () => { if (FC.flipped) rateCard('dontknow'); });
}
