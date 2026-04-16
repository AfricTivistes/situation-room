# Situation Room – Africa ElectionLab 🌍

**Infrastructure Civic Tech open source pour l'observation citoyenne et l'intégrité des processus électoraux.**

Conçu lors des Tech Camps / Hackathons à Dakar, cet outil est une initiative d'**AfricTivistes** issue de la fusion stratégique des programmes **AHEAD Africa** et **Digitalise Youth (#Tech4Good)**.

Notre mission : fournir aux Organisations de la Société Civile (OSC), aux fact-checkers et aux mouvements citoyens de **11 pays francophones** une plateforme souveraine, abordable et réplicable pour monitorer les élections en temps réel.

**100 % self-hosted • zéro cloud propriétaire • Frugal • AGPL-3.0**

---

## 🏛️ Le Contexte : L'Africa ElectionLab

Ce dépôt est le moteur technique de l'**Africa ElectionLab**, le laboratoire africain d'observation citoyenne des élections. Le développement de ce produit suit rigoureusement les 4 axes du laboratoire :

1. 📚 **Pédagogie :** L'outil favorise l'accès aux savoirs citoyens. Son interface et sa documentation sont pensées pour être accessibles aux profils non-techniques.
2. 🛠️ **Maker :** Nous forgeons nos propres outils. Ce code est pensé par et pour la société civile africaine, auto-hébergeable sur des infrastructures légères.
3. 🛡️ **Hacker :** Sécurité et intégrité. L'outil intègre des flux stricts de vérification (fact-checking) pour contrer la manipulation et protéger les données des observateurs sur le terrain.
4. 💡 **Innovation :** Amélioration continue des processus de monitoring via l'intégration multi-canaux (WhatsApp, SMS, Telegram).

🌱 **Soutien & Subventions (#Tech4Good) :** Les développements initiaux et les projets les plus prometteurs issus de notre communauté (La Forge Citoyenne) ont vocation à être soutenus par le mécanisme de sous-subvention du projet Digitalise Youth (5 subventions de 5 000 €), afin d'assurer leur pérennité et leur déploiement local.

---

## 🎯 À quoi sert cet outil ?

C'est un "Kit de survie électorale" clé en main permettant de :
- Recevoir des signalements d'observateurs déployés sur le terrain (via Telegram, SMS, WhatsApp).
- Structurer et vérifier ces incidents dans un espace de travail privé (Dashboard).
- Visualiser en temps réel les incidents validés sur une carte publique transparente.

---

## 🛠 Choix techniques : Frugalité & Indépendance

Pour garantir que les OSC puissent s'approprier l'outil sans dépendre de budgets cloud explosifs, nous avons fait des choix stricts :

| Couche              | Technologie                          | Pourquoi ce choix ? |
|---------------------|--------------------------------------|------------------------------------------|
| **Site public** | **Astro 5** | Ultra-rapide, SEO parfait, bundles minuscules pour les connexions bas débit. |
| **Dashboard** | **Refine.js + Vite + React 19** | CRUD ultra-rapide, orienté produit. Permet aux OSC de gérer la donnée facilement. |
| **Backend / DB** | **NocoDB + PostgreSQL 16** | Approche No-code pour la gestion : les OSC peuvent l'utiliser comme un tableur sécurisé. API instantanée. |
| **Cartographie** | Leaflet + PostGIS                    | Léger, fonctionne offline, géo puissant, indépendant de Google Maps. |
| **Webhooks** | Node.js léger                        | Extensible pour capter la donnée là où elle se trouve : WhatsApp, Telegram, SMS locaux. |
| **Déploiement** | Docker + docker-compose              | Tourne sur un VPS Linux basique (ex: 1 Go RAM). Pas de vendor lock-in. |

---

## 📁 Structure du Monorepo

```text
apps/public/        → Site vitrine public (Astro : Carte publique, rapports, méthodologie)
apps/dashboard/     → Situation Room privée (Refine : Modération, fact-checking, alertes)
apps/webhooks/      → Réception multi-canaux (Node : Telegram / SMS / WhatsApp)
packages/shared/    → Types et constantes métiers partagés (Incidents, Rôles)
docs/               → Documentation (Lis CONTRIBUTING.md en premier !)
docker/             → Conteneurs d'infrastructure
infra/postgres/     → Schémas de base de données initiaux
scripts/            → Scripts d'automatisation pour les développeurs
```

---

## 🚀 Comment démarrer en 4 étapes ?

```bash
# 1. Cloner le dépôt
git clone https://github.com/AfricTivistes/situation-room.git
cd situation-room

# 2. Lancer le script d'initialisation
bash scripts/setup.sh

# 3. (Optionnel) Insérer des données de démonstration
#    Nécessite : créer un token API dans NocoDB → Paramètres → API Tokens
#    puis l'ajouter dans .env : NOCODB_API_TOKEN=votre_token
pnpm seed

# 4. Démarrer toutes les applications
pnpm dev
```

L'API NocoDB sera disponible sur `http://localhost:8080`.  
Après `pnpm seed`, la carte affiche 28 incidents sur 5 villes et le dashboard liste des signalements avec statuts variés.

---

## 🚀 Comment contribuer ? (La Forge Citoyenne)

L'observation électorale n'est pas qu'une affaire de codeurs. **Nous imposons une inclusion radicale : développeurs, journalistes, juristes et designers sont attendus.**

Consulte [SKILLS_MAP.md](./SKILLS_MAP.md) pour trouver ton profil et ton terrain de jeu.

Consulte [CONTRIBUTING.md](./CONTRIBUTING.md) pour comprendre le processus de contribution.

### Les 3 portes d'entrée pour le code :

**A. Partie Publique (`apps/public`) – Idéal pour juniors frontend & designers**
- Rendre les données accessibles au grand public. Intégrer la carte Leaflet, optimiser le SEO.

**B. Dashboard (`apps/dashboard`) – Idéal pour devs React & fact-checkers**
- Construire les interfaces de validation des incidents. Gérer les rôles et permissions.

**C. Webhooks multi-canaux (`apps/webhooks`) – Idéal pour devs Node & experts réseau**
- Connecter les API SMS (Africa's Talking) ou WhatsApp pour fluidifier la remontée terrain.

---

## 📄 Licence

Ce projet est sous **licence AGPL-3.0**.
Toute modification ou utilisation doit rester open source et accessible au public. Nous protégeons ainsi ce bien commun numérique pour l'ensemble du continent.

**Tech Lead :** dofbi & l'équipe IT AfricTivistes.
