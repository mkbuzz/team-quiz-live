export const SAMPLE_SET = {
  id: 'sample-university-life',
  name: 'University Life Vocabulary',
  createdAt: Date.now(),
  items: [
    { term: 'advice', meaning: '助言、アドバイス', definition: 'an opinion about what someone should do', synonyms: 'guidance, recommendation', sentence: 'My teacher gave me useful advice about starting my review early before the exam.', translation: '先生は、試験前の復習を早めに始めることについて役立つ助言をくれました。' },
    { term: 'advise', meaning: '助言する', definition: 'to tell someone what you think they should do', synonyms: 'recommend, suggest', sentence: 'The doctor advised him to walk a little every day for his health.', translation: '医師は健康のために毎日少し歩くよう彼に助言しました。' },
    { term: 'average', meaning: '平均の、平均', definition: 'a usual or typical amount calculated from a group', synonyms: 'typical, mean', sentence: 'The average rent in this town is a little too high for students.', translation: 'この町の平均家賃は学生には少し高すぎます。' },
    { term: 'borrow', meaning: '借りる', definition: 'to take and use something that belongs to another person and return it later', synonyms: 'take on loan', sentence: 'Students can borrow up to five books from the library at one time.', translation: '学生は図書館から一度に5冊まで本を借りることができます。' },
    { term: 'budget', meaning: '予算', definition: 'a plan for how much money you can spend', synonyms: 'spending plan, allowance', sentence: 'Making a budget before a trip helps you avoid spending too much money.', translation: '旅行前に予算を立てると、お金を使いすぎるのを防ぐことができます。' },
    { term: 'cost', meaning: '費用、値段', definition: 'the amount of money needed to buy or do something', synonyms: 'price, expense', sentence: 'The cost of the new smartphone is high, but it may last for several years.', translation: '新しいスマートフォンの値段は高いですが、数年間使えるかもしれません。' },
    { term: 'education', meaning: '教育', definition: 'the process of teaching, learning, and gaining knowledge', synonyms: 'schooling, instruction', sentence: 'A good education can give people more choices for their future jobs.', translation: '良い教育は、将来の仕事についてより多くの選択肢を人々に与えることができます。' },
    { term: 'expense', meaning: '費用、出費', definition: 'money that you spend on something', synonyms: 'cost, charge', sentence: 'Rent is usually the largest monthly expense for students living alone.', translation: '家賃は通常、一人暮らしの学生にとって毎月最大の出費です。' },
    { term: 'fee', meaning: '料金、手数料', definition: 'money paid for a service or activity', synonyms: 'charge, payment', sentence: 'There is a small fee for using the university gym after 8 p.m.', translation: '午後8時以降に大学のジムを利用するには少額の料金がかかります。' },
    { term: 'lend', meaning: '貸す', definition: 'to give something to someone for a limited time', synonyms: 'loan, provide temporarily', sentence: 'Could you lend me your notes from yesterday’s lecture?', translation: '昨日の講義のノートを貸してもらえますか。' },
    { term: 'manage', meaning: '何とかやり遂げる、管理する', definition: 'to succeed in doing something difficult or to control something', synonyms: 'handle, accomplish', sentence: 'She managed to finish her report before the library closed.', translation: '彼女は図書館が閉まる前に何とかレポートを終えました。' },
    { term: 'purchase', meaning: '購入する、購入', definition: 'to buy something or the act of buying it', synonyms: 'buy, acquire', sentence: 'Students can purchase discounted train tickets at the campus office.', translation: '学生は学内の窓口で割引の電車切符を購入できます。' },
    { term: 'reduce', meaning: '減らす', definition: 'to make something smaller or less', synonyms: 'decrease, lower', sentence: 'Cooking at home can reduce your monthly food expenses.', translation: '自炊をすると毎月の食費を減らすことができます。' },
    { term: 'rent', meaning: '借りる、家賃', definition: 'to pay to use something for a period of time or the payment for it', synonyms: 'lease, hire', sentence: 'Many students rent small apartments near the university.', translation: '多くの学生が大学の近くに小さなアパートを借りています。' },
    { term: 'save', meaning: '貯める、節約する', definition: 'to keep money for future use or avoid wasting it', synonyms: 'keep, conserve', sentence: 'He saves part of his part-time job income every month.', translation: '彼はアルバイト収入の一部を毎月貯金しています。' },
    { term: 'spend', meaning: '使う、過ごす', definition: 'to use money or time for a particular purpose', synonyms: 'use, pay out', sentence: 'I try not to spend too much money at convenience stores.', translation: '私はコンビニでお金を使いすぎないようにしています。' },
    { term: 'tuition', meaning: '授業料', definition: 'money paid for teaching at a school or university', synonyms: 'school fees, course fees', sentence: 'University tuition is a major concern for many families.', translation: '大学の授業料は多くの家庭にとって大きな心配事です。' },
    { term: 'value', meaning: '価値', definition: 'how useful or worthwhile something is', synonyms: 'worth, benefit', sentence: 'This used laptop offers good value for the price.', translation: 'この中古ノートパソコンは価格に対して十分な価値があります。' }
  ]
};

