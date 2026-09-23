import { createBackend } from './backend.js';
import {
  SAMPLE_SET, GAME_MODES, makeId, makeCode, initializeRound, applyAnswer,
  continueTeam, leaderboard, parseDelimited, balanceLobbyTeams, modeStats
} from './game-logic.js';

const app = document.querySelector('#app');
const backend = await createBackend();
const SETS_KEY = 'team_vocab_live_study_sets';
const ID_KEY = 'team_vocab_live_device_id';
let unsubscribe = null;
let currentSession = null;
let importPreview = [];

const deviceId = sessionStorage.getItem(ID_KEY) || makeId('device');
sessionStorage.setItem(ID_KEY, deviceId);

function normalizeItem(item = {}) {
  return {
    term: String(item.term || item.word || '').trim(),
    meaning: String(item.meaning || item.japanese || '').trim(),
    definition: String(item.definition || item.englishDefinition || '').trim(),
    synonyms: String(item.synonyms || item.englishSynonyms || '').trim(),
    sentence: String(item.sentence || item.example || '').trim(),
    translation: String(item.translation || item.japaneseTranslation || '').trim()
  };
}

function normalizeSet(set) {
  return {
    ...set,
    id: set.id || makeId('set'),
    name: set.name || 'Untitled Set',
    items: (set.items || []).map(normalizeItem).filter(item => item.term)
  };
}

function getSets() {
  const raw = localStorage.getItem(SETS_KEY);
  if (!raw) {
    localStorage.setItem(SETS_KEY, JSON.stringify([SAMPLE_SET]));
    return [SAMPLE_SET];
  }
  try {
    const parsed = JSON.parse(raw);
    let sets = Array.isArray(parsed) ? parsed.map(normalizeSet) : [];
    const sampleIndex = sets.findIndex(set => set.id === SAMPLE_SET.id);
    if (sampleIndex >= 0 && !sets[sampleIndex].items.some(item => item.definition || item.synonyms)) {
      sets[sampleIndex] = SAMPLE_SET;
    }
    if (!sets.length) sets = [SAMPLE_SET];
    localStorage.setItem(SETS_KEY, JSON.stringify(sets));
    return sets;
  } catch {
    localStorage.setItem(SETS_KEY, JSON.stringify([SAMPLE_SET]));
    return [SAMPLE_SET];
  }
}

function saveSets(sets) { localStorage.setItem(SETS_KEY, JSON.stringify(sets.map(normalizeSet))); }
function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}
function formatMode(mode) {
  const aliases = {
    jpn_meaning: 'JPN Meaning',
    eng_meaning: 'ENG Meaning',
    synonyms: 'Synonyms',
    cloze: 'Cloze',
    fill_sentence: 'Cloze',
    japanese_to_english: 'JPN Meaning',
    english_to_japanese: 'English → Japanese'
  };
  return aliases[mode] || mode;
}
function modeBadge() { return backend.mode === 'firebase' ? 'Firebase multi-device mode · v0.5' : 'Local demo mode · v0.5'; }
function header(back = true) {
  return `<div class="topbar">
    <div class="brand"><div class="logo">TV</div><div><h1>Team Vocabulary Live</h1></div></div>
    <div class="inline-actions">${back ? '<button class="btn btn-ghost" data-action="home">Home</button>' : ''}<div class="mode-badge">${modeBadge()}</div></div>
  </div>`;
}
function shell(content, back = true) {
  document.body.classList.remove('student-game-active');
  return `<main class="shell">${header(back)}${content}</main>`;
}
function studentGameShell(content) {
  document.body.classList.add('student-game-active');
  return `<main class="student-game-shell">${content}</main>`;
}
function setOptions(selectedId) {
  return getSets().map(set => `<option value="${esc(set.id)}" ${set.id === selectedId ? 'selected' : ''}>${esc(set.name)} (${set.items.length})</option>`).join('');
}

function modeOptionsMarkup(set, preferredMode = 'jpn_meaning') {
  const available = GAME_MODES.filter(mode => modeStats(set, mode.id).ready);
  const selectedMode = available.some(mode => mode.id === preferredMode)
    ? preferredMode
    : (available[0]?.id || preferredMode);

  return GAME_MODES.map(mode => {
    const stats = modeStats(set, mode.id);
    return `<label class="radio-pill ${stats.ready ? '' : 'mode-unavailable'}" title="${stats.eligibleCount} usable items">
      <input type="radio" name="mode" value="${mode.id}" ${mode.id === selectedMode && stats.ready ? 'checked' : ''} ${stats.ready ? '' : 'disabled'}>
      <span>${mode.label}<small>${stats.eligibleCount} items</small></span>
    </label>`;
  }).join('');
}

