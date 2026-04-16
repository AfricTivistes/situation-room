// =============================================================
// Handler Telegram Bot – Situation Room Webhooks
// =============================================================
// Ce handler reçoit les messages envoyés à votre Bot Telegram
// et les transforme en signalements dans la base de données.
//
// Pré-requis :
// 1. Créer un Bot via @BotFather sur Telegram
// 2. Récupérer le token et le mettre dans .env (TELEGRAM_BOT_TOKEN)
// 3. Enregistrer le webhook : https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://votre-domaine.org/webhooks/api/telegram
//
// Documentation : https://core.telegram.org/bots/api
// =============================================================

import { Request, Response } from 'express';

// Structure d'un message Telegram (simplifié)
interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      username?: string;
      first_name?: string;
    };
    chat: { id: number };
    text?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
    date: number;
  };
}

// URL de l'API NocoDB pour insérer les signalements
const NOCODB_API_URL = process.env.NOCODB_API_URL || 'http://localhost:8080/api/v1/db/data/v1/situation_room';
const NOCODB_API_TOKEN = process.env.NOCODB_API_TOKEN || '';

export async function handleTelegramWebhook(req: Request, res: Response): Promise<void> {
  const update: TelegramUpdate = req.body;

  // Ignorer les mises à jour sans message texte
  if (!update.message?.text) {
    res.status(200).send('ok');
    return;
  }

  const message = update.message;
  const senderName = message.from.username || message.from.first_name || 'Anonyme';

  console.log(`📨 Message Telegram de @${senderName} : ${message.text}`);

  try {
    // TODO : Insérer le signalement dans NocoDB
    // Adapter le corps JSON à votre modèle de données réel
    await fetch(`${NOCODB_API_URL}/base_reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xc-token': NOCODB_API_TOKEN,
      },
      body: JSON.stringify({
        title: message.text.substring(0, 100), // Prendre les 100 premiers caractères
        description: message.text,
        source: 'telegram',
        status: 'pending',
        // Géolocalisation si l'utilisateur l'a partagée
        latitude: message.location?.latitude || null,
        longitude: message.location?.longitude || null,
      }),
    });

    console.log('✅ Signalement Telegram inséré en base');
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion du signalement Telegram :', error);
  }

  res.status(200).send('ok');
}
