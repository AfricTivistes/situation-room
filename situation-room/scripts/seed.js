#!/usr/bin/env node
// =============================================================
// Script de données de démonstration – Situation Room
// =============================================================
// Ce script insère 28 signalements fictifs dans NocoDB pour
// permettre aux participants des Tech Camps de voir l'outil
// en action dès le premier lancement, sans attendre de vrais
// observateurs terrain.
//
// Prérequis :
//   1. pnpm dev:infra   → démarrer PostgreSQL + NocoDB
//   2. Configurer NocoDB (créer un compte admin sur :8080)
//   3. Générer un token API NocoDB et l'ajouter dans .env
//      NOCODB_API_TOKEN=votre_token
//
// Usage :
//   pnpm seed
//   node scripts/seed.js
// =============================================================

// Charger automatiquement le fichier .env depuis la racine du projet
// (pas de dépendance externe — utilise uniquement le module fs natif de Node.js)
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key && !(key in process.env)) {
      process.env[key] = val;
    }
  }
}

// Même convention que les handlers webhooks : NOCODB_API_URL inclut le chemin
// complet jusqu'au namespace de la base (pas seulement le host).
// Ex : http://localhost:8080/api/v1/db/data/v1/situation_room
const NOCODB_API_URL =
  process.env.NOCODB_API_URL ||
  'http://localhost:8080/api/v1/db/data/v1/situation_room';
const API_TOKEN = process.env.NOCODB_API_TOKEN;

if (!API_TOKEN) {
  console.error('❌ Variable manquante : NOCODB_API_TOKEN');
  console.error('   1. Ouvre NocoDB sur http://localhost:8080');
  console.error('   2. Va dans Paramètres → API Tokens → Créer un token');
  console.error('   3. Ajoute NOCODB_API_TOKEN=... dans ton fichier .env');
  console.error('   4. Relance : pnpm seed');
  process.exit(1);
}

// ── Données de référence ──────────────────────────────────────

const CITIES = [
  { name: 'Dakar',    country: 'Sénégal',         lat: 14.6928, lng: -17.4467 },
  { name: 'Dakar',    country: 'Sénégal',         lat: 14.7156, lng: -17.4600 },
  { name: 'Abidjan',  country: "Côte d'Ivoire",   lat: 5.3600,  lng: -4.0083  },
  { name: 'Abidjan',  country: "Côte d'Ivoire",   lat: 5.3454,  lng: -3.9923  },
  { name: 'Bamako',   country: 'Mali',             lat: 12.6392, lng: -8.0029  },
  { name: 'Bamako',   country: 'Mali',             lat: 12.6500, lng: -7.9800  },
  { name: 'Cotonou',  country: 'Bénin',            lat: 6.3676,  lng: 2.4252   },
  { name: 'Cotonou',  country: 'Bénin',            lat: 6.3853,  lng: 2.3952   },
  { name: 'Lomé',     country: 'Togo',             lat: 6.1375,  lng: 1.2123   },
  { name: 'Lomé',     country: 'Togo',             lat: 6.1400,  lng: 1.2300   },
];

const SOURCES = ['web', 'telegram', 'sms', 'whatsapp'];
const STATUSES = ['pending', 'verified', 'rejected'];

