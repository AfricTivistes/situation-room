# 🛡️ Dashboard Situation Room (Refine.js + React)

**Rôle :** C'est l'espace de travail sécurisé des observateurs, modérateurs et fact-checkers. Ils y qualifient les signalements remontés du terrain et gèrent la plateforme.

**Pourquoi Refine.js ?**
C'est un framework basé sur React conçu pour les applications data-intensive (B2B, back-office). Il nous évite de recoder à la main toutes les logiques de CRUD, de pagination, de tri et d'authentification. Il se connecte nativement à l'API générée par NocoDB.

---

## 🛠️ Comment ce projet a été initialisé

```bash
# Depuis la racine du monorepo
pnpm create refine-app@latest apps/dashboard

# Options stratégiques :
# Framework : React
# Bundler : Vite
# UI Framework : Headless (ou Tailwind CSS)
# Data Provider : Simple REST API (pour NocoDB)
# Auth Provider : Custom (JWT NocoDB)
```

---

## 🚀 Démarrage rapide

```bash
# Depuis la racine du monorepo
pnpm dev:dashboard
```

Le dashboard est accessible sur `http://localhost:5173`.

**Prérequis :** L'infrastructure Docker doit tourner (`pnpm dev:infra`).

---

## 🏗️ Structure attendue

```
src/
├── App.tsx          → Point d'entrée Refine (déclaration des ressources)
├── providers/       → dataProvider (API NocoDB) + authProvider (JWT)
├── features/        → Vues par métier (liste incidents, vue fact-checking)
├── components/      → Composants UI réutilisables
└── lib/             → Utilitaires (helpers, formatters)
```

**Règle d'or :** Ne réinventez pas la roue. Utilisez les hooks de Refine (`useTable`, `useForm`, `useUpdate`) pour interagir avec l'API NocoDB. Refine gère la pagination, les états de chargement et les erreurs pour vous.

---

## 🎯 Issues suggérées pour le hackathon

- Créer la vue liste des signalements avec filtres par statut
- Créer le formulaire de validation/rejet d'un incident
- Implémenter l'authentification JWT via NocoDB
- Créer le tableau de bord récapitulatif (statistiques, carte)
