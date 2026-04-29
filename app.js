(() => {
  // ============= HERO video playback =============
  // The mp4 in img/hero.mp4 is pre-baked as a boomerang (forward + reversed
  // concatenated), so a plain HTML loop is enough -- no rAF scrubbing needed.
  // Just enforce mute and a slowed playback rate.
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    const SPEED = 0.9;
    heroVideo.muted = true;
    heroVideo.volume = 0;
    heroVideo.playbackRate = SPEED;
    heroVideo.addEventListener('loadedmetadata', () => {
      heroVideo.playbackRate = SPEED;
    });
    heroVideo.addEventListener('play', () => {
      heroVideo.playbackRate = SPEED;
    });
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
  const feature = document.querySelector('.specialita__feature');
  const elName = document.getElementById('specialita-name');
  const elPrice = document.getElementById('specialita-price');
  const elDesc = document.getElementById('specialita-desc');
  const elImg = document.getElementById('specialita-img');
  const elTag = document.getElementById('specialita-tag');
  const elDetail = document.getElementById('specialita-detail');

  // On mobile, move the feature panel (image + description) directly after the
  // active row so it reads as that row's expanded detail. On desktop, keep it
  // exactly where the HTML put it (sticky right column of the grid) -- we cache
  // the original parent so desktop never sees a DOM mutation.
  const mqMobile = window.matchMedia('(max-width: 1024px)');
  const featureHome = feature ? feature.parentElement : null;
  const placeFeature = () => {
    if (!feature || !featureHome || !list) return;
    if (mqMobile.matches) {
      const active = list.querySelector('.specialita__row.is-active');
      if (active && feature.previousElementSibling !== active) {
        active.insertAdjacentElement('afterend', feature);
      }
    } else if (feature.parentElement !== featureHome) {
      featureHome.appendChild(feature);
    }
  };

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
    placeFeature();
    // restart fade animation
    elImg.style.animation = 'none';
    elDetail.style.animation = 'none';
    void elImg.offsetWidth;
    void elDetail.offsetWidth;
    elImg.style.animation = '';
    elDetail.style.animation = '';
  };

  list.querySelectorAll('.specialita__row').forEach((row) => {
    // mouseenter on desktop only -- on mobile a tap should not fire hover-like
    // behavior twice, and the click handler is enough.
    row.addEventListener('mouseenter', () => {
      if (!mqMobile.matches) setProduct(row.dataset.id);
    });
    row.addEventListener('click', () => setProduct(row.dataset.id));
    row.addEventListener('focus', () => setProduct(row.dataset.id));
  });

  placeFeature();
  mqMobile.addEventListener('change', placeFeature);

  // ============= TESTIMONIANZE slider =============
  const REVIEWS = [
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
