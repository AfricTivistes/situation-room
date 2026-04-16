# 📡 Webhooks Receiver (Node.js)

**Rôle :** Ce micro-service est l'oreille de la plateforme. Il écoute les requêtes HTTP (webhooks) envoyées par des services externes (Bots Telegram, Gateways SMS, API WhatsApp) et transforme ces messages bruts en "Signalements" formatés dans notre base de données.

---

## 🏗️ Architecture & Flux

```
1. Un citoyen envoie un SMS : "Urgent, bureau fermé à Dakar."
2. La Gateway SMS (ex: Africa's Talking) envoie une requête POST → /api/sms
3. Le handler dans src/handlers/sms.ts intercepte la requête
4. Il parse le message et insère une ligne "pending" via l'API NocoDB
5. Un modérateur voit le signalement dans le Dashboard pour le valider
```

---

## 🚀 Démarrage rapide

```bash
# Depuis la racine du monorepo
pnpm dev:webhooks
```

Tester avec curl :
```bash
curl -X POST http://localhost:3000/api/incoming \
  -H "Content-Type: application/json" \
  -d '{"source": "web", "message": "Test de signalement"}'
```

---

## 🏗️ Structure attendue

```
src/
├── index.ts             → Serveur Express + déclaration des routes
└── handlers/            → Un fichier par canal
    ├── telegram.ts      → Parser les messages Telegram Bot
    ├── sms.ts           → Parser les SMS Africa's Talking
    └── whatsapp.ts      → Parser les messages WhatsApp Business API
```

---

## 🎯 Issues suggérées pour le hackathon

Pour ajouter un nouveau canal de signalement :
1. Créez un nouveau handler dans `src/handlers/votre-canal.ts`
2. Définissez la route Express correspondante dans `src/index.ts`
3. Testez localement en simulant des envois POST via Postman ou cURL
4. Documentez les paramètres attendus dans ce README

**Note :** Consultez la documentation de l'API Africa's Talking pour les SMS et l'API Telegram Bot pour les messages Telegram.
