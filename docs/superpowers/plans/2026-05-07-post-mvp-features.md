# Post-MVP Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add hard mode, colour blind mode, custom word length (4/5/6), and daily challenge to the existing Wordle clone.

**Architecture:** All four features are controlled through a new settings modal (gear icon in header). Settings persist to `localStorage` as `wordle_settings`. Word length uses separate word list files and per-length stats keys. Colour blind mode applies a `cb` class to `<body>` which overrides CSS colour variables. Daily challenge uses a date-seeded deterministic index into the 5-letter word list.

**Tech Stack:** Vanilla HTML/CSS/JS, localStorage, no build step.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `words4.js` | Create | ~200 common 4-letter words, exported as `WORDS4` |
| `words6.js` | Create | ~200 common 6-letter words, exported as `WORDS6` |
| `index.html` | Modify | Gear icon in header; settings modal markup |
| `style.css` | Modify | Colour blind vars; settings modal styles; dynamic tile sizing |
| `app.js` | Modify | Settings state; word length support; hard mode; daily challenge; per-length stats |

---

### Task 1: Add word list files

**Files:**
- Create: `words4.js`
- Create: `words6.js`

- [ ] **Step 1: Create `words4.js`**

```js
const WORDS4 = [
  "able","acid","aged","also","area","army","away","baby","back","ball",
  "band","bank","base","bath","bear","beat","been","bell","best","bird",
  "blow","blue","boat","body","bomb","bond","bone","book","boom","born",
  "boss","both","bowl","bulk","burn","bush","busy","call","calm","came",
  "card","care","case","cash","cast","cave","cell","chat","chip","city",
  "clap","clay","clip","club","clue","coal","coat","code","coil","cold",
  "come","cook","cool","cope","copy","core","corn","cost","coup","crew",
  "crop","cube","cure","cute","dark","data","date","dawn","days","dead",
  "deal","dear","debt","deed","deep","deny","desk","dial","diet","dirt",
  "disc","dish","disk","dock","does","dome","done","door","dose","down",
  "draw","drew","drop","drug","drum","dual","dull","dump","dusk","dust",
  "duty","each","earn","ease","east","edge","else","even","ever","evil",
  "exam","face","fact","fail","fair","fall","fame","farm","fast","fate",
  "fear","feel","fell","felt","fill","film","find","fine","fire","firm",
  "fish","fist","flag","flat","flaw","flew","flip","flow","foam","fold",
  "folk","fond","font","food","fool","foot","ford","fore","fork","form",
  "fort","foul","four","free","from","fuel","full","fund","fuse","gain",
  "gale","game","gang","gave","gear","gene","gift","girl","give","glad",
  "glow","glue","goal","goes","gold","golf","gone","good","grab","gray",
  "grew","grid","grim","grip","grow","gulf","guru","gust","hack","hair",
  "half","hall","hand","hang","hard","harm","hate","have","head","heal",
  "heap","heat","heel","held","help","herb","here","hero","hide","high",
  "hill","hint","hold","hole","holy","home","hook","hope","horn","host",
  "hour","huge","hung","hunt","hurt","idea","idle","inch","into","iron",
  "item","jail","jerk","join","joke","jump","just","keen","keep","kick",
  "kill","kind","king","kiss","knee","knew","knit","lack","lady","lake",
  "land","lane","last","late","lead","leaf","lean","left","lend","less",
  "lick","life","lift","like","link","list","live","load","loan","lock",
  "loft","long","look","lord","lore","lose","loss","lost","loud","love",
  "luck","lung","made","mail","main","make","male","mall","malt","many",
  "mark","mass","mast","math","maze","meal","mean","meet","melt","memo",
  "menu","mere","mesh","mile","milk","mill","mind","mine","miss","mode",
  "more","most","move","much","myth","name","navy","near","neck","need",
  "next","nice","nine","node","none","norm","nose","note","noun","obey",
  "odds","once","only","open","oral","over","oven","owns","pace","pack",
  "page","paid","pain","palm","park","part","pass","path","pave","peak",
  "peel","peer","pick","pier","pile","pill","pine","pink","pipe","plan",
  "play","plot","plow","plug","plus","poem","poet","poll","pond","pool",
  "poor","port","pose","post","pour","pray","prep","prey","prod","prop",
  "pull","pump","pure","push","quit","race","rack","rage","raid","rail",
  "rain","ramp","rank","rare","rate","read","real","reap","reel","rely",
  "rent","rest","rice","rich","ride","ring","rise","risk","road","roam",
  "roar","rock","rode","role","roll","roof","room","root","rope","rose",
  "ruin","rule","rush","rust","safe","sail","sale","salt","same","sand",
  "save","scan","seal","seat","seed","seek","seem","seep","self","sell",
  "send","shed","ship","shop","shot","show","shut","sick","side","sign",
  "silk","sink","size","skip","slag","slim","slip","slow","snap","snow",
  "soak","soar","sock","soft","soil","sold","sole","some","song","soon",
  "sort","soul","span","spin","spit","spot","spur","star","stay","stem",
  "step","stir","stop","stub","such","suit","sung","sunk","swap","swim",
  "tail","take","tale","talk","tall","tape","task","team","tear","tell",
  "tend","tent","term","test","text","than","that","them","then","they",
  "thin","this","thus","tide","tilt","time","tire","toll","tomb","tone",
  "took","tool","tore","torn","toss","town","trap","tree","trim","trio",
  "trip","true","tube","tune","turn","type","unit","upon","used","user",
  "vain","vary","vast","very","view","vine","void","volt","vote","wade",
  "wage","wait","wake","walk","wall","wand","ward","warm","warn","warp",
  "wars","wave","weak","wear","weed","well","went","were","west","what",
  "when","whom","wide","wild","will","wind","wine","wing","wish","with",
  "woke","word","wore","work","worn","wrap","yard","year","your","zero","zone"
];
```