// 28 signalements fictifs représentatifs des incidents électoraux réels
const REPORTS = [
  // ── Dakar ────────────────────────────────────────────────────
  {
    title: 'Bureau de vote ouvert avec 2h de retard',
    description: 'Le bureau de vote du lycée Blaise Diagne n\'a ouvert ses portes qu\'à 10h00 au lieu de 8h00. Les listes électorales manquaient à l\'arrivée des assesseurs.',
    city: 0, source: 'telegram', status: 'verified',
  },
  {
    title: 'Intimidation d\'électeurs à l\'entrée du bureau',
    description: 'Plusieurs électeurs signalent la présence de militants en tenue de parti politique à moins de 50 mètres du bureau de vote, en violation du code électoral.',
    city: 0, source: 'whatsapp', status: 'verified',
  },
  {
    title: 'Urne scellée non conforme observée',
    description: 'L\'urne du bureau n°7 ne présentait pas de scellé officiel au moment de l\'ouverture. Le président du bureau a finalement apposé un scellé de fortune.',
    city: 1, source: 'web', status: 'pending',
  },
  {
    title: 'Coupure d\'électricité pendant le comptage',
    description: 'Le dépouillement a été interrompu pendant 45 minutes suite à une coupure de courant. Les agents ont utilisé des téléphones portables comme éclairage.',
    city: 1, source: 'sms', status: 'verified',
  },
  {
    title: 'Agent électoral utilise un téléphone dans l\'isoloir',
    description: 'Un électeur rapporte avoir vu un agent de sécurité utiliser son téléphone à l\'intérieur de l\'isoloir lors de son passage. Non confirmé par d\'autres témoins.',
    city: 0, source: 'web', status: 'rejected',
  },
  // ── Abidjan ──────────────────────────────────────────────────
  {
    title: 'Pénurie de bulletins pour un candidat',
    description: 'Le bureau de vote n°12 du quartier Cocody a manqué de bulletins pour le candidat de la liste n°3 dès 11h00. Les électeurs concernés ont été renvoyés.',
    city: 2, source: 'telegram', status: 'verified',
  },
  {
    title: 'Présence de forces de l\'ordre inhabituellement élevée',
    description: 'Concentration inhabituelle de gendarmes mobiles autour de plusieurs bureaux de vote du Plateau. Atmosphere tendue signalée par les observateurs locaux.',
    city: 2, source: 'sms', status: 'pending',
  },
  {
    title: 'Liste électorale différente de la version officielle',
    description: 'Un observateur signale que la liste affichée au bureau de vote diffère de celle publiée sur le site de la CEI. Plusieurs noms sont absents ou déplacés.',
    city: 3, source: 'whatsapp', status: 'pending',
  },
  {
    title: 'Vote de personnes décédées constaté',
    description: 'Deux noms figurant sur la liste électorale correspondent à des personnes décédées selon les familles présentes. L\'information a été transmise à la CEI.',
    city: 3, source: 'web', status: 'verified',
  },
  {
    title: 'Procès-verbal falsifié signalé',
    description: 'Un témoin de parti prétend que le PV de dépouillement a été altéré après signature. Il ne dispose pas de copie du document original pour confirmer l\'allégation.',
    city: 2, source: 'telegram', status: 'rejected',
  },
  // ── Bamako ───────────────────────────────────────────────────
  {
    title: 'Achat de votes constaté à la sortie du bureau',
    description: 'Des hommes distribuent des billets de 1 000 FCFA à des électeurs qui sortent du bureau de vote du quartier Hamdallaye. Trois témoins indépendants confirment.',
    city: 4, source: 'sms', status: 'verified',
  },
  {
    title: 'Bureau de vote inaccessible aux personnes handicapées',
    description: 'L\'école primaire Modibo Kéita choisie comme bureau de vote ne dispose d\'aucune rampe d\'accès. Des électeurs en fauteuil roulant ont dû renoncer à voter.',
    city: 4, source: 'web', status: 'verified',
  },
  {
    title: 'Perturbation du dépouillement par groupe organisé',
    description: 'Un groupe d\'une vingtaine de personnes a envahi le bureau de vote n°3 de Kalaban-Coura pendant le dépouillement, semant la confusion. Les forces de l\'ordre sont intervenues.',
    city: 5, source: 'whatsapp', status: 'pending',
  },
  {
    title: 'Observateurs indépendants refoulés du bureau',
    description: 'L\'équipe d\'observation de l\'ONG Cauris a été refoulée du bureau de vote de Sogoniko. Le président de bureau a invoqué un manque de place, contrairement au code électoral.',
    city: 5, source: 'telegram', status: 'verified',
  },
  {
    title: 'Encre indélébile lavable utilisée',
    description: 'Un électeur prétend avoir réussi à laver l\'encre indélébile de son doigt avec du savon. Tentative de double vote signalée mais non confirmée par les assesseurs.',
    city: 4, source: 'sms', status: 'rejected',
  },
  // ── Cotonou ──────────────────────────────────────────────────
  {
    title: 'Matériel électoral arrivé incomplet',
    description: 'Le bureau de vote du CEG de Gbèdjromèdé n\'a reçu que 60 % des enveloppes officielles. Les agents ont dû arrêter le processus pendant 3 heures.',
    city: 6, source: 'web', status: 'verified',
  },
  {
    title: 'Confusion sur l\'identité des assesseurs',
    description: 'Deux personnes se présentent comme assesseurs pour le même parti au bureau de vote n°8. L\'une d\'elles ne disposait pas des accréditations requises.',
    city: 6, source: 'telegram', status: 'pending',
  },
  {
    title: 'Isoloirs manquants dans un bureau de vote',
    description: 'Le bureau de vote de l\'école primaire de Fidjrossè ne disposait que de deux isoloirs pour accueillir 800 électeurs inscrits. Longues files d\'attente constatées.',
    city: 7, source: 'whatsapp', status: 'verified',
  },
  {
    title: 'Transport organisé d\'électeurs suspect',
    description: 'Des minibus transportent des groupes d\'électeurs depuis un quartier hors de la circonscription jusqu\'au bureau de vote. Les bénéficiaires semblent organisés.',
    city: 7, source: 'sms', status: 'pending',
  },
  {
    title: 'Discours partisan dans l\'enceinte du bureau',
    description: 'Un agent de sécurité aurait tenu des propos favorables à un candidat devant des électeurs en attente. Le président du bureau nie les faits.',
    city: 6, source: 'web', status: 'rejected',
  },
  // ── Lomé ─────────────────────────────────────────────────────
  {
    title: 'Bulletin nul inséré par erreur dans l\'urne',
    description: 'Un assesseur a glissé accidentellement un bulletin non réglementaire dans l\'urne. L\'erreur a été constatée par les témoins de parti et consignée au PV.',
    city: 8, source: 'telegram', status: 'verified',
  },
  {
    title: 'Fermeture anticipée du bureau avant 18h00',
    description: 'Le bureau de vote de l\'EPP Adewui aurait fermé ses portes à 17h30 selon plusieurs témoins, alors que le scrutin devait se terminer à 18h00.',
    city: 8, source: 'sms', status: 'pending',
  },
  {
    title: 'Altercation entre représentants de partis',
    description: 'Une dispute a éclaté entre les mandataires de deux partis lors du dépouillement au bureau de vote n°6 du marché central. L\'intervention du chef de bureau a permis de reprendre le calme.',
    city: 9, source: 'whatsapp', status: 'verified',
  },
  {
    title: 'Signalement de bourrage d\'urne non confirmé',
    description: 'Un citoyen affirme avoir vu plusieurs bulletins sortir de la poche d\'un assesseur. Aucun autre témoin ne confirme ce récit. Signalement classé comme non établi.',
    city: 9, source: 'web', status: 'rejected',
  },
  {
    title: 'Absence de la liste de résultats affichée',
    description: 'Contrairement aux obligations légales, les résultats du bureau de vote n\'ont pas été affichés sur la porte à la fin du dépouillement. Le président invoque un manque de papier.',
    city: 8, source: 'telegram', status: 'pending',
  },
  {
    title: 'Double inscription détectée sur liste électorale',
    description: 'La HAAC a été saisie après qu\'un électeur a retrouvé son nom inscrit dans deux bureaux de vote différents. Enquête en cours pour déterminer l\'origine de l\'erreur.',
    city: 9, source: 'sms', status: 'verified',
  },
  {
    title: 'Matériel électoral dérobé lors du transport',
    description: 'Le véhicule transportant les urnes du bureau de vote de Bè-Kpota a été intercepté pendant 20 minutes par des inconnus. Le chauffeur n\'a pas pu prévenir les forces de l\'ordre.',
    city: 8, source: 'whatsapp', status: 'pending',
  },
  {
    title: 'Panne du scanner de cartes d\'identité',
    description: 'Le lecteur optique de cartes d\'identité en dotation au bureau de vote est tombé en panne à 9h30. Les agents sont revenus à la vérification manuelle, créant d\'importants ralentissements.',
    city: 9, source: 'web', status: 'verified',
  },
];

