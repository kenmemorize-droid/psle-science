// PSLE Science build — node tools/build.mjs [--page <id>] [--force]
// Reads src/, lints, writes self-contained pages into the theme folders,
// regenerates index.html (hub) and assets/_theme.css. No dependencies.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { lintAll } from './lint.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const rel = p => path.relative(ROOT, p).replace(/\\/g, '/');
const rd = p => fs.readFileSync(p, 'utf8');
const opt = p => (fs.existsSync(p) ? rd(p) : '');
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
function json(p) {
  try { return JSON.parse(rd(p)); } catch (e) { throw new Error(`Bad JSON in ${rel(p)}: ${e.message}`); }
}
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const scriptSafe = s => String(s).replace(/<\/(script)/gi, '<\\/$1');
const jsonSafe = o => JSON.stringify(o).replace(/</g, '\\u003c');
const fill = (tpl, map) => tpl.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (k in map ? map[k] : m));

export function loadProject() {
  const syllabus = json(path.join(SRC, 'syllabus.json'));
  const registry = json(path.join(SRC, 'misconceptions.json'));
  const legacy = json(path.join(SRC, 'legacy-sketchnotes.json'));
  const pages = [];
  const pdir = path.join(SRC, 'pages');
  for (const folder of fs.readdirSync(pdir).sort()) {
    const fdir = path.join(pdir, folder);
    if (!fs.statSync(fdir).isDirectory()) continue;
    for (const id of fs.readdirSync(fdir).sort()) {
      const dir = path.join(fdir, id);
      if (!fs.statSync(dir).isDirectory() || !fs.existsSync(path.join(dir, 'meta.json'))) continue;
      pages.push({
        meta: json(path.join(dir, 'meta.json')), dir, folder, src: rel(dir),
        body: opt(path.join(dir, 'body.html')), js: opt(path.join(dir, 'page.js')), css: opt(path.join(dir, 'page.css')),
        questions: fs.existsSync(path.join(dir, 'questions.json')) ? json(path.join(dir, 'questions.json')) : []
      });
    }
  }
  return { ROOT, syllabus, registry, legacy, pages };
}

function toolsHTML() {
  return '<div class="ph-tools">' +
    '<details class="look"><summary class="tbtn">Look</summary><div class="look-menu" role="group" aria-label="Colour theme">' +
    '<button type="button" data-set-theme="notebook">Notebook</button><button type="button" data-set-theme="lab">Lab</button>' +
    '<button type="button" data-set-theme="mission">Mission</button></div></details>' +
    '<button type="button" class="tbtn" data-ps="export">Export</button>' +
    '<button type="button" class="tbtn" data-ps="import">Import</button>' +
    '<input type="file" accept="application/json,.json" data-ps="file" hidden></div>';
}