function updateModeOptions() {
  const select = document.querySelector('#study-set');
  const container = document.querySelector('#mode-options');
  const note = document.querySelector('#mode-availability');
  if (!select || !container) return;
  const set = getSets().find(item => item.id === select.value);
  if (!set) return;
  const preferred = document.querySelector('input[name="mode"]:checked')?.value || 'jpn_meaning';
  container.innerHTML = modeOptionsMarkup(set, preferred);
  const readyLabels = GAME_MODES.filter(mode => modeStats(set, mode.id).ready).map(mode => mode.label);
  if (note) {
    note.textContent = readyLabels.length
      ? `Available for this set: ${readyLabels.join(', ')}.`
      : 'No mode has at least 12 usable items.';
    note.className = `small ${readyLabels.length ? 'muted' : 'text-error'}`;
  }
}

function renderHome() {
  stopSubscription();
  currentSession = null;
  app.innerHTML = shell(`
    <section class="hero">
      <span class="hero-eyebrow">Working prototype</span>
      <h2>Vocabulary teamwork with a proper answer review.</h2>
      <p>Teams share distributed answer choices. Correct answers produce a bilingual, team-wide overlay that remains until someone continues. Incorrect answers reveal nothing.</p>
    </section>
    <section class="role-grid">
      <button class="role-card" data-action="teacher"><div class="role-icon">🖥️</div><h3>Teacher</h3><p>Import study sets, create a game, retain teams between rounds, and monitor the live race.</p></button>
      <button class="role-card" data-action="student"><div class="role-icon">📱</div><h3>Student</h3><p>Join with a six-digit code, confer with teammates, and select only the answers on your screen.</p></button>
    </section>
    ${backend.mode === 'demo' ? '<p class="notice" style="margin-top:18px">Demo mode synchronizes tabs in the same browser. Add a Firebase configuration to test with separate phones and computers.</p>' : ''}
  `, false);
}

function renderTeacherSetup(existingCode = '') {
  stopSubscription();
  const sets = getSets();
  const selected = sets[0];
  const availableModes = GAME_MODES.filter(mode => modeStats(selected, mode.id).ready).map(mode => mode.label);
  app.innerHTML = shell(`
    <div class="grid">
      <section>
        <div class="card">
          <div class="section-title"><div><h2>Study Set Library</h2><p>Saved in this browser. Imported sets can contain up to six columns.</p></div><button class="btn btn-secondary" data-action="open-import">Import Set</button></div>
          <div class="set-list">${sets.map(set => `
            <div class="set-item"><div><div class="set-name">${esc(set.name)}</div><div class="set-meta">${set.items.length} items · ${set.items.filter(i => i.definition).length} definitions · ${set.items.filter(i => i.synonyms).length} synonym entries · ${set.items.filter(i => i.sentence).length} sentences</div></div>
            <button class="btn btn-ghost" data-action="delete-set" data-set-id="${esc(set.id)}" ${sets.length === 1 ? 'disabled' : ''}>Delete</button></div>`).join('')}</div>
        </div>
        <div class="card">
          <h2>Prototype Features</h2>
          <div class="notice success">Implemented: distributed choices, synchronized answer review, hidden answers after mistakes, automatic food teams, live race displays, selectable penalties, winner celebration, final leaderboard, and next rounds with the same players.</div>
        </div>
      </section>
      <aside class="card">
        <h2>${existingCode ? 'Prepare Next Round' : 'Create Game'}</h2>
        <form id="create-game-form">
          <div class="field"><label for="study-set">Study set</label><select id="study-set" name="studySetId">${setOptions(selected?.id)}</select></div>
          <div class="field"><span class="label">Game mode</span><div class="radio-row" id="mode-options">${modeOptionsMarkup(selected)}</div><small id="mode-availability" class="muted">${availableModes.length ? `Available for this set: ${availableModes.join(', ')}.` : 'No mode has at least 12 usable items.'}</small></div>
          <div class="field"><span class="label">Questions needed to win</span><div class="radio-row">
            ${[12,18,24].map(n => `<label class="radio-pill"><input type="radio" name="questionCount" value="${n}" ${n === 12 ? 'checked' : ''}><span>${n}</span></label>`).join('')}
          </div></div>
          <div class="notice">Teams are formed automatically in balanced groups of three or four as students join.</div>
          <div class="spacer"></div>
          <div class="field"><label for="penalty">Incorrect-answer penalty</label><select id="penalty" name="penalty"><option value="zero">Return to zero</option><option value="minus_one" selected>Move back one</option><option value="none">No progress penalty</option></select></div>
          ${existingCode ? `<input type="hidden" name="existingCode" value="${esc(existingCode)}">` : ''}
          <button class="btn btn-primary btn-large btn-block" type="submit">${existingCode ? 'Load Set and Return to Lobby' : 'Create Game'}</button>
        </form>
      </aside>
    </div>
  `);
}

