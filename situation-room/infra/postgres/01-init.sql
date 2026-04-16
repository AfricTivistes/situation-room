-- =============================================================
-- Situation Room – Africa ElectionLab
-- Schéma de base de données initial (générique)
-- =============================================================
-- Ce schéma est intentionnellement agnostique : il peut servir
-- aussi bien pour des élections que pour d'autres signalements
-- citoyens (inondations, routes, incidents sanitaires...).
--
-- Les participants du Tech Camp sont invités à enrichir ce schéma
-- avec les tables métier spécifiques à leur contexte.
-- =============================================================

-- Extension pour la géolocalisation avancée (PostGIS)
-- Décommenter si PostGIS est disponible sur votre serveur
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- Table principale des signalements terrain
CREATE TABLE IF NOT EXISTS base_reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    -- Source du signalement : via quel canal est-il arrivé ?
    source VARCHAR(50) NOT NULL DEFAULT 'web', -- 'whatsapp', 'telegram', 'sms', 'web'
    -- Statut du signalement dans le pipeline de vérification
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    -- Géolocalisation (optionnelle selon les cas terrain)
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    -- Horodatage automatique
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour accélérer les recherches par statut (filtre principal du dashboard)
CREATE INDEX idx_reports_status ON base_reports(status);

-- Index pour accélérer les recherches géographiques (affichage carte)
CREATE INDEX idx_reports_location ON base_reports(latitude, longitude);

-- Commentaires pour documenter la table dans NocoDB
COMMENT ON TABLE base_reports IS 'Signalements terrain reçus via tous les canaux (web, SMS, WhatsApp, Telegram)';
COMMENT ON COLUMN base_reports.source IS 'Canal de réception du signalement : web, whatsapp, telegram, sms';
COMMENT ON COLUMN base_reports.status IS 'Statut de vérification : pending (à vérifier), verified (validé), rejected (rejeté)';
