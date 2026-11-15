// PSLE Science linter — enforces the SPEC §12 contract.
// Used by build.mjs; can also run alone:  node tools/lint.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KINDS = ['exam', 'diag', 'variant'];
const POOLS = ['page', 'recap'];
const TYPES = ['unit', 'focus'];
const ORIGINS = ['base', 'mistake', 'retrofit'];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function stripTags(s) { return String(s || '').replace(/<[^>]*>/g, ' '); }
// Options are shown in file order (never shuffled), so the correct answers must be spread across (1)–(4).
// Returns problems for a list of questions: one position holding more than half (4+ questions),
// or, with 8+ questions, a position that is never used.
export function answerSpread(qs, { checkUnused = true } = {}) {
  const n = qs.length, count = [0, 0, 0, 0], out = [];
  qs.forEach(q => { const i = (q.options || []).findIndex(o => o.correct); if (i >= 0 && i < 4) count[i]++; });
  if (n >= 4) count.forEach((c, i) => { if (c > n / 2) out.push(`${c} of ${n} correct answers are option (${i + 1})`); });
  if (checkUnused && n >= 8) count.forEach((c, i) => { if (!c) out.push(`no correct answer is option (${i + 1}) in ${n} questions`); });
  return out;
}
function stripBeyond(html) { return String(html || '').replace(/<details[^>]*class="[^"]*\bbeyond\b[^"]*"[\s\S]*?<\/details>/gi, ' '); }
function termRe(term) { return new RegExp('(^|[^a-z])' + term.replace(/[-]/g, '[- ]').replace(/\s+/g, '\\s+') + '(?=$|[^a-z])', 'i'); }

