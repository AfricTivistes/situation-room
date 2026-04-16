# Document de Présentation — Situation Room

> **AfricTivistes — Pôle IT**
> Programmes : AHEAD Africa & Digitalise Youth (#Tech4Good)
> Dernière mise à jour : Avril 2026

> **Ce document** est destiné au partage externe : bailleurs, partenaires institutionnels, OSC, journalistes et décideurs. Il présente la vision, les valeurs et l'impact du projet en langage accessible, sans prérequis technique.
> Pour la documentation technique destinée aux développeurs et contributeurs, consulter [`TECHNICAL_REFERENCE.md`](./TECHNICAL_REFERENCE.md) ou le dépôt GitHub du projet.

---

**Dépôt officiel du projet :** [https://github.com/AfricTivistes/situation-room](https://github.com/AfricTivistes/situation-room)

---

## Table des matières

1. [Vision & Contexte](#1-vision--contexte)
2. [Ce que nous construisons](#2-ce-que-nous-construisons)
3. [Valeurs Fondamentales](#3-valeurs-fondamentales)
4. [De l'Événement au Produit](#4-de-lévénement-au-produit)
5. [Objectifs à Long Terme (2026–2030)](#5-objectifs-à-long-terme-20262030)
6. [Groupes Cibles & Impact](#6-groupes-cibles--impact)
7. [Licence — AGPL-3.0](#7-licence--agpl-30)
8. [Contact & Contribution](#8-contact--contribution)

---

## 1. Vision & Contexte

### Pourquoi ce projet existe

Sur le continent africain, la majorité des crises politiques et institutionnelles trouvent leur origine dans les périodes **pré et post-électorales**. L'organisation d'élections libres, transparentes et crédibles reste un défi structurel pour de nombreux États. Face à cette réalité, les Organisations de la Société Civile (OSC) et les mouvements citoyens manquent cruellement d'infrastructures technologiques **souveraines, fiables et adaptées** à leurs réalités terrain — contraintes de coût, de connectivité et de sécurité.

Ce projet répond directement à ce manque. Nous ne créons pas un outil de plus. Nous bâtissons **un bien commun numérique** : une infrastructure civique que chaque OSC peut s'approprier, déployer et adapter à son contexte national.

### Ancrage programmatique

Ce projet s'inscrit dans deux programmes complémentaires portés par **AfricTivistes** :

**AHEAD Africa — Africa ElectionLab Centre**

Le centre Africa ElectionLab est un laboratoire africain d'observation citoyenne des élections, basé à Dakar. Sa mission : développer des solutions technologiques pour renforcer la transparence et l'intégrité des processus électoraux, en réponse aux recommandations de l'Union Africaine. Quatre axes structurants guident ses actions :

| Axe | Mission |
|-----|---------|
| **Pédagogie** | Éduquer les citoyens sur leurs droits et les processus électoraux |
| **Maker** | Développer des outils technologiques pour la transparence électorale |
| **Hacker** | Promouvoir la sécurité des systèmes et la protection des données |
| **Innovation** | Explorer de nouvelles approches pour améliorer les processus démocratiques |

**Digitalise Youth — #Tech4Good Hackathon**

Ce programme mobilise les jeunes développeurs et organisations de jeunesse africaines autour de solutions civiques. Il offre **5 subventions de 5 000 € chacune** pour soutenir des projets technologiques de gouvernance démocratique dans **11 pays francophones**, accompagnées de 4 mois de mentorat et d'assistance technique.

---

## 2. Ce que nous construisons

La **Situation Room** est une plateforme open source de monitoring électoral en temps réel. Elle permet à une OSC de :

1. **Recevoir des signalements** d'observateurs déployés sur le terrain via les canaux qu'ils utilisent déjà — WhatsApp, SMS, Telegram, ou un formulaire web.
2. **Vérifier et modérer** ces signalements dans un espace de travail privé, grâce à un processus de fact-checking structuré.
3. **Publier les incidents validés** sur une carte interactive transparente, accessible à tous les citoyens.

```
OBSERVATEUR SUR LE TERRAIN
  → Envoie un signalement (WhatsApp / SMS / Telegram)
        ↓
ÉQUIPE DE MODÉRATION (privée)
  → Vérifie, valide ou rejette le signalement
        ↓
CARTE PUBLIQUE (accessible à tous)
  → Affiche uniquement les incidents vérifiés
```

Seule l'information **vérifiée** est rendue publique. Cette garantie est fondamentale pour la crédibilité de l'outil auprès des médias, des autorités électorales et de l'opinion publique.

### Ce que la Situation Room n'est pas

- Ce n'est **pas** un système de vote électronique.
- Ce n'est **pas** une plateforme propriétaire appartenant à AfricTivistes — chaque OSC en est propriétaire dans son propre déploiement.
- Ce n'est **pas** un système centralisé — chaque OSC héberge sa propre instance, sur son propre serveur, avec ses propres données.

---

## 3. Valeurs Fondamentales

Ces quatre piliers guident chaque décision du projet. Ils sont **non négociables**.

### Souveraineté des Données

> *"Les outils électoraux hébergés chez des tiers exposent les OSC à des risques d'ingérence, de censure ou de perte de données."*

La Situation Room est entièrement **auto-hébergeable** : chaque organisation installe et gère sa propre copie sur ses propres serveurs. Aucune donnée n'est stockée sur des serveurs d'AfricTivistes ou de services cloud étrangers. Les OSC restent les seules et uniques propriétaires de leurs données électorales.

### Inclusion Radicale

> *"Un outil civique doit être pensé par et pour la société civile."*

La conception implique à **50% des profils non-techniques** : journalistes, juristes, activistes terrain, designers. Les interfaces sont pensées pour être utilisables par des coordinateurs de terrain sans formation informatique. Les canaux de signalement (WhatsApp, SMS) sont ceux que les observateurs utilisent déjà au quotidien.

### Frugalité & Résilience

> *"L'infrastructure doit fonctionner avec des ressources limitées, sur des connexions instables."*

L'ensemble de la plateforme peut fonctionner sur un serveur coûtant moins de **10 € par mois**. Les canaux de signalement intègrent des solutions fonctionnant même sans connexion internet stable (SMS, USSD), pour garantir la continuité de l'observation électorale même en cas de coupures réseau.

### Transparence & Qualité

> *"S'agissant de données électorales, la rigueur est de mise."*

Le code source est entièrement public et auditable. Chaque modification est revue par au moins deux membres de l'équipe. Les standards de développement sont alignés sur les meilleures pratiques industrielles, pour garantir la fiabilité de la plateforme en situation de crise.

---

## 4. De l'Événement au Produit

### Le changement de paradigme

Les hackathons traditionnels produisent souvent du code "jetable" qui ne survit pas à l'événement. Cette initiative marque une **rupture délibérée** avec cette approche.

| Approche classique | Notre approche |
|-------------------|----------------|
| Hackathon → prototype | Tech Camp → MVP fonctionnel |
| Code abandonné après l'événement | Produit open source maintenu sur le long terme |
| Pas de communauté | Coalition panafricaine de développeurs citoyens |
| Pas de standard commun | Standard réplicable par toute OSC |

### Le Tech Camp de Dakar comme étincelle

Le rassemblement de 5 jours à Dakar n'est pas la finalité — c'est **l'étincelle**. L'équipe technique d'AfricTivistes y arrive avec une architecture de base déjà opérationnelle, pour que les participants (développeurs, designers, juristes, journalistes) puissent se concentrer immédiatement sur des fonctionnalités à impact terrain.

### La Forge Citoyenne

Pour garantir la pérennité du projet, nous bâtissons une **communauté de contributeurs** inspirée des modèles open source qui ont fait leurs preuves (Mozilla, g0v à Taiwan) :

- **Guides de contribution** en français et en langues locales
- **Rôles clairs** pour les profils techniques et non-techniques : développeurs, fact-checkers, designers, juristes
- **Système de reconnaissance** : tableau d'honneur des contributeurs, accès prioritaire aux subventions #Tech4Good
- **Formation par l'action** : les jeunes apprennent les standards professionnels en contribuant à un outil à impact réel

---

## 5. Objectifs à Long Terme (2026–2030)

Le succès de cette initiative ne se mesurera pas à la fin du Tech Camp, mais au nombre d'élections sécurisées par cet outil dans les années à venir.

**Adoption continentale**
Faire de la Situation Room le nouveau standard de monitoring électoral en Afrique francophone, en remplacement des instances vieillissantes d'Ushahidi ou des groupes WhatsApp informels.

**Décentralisation de la maintenance**
AfricTivistes amorce le projet, mais ne doit pas en rester l'unique mainteneur. D'ici 2-3 ans, la plateforme sera maintenue par une **coalition panafricaine de développeurs citoyens**.

**L'éducation par l'action**
Utiliser ce projet comme véhicule éducatif pour le programme Digitalise Youth : les jeunes apprendront le développement professionnel, la cybersécurité et l'engagement civique en contribuant à un outil qui a un impact réel sur leur pays.

---

## 6. Groupes Cibles & Impact

### Bénéficiaires directs

- **OSC nationales, régionales et continentales** déployant des dispositifs d'observation électorale
- **Groupes et citoyens observateurs** des élections, notamment dans les zones à faible connectivité
- **Initiatives civic tech** souhaitant s'appuyer sur une infrastructure souveraine et mutualisée
- **Jeunes développeurs** des 11 pays cibles, formés à travers les Tech Camps et le programme Digitalise Youth

### Bénéficiaires indirects

- Autorités électorales et publiques souhaitant bénéficier d'une observation citoyenne structurée
- Médias et journalistes d'investigation couvrant les élections
- Décideurs à l'Union Africaine et dans les institutions régionales
- Populations des pays couverts, dont la sécurité électorale est renforcée

### Pays ciblés (11 pays francophones)

Sénégal · Côte d'Ivoire · Mali · Burkina Faso · Niger · Cameroun · RDC · Guinée · Togo · Bénin · Madagascar

---

## 7. Licence — AGPL-3.0

La Situation Room est publiée sous **licence GNU Affero General Public License version 3 (AGPL-3.0)**.

**Dépôt officiel :** [https://github.com/AfricTivistes/situation-room](https://github.com/AfricTivistes/situation-room)
**Texte complet de la licence :** [https://www.gnu.org/licenses/agpl-3.0.fr.html](https://www.gnu.org/licenses/agpl-3.0.fr.html)

### Pourquoi l'AGPL-3.0 et pas une autre licence ?

Le choix de la licence est une décision stratégique, pas seulement technique. Voici pourquoi l'AGPL-3.0 est la bonne licence pour un outil civic tech d'intérêt public :

| Licence | Type | Risque pour un outil civic tech |
|---------|------|----------------------------------|
| **MIT / Apache** | Permissive | Une entreprise peut prendre le code, le modifier et **ne pas repartager** ses améliorations. L'outil peut devenir propriétaire. |
| **GPL-3.0** | Copyleft fort | Les modifications doivent être partagées, mais une organisation peut héberger l'outil modifié comme service **sans partager le code** (faille "SaaS"). |
| **AGPL-3.0** ✅ | Copyleft maximal | Toute modification — y compris un service hébergé — doit être rendue publique. **Aucune exception.** |

L'AGPL-3.0 est la seule licence qui garantit que la Situation Room reste un **bien commun pour toujours**, même si une organisation décide de la modifier et de l'héberger pour ses propres besoins.

### Ce que cela signifie pour les OSC qui déploient l'outil

**Vous pouvez librement :**
- Télécharger, installer et utiliser la Situation Room pour vos activités d'observation électorale
- L'adapter à votre contexte national (langue, type d'incidents, zones géographiques)
- La déployer sur vos propres serveurs, sans payer de licence
- Former vos équipes à son utilisation

**Vous devez :**
- Conserver la mention de la licence AGPL-3.0 dans le code
- Si vous modifiez le code source et le mettez à disposition d'autres personnes (y compris via un service en ligne), rendre vos modifications accessibles au public sous la même licence

**En pratique :** une OSC qui déploie la Situation Room telle quelle pour ses propres élections n'a **aucune obligation supplémentaire**. L'obligation de partager ne s'applique que si vous distribuez ou hébergez une version modifiée pour d'autres utilisateurs.

### Ce que cela signifie pour les organisations souhaitant modifier le code

Toute organisation (entreprise, gouvernement, ONG) qui modifie la Situation Room et la met à disposition d'autres utilisateurs — que ce soit en distribuant le code ou en l'hébergeant comme service en ligne — **doit publier ses modifications** sous la même licence AGPL-3.0.

Cela protège l'ensemble de l'écosystème : les améliorations apportées par n'importe qui bénéficient à toute la communauté.

### Copyright

```
Copyright (C) 2024 AfricTivistes – Africa ElectionLab
GNU Affero General Public License v3.0
```

Ce projet est un **bien commun numérique pour le continent africain**, protégé par cette licence copyleft forte pour garantir qu'il reste ouvert, auditable et au service de l'intérêt public.

---

## 8. Contact & Contribution

### Équipe technique

**Tech Lead :** l'équipe IT AfricTivistes
**Organisation :** [AfricTivistes](https://africTivistes.org)

### Dépôt GitHub

[https://github.com/AfricTivistes/situation-room](https://github.com/AfricTivistes/situation-room)

Ce dépôt contient :
- Le code source complet de la plateforme
- La documentation technique pour les développeurs
- Les guides de contribution pour tous les profils (techniques et non-techniques)
- Les issues GitHub pour signaler des bugs ou proposer des fonctionnalités

### La Forge Citoyenne

Pour rejoindre la communauté de contributeurs, participer aux Tech Camps ou suivre l'avancement du projet, consultez le dépôt GitHub et les ressources du programme Digitalise Youth d'AfricTivistes.

### Mécanisme de sous-subvention #Tech4Good

Les projets les plus promettants issus de la communauté peuvent bénéficier d'un soutien financier via le mécanisme de subventions du programme Digitalise Youth : **5 subventions de 5 000 €** pour soutenir le développement et le déploiement de solutions électorales innovantes.

---

*Ce document est un bien commun. Il peut être librement reproduit et partagé en mentionnant la source : AfricTivistes – Africa ElectionLab, dans le cadre des programmes AHEAD Africa et Digitalise Youth.*
