import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Initialiser Stripe avec votre clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Autoriser seulement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { paymentIntent, name, email, phone } = req.body;

    // Vérifier que tous les champs requis sont présents
    if (!paymentIntent || !name || !email) {
      return res.status(400).json({
        error: 'Missing required fields: paymentIntent, name, email',
      });
    }

    // Vérifier que le paiement a bien été effectué
    const intent = await stripe.paymentIntents.retrieve(paymentIntent);

    if (intent.status !== 'succeeded') {
      return res.status(400).json({
        error: 'Payment not confirmed',
      });
    }

    // TODO: Enregistrer le participant dans votre base de données
    // Exemple de données à enregistrer:
    const participantData = {
      name,
      email,
      phone,
      paymentIntentId: paymentIntent,
      amount: intent.amount / 100, // Convertir en euros
      registeredAt: new Date().toISOString(),
    };

    console.log('New participant registered:', participantData);

    // TODO: Envoyer un email de confirmation au participant
    // Vous pouvez utiliser un service comme SendGrid, Resend, ou Mailgun

    // Retourner une réponse de succès
    res.status(200).json({
      success: true,
      message: 'Registration successful',
      participant: {
        name,
        email,
      },
    });
  } catch (error: any) {
    console.error('Error registering participant:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}
