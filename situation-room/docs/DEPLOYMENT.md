# Guide de Déploiement – Situation Room

Ce guide explique comment déployer la Situation Room sur un VPS Linux basique (1-2 Go de RAM).

---

## Prérequis serveur

- **OS :** Ubuntu 22.04 LTS ou Debian 12 (recommandé)
- **RAM :** 1 Go minimum, 2 Go recommandé
- **Stockage :** 20 Go minimum
- **Réseau :** Un nom de domaine pointant vers votre IP (ex: `situation.votreOSC.org`)
- **Logiciels :** Docker + Docker Compose (voir ci-dessous)

---

## Étape 1 – Préparer le serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com | bash
sudo usermod -aG docker $USER

# Installer Docker Compose
sudo apt install docker-compose -y

# Vérifier l'installation
docker --version
docker-compose --version
```

---

## Étape 2 – Cloner et configurer

```bash
# Cloner le dépôt sur votre serveur
git clone https://github.com/AfricTivistes/situation-room.git
cd situation-room

# Créer et configurer le fichier .env
cp .env.example .env
nano .env
```

**Variables obligatoires à modifier dans `.env` :**
```
DB_PASSWORD=un_mot_de_passe_solide_12_caracteres_min
JWT_SECRET=une_longue_chaine_aleatoire_ici
DOMAIN=situation.votreOSC.org
```

Générer une clé aléatoire solide :
```bash
openssl rand -hex 32
```

---

## Étape 3 – Obtenir les certificats SSL (Let's Encrypt)

Avant de lancer la stack complète, obtenir les certificats SSL :

```bash
# Lancer uniquement Nginx en mode HTTP pour la validation
docker-compose up -d nginx

# Obtenir le certificat (remplacer avec votre vrai domaine et email)
docker run --rm \
  -v "$(pwd)/certbot_certs:/etc/letsencrypt" \
  -v "$(pwd)/certbot_www:/var/www/certbot" \
  certbot/certbot certonly \
  --webroot -w /var/www/certbot \
  -d situation.votreOSC.org \
  --email contact@votreOSC.org \
  --agree-tos --no-eff-email
```

---

## Étape 4 – Configurer Nginx

Modifier le fichier `docker/nginx/conf.d/situation-room.conf` :
```bash
# Remplacer "votre-domaine.org" par votre vrai domaine
sed -i 's/votre-domaine.org/situation.votreOSC.org/g' docker/nginx/conf.d/situation-room.conf
```

---

## Étape 5 – Lancer la stack complète

```bash
# Construire les images Docker
docker-compose build

# Lancer tous les services
docker-compose up -d

# Vérifier que tout tourne
docker-compose ps

# Consulter les logs en cas de problème
docker-compose logs -f
```

---

## Étape 6 – Configurer NocoDB

1. Ouvrir `https://situation.votreOSC.org/nocodb/`
2. Créer un compte administrateur
3. Se connecter à la base PostgreSQL déjà existante
4. Générer un **API Token** dans Paramètres → API Tokens
5. Ajouter ce token dans `.env` : `NOCODB_API_TOKEN=votre_token`
6. Redémarrer les webhooks : `docker-compose restart webhooks`

---

## Maintenance

### Mises à jour
```bash
git pull origin main
docker-compose build
docker-compose up -d
```

### Sauvegardes de la base de données
```bash
# Créer une sauvegarde
docker exec situation-room-db pg_dump -U postgres situation_room > backup_$(date +%Y%m%d).sql

# Automatiser avec cron (chaque jour à 3h du matin)
echo "0 3 * * * docker exec situation-room-db pg_dump -U postgres situation_room > /home/ubuntu/backups/backup_$(date +%Y%m%d).sql" | crontab -
```

### Surveillance des ressources
```bash
# Voir la consommation RAM/CPU de chaque conteneur
docker stats
```

---

## Ressources utiles

- [Documentation NocoDB](https://docs.nocodb.com/)
- [Documentation Refine.js](https://refine.dev/docs/)
- [Documentation Astro](https://docs.astro.build/)
- [Africa's Talking (SMS)](https://developers.africastalking.com/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
