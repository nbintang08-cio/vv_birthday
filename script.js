/* ====== PENGATURAN — ubah di sini ====== */
const NAMA = 'Vivi Fitriah';
const KODE = '061127';          // kode rahasia 6 digit
/* ======================================= */

const $ = id => document.getElementById(id);
document.getElementById('nm').textContent = NAMA;
document.getElementById('lockTitle').textContent = 'Untuk ' + NAMA + ',';
document.title = 'Selamat Ulang Tahun, ' + NAMA + ' 🌸';

/* Loading → kode */
setTimeout(() => {
  $('loader').classList.add('fade');
  $('lock').classList.remove('hidden');
  setTimeout(() => $('loader').remove(), 800);
}, 2600);

/* Keypad */
let input = '';
for (let i = 0; i < KODE.length; i++) $('dots').appendChild(document.createElement('span'));
['1', '2', '3', '4', '5', '6', '7', '8', '9', '×', '0', '↵'].forEach(k => {
  const b = document.createElement('button');
  b.textContent = k;
  if (k === '↵') b.className = 'go';
  b.setAttribute('aria-label', k === '×' ? 'Hapus' : k === '↵' ? 'Masuk' : k);
  b.onclick = () => tekan(k);
  $('pad').appendChild(b);
});
addEventListener('keydown', e => {
  if ($('lock').classList.contains('hidden') || $('lock').classList.contains('fade')) return;
  if (/^\d$/.test(e.key)) tekan(e.key);
  else if (e.key === 'Backspace') tekan('×');
  else if (e.key === 'Enter') tekan('↵');
});
function render() {
  [...$('dots').children].forEach((d, i) => d.classList.toggle('on', i < input.length));
}
function tekan(k) {
  $('err').textContent = '';
  if (k === '×') input = input.slice(0, -1);
  else if (k === '↵') cek();
  else if (input.length < KODE.length) { input += k; if (input.length === KODE.length) setTimeout(cek, 200); }
  render();
}
function cek() {
  if (input === KODE) {
    $('lock').classList.add('fade');
    $('giftStage').classList.remove('hidden');
    setTimeout(() => $('lock').remove(), 800);
  } else {
    $('err').textContent = 'Kodenya salah, coba lagi!!';
    $('dots').classList.add('shake');
    setTimeout(() => $('dots').classList.remove('shake'), 400);
    input = ''; render();
  }
}

/* Hadiah → utama */
$('gift').onclick = () => {
  $('gift').classList.add('open');
  setTimeout(() => {
    $('giftStage').classList.add('fade');
    $('main').classList.remove('hidden');
    $('musik').classList.remove('hidden');
    document.body.classList.remove('locked');
    konfeti(120);
    setTimeout(() => $('giftStage').remove(), 800);
    new IntersectionObserver((en, ob) => en.forEach(x => {
      if (x.isIntersecting) { $('letter').classList.remove('pending'); ob.disconnect(); }
    }), { threshold: .2 }).observe($('letter'));
  }, 800);
};

/* Kelopak */
const warna = ['#ef6f8e', '#ff9fc0', '#4a6fd8', '#ffd400', '#f48fb1'];
for (let i = 0; i < 16; i++) {
  const p = document.createElement('div');
  const s = 12 + Math.random() * 22;
  p.className = 'petal';
  p.style.cssText = `left:${Math.random() * 100}%;width:${s}px;height:${s}px;--dx:${(Math.random() - .5) * 160}px;
    background:radial-gradient(circle,${warna[i % warna.length]} 40%,rgba(0,0,0,.25));
    animation-duration:${10 + Math.random() * 12}s;animation-delay:${-Math.random() * 20}s`;
  $('petals').appendChild(p);
}

/* Lilin */
const lilin = [...document.querySelectorAll('.candle')];
lilin.forEach(l => l.onclick = () => {
  l.classList.add('off');
  const sisa = lilin.filter(x => !x.classList.contains('off')).length;
  if (sisa === 0) {
    $('tip').textContent = 'Semoga semua apa yang kamu mau terkabul';
    $('wish').textContent = 'Make a wish, ' + NAMA + '...';
    konfeti(200);
  } else $('tip').textContent = 'Sisa ' + sisa + ' lilin lagi!';
});

/* Konfeti */
const cv = $('fx'), cx = cv.getContext('2d');
let ps = [], raf = null;
function ukur() { cv.width = innerWidth; cv.height = innerHeight }
addEventListener('resize', ukur); ukur();
function konfeti(n) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < n; i++) ps.push({
    x: cv.width / 2, y: cv.height * .5, vx: (Math.random() - .5) * 15, vy: -Math.random() * 15 - 2,
    w: 5 + Math.random() * 6, h: 4 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - .5) * .4,
    c: warna[Math.floor(Math.random() * warna.length)]
  });
  if (!raf) raf = requestAnimationFrame(loop);
}
function loop() {
  cx.clearRect(0, 0, cv.width, cv.height);
  ps.forEach(p => {
    p.vy += .35; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.r += p.vr;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r);
    cx.fillStyle = p.c; cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); cx.restore();
  });
  ps = ps.filter(p => p.y < cv.height + 20);
  if (ps.length) raf = requestAnimationFrame(loop);
  else { raf = null; cx.clearRect(0, 0, cv.width, cv.height); }
}

