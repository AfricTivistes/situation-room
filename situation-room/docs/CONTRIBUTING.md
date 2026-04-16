# Guide de Contribution Détaillé – Situation Room

Ce guide technique est destiné aux développeurs souhaitant contribuer de manière structurée. Pour une version rapide, voir `CONTRIBUTING.md` à la racine du projet.

---

## 🏗️ Architecture globale à respecter

Avant de coder, lisez `docs/ARCHITECTURE.md` pour comprendre comment les 3 applications communiquent entre elles et avec NocoDB.

La règle principale : **chaque application a une responsabilité unique**. Ne pas mélanger la logique métier entre les apps.

---

## A. Contribuer à `apps/public` (Astro)

**Objectif :** Afficher les données publiques, accessibles à tous, même sans connexion rapide.

### Conventions
- Pages dans `src/pages/` — Astro génère les routes automatiquement
- Préférer les composants `.astro` natifs aux composants React
- N'utiliser React (`client:load`, `client:visible`) que pour les éléments interactifs (carte, formulaire)
- Toujours tester sur mobile et simuler une connexion 3G lente

### Ajouter une nouvelle page
```bash
# Créer src/pages/ma-page.astro
# Elle sera accessible à /ma-page automatiquement
```

### Intégrer la carte Leaflet
```tsx
// Dans un composant React : src/components/Map.tsx
// Importer Leaflet avec un client:load pour éviter les erreurs SSR
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
```

---

## B. Contribuer à `apps/dashboard` (Refine.js)

**Objectif :** Permettre aux modérateurs de valider ou rejeter les signalements.

### Conventions
- Utiliser **exclusivement** les hooks Refine pour les données (`useTable`, `useOne`, `useUpdate`)
- Déclarer toute nouvelle ressource dans `refine.config.ts`
- Ajouter les providers dans `src/providers/`
- Grouper les vues par domaine métier dans `src/features/`

### Ajouter une nouvelle vue de données
```tsx
// 1. Déclarer la ressource dans refine.config.ts
{ name: 'ma_table', list: '/ma-table', ... }

// 2. Créer la page dans src/features/ma-table/
// 3. Utiliser useTable pour lister les données
import { useTable } from '@refinedev/core';
const { tableQueryResult } = useTable({ resource: 'ma_table' });
```

### Modifier le statut d'un signalement
```tsx
import { useUpdate } from '@refinedev/core';
const { mutate: updateReport } = useUpdate();

updateReport({
  resource: 'base_reports',
  id: reportId,
  values: { status: 'verified' },
});
```

---

## C. Contribuer à `apps/webhooks` (Node.js)

**Objectif :** Connecter la plateforme aux canaux de terrain.

### Ajouter un nouveau canal
1. Créer `src/handlers/mon-canal.ts`
2. Exporter une fonction `handleMonCanalWebhook(req, res)`
3. Enregistrer la route dans `src/index.ts`
4. Documenter les pré-requis dans `apps/webhooks/README.md`

### Structure d'un handler
```typescript
import { Request, Response } from 'express';

export async function handleMonCanalWebhook(req: Request, res: Response): Promise<void> {
  const payload = req.body;

  // 1. Valider le payload
  // 2. Extraire les informations pertinentes
  // 3. Insérer dans NocoDB via fetch
  // 4. Répondre 200 immédiatement (les webhooks ont des timeouts courts)
  res.status(200).send('ok');
}
```

---

## D. Contribuer à `packages/shared`

**Objectif :** Maintenir la cohérence des types entre toutes les applications.

### Règles strictes
- **Tout nouveau type** utilisé par 2+ applications → doit aller dans `packages/shared/src/types.ts`
- **Toute nouvelle constante** → `packages/shared/src/constants.ts`
- Toujours exporter depuis `src/index.ts`

### Vérifier la cohérence après modification
```bash
# Depuis la racine du monorepo
pnpm run typecheck
```

---

## E. Contribuer à `infra/postgres`

**Objectif :** Modéliser la base de données pour les besoins métier.

### Conventions SQL
- Nommer les tables en `snake_case` et au pluriel (`election_incidents`, `polling_stations`)
- Toujours inclure `id SERIAL PRIMARY KEY`, `created_at`, `updated_at`
- Documenter les colonnes avec `COMMENT ON COLUMN`
- Créer des index pour les colonnes fréquemment filtrées

### Ajouter une table
1. Créer un nouveau fichier `infra/postgres/02-ma-table.sql`
2. Recréer les conteneurs : `docker-compose -f docker-compose.dev.yml down -v && docker-compose -f docker-compose.dev.yml up -d`
3. Vérifier que NocoDB détecte automatiquement la nouvelle table

---

## Labels GitHub

Les labels permettent de trier et de router les issues vers les bonnes personnes.

| Label | Couleur | Usage |
|-------|---------|-------|
| `good first issue` | 🟢 vert | Issue bien délimitée, documentée, adaptée aux débutants et participants Tech Camp |
| `help wanted` | 🔵 bleu | Le mainteneur cherche activement un contributeur — prioritaire |
| `bug` | 🔴 rouge | Comportement incorrect ou erreur à corriger |
| `enhancement` | 🟣 violet | Nouvelle fonctionnalité ou amélioration |
| `needs-triage` | ⚫ gris | Issue non encore évaluée par le mainteneur — ne pas assigner |
| `tech-camp` | 🟡 jaune | Issue créée ou réservée pour un hackathon AfricTivistes |
| `documentation` | 📄 blanc | Correction ou ajout de documentation uniquement |
| `infra` | 🟠 orange | Docker, PostgreSQL, Nginx, déploiement |

### Workflow de triage

1. Toute nouvelle issue reçoit automatiquement `needs-triage`
2. Le mainteneur (`@dofbi`) retire `needs-triage` et ajoute le bon label métier
3. Les issues `good first issue` + `help wanted` sont les points d'entrée pour les Tech Camps
4. Les participants commentent "Je m'en occupe !" avant de coder

---

## Processus de Pull Request

1. **Branche :** `feature/nom` ou `fix/nom`
2. **Commits :** Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`)
3. **Description :** Expliquer le QUOI et le POURQUOI, pas le COMMENT
4. **Screenshot :** Obligatoire si modification de l'UI
5. **Revue :** Attendre la validation de `@dofbi` avant de merger