function openImportModal() {
  importPreview = [];
  app.insertAdjacentHTML('beforeend', `
    <div class="modal" id="import-modal"><section class="modal-card import-modal-card">
      <div class="modal-head"><div><h2>Import Study Set</h2><p class="muted small">Paste tab-delimited data whenever possible. Comma-delimited CSV is also accepted.</p></div><button class="btn btn-ghost" data-action="close-import">Close</button></div>
      <div class="field"><label for="set-name">Set name</label><input id="set-name" value="New Vocabulary Set"></div>
      <div class="field"><label for="set-data">Data</label><textarea id="set-data" placeholder="term&#9;Japanese meaning&#9;English definition&#9;English synonyms&#9;English sentence&#9;Japanese translation"></textarea><small>Columns: term, Japanese meaning, English definition, English synonyms, English sentence, Japanese translation. The final four columns are optional.</small></div>
      <div class="inline-actions"><button class="btn btn-secondary" data-action="preview-import">Preview</button><button class="btn btn-primary" data-action="save-import" disabled>Save Set</button></div>
      <div id="import-feedback" style="margin-top:14px"></div>
    </section></div>`);
}

function previewImport() {
  const text = document.querySelector('#set-data').value;
  importPreview = parseDelimited(text);
  const feedback = document.querySelector('#import-feedback');
  const save = document.querySelector('[data-action="save-import"]');
  if (!importPreview.length) {
    feedback.innerHTML = '<div class="notice error">No usable rows were found.</div>';
    save.disabled = true;
    return;
  }
  const missingTerms = importPreview.filter(item => !item.term).length;
  const missingMeanings = importPreview.filter(item => !item.meaning).length;
  const invalid = missingTerms + missingMeanings;
  feedback.innerHTML = `${missingTerms ? `<div class="notice error">${missingTerms} rows lack a term.</div>` : ''}
    ${missingMeanings ? `<div class="notice error">${missingMeanings} rows lack a Japanese meaning. The first two columns are required.</div>` : ''}
    <div class="notice ${importPreview.length < 12 || invalid ? 'error' : 'success'}">${importPreview.length} items detected.${importPreview.length < 12 ? ' A full game requires at least 12 distinct terms.' : ''}</div>
    <div class="preview-scroll"><table class="preview-table"><thead><tr><th>Term</th><th>Japanese meaning</th><th>English definition</th><th>Synonyms</th><th>Sentence</th><th>Japanese translation</th></tr></thead><tbody>
    ${importPreview.slice(0,5).map(item => `<tr><td>${esc(item.term)}</td><td>${esc(item.meaning)}</td><td>${esc(item.definition)}</td><td>${esc(item.synonyms)}</td><td>${esc(item.sentence)}</td><td>${esc(item.translation)}</td></tr>`).join('')}</tbody></table></div>`;
  save.disabled = importPreview.length < 2 || invalid > 0;
}

function saveImportedSet() {
  const name = document.querySelector('#set-name').value.trim() || 'Untitled Set';
  const sets = getSets();
  sets.unshift({ id: makeId('set'), name, createdAt: Date.now(), items: importPreview.map(({ rowNumber, ...item }) => item) });
  saveSets(sets);
  document.querySelector('#import-modal')?.remove();
  renderTeacherSetup();
}

