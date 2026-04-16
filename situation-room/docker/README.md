# 🐳 Docker & Déploiement

**Rôle :** Maintenir notre promesse "Self-Hosted" et "Frugal". Ce dossier contient les fichiers de configuration Docker pour la production.

---

## Fichiers de configuration

| Fichier | Usage |
|---------|-------|
| `docker-compose.dev.yml` (racine) | Développement local – PostgreSQL + NocoDB |
| `docker-compose.yml` (racine, à créer) | Production – tous les services |
| `nginx/` | Reverse proxy pour diriger le trafic |

---

## Philosophie

L'outil **doit** pouvoir être déployé sur un simple VPS KVM avec 1-2 Go de RAM. C'est notre engagement envers les OSC africaines qui n'ont pas de budgets cloud.

### Bonnes pratiques
- Utiliser des images Alpine (plus légères)
- Utiliser le multi-stage build pour les images de production
- Ne pas exposer les ports inutilement
- Utiliser des secrets Docker au lieu de variables d'environnement en clair

---

## Déploiement sur un VPS

```bash
# Cloner le dépôt sur votre VPS
git clone https://github.com/AfricTivistes/situation-room.git

# Configurer les variables d'environnement
cp .env.example .env
nano .env  # Modifier avec vos vraies valeurs

# Lancer l'infrastructure
docker-compose up -d

# Vérifier que tout tourne
docker-compose ps
```
