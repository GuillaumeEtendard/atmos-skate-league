import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialiser Stripe avec votre clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

// Initialiser Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

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
    const { paymentIntent, name, email, phone, gender, eventId } = req.body;

    // Vérifier que tous les champs requis sont présents
    if (!paymentIntent || !name || !email || !phone || !gender) {
      return res.status(400).json({
        error: 'Missing required fields: paymentIntent, name, email, phone, gender',
      });
    }

    // Valider le genre
    if (gender !== 'male' && gender !== 'female') {
      return res.status(400).json({
        error: 'Invalid gender value. Must be "male" or "female"',
      });
    }

    // Vérifier que le paiement a bien été effectué
    const intent = await stripe.paymentIntents.retrieve(paymentIntent);

    if (intent.status !== 'succeeded') {
      return res.status(400).json({
        error: 'Payment not confirmed',
      });
    }

    // Enregistrer le participant dans Supabase
    const insertData: any = {
      name,
      email,
      phone,
      gender,
      payment_intent_id: paymentIntent,
      amount: intent.amount / 100, // Convertir en euros
      currency: intent.currency,
      payment_status: intent.status,
    };

    // Ajouter l'event_id seulement s'il est fourni
    if (eventId) {
      insertData.event_id = eventId;
    }

    const { data: participant, error: dbError } = await supabase
      .from('participants')
      .insert(insertData)
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);

      // Si c'est une erreur de duplication (participant déjà enregistré)
      if (dbError.code === '23505') {
        return res.status(409).json({
          error: 'Participant already registered with this payment',
        });
      }

      return res.status(500).json({
        error: 'Failed to save participant data',
      });
    }

    console.log('New participant registered:', participant);

    // TODO: Envoyer un email de confirmation au participant
    // Vous pouvez utiliser un service comme Resend ou SendGrid

    // Retourner une réponse de succès
    res.status(200).json({
      success: true,
      message: 'Registration successful',
      participant: {
        id: participant.id,
        name: participant.name,
        email: participant.email,
        registered_at: participant.registered_at,
      },
    });
  } catch (error: any) {
    console.error('Error registering participant:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}
