import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { sendRegistrationConfirmationEmail } from './lib/email.js';
import { randomUUID } from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      name,
      email,
      phone,
      jersey,
      jersey_size: jerseySize,
      age_category: ageCategory,
      eventId,
      creneau,
      date,
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Champs requis manquants : name, email, phone' });
    }

    const insertData: Record<string, unknown> = {
      name,
      email,
      phone,
      payment_intent_id: `free_${randomUUID()}`,
      amount: 0,
      currency: 'eur',
      payment_status: 'free',
    };

    if (eventId) insertData.event_id = eventId;
    if (jersey) insertData.jersey = jersey;
    if (jerseySize) insertData.jersey_size = jerseySize;
    if (ageCategory) insertData.age_category = ageCategory;

    const { data: participant, error: dbError } = await supabase
      .from('participants')
      .insert(insertData)
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Erreur lors de l\'enregistrement' });
    }

    if (process.env.BREVO_API_KEY) {
      try {
        const emailResult = await sendRegistrationConfirmationEmail({
          customerName: name,
          customerEmail: email,
          creneau: creneau || undefined,
          date: date || undefined,
        });
        if (emailResult.success) {
          await supabase
            .from('participants')
            .update({ confirmation_email_sent: true, confirmation_email_sent_at: new Date().toISOString() })
            .eq('id', participant.id);
        }
      } catch (emailError) {
        console.warn('Email error:', emailError);
      }
    }

    return res.status(200).json({
      success: true,
      participant: { id: participant.id, name: participant.name, email: participant.email },
    });
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
