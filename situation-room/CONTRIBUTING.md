# Contribuer à la Situation Room 🌍

Merci de ton intérêt pour ce projet civique ! Ce dépôt est né dans le cadre du projet AHEAD Africa et du programme Digitalise Youth. Notre but est de fournir un outil souverain de monitoring électoral aux Organisations de la Société Civile (OSC).

Que tu sois développeur junior, expert en cybersécurité, designer ou fact-checker, ta contribution a un impact direct sur la transparence démocratique.

## 🤝 Nos Valeurs
1. **Frugalité :** Le code doit pouvoir tourner sur des serveurs peu performants et dans des zones à faible connectivité.
2. **Inclusion :** Nous utilisons des technologies accessibles et documentons au maximum pour permettre aux juniors d'apprendre.
3. **Qualité :** S'agissant de données électorales, la rigueur est de mise. Chaque Pull Request (PR) est revue avec attention.

## 🔧 Prérequis

- **Node.js ≥ 20** — [nodejs.org](https://nodejs.org/)
- **pnpm ≥ 10** — `npm install -g pnpm@latest` — requis pour lire le lockfile (`lockfileVersion: 9.0`)
- **Docker & Docker Compose** — pour lancer NocoDB et PostgreSQL en local

## 🚀 Comment commencer ?

1. **Trouver une issue :** Cherche les tickets avec le label `good first issue` ou `help wanted`.
2. **Signaler son intention :** Laisse un commentaire sur l'issue pour dire "Je m'en occupe !".
3. **Créer une branche :** Utilise la convention `feature/nom-de-la-feature` ou `fix/nom-du-bug`.
4. **Coder & Tester :** Assure-toi que ton code respecte l'architecture du Monorepo (voir le `README.md`).
5. **Ouvrir une Pull Request :** Décris clairement ce que tu as fait. Si ça modifie l'UI, ajoute une capture d'écran !

## 📜 Conventions de code

### Commits
Nous utilisons les [Conventional Commits](https://www.conventionalcommits.org/) :
```
feat: add WhatsApp webhook handler
fix: map rendering issue on mobile
docs: update SKILLS_MAP for data profiles
chore: update pnpm dependencies
```

### TypeScript
- Merci d'utiliser les types partagés dans `packages/shared` plutôt que de les redéfinir.
- Préfère les types explicites aux `any`.
- Commente la logique métier complexe.
- Utilise des variables explicites (en anglais).

### Structure des branches
```
main          → Production stable
develop       → Intégration des features
feature/xxx   → Nouvelle fonctionnalité
fix/xxx       → Correction de bug
docs/xxx      → Documentation uniquement
```

## 🌐 Recommandations d'architecture

### Ce que nous encourageons
- Utiliser `packages/shared` pour les types et constantes partagés
- Lire le `README.md` de chaque sous-dossier avant de coder
- Tester en local avec `docker-compose.dev.yml` avant de soumettre une PR
- Documenter les choix techniques importants dans le dossier `docs/`

### Ce que nous refusons
- Les dépendances vers des services cloud propriétaires (AWS, Vercel, Firebase, Supabase)
- Les ORM lourds comme Prisma ou TypeORM (NocoDB gère déjà l'API)
- Le code sans commentaires pour la logique métier complexe
- Les PR qui cassent la structure du monorepo

## 💬 Besoin d'aide ?

Rejoins la communauté "La Forge Citoyenne" sur notre canal dédié ou tague `@dofbi` (Tech Lead) sur GitHub. Il n'y a pas de mauvaises questions !

## 🏆 Reconnaissance

Tous les contributeurs sont listés dans le fichier `CONTRIBUTORS.md`. Les meilleures contributions issues des Tech Camps peuvent bénéficier d'un soutien financier via le mécanisme de sous-subvention #Tech4Good (5 subventions de 5 000 €).