async function createOrPrepareGame(form) {
  const data = new FormData(form);
  const sets = getSets();
  const studySet = sets.find(set => set.id === data.get('studySetId'));
  const mode = data.get('mode');
  if (!studySet || studySet.items.length < 12) {
    alert('Choose a study set containing at least 12 items.');
    return;
  }
  if (!mode) {
    alert('This study set does not have enough material for any game mode.');
    return;
  }
  const stats = modeStats(studySet, mode);
  if (!stats.ready) {
    alert(`${formatMode(mode)} requires at least 12 usable items. This set currently has ${stats.eligibleCount}.`);
    return;
  }
  const settings = {
    mode,
    questionCount: Number(data.get('questionCount')),
    penalty: data.get('penalty')
  };
  const existingCode = data.get('existingCode');
  if (existingCode) {
    await backend.mutateSession(existingCode, session => {
      session.studySet = studySet;
      session.settings = settings;
      session.status = 'lobby';
      session.winnerTeamId = null;
      Object.values(session.players).forEach(player => { player.ready = true; });
      balanceLobbyTeams(session);
      return session;
    });
    renderTeacherLobby(existingCode);
    return;
  }

  let code = makeCode();
  while (await backend.getSession(code)) code = makeCode();
  const session = {
    code,
    hostId: deviceId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    revision: 0,
    status: 'lobby',
    roundNumber: 0,
    settings,
    studySet,
    players: {},
    teams: {}
  };
  await backend.createSession(session);
  sessionStorage.setItem('teacher_code', code);
  renderTeacherLobby(code);
}

function subscribe(code, renderer) {
  stopSubscription();
  unsubscribe = backend.subscribeSession(code, session => {
    if (!session) {
      app.innerHTML = shell('<div class="notice error">This game no longer exists.</div>');
      return;
    }
    currentSession = session;
    renderer(session);
  });
}
function stopSubscription() { if (unsubscribe) { unsubscribe(); unsubscribe = null; } }

function renderTeacherLobby(code) {
  subscribe(code, session => {
    if (session.status === 'playing') { renderTeacherDashboardView(session); return; }
    if (session.status === 'finished') { renderTeacherFinishedView(session); return; }
    const players = Object.values(session.players || {}).sort((a,b) => a.joinedAt - b.joinedAt);
    const previewTeams = Object.values(session.teams || {});
    app.innerHTML = shell(`
      <div class="lobby-layout">
        <aside class="card">
          <div class="code-box"><div class="code-label">Join code</div><div class="game-code">${esc(code)}</div></div>
          <div class="spacer"></div>
          <p class="small muted">Set: <strong>${esc(session.studySet.name)}</strong><br>${formatMode(session.settings.mode)} · ${session.settings.questionCount} questions · automatic teams</p>
          <button class="btn btn-primary btn-large btn-block" data-action="start-round" ${players.length < 2 ? 'disabled' : ''}>Start Round</button>
          <button class="btn btn-secondary btn-block" style="margin-top:8px" data-action="randomize-teams" ${players.length < 3 ? 'disabled' : ''}>Randomize Teams</button>
          <button class="btn btn-ghost btn-block" style="margin-top:8px" data-action="change-set" data-code="${esc(code)}">Change Set</button>
          ${players.length > 1 && previewTeams.some(team => team.playerIds.length < 3) ? '<div class="notice" style="margin-top:12px">A smaller team is currently unavoidable. It will still receive all 12 choices divided among its members.</div>' : ''}
        </aside>
        <section class="card">
          <div class="section-title"><div><h2>Lobby</h2><p>${players.length} student${players.length === 1 ? '' : 's'} connected</p></div></div>
          ${players.length ? `<div class="team-grid">${previewTeams.map(team => `<div class="team-card"><div class="team-card-title"><span class="food-badge">${esc(team.badge || '⭐')}</span><h3>${esc(team.name)}</h3></div><ul>${team.playerIds.map(id => session.players[id]).filter(Boolean).map(player => `<li>${esc(player.name)}</li>`).join('')}</ul></div>`).join('')}</div>` : '<div class="waiting"><div class="spinner"></div><h3>Waiting for students</h3><p class="muted">Open another tab and join as a student to test the demo.</p></div>'}
        </section>
      </div>`);
  });
}

async function startRound() {
  const code = currentSession.code;
  await backend.mutateSession(code, session => initializeRound(session));
}

async function randomizeTeams() {
  await backend.mutateSession(currentSession.code, session => {
    if (session.status !== 'lobby' && session.status !== 'between_rounds') return session;
    return balanceLobbyTeams(session, { randomize: true });
  });
}

