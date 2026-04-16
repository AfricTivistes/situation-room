# Référence Technique — Situation Room

> **Pôle IT — AfricTivistes**
> Dépôt : [https://github.com/AfricTivistes/situation-room](https://github.com/AfricTivistes/situation-room)
> Dernière mise à jour : Avril 2026

> **Ce document** est la référence technique pour les développeurs et contributeurs du projet. Il couvre l'architecture, les choix d'outils, la méthodologie et le guide d'onboarding.
> Pour la présentation générale du projet destinée aux partenaires et bailleurs, consulter [`PROJECT_OVERVIEW.md`](./PROJECT_OVERVIEW.md).

---

## Table des matières

1. [Stack AfricTivistes — Des Technologies Éprouvées](#1-stack-africTivistes--des-technologies-éprouvées)
2. [Architecture Technique](#2-architecture-technique)
3. [Choix des Outils — Justifications Détaillées](#3-choix-des-outils--justifications-détaillées)
4. [Flux de Données — Du Terrain à la Carte Publique](#4-flux-de-données--du-terrain-à-la-carte-publique)
5. [Structure du Dépôt](#5-structure-du-dépôt)
6. [Méthodologie & Règles Non Négociables](#6-méthodologie--règles-non-négociables)
7. [Guide d'Onboarding](#7-guide-donboarding)

---

## 1. Stack AfricTivistes — Des Technologies Éprouvées

L'une des décisions les plus importantes de ce projet est le choix de **ne pas réinventer la roue**. Les technologies utilisées ici ne sont pas des expérimentations — elles ont **fait leurs preuves** dans les projets précédents d'AfricTivistes.

### Pourquoi réutiliser le même stack ?

| Avantage | Explication |
|----------|-------------|
| **Réduction du risque technique** | Des outils connus de l'équipe = moins de bugs de jeunesse, montée en compétence immédiate |
| **Maintenance pérenne** | Les futurs contributeurs AfricTivistes connaîtront déjà l'environnement |
| **Cohérence organisationnelle** | Les patterns, conventions et bonnes pratiques sont partagés entre projets |
| **Documentation interne** | Les lessons learned des projets précédents sont directement applicables |
| **Onboarding accéléré** | Un développeur ayant contribué à un autre projet AfricTivistes est immédiatement opérationnel |

### Technologies validées dans le stack AfricTivistes

**pnpm Workspaces (Monorepo)**
Utilisé pour gérer plusieurs applications interconnectées dans un seul dépôt. Cette approche a démontré son efficacité pour les projets multi-composants d'AfricTivistes, permettant de partager du code (types, utilitaires) entre le frontend public, le dashboard privé et les services backend sans duplication.

**Node.js / Express**
Le runtime JavaScript côté serveur de référence dans les projets AfricTivistes. Sa légèreté, sa maturité et l'écosystème npm en font le choix naturel pour les services webhooks et API.

**PostgreSQL**
La base de données relationnelle open source la plus avancée au monde. AfricTivistes l'utilise systématiquement pour sa fiabilité, ses performances et ses extensions puissantes (PostGIS pour la géolocalisation, full-text search). Aucune licence propriétaire, déployable sur n'importe quel VPS.

**TypeScript**
Le typage statique est devenu un standard non négociable dans les projets AfricTivistes après avoir réduit significativement les bugs en production. Tous les services partagent des types communs définis dans `packages/shared`.

**Tailwind CSS**
Utilisé dans l'ensemble des interfaces AfricTivistes pour sa rapidité de développement et sa cohérence visuelle. Permet aux développeurs juniors de construire des interfaces professionnelles sans expertise CSS approfondie.

**Docker & Docker Compose**
L'infrastructure "Infrastructure as Code" d'AfricTivistes. Chaque projet se lance avec une seule commande, garantissant que l'environnement de développement est identique en local, en staging et en production.

---

## 2. Architecture Technique

### Vue d'ensemble

```
┌──────────────────────────────────────────────────────────────┐
│                      TERRAIN (Citoyens)                       │
│           WhatsApp · Telegram · SMS · Formulaire Web          │
└─────────────────────────┬────────────────────────────────────┘
                          │ Webhooks HTTP POST
                          ▼
┌──────────────────────────────────────────────────────────────┐
│              apps/webhooks  (Node.js / Express)               │
│    Réception · Parsing · Nettoyage · Insertion PostgreSQL     │
└─────────────────────────┬────────────────────────────────────┘
                          │ INSERT status = "pending"
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                    PostgreSQL 16 + PostGIS                     │
│              Base de données centrale souveraine              │
└────────────┬─────────────────────────────────┬───────────────┘
             │ API REST/GraphQL auto            │ API REST
             ▼                                  ▼
┌────────────────────────┐          ┌────────────────────────────┐
│  NocoDB (Admin + API)  │          │  apps/dashboard (Refine.js) │
│  Interface no-code     │          │  Modération · Fact-checking  │
│  pour équipes terrain  │          │  Gestion des rôles           │
└────────────────────────┘          └────────────────────────────┘
                                               │
                          ┌────────────────────┘
                          │ Seuls les incidents "verified"
                          ▼
┌──────────────────────────────────────────────────────────────┐
│              apps/public  (Astro + Leaflet)                    │
│   Carte interactive publique · Incidents vérifiés uniquement  │
└──────────────────────────────────────────────────────────────┘
```

### Principe de séparation des responsabilités

| Application | Accès | Rôle |
|-------------|-------|------|
| `apps/webhooks` | Interne uniquement | Réception des signalements depuis le terrain |
| `apps/dashboard` | Privé (équipe modération) | Validation, fact-checking, gestion des incidents |
| NocoDB | Admin (équipe data) | Interface no-code sur la base de données |
| `apps/public` | Public (tout le monde) | Affichage des incidents vérifiés sur la carte |

### Pipeline de vérification d'un incident

```
[TERRAIN]        → Signalement brut reçu via webhook (WhatsApp/SMS/Telegram)
    │
    ▼
[WEBHOOKS]       → Parsing + validation du format + insertion en base
                   status = "pending"
    │
    ▼
[DASHBOARD]      → Un modérateur examine le signalement
    ├── Validé   → status = "verified"  → Visible sur la carte publique
    └── Rejeté   → status = "rejected"  → Archivé, invisible du public
    │
    ▼
[PUBLIC]         → Seuls les incidents "verified" apparaissent sur la carte
```

Ce pipeline garantit qu'**aucune information non vérifiée** n'est visible publiquement — garantie fondamentale pour la crédibilité de l'outil.

---

## 3. Choix des Outils — Justifications Détaillées

### Infrastructure & Déploiement

#### Docker & Docker Compose
**Pourquoi ?** La souveraineté des données exige que l'outil soit déployable sur n'importe quelle infrastructure. Docker abstrait l'environnement d'exécution : la Situation Room tourne de manière identique sur un VPS OVH à 5€/mois, un serveur dédié, ou un datacenter local.

**Alternative écartée :** Solutions cloud managées (AWS ECS, Google Cloud Run) — incompatibles avec notre valeur de souveraineté des données et source de coûts imprévisibles.

#### Nginx (Reverse Proxy)
**Pourquoi ?** Nginx expose un point d'entrée unique (port 80/443) et route les requêtes vers les bons services internes. Il gère le SSL/TLS et protège les services qui ne doivent pas être exposés publiquement. Configuration légère, battle-tested, documentation abondante.

**Routes de production :**
- `/` → Site public (Astro)
- `/dashboard` → Dashboard de modération (Refine.js)
- `/nocodb/` → API NocoDB
- `/webhooks/` → Service de réception terrain

---

### Base de Données

#### PostgreSQL 16 + PostGIS
**Pourquoi ?** PostgreSQL est la base de données open source la plus robuste disponible. PostGIS ajoute des capacités géospatiales natives (calcul de distances, zones géographiques, requêtes par proximité) essentielles pour les cartes électorales. Les extensions `unaccent` (recherche full-text multilingue) et `uuid-ossp` sont disponibles nativement.

**Dimensionnement :** Capable de gérer des millions d'incidents électoraux sur un serveur modeste. La réplication vers un serveur secondaire est possible sans changement de code.

#### Drizzle ORM
**Pourquoi ?** Drizzle est un ORM TypeScript léger et type-safe. Il génère des types TypeScript directement depuis le schéma de base de données, éliminant toute désynchronisation entre le code et la base. Contrairement à Prisma, il ne génère pas de client lourd — idéal pour notre contrainte de frugalité.

#### NocoDB
**Pourquoi ?** NocoDB se connecte directement à PostgreSQL et génère automatiquement une API REST complète (CRUD) et une interface visuelle no-code. Cela permet aux équipes non-techniques (coordinateurs de terrain, responsables programme) de consulter et gérer les données **sans écrire une seule ligne de code**.

**Alternative écartée :** Développer manuellement toutes les routes CRUD en Express — travail redondant, maintenabilité réduite, et aucune valeur ajoutée pour l'utilisateur final.

---

### Frontend

#### Astro 5 (Site Public)
**Pourquoi ?** Astro génère des pages HTML statiques par défaut, avec zéro JavaScript envoyé au navigateur sauf si nécessaire. Résultat : des pages qui se chargent **en moins de 2 secondes même sur une connexion 3G africaine**.

**Caractéristique clé :** Le modèle "Islands Architecture" d'Astro permet d'intégrer des composants interactifs (la carte Leaflet, les filtres) uniquement là où c'est nécessaire, sans alourdir le reste de la page.

#### Refine.js (Dashboard de Modération)
**Pourquoi ?** Refine est un framework React spécialisé dans les "internal tools" et les interfaces d'administration. Il fournit en standard les patterns CRUD, la gestion des rôles et permissions, les tableaux de données filtrables, et la pagination — tous essentiels pour le dashboard de modération.

**Alternative écartée :** React "vanilla" ou Next.js — pertinents pour les apps publiques, mais inadaptés pour construire rapidement un outil interne robuste.

#### Leaflet (Cartographie)
**Pourquoi ?** Leaflet est la bibliothèque JavaScript de cartographie open source la plus populaire au monde. Légère (42 ko), sans dépendance, compatible avec tous les navigateurs. Elle ne nécessite **aucune clé API** et utilise des tuiles OpenStreetMap — souveraineté totale.

**Alternative écartée :** Google Maps, Mapbox — clés API payantes, données de navigation exposées à des tiers.

#### Tailwind CSS 4
**Pourquoi ?** Framework utilitaire qui génère uniquement le CSS effectivement utilisé (< 10 ko en production). Cohérence visuelle forte et vitesse de développement élevée, même pour des développeurs juniors.

---

### Backend & Services

#### Node.js / Express (Service Webhooks)
**Pourquoi ?** Service simple de réception et traitement de requêtes HTTP. Node.js est optimal pour ce type de charge I/O-bound. Express est le framework le plus léger et le plus documenté. Le même langage (TypeScript) que le frontend réduit la fragmentation de compétences.

#### pnpm Workspaces (Monorepo)
**Pourquoi ?** Plusieurs applications (public, dashboard, webhooks) et bibliothèques partagées (types, schéma DB). pnpm Workspaces les gère dans un seul dépôt avec un seul `pnpm install`. pnpm est 2× plus rapide que npm et 3× plus économe en espace disque.

**Structure partagée clé :** `packages/shared` contient tous les types TypeScript métier — une seule source de vérité, jamais de désynchronisation entre le frontend et le backend.

---

## 4. Flux de Données — Du Terrain à la Carte Publique

### Signalement entrant (exemple WhatsApp)

```
1. Un observateur envoie un message WhatsApp :
   "BV045 - Dakar Plateau - Bureau fermé à 14h sans raison officielle"

2. Le Bot WhatsApp Business (Meta API) transmet le message
   au service webhooks via HTTP POST.

3. apps/webhooks parse le message :
   {
     source: "whatsapp",
     raw_text: "BV045 - Dakar Plateau - Bureau fermé à 14h...",
     phone: "+221XXXXXXXX",
     received_at: "2026-04-16T14:03:22Z"
   }

4. Le service insère en base PostgreSQL :
   INSERT INTO base_reports (title, description, source, status, ...)
   VALUES ('Signalement BV045', '...', 'whatsapp', 'pending', ...)

5. Le modérateur voit le signalement dans le dashboard Refine.js
   avec statut "En attente".

6. Après vérification, le modérateur passe le statut à "verified".

7. Le site public Astro affiche automatiquement l'incident
   sur la carte Leaflet.
```

### Schéma de la base de données

```
base_reports (table centrale)
├── id              SERIAL PRIMARY KEY
├── title           VARCHAR(255) NOT NULL
├── description     TEXT
├── source          'web' | 'whatsapp' | 'telegram' | 'sms'
├── status          'pending' | 'verified' | 'rejected'
├── latitude        DECIMAL(10,8)
├── longitude       DECIMAL(11,8)
├── created_at      TIMESTAMP WITH TIME ZONE
└── updated_at      TIMESTAMP WITH TIME ZONE

election_incidents (table métier — à enrichir au hackathon)
├── id              SERIAL PRIMARY KEY
├── report_id       → base_reports.id
├── incident_type   'bureau_ferme' | 'violence' | 'bourrage_urne' | ...
├── region          VARCHAR(100)
├── commune         VARCHAR(100)
├── polling_station_code VARCHAR(50)
├── severity        'low' | 'medium' | 'high' | 'critical'
└── verified_by     → observers.id

polling_stations (bureaux de vote)
├── code            VARCHAR(50) UNIQUE
├── name, region, commune
├── latitude, longitude
└── total_voters

observers (observateurs déployés)
├── phone           VARCHAR(20)  ← numéro WhatsApp/SMS
├── telegram_id     VARCHAR(50)
├── assigned_station_id → polling_stations.id
└── organization
```

Pour la documentation complète du schéma et les conventions SQL, consulter [`SCHEMA.md`](./SCHEMA.md).

---

## 5. Structure du Dépôt

```
situation-room/
│
├── apps/                          ← Applications déployables
│   ├── public/                    ← Site public (Astro + Leaflet)
│   │   ├── src/pages/             ← Pages du site (index, carte, à propos)
│   │   ├── src/components/        ← Composants Astro réutilisables
│   │   └── astro.config.mjs       ← Configuration Astro
│   │
│   ├── dashboard/                 ← Dashboard privé (React + Refine.js)
│   │   ├── src/pages/             ← Pages du dashboard (liste, détail)
│   │   ├── src/components/        ← Composants React du backoffice
│   │   └── refine.config.ts       ← Configuration Refine (ressources, API)
│   │
│   └── webhooks/                  ← Service de réception terrain (Node.js)
│       ├── src/handlers/          ← Un fichier par canal (whatsapp, sms, telegram)
│       └── src/index.ts           ← Point d'entrée du service
│
├── packages/                      ← Code partagé entre les apps
│   └── shared/                    ← Types TypeScript communs (Report, Status, Source...)
│       └── src/index.ts
│
├── infra/                         ← Infrastructure as Code
│   └── postgres/
│       └── 01-init.sql            ← Schéma initial de la base de données
│
├── docker/                        ← Configuration Docker par service
│   ├── nginx/                     ← Configuration du reverse proxy
│   ├── Dockerfile.public
│   ├── Dockerfile.dashboard
│   └── Dockerfile.webhooks
│
├── docs/                          ← Documentation du projet
│   ├── PROJECT_OVERVIEW.md        ← Présentation externe (bailleurs, partenaires)
│   ├── TECHNICAL_REFERENCE.md     ← Ce document (développeurs)
│   ├── ARCHITECTURE.md            ← Schéma technique condensé
│   ├── SCHEMA.md                  ← Modèle de données et conventions SQL
│   ├── CONTRIBUTING.md            ← Guide de contribution détaillé
│   └── DEPLOYMENT.md              ← Guide de déploiement en production
│
├── SKILLS_MAP.md                  ← Guide de contribution par profil
├── CONTRIBUTING.md                ← Point d'entrée contribution (racine)
├── LICENSE                        ← Licence AGPL-3.0
├── README.md                      ← Point d'entrée du dépôt
├── docker-compose.yml             ← Orchestration production
├── docker-compose.dev.yml         ← Orchestration développement local
└── pnpm-workspace.yaml            ← Configuration du monorepo
```

### Navigation rapide

| Je veux... | Je vais là |
|-----------|-----------|
| Modifier la carte ou le site public | `apps/public/` |
| Améliorer l'interface de modération | `apps/dashboard/` |
| Connecter un nouveau canal (USSD, Telegram...) | `apps/webhooks/src/handlers/` |
| Ajouter ou modifier un type de données partagé | `packages/shared/` |
| Modifier le schéma de la base de données | `infra/postgres/01-init.sql` |
| Changer la configuration réseau de production | `docker/nginx/` |
| Lire ou écrire de la documentation | `docs/` |

---

## 6. Méthodologie & Règles Non Négociables

### Règles architecturales absolues

Ces règles protègent la cohérence du projet sur le long terme. Elles ne peuvent pas être contournées sans validation de l'équipe IT AfricTivistes.

```
1. PAS DE CLOUD PROPRIÉTAIRE
   Tout tourne sur Docker. Aucune dépendance à AWS, GCP, Vercel, Firebase ou Supabase.

2. L'API CRUD EST FOURNIE PAR NOCODB
   On n'écrit pas de routes Express pour le CRUD de base.
   Express est réservé aux traitements métier (webhooks, transformations).

3. LES TYPES PARTAGÉS VIVENT DANS packages/shared
   Jamais de type redéfini localement dans une app.
   Une seule source de vérité.

4. pnpm EXCLUSIVEMENT
   Jamais npm, jamais yarn. Les lock files sont incompatibles.
   Commande : pnpm install (jamais npm install)

5. TYPESCRIPT STRICT
   strict: true dans tous les tsconfig.json.
   Aucun any implicite. Les erreurs TypeScript sont des bugs à corriger.
```

### Conventions Git

**Nommage des branches**
```
feature/nom-de-la-feature     → Nouvelle fonctionnalité
fix/description-du-bug        → Correction de bug
docs/section-concernée        → Documentation uniquement
chore/description             → Maintenance technique
```

**Format des commits (Conventional Commits)**
```
feat: ajouter le handler WhatsApp
fix: corriger le parsing des coordonnées GPS
docs: mettre à jour le guide d'onboarding
chore: mettre à jour les dépendances pnpm
test: ajouter les tests du service webhooks
```

**Processus de contribution**
```
1. Créer une branche depuis main (ou develop)
   git checkout -b feature/ma-feature

2. Développer avec des commits atomiques et bien nommés

3. Ouvrir une Pull Request sur GitHub
   → Titre clair décrivant ce qui change
   → Description incluant le contexte et les tests effectués
   → Lier l'issue GitHub correspondante (#XX)

4. Attendre la revue d'un pair (au moins 1 approbation requise)

5. Merge via "Squash and Merge" pour garder un historique propre
```

### Qualité du code

| Pratique | Outil | Fréquence |
|----------|-------|-----------|
| Typage statique | TypeScript strict | À chaque commit |
| Formatage | Prettier | Hook pre-commit |
| Linting | ESLint | Hook pre-commit |
| Tests unitaires | Vitest | Avant chaque PR |
| Revue de code | GitHub PR | Avant chaque merge |

---

## 7. Guide d'Onboarding

### Prérequis

- **Docker Desktop** (ou Docker Engine + Docker Compose sur Linux)
- **Node.js 20+** (LTS)
- **pnpm 10+** : `npm install -g pnpm@latest`
- **Git**
- VS Code recommandé (extensions : ESLint, Prettier, TypeScript)

### Démarrage local

Le développement local repose sur deux niveaux : les **services d'infrastructure** (base de données, NocoDB) démarrés via Docker, et les **applications** démarrées directement avec pnpm.

```bash
# 1. Cloner le dépôt
git clone https://github.com/AfricTivistes/situation-room.git
cd situation-room

# 2. Installer les dépendances
pnpm install

# 3. Copier les variables d'environnement
cp .env.example .env
# Éditer .env avec tes valeurs locales si nécessaire

# 4. Lancer les services d'infrastructure
#    Utiliser le fichier DEV — pas le fichier de production !
docker compose -f docker-compose.dev.yml up -d

# 5. Lancer les applications
pnpm --filter @situation-room/public dev       # Site public
pnpm --filter @situation-room/dashboard dev    # Dashboard de modération
pnpm --filter @situation-room/webhooks dev     # Service webhooks
```

**URLs d'accès en local**

| Service | URL locale | Rôle |
|---------|-----------|------|
| Site public (Astro) | `http://localhost:4321` | Carte publique des incidents |
| Dashboard (Refine.js) | `http://localhost:5173` | Modération et fact-checking |
| Interface NocoDB | `http://localhost:8080` | Admin base de données |
| PostgreSQL | `localhost:5432` | Via client SQL (DBeaver, psql) |

> **En production**, Nginx unifie tout sur un seul domaine :
> `https://votre-domaine.org/` · `/dashboard` · `/nocodb/` · `/webhooks/`

### Trouver ta première contribution

**Développeur(se) Frontend (HTML/CSS/Astro)**
→ `apps/public/` — Issues `good first issue` + `frontend`
→ Première mission : créer ou améliorer un composant Astro

**Développeur(se) React**
→ `apps/dashboard/` — Issues `good first issue` + `dashboard`
→ Première mission : améliorer la vue liste des signalements en attente

**Développeur(se) Backend (Node.js)**
→ `apps/webhooks/src/handlers/` — Issues `good first issue` + `backend`
→ Première mission : implémenter un handler de canal (Telegram, SMS...)

**Profil Data / DevOps (SQL, Docker)**
→ `infra/postgres/` et `docker/` — Issues `good first issue` + `data`
→ Première mission : enrichir le schéma avec des tables métier électorales

**Designer / Profil non-technique**
→ `docs/` et issues `documentation` ou `ux`
→ Première mission : tester le dashboard sur mobile et documenter les problèmes d'ergonomie

### Documents à lire en priorité

| Document | Pour qui | Contenu |
|----------|---------|---------|
| [`SKILLS_MAP.md`](../SKILLS_MAP.md) | Tout le monde | Guide de contribution par profil |
| [`CONTRIBUTING.md`](../CONTRIBUTING.md) | Tout le monde | Processus de contribution, conventions |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Profils tech | Schéma technique condensé |
| [`SCHEMA.md`](./SCHEMA.md) | Profils data | Modèle de données et SQL |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | DevOps | Déploiement en production |

### En cas de blocage

1. Cherche dans les **issues GitHub** existantes — ta question a peut-être une réponse
2. Consulte la **documentation** dans `docs/`
3. Pose ta question dans le canal dédié en précisant : ce que tu veux faire, ce que tu as essayé, le message d'erreur exact
4. Ouvre une **issue GitHub** si tu identifies un bug ou un manque de documentation

---

*Ce document est maintenu par le Pôle IT d'AfricTivistes. Pour toute suggestion, ouvrir une PR avec le label `documentation`.*
*Licence : [AGPL-3.0](../LICENSE) — Copyright (C) 2024 AfricTivistes – Africa ElectionLab*
