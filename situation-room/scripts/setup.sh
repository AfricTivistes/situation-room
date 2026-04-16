#!/bin/bash
# =============================================================
# Script d'initialisation – Situation Room / Africa ElectionLab
# =============================================================
# Ce script configure l'environnement de développement en une
# seule commande. Parfait pour les Tech Camps !
# Usage : bash scripts/setup.sh
# =============================================================

echo "🚧 Initialisation de l'environnement Situation Room..."

# Vérification des prérequis
command -v pnpm >/dev/null 2>&1 || {
  echo "❌ pnpm n'est pas installé. Installe-le avec : npm install -g pnpm"
  exit 1
}

command -v docker >/dev/null 2>&1 || {
  echo "❌ Docker n'est pas installé. Installe-le depuis : https://docs.docker.com/get-docker/"
  exit 1
}

# Copie du fichier .env si il n'existe pas encore
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Fichier .env créé depuis .env.example"
  echo "⚠️  Pense à modifier les mots de passe dans .env avant de déployer !"
else
  echo "ℹ️  Le fichier .env existe déjà, on le conserve."
fi

# Installation des dépendances via pnpm
echo ""
echo "📦 Installation des paquets Node.js..."
pnpm install

# Lancement de l'infrastructure Docker (PostgreSQL + NocoDB)
echo ""
echo "🐳 Démarrage de PostgreSQL 16 et NocoDB..."
docker-compose -f docker-compose.dev.yml up -d

# Attente que les services soient prêts
echo ""
echo "⏳ Attente que les services démarrent (15 secondes)..."
sleep 15

echo ""
echo "🎉 Environnement prêt !"
echo ""
echo "📍 Services disponibles :"
echo "   - NocoDB (interface admin) : http://localhost:8080"
echo "   - PostgreSQL               : localhost:5432"
echo ""
echo "🚀 Pour démarrer les applications :"
echo "   pnpm dev:public    → Site public Astro (port 4321)"
echo "   pnpm dev:dashboard → Dashboard Refine (port 5173)"
echo "   pnpm dev:webhooks  → Serveur webhooks (port 3000)"
echo "   pnpm dev           → Tout lancer en parallèle"
