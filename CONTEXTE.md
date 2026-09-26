# CONTEXTE — Application « Rennes, capitale de la Bretagne »

> **Fichier de contexte compacté.** À LIRE EN PREMIER avant toute nouvelle session,
> pour éviter de relire tout le code. Mettre à jour à la fin de chaque tâche.

## 1. Objectif du projet

Application web **statique** (aucun framework, aucun build) qui raconte un peu
l'histoire de Rennes (France) et présente les **5 meilleurs endroits à visiter**.

## 2. Stack & contraintes

- **HTML5 + CSS3 + JavaScript vanilla** — zéro dépendance, zéro package.json.
- Aucun CDN, aucun réseau requis : les images sont des **SVG générés localement**.
- Ouvrable directement via `file://` dans un navigateur.
- Textes en **ASCII sans accents** dans le HTML (choix fait pour éviter les
  problèmes d'encodage ; le `<meta charset="UTF-8">` reste présent).

## 3. Arborescence

```
/Users/loulouze/Desktop/projet_1/
├── index.html                 # 413 lignes — page unique
├── CONTEXTE.md                # ce fichier
├── assets/
│   ├── css/style.css          # 577 lignes — 14 sections commentées
│   ├── js/script.js           # IIFE, sans dépendance
│   └── img/                   # 6 photos JPEG (Wikimedia Commons) + 6 SVG de référence
│                              # + CREDITS.json (auteurs / licences)
└── tmp/                       # scripts de travail (hors production)
    ├── gen_images.py          # génère les 6 SVG
    ├── check_html.py          # vérifie l'équilibrage des balises
    ├── append_sections.py     # a ajouté pratique/FAQ/footer
    └── fix_card.py            # a réparé la carte 5
```

## 4. Structure de `index.html` (dans l'ordre)

| # | Bloc | Ancre | Notes |
|---|------|-------|-------|
| 1 | Navbar fixe | `#top` | glassmorphism au scroll, burger mobile |
| 2 | Hero | `#accueil` | 100vh, image via `--hero-img` en inline style (chemin relatif au **CSS**) |
| 3 | Bandeau chiffres | — | compteurs animés (`data-count`, `data-suffix`) |
| 4 | Histoire | `#histoire` | frise chronologique `.timeline`, 6 périodes |
| 5 | Citation | — | section `.quote` sobre |
| 6 | 5 lieux | `#lieux` | 5 cartes `.place` numérotées 1→5 |
| 7 | Pratique | `#pratique` | 4 `.tip` (déplacer, quand, Trans Musical, hébergement) |
| 8 | FAQ | `#faq` | 4 `<details>` (accordeon exclusif) |
| 9 | Footer + bouton retour haut | — | `.to-top` |

## 5. Les 5 lieux retenus

1. **Le Parc du Thabor** — `parc.jpg` — Nature & Détente
2. **Le Viaduc de la Vilaine** — `viaduc.jpg` — Patrimoine
3. **Le Palais Saint-Georges** — `palais.jpg` — Culture
4. **Le Marché des Lices** — `marche.jpg` — Gastronomie
5. **Les Champs Libres** — `cargo.jpg` — Moderne & Culture

Les 6 SVG sont conservés (référence) dans `assets/img/*.svg` et une copie
des photos non compressées est dans `tmp/jpg-original/`.

Chaque carte contient : image, badge rang, badge catégorie, description, 3 tags,
3 faits (Accès / Idéal / Astuce) et un lien Wikipédia.

## 6. Frise historique (contenu)

1. Vers 50 av. J.-C. — Condate, l'oppidum gaulois
2. Vers 508 — Naissance de la Bretagne
3. 1351 — La Commune de Rennes
4. 1720 — L'incendie et le projet royal (945 maisons, plan Charles de Rohan)
5. 1848 — Gare et industrialisation
6. 1968 → aujourd'hui — Métropole universitaire et européenne

## 7. Classes CSS clés (convention BEM)

`nav__inner` `nav__link` `hero__title` `stats__grid` `stat__value`
`tl-item` `tl-date` `place__media` `place__rank` `place__facts` `place__link`
`tag` `tip` `faq` `to-top` `reveal` (+ `.is-visible`)

Variables : `--breton-red #d1453b`, `--breton-black #1c1b1a`, `--slate #2f3a45`,
`--cream #faf6ef`, `--sand #efe6d7`, `--gold #c8963e`, `--teal #35707d`.

## 8. Fonctions JS (toutes dans une IIFE)

- Navbar : `.is-scrolled` après 40px de scroll
- Menu mobile : `.is-open` + `aria-expanded`
- Scrollspy : `.is-active` sur `.nav__link` selon la section visible
- Révélation : `IntersectionObserver` → `.is-visible` (seuil 0.14)
- Compteurs : `requestAnimationFrame` + easeOutCubic, 1500 ms
- FAQ : un seul `<details>` ouvert à la fois
- Fallback gracieux si `IntersectionObserver` absent

## 9. Accessibilité & qualité

- `aria-expanded`, `aria-controls`, `aria-label`, `aria-hidden` sur les elements interactifs
- `alt` descriptifs sur les 5 images, `loading="lazy"`
- Focus visible `:focus-visible` (anneau doré)
- `prefers-reduced-motion` respecté
- Contrastes conformes AA (rouge breton / blanc, crème / texte ardoise)

## 10. Commandes utiles

```bash
cd /Users/loulouze/Desktop/projet_1
python3 tmp/check_html.py                       # valider le HTML
python3 tmp/gen_images.py                       # régénérer les SVG
node --check assets/js/script.js                # valider le JS
open index.html                                 # lancer dans le navigateur
```

## 11. Journal des modifications

| Date | Action |
|------|--------|
| 26/09/2026 | Création du projet, structure `assets/` + `tmp/` |
| 26/09/2026 | Rédaction du CSS (14 sections) et du JS (IIFE) |
| 26/09/2026 | Génération des 6 illustrations SVG |
| 26/09/2026 | Construction de `index.html` (7 sections) |
| 26/09/2026 | Nettoyage des fragments corrompus, validation HTML OK |
| 26/09/2026 | Ouverture dans le navigateur |
| 26/09/2026 | Renforcement du rouge breton : stats, citation, tips, footer, tags, cartes, titres, hero |
| 26/09/2026 | Direction artistique Netflix : fond noir (#141414), rouge #e50914, typo condensée uppercase, cartes en carrousel horizontal avec flèches, suppression des surfaces claires |
| 26/09/2026 | Lancement via serveur local `python3 -m http.server 8080` ; correction du bug de chemin `--hero-img` (résolu depuis `assets/css/`, d'où `../img/...`) |
| 26/09/2026 | Bascule des 6 illustrations SVG vers les vraies photos JPEG de Wikimedia Commons, avec `alt` réels et `width`/`height` ; compression 1600 px q62 (5,5 Mo → 2,9 Mo) ; ajout de la section crédits photo (attribution CC obligatoire) |
| 26/09/2026 | Relancement et vérification : serveur `python3 -m http.server 8080 --bind 127.0.0.1` déjà actif (PID 1664), page + CSS + JS + images en HTTP 200 ; HTML validé (7 sections, 5 cartes, 4 FAQ) et `node --check` OK ; ouverture dans le navigateur |

## 12. Prochaines étapes possibles

- [ ] Passer les textes en accents corrects (UTF-8) pour un rendu plus soigné
- [x] Ajouter de vraies photos (Wikimedia Commons) à la place des SVG
- [ ] Générer des WebP / AVIF pour réduire encore les ~2,9 Mo d'images
- [ ] Section « Galerie » avec une lightbox
- [ ] Mode sombre (`prefers-color-scheme`)
- [ ] Version imprimable de l'itinéraire
