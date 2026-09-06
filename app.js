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
    