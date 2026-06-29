/* ═══════════════════════════════════════════
   OmniCalc Pro — script.js
   All converters + new calculators
   ═══════════════════════════════════════════ */

'use strict';

// ── COUNTRY / CURRENCY DATA ──────────────────
const countryList = {
  AED:"AE",AFN:"AF",XCD:"AG",ALL:"AL",AMD:"AM",ANG:"AN",AOA:"AO",ARS:"AR",AUD:"AU",AZN:"AZ",
  BAM:"BA",BBD:"BB",BDT:"BD",XOF:"BE",BGN:"BG",BHD:"BH",BIF:"BI",BMD:"BM",BND:"BN",BOB:"BO",
  BRL:"BR",BSD:"BS",BWP:"BW",BYR:"BY",BZD:"BZ",CAD:"CA",CDF:"CD",XAF:"CF",CHF:"CH",CLP:"CL",
  CNY:"CN",COP:"CO",CRC:"CR",CUP:"CU",CVE:"CV",CZK:"CZ",DJF:"DJ",DKK:"DK",DOP:"DO",DZD:"DZ",
  EGP:"EG",ETB:"ET",EUR:"FR",FJD:"FJ",FKP:"FK",GBP:"GB",GEL:"GE",GHS:"GH",GIP:"GI",GMD:"GM",
  GNF:"GN",GTQ:"GT",GYD:"GY",HKD:"HK",HNL:"HN",HRK:"HR",HTG:"HT",HUF:"HU",IDR:"ID",ILS:"IL",
  INR:"IN",IQD:"IQ",IRR:"IR",ISK:"IS",JMD:"JM",JOD:"JO",JPY:"JP",KES:"KE",KGS:"KG",KHR:"KH",
  KMF:"KM",KPW:"KP",KRW:"KR",KWD:"KW",KYD:"KY",KZT:"KZ",LAK:"LA",LBP:"LB",LKR:"LK",LRD:"LR",
  LSL:"LS",LYD:"LY",MAD:"MA",MDL:"MD",MGA:"MG",MKD:"MK",MMK:"MM",MNT:"MN",MOP:"MO",MUR:"MU",
  MVR:"MV",MWK:"MW",MXN:"MX",MYR:"MY",MZN:"MZ",NAD:"NA",NGN:"NG",NIO:"NI",NPR:"NP",NZD:"NZ",
  OMR:"OM",PAB:"PA",PEN:"PE",PGK:"PG",PHP:"PH",PKR:"PK",PLN:"PL",PYG:"PY",QAR:"QA",RON:"RO",
  RSD:"RS",RUB:"RU",RWF:"RW",SAR:"SA",SBD:"SB",SCR:"SC",SDG:"SD",SEK:"SE",SGD:"SG",SLL:"SL",
  SOS:"SO",SRD:"SR",SYP:"SY",SZL:"SZ",THB:"TH",TJS:"TJ",TMT:"TM",TND:"TN",TOP:"TO",TRY:"TR",
  TTD:"TT",TWD:"TW",TZS:"TZ",UAH:"UA",UGX:"UG",USD:"US",UYU:"UY",UZS:"UZ",VEF:"VE",VND:"VN",
  YER:"YE",ZAR:"ZA",ZMW:"ZM"
};
const currencyNames = {
  USD:"US Dollar",EUR:"Euro",GBP:"British Pound",JPY:"Japanese Yen",INR:"Indian Rupee",
  AUD:"Australian Dollar",CAD:"Canadian Dollar",CHF:"Swiss Franc",CNY:"Chinese Yuan",
  SEK:"Swedish Krona",NZD:"New Zealand Dollar",MXN:"Mexican Peso",SGD:"Singapore Dollar",
  HKD:"Hong Kong Dollar",NOK:"Norwegian Krone",KRW:"South Korean Won",TRY:"Turkish Lira",
  RUB:"Russian Ruble",BRL:"Brazilian Real",ZAR:"South African Rand",AED:"UAE Dirham",
  SAR:"Saudi Riyal",THB:"Thai Baht",MYR:"Malaysian Ringgit",PHP:"Philippine Peso",
  IDR:"Indonesian Rupiah",PKR:"Pakistani Rupee",BDT:"Bangladeshi Taka"
};

// ── TOOL REGISTRY ────────────────────────────
const TOOLS = {
  currency:     { title:"Currency Converter",  sub:"Live rates · 160+ currencies", icon:"fa-globe-americas", grad:"#2563EB,#818cf8" },
  length:       { title:"Length Converter",    sub:"Meter, km, mile, foot, inch…", icon:"fa-ruler-combined", grad:"#0891b2,#06b6d4" },
  area:         { title:"Area Converter",      sub:"Sq meter, acre, hectare…",     icon:"fa-vector-square",  grad:"#7c3aed,#9333ea" },
  volume:       { title:"Volume Converter",    sub:"Liter, gallon, ml, cup…",      icon:"fa-fill-drip",      grad:"#059669,#10b981" },
  weight:       { title:"Weight Converter",    sub:"Kg, pound, gram, ounce…",      icon:"fa-weight-hanging", grad:"#dc2626,#ef4444" },
  temperature:  { title:"Temperature",         sub:"Celsius · Fahrenheit · Kelvin",icon:"fa-thermometer-half",grad:"#d97706,#f59e0b"},
  numbersystem: { title:"Number System",       sub:"Decimal · Binary · Hex · Octal",icon:"fa-code",          grad:"#6366f1,#8b5cf6" },
  scientific:   { title:"Scientific Calculator",sub:"Full scientific + history",   icon:"fa-square-root-alt",grad:"#2563EB,#0891b2" },
  bmi:          { title:"BMI Calculator",      sub:"Body Mass Index + gauge",      icon:"fa-heartbeat",      grad:"#059669,#10b981" },
  age:          { title:"Age Calculator",      sub:"Exact years · months · days",  icon:"fa-birthday-cake",  grad:"#7c3aed,#8b5cf6" },
  emi:          { title:"EMI Calculator",      sub:"Monthly EMI + pie chart",      icon:"fa-landmark",       grad:"#d97706,#f59e0b" },
  gst:          { title:"GST Calculator",      sub:"Add / reverse GST",            icon:"fa-receipt",        grad:"#0891b2,#06b6d4" },
  percentage:   { title:"Percentage Calculator",sub:"%, increase, decrease",       icon:"fa-percent",        grad:"#db2777,#ec4899" },
  discount:     { title:"Discount Calculator", sub:"Savings & final price",        icon:"fa-tag",            grad:"#dc2626,#ef4444" },
};

const SEARCH_INDEX = [
  {key:"currency",    words:["currency","exchange","usd","inr","eur","money","forex"]},
  {key:"length",      words:["length","meter","km","mile","foot","inch","yard","distance"]},
  {key:"area",        words:["area","square","acre","hectare","foot","meter"]},
  {key:"volume",      words:["volume","liter","gallon","ml","cup","pint","liquid"]},
  {key:"weight",      words:["weight","mass","kg","pound","gram","ounce","tonne","stone"]},
  {key:"temperature", words:["temperature","celsius","fahrenheit","kelvin","rankine","heat","cold"]},
  {key:"numbersystem",words:["number","binary","decimal","hex","octal","base","bit"]},
  {key:"scientific",  words:["scientific","calculator","math","sin","cos","tan","log","sqrt","power"]},
  {key:"bmi",         words:["bmi","body","mass","index","weight","height","health","overweight"]},
  {key:"age",         words:["age","birthday","born","dob","years","months","days"]},
  {key:"emi",         words:["emi","loan","interest","mortgage","monthly","bank","finance"]},
  {key:"gst",         words:["gst","tax","vat","inclusive","exclusive","india"]},
  {key:"percentage",  words:["percentage","percent","increase","decrease","ratio","fraction"]},
  {key:"discount",    words:["discount","sale","savings","price","off","deal","coupon"]},
];

