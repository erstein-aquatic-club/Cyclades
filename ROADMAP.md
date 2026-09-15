# Cyclades — Roadmap multi-voyages

## Objectif

Faire évoluer Cyclades d'un carnet dédié à **Grèce 2026** vers une application de voyage multi-voyages et multi-profils, sans casser l'application existante pendant la transition.

Principe directeur : **migration additive et progressive**. Chaque étape doit pouvoir être déployée indépendamment, avec compatibilité temporaire avec le modèle actuel.

## Architecture cible

```text
app_users / future auth.users
        |
        +-- trip_members -- trips
                            |-- trip_days
                            |    +-- itinerary_items
                            |-- trip_places
                            |-- trip_tasks
                            |-- packing_items
                            +-- expenses
                                 +-- expense_allocations
```

Le voyage devient l'entité centrale. `Grèce 2026` est le premier voyage, pas une constante de l'application.

## Phase 1 — Fondation multi-voyages [EN COURS]

- [x] Ajouter `trips`.
- [x] Ajouter `trip_members`.
- [x] Ajouter `expenses.trip_id` nullable.
- [x] Créer `Grèce 2026` de façon idempotente.
- [x] Ajouter François (owner) et Onja (editor) comme membres.
- [x] Rattacher les dépenses existantes à `Grèce 2026`.
- [x] Ajouter les index nécessaires aux futures requêtes par voyage.
- [x] Ne modifier aucun contrat RPC ou écran existant.
- [ ] Appliquer la migration en production après validation de la PR.
- [ ] Vérifier le nombre de dépenses avant/après et l'absence de régression de l'app.

`expenses.trip_id` reste volontairement nullable : les RPC V2 peuvent encore créer une dépense sans `trip_id` jusqu'à la migration de la page Dépenses.

## Phase 2 — API voyage / dépenses V3

Créer une API parallèle sans casser V2 :

- `app_list_my_trips(token)`
- `app_get_trip(token, trip_id)`
- `app_list_trip_members(token, trip_id)`
- `app_list_trip_expenses_v3(token, trip_id)`
- `app_add_trip_expense_v3(token, trip_id, ...)`

Chaque RPC doit valider la session puis l'appartenance à `trip_members`. Les anciennes RPC restent actives pendant la transition.

## Phase 3 — TripContext côté frontend

Introduire un contexte global de voyage :

```js
{
  trip,
  tripId,
  members,
  currentMember,
  permissions,
  loading
}
```

Au départ, `Grèce 2026` reste le voyage sélectionné par défaut afin que l'expérience actuelle ne change pas.

Supprimer progressivement les constantes métier codées en dur : dates Grèce 2026, îles, François/Onja, libellés de voyage.

## Phase 4 — Dépenses multi-voyages

Utiliser la page Dépenses comme module pilote :

- filtrer les dépenses par `trip_id` ;
- charger les participants depuis `trip_members` ;
- conserver exactement les totaux et comportements actuels ;
- comparer V2 et V3 avant suppression de V2.

Critère de validation : les dépenses historiques de Grèce 2026 doivent produire exactement les mêmes résultats avant et après migration.

## Phase 5 — Allocations relationnelles

Remplacer progressivement `expense_people(person_name)` par :

```text
expense_allocations
- expense_id
- trip_member_id
- share_type
- share_value
```

Objectifs : supprimer les noms codés en dur et permettre à terme partage égal, montant fixe et pourcentage.

Conserver temporairement `expense_people` pendant la migration et la supprimer uniquement après validation complète.

## Phase 6 — Interface Mes voyages

Ajouter :

- écran `Mes voyages` ;
- sélecteur de voyage ;
- création d'un nouveau voyage ;
- édition des informations du voyage ;
- sélection des participants ;
- rôles `owner`, `editor`, `viewer` ;
- archivage.

Si l'utilisateur ne possède qu'un seul voyage, l'application peut continuer à l'ouvrir directement.

## Phase 7 — Création d'un voyage vide

Wizard initial :

1. nom / destination ;
2. dates ;
3. participants ;
4. devise / fuseau horaire ;
5. création.

Jalon : pouvoir créer un second voyage entièrement depuis l'interface, sans modification de code.

## Phase 8 — Structuration du carnet

Migrer progressivement `trip-data.html` vers des données structurées :

1. informations générales ;
2. journées (`trip_days`) ;
3. activités / timeline (`itinerary_items`) ;
4. transports ;
5. hébergements ;
6. lieux ;
7. checklist / bagages ;
8. contacts et notes.

Pendant la transition, utiliser les données Supabase lorsqu'elles existent et conserver `trip-data.html` comme fallback.

## Phase 9 — Authentification et RLS natives

Après stabilisation du modèle multi-voyages :

- migrer `app_users` / `app_sessions` vers Supabase Auth ;
- appliquer des politiques RLS basées sur l'utilisateur authentifié et `trip_members` ;
- supprimer progressivement les RPC de session personnalisées ;
- tester systématiquement les accès croisés entre voyages.

Cette phase est volontairement séparée de la refonte du modèle de données afin de limiter le risque de régression.

## Phase 10 — Offline / évolutions

- cache IndexedDB par `trip_id` ;
- téléchargement d'un voyage pour usage hors ligne ;
- invitations ;
- duplication de voyage ;
- modèles de voyages ;
- partage en lecture seule ;
- rôles plus fins si nécessaire.

## Ordre des PR

| PR | Contenu | Risque |
|---|---|---|
| 1 | Fondation `trips`, `trip_members`, `expenses.trip_id` | Faible |
| 2 | API voyage + dépenses V3 | Faible |
| 3 | `TripContext` + compatibilité Grèce 2026 | Faible |
| 4 | Page Dépenses V3 | Moyen |
| 5 | `expense_allocations` | Moyen |
| 6 | Mes voyages + création/gestion | Moyen |
| 7+ | Migration progressive du carnet | Par module |
| ultérieure | Supabase Auth + RLS natives | À isoler |

## Règles de transition

1. Pas de big bang.
2. Une migration destructive uniquement après disparition de tous ses consommateurs legacy.
3. Les nouvelles tables publiques ne sont pas exposées directement au frontend tant que le modèle d'accès n'est pas finalisé.
4. Toute nouvelle donnée métier majeure doit porter ou permettre de déterminer sans ambiguïté son `trip_id`.
5. Les vues ne doivent pas contenir de noms de personnes, destinations ou dates codés en dur.
6. Toute migration de données doit être idempotente ou explicitement protégée contre une double exécution.
7. Chaque PR doit avoir un scénario de non-régression pour Grèce 2026.
