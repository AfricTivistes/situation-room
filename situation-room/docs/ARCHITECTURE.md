# Architecture Technique – Situation Room

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                    TERRAIN (Citoyens)                    │
│         WhatsApp · Telegram · SMS · Web                  │
└──────────────────────┬──────────────────────────────────┘
                       │ Webhooks HTTP POST
                       ▼
┌─────────────────────────────────────────────────────────┐
│              apps/webhooks (Node.js)                     │
│    Parser · Nettoyer · Insérer dans PostgreSQL          │
└──────────────────────┬──────────────────────────────────┘
                       │ API REST (NocoDB)
          ┌────────────┴────────────┐
          ▼                         ▼
┌─────────────────┐       ┌──────────────────────────┐
│  PostgreSQL 16  │◄─────►│  NocoDB (interface admin)│
│  (Base de données)      │  + API REST/GraphQL auto  │
└─────────────────┘       └──────────────────────────┘
          │
          │ API REST NocoDB
    ┌─────┴──────┐
    ▼            ▼
┌──────────┐  ┌──────────────────────────────────────┐
│apps/public│  │      apps/dashboard (Refine.js)       │
│  (Astro)  │  │   Modération · Fact-checking · Rôles  │
│ Carte pub.│  └──────────────────────────────────────┘
└──────────┘
```

## Principe de séparation des responsabilités

| Application | Public ? | Rôle |
|-------------|----------|------|
| `apps/public` | ✅ Oui | Affichage public des incidents vérifiés |
| `apps/dashboard` | ❌ Privé | Modération et validation des incidents |
| `apps/webhooks` | ❌ Interne | Réception des signalements terrain |
| NocoDB | ❌ Admin | Interface de gestion de la base de données |

## Règles architecturales non négociables

1. **Pas de cloud propriétaire.** Tout tourne sur Docker.
2. **L'API est fournie par NocoDB.** Pas de routes Express pour le CRUD.
3. **Les types sont dans `packages/shared`.** Jamais redéfinis dans les apps.
4. **pnpm exclusivement.** Jamais npm ni yarn.

## Pipeline de vérification d'un incident

```
[TERRAIN]           → Signalement brut reçu via webhook
[WEBHOOKS]          → Insertion avec status = "pending"
[DASHBOARD]         → Modérateur examine le signalement
    ├── Validé      → status = "verified" → Visible sur la carte publique
    └── Rejeté      → status = "rejected" → Archivé, invisible du public
[PUBLIC]            → Seuls les "verified" apparaissent sur la carte
```