/* Musik (melodi sederhana dibuat dengan WebAudio, tanpa file audio) */
let ac, timer, main = false;
const nada = [[392, .5], [392, .25], [440, .75], [392, .75], [523, .75], [494, 1.5],
[392, .5], [392, .25], [440, .75], [392, .75], [587, .75], [523, 1.5]];
function mainkan() {
  ac = ac || new (window.AudioContext || window.webkitAudioContext)();
  let t = ac.currentTime + .1;
  nada.forEach(([f, d]) => {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(.18, t + .04);
    g.gain.exponentialRampToValueAtTime(.001, t + d * .9);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d);
    t += d * .8;
  });
  timer = setTimeout(mainkan, (t - ac.currentTime + 1) * 1000);
}
function toggleMelodi() {
  main = !main;
  $('musik').classList.toggle('play', main);
  if (main) mainkan(); else { clearTimeout(timer); ac && ac.close(); ac = null; }
}
$('musik').onclick = () => { if (au.paused) au.play().catch(toggleMelodi); else au.pause(); };

/* ====== DATA — ganti sesuai kebutuhan ====== */
const BUNGA = [  // [emoji, left, top, stemX, stemY, pesan]
  ['🌷', 22, 142, 50, 200, 'Semoga apa yang kamu inginkan juga kamu dapatkan.'],
  ['🌹', 82, 62, 110, 120, 'Sembilan belas tahun, satu bab baru. Semoga halaman-halamannya penuh tawa, doa yang terkabul, dan orang-orang yang tulus.'],
  ['🌻', 132, 27, 160, 85, 'Kamu matahariku — selalu membuatku mencari arah cahaya.'],
  ['💐', 182, 62, 210, 120, 'Semoga semua hal baik datang memelukmu tahun ini.'],
  ['🌺', 242, 142, 270, 200, 'Usia boleh bertambah, tapi semoga rasa syukur dan semangatmu ikut bertambah juga.']
];
const MEMORI = [  // taruh foto di folder foto/
  { src: 'foto/1.jpg', t: 'Ulang  tahun ke-18', q: 'iya tau udah 18 tahun, jadi biasa aja weh.' },
  { src: 'foto/2.jpg', t: 'Pas mau ke alun-alun', q: 'foto-foto ngga jelas pake hp aku, mana ngga bilang.' },
  { src: 'foto/3.jpg', t: 'ngga tau ini pas kapan', q: 'ciluk baaaaa.' },
  { src: 'foto/4.jpg', t: 'Mau otw jajan', q: 'sama ini juga foto ngga jelas, tiba-tiba udah ada di galery weh.' },
  { src: 'foto/5.jpg', t: 'Di Warjo', q: 'pas nemenin aku nugas.' },
  { src: 'foto/6.jpg', t: 'OTW Kerja', q: 'katanya lagi hujan jadi pake jas ujan, ngga tau bener ngga tau ngga juga.' }
];
const LAGU = [    // taruh file lagu di folder music/
  { t: 'Monokrom', a: 'Tulus', src: 'music/monokrom.mp3' },
  { t: 'Kamu Adalah Perempuan Paling Cantik di Negeri Indonesia', a: 'Dewa 19', src: 'music/perempuan-paling-cantik.mp3' },
  { t: 'Teh Hijau', a: 'Tulus', src:'music/Teh-Hijau.mp3'},
  { t: 'Cincin', a: 'Hindia', src:'music/Cincin.mp3'},
  { t: 'Everything U Are', a: 'Hindia', src:'music/everything-u-are.mp3'},
  { t: 'Berdansalah, Karir Ini Tak Ada Gunanya', a: 'Hindia', src:'music/Berdansalah-Karir-Ini-Tak-Ada-Artinya.mp3'},
  { t: 'Hujan', a: 'Utopia', src:'music/Hujan.mp3'},
  { t: 'Serena', a: 'For Revenge', src:'music/Serana.mp3'},
  { t: 'Titik Nadir', a: 'Kahitna', src:'music/Titik-Nadir.mp3'},
  { t: 'Satu Bulan', a: 'Bernadya', src:'music/Satu-Bulan.mp3'},
  { t: 'Kota Ini Tak Sama Tanpa Mu', a: 'Nadhif', src:'music/kota-ini -tak-sama-tanpamu.mp3'},
  { t: 'Dua Sejoli', a: 'Dewa1 19', src:'music/Dua-Sejoli.mp3'},
  { t: 'Sefaruh Nafas', a: 'Dewa 19', src:'music/Separuh-Nafas.mp3'}
];
/* ============================================ */

