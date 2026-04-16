// =============================================================
// Handler WhatsApp Business API (Meta) – Situation Room Webhooks
// =============================================================
// Ce handler reçoit les messages WhatsApp via l'API Meta Cloud
// et les transforme en signalements dans la base de données.
//
// Pré-requis :
// 1. Créer une application Meta Business : https://developers.facebook.com/
// 2. Configurer WhatsApp Business API
// 3. Renseigner WHATSAPP_TOKEN et WHATSAPP_VERIFY_TOKEN dans .env
// 4. Configurer le webhook : https://votre-domaine.org/webhooks/api/whatsapp
//
// Documentation : https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks
// =============================================================

import { Request, Response } from 'express';

const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'mon_token_de_verification';
const NOCODB_API_URL = process.env.NOCODB_API_URL || 'http://localhost:8080/api/v1/db/data/v1/situation_room';
const NOCODB_API_TOKEN = process.env.NOCODB_API_TOKEN || '';

// Vérification du webhook par Meta (appelée une seule fois lors de la configuration)
export function verifyWhatsAppWebhook(req: Request, res: Response): void {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
    console.log('✅ Webhook WhatsApp vérifié par Meta');
    res.status(200).send(challenge);
  } else {
    console.error('❌ Vérification du webhook WhatsApp échouée');
    res.status(403).send('Forbidden');
  }
}

// Réception des messages WhatsApp entrants
export async function handleWhatsAppWebhook(req: Request, res: Response): Promise<void> {
  const body = req.body;

  // S'assurer que c'est bien un événement WhatsApp
  if (body.object !== 'whatsapp_business_account') {
    res.status(404).send('Not Found');
    return;
  }

  try {
    // Parcourir les messages reçus
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const messages = change.value?.messages || [];

        for (const message of messages) {
          if (message.type !== 'text') continue; // Ignorer les médias pour l'instant

          const from = message.from;       // Numéro WhatsApp de l'expéditeur
          const text = message.text?.body; // Contenu du message

          if (!text) continue;

          console.log(`📲 Message WhatsApp de ${from} : ${text}`);

          // TODO : Adapter le parsing au format terrain de vos observateurs
          await fetch(`${NOCODB_API_URL}/base_reports`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xc-token': NOCODB_API_TOKEN,
            },
            body: JSON.stringify({
              title: text.substring(0, 100),
              description: text,
              source: 'whatsapp',
              status: 'pending',
              latitude: null,
              longitude: null,
            }),
          });

          console.log('✅ Signalement WhatsApp inséré en base');
        }
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors du traitement du webhook WhatsApp :', error);
  }

  // WhatsApp exige une réponse 200 rapide
  res.status(200).send('EVENT_RECEIVED');
}
