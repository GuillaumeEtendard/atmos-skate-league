# 🚀 Déploiement Stripe sur Vercel

Ce guide explique comment déployer votre application avec le backend Stripe sur Vercel.

## ✅ Configuration terminée

Votre projet est maintenant configuré avec :
- ✅ API Serverless Vercel pour Stripe
- ✅ Routes `/api/create-payment-intent` et `/api/register-participant`
- ✅ Frontend connecté aux APIs
- ✅ Configuration Vercel

## 📝 Étapes de déploiement

### 1. Configuration Stripe

1. **Créez un compte Stripe** sur [stripe.com](https://stripe.com)
2. **Récupérez vos clés API** :
   - Allez dans **Développeurs** > **Clés API**
   - Copiez votre **Clé publique** (pk_test_...)
   - Copiez votre **Clé secrète** (sk_test_...)

### 2. Configuration locale (.env)

Créez un fichier `.env` à la racine du projet (si pas déjà fait) :

```env
VITE_STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique_ici
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_ici
```

**⚠️ IMPORTANT** : Ne committez JAMAIS le fichier `.env` dans Git !

### 3. Test en local

```bash
# Installer Vercel CLI si pas déjà fait
npm install -g vercel

# Lancer le projet avec Vercel Dev (pour tester les API routes)
vercel dev

# Ou utiliser le serveur de développement Vite normal
npm run dev
```

**Note** : Avec `npm run dev`, les API routes ne fonctionneront pas en local. Utilisez `vercel dev` pour tester le paiement.

### 4. Déploiement sur Vercel

#### Option A : Via l'interface Vercel (Recommandé)

1. **Connectez votre repo GitHub** sur [vercel.com](https://vercel.com)
2. **Importez votre projet** Atmos Skate League
3. **Ajoutez les variables d'environnement** :
   - `VITE_STRIPE_PUBLIC_KEY` = votre clé publique
   - `STRIPE_SECRET_KEY` = votre clé secrète
4. **Déployez** !

#### Option B : Via la CLI

```bash
# Se connecter à Vercel
vercel login

# Déployer
vercel

# Ajouter les variables d'environnement
vercel env add VITE_STRIPE_PUBLIC_KEY
vercel env add STRIPE_SECRET_KEY

# Redéployer avec les variables
vercel --prod
```

### 5. Configuration des variables d'environnement sur Vercel

Dans le dashboard Vercel :
1. Allez dans **Settings** > **Environment Variables**
2. Ajoutez les deux variables :
   - `VITE_STRIPE_PUBLIC_KEY` → Production
   - `STRIPE_SECRET_KEY` → Production
3. **Redéployez** le projet

## 🧪 Test du paiement

### Cartes de test Stripe

Une fois déployé, testez avec ces cartes :

| Carte | Numéro | Résultat |
|-------|--------|----------|
| **Succès** | 4242 4242 4242 4242 | Paiement réussi |
| **3D Secure** | 4000 0027 6000 3184 | Authentification requise |
| **Refusé** | 4000 0000 0000 0002 | Carte refusée |

- **Date d'expiration** : N'importe quelle date future (ex: 12/30)
- **CVC** : N'importe quel nombre à 3 chiffres (ex: 123)
- **Code postal** : N'importe quel code

## 📂 Structure des fichiers

```
atmos-skate-league/
├── api/
│   ├── create-payment-intent.ts    # Crée le PaymentIntent
│   └── register-participant.ts      # Enregistre le participant
├── src/
│   ├── pages/
│   │   ├── Registration.tsx         # Page d'inscription
│   │   └── Confirmation.tsx         # Page de confirmation
│   └── components/
│       └── registration/
│           └── RegistrationForm.tsx # Formulaire de paiement
├── .env.example                     # Template des variables
├── .env                             # Vos clés (NE PAS COMMITTER)
└── vercel.json                      # Configuration Vercel
```

## 🔒 Sécurité

✅ **Ce qui est sûr** :
- Les clés secrètes sont stockées dans les variables d'environnement Vercel
- Les API routes sont serverless et sécurisées
- Stripe gère toutes les données de carte

⚠️ **À ne JAMAIS faire** :
- Committer le fichier `.env` dans Git
- Exposer `STRIPE_SECRET_KEY` côté client
- Utiliser les clés de test en production

## 🚀 Passage en production

Quand vous êtes prêt pour la production :

1. **Activez votre compte Stripe** (vérification d'identité)
2. **Récupérez vos clés live** (pk_live_ et sk_live_)
3. **Mettez à jour les variables d'environnement** sur Vercel
4. **Configurez les webhooks Stripe** :
   - URL : `https://votre-domaine.vercel.app/api/webhook`
   - Événements : `payment_intent.succeeded`, `payment_intent.payment_failed`

## 📧 Prochaines étapes

Après avoir testé les paiements :

1. **Base de données** : Ajouter un service comme Supabase ou MongoDB pour stocker les inscriptions
2. **Emails** : Intégrer Resend ou SendGrid pour envoyer des confirmations
3. **Webhooks** : Créer `/api/webhook` pour écouter les événements Stripe
4. **Dashboard admin** : Page pour voir les inscriptions

## 🆘 Dépannage

### L'API ne fonctionne pas en local
→ Utilisez `vercel dev` au lieu de `npm run dev`

### Erreur "Invalid API key"
→ Vérifiez que `STRIPE_SECRET_KEY` est bien définie dans `.env` ou sur Vercel

### Le formulaire ne se charge pas
→ Vérifiez que `VITE_STRIPE_PUBLIC_KEY` est bien configurée

### Erreur CORS
→ Les headers CORS sont déjà configurés dans les API routes

## 📚 Documentation

- [Stripe Payment Element](https://docs.stripe.com/payments/payment-element)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Variables d'environnement Vercel](https://vercel.com/docs/projects/environment-variables)

---

✨ **Votre setup Stripe est complet !** Suivez ces étapes pour déployer et commencer à accepter des paiements.
