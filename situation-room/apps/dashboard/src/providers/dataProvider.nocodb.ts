// =============================================================
// Data Provider NocoDB – Situation Room Dashboard
// =============================================================
// Ce fichier adapte l'API NocoDB au format attendu par Refine.js.
// NocoDB génère automatiquement une API REST depuis PostgreSQL.
//
// Documentation NocoDB API :
// https://docs.nocodb.com/developer-resources/rest-apis/
// =============================================================

import dataProvider from '@refinedev/simple-rest';
import { API_URL } from '../../refine.config';

// Token d'API NocoDB (à configurer dans NocoDB → Paramètres → API Tokens)
const NOCODB_API_TOKEN = import.meta.env.VITE_NOCODB_API_TOKEN || '';

// Créer le provider Refine connecté à NocoDB
// Les requêtes seront automatiquement enrichies avec le token d'authentification
export const noCodBDataProvider = dataProvider(API_URL, {
  // Injecter le token NocoDB dans chaque requête API
  headers: {
    'xc-token': NOCODB_API_TOKEN,
  },
} as RequestInit);

// TODO (pour les contributeurs du Tech Camp) :
// Si vous souhaitez personnaliser les requêtes (ex: transformer les paramètres
// de tri ou de filtre pour les adapter à NocoDB), surchargez les méthodes ici.
// Exemple : adapter le format de pagination NocoDB vs Refine.
