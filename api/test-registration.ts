/**
 * Route de test : inscription sans paiement Stripe pour vérifier l'envoi d'email (Brevo)
 * et l'enregistrement en base. Protégée par TEST_REGISTRATION_SECRET.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { sendRegistrationConfirmationEmail } from './lib/email.js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

function randomId(): string {
  return 'test_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Test-Secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = (req.headers['x-test-secret'] as string) || req.body?.testSecret;
  const expectedSecret = process.env.TEST_REGISTRATION_SECRET;
  if (!expectedSecret || secret !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized: invalid or missing TEST_REGISTRATION_SECRET' });
  }

  try {
    const { name, email, phone, eventId, creneau, date, jersey, jersey_size: jerseySize } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        error: 'Champs requis : name, email, phone',
      });
    }

    const paymentIntentId = randomId();

    const insertData: Record<string, unknown> = {
      name,
      email,
      phone,
      payment_intent_id: paymentIntentId,
      amount: 0,
      currency: 'eur',
      payment_status: 'succeeded',
      event_id: eventId || null,
      jersey: jersey || null,
      jersey_size: jerseySize || null,
    };

    const { data: participant, error: dbError } = await supabase
      .from('participants')
      .insert(insertData)
      .select()
      .single();

    if (dbError) {
      console.error('Test registration DB error:', dbError);
      return res.status(500).json({
        error: 'Erreur base de données',
        details: dbError.message,
      });
    }

    let emailSent = false;
    if (process.env.BREVO_API_KEY) {
      try {
        const emailResult = await sendRegistrationConfirmationEmail({
          customerName: name,
          customerEmail: email,
          creneau: creneau || undefined,
          date: date || undefined,
        });
        if (emailResult.success) {
          emailSent = true;
          await supabase
            .from('participants')
            .update({
              confirmation_email_sent: true,
              confirmation_email_sent_at: new Date().toISOString(),
            })
            .eq('id', participant.id);
        } else {
          console.warn('Test registration email failed:', emailResult.error);
        }
      } catch (emailError) {
        console.warn('Test registration email error:', emailError);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Inscription test enregistrée',
      participant: {
        id: participant.id,
        name: participant.name,
        email: participant.email,
        event_id: participant.event_id,
        registered_at: participant.registered_at,
      },
      emailSent,
      emailNote: process.env.BREVO_API_KEY
        ? (emailSent ? 'Email de confirmation envoyé.' : 'Envoi email échoué (voir logs).')
        : 'BREVO_API_KEY non configurée, email non envoyé.',
    });
  } catch (error: unknown) {
    console.error('Test registration error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
