// =============================================================
// Configuration Refine.js – Situation Room Dashboard
// =============================================================
// Ce fichier centralise les ressources exposées par NocoDB.
// Chaque "resource" correspond à une table PostgreSQL.
//
// Les contributeurs ajouteront ici les nouvelles ressources
// métier créées lors du hackathon (ex: "incidents", "users"...).
// =============================================================

export const resources = [
  {
    // Table principale des signalements terrain (créée dans 01-init.sql)
    name: 'base_reports',
    list: '/reports',
    show: '/reports/:id',
    edit: '/reports/:id/edit',
    meta: {
      label: 'Signalements',
    },
  },
  // TODO : Ajouter ici les autres tables métier créées lors du Tech Camp
  // Exemple :
  // {
  //   name: 'election_incidents',
  //   list: '/incidents',
  //   ...
  // },
];

// URL de l'API NocoDB (configurée via variable d'environnement)
export const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8080/api/v1/db/data/v1/situation_room';
