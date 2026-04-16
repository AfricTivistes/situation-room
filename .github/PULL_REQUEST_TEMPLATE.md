## Description

<!-- Explique le QUOI et le POURQUOI, pas le COMMENT (ça, c'est dans le code) -->

## Issue liée

<!-- Relie cette PR à l'issue correspondante : "Closes #XX" -->

Closes #

## Type de changement

- [ ] 🐛 Correction de bug
- [ ] ✨ Nouvelle fonctionnalité
- [ ] ♻️ Refactoring (pas de changement de comportement)
- [ ] 📝 Documentation uniquement
- [ ] 🔧 Configuration / infrastructure

## Partie du projet modifiée

- [ ] `apps/public`
- [ ] `apps/dashboard`
- [ ] `apps/webhooks`
- [ ] `packages/shared`
- [ ] `infra/`
- [ ] `docs/`

## Capture d'écran

<!-- OBLIGATOIRE si tu as modifié l'interface (apps/public ou apps/dashboard) -->
<!-- Avant / Après si pertinent -->

## Checklist

- [ ] Mon code respecte la convention Conventional Commits (`feat:`, `fix:`, `docs:`…)
- [ ] J'ai testé les changements en local avec `docker-compose -f docker-compose.dev.yml up -d`
- [ ] Je n'ai pas introduit de dépendance vers un service cloud propriétaire (AWS, Firebase, Supabase…)
- [ ] Si j'ai créé ou modifié un type, il est dans `packages/shared/src/types.ts`
- [ ] Si j'ai ajouté une ressource Refine, elle est déclarée dans `refine.config.ts`
- [ ] La documentation (README ou docs/) reflète les changements si nécessaire
