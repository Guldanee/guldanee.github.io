# Portfolio de Güldane Acar

Portfolio personnel en **Angular 20** (composants standalone, signals, sans zone.js), en français, anglais, turc et espagnol, avec thème sombre (par défaut) ou clair, des projets filtrables et les logos des technos.

## Lancer le site en local

Il faut [Node.js](https://nodejs.org) 20.19 ou plus récent (22 conseillé).

```bash
npm install
npm start          # puis ouvrir http://localhost:4200
```

## Modifier le contenu

Tout le texte du site est dans deux fichiers, pas besoin de toucher aux composants :

| Fichier | Contenu |
| --- | --- |
| `src/app/data/content.json` | profil, projets, expériences, formation, compétences, langues, loisirs |
| `src/app/data/ui.json` | libellés de l'interface (menu, boutons, titres) |

Chaque texte existe en 4 versions : `{ "fr": "…", "en": "…", "tr": "…", "es": "…" }`.
Un texte identique partout (un nom de techno par exemple) peut rester une simple chaîne.

Quelques réglages utiles dans `profile` :

- `github` : coller l'URL de ton profil GitHub ; le bouton apparaît automatiquement dans la partie contact.
- `cv` : le PDF est dans `public/cv/`. Remplace-le quand ton CV change (même nom de fichier).

Pour le logo ou l'emoji d'une compétence : `src/app/core/icons.ts` (une ligne par compétence). Les logos SVG sont dans `public/logos/` (logos [Devicon](https://devicon.dev), licence MIT).

Pour ajouter un projet : copier un bloc dans `projects`, changer l'`id`, les dates (`"AAAA-MM"`), les catégories (`ai`, `web`, `network`, `systems`, `algo`) et passer `featured` à `true` pour l'afficher en grand.

## Structure

```
src/app/
  core/        services langue (i18n) et thème, modèles TypeScript
  data/        content.json et ui.json
  sections/    header, hero, projects, journey, skills, contact
  shared/      pastille avec logo (chip)
src/styles.css palette, typo et mise en page (thème sombre par défaut, thème clair crème)
```

## Mettre en ligne gratuitement (GitHub Pages)

1. Crée un dépôt GitHub. Le plus joli : le nommer `ton-pseudo.github.io`, le site sera alors à `https://ton-pseudo.github.io`. Avec un autre nom, il sera à `https://ton-pseudo.github.io/nom-du-depot/`.
2. Envoie le projet :
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/ton-pseudo/ton-pseudo.github.io.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Source : GitHub Actions**.
4. Chaque `git push` sur `main` redéploie le site automatiquement (onglet **Actions** pour suivre).

## L'ajouter sur LinkedIn

- **Profil → Modifier l'intro → Site web** : colle l'URL du portfolio.
- **Section « Sélection » → Ajouter un lien** : le portfolio apparaît en carte sur ton profil.
- Pense aussi à mettre l'URL sur ton CV, à côté de LinkedIn.
