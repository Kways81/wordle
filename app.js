// ── State ──
let targetWord = '';
let currentRow = 0;
let currentCol = 0;
let currentGuess = [];
let gameOver = false;

const WORD_LISTS = { 4: WORDS4, 5: WORDS, 6: WORDS6 };

let settings = loadSettings();
let stats = loadStats();
let gameState = loadGameState();

const WIN_MESSAGES = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];

// ── Board init ──
function buildBoard() {
  const len = settings.wordLength;
  const board = document.getElementById('board');
  board.innerHTML = '';
  board.dataset.length = len;
  for (let r = 0; r < 6; r++) {
    const row = document.createElement('div');
    row.classList.add('row');
    row.id = `row-${r}`;
    for (let c = 0; c < len; c++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.id = `tile-${r}-${c}`;
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
  markActiveRow();
}

function markActiveRow() {
  document.querySelectorAll('.row').forEach(r => r.classList.remove('active'));
  const row = document.getElementById(`row-${currentRow}`);
  if (row) row.classList.add('active');
}

// ── Letter input ──
function addLetter(letter) {
  if (gameOver || currentCol >= settings.wordLength) return;
  const tile = document.getElementById(`tile-${currentRow}-${currentCol}`);
  tile.textContent = letter.toUpperCase();
  tile.dataset.letter = letter.toLowerCase();
  tile.classList.add('pop');
  tile.addEventListener('animationend', () => tile.classList.remove('pop'), { once: true });
  currentGuess.push(letter.toLowerCase());
  currentCol++;
}

function deleteLetter() {
  if (gameOver || currentCol === 0) return;
  currentCol--;
  const tile = document.getElementById(`tile-${currentRow}-${currentCol}`);
  tile.textContent = '';
  delete tile.dataset.letter;
  currentGuess.pop();
}

function submitGuess() {
  if (gameOver) return;
  const len = settings.wordLength;
  const wordList = WORD_LISTS[len];
  if (currentGuess.length < len) { shake(); showToast('Not enough letters'); return; }
  const word = currentGuess.join('');
  if (!wordList.includes(word)) { shake(); showToast('Not in word list'); return; }

  if (settings.hardMode) {
    const hardError = checkHardMode(word);
    if (hardError) { shake(); showToast(hardError); return; }
  }

  const result = evaluate(word, targetWord);
  revealRow(result, word);
}

function checkHardMode(word) {
  return null; // stub — full implementation in Task 6
}

// ── Evaluation ──
function evaluate(guess, target) {
  const result = Array(target.length).fill('absent');
  const targetArr = target.split('');
  const guessArr  = guess.split('');
  const used = Array(target.length).fill(false);

  // Pass 1: correct positions
  for (let i = 0; i < target.length; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = 'correct';
      used[i] = true;
      guessArr[i] = null;
    }
  }

  // Pass 2: present but wrong position
  for (let i = 0; i < target.length; i++) {
    if (result[i] === 'correct') continue;
    for (let j = 0; j < target.length; j++) {
      if (!used[j] && guessArr[i] === targetArr[j]) {
        result[i] = 'present';
        used[j] = true;
        break;
      }
    }
  }

  return result;
}

// ── Reveal tiles ──
function revealRow(result, word) {
  const row = currentRow;
  const tiles = Array.from(document.getElementById(`row-${row}`).children);
  let delay = 0;

  tiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add('revealed', result[i]);
    }, delay);
    delay += 300;
  });

  setTimeout(() => {
    updateKeyboard(word, result);
    const won = result.every(r => r === 'correct');
    const lost = !won && row === 5;

    if (won) {
      saveGameState(targetWord, [...(gameState.guesses || []), word], 'won');
      updateStats(true, row + 1);
      setTimeout(() => showToast(WIN_MESSAGES[row] || 'Great!'), 100);
      setTimeout(() => bounceTiles(row), 400);
      setTimeout(() => showStatsModal(row + 1), 1800);
      gameOver = true;
    } else if (lost) {
      saveGameState(targetWord, [...(gameState.guesses || []), word], 'lost');
      updateStats(false, 0);
      setTimeout(() => showToast(`The word was ${targetWord.toUpperCase()}`), 100);
      setTimeout(() => showStatsModal(null), 2200);
      gameOver = true;
    } else {
      saveGameState(targetWord, [...(gameState.guesses || []), word], 'playing');
      currentRow++;
      currentCol = 0;
      currentGuess = [];
      markActiveRow();
    }
  }, delay + 100);
}

