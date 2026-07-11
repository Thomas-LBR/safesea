# SafeSea - Publication

## GitHub

Le depot local est deja initialise et contient les commits du MVP.

Si le depot GitHub `Thomas-LBR/safesea` n'existe pas encore :

1. Creer un nouveau depot vide sur GitHub nomme `safesea`.
2. Ne pas cocher l'ajout automatique d'un README, d'une licence ou d'un `.gitignore`.
3. Depuis ce dossier, lancer :

```bash
git remote add origin https://github.com/Thomas-LBR/safesea.git
git push -u origin main
```

Si le remote existe deja :

```bash
git remote set-url origin https://github.com/Thomas-LBR/safesea.git
git push -u origin main
```

## Vercel

1. Importer le depot GitHub dans Vercel.
2. Framework detecte : Next.js.
3. Commande build : `npm run build`.
4. Dossier de sortie statique : `dist`.
5. Ajouter les variables d'environnement quand Supabase sera cree.

## Supabase

1. Creer un projet Supabase.
2. Ouvrir SQL Editor.
3. Coller le contenu de `supabase/schema.sql`.
4. Copier l'URL du projet et la cle anon publique.
5. Creer un fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Verification avant rendu FOU

```bash
npm run lint
npm run build
```
