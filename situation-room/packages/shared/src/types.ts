// =============================================================
// Types partagés – Situation Room / Africa ElectionLab
// =============================================================
// Ce fichier est le "contrat" entre toutes les applications.
// Si vous modifiez un type ici, l'erreur remontera automatiquement
// dans tous les autres packages lors de la compilation TypeScript.
// =============================================================

// Statuts possibles d'un signalement dans le pipeline de vérification
export type ReportStatus = 'pending' | 'verified' | 'rejected';

// Canaux par lesquels un signalement peut arriver
export type ReportSource = 'whatsapp' | 'telegram' | 'sms' | 'web';

// Définition agnostique d'un signalement terrain
export interface BaseReport {
  id: number;
  title: string;
  description?: string;
  source: ReportSource;
  status: ReportStatus;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Rôles utilisateurs dans le dashboard (à étendre selon le contexte)
export type UserRole = 'admin' | 'moderator' | 'observer' | 'viewer';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  createdAt: Date;
}

// Payload reçu par le serveur de webhooks depuis les canaux externes
export interface WebhookPayload {
  source: ReportSource;
  rawMessage: string;
  senderPhone?: string;
  timestamp: Date;
}
