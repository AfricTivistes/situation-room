// =============================================================
// Handler SMS – Africa's Talking – Situation Room Webhooks
// =============================================================
// Ce handler reçoit les SMS envoyés à votre numéro Africa's Talking
// et les transforme en signalements dans la base de données.
//
// Pré-requis :
// 1. Créer un compte sur https://africastalking.com/
// 2. Acheter un numéro de téléphone dans votre pays
// 3. Configurer l'URL de callback : https://votre-domaine.org/webhooks/api/sms
// 4. Renseigner AFRICASTALKING_USERNAME et AFRICASTALKING_API_KEY dans .env
//
// Documentation : https://developers.africastalking.com/docs/sms/receiving
// =============================================================

import { Request, Response } from 'express';

// Structure d'un SMS entrant Africa's Talking
interface AfricasTalkingSmsPayload {
  from: string;          // Numéro de l'expéditeur
  to: string;            // Votre numéro
  text: string;          // Contenu du SMS
  date: string;          // Date de réception
  id: string;            // ID unique du message
  linkId?: string;
}

const NOCODB_API_URL = process.env.NOCODB_API_URL || 'http://localhost:8080/api/v1/db/data/v1/situation_room';
const NOCODB_API_TOKEN = process.env.NOCODB_API_TOKEN || '';

export async function handleSmsWebhook(req: Request, res: Response): Promise<void> {
  // Africa's Talking envoie les données en form-urlencoded
  const payload: AfricasTalkingSmsPayload = req.body;

  if (!payload.text || !payload.from) {
    res.status(400).send('Payload invalide');
    return;
  }

  console.log(`📱 SMS reçu de ${payload.from} : ${payload.text}`);

  try {
    // TODO : Adapter le parsing du SMS à votre format terrain
    // Exemple de format SMS structuré : "INCIDENT|Route cassée|Dakar Centre"
    // Les observateurs peuvent envoyer des SMS avec un format défini lors de leur formation

    await fetch(`${NOCODB_API_URL}/base_reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xc-token': NOCODB_API_TOKEN,
      },
      body: JSON.stringify({
        title: payload.text.substring(0, 100),
        description: payload.text,
        source: 'sms',
        status: 'pending',
        latitude: null,
        longitude: null,
      }),
    });

    console.log('✅ Signalement SMS inséré en base');
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion du signalement SMS :', error);
  }

  // Africa's Talking attend une réponse vide avec status 200
  res.status(200).send('');
}