// ── Fonctions utilitaires ─────────────────────────────────────

async function insertReport(report) {
  const city = CITIES[report.city];
  const payload = {
    title: report.title,
    description: report.description,
    source: report.source,
    status: report.status,
    latitude: city.lat + (Math.random() * 0.01 - 0.005),
    longitude: city.lng + (Math.random() * 0.01 - 0.005),
  };

  const response = await fetch(
    `${NOCODB_API_URL}/base_reports`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xc-token': API_TOKEN,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HTTP ${response.status} – ${body}`);
  }

  return response.json();
}

// ── Point d'entrée ────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('🌍 Situation Room – Insertion des données de démonstration');
  console.log('══════════════════════════════════════════════════════════');
  console.log(`   NocoDB URL   : ${NOCODB_API_URL}`);
  console.log(`   Signalements : ${REPORTS.length}`);
  console.log(`   Villes       : Dakar, Abidjan, Bamako, Cotonou, Lomé`);
  console.log('');

  let inserted = 0;
  let failed = 0;

  for (const report of REPORTS) {
    try {
      await insertReport(report);
      const city = CITIES[report.city];
      console.log(`  ✅ [${report.status.padEnd(8)}] [${report.source.padEnd(8)}] ${city.name} – ${report.title.slice(0, 55)}…`);
      inserted++;
    } catch (err) {
      console.error(`  ❌ ERREUR : ${report.title.slice(0, 55)}… → ${err.message}`);
      failed++;
    }
  }

  console.log('');
  console.log('══════════════════════════════════════════════════════════');
  console.log(`✅ ${inserted} signalement(s) insérés avec succès`);
  if (failed > 0) {
    console.log(`❌ ${failed} signalement(s) en erreur`);
    console.log('   Vérifiez que NocoDB est démarré et que le token est valide.');
    process.exit(1);
  }
  console.log('');
  console.log('🗺️  Ouvrez le site public pour voir les signalements sur la carte.');
  console.log('📋 Ouvrez le dashboard pour gérer les statuts.');
  console.log('');
}

main().catch((err) => {
  console.error('Erreur fatale :', err.message);
  process.exit(1);
});
