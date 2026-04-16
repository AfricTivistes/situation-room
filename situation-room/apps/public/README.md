# 🌍 Site Public (Astro)

**Rôle :** C'est la vitrine publique du projet. Elle sert à afficher les incidents **vérifiés** sur une carte publique, à présenter la méthodologie, et à offrir une interface de signalement web très légère pour les citoyens.

**Pourquoi Astro ?**
Nous avons besoin que ce site se charge instantanément, même sur des connexions mobiles 3G instables. Astro génère du HTML statique par défaut (Zero JS) et ne charge le JavaScript que lorsque c'est strictement nécessaire (pour la carte interactive Leaflet, par exemple).

---

## 🛠️ Comment ce projet a été initialisé

Si vous voulez comprendre comment ce dossier a été créé ou si vous devez le recréer, voici les commandes exactes depuis la racine du monorepo :

```bash
# 1. Création du projet Astro
pnpm create astro@latest apps/public
# Options : Template Empty, TypeScript Strict, Install dependencies Yes

# 2. Ajout des intégrations (Tailwind CSS et React pour la carte)
cd apps/public
pnpm astro add tailwind react
```

---

## 🚀 Démarrage rapide

```bash
# Depuis la racine du monorepo
pnpm dev:public
```

Le site est accessible sur `http://localhost:4321`.

---

## 🏗️ Structure attendue

```
src/
├── pages/          → Routes de l'application (index.astro, carte.astro, etc.)
├── components/     → Composants UI réutilisables (Map.tsx, Header.astro...)
├── layouts/        → Gabarits de page
└── content/        → Contenus statiques (markdown, articles)
```

**Règle d'or :** Limitez l'utilisation de React dans ce dossier uniquement aux composants qui ont besoin de réactivité complexe (comme la carte Leaflet). Le reste doit être du HTML/Astro pur pour maximiser la performance.

---

## 🎯 Issues suggérées pour le hackathon

- Créer la page d'accueil (`src/pages/index.astro`)
- Intégrer la carte Leaflet avec les incidents validés (`src/components/Map.tsx`)
- Créer le formulaire de signalement citoyen en ligne
- Optimiser le Lighthouse Score pour les connexions mobiles
