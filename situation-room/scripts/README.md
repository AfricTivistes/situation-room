# ⚙️ Scripts d'Automatisation

**Rôle :** Faciliter la vie des développeurs (Developer Experience).

Lors d'un Tech Camp, le temps est précieux. Ce dossier contient des scripts bash ou Node.js pour automatiser les tâches répétitives.

---

## Scripts disponibles

### `setup.sh` – Initialisation complète
```bash
bash scripts/setup.sh
```
Lance l'installation complète : création du `.env`, installation des dépendances pnpm, démarrage de Docker (PostgreSQL + NocoDB).

---

### `seed.js` – Données de démonstration
```bash
# Après avoir démarré l'infrastructure (pnpm dev:infra) :
pnpm seed

# Ou directement :
node scripts/seed.js
```
Insère 28 signalements fictifs dans NocoDB pour animer la carte et le dashboard lors des démonstrations ou hackathons. Couvre 5 villes (Dakar, Abidjan, Bamako, Cotonou, Lomé), 4 sources (web, telegram, sms, whatsapp) et les 3 statuts (pending, verified, rejected).

**Prérequis :**
1. `pnpm dev:infra` — NocoDB et PostgreSQL doivent être en cours d'exécution
2. `NOCODB_API_TOKEN` doit être défini dans le fichier `.env`

---

## Scripts à créer (idéal pour contribuer !)

### `reset-db.sh` – Réinitialiser la base de données
Utile lors des démonstrations ou pour repartir de zéro. Supprime les données et relance le SQL initial.

---

## Règle

**Si vous tapez une commande longue plus de deux fois, automatisez-la et mettez le script ici !**

Les scripts doivent être documentés avec un commentaire d'en-tête expliquant leur utilité.