function renderTeacherDashboardView(session) {
  const teams = Object.values(session.teams || {});
  app.innerHTML = shell(`
    <section class="card">
      <div class="section-title"><div><h2>Round ${session.roundNumber}: Live Race</h2><p>${esc(session.studySet.name)} · ${formatMode(session.settings.mode)}</p></div><button class="btn btn-danger" data-action="end-game">End Game</button></div>
      <div class="race-list">${teams.map(team => {
        const pct = Math.round((team.progress / session.settings.questionCount) * 100);
        return `<div class="race-row"><div class="race-name">${esc(team.name)}</div><div class="track"><div class="runner" style="width:${pct}%"><span class="runner-badge">${esc(team.badge || '⭐')}</span></div></div><div class="race-score">${team.progress}/${session.settings.questionCount}</div></div>`;
      }).join('')}</div>
    </section>`);
}

async function endGame() {
  await backend.mutateSession(currentSession.code, session => {
    session.status = 'finished';
    session.finishedAt = Date.now();
    return session;
  });
}

function confettiMarkup(count = 84) {
  return Array.from({ length: count }, (_, index) => {
    const left = (index * 37) % 100;
    const delay = -((index * 0.071) % 2.8);
    const duration = 2.8 + ((index * 13) % 18) / 10;
    const drift = ((index * 29) % 90) - 45;
    const spin = 360 + ((index * 53) % 720);
    return `<i class="confetti-piece confetti-${index % 7}" style="left:${left}%;animation-delay:${delay}s;animation-duration:${duration}s;--drift:${drift}px;--spin:${spin}deg"></i>`;
  }).join('');
}

function winnerCelebration(session) {
  const winner = session.winnerTeamId ? session.teams?.[session.winnerTeamId] : null;
  if (!winner) return '';
  return `<div class="confetti-layer" aria-hidden="true">${confettiMarkup()}</div>
    <div class="winner-overlay"><section class="winner-card" role="dialog" aria-modal="true" aria-label="Winning team">
      <span class="food-badge winner-badge">${esc(winner.badge || '⭐')}</span>
      <div class="winner-kicker">Winner</div>
      <h2>${esc(winner.name)}</h2>
      <button class="btn btn-primary btn-large" data-action="dismiss-winner">View Results</button>
    </section></div>`;
}

function renderTeacherFinishedView(session) {
  const ranked = leaderboard(session);
  app.innerHTML = shell(`
    <section class="card" style="max-width:760px;margin:0 auto">
      <div class="section-title"><div><h2>Round ${session.roundNumber} Results</h2><p>${session.winnerTeamId ? `${esc(session.teams[session.winnerTeamId]?.name || 'A team')} reached the finish.` : 'The teacher ended the round.'}</p></div></div>
      <div class="leaderboard">${ranked.map((team,index) => `<div class="leader-row"><div class="rank">${index+1}</div><strong><span class="food-badge small-badge">${esc(team.badge || '⭐')}</span>${esc(team.name)}</strong><span>${team.progress}/${session.settings.questionCount}</span></div>`).join('')}</div>
      <div class="inline-actions" style="margin-top:20px"><button class="btn btn-primary" data-action="next-round">Choose Next Set</button><button class="btn btn-ghost" data-action="same-round">Replay Same Set</button></div>
    </section>${winnerCelebration(session)}`);
}

async function replaySameSet() {
  await backend.mutateSession(currentSession.code, session => {
    session.status = 'lobby';
    session.winnerTeamId = null;
    return session;
  });
}

function renderStudentJoin() {
  stopSubscription();
  app.innerHTML = shell(`
    <section class="card join-card"><h2>Join a Game</h2><form id="join-form">
      <div class="field"><label for="join-code">Game code</label><input id="join-code" name="code" inputmode="numeric" maxlength="6" pattern="[0-9]{6}" placeholder="000000" required></div>
      <div class="field"><label for="student-name">Your name</label><input id="student-name" name="name" maxlength="24" placeholder="First name" required></div>
      <button class="btn btn-primary btn-large btn-block" type="submit">Join Game</button>
      <div id="join-feedback" style="margin-top:12px"></div>
    </form></section>`);
}