- [ ] **Step 2: Create `words6.js`**

```js
const WORDS6 = [
  "abroad","absent","absorb","accent","accept","access","accord","accuse","action","active",
  "actual","admire","afford","afraid","agency","agenda","almost","always","amends","amount",
  "animal","annual","answer","anyone","anyway","appeal","around","arrest","arrive","asleep",
  "aspect","assure","attach","attack","attain","attend","autumn","avenue","basket","battle",
  "beauty","became","become","before","behalf","behind","belief","belong","beside","better",
  "beyond","bother","bottle","bottom","bounce","breach","breath","bridge","bright","broken",
  "budget","burden","button","camera","cancel","cannot","castle","casual","cattle","caught",
  "center","centre","chance","change","charge","choice","choose","chosen","church","circle",
  "client","closed","closer","clouds","coffee","colony","colour","combat","coming","commit",
  "common","comply","corner","county","couple","create","credit","crisis","custom","danger",
  "debate","decade","defeat","defend","degree","delays","demand","depend","desert","design",
  "detail","detect","device","differ","direct","divide","doctor","dollar","domain","double",
  "driven","easily","effort","either","emerge","empire","employ","enable","engine","enough",
  "ensure","entire","equals","escape","estate","evolve","except","expect","expert","expose",
  "extend","fabric","factor","family","famous","father","favour","figure","finger","finish",
  "follow","forest","formal","former","foster","France","freely","future","garden","gather",
  "gentle","giving","global","golden","ground","growth","guitar","happen","hardly","health",
  "hearts","height","hidden","highly","honest","hoping","ignore","immune","impact","impose",
  "income","indeed","inform","inside","intend","invest","island","itself","joined","jungle",
  "junior","kernel","kidney","launch","lawyer","leader","league","lesson","letter","little",
  "living","lonely","longer","losing","lowest","manage","manner","marked","market","master",
  "matter","merely","method","middle","mirror","moment","mostly","mother","moving","muscle",
  "mutual","nation","nature","nearby","nearly","needed","nested","notice","number","object",
  "obtain","office","online","option","orange","origin","output","parent","partly","people",
  "period","permit","picked","pillar","planet","plenty","pocket","police","policy","posing",
  "powers","prefer","pretty","prison","profit","proper","proven","public","purple","pursue",
  "random","reason","recent","reduce","reform","region","remain","remove","repair","repeat",
  "report","rescue","result","return","reveal","reward","rocket","secure","select","senate",
  "senior","series","settle","should","signal","silver","simple","sister","slowly","smooth",
  "social","source","speech","spirit","spoken","spread","stable","status","steady","stored",
  "stream","street","stress","strict","strike","strong","submit","suffer","supply","switch",
  "system","target","tender","thirty","though","threat","throne","timing","toward","travel",
  "tribal","triple","tunnel","unable","unique","unless","unlike","update","upward","useful",
  "valley","values","varied","victim","vision","volume","within","wonder","wooden","worker",
  "worlds","worthy","yellow","yields"
];
```

