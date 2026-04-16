# 🗺️ Cartographie des Compétences (Skills Map)

Bienvenue dans la Situation Room ! Pas besoin de tout maîtriser pour contribuer. Trouve ton profil ci-dessous et découvre ton terrain de jeu.

---

## 🎨 Profils Frontend & Intégrateurs
**Tes compétences :** HTML, CSS, Tailwind, notions de JavaScript.
**Où aller :** `apps/public/` (Astro)
**Ta mission :** Créer des interfaces légères, accessibles et rapides pour le grand public. Intégrer les cartes interactives (Leaflet). Optimiser le rendu pour les connexions mobiles 3G.

**Premières issues suggérées :**
- Créer la page d'accueil (`src/pages/index.astro`)
- Intégrer la carte Leaflet pour afficher les incidents validés
- Créer le composant `Header.astro` et `Footer.astro`

---

## ⚛️ Profils React & Orientés Produit
**Tes compétences :** React, Hooks, TypeScript, création de Back-office.
**Où aller :** `apps/dashboard/` (Refine.js)
**Ta mission :** Construire l'interface privée des fact-checkers. Créer des tableaux de validation fluides et des formulaires de gestion d'incidents.

**Premières issues suggérées :**
- Créer la vue liste des signalements (`/reports`)
- Créer le formulaire de validation d'un incident
- Implémenter les filtres par statut (`pending`, `verified`, `rejected`)

---

## ⚙️ Profils Backend & API
**Tes compétences :** Node.js, Express, requêtes HTTP, manipulation de JSON.
**Où aller :** `apps/webhooks/`
**Ta mission :** Connecter la plateforme au monde réel. Coder les écouteurs pour recevoir les messages WhatsApp, SMS et Telegram.

**Premières issues suggérées :**
- Créer le handler Telegram Bot (`src/handlers/telegram.ts`)
- Créer le handler Africa's Talking SMS (`src/handlers/sms.ts`)
- Créer le handler WhatsApp Business API (`src/handlers/whatsapp.ts`)

---

## 🗄️ Profils Data & DevOps
**Tes compétences :** SQL, PostgreSQL, Docker, Linux (VPS).
**Où aller :** `infra/postgres/` et `docker/`
**Ta mission :** Modéliser la base de données, sécuriser les accès NocoDB, optimiser les performances pour les serveurs à ressources limitées.

**Premières issues suggérées :**
- Enrichir le schéma SQL initial (`01-init.sql`) avec les tables métier
- Ajouter les extensions PostGIS pour la géolocalisation
- Configurer le reverse proxy Nginx (`docker/nginx/`)

---

## ⚖️ Profils Non-Techniques (Journalistes, Juristes, Designers)
**Tes compétences :** Fact-checking, droit électoral, UI/UX, rédaction claire.
**Où aller :** `docs/`, ou les Issues GitHub.
**Ta mission :** Vous êtes les garants du "Pourquoi". Testez les interfaces du dashboard, rédigez les guides d'utilisation pour les OSC, et définissez les flux de vérification (quand est-ce qu'un incident passe de "suspect" à "avéré" ?).

**Premières issues suggérées :**
- Rédiger le guide d'utilisation pour les observateurs terrain
- Définir la méthodologie de fact-checking (dans `docs/METHODOLOGY.md`)
- Tester l'accessibilité du site public sur mobile bas de gamme

---

## 🤝 Pour tout le monde

Quelle que soit ton entrée, voici les étapes communes :
1. Lis le `README.md` du dossier dans lequel tu vas travailler
2. Lance l'environnement local : `bash scripts/setup.sh` puis `pnpm dev`
3. Cherche une issue avec le label `good first issue`
4. Crée une branche : `feature/ton-nom-feature`
5. Ouvre une Pull Request et décris ce que tu as fait