function bounceTiles(row) {
  const tiles = Array.from(document.getElementById(`row-${row}`).children);
  tiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add('bounce');
      tile.addEventListener('animationend', () => tile.classList.remove('bounce'), { once: true });
    }, i * 100);
  });
}

// ── Keyboard colour updates ──
const keyState = {};

function updateKeyboard(word, result) {
  const priority = { correct: 3, present: 2, absent: 1 };
  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    const state  = result[i];
    if (!keyState[letter] || priority[state] > priority[keyState[letter]]) {
      keyState[letter] = state;
    }
  }

  document.querySelectorAll('.key[data-key]').forEach(key => {
    const letter = key.dataset.key;
    if (keyState[letter]) {
      key.classList.remove('correct', 'present', 'absent');
      key.classList.add(keyState[letter]);
    }
  });
}

// ── Shake ──
function shake() {
  const row = document.getElementById(`row-${currentRow}`);
  row.classList.add('shake');
  row.addEventListener('animationend', () => row.classList.remove('shake'), { once: true });
}

// ── Toast ──
function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}

// ── Stats ──
function loadStats() {
  const len = (settings && settings.wordLength) || 5;
  try {
    return JSON.parse(localStorage.getItem(`wordle_stats_${len}`)) || defaultStats();
  } catch { return defaultStats(); }
}

function defaultStats() {
  return { gamesPlayed: 0, gamesWon: 0, currentStreak: 0, bestStreak: 0, distribution: [0,0,0,0,0,0] };
}

// ── Settings ──
function loadSettings() {
  try {
    return { ...defaultSettings(), ...(JSON.parse(localStorage.getItem('wordle_settings')) || {}) };
  } catch { return defaultSettings(); }
}

function defaultSettings() {
  return { wordLength: 5, hardMode: false, colourBlind: false, dailyChallenge: false };
}

function saveSettings() {
  localStorage.setItem('wordle_settings', JSON.stringify(settings));
}

function applyColourBlind() {
  document.body.classList.toggle('cb', settings.colourBlind);
}

function saveStats() {
  localStorage.setItem(`wordle_stats_${settings.wordLength}`, JSON.stringify(stats));
}

function updateStats(won, guessCount) {
  stats.gamesPlayed++;
  if (won) {
    stats.gamesWon++;
    stats.currentStreak++;
    if (stats.currentStreak > stats.bestStreak) stats.bestStreak = stats.currentStreak;
    stats.distribution[guessCount - 1]++;
  } else {
    stats.currentStreak = 0;
  }
  saveStats();
}

// ── Game state persistence ──
function loadGameState() {
  try {
    return JSON.parse(localStorage.getItem('wordle_state')) || {};
  } catch { return {}; }
}

function saveGameState(word, guesses, status) {
  const state = { word, guesses, status };
  localStorage.setItem('wordle_state', JSON.stringify(state));
  gameState = state;
}

function restoreGame() {
  const state = loadGameState();
  if (!state.word || state.status === 'won' || state.status === 'lost') return false;
  if (state.word.length !== settings.wordLength) return false;

  targetWord = state.word;
  const guesses = state.guesses || [];

  guesses.forEach(guess => {
    const result = evaluate(guess, targetWord);
    const row = currentRow;
    const tiles = Array.from(document.getElementById(`row-${row}`).children);
    tiles.forEach((tile, i) => {
      tile.textContent = guess[i].toUpperCase();
      tile.dataset.letter = guess[i];
      tile.classList.add(result[i]);
    });
    updateKeyboard(guess, result);
    currentRow++;
    currentCol = 0;
  });

  currentGuess = [];
  markActiveRow();
  return true;
}