- [ ] **Step 3: Verify both arrays contain only the correct letter count**

Open browser console and run:
```js
// After adding script tags to index.html in Task 2
WORDS4.filter(w => w.length !== 4)  // expect []
WORDS6.filter(w => w.length !== 6)  // expect []
```

---

### Task 2: Add script tags and settings state to app.js

**Files:**
- Modify: `index.html` — add `words4.js`, `words6.js` script tags
- Modify: `app.js` — settings state, load/save helpers, `WORD_LISTS` map

- [ ] **Step 1: Add script tags in `index.html` before `words.js`**

```html
  <script src="words4.js"></script>
  <script src="words.js"></script>
  <script src="words6.js"></script>
  <script src="app.js"></script>
```

- [ ] **Step 2: Add settings state at top of `app.js`, after existing state variables**

Replace the existing state block (top of file) with:

```js
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
```

- [ ] **Step 3: Add `loadSettings` / `saveSettings` helpers in `app.js` (after `defaultStats`)**

```js
// ── Settings ──
function loadSettings() {
  try {
    return { ...defaultSettings(), ...JSON.parse(localStorage.getItem('wordle_settings')) };
  } catch { return defaultSettings(); }
}

function defaultSettings() {
  return { wordLength: 5, hardMode: false, colourBlind: false, dailyChallenge: false };
}

function saveSettings() {
  localStorage.setItem('wordle_settings', JSON.stringify(settings));
}
```

- [ ] **Step 4: Update `loadStats` to be length-aware**

Replace the existing `loadStats` and `defaultStats` functions:

```js
function loadStats() {
  const key = `wordle_stats_${settings.wordLength}`;
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultStats();
  } catch { return defaultStats(); }
}

function defaultStats() {
  return { gamesPlayed: 0, gamesWon: 0, currentStreak: 0, bestStreak: 0, distribution: [0,0,0,0,0,0] };
}

function saveStats() {
  localStorage.setItem(`wordle_stats_${settings.wordLength}`, JSON.stringify(stats));
}
```

- [ ] **Step 5: Verify in browser console**

```js
loadSettings()   // → { wordLength: 5, hardMode: false, colourBlind: false, dailyChallenge: false }
loadStats()      // → { gamesPlayed: 0, ... }
```

---

### Task 3: Dynamic board and word length support

**Files:**
- Modify: `app.js` — `buildBoard` uses `settings.wordLength`, word selection uses `WORD_LISTS`
- Modify: `style.css` — tile sizing per word length

- [ ] **Step 1: Update `buildBoard` in `app.js` to use `settings.wordLength`**

```js
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
```

- [ ] **Step 2: Add tile sizing CSS for each word length in `style.css`**

Add after the existing `.tile` rule:

```css
#board[data-length="4"] .tile { width: 74px; height: 74px; font-size: 2.2rem; }
#board[data-length="5"] .tile { width: 62px; height: 62px; font-size: 2rem; }
#board[data-length="6"] .tile { width: 52px; height: 52px; font-size: 1.6rem; }

@media (max-width: 380px) {
  #board[data-length="4"] .tile { width: 62px; height: 62px; }
  #board[data-length="5"] .tile { width: 52px; height: 52px; }
  #board[data-length="6"] .tile { width: 42px; height: 42px; font-size: 1.3rem; }
}
```

- [ ] **Step 3: Remove the old static tile size from the base `.tile` rule in `style.css`**

Change:
```css
.tile {
  width: 62px;
  height: 62px;
  ...
  font-size: 2rem;
```
To:
```css
.tile {
  width: 62px;
  height: 62px;
  ...
  font-size: 2rem;
```
(Keep as default fallback — the `data-length` rules override it.)

- [ ] **Step 4: Update `addLetter` to use `settings.wordLength` instead of hardcoded `5`**

```js
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
```

- [ ] **Step 5: Update `submitGuess` to validate against correct word list and length**

```js
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
```

- [ ] **Step 6: Update `evaluate` to use word length dynamically**