const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Efek: percikan cahaya */
function burst(x, y, n = 14) {
  if (rm) return;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div'), a = Math.random() * 6.28, d = 30 + Math.random() * 60;
    s.className = 'sp';
    s.style.cssText = `left:${x}px;top:${y}px;--x:${Math.cos(a) * d}px;--y:${Math.sin(a) * d}px`;
    document.body.appendChild(s); setTimeout(() => s.remove(), 900);
  }
}

/* Buket */
const NS = 'http://www.w3.org/2000/svg';
BUNGA.forEach(([e, l, t, sx, sy, msg]) => {
  const ln = document.createElementNS(NS, 'line');
  ln.setAttribute('x1', 160); ln.setAttribute('y1', 262); ln.setAttribute('x2', sx); ln.setAttribute('y2', sy);
  $('stems').appendChild(ln);
  const b = document.createElement('button');
  b.className = 'fl'; b.textContent = e; b.style.cssText = `left:${l}px;top:${t}px`;
  b.setAttribute('aria-label', 'Bunga ' + e);
  b.onclick = ev => {
    document.querySelectorAll('.fl').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    $('bqmsg').style.opacity = 0;
    setTimeout(() => { $('bqmsg').textContent = msg; $('bqmsg').style.opacity = 1; }, 250);
    burst(ev.clientX, ev.clientY, 18);
  };
  $('bq').appendChild(b);
});

/* Foto */
MEMORI.forEach(m => {
  const c = document.createElement('div');
  c.className = 'pol'; c.tabIndex = 0;
  c.innerHTML = `<div class="cover"><span>📷</span>Ketuk untuk mengungkap</div>
    <div class="ph">🌸<img src="${m.src}" alt="${m.t}" onerror="this.remove()"></div>
    <h4>${m.t}</h4><q>“${m.q}”</q>`;
  const buka = ev => {
    if (c.classList.contains('open')) return;
    c.classList.add('open');
    const r = c.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 26);
    konfeti(40);
  };
  c.onclick = buka;
  c.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); buka(); } };
  /* Efek: kartu miring mengikuti kursor */
  c.addEventListener('pointermove', e => {
    if (rm || e.pointerType === 'touch') return;
    const r = c.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.03)`;
  });
  c.addEventListener('pointerleave', () => c.style.transform = '');
  $('grid').appendChild(c);
});

/* Playlist */
const au = new Audio(); let idx = 0;
const fmt = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';
LAGU.forEach((l, i) => {
  const b = document.createElement('button');
  b.className = 'tr';
  b.innerHTML = `<span>${i + 1}</span><div><b>${l.t}</b><small>${l.a}</small></div>`;
  b.onclick = () => muat(i, true);
  $('list').appendChild(b);
});
function muat(i, putar) {
  idx = (i + LAGU.length) % LAGU.length;
  const l = LAGU[idx];
  au.src = l.src;
  $('tt').textContent = l.t; $('ta').textContent = l.a; $('pnote').textContent = '';
  $('seek').value = 0; $('cur').textContent = '0:00';
  [...$('list').children].forEach((x, k) => x.classList.toggle('on', k === idx));
  if (putar) au.play().catch(() => { });
}
au.onloadedmetadata = () => { $('seek').max = au.duration; $('dur').textContent = fmt(au.duration); };
au.ontimeupdate = () => { $('seek').value = au.currentTime; $('cur').textContent = fmt(au.currentTime); };
au.onplay = () => { $('vinyl').classList.add('spin'); $('pp').textContent = '❚❚'; $('musik').classList.add('play'); };
au.onpause = () => { $('vinyl').classList.remove('spin'); $('pp').textContent = '▶'; $('musik').classList.remove('play'); };
au.onended = () => muat(idx + 1, true);
au.onerror = () => { $('pnote').textContent = 'File lagu belum ditemukan. Taruh file di folder music/ sesuai daftar LAGU.'; };
$('seek').oninput = () => { au.currentTime = $('seek').value; };
$('pp').onclick = () => { if (au.paused) au.play().catch(() => { }); else au.pause(); };
$('prev').onclick = () => muat(idx - 1, !au.paused);
$('next').onclick = () => muat(idx + 1, !au.paused);
muat(0, false);

/* Efek: muncul saat di-scroll */
const io = new IntersectionObserver(en => en.forEach(x => {
  if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
}), { threshold: .15 });
document.querySelectorAll('.rv').forEach(el => io.observe(el));

/* Efek: jejak kilau kursor + hati saat klik */
if (!rm) {
  let tL = 0;
  addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' || $('main').classList.contains('hidden')) return;
    const n = Date.now(); if (n - tL < 45) return; tL = n;
    const s = document.createElement('div');
    s.className = 'sp';
    s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;--x:${(Math.random() - .5) * 30}px;--y:${Math.random() * 34}px`;
    document.body.appendChild(s); setTimeout(() => s.remove(), 900);
  });
  addEventListener('click', e => {
    if ($('main').classList.contains('hidden')) return;
    const h = document.createElement('div');
    h.className = 'hrt'; h.textContent = '💗';
    h.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;--x:${(Math.random() - .5) * 60}px`;
    document.body.appendChild(h); setTimeout(() => h.remove(), 1400);
  });
}