/* Cyclades V4 — React UI reading the untouched trip-data.html source */
(function () {
  'use strict';

  const { useEffect, useMemo, useRef, useState, Fragment } = React;
  const html = htm.bind(React.createElement);

  const TRIP_START = new Date(2026, 8, 9, 0, 0, 0);
  const TRIP_END = new Date(2026, 8, 18, 23, 59, 59);
  const ISLANDS = ['Santorin', 'Naxos', 'Paros', 'Mykonos'];

  function norm(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function slug(value) {
    let s = norm(value).toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
    return s.slice(0, 48) + '-' + (h >>> 0).toString(36);
  }

  function storeGet(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }

  function storeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }

  function extractRange(start, stopPredicate) {
    const nodes = [];
    let node = start ? start.nextElementSibling : null;
    while (node && !stopPredicate(node)) {
      nodes.push(node.cloneNode(true));
      node = node.nextElementSibling;
    }
    const holder = document.createElement('div');
    nodes.forEach((n) => holder.appendChild(n));
    return holder.innerHTML;
  }

  function parseTime(label) {
    const m = String(label || '').match(/(\d{1,2})h(\d{2})/i);
    if (!m) return null;
    const hours = Number(m[1]);
    const minutes = Number(m[2]);
    return { hours, minutes, total: hours * 60 + minutes };
  }

  function inferIsland(title, meta) {
    if (/retour/i.test(meta || '')) return 'Retour';
    const matches = ISLANDS.filter((name) => String(title || '').includes(name));
    return matches.length ? matches[matches.length - 1] : 'Voyage';
  }

  function parseSource(source) {
    const doc = new DOMParser().parseFromString(source, 'text/html');
    const wrap = doc.querySelector('.wrap');
    if (!wrap) throw new Error('Source de voyage introuvable.');

    const taskHeading = wrap.querySelector('#faire');
    const tasks = [];
    if (taskHeading) {
      let node = taskHeading.nextElementSibling;
      while (node && !(node.tagName === 'H2' && node.id === 'valise')) {
        if (node.classList && node.classList.contains('box')) {
          const clone = node.cloneNode(true);
          const first = clone.querySelector('b');
          const title = norm(first ? first.textContent : clone.textContent).replace(/^\d+\s*·\s*/u, '');
          if (first) first.remove();
          tasks.push({
            id: slug(title),
            title,
            html: clone.innerHTML,
            tone: node.classList.contains('bx-r') ? 'urgent' : node.classList.contains('bx-a') ? 'attention' : 'info'
          });
        }
        node = node.nextElementSibling;
      }
    }

    const packHeading = wrap.querySelector('#valise');
    const packCategories = [];
    const prepNotes = [];
    if (packHeading) {
      let node = packHeading.nextElementSibling;
      while (node && !(node.tagName === 'H2' && node.id === 'cash')) {
        if (node.classList && node.classList.contains('box')) {
          const labels = Array.from(node.querySelectorAll('label.ck'));
          const title = norm(node.querySelector('b')?.textContent || '');
          if (labels.length) {
            const items = labels.map((label, index) => {
              const name = norm(label.querySelector('.n')?.textContent || label.textContent);
              const note = norm(label.querySelector('.y')?.textContent || '');
              return { id: slug(name), name, note, index };
            });
            packCategories.push({ id: slug(title), title, items });
          } else {
            const clone = node.cloneNode(true);
            const first = clone.querySelector('b');
            if (first) first.remove();
            prepNotes.push({ title, html: clone.innerHTML });
          }
        }
        node = node.nextElementSibling;
      }
    }

    const cashHeading = wrap.querySelector('#cash');
    const cashHtml = cashHeading
      ? extractRange(cashHeading, (node) => node.tagName === 'H2' && norm(node.textContent) === 'Les 10 journées')
      : '';

    const days = Array.from(wrap.querySelectorAll('details[id^="j"]')).map((detail, index) => {
      const title = norm(detail.querySelector('.sm-t')?.textContent || detail.querySelector('summary')?.textContent || '');
      const meta = norm(detail.querySelector('.sm-d')?.textContent || '');
      const timeline = Array.from(detail.querySelectorAll('.tl')).map((row) => {
        const time = norm(row.querySelector('.h')?.textContent || '');
        const contentNode = row.querySelector('.h')?.nextElementSibling;
        return {
          time,
          parsedTime: parseTime(time),
          text: norm(contentNode?.textContent || ''),
          html: contentNode?.innerHTML || '',
          tone: row.classList.contains('R') ? 'critical' : row.classList.contains('A') ? 'attention' : row.classList.contains('D') ? 'leisure' : 'normal'
        };
      });

      const transports = Array.from(detail.querySelectorAll('.trip')).map((trip) => {
        const rows = Array.from(trip.querySelectorAll('.r')).map((row) => ({
          key: norm(row.querySelector('.k')?.textContent || ''),
          text: norm(row.querySelector('.v')?.textContent || ''),
          html: row.querySelector('.v')?.innerHTML || ''
        }));
        return {
          name: norm(trip.querySelector('.n')?.textContent || ''),
          rows,
          tone: trip.classList.contains('R') ? 'critical' : trip.classList.contains('A') ? 'attention' : 'normal'
        };
      });

      const notes = Array.from(detail.querySelectorAll('.body .box')).map((box) => {
        const clone = box.cloneNode(true);
        const first = clone.querySelector('b');
        const noteTitle = norm(first?.textContent || '');
        if (first) first.remove();
        return {
          title: noteTitle,
          html: clone.innerHTML,
          tone: box.classList.contains('bx-r') ? 'urgent' :
            box.classList.contains('bx-a') ? 'attention' :
            box.classList.contains('bx-g') ? 'success' :
            box.classList.contains('bx-p') ? 'accent' : 'info'
        };
      });

      const cash = norm(detail.querySelector('.cash .v')?.textContent || '');
      let hotel = '';
      Array.from(detail.querySelectorAll('.body > div')).forEach((node) => {
        const text = norm(node.textContent);
        const m = text.match(/^Nuit\s+\d+\s*[-–]\s*(.+)$/i);
        if (m) hotel = norm(m[1]);
      });

      const body = detail.querySelector('.body');
      return {
        id: detail.id,
        index,
        number: index + 1,
        title,
        meta,
        dateLabel: norm(meta.split('·')[0] || ''),
        island: inferIsland(title, meta),
        timeline,
        transports,
        notes,
        cash,
        hotel,
        rawHtml: body ? body.innerHTML : ''
      };
    });

    const infoSections = [];
    const transportHeading = wrap.querySelector('#trsp');
    if (transportHeading) {
      let heading = transportHeading;
      while (heading) {
        if (heading.tagName === 'H2') {
          const title = norm(heading.textContent);
          const id = heading.id || slug(title);
          infoSections.push({
            id,
            title,
            html: extractRange(heading, (node) => node.tagName === 'H2')
          });
        }
        heading = heading.nextElementSibling;
        while (heading && heading.tagName !== 'H2') heading = heading.nextElementSibling;
      }
    }

    const contacts = [];
    const contactsSection = wrap.querySelector('#contacts');
    if (contactsSection) {
      let table = contactsSection.nextElementSibling;
      while (table && table.tagName !== 'TABLE') table = table.nextElementSibling;
      if (table) {
        Array.from(table.querySelectorAll('tr')).forEach((row) => {
          const cells = row.querySelectorAll('td');
          if (cells.length < 2) return;
          const tel = cells[1].querySelector('a[href^="tel:"]');
          contacts.push({
            name: norm(cells[0].textContent),
            html: cells[1].innerHTML,
            tel: tel ? tel.getAttribute('href') : ''
          });
        });
      }
    }

    return { tasks, packCategories, prepNotes, cashHtml, days, infoSections, contacts };
  }

  function getTravelDayIndex(now = new Date()) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
    const start = new Date(2026, 8, 9, 12);
    const diff = Math.round((today - start) / 86400000);
    return diff >= 0 && diff <= 9 ? diff : -1;
  }

  function getTripStatus() {
    const now = new Date();
    if (now < TRIP_START) {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const days = Math.max(0, Math.ceil((TRIP_START - today) / 86400000));
      return { phase: 'before', label: 'Départ dans ' + days + ' jour' + (days > 1 ? 's' : ''), short: 'J-' + days };
    }
    const index = getTravelDayIndex(now);
    if (index >= 0) return { phase: 'during', label: 'Jour ' + (index + 1) + ' sur 10', short: 'J' + (index + 1), index };
    return { phase: 'after', label: 'Voyage terminé', short: 'Souvenirs' };
  }

  function icon(name, size = 20) {
    const paths = {
      search: html`<path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"/>`,
      chevronLeft: html`<path d="m15 18-6-6 6-6"/>`,
      chevronRight: html`<path d="m9 18 6-6-6-6"/>`,
      check: html`<path d="m5 12 4 4L19 6"/>`,
      wallet: html`<path d="M4 6h14a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 0V5a2 2 0 0 1 2-2h10m2 8h4v4h-4a2 2 0 1 1 0-4Z"/>`,
      phone: html`<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z"/>`,
      map: html`<path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Zm0 0V3m6 18V6"/>`,
      clock: html`<path d="M12 7v5l3 2m7-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"/>`,
      list: html`<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>`
    };
    return html`<svg className="icon" width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">${paths[name] || paths.list}</svg>`;
  }

  function Rich({ html: value, className = '' }) {
    return html`<div className=${'rich ' + className} dangerouslySetInnerHTML=${{ __html: value || '' }} />`;
  }

  function Header({ view, setView, onSearch, status }) {
    return html`
      <header className="app-header">
        <div className="header-sky">
          <div className="brand">
            <div className="brand-mark"><span></span></div>
            <div>
              <strong>Cyclades</strong>
              <small>Santorin · Naxos · Paros · Mykonos</small>
            </div>
          </div>
          <div className="header-actions">
            <span className="status-pill">${status.short}</span>
            <button className="round-btn glass" type="button" onClick=${onSearch} aria-label="Rechercher">${icon('search', 19)}</button>
          </div>
        </div>
        <nav className="primary-tabs" aria-label="Navigation principale">
          ${[
            ['trip', 'Voyage'],
            ['prepare', 'Préparer'],
            ['info', 'Infos']
          ].map(([id, label]) => html`
            <button key=${id} type="button" className=${view === id ? 'active' : ''} onClick=${() => setView(id)}>${label}</button>
          `)}
        </nav>
      </header>
    `;
  }

  function DayRail({ days, selected, onSelect, todayIndex }) {
    useEffect(() => {
      const active = document.querySelector('.day-pill.active');
      if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, [selected]);

    return html`
      <div className="day-rail-wrap">
        <div className="day-rail">
          ${days.map((day, index) => html`
            <button
              key=${day.id}
              className=${'day-pill ' + (selected === index ? 'active ' : '') + (todayIndex === index ? 'today' : '')}
              type="button"
              onClick=${() => onSelect(index)}
            >
              <span className="day-num">J${day.number}</span>
              <span className="day-island">${day.island}</span>
              <small>${day.dateLabel}</small>
            </button>
          `)}
        </div>
      </div>
    `;
  }

  function StatusHero({ status, currentDay, onGoToday }) {
    return html`
      <section className="journey-hero">
        <div className="hero-sun"></div>
        <div className="hero-copy">
          <span className="eyebrow">${status.phase === 'before' ? 'Bientôt la mer Égée' : status.phase === 'during' ? 'En voyage' : 'Circuit Cyclades'}</span>
          <h1>${status.label}</h1>
          <p>${status.phase === 'before'
            ? 'Tout le voyage reste visible d’un seul geste, avec les prochaines journées juste sous les yeux.'
            : status.phase === 'during' && currentDay
              ? currentDay.title
              : '9 → 18 septembre 2026 · 10 jours · 4 îles'}</p>
          ${status.phase === 'during' ? html`
            <button className="hero-link" type="button" onClick=${onGoToday}>Revenir à aujourd’hui ${icon('chevronRight', 16)}</button>
          ` : null}
        </div>
        <div className="hero-wave wave-a"></div>
        <div className="hero-wave wave-b"></div>
      </section>
    `;
  }

  function Timeline({ day, isToday }) {
    const [showAll, setShowAll] = useState(false);
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    let nextIndex = -1;
    if (isToday) {
      nextIndex = day.timeline.findIndex((item) => item.parsedTime && item.parsedTime.total >= nowMinutes);
    }

    let visible = day.timeline;
    if (!showAll && day.timeline.length > 8) {
      if (isToday && nextIndex >= 0) {
        const start = Math.max(0, nextIndex - 2);
        visible = day.timeline.slice(start, Math.min(day.timeline.length, start + 8));
      } else {
        visible = day.timeline.slice(0, 7);
      }
    }

    return html`
      <section className="section-block" id="timeline">
        <div className="section-title">
          <div>
            <span className="kicker">${isToday ? 'Le fil de la journée' : 'Programme'}</span>
            <h2>${isToday ? 'Aujourd’hui' : 'Déroulé'}</h2>
          </div>
          ${day.timeline.length > 8 ? html`
            <button className="text-btn" type="button" onClick=${() => setShowAll(!showAll)}>${showAll ? 'Réduire' : 'Tout afficher'}</button>
          ` : null}
        </div>
        <div className="timeline">
          ${visible.map((item) => {
            const originalIndex = day.timeline.indexOf(item);
            const isNext = isToday && originalIndex === nextIndex;
            const isPast = isToday && item.parsedTime && item.parsedTime.total < nowMinutes && !isNext;
            return html`
              <div key=${item.time + '-' + originalIndex} className=${'timeline-row tone-' + item.tone + (isNext ? ' next' : '') + (isPast ? ' past' : '')}>
                <div className="timeline-time">${item.time || '—'}</div>
                <div className="timeline-dot"></div>
                <div className="timeline-body">
                  ${isNext ? html`<span className="next-badge">Prochaine étape</span>` : null}
                  <div dangerouslySetInnerHTML=${{ __html: item.html || item.text }}></div>
                </div>
              </div>
            `;
          })}
        </div>
      </section>
    `;
  }

  function DayOverview({ day, selected, total, onPrevious, onNext, isToday, contacts }) {
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipe = 55;

    function finishSwipe() {
      if (touchStart === null || touchEnd === null) return;
      const distance = touchStart - touchEnd;
      if (distance > minSwipe && selected < total - 1) onNext();
      if (distance < -minSwipe && selected > 0) onPrevious();
      setTouchStart(null);
      setTouchEnd(null);
    }

    const contact = contacts.find((item) => {
      const a = item.name.toLocaleLowerCase('fr');
      const b = day.hotel.toLocaleLowerCase('fr');
      return b && (a.includes(b) || b.includes(a));
    });

    return html`
      <article
        className="day-focus"
        onTouchStart=${(event) => setTouchStart(event.touches[0].clientX)}
        onTouchMove=${(event) => setTouchEnd(event.touches[0].clientX)}
        onTouchEnd=${finishSwipe}
      >
        <div className="day-focus-top">
          <button className="round-btn" type="button" onClick=${onPrevious} disabled=${selected === 0} aria-label="Jour précédent">${icon('chevronLeft', 20)}</button>
          <div className="day-focus-title">
            <span className="kicker">${isToday ? 'Aujourd’hui · ' : ''}J${day.number} · ${day.dateLabel}</span>
            <h2>${day.title}</h2>
            <p>${day.meta}</p>
          </div>
          <button className="round-btn" type="button" onClick=${onNext} disabled=${selected === total - 1} aria-label="Jour suivant">${icon('chevronRight', 20)}</button>
        </div>

        <div className="day-facts">
          ${day.cash ? html`<div className="fact"><span>${icon('wallet', 18)} Espèces</span><strong>${day.cash}</strong></div>` : null}
          ${day.hotel ? html`<div className="fact"><span>${icon('map', 18)} Nuit</span><strong>${day.hotel}</strong></div>` : null}
        </div>

        ${day.hotel ? html`
          <div className="quick-actions">
            <a className="action-btn" href=${'https://maps.apple.com/?q=' + encodeURIComponent(day.hotel + ' Grèce')} target="_blank" rel="noopener">${icon('map', 18)} Itinéraire hôtel</a>
            ${contact?.tel ? html`<a className="action-btn" href=${contact.tel}>${icon('phone', 18)} Appeler</a>` : null}
          </div>
        ` : null}

        <${Timeline} day=${day} isToday=${isToday} />
      </article>
    `;
  }

  function TransportCards({ day }) {
    const [open, setOpen] = useState({});
    if (!day.transports.length) return null;

    return html`
      <section className="section-block">
        <div className="section-title"><div><span className="kicker">Se déplacer</span><h2>Transports & billets</h2></div></div>
        <div className="transport-stack">
          ${day.transports.map((trip, index) => {
            const time = trip.rows.find((row) => /horaire/i.test(row.key));
            const pay = trip.rows.find((row) => /paiement/i.test(row.key));
            const expanded = !!open[index];
            return html`
              <article key=${trip.name + index} className=${'transport-card tone-' + trip.tone}>
                <button type="button" className="transport-head" onClick=${() => setOpen({ ...open, [index]: !expanded })}>
                  <div>
                    <strong>${trip.name}</strong>
                    <div className="tran