Replace hardcoded `5` with `target.length` (already done implicitly — the function loops over indices, not a literal 5, so verify it works). Confirm:

```js
function evaluate(guess, target) {
  const result = Array(target.length).fill('absent');
  const targetArr = target.split('');
  const guessArr  = guess.split('');
  const used = Array(target.length).fill(false);
  // ... rest unchanged
```

- [ ] **Step 7: Update word selection in boot and `startNewGame`**

```js
function pickRandomWord() {
  const list = WORD_LISTS[settings.wordLength];
  return list[Math.floor(Math.random() * list.length)];
}
```

Replace the boot section at the bottom of `app.js`:

```js
buildBoard();
applyColourBlind();
const restored = restoreGame();
if (!restored) {
  targetWord = settings.dailyChallenge ? getDailyWord() : pickRandomWord();
  saveGameState(targetWord, [], 'playing');
}
```

And update `startNewGame`:

```js
function startNewGame() {
  stats = loadStats();
  targetWord = settings.dailyChallenge ? getDailyWord() : pickRandomWord();
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
```

- [ ] **Step 8: Verify in browser**

Open the game. Board should show 5×6 grid exactly as before. Open console:
```js
settings.wordLength  // → 5
WORD_LISTS[4].length // → some number
WORD_LISTS[6].length // → some number
```

---

### Task 4: Colour blind mode

**Files:**
- Modify: `style.css` — `body.cb` overrides colour vars
- Modify: `app.js` — `applyColourBlind()` helper

- [ ] **Step 1: Add colour blind CSS overrides in `style.css`**

Add after `:root { ... }`:

```css
body.cb {
  --green:  #f5793a;
  --yellow: #85c0f9;
}
```

- [ ] **Step 2: Add `applyColourBlind` in `app.js` (after `saveSettings`)**

```js
function applyColourBlind() {
  document.body.classList.toggle('cb', settings.colourBlind);
}
```

- [ ] **Step 3: Verify in browser console**

```js
settings.colourBlind = true; saveSettings(); applyColourBlind();
// Board tile colours should change to orange/blue — submit a guess to confirm
settings.colourBlind = false; saveSettings(); applyColourBlind();
// Colours revert to green/yellow
```

---

### Task 5: Daily challenge mode

**Files:**
- Modify: `app.js` — `getDailyWord()` helper

- [ ] **Step 1: Add `getDailyWord` in `app.js` (after `pickRandomWord`)**

```js
function getDailyWord() {
  const epoch = new Date('2026-01-01T00:00:00Z');
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const dayIndex = Math.floor((today - epoch) / 86400000);
  return WORDS[((dayIndex % WORDS.length) + WORDS.length) % WORDS.length];
}
```

- [ ] **Step 2: Verify consistent output in browser console**

```js
getDailyWord()          // same result every call today
getDailyWord() === getDailyWord()  // → true
```

- [ ] **Step 3: Verify `restoreGame` skips restore when word length mismatches saved state**

In `restoreGame`, add a guard at the top:

```js
function restoreGame() {
  const state = loadGameState();
  if (!state.word || state.status === 'won' || state.status === 'lost') return false;
  if (state.word.length !== settings.wordLength) return false;
  // ... rest unchanged
```

---

### Task 6: Hard mode validation

**Files:**
- Modify: `app.js` — `checkHardMode()`, constraint tracking

- [ ] **Step 1: Add constraint state at top of `app.js` (with other state vars)**

```js
let hardConstraints = { greens: {}, yellows: [] };
// greens: { position: letter } — must match
// yellows: [letter, ...] — must appear somewhere
```

- [ ] **Step 2: Add `checkHardMode` function in `app.js` (after `evaluate`)**

```js
function checkHardMode(word) {
  for (const [pos, letter] of Object.entries(hardConstraints.greens)) {
    if (word[pos] !== letter) {
      return `Position ${Number(pos) + 1} must be ${letter.toUpperCase()}`;
    }
  }
  for (const letter of hardConstraints.yellows) {
    if (!word.includes(letter)) {
      return `Guess must contain ${letter.toUpperCase()}`;
    }
  }
  return null;
}
```

- [ ] **Step 3: Update `revealRow` to track constraints after each guess**

Add constraint update inside the `setTimeout` in `revealRow`, after `updateKeyboard`:

```js
if (settings.hardMode) {
  result.forEach((r, i) => {
    if (r === 'correct') hardConstraints.greens[i] = word[i];
    if (r === 'present' && !hardConstraints.yellows.includes(word[i])) {
      hardConstraints.yellows.push(word[i]);
    }
  });
}
```

- [ ] **Step 4: Reset constraints in `startNewGame`**

Add to `startNewGame`:

```js
hardConstraints = { greens: {}, yellows: [] };
```

- [ ] **Step 5: Verify in browser console**

```js
// Play "stare" against a word containing 'a' at position 2
// Then try submitting "blind" — should get "Position 3 must be A"
```

---

### Task 7: Settings modal UI

**Files:**
- Modify: `index.html` — gear icon in header, settings modal markup
- Modify: `style.css` — settings modal, toggle switch, segmented control styles
- Modify: `app.js` — settings modal open/close, control event listeners, `applySettings()`

- [ ] **Step 1: Add gear icon to header in `index.html`**

Replace the `header-right` div:

```html
<div class="header-right">
  <button class="icon-btn" id="settings-btn" aria-label="Settings">
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
    </svg>
  </button>
  <button class="icon-btn" id="help-btn" aria-label="How to play">
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
      <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
    </svg>
  </button>
</div>
```

Also update `.header-right` to allow two icons:
```css
.header-right { justify-content: flex-end; gap: 4px; width: 80px; }
```

- [ ] **Step 2: Add settings modal markup in `index.html` (before closing `</body>`)**

```html
<!-- Settings modal -->
<div class="modal-overlay" id="settings-modal">
  <div class="modal">
    <div class="modal-header">
      <h2>Settings</h2>
      <button class="modal-close" data-close="settings-modal">✕</button>
    </div>
    <div class="modal-body">

      <div class="setting-row">
        <div class="setting-label">
          <span>Word Length</span>
          <span class="setting-desc">Number of letters per puzzle</span>
        </div>
        <div class="seg-control" id="length-control">
          <button class="seg-btn" data-len="4">4</button>
          <button class="seg-btn" data-len="5">5</button>
          <button class="seg-btn" data-len="6">6</button>
        </div>
      </div>

      <div class="setting-row">
        <div class="setting-label">
          <span>Hard Mode</span>
          <span class="setting-desc">Use all revealed hints in subsequent guesses</span>
        </div>
        <label class="toggle">
          <input type="checkbox" id="hard-mode-toggle">
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="setting-row">
        <div class="setting-label">
          <span>Colour Blind Mode</span>
          <span class="setting-desc">High contrast colours for accessibility</span>
        </div>
        <label class="toggle">
          <input type="checkbox" id="colour-blind-toggle">
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="setting-row">
        <div class="setting-label">
          <span>Daily Challenge</span>
          <span class="setting-desc">Same word for everyone today (5 letters)</span>
        </div>
        <label class="toggle">
          <input type="checkbox" id="daily-toggle">
          <span class="toggle-slider"></span>
        </label>
      </div>

    </div>
  </div>
</div>
```

- [ ] **Step 3: Add settings modal CSS in `style.css`**

```css
/* ── Settings modal ── */
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--header-border);
  gap: 16px;
}

.setting-row:last-child { border-bottom: none; }

.setting-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.9rem;
}

.setting-desc {
  font-size: 0.72rem;
  color: #818384;
}

/* Toggle switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}

.toggle input { opacity: 0; width: 0; height: 0; }

.toggle-slider {
  position: absolute;
  inset: 0;
  background: var(--gray);
  border-radius: 24px;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  top: 3px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

.toggle input:checked + .toggle-slider { background: var(--green); }
.toggle input:checked + .toggle-slider::before { transform: translateX(20px); }

/* Segmented control */
.seg-control {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.seg-btn {
  width: 36px;
  height: 32px;
  background: var(--gray);
  color: var(--text);
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.seg-btn.active { background: var(--green); }
```

- [ ] **Step 4: Add `applySettings`, settings modal event handlers in `app.js`**

Add after `applyColourBlind`:

```js
function applySettings() {
  applyColourBlind();
  // Sync UI controls
  document.getElementById('hard-mode-toggle').checked    = settings.hardMode;
  document.getElementById('colour-blind-toggle').checked = settings.colourBlind;
  document.getElementById('daily-toggle').checked        = settings.dailyChallenge;

  // Sync segmented control
  document.querySelectorAll('.seg-btn').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.len) === settings.wordLength);
  });

  // Daily challenge locks word length to 5
  document.getElementById('length-control').style.opacity =
    settings.dailyChallenge ? '0.4' : '1';
  document.getElementById('length-control').style.pointerEvents =
    settings.dailyChallenge ? 'none' : '';
}
```

- [ ] **Step 5: Add settings event listeners in `app.js` (near other listeners)**

```js
document.getElementById('settings-btn').addEventListener('click', () => {
  applySettings();
  openModal('settings-modal');
});

document.getElementById('hard-mode-toggle').addEventListener('change', e => {
  settings.hardMode = e.target.checked;
  saveSettings();
});

document.getElementById('colour-blind-toggle').addEventListener('change', e => {
  settings.colourBlind = e.target.checked;
  saveSettings();
  applyColourBlind();
});

document.getElementById('daily-toggle').addEventListener('change', e => {
  settings.dailyChallenge = e.target.checked;
  if (settings.dailyChallenge) settings.wordLength = 5;
  saveSettings();
  applySettings();
  stats = loadStats();
  startNewGame();
});

document.querySelectorAll('.seg-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const len = Number(btn.dataset.len);
    if (len === settings.wordLength) return;
    settings.wordLength = len;
    saveSettings();
    applySettings();
    stats = loadStats();
    startNewGame();
  });
});
```

- [ ] **Step 6: Call `applySettings()` in the boot section (after `buildBoard()`)**

```js
buildBoard();
applySettings();
const restored = restoreGame();
if (!restored) {
  targetWord = settings.dailyChallenge ? getDailyWord() : pickRandomWord();
  saveGameState(targetWord, [], 'playing');
}
```

- [ ] **Step 7: Verify full flow in browser**

1. Click gear icon → settings modal opens
2. Toggle Colour Blind → board colours change immediately
3. Change word length to 4 → new game starts with 4-tile rows
4. Change word length to 6 → new game starts with 6-tile rows
5. Toggle Daily Challenge → word length locked to 5, same word on reload
6. Toggle Hard Mode → enable, play a guess with a revealed letter, try next guess without it → toast fires

---

### Task 8: Final wiring and cleanup

**Files:**
- Modify: `app.js` — ensure `restoreGame` handles word length guard (Task 5 Step 3)
- Modify: `style.css` — update `.header-right` width for two icons

- [ ] **Step 1: Update `.header-right` width in `style.css`**

```css
.header-right { justify-content: flex-end; gap: 4px; width: 80px; }
```

- [ ] **Step 2: Confirm hard mode is disabled when a game is in progress (mid-game toggle)**

In the hard-mode toggle listener, add: if mid-game (currentRow > 0), reset constraints to match already-played rows:

```js
document.getElementById('hard-mode-toggle').addEventListener('change', e => {
  settings.hardMode = e.target.checked;
  saveSettings();
  // Rebuild constraints from played rows if turning hard mode on mid-game
  hardConstraints = { greens: {}, yellows: [] };
  if (settings.hardMode && gameState.guesses) {
    gameState.guesses.forEach(guess => {
      const result = evaluate(guess, targetWord);
      result.forEach((r, i) => {
        if (r === 'correct') hardConstraints.greens[i] = guess[i];
        if (r === 'present' && !hardConstraints.yellows.includes(guess[i])) {
          hardConstraints.yellows.push(guess[i]);
        }
      });
    });
  }
});
```

- [ ] **Step 3: Full regression test**

Play through the following scenarios and confirm each works:

1. **Default (5 letters, no modes)** — play a game, win, check stats modal shows guess distribution
2. **Switch to 4 letters** — play a game, stats are separate from 5-letter stats
3. **Switch to 6 letters** — board shows 6 tiles per row, keyboard still works
4. **Daily challenge** — enable, reload page, same word appears, word length locked to 5
5. **Hard mode** — enable, play "stare", next guess must include revealed green/yellow letters
6. **Colour blind** — enable, tile colours change to orange/blue; share emoji still uses 🟩🟨⬜
7. **Restore on refresh** — mid-game, refresh, board state restores with correct colours

- [ ] **Step 4: Deploy updated files to Netlify**

Drag the updated `wordle` folder to Netlify drop zone to redeploy.