// ── Stats modal ──
function showStatsModal(winGuessNum) {
  document.getElementById('stat-played').textContent   = stats.gamesPlayed;
  const pct = stats.gamesPlayed ? Math.round(stats.gamesWon / stats.gamesPlayed * 100) : 0;
  document.getElementById('stat-win-pct').textContent  = pct;
  document.getElementById('stat-streak').textContent   = stats.currentStreak;
  document.getElementById('stat-best').textContent     = stats.bestStreak;

  const max = Math.max(...stats.distribution, 1);
  const dist = document.getElementById('distribution');
  dist.innerHTML = '';
  stats.distribution.forEach((count, i) => {
    const pct = Math.round((count / max) * 100);
    const isWin = winGuessNum === i + 1;
    dist.insertAdjacentHTML('beforeend', `
      <div class="dist-row">
        <span class="dist-label">${i + 1}</span>
        <div class="dist-bar-wrap">
          <div class="dist-bar ${isWin ? 'highlight' : ''}" style="width:${Math.max(pct,8)}%">${count}</div>
        </div>
      </div>
    `);
  });

  if (gameOver) document.getElementById('end-game-actions').style.display = 'flex';
  openModal('stats-modal');
}

// ── Share ──
function buildShareText() {
  const guesses = gameState.guesses || [];
  const target  = gameState.word;
  const lines = guesses.map(guess => {
    const result = evaluate(guess, target);
    return result.map(r => r === 'correct' ? '🟩' : r === 'present' ? '🟨' : '⬜').join('');
  });
  const count = gameState.status === 'won' ? guesses.length : 'X';
  return `Wordle ${count}/6\n\n${lines.join('\n')}`;
}

// ── Modals ──
function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// ── New game ──
function pickRandomWord() {
  const list = WORD_LISTS[settings.wordLength] || WORD_LISTS[5];
  return list[Math.floor(Math.random() * list.length)];
}

function startNewGame() {
  stats = loadStats();
  targetWord = pickRandomWord();
  currentRow = 0;
  currentCol = 0;
  currentGuess = [];
  gameOver = false;
  Object.keys(keyState).forEach(k => delete keyState[k]);
  gameState = {};
  saveGameState(targetWord, [], 'playing');
  buildBoard();
  document.querySelectorAll('.key').forEach(k => k.classList.remove('correct','present','absent'));
  document.getElementById('end-game-actions').style.display = 'none';
  closeModal('stats-modal');
}

// ── Input handling ──
document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === 'Enter') { submitGuess(); return; }
  if (e.key === 'Backspace') { deleteLetter(); return; }
  if (/^[a-zA-Z]$/.test(e.key)) { addLetter(e.key); }
});

document.getElementById('keyboard').addEventListener('click', e => {
  const key = e.target.closest('.key');
  if (!key) return;
  const k = key.dataset.key;
  if (k === 'Enter') submitGuess();
  else if (k === 'Backspace') deleteLetter();
  else addLetter(k);
});

// Header buttons
document.getElementById('help-btn').addEventListener('click', () => openModal('help-modal'));
document.getElementById('stats-btn').addEventListener('click', () => showStatsModal(null));

// Modal close buttons
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

// Backdrop click closes modal
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// Share button
document.getElementById('share-btn').addEventListener('click', () => {
  navigator.clipboard.writeText(buildShareText()).then(() => showToast('Copied!'));
});

// Play again
document.getElementById('play-again-btn').addEventListener('click', startNewGame);

// ── Boot ──
buildBoard();
applyColourBlind();
const restored = restoreGame();
if (!restored) {
  targetWord = pickRandomWord();
  saveGameState(targetWord, [], 'playing');
}
