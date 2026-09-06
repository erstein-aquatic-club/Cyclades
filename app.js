/* Cyclades V4 — React UI over the untouched trip-data.html source */
(function () {
  "use strict";

  var h = React.createElement;
  var Fragment = React.Fragment;
  var useEffect = React.useEffect;
  var useMemo = React.useMemo;
  var useRef = React.useRef;
  var useState = React.useState;

  var TRIP_START = new Date(2026, 8, 9, 0, 0, 0);
  var TRIP_END = new Date(2026, 8, 18, 23, 59, 59);
  var ISLANDS = ["Santorin", "Naxos", "Paros", "Mykonos"];

  function norm(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function slug(value) {
    var s = norm(value).toLocaleLowerCase("fr").normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    var hash = 5381;
    for (var i = 0; i < s.length; i++) hash = ((hash << 5) + hash) ^ s.charCodeAt(i);
    return s.slice(0, 48) + "-" + (hash >>> 0).toString(36);
  }

  function storeGet(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }

  function storeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }

  function parseTime(label) {
    var match = String(label || "").match(/(\d{1,2})h(\d{2})/i);
    if (!match) return null;
    var hours = Number(match[1]);
    var minutes = Number(match[2]);
    return { hours: hours, minutes: minutes, total: hours * 60 + minutes };
  }

  function inferIsland(title, meta) {
    if (/retour/i.test(meta || "")) return "Retour";
    var matches = ISLANDS.filter(function (name) { return String(title || "").indexOf(name) >= 0; });
    return matches.length ? matches[matches.length - 1] : "Voyage";
  }

  function rangeHtml(start, stop) {
    var holder = document.createElement("div");
    var node = start ? start.nextElementSibling : null;
    while (node && !stop(node)) {
      holder.appendChild(node.cloneNode(true));
      node = node.nextElementSibling;
    }
    return holder.innerHTML;
  }

  function parseSource(source) {
    var doc = new DOMParser().parseFromString(source, "text/html");
    var wrap = doc.querySelector(".wrap");
    if (!wrap) throw new Error("Source de voyage introuvable.");

    var tasks = [];
    var taskHeading = wrap.querySelector("#faire");
    if (taskHeading) {
      var taskNode = taskHeading.nextElementSibling;
      while (taskNode && !(taskNode.tagName === "H2" && taskNode.id === "valise")) {
        if (taskNode.classList && taskNode.classList.contains("box")) {
          var taskClone = taskNode.cloneNode(true);
          var taskFirst = taskClone.querySelector("b");
          var taskTitle = norm(taskFirst ? taskFirst.textContent : taskClone.textContent).replace(/^\d+\s*·\s*/u, "");
          if (taskFirst) taskFirst.remove();
          tasks.push({
            id: slug(taskTitle),
            title: taskTitle,
            html: taskClone.innerHTML,
            tone: taskNode.classList.contains("bx-r") ? "urgent" : taskNode.classList.contains("bx-a") ? "attention" : "info"
          });
        }
        taskNode = taskNode.nextElementSibling;
      }
    }

    var packCategories = [];
    var prepNotes = [];
    var packHeading = wrap.querySelector("#valise");
    if (packHeading) {
      var packNode = packHeading.nextElementSibling;
      while (packNode && !(packNode.tagName === "H2" && packNode.id === "cash")) {
        if (packNode.classList && packNode.classList.contains("box")) {
          var labels = Array.from(packNode.querySelectorAll("label.ck"));
          var categoryTitle = norm(packNode.querySelector("b") ? packNode.querySelector("b").textContent : "");
          if (labels.length) {
            packCategories.push({
              id: slug(categoryTitle),
              title: categoryTitle,
              items: labels.map(function (label) {
                var nameNode = label.querySelector(".n");
                var noteNode = label.querySelector(".y");
                var name = norm(nameNode ? nameNode.textContent : label.textContent);
                return { id: slug(name), name: name, note: norm(noteNode ? noteNode.textContent : "") };
              })
            });
          } else {
            var prepClone = packNode.cloneNode(true);
            var prepFirst = prepClone.querySelector("b");
            if (prepFirst) prepFirst.remove();
            prepNotes.push({ title: categoryTitle, html: prepClone.innerHTML });
          }
        }
        packNode = packNode.nextElementSibling;
      }
    }

    var cashHeading = wrap.querySelector("#cash");
    var cashHtml = cashHeading ? rangeHtml(cashHeading, function (node) {
      return node.tagName === "H2" && norm(node.textContent) === "Les 10 journées";
    }) : "";

    var days = Array.from(wrap.querySelectorAll('details[id^="j"]')).map(function (detail, index) {
      var titleNode = detail.querySelector(".sm-t");
      var metaNode = detail.querySelector(".sm-d");
      var title = norm(titleNode ? titleNode.textContent : "");
      var meta = norm(metaNode ? metaNode.textContent : "");

      var timeline = Array.from(detail.querySelectorAll(".tl")).map(function (row) {
        var timeNode = row.querySelector(".h");
        var time = norm(timeNode ? timeNode.textContent : "");
        var contentNode = timeNode ? timeNode.nextElementSibling : null;
        return {
          time: time,
          parsedTime: parseTime(time),
          text: norm(contentNode ? contentNode.textContent : ""),
          html: contentNode ? contentNode.innerHTML : "",
          tone: row.classList.contains("R") ? "critical" :
            row.classList.contains("A") ? "attention" :
            row.classList.contains("D") ? "leisure" : "normal"
        };
      });

      var transports = Array.from(detail.querySelectorAll(".trip")).map(function (trip) {
        var nameNode = trip.querySelector(".n");
        return {
          name: norm(nameNode ? nameNode.textContent : ""),
          tone: trip.classList.contains("R") ? "critical" : trip.classList.contains("A") ? "attention" : "normal",
          rows: Array.from(trip.querySelectorAll(".r")).map(function (row) {
            var keyNode = row.querySelector(".k");
            var valNode = row.querySelector(".v");
            return {
              key: norm(keyNode ? keyNode.textContent : ""),
              text: norm(valNode ? valNode.textContent : ""),
              html: valNode ? valNode.innerHTML : ""
            };
          })
        };
      });

      var notes = Array.from(detail.querySelectorAll(".body .box")).map(function (box) {
        var noteClone = box.cloneNode(true);
        var noteFirst = noteClone.querySelector("b");
        var noteTitle = norm(noteFirst ? noteFirst.textContent : "");
        if (noteFirst) noteFirst.remove();
        return {
          title: noteTitle,
          html: noteClone.innerHTML,
          tone: box.classList.contains("bx-r") ? "urgent" :
            box.classList.contains("bx-a") ? "attention" :
            box.classList.contains("bx-g") ? "success" :
            box.classList.contains("bx-p") ? "accent" : "info"
        };
      });

      var cashNode = detail.querySelector(".cash .v");
      var cash = norm(cashNode ? cashNode.textContent : "");
      var hotel = "";
      Array.from(detail.querySelectorAll(".body > div")).forEach(function (node) {
        var match = norm(node.textContent).match(/^Nuit\s+\d+\s*[-–]\s*(.+)$/i);
        if (match) hotel = norm(match[1]);
      });

      var body = detail.querySelector(".body");
      return {
        id: detail.id,
        number: index + 1,
        title: title,
        meta: meta,
        dateLabel: norm((meta.split("·")[0] || "")),
        island: inferIsland(title, meta),
        timeline: timeline,
        transports: transports,
        notes: notes,
        cash: cash,
        hotel: hotel,
        rawHtml: body ? body.innerHTML : ""
      };
    });

    var infoSections = [];
    var heading = wrap.querySelector("#trsp");
    while (heading) {
      if (heading.tagName === "H2") {
        var infoTitle = norm(heading.textContent);
        infoSections.push({
          id: heading.id || slug(infoTitle),
          title: infoTitle,
          html: rangeHtml(heading, function (node) { return node.tagName === "H2"; })
        });
      }
      heading = heading.nextElementSibling;
      while (heading && heading.tagName !== "H2") heading = heading.nextElementSibling;
    }

    var contacts = [];
    var contactsHeading = wrap.querySelector("#contacts");
    if (contactsHeading) {
      var table = contactsHeading.nextElementSibling;
      while (table && table.tagName !== "TABLE") table = table.nextElementSibling;
      if (table) {
        Array.from(table.querySelectorAll("tr")).forEach(function (row) {
          var cells = row.querySelectorAll("td");
          if (cells.length < 2) return;
          var phone = cells[1].querySelector('a[href^="tel:"]');
          contacts.push({
            name: norm(cells[0].textContent),
            html: cells[1].innerHTML,
            tel: phone ? phone.getAttribute("href") : ""
          });
        });
      }
    }

    return {
      tasks: tasks,
      packCategories: packCategories,
      prepNotes: prepNotes,
      cashHtml: cashHtml,
      days: days,
      infoSections: infoSections,
      contacts: contacts
    };
  }

  function travelDayIndex(now) {
    now = now || new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
    var start = new Date(2026, 8, 9, 12);
    var diff = Math.round((today - start) / 86400000);
    return diff >= 0 && diff <= 9 ? diff : -1;
  }

  function tripStatus() {
    var now = new Date();
    if (now < TRIP_START) {
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var days = Math.max(0, Math.ceil((TRIP_START - today) / 86400000));
      return { phase: "before", label: "Départ dans " + days + " jour" + (days > 1 ? "s" : ""), short: "J-" + days };
    }
    var index = travelDayIndex(now);
    if (index >= 0) return { phase: "during", label: "Jour " + (index + 1) + " sur 10", short: "J" + (index + 1), index: index };
    return { phase: "after", label: "Voyage terminé", short: "Souvenirs" };
  }

  function SvgIcon(props) {
    var path = {
      search: "M21 21l-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
      left: "m15 18-6-6 6-6",
      right: "m9 18 6-6-6-6",
      check: "m5 12 4 4L19 6",
      wallet: "M4 6h14a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 0V5a2 2 0 0 1 2-2h10m2 8h4v4h-4a2 2 0 1 1 0-4Z",
      phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z",
      map: "m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Zm0 0V3m6 18V6",
      clock: "M12 7v5l3 2m7-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
      list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
    }[props.name] || "M12 17v-6m0-4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z";
    return h("svg", {
      className: "icon",
      width: props.size || 20,
      height: props.size || 20,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    }, h("path", { d: path }));
  }

  function Rich(props) {
    return h("div", {
      className: "rich " + (props.className || ""),
      dangerouslySetInnerHTML: { __html: props.html || "" }
    });
  }

  function Header(props) {
    var tabs = [["trip", "Voyage"], ["prepare", "Préparer"], ["info", "Infos"]];
    return h("header", { className: "app-header" },
      h("div", { className: "header-sky" },
        h("div", { className: "brand" },
          h("div", { className: "brand-mark" }, h("span")),
          h("div", null,
            h("strong", null, "Cyclades"),
            h("small", null, "Santorin · Naxos · Paros · Mykonos")
          )
        ),
        h("div", { className: "header-actions" },
          h("span", { className: "status-pill" }, props.status.short),
          h("button", { className: "round-btn glass", type: "button", onClick: props.onSearch, "aria-label": "Rechercher" }, h(SvgIcon, { name: "search", size: 19 }))
        )
      ),
      h("nav", { className: "primary-tabs", "aria-label": "Navigation principale" },
        tabs.map(function (tab) {
          return h("button", {
            key: tab[0],
            type: "button",
            className: props.view === tab[0] ? "active" : "",
            onClick: function () { props.setView(tab[0]); }
          }, tab[1]);
        })
      )
    );
  }

  function JourneyHero(props) {
    var copy = props.status.phase === "before"
      ? "Tout le voyage reste visible d’un seul geste, avec les prochaines journées juste sous les yeux."
      : props.status.phase === "during" && props.currentDay
        ? props.currentDay.title
        : "9 → 18 septembre 2026 · 10 jours · 4 îles";
    return h("section", { className: "journey-hero" },
      h("div", { className: "hero-sun" }),
      h("div", { className: "hero-copy" },
        h("span", { className: "eyebrow" }, props.status.phase === "before" ? "Bientôt la mer Égée" : props.status.phase === "during" ? "En voyage" : "Circuit Cyclades"),
        h("h1", null, props.status.label),
        h("p", null, copy),
        props.status.phase === "during" ? h("button", { className: "hero-link", type: "button", onClick: props.onToday },
          "Revenir à aujourd’hui ", h(SvgIcon, { name: "right", size: 16 })
        ) : null
      ),
      h("div", { className: "hero-wave wave-a" }),
      h("div", { className: "hero-wave wave-b" })
    );
  }

  function DayRail(props) {
    useEffect(function () {
      var active = document.querySelector(".day-pill.active");
      if (active) active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }, [props.selected]);

    return h("div", { className: "day-rail-wrap" },
      h("div", { className: "day-rail" },
        props.days.map(function (day, index) {
          var classes = "day-pill";
          if (props.selected === index) classes += " active";
          if (props.todayIndex === index) classes += " today";
          return h("button", {
            key: day.id,
            className: classes,
            type: "button",
            onClick: function () { props.onSelect(index); }
          },
            h("span", { className: "day-num" }, "J" + day.number),
            h("span", { className: "day-island" }, day.island),
            h("small", null, day.dateLabel)
          );
        })
      )
    );
  }

  function Timeline(props) {
    var day = props.day;
    var isToday = props.isToday;
    var state = useState(false);
    var showAll = state[0];
    var setShowAll = state[1];
    var now = new Date();
    var nowMinutes = now.getHours() * 60 + now.getMinutes();
    var nextIndex = -1;
    if (isToday) {
      nextIndex = day.timeline.findIndex(function (item) {
        return item.parsedTime && item.parsedTime.total >= nowMinutes;
      });
    }

    var visible = day.timeline;
    if (!showAll && day.timeline.length > 8) {
      if (isToday && nextIndex >= 0) {
        var start = Math.max(0, nextIndex - 2);
        visible = day.timeline.slice(start, Math.min(day.timeline.length, start + 8));
      } else visible = day.timeline.slice(0, 7);
    }

    return h("section", { className: "section-block", id: "timeline" },
      h("div", { className: "section-title" },
        h("div", null,
          h("span", { className: "kicker" }, isToday ? "Le fil de la journée" : "Programme"),
          h("h2", null, isToday ? "Aujourd’hui" : "Déroulé")
        ),
        day.timeline.length > 8 ? h("button", { className: "text-btn", type: "button", onClick: function () { setShowAll(!showAll); } }, showAll ? "Réduire" : "Tout afficher") : null
      ),
      h("div", { className: "timeline" },
        visible.map(function (item) {
          var originalIndex = day.timeline.indexOf(item);
          var isNext = isToday && originalIndex === nextIndex;
          var isPast = isToday && item.parsedTime && item.parsedTime.total < nowMinutes && !isNext;
          var cls = "timeline-row tone-" + item.tone + (isNext ? " next" : "") + (isPast ? " past" : "");
          return h("div", { key: item.time + "-" + originalIndex, className: cls },
            h("div", { className: "timeline-time" }, item.time || "—"),
            h("div", { className: "timeline-dot" }),
            h("div", { className: "timeline-body" },
              isNext ? h("span", { className: "next-badge" }, "Prochaine étape") : null,
              h("div", { dangerouslySetInnerHTML: { __html: item.html || item.text } })
            )
          );
        })
      )
    );
  }

  function DayFocus(props) {
    var day = props.day;
    var touchStartState = useState(null);
    var touchStart = touchStartState[0];
    var setTouchStart = touchStartState[1];
    var touchEndState = useState(null);
    var touchEnd = touchEndState[0];
    var setTouchEnd = touchEndState[1];

    var contact = props.contacts.find(function (item) {
      var a = item.name.toLocaleLowerCase("fr");
      var b = day.hotel.toLocaleLowerCase("fr");
      return b && (a.indexOf(b) >= 0 || b.indexOf(a) >= 0);
    });

    function finishSwipe() {
      if (touchStart === null || touchEnd === null) return;
      var distance = touchStart - touchEnd;
      if (distance > 55 && props.selected < props.total - 1) props.onNext();
      if (distance < -55 && props.selected > 0) props.onPrevious();
      setTouchStart(null);
      setTouchEnd(null);
    }

    return h("article", {
      className: "day-focus",
      onTouchStart: function (event) { setTouchStart(event.touches[0].clientX); },
      onTouchMove: function (event) { setTouchEnd(event.touches[0].clientX); },
      onTouchEnd: finishSwipe
    },
      h("div", { className: "day-focus-top" },
        h("button", { className: "round-btn", type: "button", onClick: props.onPrevious, disabled: props.selected === 0, "aria-label": "Jour précédent" }, h(SvgIcon, { name: "left", size: 20 })),
        h("div", { className: "day-focus-title" },
          h("span", { className: "kicker" }, (props.isToday ? "Aujourd’hui · " : "") + "J" + day.number + " · " + day.dateLabel),
          h("h2", null, day.title),
          h("p", null, day.meta)
        ),
        h("button", { className: "round-btn", type: "button", onClick: props.onNext, disabled: props.selected === props.total - 1, "aria-label": "Jour suivant" }, h(SvgIcon, { name: "right", size: 20 }))
      ),
      h("div", { className: "day-facts" },
        day.cash ? h("div", { className: "fact" }, h("span", null, h(SvgIcon, { name: "wallet", size: 18 }), " Espèces"), h("strong", null, day.cash)) : null,
        day.hotel ? h("div", { className: "fact" }, h("span", null, h(SvgIcon, { name: "map", size: 18 }), " Nuit"), h("strong", null, day.hotel)) : null
      ),
      day.hotel ? h("div", { className: "quick-actions" },
        h("a", { className: "action-btn", href: "https://maps.apple.com/?q=" + encodeURIComponent(day.hotel + " Grèce"), target: "_blank", rel: "noopener" }, h(SvgIcon, { name: "map", size: 18 }), " Itinéraire hôtel"),
        contact && contact.tel ? h("a", { className: "action-btn", href: contact.tel }, h(SvgIcon, { name: "phone", size: 18 }), " Appeler") : null
      ) : null,
      h(Timeline, { day: day, isToday: props.isToday })
    );
  }

  function UpcomingDays(props) {
    var state = useState(false);
    var showAll = state[0];
    var setShowAll = state[1];
    var upcoming = props.days.slice(props.selected + 1);

    if (!upcoming.length) {
      return h("section", { className: "section-block" },
        h("div", { className: "section-title" }, h("div", null, h("span", { className: "kicker" }, "Fin du circuit"), h("h2", null, "Dernière journée"))),
        h("div", { className: "end-card" }, "Tu es arrivé au bout de l’itinéraire. Les journées précédentes restent accessibles dans le rail ci-dessus.")
      );
    }

    var shown = showAll ? upcoming : upcoming.slice(0, 4);
    return h("section", { className: "section-block upcoming-block" },
      h("div", { className: "section-title" },
        h("div", null, h("span", { className: "kicker" }, "Toujours sous les yeux"), h("h2", null, "Prochains jours")),
        upcoming.length > 4 ? h("button", { type: "button", className: "text-btn", onClick: function () { setShowAll(!showAll); } }, showAll ? "Réduire" : "Voir tout") : null
      ),
      h("div", { className: "upcoming-list" },
        shown.map(function (day, offset) {
          return h("button", { key: day.id, type: "button", className: "upcoming-card", onClick: function () { props.onSelect(props.selected + offset + 1); } },
            h("div", { className: "upcoming-date" }, h("strong", null, "J" + day.number), h("small", null, day.dateLabel)),
            h("div", { className: "upcoming-main" },
              h("span", { className: "island-chip" }, day.island),
              h("strong", null, day.title),
              h("div", { className: "upcoming-meta" },
                day.cash ? h("span", null, h(SvgIcon, { name: "wallet", size: 14 }), " " + day.cash) : null,
                day.hotel ? h("span", null, h(SvgIcon, { name: "map", size: 14 }), " " + day.hotel) : null
              )
            ),
            h("span", { className: "upcoming-arrow" }, h(SvgIcon, { name: "right", size: 19 }))
          );
        })
      )
    );
  }

  function TransportCards(props) {
    var state = useState({});
    var open = state[0];
    var setOpen = state[1];
    if (!props.day.transports.length) return null;

    return h("section", { className: "section-block" },
      h("div", { className: "section-title" }, h("div", null, h("span", { className: "kicker" }, "Se déplacer"), h("h2", null, "Transports & billets"))),
      h("div", { className: "transport-stack" },
        props.day.transports.map(function (trip, index) {
          var time = trip.rows.find(function (row) { return /horaire/i.test(row.key); });
          var pay = trip.rows.find(function (row) { return /paiement/i.test(row.key); });
          var expanded = !!open[index];
          return h("article", { key: trip.name + index, className: "transport-card tone-" + trip.tone },
            h("button", { type: "button", className: "transport-head", onClick: function () {
              var next = Object.assign({}, open);
              next[index] = !expanded;
              setOpen(next);
            } },
              h("div", null,
                h("strong", null, trip.name),
                h("div", { className: "transport-meta" },
                  time ? h("span", null, h(SvgIcon, { name: "clock", size: 15 }), " " + time.text) : null,
                  pay ? h("span", null, pay.text) : null
                )
              ),
              h("span", { className: "chev" + (expanded ? " open" : "") }, h(SvgIcon, { name: "right", size: 18 }))
            ),
            expanded ? h("div", { className: "transport-details" },
              trip.rows.map(function (row) {
                return h("div", { className: "detail-row", key: row.key },
                  h("span", null, row.key),
                  h("div", { dangerouslySetInnerHTML: { __html: row.html } })
                );
              })
            ) : null
          );
        })
      )
    );
  }

  function Notes(props) {
    if (!props.day.notes.length) return null;
    var notes = props.day.notes.slice().sort(function (a, b) {
      var weight = { urgent: 0, attention: 1, info: 2, success: 3, accent: 4 };
      return (weight[a.tone] || 5) - (weight[b.tone] || 5);
    });
    return h("section", { className: "section-block" },
      h("div", { className: "section-title" }, h("div", null, h("span", { className: "kicker" }, "À garder en tête"), h("h2", null, "Repères utiles"))),
      h("div", { className: "note-grid" },
        notes.map(function (note, index) {
          return h("details", { key: note.title + index, className: "note-card tone-" + note.tone },
            h("summary", null, h("strong", null, note.title || "Bon à savoir"), h("span", null, h(SvgIcon, { name: "right", size: 17 }))),
            h(Rich, { html: note.html })
          );
        })
      )
    );
  }

  function TripView(props) {
    var todayIndex = travelDayIndex();
    var selected = props.data.days[props.selectedDay] || props.data.days[0];

    function select(index) {
      var safe = Math.max(0, Math.min(props.data.days.length - 1, index));
      props.setSelectedDay(safe);
      history.replaceState(null, "", "#j" + (safe + 1));
      requestAnimationFrame(function () {
        var target = document.querySelector(".day-focus");
        if (target) {
          var header = document.querySelector(".app-header");
          var rail = document.querySelector(".day-rail-wrap");
          var offset = (header ? header.offsetHeight : 107) + (rail ? rail.offsetHeight : 72) + 8;
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: "smooth" });
        }
      });
    }

    return h("main", { className: "page trip-page" },
      h(JourneyHero, {
        status: props.status,
        currentDay: todayIndex >= 0 ? props.data.days[todayIndex] : null,
        onToday: function () { if (todayIndex >= 0) select(todayIndex); }
      }),
      h(DayRail, { days: props.data.days, selected: props.selectedDay, onSelect: select, todayIndex: todayIndex }),
      h(DayFocus, {
        key: selected.id,
        day: selected,
        selected: props.selectedDay,
        total: props.data.days.length,
        onPrevious: function () { select(props.selectedDay - 1); },
        onNext: function () { select(props.selectedDay + 1); },
        isToday: props.selectedDay === todayIndex,
        contacts: props.data.contacts
      }),
      h(UpcomingDays, { days: props.data.days, selected: props.selectedDay, onSelect: select }),
      h(TransportCards, { day: selected }),
      h(Notes, { day: selected }),
      h("details", { className: "full-source" },
        h("summary", null, h(SvgIcon, { name: "list", size: 18 }), " Voir la fiche complète du jour"),
        h(Rich, { html: selected.rawHtml, className: "raw-day" })
      )
    );
  }

  function ProgressRing(props) {
    var safe = Math.max(0, Math.min(100, props.value));
    return h("div", { className: "progress-ring", style: { "--p": safe + "%" } },
      h("div", null, h("strong", null, safe + "%"), h("span", null, "prêt"))
    );
  }

  function PrepareView(props) {
    var subState = useState("tasks");
    var subview = subState[0];
    var setSubview = subState[1];
    var forceState = useState(0);
    var force = forceState[1];
    var filterState = useState("todo");
    var packFilter = filterState[0];
    var setPackFilter = filterState[1];

    var taskDone = props.data.tasks.filter(function (task) { return storeGet("cyclades-task-" + task.id) === "1"; }).length;
    var allPack = [].concat.apply([], props.data.packCategories.map(function (category) { return category.items; }));
    var packDone = allPack.filter(function (item) { return storeGet("cyclades-pack-" + item.id) === "1"; }).length;
    var total = props.data.tasks.length + allPack.length;
    var done = taskDone + packDone;
    var percent = total ? Math.round(done / total * 100) : 0;

    function toggleTask(task) {
      var key = "cyclades-task-" + task.id;
      storeSet(key, storeGet(key) === "1" ? "0" : "1");
      force(function (n) { return n + 1; });
    }

    function togglePack(item) {
      var key = "cyclades-pack-" + item.id;
      storeSet(key, storeGet(key) === "1" ? "0" : "1");
      force(function (n) { return n + 1; });
    }

    var subnav = h("nav", { className: "subtabs" },
      [["tasks", "Priorités"], ["pack", "Valise"], ["cash", "Espèces"]].map(function (tab) {
        return h("button", { key: tab[0], type: "button", className: subview === tab[0] ? "active" : "", onClick: function () { setSubview(tab[0]); } }, tab[1]);
      })
    );

    var body = null;
    if (subview === "tasks") {
      var sortedTasks = props.data.tasks.slice().sort(function (a, b) {
        return Number(storeGet("cyclades-task-" + a.id) === "1") - Number(storeGet("cyclades-task-" + b.id) === "1");
      });
      body = h("section", { className: "section-block" },
        h("div", { className: "section-title" }, h("div", null, h("span", { className: "kicker" }, taskDone + "/" + props.data.tasks.length + " terminées"), h("h2", null, "Ce qui reste à faire"))),
        h("div", { className: "task-list" },
          sortedTasks.map(function (task) {
            var checked = storeGet("cyclades-task-" + task.id) === "1";
            return h("article", { key: task.id, className: "task-card tone-" + task.tone + (checked ? " done" : "") },
              h("button", { className: "check-btn", type: "button", onClick: function () { toggleTask(task); }, "aria-label": checked ? "Marquer à faire" : "Marquer terminé" },
                checked ? h(SvgIcon, { name: "check", size: 18 }) : null
              ),
              h("div", null, h("strong", null, task.title), h(Rich, { html: task.html }))
            );
          })
        )
      );
    } else if (subview === "pack") {
      body = h("section", { className: "section-block" },
        h("div", { className: "section-title" },
          h("div", null, h("span", { className: "kicker" }, packDone + "/" + allPack.length + " préparés"), h("h2", null, "Valise")),
          h("div", { className: "mini-toggle" },
            h("button", { type: "button", className: packFilter === "todo" ? "active" : "", onClick: function () { setPackFilter("todo"); } }, "À prendre"),
            h("button", { type: "button", className: packFilter === "all" ? "active" : "", onClick: function () { setPackFilter("all"); } }, "Tout")
          )
        ),
        h("div", { className: "pack-stack" },
          props.data.packCategories.map(function (category) {
            var visible = category.items.filter(function (item) {
              return packFilter === "all" || storeGet("cyclades-pack-" + item.id) !== "1";
            });
            if (!visible.length && packFilter === "todo") return null;
            return h("article", { className: "pack-card", key: category.id },
              h("h3", null, category.title),
              visible.map(function (item) {
                var checked = storeGet("cyclades-pack-" + item.id) === "1";
                return h("label", { key: item.id, className: "pack-item" + (checked ? " done" : "") },
                  h("input", { type: "checkbox", checked: checked, onChange: function () { togglePack(item); } }),
                  h("span", null, h("strong", null, item.name), item.note ? h("small", null, item.note) : null)
                );
              })
            );
          })
        ),
        props.data.prepNotes.length ? h("details", { className: "prep-notes" },
          h("summary", null, "Conseils pratiques"),
          props.data.prepNotes.map(function (note) {
            return h("div", { key: note.title, className: "prep-note" }, h("strong", null, note.title), h(Rich, { html: note.html }));
          })
        ) : null
      );
    } else {
      body = h("section", { className: "section-block" },
        h("div", { className: "section-title" }, h("div", null, h("span", { className: "kicker" }, "Budget pratique"), h("h2", null, "Espèces à prévoir"))),
        h(Rich, { html: props.data.cashHtml, className: "cash-source" })
      );
    }

    return h("main", { className: "page prepare-page" },
      h("section", { className: "prepare-hero" },
        h("div", null,
          h("span", { className: "eyebrow" }, "Avant de partir"),
          h("h1", null, "Préparer sans rien oublier"),
          h("p", null, "Les éléments terminés s’effacent du chemin, mais restent accessibles à tout moment.")
        ),
        h(ProgressRing, { value: percent })
      ),
      h("div", { className: "prepare-stats" },
        h("div", null, h("strong", null, props.data.tasks.length - taskDone), h("span", null, "actions restantes")),
        h("div", null, h("strong", null, allPack.length - packDone), h("span", null, "à mettre dans la valise"))
      ),
      subnav,
      body
    );
  }

  function InfoView(props) {
    var state = useState(props.data.infoSections.length ? props.data.infoSections[0].id : "");
    var openId = state[0];
    var setOpenId = state[1];
    return h("main", { className: "page info-page" },
      h("section", { className: "info-hero" },
        h("div", null,
          h("span", { className: "eyebrow" }, "Sur place"),
          h("h1", null, "Tout retrouver rapidement"),
          h("p", null, "Contacts, transports, budget et références sont accessibles sans fouiller une longue page.")
        ),
        h("button", { className: "search-card", type: "button", onClick: props.onSearch }, h(SvgIcon, { name: "search", size: 20 }), " Rechercher dans le voyage")
      ),
      h("a", { className: "emergency-card", href: "tel:112" },
        h("div", null, h("span", null, "Urgence en Grèce"), h("strong", null, "112")),
        h("span", { className: "emergency-call" }, h(SvgIcon, { name: "phone", size: 20 }), " Appeler")
      ),
      h("section", { className: "section-block" },
        h("div", { className: "section-title" }, h("div", null, h("span", { className: "kicker" }, "Références"), h("h2", null, "Informations utiles"))),
        h("div", { className: "info-accordions" },
          props.data.infoSections.map(function (section) {
            var isOpen = openId === section.id;
            return h("article", { key: section.id, className: "info-accordion" + (isOpen ? " open" : "") },
              h("button", { type: "button", onClick: function () { setOpenId(isOpen ? "" : section.id); } },
                h("span", null, section.title),
                h("span", { className: "chev" }, h(SvgIcon, { name: "right", size: 18 }))
              ),
              isOpen ? h(Rich, { html: section.html }) : null
            );
          })
        )
      )
    );
  }

  function SearchOverlay(props) {
    var state = useState("");
    var query = state[0];
    var setQuery = state[1];
    var inputRef = useRef(null);

    useEffect(function () {
      if (props.open) setTimeout(function () { if (inputRef.current) inputRef.current.focus(); }, 50);
      else setQuery("");
    }, [props.open]);

    var results = useMemo(function () {
      var q = norm(query).toLocaleLowerCase("fr");
      if (!q) return [];
      var items = [];
      props.data.days.forEach(function (day, dayIndex) {
        if ((day.title + " " + day.meta).toLocaleLowerCase("fr").indexOf(q) >= 0) {
          items.push({ type: "Jour " + day.number, title: day.title, text: day.meta, view: "trip", dayIndex: dayIndex });
        }
        day.timeline.forEach(function (entry) {
          if ((entry.time + " " + entry.text).toLocaleLowerCase("fr").indexOf(q) >= 0) {
            items.push({ type: "J" + day.number + " · Programme", title: entry.time + " · " + entry.text, text: day.title, view: "trip", dayIndex: dayIndex });
          }
        });
        day.transports.forEach(function (trip) {
          var text = trip.name + " " + trip.rows.map(function (row) { return row.text; }).join(" ");
          if (text.toLocaleLowerCase("fr").indexOf(q) >= 0) {
            items.push({ type: "J" + day.number + " · Transport", title: trip.name, text: text, view: "trip", dayIndex: dayIndex });
          }
        });
      });
      props.data.tasks.forEach(function (task) {
        var text = task.title + " " + task.html.replace(/<[^>]+>/g, " ");
        if (text.toLocaleLowerCase("fr").indexOf(q) >= 0) items.push({ type: "Préparer", title: task.title, text: norm(text), view: "prepare" });
      });
      props.data.infoSections.forEach(function (section) {
        var text = section.title + " " + section.html.replace(/<[^>]+>/g, " ");
        if (text.toLocaleLowerCase("fr").indexOf(q) >= 0) items.push({ type: "Infos", title: section.title, text: norm(text), view: "info" });
      });
      return items.slice(0, 24);
    }, [query, props.data]);

    if (!props.open) return null;
    return h("div", { className: "search-overlay", role: "dialog", "aria-modal": "true", "aria-label": "Recherche" },
      h("div", { className: "search-panel" },
        h("div", { className: "search-box" },
          h(SvgIcon, { name: "search", size: 20 }),
          h("input", { ref: inputRef, type: "search", value: query, onInput: function (event) { setQuery(event.target.value); }, placeholder: "Ferry, hôtel, taxi, volcan…" }),
          h("button", { type: "button", onClick: props.onClose }, "Fermer")
        ),
        h("div", { className: "search-results" },
          !query ? h("div", { className: "search-empty" }, h("strong", null, "Recherche globale"), h("p", null, "Tape un lieu, un horaire, un transport, un restaurant ou une information pratique.")) : null,
          query && !results.length ? h("div", { className: "search-empty" }, h("strong", null, "Aucun résultat"), h("p", null, "Essaie un terme plus court.")) : null,
          results.map(function (result, index) {
            return h("button", { key: result.title + index, type: "button", className: "search-result", onClick: function () { props.onNavigate(result); } },
              h("span", null, result.type),
              h("strong", null, result.title),
              h("small", null, result.text.slice(0, 145) + (result.text.length > 145 ? "…" : ""))
            );
          })
        )
      )
    );
  }

  function App() {
    var dataState = useState(null);
    var data = dataState[0];
    var setData = dataState[1];
    var errorState = useState("");
    var error = errorState[0];
    var setError = errorState[1];
    var hashMatch = location.hash.match(/^#j(\d+)$/);
    var current = travelDayIndex();
    var initialDay = hashMatch ? Math.max(0, Math.min(9, Number(hashMatch[1]) - 1)) : Math.max(0, current);
    var dayState = useState(initialDay);
    var selectedDay = dayState[0];
    var setSelectedDay = dayState[1];
    var viewState = useState(storeGet("cyclades-v4-view") || "trip");
    var view = viewState[0];
    var setViewState = viewState[1];
    var searchState = useState(false);
    var searchOpen = searchState[0];
    var setSearchOpen = searchState[1];
    var status = tripStatus();

    useEffect(function () {
      fetch("./trip-data.html", { cache: "no-store" })
        .then(function (response) {
          if (!response.ok) throw new Error("Impossible de charger les données du voyage.");
          return response.text();
        })
        .then(function (text) { setData(parseSource(text)); })
        .catch(function (err) { setError(err.message || "Erreur de chargement."); });
    }, []);

    function setView(next) {
      setViewState(next);
      storeSet("cyclades-v4-view", next);
      if (next !== "trip") history.replaceState(null, "", "#" + next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function navigate(result) {
      setSearchOpen(false);
      if (result.view === "trip") {
        setViewState("trip");
        storeSet("cyclades-v4-view", "trip");
        if (typeof result.dayIndex === "number") {
          setSelectedDay(result.dayIndex);
          history.replaceState(null, "", "#j" + (result.dayIndex + 1));
        }
      } else setView(result.view);
      setTimeout(function () { window.scrollTo({ top: 0, behavior: "smooth" }); }, 40);
    }

    if (error) {
      return h("div", { className: "fatal" }, h("strong", null, "Impossible d’ouvrir Cyclades"), h("p", null, error), h("button", { onClick: function () { location.reload(); } }, "Réessayer"));
    }
    if (!data) {
      return h("div", { className: "boot" }, h("div", { className: "boot-mark" }), h("strong", null, "Cyclades"), h("span", null, "Préparation du voyage…"));
    }

    return h(Fragment, null,
      h(Header, { view: view, setView: setView, onSearch: function () { setSearchOpen(true); }, status: status }),
      h("div", { className: "app-shell" },
        view === "trip" ? h(TripView, { data: data, selectedDay: selectedDay, setSelectedDay: setSelectedDay, status: status }) : null,
        view === "prepare" ? h(PrepareView, { data: data }) : null,
        view === "info" ? h(InfoView, { data: data, onSearch: function () { setSearchOpen(true); } }) : null
      ),
      h(SearchOverlay, { data: data, open: searchOpen, onClose: function () { setSearchOpen(false); }, onNavigate: navigate })
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(h(App));
})();
