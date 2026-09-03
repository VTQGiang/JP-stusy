/* ============================================================
 * match.js  —  Matching game: click pairs to match
 * ============================================================ */

let MATCH = {
  set:       null,
  tiles:     [],
  selected:  null,
  matched:   0,
  total:     0,
  timer:     null,
  elapsed:   0,
  mistakes:  0,
  started:   false,
};

/* -------------------------------------------------------
   INIT
   ------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const setId = getSetIdFromURL();
  if (!setId) { window.location.href = 'index.html'; return; }

  MATCH.set = DB.getSet(setId);
  if (!MATCH.set) { window.location.href = 'index.html'; return; }

  document.getElementById('navbar-placeholder').innerHTML = renderNavbar('match');
  document.getElementById('set-title').textContent = MATCH.set.name;

  startRound();
});

/* -------------------------------------------------------
   START ROUND
   ------------------------------------------------------- */
function startRound(count = 6) {
  if (MATCH.timer) clearInterval(MATCH.timer);

  MATCH.selected  = null;
  MATCH.matched   = 0;
  MATCH.mistakes  = 0;
  MATCH.elapsed   = 0;
  MATCH.started   = false;

  const pool = shuffle([...MATCH.set.cards]).slice(0, count);
  MATCH.total = pool.length;

  // Build tiles: JP side + VN side
  const jpTiles = pool.map(c => ({ 
    id: `jp_${c.id}`, 
    pairId: c.id, 
    text: c.front, 
    romaji: c.romaji || '',
    hiragana: c.hiragana && c.hiragana !== c.front ? c.hiragana : '',
    isJP: true, 
    matched: false 
  }));
  const vnTiles = pool.map(c => ({ 
    id: `vn_${c.id}`, 
    pairId: c.id, 
    text: c.back, 
    romaji: '',
    hiragana: '',
    isJP: false, 
    matched: false 
  }));

  MATCH.tiles = shuffle([...jpTiles, ...vnTiles]);

  document.getElementById('match-complete').style.display = 'none';
  document.getElementById('match-board').style.display    = 'block';

  renderBoard();
  document.getElementById('match-count').textContent = `${count} cặp`;
}

/* -------------------------------------------------------
   RENDER BOARD
   ------------------------------------------------------- */
function renderBoard() {
  const grid = document.getElementById('match-grid');
  grid.innerHTML = MATCH.tiles.map(tile => `
    <div class="match-tile ${tile.isJP ? 'japanese' : ''} ${tile.matched ? 'matched' : ''}"
         id="tile-${tile.id}"
         data-id="${tile.id}"
         data-pair="${tile.pairId}"
         onclick="selectTile(this)">
      ${tile.isJP ? `
        <div style="display:flex;flex-direction:column;align-items:center;">
          ${tile.romaji ? `<span style="font-size:.72rem;font-weight:600;color:var(--clr-primary-light);letter-spacing:.04em;line-height:1;">[ ${tile.romaji} ]</span>` : ''}
          ${tile.hiragana ? `<span style="font-size:.78rem;color:var(--text-secondary);line-height:1.2;">${tile.hiragana}</span>` : ''}
          <span style="font-size:1.15rem;font-weight:700;line-height:1.2;">${tile.text}</span>
        </div>
      ` : `<span>${tile.text}</span>`}
    </div>
  `).join('');
}

/* -------------------------------------------------------
   SELECT TILE
   ------------------------------------------------------- */
function selectTile(el) {
  if (el.classList.contains('matched') || el.classList.contains('selected')) return;

  // Start timer on first click
  if (!MATCH.started) {
    MATCH.started = true;
    MATCH.timer = setInterval(() => {
      MATCH.elapsed++;
      document.getElementById('match-timer').textContent = formatTime(MATCH.elapsed);
    }, 1000);
  }

  el.classList.add('selected');

  if (!MATCH.selected) {
    MATCH.selected = el;
    return;
  }

  // Second tile selected
  const first  = MATCH.selected;
  const second = el;
  MATCH.selected = null;

  if (first.dataset.pair === second.dataset.pair && first.dataset.id !== second.dataset.id) {
    // ✅ Match!
    setTimeout(() => {
      first.classList.remove('selected');
      second.classList.remove('selected');
      first.classList.add('matched');
      second.classList.add('matched');

      // Find pair word and speak it
      const card = MATCH.set.cards.find(c => String(c.id) === first.dataset.pair);
      if (card) speak(card.front);

      MATCH.matched++;
      document.getElementById('match-found').textContent = MATCH.matched;

      if (MATCH.matched >= MATCH.total) finishMatch();
    }, 200);
  } else {
    // ❌ Wrong pair
    MATCH.mistakes++;
    first.classList.add('wrong');
    second.classList.add('wrong');

    setTimeout(() => {
      first.classList.remove('selected', 'wrong');
      second.classList.remove('selected', 'wrong');
    }, 700);
  }
}

/* -------------------------------------------------------
   FINISH MATCH
   ------------------------------------------------------- */
function finishMatch() {
  if (MATCH.timer) clearInterval(MATCH.timer);

  document.getElementById('match-board').style.display    = 'none';
  document.getElementById('match-complete').style.display = 'block';

  document.getElementById('comp-time').textContent     = formatTime(MATCH.elapsed);
  document.getElementById('comp-mistakes').textContent = MATCH.mistakes;

  // Save best time
  const bestKey = `match_best_${MATCH.set.id}`;
  const best    = parseInt(localStorage.getItem(bestKey)) || Infinity;
  if (MATCH.elapsed < best) {
    localStorage.setItem(bestKey, MATCH.elapsed);
    document.getElementById('comp-best').textContent = '🏆 Kỷ lục mới!';
  } else {
    document.getElementById('comp-best').textContent = `Kỷ lục: ${formatTime(parseInt(localStorage.getItem(bestKey)))}`;
  }

  launchConfetti();
  showToast(`Hoàn thành! ${MATCH.mistakes === 0 ? 'Không có lỗi! 🎯' : `${MATCH.mistakes} lần sai.`}`, 'success', 4000);

  // Update progress
  MATCH.set.cards.slice(0, MATCH.total).forEach(c => {
    SM2.applyReview(MATCH.set.id, c.id, MATCH.mistakes === 0 ? 'know' : 'unsure');
  });
  DB.updateStats(MATCH.total, 0);
}

/* -------------------------------------------------------
   HELPERS
   ------------------------------------------------------- */
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function playAgain(count) {
  startRound(count || Math.min(MATCH.total, 6));
}

function changeCount(n) {
  const count = Math.min(parseInt(n), MATCH.set.cards.length);
  startRound(count);
}
