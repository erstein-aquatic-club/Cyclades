# Circuit Cyclades — 9 au 18 septembre 2026

Carnet de voyage pour Santorin, Naxos, Paros et Mykonos.
Application web installable sur iPhone, qui fonctionne hors ligne.

**En ligne :** https://erstein-aquatic-club.github.io/Cyclades/

---

## Première mise en ligne

1. Déposer tous les fichiers à la **racine** du dépôt (branche `main`).
2. **Settings → Pages** → *Deploy from a branch* → `main` + `/ (root)` → Save.
3. Attendre une à deux minutes.

## Installation sur iPhone

1. Ouvrir l'adresse **dans Safari** (pas Chrome).
2. **Partager → Ajouter à l'écran d'accueil** → « Cyclades ».

⚠️ Ouvrir l'app une fois **avec du réseau** avant de partir : c'est ce qui
remplit le cache. Ensuite elle fonctionne sans connexion.

---

## Mettre à jour le carnet

**Un seul fichier change : `index.html`.**

1. Dans le dépôt : **Add file → Upload files**
2. Glisser le nouveau `index.html` (il écrase l'ancien)
3. **Commit changes** sur `main`
4. Attendre ~1 min, puis rouvrir l'app

Pas besoin de toucher à `sw.js` ni aux icônes. Le service worker est en
mode *réseau d'abord* : avec du réseau, tu vois toujours la dernière version.
L'horodatage en bas de page confirme laquelle est chargée.

**Astuce :** taper `.` sur la page du dépôt ouvre un éditeur VS Code dans le
navigateur — pratique pour committer sans quitter GitHub.

---

## Fichiers

| Fichier | Rôle | Change souvent ? |
|---|---|---|
| `index.html` | Le carnet complet | oui |
| `sw.js` | Cache hors ligne (réseau d'abord) | non |
| `manifest.webmanifest` | Déclaration de l'app | non |
| `icon-180/192/512.png` | Icônes | non |
