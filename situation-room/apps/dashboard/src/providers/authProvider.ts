// =============================================================
// Auth Provider – Situation Room Dashboard
// =============================================================
// Gère l'authentification des modérateurs et fact-checkers.
// S'appuie sur le système d'authentification intégré de NocoDB.
//
// TODO (pour les contributeurs) : Implémenter la connexion réelle
// via l'API NocoDB : POST /api/v1/auth/user/signin
// Documentation : https://docs.nocodb.com/developer-resources/rest-apis/#authentication
// =============================================================

import type { AuthProvider } from '@refinedev/core';

const NOCODB_API_URL =
  import.meta.env.VITE_NOCODB_URL || 'http://localhost:8080';

export const authProvider: AuthProvider = {
  // Connexion avec email + mot de passe (via NocoDB)
  login: async ({ email, password }) => {
    try {
      const response = await fetch(
        `${NOCODB_API_URL}/api/v1/auth/user/signin`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Stocker le token JWT pour les requêtes suivantes
        localStorage.setItem('nocodb_token', data.token);
        return { success: true, redirectTo: '/' };
      }

      return {
        success: false,
        error: {
          name: 'Erreur de connexion',
          message: 'Email ou mot de passe incorrect.',
        },
      };
    } catch {
      return {
        success: false,
        error: {
          name: 'Erreur réseau',
          message: 'Impossible de contacter le serveur.',
        },
      };
    }
  },

  // Déconnexion
  logout: async () => {
    localStorage.removeItem('nocodb_token');
    return { success: true, redirectTo: '/login' };
  },

  // Vérifier si l'utilisateur est connecté
  check: async () => {
    const token = localStorage.getItem('nocodb_token');
    if (token) {
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: '/login' };
  },

  // Récupérer les informations de l'utilisateur connecté
  getIdentity: async () => {
    const token = localStorage.getItem('nocodb_token');
    if (!token) return null;

    try {
      const response = await fetch(`${NOCODB_API_URL}/api/v1/auth/user/me`, {
        headers: { 'xc-auth': token },
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      return null;
    }
    return null;
  },

  // Gestion des erreurs 401/403
  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return { logout: true, redirectTo: '/login' };
    }
    return { error };
  },
};
