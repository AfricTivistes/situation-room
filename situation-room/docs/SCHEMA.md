# Schéma de base de données – Situation Room

Ce document décrit le modèle de données actuel et les conventions à suivre pour l'étendre.

---

## Schéma initial (boilerplate)

```sql
Table: base_reports
┌─────────────┬─────────────────────────────────────────┬──────────┐
│ Colonne     │ Type                                    │ Défaut   │
├─────────────┼─────────────────────────────────────────┼──────────┤
│ id          │ SERIAL PRIMARY KEY                      │ auto     │
│ title       │ VARCHAR(255) NOT NULL                   │ —        │
│ description │ TEXT                                    │ null     │
│ source      │ VARCHAR(50) NOT NULL                    │ 'web'    │
│ status      │ VARCHAR(50) NOT NULL                    │ 'pending'│
│ latitude    │ DECIMAL(10,8)                           │ null     │
│ longitude   │ DECIMAL(11,8)                           │ null     │
│ created_at  │ TIMESTAMP WITH TIME ZONE                │ NOW()    │
│ updated_at  │ TIMESTAMP WITH TIME ZONE                │ NOW()    │
└─────────────┴─────────────────────────────────────────┴──────────┘
```

### Valeurs autorisées
- `source` : `'web'` | `'whatsapp'` | `'telegram'` | `'sms'`
- `status` : `'pending'` | `'verified'` | `'rejected'`

---

## Tables métier à créer lors du hackathon

Les participants sont libres de créer leurs propres tables selon le contexte électoral. Voici des suggestions :

### `election_incidents` (pour le contexte électoral)
```sql
CREATE TABLE election_incidents (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES base_reports(id),  -- Lien avec le signalement brut
    incident_type VARCHAR(100),  -- ex: 'bureau_ferme', 'violence', 'bourrage_urne'
    region VARCHAR(100),
    commune VARCHAR(100),
    polling_station_code VARCHAR(50),
    severity VARCHAR(20) DEFAULT 'medium',  -- 'low', 'medium', 'high', 'critical'
    verified_by INTEGER,  -- ID du modérateur
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### `polling_stations` (bureaux de vote)
```sql
CREATE TABLE polling_stations (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100),
    commune VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    total_voters INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### `observers` (observateurs déployés)
```sql
CREATE TABLE observers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE,           -- Numéro WhatsApp/SMS de l'observateur
    telegram_id VARCHAR(50),            -- ID Telegram
    assigned_station_id INTEGER REFERENCES polling_stations(id),
    organization VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## Conventions de nommage

| Élément | Convention | Exemple |
|---------|-----------|---------|
| Tables | `snake_case`, pluriel | `election_incidents` |
| Colonnes | `snake_case` | `created_at` |
| Clés étrangères | `<table_singulier>_id` | `report_id` |
| Index | `idx_<table>_<colonne>` | `idx_reports_status` |
| Contraintes | `ck_<table>_<colonne>` | `ck_reports_status` |

---

## Extensions PostgreSQL utiles

```sql
-- Géolocalisation avancée (distances, zones géographiques)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Recherche full-text en français
CREATE EXTENSION IF NOT EXISTS unaccent;

-- UUID si vous préférez aux SERIAL integers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## NocoDB et l'API automatique

Une fois vos tables créées, NocoDB les détecte automatiquement et génère :
- **API REST :** `GET/POST/PATCH/DELETE /api/v1/db/data/v1/situation_room/<table_name>`
- **API GraphQL :** `/api/v1/db/data/v1/situation_room/graphql`
- **Interface visuelle :** Accessible sur `http://localhost:8080`

Aucun code backend supplémentaire n'est nécessaire pour le CRUD de base.
