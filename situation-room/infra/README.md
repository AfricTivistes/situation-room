# 🗄️ Infrastructure (Base de données)

**Rôle :** Ce dossier gère l'état initial et les migrations de la base de données PostgreSQL 16.

---

## Comment ça fonctionne ?

Le fichier `postgres/01-init.sql` est **exécuté automatiquement** au premier lancement du conteneur Docker PostgreSQL. Il crée les tables de base de notre modèle de données.

Si vous avez déjà des données et que vous voulez ajouter une nouvelle table, créez un fichier `02-votre-migration.sql`. Docker exécutera les fichiers dans l'ordre alphabétique.

---

## Pourquoi pas d'ORM complexe (Prisma/TypeORM) ?

Pour permettre aux utilisateurs non-techniques des OSC d'interagir avec la donnée, nous utilisons **NocoDB** (une alternative open source à Airtable / Google Sheets). Il expose directement la base PostgreSQL via une interface visuelle et génère des API REST/GraphQL automatiquement.

Cela permet à un journaliste ou un coordinateur d'OSC de modifier les données directement, sans avoir besoin de coder.

---

## Accéder à NocoDB

Une fois Docker lancé :
- **Interface admin :** `http://localhost:8080`
- **API REST :** `http://localhost:8080/api/v1/db/data/v1/situation_room`
- **Documentation API :** `http://localhost:8080/api/v1/meta/tables`

---

## Contribuer au schéma

Pour modifier ou enrichir le schéma :
1. Modifiez `postgres/01-init.sql` pour les tables de base
2. Créez `postgres/02-votre-feature.sql` pour les nouvelles tables
3. Documentez vos tables avec des `COMMENT ON TABLE`
4. Testez en local avec `docker-compose -f docker-compose.dev.yml down -v && docker-compose -f docker-compose.dev.yml up -d`