async function joinGame(form) {
  const data = new FormData(form);
  const code = String(data.get('code')).trim();
  const name = String(data.get('name')).trim();
  const feedback = document.querySelector('#join-feedback');
  const session = await backend.getSession(code);
  if (!session) { feedback.innerHTML = '<div class="notice error">Game not found. Check the six-digit code.</div>'; return; }
  if (session.status === 'playing') { feedback.innerHTML = '<div class="notice error">This round has already started.</div>'; return; }
  await backend.mutateSession(code, current => {
    current.players ||= {};
    current.players[deviceId] = current.players[deviceId] || { id: deviceId, joinedAt: Date.now() };
    current.players[deviceId].name = name;
    current.players[deviceId].connected = true;
    return balanceLobbyTeams(current);
  });
  sessionStorage.setItem('student_code', code);
  sessionStorage.setItem('student_name', name);
  renderStudentSession(code);
}

function renderStudentSession(code) {
  subscribe(code, session => {
    const player = session.players?.[deviceId];
    if (!player) { renderStudentJoin(); return; }
    if (session.status === 'lobby' || session.status === 'between_rounds') { renderStudentWaitingView(session, player); return; }
    if (session.status === 'finished') { renderStudentFinishedView(session, player); return; }
    renderStudentGameView(session, player);
  });
}

function renderStudentWaitingView(session, player) {
  const team = session.teams?.[player.teamId];
  app.innerHTML = shell(`<section class="card student-stage waiting"><div class="spinner"></div><h2>${session.status === 'between_rounds' ? 'The teacher is preparing the next round.' : 'You are in the lobby.'}</h2>${team ? `<div class="waiting-team"><span class="food-badge large-badge">${esc(team.badge || '⭐')}</span><strong>${esc(team.name)}</strong></div>` : ''}<p class="muted">Signed in as <strong>${esc(player.name)}</strong><br>Game ${esc(session.code)} · ${esc(session.studySet.name)}</p></section>`);
}

function raceTicker(session, ownTeamId) {
  const teams = Object.values(session.teams || {}).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  const target = Number(session.settings.questionCount);
  return `<section class="race-ticker compact-race-ticker" aria-label="Live team progress">
    <div class="ticker-track">
      ${teams.map((team, index) => {
        const pct = target ? (team.progress / target) * 100 : 0;
        const bounded = Math.max(3, Math.min(97, pct));
        const offset = ((index % 5) - 2) * 4;
        return `<div class="ticker-marker lane-${index % 3} ${team.id === ownTeamId ? 'own-team' : ''}" style="left:calc(${bounded}% + ${offset}px)" title="${esc(team.name)}: ${team.progress}/${target}" aria-label="${esc(team.name)} ${team.progress} of ${target}"><span>${esc(team.badge || '⭐')}</span></div>`;
      }).join('')}
    </div>
  </section>`;
}

function renderStudentGameView(session, player) {
  const team = session.teams[player.teamId];
  if (!team) {
    app.innerHTML = shell('<section class="card waiting"><div class="spinner"></div><h2>Assigning your team…</h2></section>');
    return;
  }
  const options = team.currentQuestion?.assignments?.[player.id] || [];
  const promptText = team.currentQuestion?.prompt || '';
  const promptClass = promptText.length > 120 ? 'prompt very-long' : (promptText.length > 75 ? 'prompt long' : 'prompt');
  const answerClass = options.some(option => String(option).length > 28) ? 'answers long-options' : 'answers';
  app.innerHTML = studentGameShell(`
    ${raceTicker(session, team.id)}
    <section class="student-stage gameplay-stage">
      <div class="status-strip"><strong>${esc(team.name)}</strong><span>${team.progress}/${session.settings.questionCount}</span></div>
      <div class="prompt-card"><div class="${promptClass}">${esc(promptText)}</div></div>
      <div class="${answerClass} count-${options.length}">${options.map(option => `<button class="answer-btn" data-action="answer" data-answer="${esc(option)}">${esc(option)}</button>`).join('')}</div>
    </section>
    ${team.overlay ? resultOverlay(team.overlay) : ''}`);
}