// ── STATE ────────────────────────────────────
let currentTool = null;
let globalHistory = JSON.parse(localStorage.getItem('omni_history') || '[]');
let emiChart = null;
// Scientific calculator state
let sciCurrent = '0', sciPrev = null, sciOp = null, sciNewNum = true, sciMem = 0;
let sciHistArr = [];

// ── INIT ─────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('pageLoader').classList.add('hidden');
    initReveal();
    animateCounters();
  }, 1600);
});

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSearch();
  initScrollProgress();
  initMouseGlow();
  initToolCards();
  initNotes();
  renderHistoryPanel();
});

// ── NAVBAR ───────────────────────────────────
function initNavbar() {
  const nb = document.getElementById('navbar');
  const ham = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nb.classList.toggle('scrolled', window.scrollY > 20);
    // active nav link
    document.querySelectorAll('.nav-link[href^="#"]').forEach(a => {
      const sec = document.querySelector(a.getAttribute('href'));
      if (sec) {
        const r = sec.getBoundingClientRect();
        a.classList.toggle('active', r.top <= 100 && r.bottom > 100);
      }
    });
  });

  ham.addEventListener('click', () => {
    links.classList.toggle('open');
    ham.innerHTML = links.classList.contains('open') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // smooth scroll + close mobile
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      ham.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

// ── SCROLL PROGRESS ──────────────────────────
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  });
}

// ── MOUSE GLOW ───────────────────────────────
function initMouseGlow() {
  const glow = document.getElementById('mouseGlow');
  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

// ── SEARCH ───────────────────────────────────
function initSearch() {
  const toggle = document.getElementById('searchToggle');
  const bar    = document.getElementById('searchBar');
  const input  = document.getElementById('globalSearch');
  const res    = document.getElementById('searchResults');

  toggle.addEventListener('click', () => {
    bar.classList.toggle('open');
    if (bar.classList.contains('open')) input.focus();
  });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    res.innerHTML = '';
    if (!q) return;
    const matches = SEARCH_INDEX.filter(t => t.words.some(w => w.includes(q)));
    matches.slice(0, 8).forEach(m => {
      const chip = document.createElement('div');
      chip.className = 'search-chip';
      chip.textContent = TOOLS[m.key].title;
      chip.addEventListener('click', () => { openModal(m.key); closeSearch(); });
      res.appendChild(chip);
    });
    if (!matches.length) res.innerHTML = '<div class="search-chip" style="opacity:.5">No results found</div>';
  });
}
function closeSearch() {
  document.getElementById('searchBar').classList.remove('open');
  document.getElementById('globalSearch').value = '';
  document.getElementById('searchResults').innerHTML = '';
}

// ── SCROLL REVEAL ────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal,.reveal-right,.reveal-grid').forEach(el => obs.observe(el));
}

// ── COUNTER ANIMATION ────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    let cur = 0; const step = Math.ceil(target / 40);
    const iv = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(iv);
    }, 35);
  });
}

// ── TOOL CARDS ───────────────────────────────
function initToolCards() {
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.tool));
  });
}

// ── MODAL ────────────────────────────────────
function openModal(toolKey) {
  currentTool = toolKey;
  const t = TOOLS[toolKey];
  document.getElementById('modalTitle').textContent = t.title;
  document.getElementById('modalSub').textContent   = t.sub;
  document.getElementById('modalIcon').style.background = `linear-gradient(135deg,${t.grad})`;
  document.getElementById('modalIcon').innerHTML = `<i class="fas ${t.icon}"></i>`;
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('toolModal').classList.add('open');
  document.body.style.overflow = 'hidden';

  const body = document.getElementById('modalBody');
  body.innerHTML = '';

  // Destroy old emi chart
  if (emiChart) { emiChart.destroy(); emiChart = null; }

  const renderers = {
    currency, length, area, volume, weight, temperature, numbersystem,
    scientific, bmi, age, emi, gst, percentage, discount
  };
  if (renderers[toolKey]) renderers[toolKey](body);
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('toolModal').classList.remove('open');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleSciKey);
}
window.closeModal = closeModal;

