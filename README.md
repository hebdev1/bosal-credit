# Tipa Fintech — Landing Page

Site vitrine + authentification pour la plateforme Tipa Fintech (Coopérative Bosal).

## Structure des fichiers

```
tipa-landing/
├── index.html          ← Page d'accueil (landing page)
├── css/
│   └── main.css        ← Design system complet
├── js/
│   ├── main.js         ← Nav, animations, scroll
│   └── auth.js         ← Logique Supabase (signin/signup)
└── pages/
    ├── signin.html     ← Page de connexion
    └── signup.html     ← Page d'inscription
```

## Déploiement sur GitHub + Vercel

### Étape 1 — GitHub
1. Créez un repo GitHub (ex: `tipa-landing`)
2. Uploadez tous ces fichiers en gardant la structure
3. Commit & Push

### Étape 2 — Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. **Add New Project** → **Import Git Repository**
3. Sélectionnez `tipa-landing`
4. Framework: **Other** (site statique)
5. Root Directory: `/` (racine)
6. **Deploy**

### Étape 3 — Supabase configuration
Après déploiement, allez dans votre [Dashboard Supabase](https://supabase.com/dashboard/project/ebioqgjyzrhjxxlugzcz/auth/url-configuration) :

- **Site URL** → `https://votre-app.vercel.app`
- **Redirect URLs** → `https://votre-app.vercel.app/**`

## Variables à modifier

Dans `js/auth.js`, ligne 11 :
```js
const APP_URL = '../tipa-app.html';
```
Changez cette ligne vers l'URL de votre app Tipa déployée :
```js
const APP_URL = 'https://votre-tipa-app.vercel.app';
```

## Comptes de démo

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@tipafintech.ht | Admin2025! |
| Caissier | caissier@tipafintech.ht | Caissier2025! |

## Mises à jour

1. Modifiez les fichiers dans votre repo GitHub
2. Vercel redéploie automatiquement en ~30 secondes

## Tech Stack
- HTML5 / CSS3 / JavaScript vanilla
- Supabase (Auth + Database)
- Fonts: Plus Jakarta Sans + Space Mono (Google Fonts)
- Zéro dépendance npm — déploiement direct