function resultOverlay(overlay) {
  if (overlay.type === 'incorrect') {
    return `<div class="overlay"><section class="overlay-card"><div class="result-icon incorrect">×</div><h2>Incorrect</h2><p class="muted">The correct answer is not shown. The item will return later.</p><button class="btn btn-primary btn-large" data-action="continue-team">Continue</button></section></div>`;
  }
  return `<div class="overlay"><section class="overlay-card"><div class="result-icon correct">✓</div><h2>Correct!</h2>
    ${(overlay.term || overlay.meaning) ? `<div class="term-pair">${esc(overlay.term)}${overlay.meaning ? ` · ${esc(overlay.meaning)}` : ''}</div>` : ''}
    ${overlay.definition ? `<p class="answer-detail"><strong>Definition:</strong> ${esc(overlay.definition)}</p>` : ''}
    ${overlay.synonyms ? `<p class="answer-detail"><strong>Synonyms:</strong> ${esc(overlay.synonyms)}</p>` : ''}
    ${overlay.completedSentence ? `<p class="completed">${highlightTerm(overlay.completedSentence, overlay.term)}</p>` : ''}
    ${overlay.translation ? `<p class="translation">${esc(overlay.translation)}</p>` : '<p class="translation">No Japanese sentence translation was provided for this item.</p>'}
    <button class="btn btn-primary btn-large" data-action="continue-team">Continue</button></section></div>`;
}
function highlightTerm(sentence, term) {
  const safeSentence = esc(sentence);
  if (!term) return safeSentence;
  const safeTerm = esc(term);
  return safeSentence.replace(safeTerm, `<strong>${safeTerm}</strong>`);
}

async function submitAnswer(answer) {
  document.querySelectorAll('.answer-btn').forEach(button => { button.disabled = true; });
  await backend.mutateSession(currentSession.code, session => applyAnswer(session, deviceId, answer));
}
async function continueCurrentTeam() {
  await backend.mutateSession(currentSession.code, session => continueTeam(session, deviceId));
}

function renderStudentFinishedView(session, player) {
  const ranked = leaderboard(session);
  const ownTeam = session.teams[player.teamId];
  const rank = ranked.findIndex(team => team.id === ownTeam?.id) + 1;
  app.innerHTML = shell(`<section class="card student-stage"><h2>Round Complete</h2><p class="muted"><span class="food-badge small-badge">${esc(ownTeam?.badge || '⭐')}</span>${esc(ownTeam?.name || '')} finished in position ${rank || '—'}.</p><div class="leaderboard">${ranked.map((team,index) => `<div class="leader-row"><div class="rank">${index+1}</div><strong><span class="food-badge small-badge">${esc(team.badge || '⭐')}</span>${esc(team.name)}</strong><span>${team.progress}/${session.settings.questionCount}</span></div>`).join('')}</div><p class="notice" style="margin-top:18px">Stay on this screen. The teacher can load another study set while retaining the same players.</p></section>${winnerCelebration(session)}`);
}

app.addEventListener('click', async event => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  try {
    if (action === 'home') renderHome();
    if (action === 'teacher') renderTeacherSetup();
    if (action === 'student') renderStudentJoin();
    if (action === 'open-import') openImportModal();
    if (action === 'close-import') document.querySelector('#import-modal')?.remove();
    if (action === 'preview-import') previewImport();
    if (action === 'save-import') saveImportedSet();
    if (action === 'delete-set') {
      const sets = getSets().filter(set => set.id !== target.dataset.setId);
      saveSets(sets);
      renderTeacherSetup();
    }
    if (action === 'start-round') await startRound();
    if (action === 'randomize-teams') await randomizeTeams();
    if (action === 'change-set') renderTeacherSetup(target.dataset.code);
    if (action === 'end-game') await endGame();
    if (action === 'next-round') renderTeacherSetup(currentSession.code);
    if (action === 'same-round') await replaySameSet();
    if (action === 'answer') await submitAnswer(target.dataset.answer);
    if (action === 'continue-team') await continueCurrentTeam();
    if (action === 'dismiss-winner') {
      document.querySelector('.winner-overlay')?.remove();
      document.querySelector('.confetti-layer')?.remove();
    }
  } catch (error) {
    console.error(error);
    alert(error.message || 'An unexpected error occurred.');
  }
});

app.addEventListener('change', event => {
  if (event.target.id === 'study-set') updateModeOptions();
});

app.addEventListener('submit', async event => {
  event.preventDefault();
  try {
    if (event.target.id === 'create-game-form') await createOrPrepareGame(event.target);
    if (event.target.id === 'join-form') await joinGame(event.target);
  } catch (error) {
    console.error(error);
    alert(error.message || 'An unexpected error occurred.');
  }
});

window.addEventListener('team-vocab-demo-update', event => {
  if (currentSession?.code === event.detail.code && unsubscribe) {
    backend.getSession(event.detail.code).then(session => {
      currentSession = session;
    });
  }
});

renderHome();