// ── HELPERS ──────────────────────────────────
function fmtN(n, d = 4) {
  if (isNaN(n)) return '—';
  return parseFloat(n.toFixed(d)).toString();
}
function fmtC(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function setResult(mainText, subText = '', rateText = '') {
  const el = document.getElementById('toolResult');
  if (!el) return;
  el.innerHTML = `
    <span class="result-main">${mainText}</span>
    ${subText ? `<span class="result-sub">${subText}</span>` : ''}
    ${rateText ? `<span class="result-rate">${rateText}</span>` : ''}`;
}
function makeSelect(id, opts, def) {
  const s = document.getElementById(id);
  opts.forEach(([v, l]) => { const o = new Option(l, v); s.add(o); });
  if (def) s.value = def;
}
function bindSlider(sliderId, inputId, dispId, cb) {
  const sl = document.getElementById(sliderId), inp = document.getElementById(inputId), disp = document.getElementById(dispId);
  if (!sl || !inp) return;
  sl.addEventListener('input', e => { inp.value = e.target.value; if (disp) disp.textContent = parseFloat(e.target.value).toFixed(2); cb && cb(); });
  inp.addEventListener('input', e => { const v = parseFloat(e.target.value) || 0; sl.value = v; if (disp) disp.textContent = v.toFixed ? v.toFixed(2) : v; cb && cb(); });
}
function showToast(msg, icon = 'fa-check-circle') {
  const t = document.getElementById('toast');
  t.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
window.showToast = showToast;

function addToHistory(label, result) {
  globalHistory.unshift({ label, result, time: new Date().toLocaleTimeString() });
  if (globalHistory.length > 50) globalHistory.pop();
  localStorage.setItem('omni_history', JSON.stringify(globalHistory));
  renderHistoryPanel();
}
function renderHistoryPanel() {
  const list = document.getElementById('historyList');
  if (!list) return;
  if (!globalHistory.length) { list.innerHTML = '<p class="empty-msg">No calculations yet. Start converting!</p>'; return; }
  list.innerHTML = globalHistory.slice(0, 20).map((h, i) => `
    <div class="history-item">
      <span>${h.label}</span>
      <span class="hi-res">${h.result}</span>
      <span class="hi-del" onclick="deleteHistory(${i})" title="Delete"><i class="fas fa-times"></i></span>
    </div>`).join('');
}
window.deleteHistory = i => { globalHistory.splice(i, 1); localStorage.setItem('omni_history', JSON.stringify(globalHistory)); renderHistoryPanel(); };
window.clearHistory  = () => { globalHistory = []; localStorage.removeItem('omni_history'); renderHistoryPanel(); };

function copyResult() {
  const el = document.querySelector('#toolResult .result-main, .sci-val, .bmi-score, .emi-stat span');
  const txt = el ? el.textContent.replace(/\u00A0/g,' ').trim() : '';
  if (txt) { navigator.clipboard.writeText(txt).then(() => showToast('Copied to clipboard!')); }
}
window.copyResult = copyResult;
function resetTool() { if (currentTool) openModal(currentTool); }
window.resetTool = resetTool;

// ── NOTES ────────────────────────────────────
function initNotes() {
  const ta = document.getElementById('notesArea');
  if (!ta) return;
  ta.value = localStorage.getItem('omni_notes') || '';
  ta.addEventListener('input', () => {
    localStorage.setItem('omni_notes', ta.value);
    const s = document.getElementById('notesSaved');
    if (s) { s.textContent = 'Saved ✓'; setTimeout(() => { s.textContent = ''; }, 2000); }
  });
}
window.saveNote = () => {
  const ta = document.getElementById('notesArea');
  localStorage.setItem('omni_notes', ta.value);
  showToast('Notes saved!');
};

/* ═══════════════════════════════════════════
   CONVERTERS
═══════════════════════════════════════════ */

// ── CURRENCY ─────────────────────────────────
async function currency(body) {
  const API = '99a0aec004527b1a155623da';
  body.innerHTML = `
  <div class="tool-form">
    <div class="slider-wrapper">
      <div class="slider-top">
        <label><i class="fas fa-coins"></i> Amount</label>
        <span class="slider-badge" id="cAmtDisp">1.00</span>
      </div>
      <input type="range" id="cSlider" min="0" max="10000" step="1" value="1">
      <input type="number" class="form-input" id="cAmt" value="1" step="any" style="margin-top:.7rem">
    </div>
    <div class="swap-row">
      <div class="form-group">
        <label class="form-label"><i class="fas fa-arrow-right-from-bracket"></i> From</label>
        <div class="flag-wrap">
          <img id="fromFlag" class="flag-img" src="https://flagsapi.com/US/flat/64.png">
          <select id="fromCurr"></select>
        </div>
      </div>
      <button class="swap-btn" id="cSwap" title="Swap"><i class="fas fa-right-left"></i></button>
      <div class="form-group">
        <label class="form-label"><i class="fas fa-arrow-right-to-bracket"></i> To</label>
        <div class="flag-wrap">
          <img id="toFlag" class="flag-img" src="https://flagsapi.com/IN/flat/64.png">
          <select id="toCurr"></select>
        </div>
      </div>
    </div>
    <div class="result-box" id="toolResult">
      <span class="result-main">—</span>
    </div>
    <div class="rate-badge" id="rateHint"><span class="live-dot"></span> Connecting to live rates…</div>
    <button class="btn-convert" id="cBtn"><i class="fas fa-sync-alt"></i> Convert Now</button>
  </div>`;

  const currs = Object.keys(countryList).sort();
  const fromSel = document.getElementById('fromCurr'), toSel = document.getElementById('toCurr');
  currs.forEach(c => {
    const label = `${c}${currencyNames[c] ? ' — ' + currencyNames[c] : ''}`;
    fromSel.add(new Option(label, c)); toSel.add(new Option(label, c));
  });
  fromSel.value = 'USD'; toSel.value = 'INR';
  updateFlag('fromCurr','fromFlag'); updateFlag('toCurr','toFlag');

  bindSlider('cSlider','cAmt','cAmtDisp', doConvert);
  fromSel.addEventListener('change', () => { updateFlag('fromCurr','fromFlag'); doConvert(); });
  toSel.addEventListener('change',   () => { updateFlag('toCurr','toFlag'); doConvert(); });
  document.getElementById('cBtn').addEventListener('click', doConvert);
  document.getElementById('cSwap').addEventListener('click', () => {
    const tmp = fromSel.value; fromSel.value = toSel.value; toSel.value = tmp;
    updateFlag('fromCurr','fromFlag'); updateFlag('toCurr','toFlag'); doConvert();
  });

  async function doConvert() {
    const amt = parseFloat(document.getElementById('cAmt').value) || 0;
    const from = fromSel.value, to = toSel.value;
    setResult(`<span class="spinner"></span>`, 'Fetching rate…');
    try {
      const r = await fetch(`https://v6.exchangerate-api.com/v6/${API}/latest/${from}`);
      const d = await r.json();
      if (d.result === 'success') {
        const rate = d.conversion_rates[to], res = (amt * rate).toFixed(2);
        setResult(fmtC(res) + ' ' + to, `${fmtC(amt)} ${from}`, `1 ${from} = ${rate.toFixed(4)} ${to}`);
        document.getElementById('rateHint').innerHTML = `<span class="live-dot"></span> 1 ${from} = <strong>${rate.toFixed(4)}</strong> ${to} &nbsp;·&nbsp; 1 ${to} = <strong>${(1/rate).toFixed(4)}</strong> ${from}`;
        addToHistory(`${fmtC(amt)} ${from} → ${to}`, fmtC(res) + ' ' + to);
      } else throw new Error();
    } catch {
      setResult('⚠ Rate unavailable', 'Check your connection');
      document.getElementById('rateHint').innerHTML = `<i class="fas fa-exclamation-triangle"></i> Could not fetch live rate`;
    }
  }
  doConvert();
}
function updateFlag(selId, imgId) {
  const s = document.getElementById(selId), i = document.getElementById(imgId);
  if (s && i && countryList[s.value]) i.src = `https://flagsapi.com/${countryList[s.value]}/flat/64.png`;
}

// ── GENERIC UNIT CONVERTER ────────────────────
function makeUnitConverter(body, cfg) {
  body.innerHTML = `
  <div class="tool-form">
    <div class="slider-wrapper">
      <div class="slider-top">
        <label>${cfg.icon} Value</label>
        <span class="slider-badge" id="uDisp">1.00</span>
      </div>
      <input type="range" id="uSlider" min="${cfg.min||0}" max="${cfg.max||1000}" step="${cfg.step||1}" value="1">
      <input type="number" class="form-input" id="uVal" value="1" step="any" style="margin-top:.7rem">
    </div>
    <div class="swap-row">
      <div class="form-group">
        <label class="form-label">From</label>
        <select class="form-input" id="uFrom"></select>
      </div>
      <button class="swap-btn" id="uSwap"><i class="fas fa-right-left"></i></button>
      <div class="form-group">
        <label class="form-label">To</label>
        <select class="form-input" id="uTo"></select>
      </div>
    </div>
    <div class="result-box" id="toolResult"><span class="result-main">—</span></div>
    ${cfg.allConv ? `<div class="all-conv-grid" id="allConvGrid"></div>` : ''}
    <button class="btn-convert" id="uBtn"><i class="fas fa-arrows-left-right"></i> Convert</button>
  </div>`;

  makeSelect('uFrom', cfg.opts, cfg.defFrom);
  makeSelect('uTo',   cfg.opts, cfg.defTo);
  bindSlider('uSlider','uVal','uDisp', go);
  document.getElementById('uFrom').addEventListener('change', go);
  document.getElementById('uTo').addEventListener('change', go);
  document.getElementById('uBtn').addEventListener('click', go);
  document.getElementById('uSwap').addEventListener('click', () => {
    const f = document.getElementById('uFrom'), t = document.getElementById('uTo');
    const tmp = f.value; f.value = t.value; t.value = tmp; go();
  });

  function go() {
    const v = parseFloat(document.getElementById('uVal').value) || 0;
    const f = document.getElementById('uFrom').value;
    const t = document.getElementById('uTo').value;
    const base = cfg.toBase(v, f);
    const res  = cfg.fromBase(base, t);
    setResult(`${fmtN(res, 6)} ${t}`, `${v} ${f}`);
    addToHistory(`${v} ${f} → ${t}`, fmtN(res, 6) + ' ' + t);
    if (cfg.allConv) {
      const grid = document.getElementById('allConvGrid');
      if (grid) {
        grid.innerHTML = cfg.opts.map(([u, l]) => {
          const r = cfg.fromBase(base, u);
          return `<div class="conv-item${u===t?' highlight':''}">
            <label>${l.split(' ')[0]}</label>
            <span>${fmtN(r,6)}</span>
          </div>`;
        }).join('');
      }
    }
  }
  go();
}

function length(body) {
  const u = { meter:1, km:1000, cm:.01, mm:.001, foot:.3048, inch:.0254, mile:1609.34, yard:.9144, nm:1852 };
  const opts = [['meter','Meter (m)'],['km','Kilometer (km)'],['cm','Centimeter (cm)'],['mm','Millimeter (mm)'],['foot','Foot (ft)'],['inch','Inch (in)'],['mile','Mile (mi)'],['yard','Yard (yd)'],['nm','Nautical Mile']];
  makeUnitConverter(body, { icon:'📏', opts, defFrom:'meter', defTo:'km', allConv:true, max:10000,
    toBase:(v,f)=>v*u[f], fromBase:(b,t)=>b/u[t] });
}
function area(body) {
  const u = { sq_meter:1, sq_km:1e6, sq_foot:.092903, acre:4046.86, hectare:10000, sq_yard:.836127, sq_inch:.00064516 };
  const opts = [['sq_meter','Sq Meter'],['sq_km','Sq Kilometer'],['sq_foot','Sq Foot'],['sq_yard','Sq Yard'],['sq_inch','Sq Inch'],['acre','Acre'],['hectare','Hectare']];
  makeUnitConverter(body, { icon:'📐', opts, defFrom:'sq_meter', defTo:'acre', allConv:true, max:10000,
    toBase:(v,f)=>v*u[f], fromBase:(b,t)=>b/u[t] });
}
function volume(body) {
  const u = { liter:1, ml:.001, gallon:3.78541, cubic_meter:1000, cup:.236588, pint:.473176, quart:.946353, tbsp:.0147868, tsp:.00492892 };
  const opts = [['liter','Liter (L)'],['ml','Milliliter (mL)'],['gallon','Gallon (US)'],['cubic_meter','Cubic Meter'],['cup','Cup'],['pint','Pint'],['quart','Quart'],['tbsp','Tablespoon'],['tsp','Teaspoon']];
  makeUnitConverter(body, { icon:'💧', opts, defFrom:'liter', defTo:'gallon', allConv:true, max:1000,
    toBase:(v,f)=>v*u[f], fromBase:(b,t)=>b/u[t] });
}
function weight(body) {
  const u = { kg:1, gram:.001, lb:.453592, ounce:.0283495, tonne:1000, mg:0.000001, stone:6.35029 };
  const opts = [['kg','Kilogram (kg)'],['gram','Gram (g)'],['lb','Pound (lb)'],['ounce','Ounce (oz)'],['tonne','Metric Tonne'],['mg','Milligram (mg)'],['stone','Stone (st)']];
  makeUnitConverter(body, { icon:'⚖️', opts, defFrom:'kg', defTo:'lb', allConv:true, max:500,
    toBase:(v,f)=>v*u[f], fromBase:(b,t)=>b/u[t] });
}

// ── TEMPERATURE ───────────────────────────────
function temperature(body) {
  body.innerHTML = `
  <div class="tool-form">
    <div class="slider-wrapper">
      <div class="slider-top"><label>🌡️ Value</label><span class="slider-badge" id="tDisp">0</span></div>
      <input type="range" id="tSlider" min="-100" max="200" step="1" value="0">
      <input type="number" class="form-input" id="tVal" value="0" step="any" style="margin-top:.7rem">
    </div>
    <div class="swap-row">
      <div class="form-group"><label class="form-label">From</label>
        <select class="form-input" id="tFrom">
          <option value="C">Celsius (°C)</option><option value="F">Fahrenheit (°F)</option>
          <option value="K">Kelvin (K)</option><option value="R">Rankine (°R)</option>
        </select>
      </div>
      <button class="swap-btn" id="tSwap"><i class="fas fa-right-left"></i></button>
      <div class="form-group"><label class="form-label">To</label>
        <select class="form-input" id="tTo">
          <option value="C">Celsius (°C)</option><option value="F">Fahrenheit (°F)</option>
          <option value="K">Kelvin (K)</option><option value="R">Rankine (°R)</option>
        </select>
      </div>
    </div>
    <div class="result-box" id="toolResult"><span class="result-main">—</span></div>
    <div class="all-conv-grid">
      <div class="conv-item"><label>→ Celsius</label><span id="t_c">—</span></div>
      <div class="conv-item"><label>→ Fahrenheit</label><span id="t_f">—</span></div>
      <div class="conv-item"><label>→ Kelvin</label><span id="t_k">—</span></div>
      <div class="conv-item highlight"><label>→ Rankine</label><span id="t_r">—</span></div>
    </div>
    <button class="btn-convert" id="tBtn"><i class="fas fa-temperature-high"></i> Convert</button>
  </div>`;

  document.getElementById('tFrom').value = 'C';
  document.getElementById('tTo').value   = 'F';
  bindSlider('tSlider','tVal','tDisp', go);
  document.getElementById('tFrom').addEventListener('change', go);
  document.getElementById('tTo').addEventListener('change', go);
  document.getElementById('tBtn').addEventListener('click', go);
  document.getElementById('tSwap').addEventListener('click', () => {
    const f = document.getElementById('tFrom'), t = document.getElementById('tTo');
    const tmp = f.value; f.value = t.value; t.value = tmp; go();
  });

  function toC(v, fr) { if(fr==='C')return v; if(fr==='F')return(v-32)*5/9; if(fr==='K')return v-273.15; return(v-491.67)*5/9; }
  function frC(c, to) { if(to==='C')return c; if(to==='F')return c*9/5+32; if(to==='K')return c+273.15; return(c+273.15)*9/5; }
  function go() {
    const v = parseFloat(document.getElementById('tVal').value) || 0;
    const fr = document.getElementById('tFrom').value, to = document.getElementById('tTo').value;
    const c = toC(v, fr), res = frC(c, to);
    setResult(`${fmtN(res,2)}°${to}`, `${v}°${fr}`);
    document.getElementById('t_c').textContent = fmtN(c,2)+'°C';
    document.getElementById('t_f').textContent = fmtN(frC(c,'F'),2)+'°F';
    document.getElementById('t_k').textContent = fmtN(frC(c,'K'),2)+' K';
    document.getElementById('t_r').textContent = fmtN(frC(c,'R'),2)+'°R';
    addToHistory(`${v}°${fr} → °${to}`, fmtN(res,2)+'°'+to);
  }
  go();
}

// ── NUMBER SYSTEM ─────────────────────────────
function numbersystem(body) {
  body.innerHTML = `
  <div class="tool-form">
    <div class="form-group">
      <label class="form-label"><i class="fas fa-keyboard"></i> Input Number</label>
      <input type="text" class="form-input" id="nsInput" placeholder="e.g. 42, 101010, FF, 52">
    </div>
    <div class="form-group">
      <label class="form-label"><i class="fas fa-code-branch"></i> Input Base</label>
      <select class="form-input" id="nsFrom">
        <option value="10">Decimal (Base 10)</option>
        <option value="2">Binary (Base 2)</option>
        <option value="8">Octal (Base 8)</option>
        <option value="16">Hexadecimal (Base 16)</option>
      </select>
    </div>
    <div class="all-conv-grid">
      <div class="conv-item highlight"><label>Decimal (10)</label><span id="ns_d">—</span></div>
      <div class="conv-item"><label>Binary (2)</label><span id="ns_b">—</span></div>
      <div class="conv-item"><label>Octal (8)</label><span id="ns_o">—</span></div>
      <div class="conv-item"><label>Hexadecimal (16)</label><span id="ns_h">—</span></div>
    </div>
    <button class="btn-convert" id="nsBtn"><i class="fas fa-exchange-alt"></i> Convert All Bases</button>
  </div>`;

  function go() {
    const v = document.getElementById('nsInput').value.trim().toUpperCase();
    const base = parseInt(document.getElementById('nsFrom').value);
    try {
      const dec = parseInt(v, base); if (isNaN(dec)) throw new Error();
      document.getElementById('ns_d').textContent = dec.toString(10);
      document.getElementById('ns_b').textContent = dec.toString(2);
      document.getElementById('ns_o').textContent = dec.toString(8);
      document.getElementById('ns_h').textContent = dec.toString(16).toUpperCase();
      addToHistory(`${v} (base ${base})`, dec.toString(10)+' decimal');
    } catch { ['ns_d','ns_b','ns_o','ns_h'].forEach(id => { document.getElementById(id).textContent = 'Invalid'; }); }
  }
  document.getElementById('nsBtn').addEventListener('click', go);
  document.getElementById('nsInput').addEventListener('input', go);
  document.getElementById('nsFrom').addEventListener('change', go);
}

/* ═══════════════════════════════════════════
   CALCULATORS
═══════════════════════════════════════════ */

// ── SCIENTIFIC CALC ───────────────────────────
function scientific(body) {
  // Reset state
  sciCurrent = '0'; sciPrev = null; sciOp = null; sciNewNum = true;

  body.innerHTML = `
  <div>
    <div class="sci-display">
      <div class="sci-expr" id="sciExpr"></div>
      <div class="sci-val" id="sciVal">0</div>
    </div>
    <div class="sci-mode-row">
      <button class="sci-mode-btn active" id="modeB" onclick="sciSetMode('basic')">Basic</button>
      <button class="sci-mode-btn" id="modeS" onclick="sciSetMode('sci')">Scientific</button>
    </div>
    <div class="mem-row">
      <button class="cb mem-f" onclick="sciMemC()">MC</button>
      <button class="cb mem-f" onclick="sciMemR()">MR</button>
      <button class="cb mem-f" onclick="sciMemAdd()">M+</button>
      <button class="cb mem-f" onclick="sciMemSub()">M−</button>
      <button class="cb mem-f" onclick="sciMemS()">MS</button>
    </div>
    <div class="sci-row" id="sciRow" style="display:none">
      <button class="cb sci-f" onclick="sciF('sin')">sin</button>
      <button class="cb sci-f" onclick="sciF('cos')">cos</button>
      <button class="cb sci-f" onclick="sciF('tan')">tan</button>
      <button class="cb sci-f" onclick="sciF('log')">log</button>
      <button class="cb sci-f" onclick="sciF('ln')">ln</button>
      <button class="cb sci-f" onclick="sciF('sqrt')">√x</button>
      <button class="cb sci-f" onclick="sciF('sq')">x²</button>
      <button class="cb sci-f" onclick="sciF('inv')">1/x</button>
      <button class="cb sci-f" onclick="sciF('pi')">π</button>
      <button class="cb sci-f" onclick="sciF('e')">e</button>
      <button class="cb sci-f" onclick="sciF('pow')">xʸ</button>
      <button class="cb sci-f" onclick="sciF('abs')">|x|</button>
    </div>
    <div class="calc-grid">
      <button class="cb clr" onclick="sciClear()">AC</button>
      <button class="cb fn" onclick="sciSign()">+/−</button>
      <button class="cb fn" onclick="sciPct()">%</button>
      <button class="cb op" onclick="sciOper('/')">÷</button>
      <button class="cb num" onclick="sciNum('7')">7</button>
      <button class="cb num" onclick="sciNum('8')">8</button>
      <button class="cb num" onclick="sciNum('9')">9</button>
      <button class="cb op" onclick="sciOper('*')">×</button>
      <button class="cb num" onclick="sciNum('4')">4</button>
      <button class="cb num" onclick="sciNum('5')">5</button>
      <button class="cb num" onclick="sciNum('6')">6</button>
      <button class="cb op" onclick="sciOper('-')">−</button>
      <button class="cb num" onclick="sciNum('1')">1</button>
      <button class="cb num" onclick="sciNum('2')">2</button>
      <button class="cb num" onclick="sciNum('3')">3</button>
      <button class="cb op" onclick="sciOper('+')">+</button>
      <button class="cb num zero" onclick="sciNum('0')">0</button>
      <button class="cb num" onclick="sciDot()">.</button>
      <button class="cb eq" onclick="sciEq()">=</button>
    </div>
    <div style="margin-top:1rem">
      <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:1px;color:var(--ink-4);font-weight:700;margin-bottom:.5rem;padding-bottom:.5rem;border-bottom:1px solid var(--line)">History</div>
      <div class="calc-hist-list" id="sciHistList"></div>
    </div>
  </div>`;

  document.addEventListener('keydown', handleSciKey);
  sciSetMode('basic');
  renderSciHistory();
}

function sciSetMode(mode) {
  const row = document.getElementById('sciRow');
  if (row) row.style.display = mode === 'sci' ? 'grid' : 'none';
  document.getElementById('modeB')?.classList.toggle('active', mode === 'basic');
  document.getElementById('modeS')?.classList.toggle('active', mode === 'sci');
}
window.sciSetMode = sciSetMode;

function sciUpdateDisplay() {
  const el = document.getElementById('sciVal'); if (!el) return;
  el.textContent = sciCurrent;
  el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse');
}
function sciUpdateExpr(t) { const e = document.getElementById('sciExpr'); if (e) e.textContent = t || ''; }

function sciNum(n) {
  if (sciNewNum) { sciCurrent = n === '.' ? '0.' : n; sciNewNum = false; }
  else { if (sciCurrent === '0' && n !== '.') sciCurrent = n; else sciCurrent += n; }
  sciUpdateDisplay();
}
function sciDot() {
  if (sciNewNum) { sciCurrent = '0.'; sciNewNum = false; }
  else if (!sciCurrent.includes('.')) sciCurrent += '.';
  sciUpdateDisplay();
}
function sciOper(op) {
  if (sciPrev !== null && !sciNewNum) sciCalc();
  sciPrev = parseFloat(sciCurrent); sciOp = op; sciNewNum = true;
  const labels = { '+':'+', '-':'−', '*':'×', '/':'÷' };
  sciUpdateExpr(`${sciPrev} ${labels[op] || op}`);
}
function sciCalc() {
  const a = sciPrev, b = parseFloat(sciCurrent); let res;
  if (sciOp === '+') res = a + b;
  else if (sciOp === '-') res = a - b;
  else if (sciOp === '*') res = a * b;
  else if (sciOp === '/') res = b === 0 ? 'Error' : a / b;
  else if (sciOp === '^') res = Math.pow(a, b);
  else res = b;
  const expr = `${a} ${({'+':'+','-':'−','*':'×','/':'÷','^':'^'}[sciOp]||sciOp)} ${b} =`;
  const resStr = res === 'Error' ? 'Error' : parseFloat(res.toFixed(10)).toString();
  sciHistArr.unshift({ expr, res: resStr });
  if (sciHistArr.length > 10) sciHistArr.pop();
  addToHistory(expr, resStr);
  renderSciHistory();
  sciCurrent = resStr; sciPrev = null; sciOp = null; sciNewNum = true;
}
function sciEq() { if (sciPrev !== null && sciOp) { sciCalc(); sciUpdateDisplay(); sciUpdateExpr(''); } }
function sciClear() { sciCurrent = '0'; sciPrev = null; sciOp = null; sciNewNum = true; sciUpdateDisplay(); sciUpdateExpr(''); }
function sciSign() { sciCurrent = (parseFloat(sciCurrent) * -1).toString(); sciUpdateDisplay(); }
function sciPct() { sciCurrent = (parseFloat(sciCurrent) / 100).toString(); sciUpdateDisplay(); }
function sciF(fn) {
  const v = parseFloat(sciCurrent); let res;
  switch(fn) {
    case 'sin': res = Math.sin(v * Math.PI / 180); break;
    case 'cos': res = Math.cos(v * Math.PI / 180); break;
    case 'tan': res = Math.tan(v * Math.PI / 180); break;
    case 'log': res = Math.log10(v); break;
    case 'ln':  res = Math.log(v); break;
    case 'sqrt': res = Math.sqrt(v); break;
    case 'sq':  res = v * v; break;
    case 'inv': res = v === 0 ? 'NaN' : 1 / v; break;
    case 'pi':  sciCurrent = Math.PI.toString(); sciUpdateDisplay(); return;
    case 'e':   sciCurrent = Math.E.toString(); sciUpdateDisplay(); return;
    case 'pow': sciOper('^'); return;
    case 'abs': res = Math.abs(v); break;
    default: return;
  }
  const r = isNaN(res) ? 'Error' : parseFloat(res.toFixed(10)).toString();
  sciHistArr.unshift({ expr: `${fn}(${v})`, res: r });
  if (sciHistArr.length > 10) sciHistArr.pop();
  addToHistory(`${fn}(${v})`, r);
  renderSciHistory();
  sciCurrent = r; sciNewNum = true; sciUpdateDisplay();
}
function renderSciHistory() {
  const list = document.getElementById('sciHistList'); if (!list) return;
  if (!sciHistArr.length) { list.innerHTML = '<div style="font-size:.78rem;color:var(--ink-4);text-align:center;padding:.5rem">No history yet</div>'; return; }
  list.innerHTML = sciHistArr.map(h => `
    <div class="calc-hist-item" onclick="sciRecall('${h.res}')">
      <span>${h.expr}</span><span class="chr">${h.res}</span>
    </div>`).join('');
}
window.sciRecall = (v) => { sciCurrent = v; sciNewNum = false; sciUpdateDisplay(); showToast('Value recalled', 'fa-history'); };
function sciMemC() { sciMem = 0; showToast('Memory cleared', 'fa-memory'); }
function sciMemR() { sciCurrent = sciMem.toString(); sciNewNum = false; sciUpdateDisplay(); }
function sciMemAdd() { sciMem += parseFloat(sciCurrent) || 0; showToast(`M+ = ${sciMem}`, 'fa-memory'); }
function sciMemSub() { sciMem -= parseFloat(sciCurrent) || 0; showToast(`M− = ${sciMem}`, 'fa-memory'); }
function sciMemS() { sciMem = parseFloat(sciCurrent) || 0; showToast(`Stored ${sciMem}`, 'fa-memory'); }
window.sciNum = sciNum; window.sciDot = sciDot; window.sciOper = sciOper; window.sciEq = sciEq;
window.sciClear = sciClear; window.sciSign = sciSign; window.sciPct = sciPct; window.sciF = sciF;
window.sciMemC = sciMemC; window.sciMemR = sciMemR; window.sciMemAdd = sciMemAdd; window.sciMemSub = sciMemSub; window.sciMemS = sciMemS;

function handleSciKey(e) {
  if (!document.getElementById('sciVal')) return;
  if (e.key >= '0' && e.key <= '9') sciNum(e.key);
  else if (e.key === '.') sciDot();
  else if (e.key === '+') sciOper('+');
  else if (e.key === '-') sciOper('-');
  else if (e.key === '*') sciOper('*');
  else if (e.key === '/') { e.preventDefault(); sciOper('/'); }
  else if (e.key === 'Enter' || e.key === '=') sciEq();
  else if (e.key === 'Escape') sciClear();
  else if (e.key === 'Backspace') { sciCurrent = sciCurrent.length > 1 ? sciCurrent.slice(0,-1) : '0'; sciUpdateDisplay(); }
}

// ── BMI CALCULATOR ────────────────────────────
function bmi(body) {
  body.innerHTML = `
  <div class="tool-form">
    <div class="form-row">
      <div class="form-group">
        <label class="form-label"><i class="fas fa-ruler-vertical"></i> Height (cm)</label>
        <input type="number" class="form-input" id="bmiH" placeholder="e.g. 170" min="50" max="250">
      </div>
      <div class="form-group">
        <label class="form-label"><i class="fas fa-weight"></i> Weight (kg)</label>
        <input type="number" class="form-input" id="bmiW" placeholder="e.g. 70" min="10" max="300">
      </div>
    </div>
    <div class="bmi-gauge-wrap">
      <svg class="bmi-gauge-svg" viewBox="0 0 200 120">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#60a5fa"/>
            <stop offset="33%" style="stop-color:#4ade80"/>
            <stop offset="66%" style="stop-color:#facc15"/>
            <stop offset="100%" style="stop-color:#ef4444"/>
          </linearGradient>
        </defs>
        <path d="M20,100 A80,80,0,0,1,180,100" fill="none" stroke="#e2e8f0" stroke-width="14" stroke-linecap="round"/>
        <path id="gaugeArc" d="M20,100 A80,80,0,0,1,180,100" fill="none" stroke="url(#gaugeGrad)" stroke-width="14" stroke-linecap="round" stroke-dasharray="0 251"/>
        <circle id="gaugeNeedle" cx="100" cy="100" r="6" fill="#1e293b"/>
      </svg>
      <div class="bmi-gauge-text">
        <span class="bmi-score" id="bmiScore">—</span>
        <span class="bmi-cat" id="bmiCat" style="background:var(--blue-50);color:var(--blue-700)"></span>
      </div>
    </div>
    <div class="bmi-cats">
      <div class="bmi-cat-item" id="bcat0">Underweight<br><small>&lt;18.5</small></div>
      <div class="bmi-cat-item" id="bcat1">Normal<br><small>18.5–24.9</small></div>
      <div class="bmi-cat-item" id="bcat2">Overweight<br><small>25–29.9</small></div>
      <div class="bmi-cat-item" id="bcat3">Obese<br><small>≥30</small></div>
    </div>
    <button class="btn-convert" id="bmiBtn"><i class="fas fa-heartbeat"></i> Calculate BMI</button>
  </div>`;

  document.getElementById('bmiBtn').addEventListener('click', () => {
    const h = parseFloat(document.getElementById('bmiH').value);
    const w = parseFloat(document.getElementById('bmiW').value);
    if (!h || !w) { showToast('Enter height and weight', 'fa-exclamation-circle'); return; }
    const bmiVal = w / ((h/100)**2);
    const score = bmiVal.toFixed(1);
    document.getElementById('bmiScore').textContent = score;

    let cat, catIdx, color;
    if (bmiVal < 18.5)      { cat = 'Underweight'; catIdx = 0; color = '#60a5fa'; }
    else if (bmiVal < 25)   { cat = 'Normal Weight'; catIdx = 1; color = '#4ade80'; }
    else if (bmiVal < 30)   { cat = 'Overweight'; catIdx = 2; color = '#facc15'; }
    else                     { cat = 'Obese'; catIdx = 3; color = '#ef4444'; }

    const catEl = document.getElementById('bmiCat');
    catEl.textContent = cat;
    catEl.style.background = color + '22';
    catEl.style.color = color;

    // Gauge arc animation
    const pct = Math.min((bmiVal / 40), 1);
    const arc = document.getElementById('gaugeArc');
    const total = 251;
    arc.setAttribute('stroke-dasharray', `${pct * total} ${total}`);

    // Needle
    const angle = -180 + pct * 180;
    const rad = (angle * Math.PI) / 180;
    const nx = 100 + 75 * Math.cos(rad);
    const ny = 100 + 75 * Math.sin(rad);
    document.getElementById('gaugeNeedle').setAttribute('cx', nx);
    document.getElementById('gaugeNeedle').setAttribute('cy', ny);

    // Highlight category
    [0,1,2,3].forEach(i => document.getElementById('bcat'+i).classList.remove('active'));
    document.getElementById('bcat'+catIdx).classList.add('active');
    addToHistory(`BMI (${h}cm, ${w}kg)`, score + ' — ' + cat);
  });

  // Auto calc on input
  ['bmiH','bmiW'].forEach(id => {
    document.getElementById(id).addEventListener('keypress', e => { if(e.key==='Enter') document.getElementById('bmiBtn').click(); });
  });
}

// ── AGE CALCULATOR ────────────────────────────
function age(body) {
  body.innerHTML = `
  <div class="tool-form">
    <div class="form-group">
      <label class="form-label"><i class="fas fa-calendar-alt"></i> Date of Birth</label>
      <input type="date" class="form-input" id="dobInput">
    </div>
    <div class="form-group">
      <label class="form-label"><i class="fas fa-calendar-check"></i> Calculate Age On</label>
      <input type="date" class="form-input" id="ageRef">
    </div>
    <div class="result-box" id="toolResult"><span class="result-main">—</span></div>
    <div class="all-conv-grid" id="ageDetails"></div>
    <button class="btn-convert" id="ageBtn"><i class="fas fa-birthday-cake"></i> Calculate Age</button>
  </div>`;

  // Default ref date = today
  const today = new Date(); const todayStr = today.toISOString().split('T')[0];
  document.getElementById('ageRef').value = todayStr;

  document.getElementById('ageBtn').addEventListener('click', () => {
    const dobStr  = document.getElementById('dobInput').value;
    const refStr  = document.getElementById('ageRef').value;
    if (!dobStr) { showToast('Enter date of birth', 'fa-exclamation-circle'); return; }
    const dob = new Date(dobStr), ref = new Date(refStr);
    if (dob > ref) { setResult('—', 'DOB cannot be in the future!'); return; }

    let years = ref.getFullYear() - dob.getFullYear();
    let months = ref.getMonth() - dob.getMonth();
    let days = ref.getDate() - dob.getDate();
    if (days < 0) { months--; days += new Date(ref.getFullYear(), ref.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((ref - dob) / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    setResult(`${years} years, ${months} months`, `${days} days remaining this month`);
    document.getElementById('ageDetails').innerHTML = `
      <div class="conv-item highlight"><label>Years</label><span>${years}</span></div>
      <div class="conv-item"><label>Months</label><span>${totalMonths}</span></div>
      <div class="conv-item"><label>Weeks</label><span>${totalWeeks}</span></div>
      <div class="conv-item"><label>Days</label><span>${totalDays.toLocaleString()}</span></div>`;
    addToHistory(`Age from ${dobStr}`, `${years}y ${months}m ${days}d`);
  });
}

// ── EMI CALCULATOR ────────────────────────────
function emi(body) {
  body.innerHTML = `
  <div class="tool-form">
    <div class="form-group">
      <label class="form-label"><i class="fas fa-rupee-sign"></i> Loan Amount (₹)</label>
      <input type="number" class="form-input" id="emiAmt" value="500000" min="1">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label"><i class="fas fa-percent"></i> Interest Rate (% p.a.)</label>
        <input type="number" class="form-input" id="emiRate" value="8.5" step="0.1" min="0.1">
      </div>
      <div class="form-group">
        <label class="form-label"><i class="fas fa-clock"></i> Tenure (months)</label>
        <input type="number" class="form-input" id="emiTenure" value="60" min="1" max="360">
      </div>
    </div>
    <div class="emi-breakdown" id="emiResult" style="display:none">
      <div class="emi-stat"><span id="emiMonthly">—</span><small>Monthly EMI</small></div>
      <div class="emi-stat"><span id="emiInterest">—</span><small>Total Interest</small></div>
      <div class="emi-stat"><span id="emiTotal">—</span><small>Total Payment</small></div>
    </div>
    <div class="emi-chart-wrap"><canvas id="emiChart"></canvas></div>
    <button class="btn-convert" id="emiBtn"><i class="fas fa-calculator"></i> Calculate EMI</button>
  </div>`;

  document.getElementById('emiBtn').addEventListener('click', () => {
    const P = parseFloat(document.getElementById('emiAmt').value)   || 0;
    const r = (parseFloat(document.getElementById('emiRate').value) || 0) / 12 / 100;
    const n = parseInt(document.getElementById('emiTenure').value)  || 1;
    if (!P || !r) { showToast('Enter valid values', 'fa-exclamation-circle'); return; }

    const emiVal = P * r * Math.pow(1+r,n) / (Math.pow(1+r,n) - 1);
    const totalAmt  = emiVal * n;
    const totalInt  = totalAmt - P;

    document.getElementById('emiResult').style.display = 'grid';
    document.getElementById('emiMonthly').textContent  = '₹' + fmtC(Math.round(emiVal));
    document.getElementById('emiInterest').textContent = '₹' + fmtC(Math.round(totalInt));
    document.getElementById('emiTotal').textContent    = '₹' + fmtC(Math.round(totalAmt));

    if (emiChart) { emiChart.destroy(); emiChart = null; }
    const ctx = document.getElementById('emiChart').getContext('2d');
    emiChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Principal', 'Interest'],
        datasets: [{ data: [Math.round(P), Math.round(totalInt)],
          backgroundColor: ['#2563EB','#818cf8'], borderWidth: 0, hoverOffset: 6 }]
      },
      options: {
        responsive: true, cutout: '70%',
        plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12 } } }
      }
    });
    addToHistory(`EMI ₹${fmtC(Math.round(P))} @ ${document.getElementById('emiRate').value}%`, '₹'+fmtC(Math.round(emiVal))+'/mo');
  });
}

