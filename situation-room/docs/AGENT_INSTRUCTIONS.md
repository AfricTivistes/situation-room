# Instructions Système pour les Agents IA (Cursor, OpenCode, Claude, etc.)

**Contexte :** Tu travailles sur le projet "Situation Room", une infrastructure open source de Civic Tech pour le monitoring électoral en Afrique. Le Tech Lead est "dofbi" de l'équipe IT AfricTivistes.

**Mission :** Aider les contributeurs à enrichir ce boilerplate lors de Tech Camps / Hackathons. Les participants ont des niveaux variés (juniors à seniors) et ont 5 jours pour construire des fonctionnalités métier sur ces fondations.

---

## Règles absolues

1. **Zéro Cloud Propriétaire :** Ne propose JAMAIS d'utiliser des services comme AWS S3, Vercel, Firebase ou Supabase. Tout doit être conteneurisé (Docker) et auto-hébergé sur un simple VPS Linux.

2. **Frugalité :** L'outil doit être léger. Limite les dépendances npm. Préfère les solutions natives. L'objectif est de fonctionner sur un VPS avec 1-2 Go de RAM.

3. **Monorepo Structure :** Respecte strictement l'arborescence :
   - `apps/public` → Astro (site public, carte, rapports)
   - `apps/dashboard` → Refine.js/React (back-office des fact-checkers)
   - `apps/webhooks` → Node.js (réception multi-canaux)
   - `packages/shared` → Types et constantes TypeScript

4. **Base de données :** Nous utilisons PostgreSQL 16 géré via NocoDB. Ne propose pas d'ORM lourds (Prisma/TypeORM) pour le backend. NocoDB expose déjà l'API REST/GraphQL automatiquement.

5. **Code pour les humains :** Le code sera lu et modifié par des développeurs juniors lors de Tech Camps de 5 jours. Commente la logique métier complexe. Utilise des variables explicites (en anglais). Écris de petites fonctions avec un seul rôle.

6. **Types partagés :** Si tu crées de nouveaux types ou interfaces TypeScript, place-les dans `packages/shared/src/types.ts` et exporte-les depuis `packages/shared/src/index.ts`.

7. **Gestionnaire de paquets :** Utilise toujours `pnpm`. Jamais npm ou yarn.

---

## Architecture des API

NocoDB génère automatiquement une API REST depuis la base PostgreSQL. Pour interagir avec les données :
- **NE PAS** créer des routes Express pour des CRUD classiques
- **UTILISER** l'API REST NocoDB : `http://localhost:8080/api/v1/db/data/v1/{table_name}`
- **UTILISER** les hooks Refine.js (`useTable`, `useForm`, `useUpdate`) dans le dashboard

---

## En cas de doute

**En cas de doute sur l'architecture, demande confirmation au Tech Lead avant d'écrire de gros volumes de code.**

Ne présume pas. Demande. Le contexte civique et la rigueur sont plus importants que la vitesse d'exécution.
