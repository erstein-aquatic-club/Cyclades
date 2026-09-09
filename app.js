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


  function enrichmentRoot() {
    return window.CYCLADES_ENRICHMENT || { places: {}, days: {}, resources: {} };
  }

  function enrichmentDay(dayId) {
    return enrichmentRoot().days[dayId] || { points: [], legs: [], featured: [] };
  }

  function operationalDay(dayId) {
    var operational = enrichmentRoot().operational || {};
    return operational.days && operational.days[dayId] ? operational.days[dayId] : [];
  }

  function operationalGlobal() {
    var operational = enrichmentRoot().operational || {};
    return operational.global || [];
  }

  function riskWeight(level) {
    return level === "critical" ? 3 : level === "attention" ? 2 : level === "info" ? 1 : 0;
  }

  function dayRiskLevel(dayId) {
    var unresolved = operationalDay(dayId).filter(function (alert) {
      return alert.level !== "ok" && storeGet("cyclades-risk-" + alert.id) !== "1";
    });
    var best = "";
    var weight = 0;
    unresolved.forEach(function (alert) {
      var next = riskWeight(alert.level);
      if (next > weight) { weight = next; best = alert.level; }
    });
    return best;
  }

  function enrichedPlace(placeKey) {
    return enrichmentRoot().places[placeKey] || null;
  }

  function resourceForKey(key) {
    return enrichmentRoot().resources[key] || null;
  }

  function enrichedPlaceByName(name) {
    var target = simpleText(name);
    if (!target) return null;
    var places = enrichmentRoot().places || {};
    var keys = Object.keys(places);
    for (var i = 0; i < keys.length; i++) {
      var place = places[keys[i]];
      var candidate = simpleText(place.name);
      if (candidate === target || candidate.indexOf(target) >= 0 || target.indexOf(candidate) >= 0) {
        return { placeKey: keys[i], place: place };
      }
    }
    return null;
  }

  function simpleText(value) {
    return norm(value).toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function placeForText(dayId, text) {
    var target = simpleText(text);
    if (!target) return null;
    var dayMeta = enrichmentDay(dayId);
    for (var i = 0; i < dayMeta.points.length; i++) {
      var point = dayMeta.points[i];
      var place = enrichedPlace(point.place);
      if (!place) continue;
      var words = simpleText(place.name).split(/[^a-z0-9]+/).filter(function (word) { return word.length >= 4; });
      var score = words.filter(function (word) { return target.indexOf(word) >= 0; }).length;
      if (score >= Math.min(2, words.length) || (words.length === 1 && score === 1)) {
        return { placeKey: point.place, pointId: point.id, place: place };
      }
    }
    return null;
  }

  function InfoDot(props) {
    return h("button", {
      type: "button",
      className: "info-dot",
      onClick: function (event) {
        event.preventDefault();
        event.stopPropagation();
        props.onClick();
      },
      "aria-label": "Plus d’informations"
    }, "i");
  }

  function PlaceSheet(props) {
    if (!props.info || !props.info.place) return null;
    var place = props.info.place;
    var name = simpleText(place.name);
    var contact = (props.contacts || []).find(function (item) {
      var contactName = simpleText(item.name);
      return contactName.indexOf(name) >= 0 || name.indexOf(contactName) >= 0;
    });
    var phoneHref = contact && contact.tel ? contact.tel : (place.phone || "");
    var siteHref = place.site || "";

    return h("div", {
      className: "place-sheet-backdrop",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": place.name,
      onClick: function (event) { if (event.target === event.currentTarget) props.onClose(); }
    },
      h("article", { className: "place-sheet" },
        h("div", { className: "sheet-handle" }),
        place.image ? h("div", { className: "place-sheet-image" },
          h("img", { src: place.image, alt: place.name, loading: "lazy" }),
          place.imageCredit ? h("a", { href: place.imageSource, target: "_blank", rel: "noopener", className: "image-credit" }, place.imageCredit) : null
        ) : h("div", { className: "place-sheet-image placeholder" },
          h("div", { className: "place-monogram" }, place.name.charAt(0))
        ),
        h("div", { className: "place-sheet-body" },
          h("div", { className: "sheet-title-row" },
            h("div", null,
              props.info.pointId ? h("span", { className: "point-badge" }, "Point " + props.info.pointId) : null,
              h("h2", null, place.name)
            ),
            h("button", { type: "button", className: "sheet-close", onClick: props.onClose, "aria-label": "Fermer" }, "×")
          ),
          h("p", { className: "place-blurb" }, place.blurb || ""),
          h("div", { className: "sheet-actions" },
            h("a", {
              href: "https://maps.apple.com/?ll=" + place.lat + "," + place.lng + "&q=" + encodeURIComponent(place.name),
              target: "_blank", rel: "noopener", className: "sheet-action primary"
            }, h(SvgIcon, { name: "map", size: 18 }), " Ouvrir dans Plans"),
            phoneHref ? h("a", { href: phoneHref, className: "sheet-action" }, h(SvgIcon, { name: "phone", size: 18 }), " Appeler") : null,
            siteHref ? h("a", { href: siteHref, target: "_blank", rel: "noopener", className: "sheet-action" }, "↗ " + (place.siteLabel || "Site")) : null,
            (place.actions || []).map(function (action) {
              var isExternal = /^https?:/i.test(action.href || "");
              return h("a", {
                key: action.label,
                href: action.href,
                target: isExternal ? "_blank" : null,
                rel: isExternal ? "noopener" : null,
                className: "sheet-action contextual"
              }, action.label);
            })
          ),
          contact ? h("div", { className: "sheet-contact" },
            h("span", null, "Contact / référence"),
            h("strong", null, contact.name),
            h(Rich, { html: contact.html })
          ) : null,
          place.imageSource ? h("a", { href: place.imageSource, target: "_blank", rel: "noopener", className: "source-link" }, "Voir la source de l’aperçu") : null
        )
      )
    );
  }

  function transportRow(trip, pattern) {
    if (!trip) return null;
    return trip.rows.find(function (row) { return pattern.test(row.key); }) || null;
  }

  function DayMap(props) {
    var dayMeta = enrichmentDay(props.day.id);
    var mapNode = useRef(null);
    var mapRef = useRef(null);
    var lineRefs = useRef([]);
    var userMarker = useRef(null);
    var legState = useState(null);
    var selectedLeg = legState[0];
    var setSelectedLeg = legState[1];
    var locateState = useState("");
    var locateStatus = locateState[0];
    var setLocateStatus = locateState[1];

    var points = dayMeta.points.map(function (point) {
      var place = enrichedPlace(point.place);
      return place ? { id: point.id, placeKey: point.place, place: place } : null;
    }).filter(Boolean);

    function pointById(id) {
      return points.find(function (point) { return point.id === id; }) || null;
    }

    function pathForLeg(leg) {
      var ids = [leg.from].concat(leg.via || []).concat([leg.to]);
      return ids.map(function (id) {
        var point = pointById(id);
        return point ? [point.place.lat, point.place.lng] : null;
      }).filter(Boolean);
    }

    useEffect(function () {
      if (!mapNode.current || !window.L || !points.length) return;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      lineRefs.current = [];
      setSelectedLeg(null);

      var map = window.L.map(mapNode.current, {
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false
      });
      mapRef.current = map;
      window.L.control.zoom({ position: "bottomright" }).addTo(map);
      window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors"
      }).addTo(map);

      var allLatLngs = [];
      points.forEach(function (point) {
        var latLng = [point.place.lat, point.place.lng];
        allLatLngs.push(latLng);
        var marker = window.L.marker(latLng, {
          icon: window.L.divIcon({
            className: "route-marker-wrap",
            html: '<span class="route-marker">' + point.id + "</span>",
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          })
        }).addTo(map);
        marker.bindTooltip(point.place.name, { direction: "top", offset: [0, -11] });
        marker.on("click", function () {
          props.onPlaceInfo({ placeKey: point.placeKey, pointId: point.id, place: point.place });
        });
      });

      dayMeta.legs.forEach(function (leg) {
        var path = pathForLeg(leg);
        if (path.length < 2) {
          lineRefs.current.push(null);
          return;
        }
        var line = window.L.polyline(path, {
          color: "#0b6da8",
          weight: 4,
          opacity: 0.48,
          dashArray: leg.transportIndexes && leg.transportIndexes.length ? null : "8 8"
        }).addTo(map);
        lineRefs.current.push(line);
      });

      if (allLatLngs.length) {
        map.fitBounds(allLatLngs, { padding: [26, 26], maxZoom: 13 });
      }

      setTimeout(function () { if (mapRef.current) mapRef.current.invalidateSize(); }, 60);
      return function () {
        if (mapRef.current) mapRef.current.remove();
        mapRef.current = null;
      };
    }, [props.day.id]);

    useEffect(function () {
      lineRefs.current.forEach(function (line, index) {
        if (!line) return;
        line.setStyle({
          weight: index === selectedLeg ? 7 : 4,
          opacity: selectedLeg === null ? 0.48 : index === selectedLeg ? 0.92 : 0.18,
          color: index === selectedLeg ? "#c86b4a" : "#0b6da8"
        });
      });
      if (selectedLeg !== null && lineRefs.current[selectedLeg] && mapRef.current) {
        var bounds = lineRefs.current[selectedLeg].getBounds();
        if (bounds.isValid()) mapRef.current.fitBounds(bounds, { padding: [42, 42], maxZoom: 14 });
      }
    }, [selectedLeg]);

    function locateMe() {
      if (!navigator.geolocation) {
        setLocateStatus("Géolocalisation indisponible");
        return;
      }
      setLocateStatus("Localisation…");
      navigator.geolocation.getCurrentPosition(function (position) {
        var latLng = [position.coords.latitude, position.coords.longitude];
        setLocateStatus("Position affichée");
        if (!mapRef.current || !window.L) return;
        if (userMarker.current) userMarker.current.remove();
        userMarker.current = window.L.circleMarker(latLng, {
          radius: 8, weight: 4, color: "#ffffff", fillColor: "#c86b4a", fillOpacity: 1
        }).addTo(mapRef.current).bindTooltip("Ma position");
        mapRef.current.setView(latLng, 14);
      }, function () {
        setLocateStatus("Position non disponible");
      }, { enableHighAccuracy: true, timeout: 9000, maximumAge: 60000 });
    }

    if (!points.length) return null;
    var activeLeg = selectedLeg !== null ? dayMeta.legs[selectedLeg] : null;

    return h("section", { className: "section-block map-section" },
      h("div", { className: "section-title map-title" },
        h("div", null, h("span", { className: "kicker" }, "A → B → C"), h("h2", null, "La journée sur la carte")),
        h("button", { className: "locate-btn", type: "button", onClick: locateMe }, h("span", { className: "locate-pulse" }), locateStatus || "Ma position")
      ),
      h("div", { className: "map-shell" },
        h("div", { ref: mapNode, className: "day-map", "aria-label": "Carte du parcours de la journée" }),
        h("div", { className: "map-caption" }, "Touchez un point ou un trajet pour approfondir")
      ),
      h("div", { className: "leg-strip" },
        dayMeta.legs.map(function (leg, index) {
          var firstTrip = leg.transportIndexes && leg.transportIndexes.length ? props.day.transports[leg.transportIndexes[0]] : null;
          var mode = transportRow(firstTrip, /mode/i);
          var timing = transportRow(firstTrip, /horaire/i);
          return h("button", {
            key: leg.title + index,
            type: "button",
            className: "leg-chip" + (selectedLeg === index ? " active" : ""),
            onClick: function () { setSelectedLeg(index); }
          },
            h("span", { className: "leg-points" }, leg.from + " → " + leg.to),
            h("strong", null, leg.title),
            h("small", null, [mode ? mode.text : "", timing ? timing.text : ""].filter(Boolean).join(" · ") || "Voir les options")
          );
        })
      ),
      activeLeg ? h("article", { className: "leg-detail" },
        h("div", { className: "leg-detail-head" },
          h("div", null, h("span", { className: "point-badge" }, activeLeg.from + " → " + activeLeg.to), h("h3", null, activeLeg.title)),
          h("a", {
            href: (function () {
              var from = pointById(activeLeg.from);
              var to = pointById(activeLeg.to);
              if (!from || !to) return "#";
              return "https://maps.apple.com/?saddr=" + from.place.lat + "," + from.place.lng + "&daddr=" + to.place.lat + "," + to.place.lng;
            })(),
            target: "_blank", rel: "noopener", className: "mini-map-link"
          }, h(SvgIcon, { name: "map", size: 16 }), " Plans")
        ),
        activeLeg.guide ? h("div", { className: "bus-guide" },
          h("div", { className: "bus-guide-head" },
            h("span", { className: "bus-guide-kicker" }, activeLeg.guide.label || "Mode d’emploi"),
            activeLeg.guide.mapUrl ? h("a", { href: activeLeg.guide.mapUrl, target: "_blank", rel: "noopener", className: "bus-guide-map" },
              h(SvgIcon, { name: "map", size: 15 }), " Ouvrir l’arrêt"
            ) : null
          ),
          activeLeg.guide.board ? h("div", { className: "bus-guide-row" }, h("span", null, "📍 Où monter"), h("strong", null, activeLeg.guide.board)) : null,
          activeLeg.guide.line ? h("div", { className: "bus-guide-row" }, h("span", null, "🚌 Ligne"), h("strong", null, activeLeg.guide.line)) : null,
          activeLeg.guide.direction ? h("div", { className: "bus-guide-row" }, h("span", null, "➡️ Direction"), h("strong", null, activeLeg.guide.direction)) : null,
          activeLeg.guide.timing ? h("div", { className: "bus-guide-row" }, h("span", null, "🕐 Horaire"), h("strong", null, activeLeg.guide.timing)) : null,
          activeLeg.guide.fare ? h("div", { className: "bus-guide-row" }, h("span", null, "💶 Billet"), h("strong", null, activeLeg.guide.fare)) : null,
          activeLeg.guide.alight ? h("div", { className: "bus-guide-row" }, h("span", null, "🚏 Où descendre"), h("strong", null, activeLeg.guide.alight)) : null,
          activeLeg.guide.action ? h("div", { className: "bus-guide-tip" }, activeLeg.guide.action) : null
        ) : null,
        activeLeg.transportIndexes ? activeLeg.transportIndexes.map(function (transportIndex) {
          var trip = props.day.transports[transportIndex];
          if (!trip) return null;
          var mode = transportRow(trip, /mode/i);
          var timing = transportRow(trip, /horaire/i);
          var payment = transportRow(trip, /paiement/i);
          var where = transportRow(trip, /où/i);
          return h("div", { className: "travel-option", key: transportIndex },
            h("div", { className: "option-title" }, h("strong", null, trip.name), trip.tone === "critical" ? h("span", null, "Réservé / critique") : null),
            h("div", { className: "option-grid" },
              mode ? h("div", null, h("span", null, "Mode"), h("strong", null, mode.text)) : null,
              timing ? h("div", null, h("span", null, "Horaire"), h("strong", null, timing.text)) : null,
              payment ? h("div", null, h("span", null, "Paiement"), h("strong", null, payment.text)) : null
            ),
            where ? h("div", { className: "option-where" }, h("span", null, "Où / billet"), h("div", { dangerouslySetInnerHTML: { __html: where.html } })) : null
          );
        }) : null,
        activeLeg.options ? activeLeg.options.map(function (option, index) {
          return h("div", { className: "manual-option", key: option.label + index },
            h("strong", null, option.label), h("span", null, option.detail)
          );
        }) : null,
        activeLeg.resources && activeLeg.resources.length ? h("div", { className: "resource-links" },
          activeLeg.resources.map(function (key) {
            var resource = resourceForKey(key);
            return resource ? h("a", { key: key, href: resource.url, target: "_blank", rel: "noopener" }, resource.label) : null;
          })
        ) : null
      ) : null,
      h("div", { className: "place-strip" },
        points.map(function (point) {
          return h("button", {
            key: point.id,
            type: "button",
            className: "place-preview",
            onClick: function () { props.onPlaceInfo({ placeKey: point.placeKey, pointId: point.id, place: point.place }); }
          },
            point.place.image ? h("img", { src: point.place.image, alt: "", loading: "lazy" }) :
              h("span", { className: "place-preview-placeholder" }, point.id),
            h("span", { className: "place-preview-copy" },
              h("small", null, "Point " + point.id),
              h("strong", null, point.place.name)
            ),
            h("span", { className: "place-info-mark" }, "i")
          );
        })
      )
    );
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
          var risk = dayRiskLevel(day.id);
          if (risk) classes += " has-risk risk-" + risk;
          return h("button", {
            key: day.id,
            className: classes,
            type: "button",
            onClick: function () { props.onSelect(index); }
          },
            h("span", { className: "day-num" }, "J" + day.number, risk ? h("i", { className: "day-risk-dot", "aria-hidden": "true" }) : null),
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
          var matchedPlace = placeForText(day.id, item.text);
          var cls = "timeline-row tone-" + item.tone + (isNext ? " next" : "") + (isPast ? " past" : "");
          return h("div", { key: item.time + "-" + originalIndex, className: cls },
            h("div", { className: "timeline-time" }, item.time || "—"),
            h("div", { className: "timeline-dot" }),
            h("div", { className: "timeline-body" },
              isNext ? h("span", { className: "next-badge" }, "Prochaine étape") : null,
              h("div", { className: "timeline-copy", dangerouslySetInnerHTML: { __html: item.html || item.text } }),
              matchedPlace && props.onPlaceInfo ? h(InfoDot, { onClick: function () { props.onPlaceInfo(matchedPlace); } }) : null
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
    var hotelInfo = enrichedPlaceByName(day.hotel);
    var hotelPhone = contact && contact.tel ? contact.tel : (hotelInfo && hotelInfo.place.phone ? hotelInfo.place.phone : "");

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
        day.hotel ? h("div", { className: "fact fact-with-info" },
          h("span", null, h(SvgIcon, { name: "map", size: 18 }), " Nuit"),
          h("strong", null, day.hotel),
          hotelInfo && props.onPlaceInfo ? h(InfoDot, { onClick: function () { props.onPlaceInfo(hotelInfo); } }) : null
        ) : null
      ),
      day.hotel ? h("div", { className: "quick-actions" },
        h("a", { className: "action-btn", href: "https://maps.apple.com/?q=" + encodeURIComponent(day.hotel + " Grèce"), target: "_blank", rel: "noopener" }, h(SvgIcon, { name: "map", size: 18 }), " Itinéraire hôtel"),
        hotelPhone ? h("a", { className: "action-btn", href: hotelPhone }, h(SvgIcon, { name: "phone", size: 18 }), " Appeler") : null
      ) : null,
      h(Timeline, { day: day, isToday: props.isToday, onPlaceInfo: props.onPlaceInfo })
    );
  }


  function FrictionPanel(props) {
    var tickState = useState(0);
    var force = tickState[1];
    var expandedState = useState(false);
    var showResolved = expandedState[0];
    var setShowResolved = expandedState[1];
    var alerts = operationalDay(props.day.id);
    if (!alerts.length) return null;

    var pending = alerts.filter(function (alert) {
      return alert.level === "ok" || storeGet("cyclades-risk-" + alert.id) !== "1";
    });
    var resolved = alerts.filter(function (alert) {
      return alert.level !== "ok" && storeGet("cyclades-risk-" + alert.id) === "1";
    });
    var visible = pending.concat(showResolved ? resolved : []);

    function resolve(alert) {
      storeSet("cyclades-risk-" + alert.id, "1");
      force(function (n) { return n + 1; });
    }

    var openRisks = pending.filter(function (alert) { return alert.level !== "ok"; });
    var topLevel = openRisks.some(function (alert) { return alert.level === "critical"; }) ? "critical" :
      openRisks.some(function (alert) { return alert.level === "attention"; }) ? "attention" :
      openRisks.length ? "info" : "ok";

    return h("section", { className: "section-block friction-panel panel-" + topLevel },
      h("div", { className: "section-title friction-title" },
        h("div", null,
          h("span", { className: "kicker" }, openRisks.length ? "Pour ne pas se prendre la tête" : "Tout est sous contrôle"),
          h("h2", null, openRisks.length ? "À anticiper" : "Points vérifiés")
        ),
        openRisks.length ? h("span", { className: "friction-count" }, openRisks.length + " point" + (openRisks.length > 1 ? "s" : "")) : null
      ),
      h("div", { className: "friction-list" },
        visible.map(function (alert) {
          var isResolved = alert.level !== "ok" && storeGet("cyclades-risk-" + alert.id) === "1";
          return h("article", { key: alert.id, className: "friction-card level-" + alert.level + (isResolved ? " resolved" : "") },
            h("div", { className: "friction-icon" }, alert.level === "critical" ? "!" : alert.level === "attention" ? "!" : alert.level === "ok" ? "✓" : "i"),
            h("div", { className: "friction-copy" },
              h("div", { className: "friction-card-head" },
                h("strong", null, alert.title),
                alert.level === "critical" ? h("span", { className: "severity-tag" }, "Important") :
                  alert.level === "attention" ? h("span", { className: "severity-tag" }, "À vérifier") :
                  alert.level === "ok" ? h("span", { className: "severity-tag verified" }, "Vérifié") : null
              ),
              h("p", null, alert.text),
              alert.action ? h("div", { className: "friction-action" }, h("strong", null, "→ "), alert.action) : null,
              h("div", { className: "friction-tools" },
                alert.sourceUrl ? h("a", { href: alert.sourceUrl, target: "_blank", rel: "noopener" }, alert.sourceLabel || "Source") : null,
                alert.level !== "ok" && !isResolved ? h("button", { type: "button", onClick: function () { resolve(alert); } }, "C’est réglé") : null,
                isResolved ? h("span", { className: "resolved-label" }, "✓ Réglé") : null
              )
            )
          );
        })
      ),
      resolved.length ? h("button", { className: "show-resolved", type: "button", onClick: function () { setShowResolved(!showResolved); } },
        showResolved ? "Masquer les points réglés" : "Voir " + resolved.length + " point" + (resolved.length > 1 ? "s" : "") + " réglé" + (resolved.length > 1 ? "s" : "")
      ) : null
    );
  }

  function TravelReflexes() {
    var items = operationalGlobal();
    if (!items.length) return null;
    return h("section", { className: "travel-reflexes" },
      h("div", { className: "section-title" },
        h("div", null, h("span", { className: "kicker" }, "Derniers réflexes"), h("h2", null, "Avant chaque départ"))
      ),
      h("div", { className: "reflex-strip" },
        items.map(function (item) {
          return h("article", { className: "reflex-card level-" + item.level, key: item.id },
            h("span", { className: "reflex-mark" }, item.level === "attention" ? "!" : "i"),
            h("div", null,
              h("strong", null, item.title),
              h("p", null, item.text),
              item.actionUrl ? h("a", { href: item.actionUrl, target: "_blank", rel: "noopener" }, item.actionLabel || "Ouvrir") : null
            )
          );
        })
      )
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
    var dayMeta = enrichmentDay(props.day.id);
    if (!props.day.transports.length) return null;

    return h("section", { className: "section-block" },
      h("div", { className: "section-title" }, h("div", null, h("span", { className: "kicker" }, "Se déplacer"), h("h2", null, "Transports & billets"))),
      h("div", { className: "transport-stack" },
        props.day.transports.map(function (trip, index) {
          var time = trip.rows.find(function (row) { return /horaire/i.test(row.key); });
          var pay = trip.rows.find(function (row) { return /paiement/i.test(row.key); });
          var expanded = !!open[index];
          var resourceKeys = [];
          dayMeta.legs.forEach(function (leg) {
            if (leg.transportIndexes && leg.transportIndexes.indexOf(index) >= 0) {
              (leg.resources || []).forEach(function (key) {
                if (resourceKeys.indexOf(key) < 0) resourceKeys.push(key);
              });
            }
          });
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
              h("span", { className: "transport-head-tools" },
                h("span", { className: "transport-info-mark" }, "i"),
                h("span", { className: "chev" + (expanded ? " open" : "") }, h(SvgIcon, { name: "right", size: 18 }))
              )
            ),
            expanded ? h("div", { className: "transport-details" },
              trip.rows.map(function (row) {
                return h("div", { className: "detail-row", key: row.key },
                  h("span", null, row.key),
                  h("div", { dangerouslySetInnerHTML: { __html: row.html } })
                );
              }),
              resourceKeys.length ? h("div", { className: "resource-links transport-resources" },
                resourceKeys.map(function (key) {
                  var resource = resourceForKey(key);
                  return resource ? h("a", { key: key, href: resource.url, target: "_blank", rel: "noopener" }, resource.label) : null;
                })
              ) : null
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
        contacts: props.data.contacts,
        onPlaceInfo: props.onPlaceInfo
      }),
      h(FrictionPanel, { day: selected }),
      h(DayMap, { day: selected, onPlaceInfo: props.onPlaceInfo }),
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


  function PackingPlanner(props) {
    var packing = enrichmentRoot().packing || {};
    var scopeState = useState("couple");
    var scope = scopeState[0];
    var setScope = scopeState[1];
    var extrasState = useState("essential");
    var extrasFilter = extrasState[0];
    var setExtrasFilter = extrasState[1];
    var forceState = useState(0);
    var force = forceState[1];
    var factor = scope === "couple" ? (packing.people || 2) : 1;
    var wardrobe = packing.wardrobe || [];
    var extras = packing.extras || [];
    var allSmart = wardrobe.concat(extras);

    function itemKey(item) { return "cyclades-smart-pack-" + item.id; }
    function checked(item) { return storeGet(itemKey(item)) === "1"; }
    function toggle(item) {
      storeSet(itemKey(item), checked(item) ? "0" : "1");
      force(function (n) { return n + 1; });
    }
    function displayCount(item) {
      var base = Number(item.count || 1);
      if (scope === "person") return base;
      return item.per === "couple" ? base : base * factor;
    }
    function scopeLabel(item) {
      if (scope === "person") return "par personne";
      return item.per === "couple" ? "pour 2" : "au total";
    }

    var done = allSmart.filter(checked).length;
    var total = allSmart.length;
    var pct = total ? Math.round(done / total * 100) : 0;
    var wardrobeGroups = [];
    wardrobe.forEach(function (item) {
      if (wardrobeGroups.indexOf(item.group) < 0) wardrobeGroups.push(item.group);
    });

    var visibleExtras = extras.filter(function (item) {
      if (extrasFilter === "all") return true;
      return item.priority === "high";
    });

    return h("section", { className: "packing-planner" },
      h("section", { className: "packing-summary-card" },
        h("div", { className: "packing-summary-copy" },
          h("span", { className: "eyebrow" }, "Calculé depuis les 10 journées"),
          h("h2", null, "Une valise pensée pour le programme réel"),
          h("p", null, "La lessive de Naxos coupe le voyage en deux. On garde assez de marge pour J5/J6 sans transporter dix jours de vêtements.")
        ),
        h("div", { className: "packing-score" },
          h("strong", null, done + "/" + total),
          h("span", null, "catégories prêtes"),
          h("div", { className: "packing-progress" }, h("i", { style: { width: pct + "%" } }))
        )
      ),
      h("div", { className: "packing-facts" },
        h("div", null, h("strong", null, packing.summary ? packing.summary.outfitMoments : 17), h("span", null, "moments de tenue")),
        h("div", null, h("strong", null, packing.summary ? packing.summary.doubleOutfitDays.length : 7), h("span", null, "jours à 2 tenues")),
        h("div", null, h("strong", null, "1"), h("span", null, "lessive pivot"))
      ),
      h("div", { className: "packing-scope-row" },
        h("div", null,
          h("span", { className: "kicker" }, "Quantités"),
          h("strong", null, scope === "couple" ? "Pour vous deux" : "Par personne")
        ),
        h("div", { className: "mini-toggle packing-scope-toggle" },
          h("button", { type: "button", className: scope === "person" ? "active" : "", onClick: function () { setScope("person"); } }, "Par personne"),
          h("button", { type: "button", className: scope === "couple" ? "active" : "", onClick: function () { setScope("couple"); } }, "Pour 2")
        )
      ),

      h("section", { className: "packing-zone" },
        h("div", { className: "section-title" },
          h("div", null, h("span", { className: "kicker" }, "Capsule vêtements"), h("h2", null, "Combien prendre"))
        ),
        h("div", { className: "wardrobe-groups" },
          wardrobeGroups.map(function (group) {
            var items = wardrobe.filter(function (item) { return item.group === group; });
            return h("article", { className: "wardrobe-group", key: group },
              h("h3", null, group),
              items.map(function (item) {
                var isChecked = checked(item);
                return h("div", { className: "wardrobe-item" + (isChecked ? " done" : ""), key: item.id },
                  h("button", { className: "smart-check", type: "button", onClick: function () { toggle(item); }, "aria-label": isChecked ? "Marquer non préparé" : "Marquer préparé" },
                    isChecked ? h(SvgIcon, { name: "check", size: 16 }) : null
                  ),
                  h("div", { className: "wardrobe-count" },
                    h("strong", null, displayCount(item)),
                    h("span", null, item.unit || "pièce")
                  ),
                  h("div", { className: "wardrobe-copy" },
                    h("strong", null, item.label),
                    h("small", null, item.note),
                    h("em", null, scopeLabel(item))
                  )
                );
              })
            );
          })
        )
      ),

      h("section", { className: "packing-zone outfit-zone" },
        h("div", { className: "section-title" },
          h("div", null, h("span", { className: "kicker" }, "Pourquoi ces quantités"), h("h2", null, "Tenues jour par jour"))
        ),
        h("div", { className: "outfit-strip" },
          (packing.dayPlan || []).map(function (plan) {
            return h("article", { className: "outfit-card" + (plan.outfits > 1 ? " double" : ""), key: plan.day },
              h("div", { className: "outfit-card-top" },
                h("span", { className: "outfit-day" }, "J" + plan.day),
                h("span", { className: "outfit-count" }, plan.outfits + " tenue" + (plan.outfits > 1 ? "s" : ""))
              ),
              h("strong", null, plan.label),
              h("div", { className: "wear-chips" },
                (plan.wear || []).map(function (wear) { return h("span", { key: wear }, wear); })
              ),
              h("p", null, plan.note)
            );
          })
        ),
        h("article", { className: "laundry-plan" },
          h("div", { className: "laundry-icon" }, "↻"),
          h("div", null,
            h("span", { className: "kicker" }, packing.laundry ? packing.laundry.day : "J5"),
            h("strong", null, "La lessive est le pivot de la valise"),
            h("p", null, packing.laundry ? packing.laundry.strategy : ""),
            packing.laundry ? h("small", null, packing.laundry.place + " · dépôt : " + packing.laundry.deposit + " · retour : " + packing.laundry.return) : null
          )
        )
      ),

      h("section", { className: "packing-zone" },
        h("div", { className: "section-title" },
          h("div", null, h("span", { className: "kicker" }, "Au-delà des vêtements"), h("h2", null, "Ce qui rend le voyage plus simple")),
          h("div", { className: "mini-toggle" },
            h("button", { type: "button", className: extrasFilter === "essential" ? "active" : "", onClick: function () { setExtrasFilter("essential"); } }, "Essentiels"),
            h("button", { type: "button", className: extrasFilter === "all" ? "active" : "", onClick: function () { setExtrasFilter("all"); } }, "Tout")
          )
        ),
        h("div", { className: "smart-extra-grid" },
          visibleExtras.map(function (item) {
            var isChecked = checked(item);
            return h("article", { key: item.id, className: "smart-extra" + (isChecked ? " done" : "") + " priority-" + item.priority },
              h("button", { className: "smart-check", type: "button", onClick: function () { toggle(item); } },
                isChecked ? h(SvgIcon, { name: "check", size: 16 }) : null
              ),
              h("div", { className: "extra-copy" },
                h("span", { className: "extra-group" }, item.group),
                h("strong", null, item.label),
                h("small", null, item.note)
              ),
              h("div", { className: "extra-count" },
                h("strong", null, displayCount(item)),
                h("span", null, item.per === "couple" ? "pour 2" : scope === "couple" ? "total" : "chacun")
              )
            );
          })
        )
      ),

      h("div", { className: "packing-do-dont" },
        h("article", { className: "buy-local-card" },
          h("span", { className: "kicker" }, "Acheter sur place"),
          h("h3", null, "Gagne de la place en cabine"),
          h("ul", null, (packing.buyLocally || []).map(function (item) { return h("li", { key: item }, item); }))
        ),
        h("article", { className: "skip-card" },
          h("span", { className: "kicker" }, "Ne pas prendre"),
          h("h3", null, "Évite les “au cas où”"),
          h("ul", null, (packing.skip || []).map(function (item) { return h("li", { key: item }, item); }))
        )
      ),

      h("details", { className: "legacy-pack-details" },
        h("summary", null, "Voir la checklist détaillée d’origine"),
        h("p", { className: "legacy-explainer" }, "Elle reste disponible pour les points spécifiques du carnet et conserve les cases déjà cochées."),
        h("div", { className: "pack-stack legacy-pack-stack" },
          props.data.packCategories.map(function (category) {
            return h("article", { className: "pack-card", key: category.id },
              h("h3", null, category.title),
              category.items.map(function (item) {
                var isChecked = storeGet("cyclades-pack-" + item.id) === "1";
                return h("label", { key: item.id, className: "pack-item" + (isChecked ? " done" : "") },
                  h("input", { type: "checkbox", checked: isChecked, onChange: function () { props.toggleLegacy(item); } }),
                  h("span", null, h("strong", null, item.name), item.note ? h("small", null, item.note) : null)
                );
              })
            );
          })
        )
      )
    );
  }


  function SouvenirPlanner() {
    var config = enrichmentRoot().souvenirs || { items: [] };
    var forceState = useState(0);
    var force = forceState[1];
    var inputState = useState("");
    var input = inputState[0];
    var setInput = inputState[1];

    var custom = [];
    try { custom = JSON.parse(storeGet("cyclades-souvenir-custom") || "[]"); } catch (e) { custom = []; }
    if (!Array.isArray(custom)) custom = [];

    var items = (config.items || []).concat(custom);

    function isDone(item) {
      return storeGet("cyclades-souvenir-" + item.id) === "1";
    }

    function toggle(item) {
      var key = "cyclades-souvenir-" + item.id;
      storeSet(key, isDone(item) ? "0" : "1");
      force(function (n) { return n + 1; });
    }

    function addItem(event) {
      if (event) event.preventDefault();
      var label = (input || "").trim();
      if (!label) return;
      var item = { id:"custom-" + Date.now(), label:label, note:"Ajout personnel" };
      custom.push(item);
      storeSet("cyclades-souvenir-custom", JSON.stringify(custom));
      setInput("");
      force(function (n) { return n + 1; });
    }

    function removeItem(item) {
      if (String(item.id).indexOf("custom-") !== 0) return;
      custom = custom.filter(function (entry) { return entry.id !== item.id; });
      storeSet("cyclades-souvenir-custom", JSON.stringify(custom));
      storeSet("cyclades-souvenir-" + item.id, "0");
      force(function (n) { return n + 1; });
    }

    var doneCount = items.filter(isDone).length;

    return h("section", { className:"section-block souvenir-planner" },
      h("div", { className:"section-title" },
        h("div", null,
          h("span", { className:"kicker" }, doneCount + "/" + items.length + " trouvés"),
          h("h2", null, config.title || "Souvenirs & cadeaux")
        )
      ),
      h("p", { className:"souvenir-intro" }, config.intro || ""),
      h("div", { className:"souvenir-list" },
        items.map(function (item, index) {
          var done = isDone(item);
          return h("article", { key:item.id, className:"souvenir-item" + (done ? " done" : "") },
            h("button", {
              type:"button",
              className:"souvenir-check",
              onClick:function () { toggle(item); },
              "aria-label": done ? "Marquer à chercher" : "Marquer trouvé"
            }, done ? h(SvgIcon, { name:"check", size:16 }) : null),
            h("div", { className:"souvenir-copy" },
              h("div", { className:"souvenir-rank" }, index === 0 ? "Priorité" : "Idée"),
              h("strong", null, item.label),
              item.note ? h("small", null, item.note) : null
            ),
            String(item.id).indexOf("custom-") === 0 ? h("button", {
              type:"button", className:"souvenir-remove", onClick:function () { removeItem(item); }, "aria-label":"Supprimer"
            }, "×") : null
          );
        })
      ),
      h("form", { className:"souvenir-add", onSubmit:addItem },
        h("input", {
          type:"text",
          value:input,
          placeholder:"Ajouter une idée de souvenir…",
          onInput:function (event) { setInput(event.target.value); }
        }),
        h("button", { type:"submit" }, "Ajouter")
      )
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
    var smartPacking = enrichmentRoot().packing || {};
    var smartPackItems = (smartPacking.wardrobe || []).concat(smartPacking.extras || []);
    var packDone = smartPackItems.filter(function (item) { return storeGet("cyclades-smart-pack-" + item.id) === "1"; }).length;
    var total = props.data.tasks.length + smartPackItems.length;
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
      [["tasks", "Priorités"], ["pack", "Valise"], ["souvenirs", "Souvenirs"], ["cash", "Espèces"]].map(function (tab) {
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
      body = h(PackingPlanner, {
        data: props.data,
        toggleLegacy: togglePack
      });
    } else if (subview === "souvenirs") {
      body = h(SouvenirPlanner);
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
        h("div", null, h("strong", null, smartPackItems.length - packDone), h("span", null, "catégories valise restantes"))
      ),
      h(TravelReflexes),
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
      h("section", { className: "section-block quick-info-block" },
        h("div", { className: "section-title" }, h("div", null, h("span", { className: "kicker" }, "Un tap"), h("h2", null, "Contacts rapides"))),
        h("div", { className: "contact-strip" },
          props.data.contacts.filter(function (item) { return !!item.tel; }).map(function (item) {
            return h("a", { key: item.name, href: item.tel, className: "contact-chip" },
              h("span", { className: "contact-icon" }, h(SvgIcon, { name: "phone", size: 16 })),
              h("span", null, h("strong", null, item.name), h("small", null, "Appeler"))
            );
          })
        )
      ),
      h("section", { className: "section-block quick-info-block" },
        h("div", { className: "section-title" }, h("div", null, h("span", { className: "kicker" }, "Réserver / vérifier"), h("h2", null, "Liens utiles"))),
        h("div", { className: "service-grid" },
          Object.keys(enrichmentRoot().resources || {}).map(function (key) {
            var resource = resourceForKey(key);
            return resource ? h("a", { key: key, href: resource.url, target: "_blank", rel: "noopener", className: "service-card" },
              h("span", null, resource.label),
              h("strong", null, "↗")
            ) : null;
          })
        )
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
    var placeState = useState(null);
    var activePlace = placeState[0];
    var setActivePlace = placeState[1];
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
        view === "trip" ? h(TripView, { data: data, selectedDay: selectedDay, setSelectedDay: setSelectedDay, status: status, onPlaceInfo: setActivePlace }) : null,
        view === "prepare" ? h(PrepareView, { data: data }) : null,
        view === "info" ? h(InfoView, { data: data, onSearch: function () { setSearchOpen(true); } }) : null
      ),
      h(SearchOverlay, { data: data, open: searchOpen, onClose: function () { setSearchOpen(false); }, onNavigate: navigate }),
      h(PlaceSheet, { info: activePlace, contacts: data.contacts, onClose: function () { setActivePlace(null); } })
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(h(App));
})();