// ── GST CALCULATOR ────────────────────────────
function gst(body) {
  body.innerHTML = `
  <div class="tool-form">
    <div class="form-row">
      <div class="form-group">
        <label class="form-label"><i class="fas fa-rupee-sign"></i> Amount (₹)</label>
        <input type="number" class="form-input" id="gstAmt" value="1000" min="0">
      </div>
      <div class="form-group">
        <label class="form-label"><i class="fas fa-percent"></i> GST Rate (%)</label>
        <select class="form-input" id="gstRate">
          <option value="5">5%</option><option value="12">12%</option>
          <option value="18" selected>18%</option><option value="28">28%</option>
          <option value="custom">Custom</option>
        </select>
      </div>
    </div>
    <div class="form-group" id="customGstWrap" style="display:none">
      <label class="form-label">Custom GST %</label>
      <input type="number" class="form-input" id="gstCustom" placeholder="Enter custom rate" min="0" max="100">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label"><i class="fas fa-toggle-on"></i> Mode</label>
        <select class="form-input" id="gstMode">
          <option value="exclusive">Exclusive (Add GST)</option>
          <option value="inclusive">Inclusive (Remove GST)</option>
        </select>
      </div>
    </div>
    <div class="result-box" id="toolResult"><span class="result-main">—</span></div>
    <div class="all-conv-grid" id="gstDetails"></div>
    <button class="btn-convert" id="gstBtn"><i class="fas fa-receipt"></i> Calculate GST</button>
  </div>`;

  document.getElementById('gstRate').addEventListener('change', function() {
    document.getElementById('customGstWrap').style.display = this.value === 'custom' ? 'flex' : 'none';
  });

  document.getElementById('gstBtn').addEventListener('click', () => {
    const amt  = parseFloat(document.getElementById('gstAmt').value) || 0;
    const rateEl = document.getElementById('gstRate').value;
    const rate = rateEl === 'custom' ? parseFloat(document.getElementById('gstCustom').value)||0 : parseFloat(rateEl);
    const mode = document.getElementById('gstMode').value;

    let gstAmt, baseAmt, finalAmt;
    if (mode === 'exclusive') {
      baseAmt = amt; gstAmt = amt * rate / 100; finalAmt = amt + gstAmt;
      setResult('₹' + fmtC(finalAmt.toFixed(2)), `Base: ₹${fmtC(baseAmt)} + GST: ₹${fmtC(gstAmt.toFixed(2))}`);
    } else {
      finalAmt = amt; baseAmt = amt / (1 + rate/100); gstAmt = finalAmt - baseAmt;
      setResult('₹' + fmtC(baseAmt.toFixed(2)), `Original before GST · Total was ₹${fmtC(amt)}`);
    }
    document.getElementById('gstDetails').innerHTML = `
      <div class="conv-item"><label>Base Amount</label><span>₹${fmtC(baseAmt.toFixed(2))}</span></div>
      <div class="conv-item"><label>GST (${rate}%)</label><span>₹${fmtC(gstAmt.toFixed(2))}</span></div>
      <div class="conv-item highlight"><label>CGST (${rate/2}%)</label><span>₹${fmtC((gstAmt/2).toFixed(2))}</span></div>
      <div class="conv-item highlight"><label>SGST (${rate/2}%)</label><span>₹${fmtC((gstAmt/2).toFixed(2))}</span></div>`;
    addToHistory(`GST ${rate}% on ₹${fmtC(amt)}`, '₹'+fmtC(gstAmt.toFixed(2)));
  });
}

