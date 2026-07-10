# SafeSea

SafeSea est une Progressive Web App citoyenne pour aider les plaisanciers a preparer leurs sorties, consulter les conditions marines et partager des signalements utiles avec la communaute.

## Objectif

Le projet est concu pour le programme FOU - Faire Oeuvre Utile. Il combine securite, entraide, prevention et protection du milieu marin.

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase
- Leaflet / OpenStreetMap
- Open-Meteo Marine API
- Vercel

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir :

```text
http://localhost:3000
```

## Variables d'environnement

Copier `.env.example` vers `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

La premiere version peut fonctionner avec des donnees de demonstration. Les variables Supabase seront necessaires quand l'authentification et la base de donnees seront branchees.

## Fonctionnalites MVP

- tableau de bord mer ;
- indice de securite calcule ;
- carte communautaire Leaflet ;
- signalements de demonstration et ajout local interactif ;
- checklist avant depart persistante dans le navigateur ;
- profil et statistiques ;
- base PWA.

## Preuves FOU possibles

- application deployee ;
- depot GitHub ;
- captures desktop/mobile ;
- schema Supabase ;
- demonstration de creation d'un signalement ;
- README et roadmap ;
- bilan de competences.

## Roadmap courte

1. Brancher Supabase Auth.
2. Sauvegarder les signalements dans PostgreSQL.
3. Ajouter commentaires, votes et resolution.
4. Ajouter les photos de signalement.
5. Activer les notifications et la PWA complete.

## Supabase

Le schema initial est disponible dans `supabase/schema.sql`. Il contient les tables principales, les types enum et les premieres politiques RLS.

## Documentation projet

- `docs/BACKLOG.md` : priorites MVP.
- `docs/DEPLOYMENT.md` : publication GitHub, Vercel et Supabase.
- `docs/FOU_PREUVES.md` : preuves a fournir pour la validation FOU.