export function lintAll({ syllabus, registry, pages }) {
  const errors = [], warnings = [];
  const E = (where, msg) => errors.push(`${where}: ${msg}`);
  const W = (where, msg) => warnings.push(`${where}: ${msg}`);

  const loIndex = {};
  for (const [code, t] of Object.entries(syllabus.topics)) for (const lo of t.los) loIndex[lo.id] = { ...lo, topic: code };
  const terms = (syllabus.excludedTerms || []).map(t => ({ term: t.term, re: termRe(t.term) }));
  const findTerms = (text, allow = []) => terms.filter(t => !allow.includes(t.term) && t.re.test(text)).map(t => t.term);

  // ---- registry ----
  const tags = {};
  for (const t of registry.tags || []) {
    const w = `misconceptions.json ${t.id || '(no id)'}`;
    if (!t.id || !/^[A-Z]{3}-\d{2}$/.test(t.id)) E(w, 'id must look like MAG-01');
    if (tags[t.id]) E(w, 'duplicate id');
    if (!syllabus.topics[t.topic]) E(w, `unknown topic ${t.topic}`);
    if (!loIndex[t.lo]) E(w, `unknown LO ${t.lo}`);
    if (!t.label || !t.fix) E(w, 'needs label and fix');
    for (const term of findTerms(`${t.label} ${t.fix}`)) E(w, `excluded term "${term}"`);
    tags[t.id] = t;
  }

  // ---- pages ----
  const qIds = {}, pageIds = {}, tagUse = {};
  for (const p of pages) {
    const m = p.meta, w = p.src;
    for (const f of ['id', 'type', 'theme', 'topic', 'level', 'title', 'purpose', 'lo', 'fixes', 'origin', 'built', 'order'])
      if (m[f] === undefined || m[f] === '' || (Array.isArray(m[f]) && !m[f].length)) E(w, `meta.${f} is missing`);
    if (pageIds[m.id]) E(w, `duplicate page id ${m.id}`); pageIds[m.id] = 1;
    const topic = syllabus.topics[m.topic];
    if (!topic) { E(w, `unknown topic ${m.topic}`); continue; }
    if (!TYPES.includes(m.type)) E(w, `type must be ${TYPES.join('/')}`);
    if (!ORIGINS.includes(m.origin)) E(w, `origin must be ${ORIGINS.join('/')}`);
    if (topic.level !== m.level) E(w, `level ${m.level} does not match topic ${m.topic} (${topic.level})`);
    if (topic.theme !== m.theme) E(w, `theme ${m.theme} does not match topic ${m.topic} (${topic.theme})`);
    const folder = syllabus.themes[topic.theme].folder;
    if (p.folder !== folder) E(w, `must live under src/pages/${folder}/`);
    const stem = `${m.level}-${topic.slug}`;
    if (m.type === 'unit' && m.id !== stem) E(w, `unit page id must be ${stem}`);
    if (m.type === 'focus' && !(m.id.startsWith(stem + '-') && SLUG.test(m.id.slice(stem.length + 1)))) E(w, `focus page id must be ${stem}-<focus-slug>`);
    if (path.basename(p.dir) !== m.id) E(w, `folder name must equal meta.id (${m.id})`);
    for (const id of m.lo || []) {
      if (!loIndex[id]) E(w, `unknown LO ${id}`);
      else if (loIndex[id].topic !== m.topic) W(w, `LO ${id} belongs to topic ${loIndex[id].topic}, not ${m.topic}`);
    }
    const allow = m.allowTerms || [];

    // main flow text: excluded terms outside <details class="beyond">
    for (const term of findTerms(stripTags(stripBeyond(p.body)), allow)) E(w + '/body.html', `excluded term "${term}" outside a Beyond syllabus toggle`);
    for (const term of findTerms(stripTags(`${m.title} ${m.purpose}`), allow)) E(w + '/meta.json', `excluded term "${term}"`);
    // string literals on a single line that read like prose (contain a space); avoids matching code between quotes
    const jsStrings = p.js.split('\n').flatMap(line => line.match(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g) || [])
      .filter(t => / [a-z]/i.test(t)).join(' ');
    for (const term of findTerms(stripTags(jsStrings), allow)) W(w + '/page.js', `excluded term "${term}" in a string; keep it inside a Beyond syllabus toggle`);

    // network / fonts
    for (const [file, text] of [['body.html', p.body], ['page.js', p.js], ['page.css', p.css]]) {
      const urls = (text.match(/https?:\/\/[^\s"'<>)]+/g) || []).filter(u => !u.startsWith('http://www.w3.org/'));
      if (urls.length) E(`${w}/${file}`, `external URL(s): ${[...new Set(urls)].slice(0, 3).join(', ')}`);
      if (/@import\s+url\(|fonts\.googleapis|fonts\.gstatic/i.test(text)) E(`${w}/${file}`, 'web font or @import url');
    }

    // ---- questions ----
    const pageQ = p.questions;
    if (!Array.isArray(pageQ)) { E(w + '/questions.json', 'must be an array'); continue; }
    const covered = new Set();
    for (const q of pageQ) {
      const qw = `${w} ${q.id || '(question without id)'}`;
      if (!q.id || !q.id.startsWith(m.id + '.')) E(qw, `id must start with "${m.id}."`);
      if (qIds[q.id]) E(qw, 'duplicate question id'); qIds[q.id] = 1;
      if (!q.title) E(qw, 'title missing');
      if (!q.stem || !stripTags(q.stem).trim()) E(qw, 'stem missing');
      if (!KINDS.includes(q.kind)) E(qw, `kind must be ${KINDS.join('/')}`);
      if (!POOLS.includes(q.pool)) E(qw, `pool must be ${POOLS.join('/')}`);
      if (q.kind === 'exam' && !q.source) W(qw, 'exam question without source');
      if (!Array.isArray(q.lo) || !q.lo.length) E(qw, 'lo missing');
      for (const id of q.lo || []) if (!(m.lo || []).includes(id)) E(qw, `LO ${id} is not declared by the page`);
      (q.lo || []).forEach(id => covered.add(id));
      if (q.bench && !q.figure) E(qw, 'a bench question needs a figure so it can be answered on its own in recap');
      const opts = q.options || [];
      if (opts.length !== 4) E(qw, `needs exactly 4 options (has ${opts.length})`);
      if (opts.filter(o => o.correct).length !== 1) E(qw, 'needs exactly one correct option');
      const table = q.layout === 'table';
      if (table && (!Array.isArray(q.cols) || q.cols.length < 2)) E(qw, 'table layout needs 2+ cols');
      opts.forEach((o, i) => {
        const ow = `${qw} option (${i + 1})`;
        if (table ? !(Array.isArray(o.text) && o.text.length === q.cols.length) : !(typeof o.text === 'string' && o.text.trim())) E(ow, 'text missing or wrong shape');
        if (!o.pick || !stripTags(o.pick).trim()) E(ow, 'pick (why a student would choose it) missing');
        if (!o.why || !stripTags(o.why).trim()) E(ow, 'why missing');
        if (o.correct && o.mis) E(ow, 'the correct option must not carry a misconception tag');
        if (!o.correct) {
          if (!o.mis) E(ow, 'wrong option needs a mis tag');
          else if (!tags[o.mis]) E(ow, `unknown mis tag ${o.mis}`);
          else (tagUse[o.mis] = tagUse[o.mis] || { all: new Set(), recap: new Set() }).all.add(q.id);
          if (o.mis && q.pool === 'recap' && tagUse[o.mis]) tagUse[o.mis].recap.add(q.id);
        }
      });
      const qText = stripTags([q.title, q.stem, q.figure, q.key, ...(q.hints || []), ...opts.flatMap(o => [].concat(o.text, o.pick, o.why, o.clash || []))].join(' '));
      for (const term of findTerms(qText)) E(qw, `excluded term "${term}" in a question`);
    }
    // answer positions: the whole page, and the questions shown together on the page
    const SPREAD = 'options are not shuffled, so spread the correct answers across (1)–(4)';
    for (const msg of answerSpread(pageQ)) W(w + '/questions.json', `${msg}; ${SPREAD}`);
    for (const msg of answerSpread(pageQ.filter(q => q.pool === 'page'), { checkUnused: false })) W(w + '/questions.json', `on-page questions: ${msg}; ${SPREAD}`);
    if (m.type === 'unit') {
      const core = topic.los.filter(l => /\.C\d+$/.test(l.id)).map(l => l.id);
      for (const id of core) if (!covered.has(id)) W(w, `unit check does not test ${id}`);
    }
  }

  for (const t of Object.values(tags)) {
    const u = tagUse[t.id];
    if (!u) { W(`tag ${t.id}`, 'not used by any question yet'); continue; }
    if (u.all.size < 3) W(`tag ${t.id}`, `only ${u.all.size} question(s); needs 3+ for spaced recap`);
    if (u.recap.size < 2) W(`tag ${t.id}`, `only ${u.recap.size} hidden recap variant(s); target 2+`);
  }
  return { errors, warnings, tagUse };
}

// stand-alone run
// (no top-level await: build.mjs imports this file, so awaiting it here would deadlock)
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  import('./build.mjs').then(({ loadProject }) => {
    const { errors, warnings } = lintAll(loadProject());
    warnings.forEach(x => console.log('warn  ' + x));
    errors.forEach(x => console.log('ERROR ' + x));
    console.log(`${errors.length} error(s), ${warnings.length} warning(s)`);
    process.exit(errors.length ? 1 : 0);
  });
}