// ── PERCENTAGE CALCULATOR ─────────────────────
function percentage(body) {
  body.innerHTML = `
  <div class="tool-form">
    <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--ink-4);margin-bottom:.25rem">What is X% of Y?</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Percentage (%)</label>
        <input type="number" class="form-input" id="pPct" placeholder="e.g. 25" step="any">
      </div>
      <div class="form-group">
        <label class="form-label">Of Number</label>
        <input type="number" class="form-input" id="pNum" placeholder="e.g. 200" step="any">
      </div>
    </div>
    <button class="btn-convert" id="pOf" style="margin-bottom:1rem"><i class="fas fa-equals"></i> Calculate</button>
    <div class="result-box" id="toolResult"><span class="result-main">—</span></div>

    <div style="margin:1.5rem 0;border-top:1px solid var(--line);padding-top:1.5rem">
      <div style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--ink-4);margin-bottom:.75rem">% Change (Increase / Decrease)</div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">From</label><input type="number" class="form-input" id="pFrom" placeholder="Original" step="any"></div>
        <div class="form-group"><label class="form-label">To</label><input type="number" class="form-input" id="pTo" placeholder="New value" step="any"></div>
      </div>
      <button class="btn-convert" id="pChange"><i class="fas fa-chart-line"></i> % Change</button>
      <div class="result-box" id="pChangeResult" style="margin-top:1rem"><span class="result-main">—</span></div>
    </div>
  </div>`;

  document.getElementById('pOf').addEventListener('click', () => {
    const pct = parseFloat(document.getElementById('pPct').value), num = parseFloat(document.getElementById('pNum').value);
    if (isNaN(pct) || isNaN(num)) { showToast('Enter valid numbers', 'fa-exclamation-circle'); return; }
    const res = (pct / 100) * num;
    setResult(fmtN(res, 4), `${pct}% of ${num}`);
    addToHistory(`${pct}% of ${num}`, fmtN(res,4));
  });

  document.getElementById('pChange').addEventListener('click', () => {
    const from = parseFloat(document.getElementById('pFrom').value), to = parseFloat(document.getElementById('pTo').value);
    if (isNaN(from) || isNaN(to) || from === 0) { showToast('Enter valid values', 'fa-exclamation-circle'); return; }
    const chg = ((to - from) / Math.abs(from)) * 100;
    const dir = chg >= 0 ? '▲ Increase' : '▼ Decrease';
    const el = document.getElementById('pChangeResult');
    el.innerHTML = `<span class="result-main" style="color:${chg>=0?'#4ade80':'#f87171'}">${dir} ${Math.abs(chg).toFixed(2)}%</span><span class="result-sub">${from} → ${to}</span>`;
    addToHistory(`% change ${from} → ${to}`, dir+' '+Math.abs(chg).toFixed(2)+'%');
  });
}