export const GAME_MODES = [
  { id: 'jpn_meaning', label: 'JPN Meaning', field: 'meaning' },
  { id: 'eng_meaning', label: 'ENG Meaning', field: 'definition' },
  { id: 'synonyms', label: 'Synonyms', field: 'synonyms' },
  { id: 'cloze', label: 'Cloze', field: 'sentence' }
];

export function makeId(prefix = 'id') {
  if (crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function makeCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function shuffle(array) {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const FOOD_TEAMS = [
  { name: 'Apple', badge: '🍎' },
  { name: 'Orange', badge: '🍊' },
  { name: 'Lemon', badge: '🍋' },
  { name: 'Banana', badge: '🍌' },
  { name: 'Watermelon', badge: '🍉' },
  { name: 'Grapes', badge: '🍇' },
  { name: 'Strawberry', badge: '🍓' },
  { name: 'Blueberry', badge: '🫐' },
  { name: 'Cherry', badge: '🍒' },
  { name: 'Peach', badge: '🍑' },
  { name: 'Pear', badge: '🍐' },
  { name: 'Pineapple', badge: '🍍' },
  { name: 'Kiwi', badge: '🥝' },
  { name: 'Tomato', badge: '🍅' },
  { name: 'Eggplant', badge: '🍆' },
  { name: 'Avocado', badge: '🥑' },
  { name: 'Broccoli', badge: '🥦' },
  { name: 'Carrot', badge: '🥕' },
  { name: 'Corn', badge: '🌽' },
  { name: 'Potato', badge: '🥔' },
  { name: 'Sweet Potato', badge: '🍠' },
  { name: 'Cucumber', badge: '🥒' },
  { name: 'Cabbage', badge: '🥬' },
  { name: 'Garlic', badge: '🧄' },
  { name: 'Onion', badge: '🧅' },
  { name: 'Chili Pepper', badge: '🌶️' },
  { name: 'Bell Pepper', badge: '🫑' },
  { name: 'Peas', badge: '🫛' }
];

export function desiredTeamCount(playerCount) {
  if (playerCount <= 0) return 0;
  if (playerCount <= 4) return 1;
  return Math.ceil(playerCount / 4);
}

function newFoodTeam(existingTeams = []) {
  const usedNames = new Set(existingTeams.map(team => team.name));
  const unused = shuffle(FOOD_TEAMS.filter(food => !usedNames.has(food.name)))[0];
  const base = unused || shuffle(FOOD_TEAMS)[0];
  let name = base.name;
  let suffix = 2;
  while (usedNames.has(name)) {
    name = `${base.name} ${suffix}`;
    suffix += 1;
  }
  return {
    id: makeId('team'),
    name,
    badge: base.badge,
    playerIds: []
  };
}

function normalizeTeamIdentity(team, claimedNames) {
  const badgeMatch = FOOD_TEAMS.find(food => food.badge === team.badge);
  const exactNameMatch = FOOD_TEAMS.find(food => food.name === team.name);
  const legacyName = !team.name
    || /^team\s*[a-z0-9]+$/i.test(team.name)
    || /\bteam\s*[a-z]$/i.test(team.name)
    || /^group\s*[a-z0-9]+$/i.test(team.name);

  let identity = null;
  if (badgeMatch && (legacyName || team.name !== badgeMatch.name)) identity = badgeMatch;
  else if (exactNameMatch) identity = exactNameMatch;
  else if (!team.badge || legacyName) identity = shuffle(FOOD_TEAMS.filter(food => !claimedNames.has(food.name)))[0];

  if (identity) {
    team.name = identity.name;
    team.badge = identity.badge;
  }
  if (!team.badge) team.badge = '⭐';
  if (!team.name) team.name = 'Food Team';

  delete team.label;
  delete team.teamLabel;
  delete team.letter;
  delete team.displayName;
  delete team.legacyName;
  claimedNames.add(team.name);
}

function updatePlayerTeamFields(session, teams) {
  Object.values(session.players || {}).forEach(player => {
    delete player.teamId;
    delete player.slot;
    delete player.teamName;
    delete player.teamLabel;
    delete player.groupName;
  });
  teams.forEach(team => {
    team.playerIds.forEach((playerId, index) => {
      const player = session.players[playerId];
      if (!player) return;
      player.teamId = team.id;
      player.slot = index + 1;
    });
  });
}

export function balanceLobbyTeams(session, { randomize = false } = {}) {
  const players = Object.values(session.players || {}).sort((a, b) => a.joinedAt - b.joinedAt);
  const count = desiredTeamCount(players.length);
  if (!count) {
    session.teams = {};
    return session;
  }

  const playerIds = new Set(players.map(player => player.id));
  let teams = Object.values(session.teams || {})
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
    .map(team => ({ ...team, playerIds: (team.playerIds || []).filter(id => playerIds.has(id)) }));

  const claimedNames = new Set();
  teams.forEach(team => normalizeTeamIdentity(team, claimedNames));

  while (teams.length < count) {
    const team = newFoodTeam(teams);
    team.createdAt = Date.now() + teams.length;
    teams.push(team);
  }

  if (teams.length > count) {
    const removed = teams.splice(count);
    const displaced = removed.flatMap(team => team.playerIds || []);
    displaced.forEach(id => {
      teams.sort((a, b) => a.playerIds.length - b.playerIds.length);
      teams[0].playerIds.push(id);
    });
  }

  const assigned = new Set(teams.flatMap(team => team.playerIds));
  const unassigned = players.filter(player => !assigned.has(player.id)).map(player => player.id);

  if (randomize) {
    const shuffled = shuffle(players.map(player => player.id));
    teams.forEach(team => { team.playerIds = []; });
    shuffled.forEach(id => {
      teams.sort((a, b) => a.playerIds.length - b.playerIds.length);
      teams[0].playerIds.push(id);
    });
  } else {
    unassigned.forEach(id => {
      teams.sort((a, b) => a.playerIds.length - b.playerIds.length);
      teams[0].playerIds.push(id);
    });

    while (teams.length > 1) {
      const sorted = [...teams].sort((a, b) => b.playerIds.length - a.playerIds.length);
      const largest = sorted[0];
      const smallest = sorted[sorted.length - 1];
      if (largest.playerIds.length - smallest.playerIds.length <= 1) break;
      smallest.playerIds.push(largest.playerIds.pop());
    }
  }

  updatePlayerTeamFields(session, teams);
  session.teams = Object.fromEntries(teams.map(team => [team.id, team]));
  return session;
}

export function blankSentence(sentence, term) {
  if (!sentence) return '';
  if (sentence.includes('{{') && sentence.includes('}}')) {
    return sentence.replace(/\{\{.*?\}\}/, '_____');
  }
  if (/_{3,}/.test(sentence)) return sentence.replace(/_{3,}/, '_____');
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`\\b${escaped}\\b`, 'i');
  if (pattern.test(sentence)) return sentence.replace(pattern, '_____');
  return `${sentence}  [${term}]`;
}

export function completedSentence(sentence, term) {
  if (!sentence) return '';
  if (sentence.includes('{{') && sentence.includes('}}')) {
    return sentence.replace(/\{\{.*?\}\}/, term);
  }
  if (/_{3,}/.test(sentence)) return sentence.replace(/_{3,}/, term);
  return sentence;
}

function canonicalMode(mode) {
  if (mode === 'fill_sentence') return 'cloze';
  if (mode === 'japanese_to_english') return 'jpn_meaning';
  return mode;
}

export function itemSupportsMode(item, mode) {
  const canonical = canonicalMode(mode);
  if (!item?.term?.trim()) return false;
  if (canonical === 'jpn_meaning') return Boolean(item.meaning?.trim());
  if (canonical === 'eng_meaning') return Boolean(item.definition?.trim());
  if (canonical === 'synonyms') return Boolean(item.synonyms?.trim());
  if (canonical === 'cloze') return Boolean(item.sentence?.trim());
  if (canonical === 'english_to_japanese') return Boolean(item.meaning?.trim());
  return false;
}

export function answerFor(item, mode) {
  if (mode === 'english_to_japanese') return item.meaning;
  return item.term;
}

export function promptFor(item, mode) {
  const canonical = canonicalMode(mode);
  if (canonical === 'jpn_meaning') return item.meaning;
  if (canonical === 'eng_meaning') return item.definition;
  if (canonical === 'synonyms') return item.synonyms;
  if (canonical === 'cloze') return blankSentence(item.sentence, item.term);
  if (canonical === 'english_to_japanese') return item.term;
  return '';
}

function uniqueAnswers(items, mode) {
  const seen = new Set();
  const answers = [];
  for (const item of items) {
    const answer = answerFor(item, mode)?.trim();
    if (answer && !seen.has(answer)) {
      seen.add(answer);
      answers.push(answer);
    }
  }
  return answers;
}

export function modeStats(studySet, mode) {
  const items = studySet?.items || [];
  const eligibleCount = items.filter(item => itemSupportsMode(item, mode)).length;
  const answerCount = uniqueAnswers(items, mode).length;
  return {
    eligibleCount,
    answerCount,
    ready: eligibleCount >= 12 && answerCount >= 12
  };
}

export function buildQuestion(studySet, itemId, mode, playerIds) {
  const item = studySet.items[itemId];
  const correctAnswer = answerFor(item, mode);
  const distractors = shuffle(uniqueAnswers(studySet.items, mode).filter(a => a !== correctAnswer)).slice(0, 11);
  const options = shuffle([correctAnswer, ...distractors]);
  const assignments = Object.fromEntries(playerIds.map(id => [id, []]));
  options.forEach((option, index) => {
    const id = playerIds[index % playerIds.length];
    assignments[id].push(option);
  });
  Object.keys(assignments).forEach(id => { assignments[id] = shuffle(assignments[id]); });

  return {
    id: makeId('q'),
    itemId,
    prompt: promptFor(item, mode),
    correctAnswer,
    assignments,
    term: item.term || '',
    meaning: item.meaning || '',
    definition: item.definition || '',
    synonyms: item.synonyms || '',
    completedSentence: completedSentence(item.sentence, item.term),
    translation: item.translation || ''
  };
}

export function createQuestionOrder(itemIdsOrCount, targetCount) {
  const itemIds = Array.isArray(itemIdsOrCount)
    ? [...itemIdsOrCount]
    : Array.from({ length: Number(itemIdsOrCount) }, (_, i) => i);
  const order = [];
  while (itemIds.length && order.length < targetCount * 3) {
    order.push(...shuffle(itemIds));
  }
  return order;
}

export function initializeRound(session) {
  session.roundNumber = (session.roundNumber || 0) + 1;
  session.status = 'playing';
  session.startedAt = Date.now();
  session.finishedAt = null;
  session.winnerTeamId = null;
  balanceLobbyTeams(session);

  const eligibleItemIds = session.studySet.items
    .map((item, index) => itemSupportsMode(item, session.settings.mode) ? index : null)
    .filter(index => index !== null);
  if (!eligibleItemIds.length) throw new Error('This study set has no items available for the selected mode.');

  Object.values(session.teams).forEach(team => {
    team.progress = 0;
    team.correctAnswers = 0;
    team.wrongAnswers = 0;
    team.questionIndex = 0;
    team.questionOrder = createQuestionOrder(eligibleItemIds, Number(session.settings.questionCount));
    team.overlay = null;
    team.pendingFinish = false;
    team.currentQuestion = buildQuestion(
      session.studySet,
      team.questionOrder[0],
      session.settings.mode,
      team.playerIds
    );
  });
  return session;
}

export function applyAnswer(session, playerId, selectedAnswer) {
  if (session.status !== 'playing') return session;
  const player = session.players[playerId];
  if (!player) return session;
  const team = session.teams[player.teamId];
  if (!team || team.overlay || !team.currentQuestion) return session;

  const correct = selectedAnswer === team.currentQuestion.correctAnswer;
  if (correct) {
    team.correctAnswers += 1;
    team.progress = Math.min(Number(session.settings.questionCount), team.progress + 1);
    team.pendingFinish = team.progress >= Number(session.settings.questionCount);
    team.overlay = {
      type: 'correct',
      term: team.currentQuestion.term,
      meaning: team.currentQuestion.meaning,
      definition: team.currentQuestion.definition,
      synonyms: team.currentQuestion.synonyms,
      completedSentence: team.currentQuestion.completedSentence,
      translation: team.currentQuestion.translation,
      submittedBy: player.name
    };
  } else {
    team.wrongAnswers += 1;
    if (session.settings.penalty === 'zero') team.progress = 0;
    if (session.settings.penalty === 'minus_one') team.progress = Math.max(0, team.progress - 1);
    team.overlay = { type: 'incorrect', submittedBy: player.name };
  }
  return session;
}

export function continueTeam(session, playerId) {
  if (session.status !== 'playing') return session;
  const player = session.players[playerId];
  if (!player) return session;
  const team = session.teams[player.teamId];
  if (!team?.overlay) return session;

  if (team.overlay.type === 'correct' && team.pendingFinish) {
    session.status = 'finished';
    session.finishedAt = Date.now();
    session.winnerTeamId = team.id;
    Object.values(session.teams).forEach(t => { t.overlay = null; });
    return session;
  }

  const previousItemId = team.currentQuestion.itemId;
  team.questionIndex += 1;

  if (team.overlay.type === 'incorrect') {
    const reinsertAt = Math.min(team.questionOrder.length, team.questionIndex + 3);
    team.questionOrder.splice(reinsertAt, 0, previousItemId);
  }

  const nextItemId = team.questionOrder[team.questionIndex];
  team.currentQuestion = buildQuestion(session.studySet, nextItemId, session.settings.mode, team.playerIds);
  team.overlay = null;
  team.pendingFinish = false;
  return session;
}

export function prepareNextRound(session, studySet, settings) {
  session.status = 'between_rounds';
  session.studySet = studySet;
  session.settings = settings;
  session.winnerTeamId = null;
  Object.values(session.teams || {}).forEach(team => {
    team.progress = 0;
    team.overlay = null;
    team.currentQuestion = null;
  });
  return session;
}

export function leaderboard(session) {
  return Object.values(session.teams || {}).sort((a, b) => {
    if (b.progress !== a.progress) return b.progress - a.progress;
    if (b.correctAnswers !== a.correctAnswers) return b.correctAnswers - a.correctAnswers;
    return a.wrongAnswers - b.wrongAnswers;
  });
}

function normalizeHeader(value) {
  return value.trim().toLowerCase().replace(/[._-]+/g, ' ').replace(/\s+/g, ' ');
}

function headerField(value) {
  const header = normalizeHeader(value);
  const aliases = {
    term: ['term', 'word', 'english', 'english term', 'eng term', 'eng word', 'vocabulary'],
    meaning: ['meaning', 'japanese', 'japanese meaning', 'jpn meaning', 'jp meaning'],
    definition: ['definition', 'english definition', 'eng definition', 'english meaning', 'eng meaning'],
    synonyms: ['synonym', 'synonyms', 'english synonym', 'english synonyms', 'eng synonym', 'eng synonyms'],
    sentence: ['sentence', 'english sentence', 'example sentence', 'cloze', 'cloze sentence'],
    translation: ['translation', 'japanese translation', 'sentence translation', 'jpn translation', 'jp translation']
  };
  return Object.entries(aliases).find(([, values]) => values.includes(header))?.[0] || null;
}

export function parseDelimited(text) {
  const clean = text.trim();
  if (!clean) return [];
  const lines = clean.split(/\r?\n/).filter(line => line.trim());
  const delimiter = lines.some(line => line.includes('\t')) ? '\t' : ',';
  const rows = lines.map(line => delimiter === '\t' ? line.split('\t') : parseCsvLine(line));
  const headerFields = rows[0].map(headerField);
  const hasHeader = headerFields.some(Boolean);
  const data = hasHeader ? rows.slice(1) : rows;

  return data.map((columns, index) => {
    const cells = columns.map(value => value.trim());
    let term = '';
    let meaning = '';
    let definition = '';
    let synonyms = '';
    let sentence = '';
    let translation = '';

    if (hasHeader) {
      headerFields.forEach((field, i) => {
        if (!field) return;
        const value = cells[i] || '';
        if (field === 'term') term = value;
        if (field === 'meaning') meaning = value;
        if (field === 'definition') definition = value;
        if (field === 'synonyms') synonyms = value;
        if (field === 'sentence') sentence = value;
        if (field === 'translation') translation = value;
      });
      term ||= cells[0] || '';
      meaning ||= cells[1] || '';
    } else {
      [term = '', meaning = '', definition = '', synonyms = '', sentence = '', translation = ''] = cells;

      if (cells.length === 4 && looksLikeSentence(cells[2], term)) {
        sentence = cells[2];
        translation = cells[3];
        definition = '';
        synonyms = '';
      } else if (cells.length === 3 && looksLikeSentence(cells[2], term)) {
        sentence = cells[2];
        definition = '';
      } else if (cells.length === 2 && looksLikeSentence(cells[1], term)) {
        sentence = cells[1];
        meaning = '';
      }
    }

    return {
      term,
      meaning,
      definition,
      synonyms,
      sentence,
      translation,
      rowNumber: index + (hasHeader ? 2 : 1)
    };
  }).filter(item => item.term);
}

function looksLikeSentence(value, term) {
  if (!value) return false;
  return /[.!?]$/.test(value)
    || value.includes('_____')
    || value.includes('{{')
    || (term && value.toLowerCase().includes(term.toLowerCase()));
}

function parseCsvLine(line) {
  const out = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { value += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      out.push(value);
      value = '';
    } else value += char;
  }
  out.push(value);
  return out;
}
