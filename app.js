(() => {
  // ============= HERO video ping-pong (boomerang) loop =============
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    const SPEED = 0.8;
    const END_GUARD = 0.12; // start reversing this many seconds before duration

    heroVideo.muted = true;
    heroVideo.volume = 0;
    heroVideo.removeAttribute('loop');
    heroVideo.playbackRate = SPEED;

    let lastTs = 0;
    let rafId = 0;
    let reversing = false;

    const reverseTick = (ts) => {
      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      const next = heroVideo.currentTime - dt * SPEED;
      if (next <= 0) {
        heroVideo.currentTime = 0;
        lastTs = 0;
        rafId = 0;
        reversing = false;
        heroVideo.playbackRate = SPEED;
        heroVideo.play().catch(() => {});
        return;
      }
      heroVideo.currentTime = next;
      rafId = requestAnimationFrame(reverseTick);
    };

    const startReverse = () => {
      if (reversing) return;
      reversing = true;
      heroVideo.pause();
      lastTs = 0;
      rafId = requestAnimationFrame(reverseTick);
    };

    heroVideo.addEventListener('timeupdate', () => {
      if (reversing) return;
      const d = heroVideo.duration;
      if (d && isFinite(d) && heroVideo.currentTime >= d - END_GUARD) {
        startReverse();
      }
    });

    // Fallback: in case 'ended' fires before timeupdate hits the threshold
    heroVideo.addEventListener('ended', startReverse);

    heroVideo.addEventListener('loadedmetadata', () => {
      heroVideo.playbackRate = SPEED;
      heroVideo.play().catch(() => {});
    });

    // If metadata was already available before the listener attached
    if (heroVideo.readyState >= 1) {
      heroVideo.playbackRate = SPEED;
      heroVideo.play().catch(() => {});
    }
  }

  // ============= NAV scroll + drawer state =============
  const nav = document.getElementById('nav');
  const burger = document.getElementById('nav-burger');
  const drawer = document.getElementById('nav-drawer');

  let open = false;

  const updateNavState = () => {
    const scrolled = window.scrollY > 40;
    nav.classList.toggle('nav--scrolled', scrolled);
    nav.classList.toggle('nav--on-dark', !scrolled && !open);
    nav.classList.toggle('nav--open', open);
    burger.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  const setOpen = (v) => { open = v; updateNavState(); };

  burger.addEventListener('click', () => setOpen(!open));
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) setOpen(false);
  });
  document.querySelectorAll('[data-nav-close]').forEach((el) => {
    el.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  window.addEventListener('scroll', updateNavState, { passive: true });
  updateNavState();

  // ============= SPECIALITÀ tabs =============
  const PRODUCTS = {
    croissant: {
      name: 'Croissant',
      price: 'da 1,80 €',
      tag: "L'icona",
      desc: 'Burro francese AOP, sfoglia a strati, lievitazione lenta a freddo. Versione classica e al cioccolato, sfornati ogni mattina.',
      img: 'img/croissant.webp',
    },
    gelato: {
      name: 'Granita & Gelato',
      price: 'da 2,50 €',
      tag: 'Tradizione siciliana',
      desc: 'Granita mantecata e panna fresca da accompagnare con la brioche col tuppo. Il rito siciliano della colazione, da maggio a settembre.',
      img: 'img/colazione.webp',
    },
    panettone: {
      name: 'Panettone & Colomba',
      price: 'da 38 €',
      tag: 'Su prenotazione',
      desc: 'Lievito madre vivo, glassa rosa con perline di zucchero. Una colomba pasquale firmata Chantigne, su prenotazione.',
      img: 'img/colombe.webp',
    },
    mignon: {
      name: 'Piccola Pasticceria',
      price: 'da 2,00 € l\'etto',
      tag: 'Ogni giorno',
      desc: 'Cestini di pasta frolla, fragoline di bosco, crostatine alla frutta, bignè con panna. Una vetrina che cambia ogni giorno.',
      img: 'img/vetrina.webp',
    },
    torte: {
      name: 'Torte di Design',
      price: 'su preventivo',
      tag: 'Su misura',
      desc: 'Torte di compleanno, anniversari, eventi. Disegniamo con voi gusto, decoro floreale e architettura del dolce.',
      img: 'img/torta.webp',
    },
  };

  const list = document.getElementById('specialita-list');
  const elName = document.getElementById('specialita-name');
  const elPrice = document.getElementById('specialita-price');
  const elDesc = document.getElementById('specialita-desc');
  const elImg = document.getElementById('specialita-img');
  const elTag = document.getElementById('specialita-tag');
  const elDetail = document.getElementById('specialita-detail');

  const setProduct = (id) => {
    const p = PRODUCTS[id];
    if (!p) return;
    list.querySelectorAll('.specialita__row').forEach((row) => {
      row.classList.toggle('is-active', row.dataset.id === id);
    });
    elName.textContent = p.name;
    elPrice.textContent = p.price;
    elDesc.textContent = p.desc;
    elTag.textContent = p.tag;
    elImg.src = p.img;
    elImg.alt = p.name;
    // restart fade animation
    elImg.style.animation = 'none';
    elDetail.style.animation = 'none';
    void elImg.offsetWidth;
    void elDetail.offsetWidth;
    elImg.style.animation = '';
    elDetail.style.animation = '';
  };

  list.querySelectorAll('.specialita__row').forEach((row) => {
    row.addEventListener('mouseenter', () => setProduct(row.dataset.id));
    row.addEventListener('click', () => setProduct(row.dataset.id));
    row.addEventListener('focus', () => setProduct(row.dataset.id));
  });

  // ============= TESTIMONIANZE slider =============
  const REVIEWS = [
    {
      text: 'Il miglior croissant a sud di Roma. Ci faccio una deviazione di sessanta chilometri ogni volta che torno a trovare i miei.',
      author: 'Marta C.',
      role: 'Palermo',
      src: 'Google · ★ 5,0',
    },
    {
      text: 'Hanno fatto la torta del nostro matrimonio. Tre piani, design pulitissimo, e un sapore che gli ospiti ancora ci nominano.',
      author: 'Giulio & Elena',
      role: 'Catania',
      src: 'Sposi · 06/2025',
    },
    {
      text: 'Il panettone di Chantigne è un rito di Natale. Lievitazione perfetta, profumo di arancia che ti resta addosso per ore.',
      author: 'Andrea M.',
      role: 'Milano',
      src: 'Tripadvisor · ★ 5,0',
    },
  ];

  const tQuote = document.getElementById('testi-quote');
  const tText = document.getElementById('testi-text');
  const tName = document.getElementById('testi-name');
  const tRole = document.getElementById('testi-role');
  const tSrc = document.getElementById('testi-src');
  const tNav = document.getElementById('testi-nav');

  const setReview = (i) => {
    const r = REVIEWS[i];
    tText.textContent = r.text;
    tName.textContent = r.author;
    tRole.textContent = r.role;
    tSrc.textContent = r.src;
    tNav.querySelectorAll('.testi__dot').forEach((d, idx) => {
      d.classList.toggle('is-active', idx === i);
    });
    tQuote.style.animation = 'none';
    void tQuote.offsetWidth;
    tQuote.style.animation = '';
  };

  tNav.querySelectorAll('.testi__dot').forEach((dot) => {
    dot.addEventListener('click', () => setReview(parseInt(dot.dataset.i, 10)));
  });

  // ============= PRENOTAZIONE form =============
  const formEl = document.getElementById('prenota-form');
  const right = document.getElementById('prenota-right');

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(formEl);
    const nome = (data.get('nome') || 'amico').toString().trim() || 'amico';
    const persone = data.get('persone');
    const dataPrenota = data.get('data') || '—';
    const ora = data.get('ora');

    right.innerHTML = `
      <div class="prenota__sent">
        <div class="prenota__sent-mark">✓</div>
        <h3>A presto, ${escapeHtml(nome)}.</h3>
        <p>Abbiamo ricevuto la tua richiesta per <strong>${escapeHtml(persone)} persone</strong> il <strong>${escapeHtml(dataPrenota)}</strong> alle <strong>${escapeHtml(ora)}</strong>. Ti scriviamo entro un'ora per confermare.</p>
        <button type="button" class="link-arrow" id="prenota-reset">← Nuova prenotazione</button>
      </div>
    `;

    document.getElementById('prenota-reset').addEventListener('click', () => location.reload());
  });

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