// ── DISCOUNT CALCULATOR ───────────────────────
function discount(body) {
  body.innerHTML = `
  <div class="tool-form">
    <div class="form-group">
      <label class="form-label"><i class="fas fa-tag"></i> Original Price (₹)</label>
      <input type="number" class="form-input" id="dPrice" placeholder="e.g. 2999" step="any">
    </div>
    <div class="form-group">
      <label class="form-label"><i class="fas fa-percent"></i> Discount (%)</label>
      <input type="number" class="form-input" id="dPct" placeholder="e.g. 20" step="any" min="0" max="100">
    </div>
    <div class="result-box" id="toolResult"><span class="result-main">—</span></div>
    <div class="all-conv-grid" id="discResult"></div>
    <button class="btn-convert" id="dBtn"><i class="fas fa-tag"></i> Calculate Savings</button>
  </div>`;

  function calc() {
    const price = parseFloat(document.getElementById('dPrice').value);
    const pct   = parseFloat(document.getElementById('dPct').value);
    if (isNaN(price) || isNaN(pct)) return;
    const savings  = price * pct / 100;
    const final    = price - savings;
    setResult('₹' + fmtC(final.toFixed(2)), `You save ₹${fmtC(savings.toFixed(2))} (${pct}% off)`);
    document.getElementById('discResult').innerHTML = `
      <div class="conv-item"><label>Original Price</label><span>₹${fmtC(price.toFixed(2))}</span></div>
      <div class="conv-item"><label>Discount (${pct}%)</label><span>−₹${fmtC(savings.toFixed(2))}</span></div>
      <div class="conv-item highlight"><label>Final Price</label><span>₹${fmtC(final.toFixed(2))}</span></div>
      <div class="conv-item highlight"><label>You Save</label><span>₹${fmtC(savings.toFixed(2))}</span></div>`;
    addToHistory(`${pct}% off ₹${fmtC(price)}`, '₹'+fmtC(final.toFixed(2)));
  }
  document.getElementById('dBtn').addEventListener('click', calc);
  ['dPrice','dPct'].forEach(id => { document.getElementById(id).addEventListener('input', calc); });
}