function build() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const only = args.includes('--page') ? args[args.indexOf('--page') + 1] : null;
  const ctx = loadProject();
  const { syllabus, registry, legacy, pages } = ctx;

  // ---- lint first ----
  const { errors, warnings, tagUse } = lintAll(ctx);
  warnings.forEach(w => console.log('warn  ' + w));
  if (errors.length) {
    errors.forEach(e => console.log('ERROR ' + e));
    console.log(`\nBuild stopped: ${errors.length} error(s).`);
    process.exit(1);
  }

  const engine = {
    css: rd(path.join(SRC, 'engine/theme.css')), core: rd(path.join(SRC, 'engine/core.js')),
    q: rd(path.join(SRC, 'engine/question.js')), shell: rd(path.join(SRC, 'engine/shell.html'))
  };
  const vendors = { scene3d: () => rd(path.join(SRC, 'vendor/three.r149.min.js')) };
  const widgetDir = path.join(SRC, 'engine/widgets');
  const widget = name => {
    const f = path.join(widgetDir, name + '.js');
    return fs.existsSync(f) ? rd(f) : null;
  };

  const manifestFile = path.join(ROOT, 'tools', '.manifest.json');
  const manifest = fs.existsSync(manifestFile) ? json(manifestFile) : {};
  const written = [];
  function out(file, content) {
    const r = rel(file);
    if (fs.existsSync(file) && !force) {
      const cur = sha(rd(file));
      if (!manifest[r]) throw new Error(`${r} exists but was not made by the build. Move it away or rerun with --force.`);
      if (manifest[r] !== cur) throw new Error(`${r} was edited by hand since the last build. Move the change into src/, or rerun with --force to overwrite it.`);
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
    manifest[r] = sha(content);
    written.push({ r, bytes: Buffer.byteLength(content) });
  }

  const today = new Date().toISOString().slice(0, 10);
  const loIndex = {};
  for (const [code, t] of Object.entries(syllabus.topics)) for (const lo of t.los) loIndex[lo.id] = lo;
  const regMap = Object.fromEntries((registry.tags || []).map(t => [t.id, t]));
  const href = p => `${syllabus.themes[syllabus.topics[p.meta.topic].theme].folder}/${p.meta.id}.html`;

  // ---- navigation chains ----
  const byTopic = {};
  for (const p of pages) (byTopic[p.meta.topic] = byTopic[p.meta.topic] || []).push(p);
  for (const list of Object.values(byTopic))
    list.sort((a, b) => (b.meta.type === 'unit') - (a.meta.type === 'unit') || a.meta.order - b.meta.order || a.meta.id.localeCompare(b.meta.id));
  const unitsByTheme = {};
  for (const p of pages.filter(p => p.meta.type === 'unit')) (unitsByTheme[p.meta.theme] = unitsByTheme[p.meta.theme] || []).push(p);
  for (const list of Object.values(unitsByTheme)) list.sort((a, b) => syllabus.topics[a.meta.topic].order - syllabus.topics[b.meta.topic].order);
  function neighbours(p) {
    const list = p.meta.type === 'unit' ? unitsByTheme[p.meta.theme] : byTopic[p.meta.topic];
    const i = list.indexOf(p);
    return { prev: list[i - 1] || null, next: list[i + 1] || null };
  }

  function header(p) {
    const m = p.meta, topic = syllabus.topics[m.topic], theme = syllabus.themes[topic.theme];
    const los = m.lo.map(id => {
      const lo = loIndex[id];
      return `<li><span class="lo-id">${esc(id)}</span>${esc(lo.text)}${lo.points ? `<div class="lo-pts">${lo.points.map(esc).join(' · ')}</div>` : ''}</li>`;
    }).join('');
    return `<header class="ph"><div class="wrap">
<div class="ph-top"><a class="ph-hub" href="../index.html">&#8592; Hub</a>${toolsHTML()}</div>
<p class="ph-meta">${esc(theme.name)} · ${esc(topic.name)} · ${esc(topic.level)}${m.type === 'unit' ? ' · Unit' : ''}</p>
<h1>${esc(m.title)}</h1>
<p class="ph-sub">${m.purpose}</p>
<details class="ph-lo" open><summary>Syllabus learning outcomes on this page (${m.lo.length})</summary><ul>${los}</ul></details>
</div></header>`;
  }
  function footer(p) {
    const { prev, next } = neighbours(p);
    return `<nav class="pf wrap" aria-label="More pages">` +
      (prev ? `<a class="btn" href="${prev.meta.id}.html">&#8592; ${esc(prev.meta.title)}</a>` : '<span></span>') +
      `<span class="gap"></span><a class="btn" href="../index.html">Hub</a><span class="gap"></span>` +
      (next ? `<a class="btn" href="${next.meta.id}.html">${esc(next.meta.title)} &#8594;</a>` : '<span></span>') + `</nav>`;
  }
  function misFor(qs) {
    const o = {};
    for (const q of qs) for (const op of q.options) if (op.mis && regMap[op.mis]) {
      const t = regMap[op.mis]; o[op.mis] = { label: t.label, fix: t.fix, learn: t.learn };
    }
    return o;
  }

  // ---- pages ----
  const targets = only ? pages.filter(p => p.meta.id === only) : pages;
  if (only && !targets.length) { console.log(`No page with id ${only}`); process.exit(1); }
  for (const p of targets) {
    const m = p.meta, topic = syllabus.topics[m.topic];
    const uses = m.uses || [];
    const scripts = [];
    if (uses.includes('scene3d')) scripts.push(vendors.scene3d());
    scripts.push(engine.core, engine.q);
    for (const u of uses) { if (u === 'scene3d') continue; const w = widget(u); if (w) scripts.push(w); }
    if (p.js) scripts.push(p.js);
    const pageQs = p.questions.filter(q => q.pool === 'page').map(q => ({ ...q, page: m.id }));
    const data = {
      page: { id: m.id, title: m.title, type: m.type, level: m.level, topic: m.topic, theme: m.theme, lo: m.lo },
      hub: '../index.html', built: today, questions: pageQs, mis: misFor(pageQs)
    };
    if (m.type === 'unit') data.deeper = (byTopic[m.topic] || []).filter(x => x.meta.type === 'focus').map(x => ({
      id: x.meta.id, title: x.meta.title, fixes: x.meta.fixes, href: `${x.meta.id}.html`,
      qs: x.questions.filter(q => q.pool === 'page').map(q => q.id)
    }));
    const html = fill(engine.shell, {
      SRC: p.src, TITLE: esc(`${m.title} · ${m.level} ${topic.short} · PSLE Science`),
      THEME_CSS: engine.css, PAGE_CSS: p.css ? `<style>\n${p.css}\n</style>` : '',
      BODY_CLASS: `page-${m.type}`, HEADER: header(p), BODY: p.body, FOOTER: footer(p),
      DATA: jsonSafe(data), SCRIPTS: scripts.map(s => `<script>\n${scriptSafe(s)}\n</script>`).join('\n')
    });
    out(path.join(ROOT, href(p)), html);
    const size = Buffer.byteLength(html);
    if (size > 1024 * 1024 && !uses.includes('scene3d')) console.log(`warn  ${href(p)}: ${(size / 1048576).toFixed(2)} MB without scene3d`);
  }

  // ---- hub ----
  const allQ = [];
  for (const p of pages) for (const q of p.questions) {
    const { bench, pageIntro, hints, showFigureOnPage, ...rest } = q;
    allQ.push({ ...rest, page: p.meta.id });
  }
  const needVariants = Object.values(registry.tags || []).filter(t => {
    const u = tagUse[t.id]; return !u || u.all.size < 3 || u.recap.size < 2;
  }).map(t => t.id);
  const hubData = {
    hub: true, built: today, hubPath: '',
    themes: syllabus.themes,
    topics: Object.fromEntries(Object.entries(syllabus.topics).map(([k, t]) => [k, {
      name: t.name, short: t.short, level: t.level, theme: t.theme, slug: t.slug, order: t.order,
      los: t.los.map(l => ({ id: l.id, text: l.text }))
    }])),
    catalogue: pages.map(p => ({
      id: p.meta.id, type: p.meta.type, title: p.meta.title, purpose: p.meta.purpose, fixes: p.meta.fixes,
      level: p.meta.level, topic: p.meta.topic, theme: p.meta.theme, lo: p.meta.lo, origin: p.meta.origin,
      built: p.meta.built, updated: p.meta.updated || p.meta.built, order: p.meta.order, href: href(p),
      qs: p.questions.filter(q => q.pool === 'page').map(q => q.id)
    })),
    questions: allQ,
    mis: Object.fromEntries((registry.tags || []).map(t => [t.id, { label: t.label, fix: t.fix, learn: t.learn, topic: t.topic, lo: t.lo }])),
    legacy, needVariants
  };
  const hubBody = rd(path.join(SRC, 'hub/body.html'));
  const hubCss = rd(path.join(SRC, 'hub/hub.css'));
  const hubJs = rd(path.join(SRC, 'hub/hub.js'));
  const hubHeader = `<header class="ph"><div class="wrap">
<div class="ph-top"><span class="ph-meta" style="margin:0">PSLE Science · Primary 3 to 6 · Standard</span>${toolsHTML()}</div>
<h1>PSLE Science</h1>
<p class="ph-sub">Interactive pages built on the MOE Primary Science Syllabus (2023). Each one shows the idea first, then checks it with questions. Wrong first answers come back later as recap questions.</p>
<nav class="hub-tabs" role="tablist" aria-label="Sections" id="hubTabs"></nav>
</div></header>`;
  const hubHtml = fill(engine.shell, {
    SRC: 'src/hub', TITLE: 'PSLE Science · hub', THEME_CSS: engine.css, PAGE_CSS: `<style>\n${hubCss}\n</style>`,
    BODY_CLASS: 'page-hub', HEADER: hubHeader, BODY: hubBody,
    FOOTER: `<footer class="pf wrap"><span>Built ${today}. Progress is saved in this browser. Use Export to keep a copy or move it to another device; Import adds a file's answers to what is already here.</span></footer>`,
    DATA: jsonSafe(hubData),
    SCRIPTS: [engine.core, engine.q, hubJs].map(s => `<script>\n${scriptSafe(s)}\n</script>`).join('\n')
  });
  out(path.join(ROOT, 'index.html'), hubHtml);
  out(path.join(ROOT, 'assets/_theme.css'), `/* Reference copy of src/engine/theme.css, generated ${today}. Every page inlines it; edit the source. */\n${engine.css}`);

  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 1));

  // stale built files
  for (const theme of Object.values(syllabus.themes)) {
    const dir = path.join(ROOT, theme.folder);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) if (f.endsWith('.html') && !pages.some(p => href(p) === `${theme.folder}/${f}`))
      console.log(`warn  ${theme.folder}/${f} has no source in src/pages (stale?)`);
  }
  written.forEach(w => console.log(`wrote ${w.r} (${(w.bytes / 1024).toFixed(0)} KB)`));
  console.log(`\nBuild OK: ${targets.length} page(s) + hub. ${warnings.length} warning(s).`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try { build(); } catch (e) { console.log('ERROR ' + e.message); process.exit(1); }
}
