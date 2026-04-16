// =============================================================
// Constantes partagées – Situation Room / Africa ElectionLab
// =============================================================

// Statuts des signalements (utilisés dans les filtres et les badges UI)
export const REPORT_STATUSES = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

// Canaux de réception des signalements
export const REPORT_SOURCES = {
  WHATSAPP: 'whatsapp',
  TELEGRAM: 'telegram',
  SMS: 'sms',
  WEB: 'web',
} as const;

// Labels lisibles pour l'interface utilisateur
export const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  verified: 'Vérifié',
  rejected: 'Rejeté',
};

export const SOURCE_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  sms: 'SMS',
  web: 'Web',
};
