# Configuration Stripe - Atmos Skate League

Ce document explique comment configurer l'intégration Stripe pour le formulaire d'inscription.

## 📋 Prérequis

1. Un compte Stripe (créez-en un sur [stripe.com](https://stripe.com))
2. Node.js et npm installés
3. Un backend pour gérer les paiements (voir section Backend)

## 🔧 Configuration du Frontend

### 1. Configurer les clés Stripe

1. Copiez le fichier `.env.example` vers `.env`:
   ```bash
   cp .env.example .env
   ```

2. Récupérez votre clé publique Stripe:
   - Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com)
   - Allez dans **Développeurs** > **Clés API**
   - Copiez votre **Clé publiable** (commence par `pk_test_` ou `pk_live_`)

3. Ajoutez la clé dans votre fichier `.env`:
   ```env
   VITE_STRIPE_PUBLIC_KEY=pk_test_votre_cle_ici
   ```

### 2. Les composants créés

- **`/inscription`** - Page d'inscription avec formulaire de paiement
- **`/confirmation`** - Page de confirmation après paiement
- Tous les boutons "Je m'inscris !" redirigent vers `/inscription`

## 🖥️ Configuration du Backend

Pour que le paiement fonctionne, vous devez créer un backend qui gère la création des PaymentIntents Stripe.

### Option 1: Backend Node.js/Express (Recommandé)

#### Installation

```bash
npm install stripe express cors dotenv
```

#### Exemple de serveur (`server.js`)

```javascript
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Créer un PaymentIntent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body; // Montant en centimes (2000 = 20€)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 2000, // 20€ par défaut
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        product: 'Inscription Atmos Skate League',
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enregistrer un participant après paiement réussi
app.post('/api/register-participant', async (req, res) => {
  try {
    const { paymentIntent, name, email, phone } = req.body;

    // Vérifier que le paiement a bien été effectué
    const intent = await stripe.paymentIntents.retrieve(paymentIntent);

    if (intent.status === 'succeeded') {
      // TODO: Enregistrer le participant dans votre base de données
      console.log('Nouveau participant:', { name, email, phone });

      // TODO: Envoyer un email de confirmation

      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Paiement non confirmé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur backend sur le port ${PORT}`);
});
```

#### Fichier `.env` du backend

```env
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_ici
PORT=3001
```

#### Lancer le backend

```bash
node server.js
```

### Option 2: Backend Serverless (Vercel, Netlify)

Vous pouvez également utiliser des fonctions serverless. Exemple avec Vercel:

**`api/create-payment-intent.js`**

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 2000,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 3. Mettre à jour le Frontend

Une fois votre backend prêt, décommentez et mettez à jour le code dans:

**`src/pages/Registration.tsx`** (lignes 18-24):

```typescript
useEffect(() => {
  // Remplacez l'URL par celle de votre backend
  fetch('http://localhost:3001/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 3500 }), // 35€ en centimes
  })
    .then((res) => res.json())
    .then((data) => setClientSecret(data.clientSecret));
}, []);
```

## 🧪 Mode Test

Stripe fournit des cartes de test pour simuler les paiements:

### Cartes de test qui fonctionnent

- **Carte valide**: `4242 4242 4242 4242`
- **3D Secure requis**: `4000 0027 6000 3184`
- **Paiement refusé**: `4000 0000 0000 0002`

**Date d'expiration**: N'importe quelle date future (ex: 12/34)
**CVC**: N'importe quel nombre à 3 chiffres (ex: 123)
**Code postal**: N'importe quel code

## 🚀 Passage en Production

1. Dans le Dashboard Stripe, activez votre compte
2. Remplacez les clés de test (`pk_test_` et `sk_test_`) par les clés live (`pk_live_` et `sk_live_`)
3. Testez avec de vrais paiements (petits montants)
4. Configurez les webhooks Stripe pour recevoir les notifications de paiement

### Configuration des Webhooks (Recommandé)

1. Dans le Dashboard Stripe: **Développeurs** > **Webhooks**
2. Créez un endpoint webhook pointant vers: `https://votre-domaine.com/api/webhook`
3. Sélectionnez les événements: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Utilisez la clé de signature du webhook dans votre backend

## 📚 Ressources

- [Documentation Stripe Payment Element](https://docs.stripe.com/payments/payment-element)
- [Embedded Checkout Quickstart](https://docs.stripe.com/checkout/embedded/quickstart)
- [Cartes de test Stripe](https://docs.stripe.com/testing)
- [API Stripe](https://docs.stripe.com/api)

## 🆘 Support

Si vous rencontrez des problèmes:

1. Vérifiez que vos clés API sont correctes
2. Consultez les logs du Dashboard Stripe
3. Vérifiez que votre backend est bien lancé
4. Testez d'abord avec les cartes de test Stripe

## 📝 Notes importantes

- ⚠️ **Ne committez JAMAIS vos clés secrètes** (`.env` est dans `.gitignore`)
- 🔒 Les clés secrètes doivent rester côté serveur uniquement
- 💳 Utilisez toujours le mode test avant de passer en production
- 📧 Configurez l'envoi d'emails de confirmation après paiement
