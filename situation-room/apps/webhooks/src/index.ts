import express from 'express';
import { handleTelegramWebhook } from './handlers/telegram';
import { handleSmsWebhook } from './handlers/sms';
import { verifyWhatsAppWebhook, handleWhatsAppWebhook } from './handlers/whatsapp';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Nécessaire pour Africa's Talking (form-urlencoded)

// ── Route de santé ───────────────────────────────────────────
// Utilisée par Docker et le reverse proxy pour vérifier que le service tourne
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'webhooks' });
});

// ── Telegram ─────────────────────────────────────────────────
// Enregistrer le webhook : POST https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://votre-domaine.org/webhooks/api/telegram
app.post('/api/telegram', handleTelegramWebhook);

// ── SMS (Africa's Talking) ───────────────────────────────────
// Configurer dans le dashboard Africa's Talking → Callback URL
app.post('/api/sms', handleSmsWebhook);

// ── WhatsApp Business API (Meta) ─────────────────────────────
// Vérification du webhook par Meta (GET) + réception des messages (POST)
app.get('/api/whatsapp', verifyWhatsAppWebhook);
app.post('/api/whatsapp', handleWhatsAppWebhook);

// ── Route générique (fallback / tests) ──────────────────────
app.post('/api/incoming', (req, res) => {
  console.log('📥 Message entrant générique :', req.body);
  res.status(200).send('Message accepté');
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook listener démarré sur le port ${PORT}`);
  console.log(`   → Telegram   : POST /api/telegram`);
  console.log(`   → SMS        : POST /api/sms`);
  console.log(`   → WhatsApp   : GET/POST /api/whatsapp`);
});
