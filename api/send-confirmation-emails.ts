/**
 * Envoie l'email de confirmation à tous les participants qui ne l'ont pas reçu.
 * Protégé par Admin-Password.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { sendRegistrationConfirmationEmail } from './lib/email.js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

/** event_id -> { title, date } pour le template email (aligné avec src/data/events.ts) */
const EVENTS_MAP: Record<string, { title: string; date: string }> = {
  'king-15-mars': { title: 'King of the Road', date: 'DIMANCHE 15 MARS' },
  'king-11-avril': { title: 'King of the Road', date: 'SAMEDI 11 AVRIL' },
  'electric-9-mai': { title: 'Électrique', date: 'SAMEDI 9 MAI' },
  'queen-28-mars': { title: 'Queen of the Road', date: 'SAMEDI 28 MARS' },
  'queen-25-avril': { title: 'Queen of the Road', date: 'SAMEDI 25 AVRIL' },
  'mixte-24-mai': { title: 'Mixte', date: 'DIMANCHE 24 MAI' },
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Admin-Password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const password = (req.headers['admin-password'] as string) || req.body?.adminPassword;
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.BREVO_API_KEY) {
    return res.status(500).json({
      error: 'BREVO_API_KEY non configurée',
      sent: 0,
      failed: 0,
      results: [],
    });
  }

  try {
    const { data: participants, error } = await supabase
      .from('participants')
      .select('id, name, email, event_id')
      .neq('status', 'canceled')
      .not('confirmation_email_sent', 'eq', true)
      .order('registered_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch participants', sent: 0, failed: 0, results: [] });
    }

    if (!participants?.length) {
      return res.status(200).json({
        message: 'Aucun participant sans email de confirmation.',
        sent: 0,
        failed: 0,
        results: [],
      });
    }

    const eventInfo = (eventId: string | null) => eventId ? EVENTS_MAP[eventId] ?? null : null;
    const results: { id: string; email: string; success: boolean; error?: string }[] = [];
    let sent = 0;
    let failed = 0;

    for (const p of participants) {
      const ev = eventInfo(p.event_id);
      const emailResult = await sendRegistrationConfirmationEmail({
        customerName: p.name,
        customerEmail: p.email,
        creneau: ev?.title,
        date: ev?.date,
      });

      if (emailResult.success) {
        await supabase
          .from('participants')
          .update({
            confirmation_email_sent: true,
            confirmation_email_sent_at: new Date().toISOString(),
          })
          .eq('id', p.id);
        sent++;
        results.push({ id: p.id, email: p.email, success: true });
      } else {
        failed++;
        const errMsg = emailResult.error instanceof Error ? emailResult.error.message : String(emailResult.error);
        results.push({ id: p.id, email: p.email, success: false, error: errMsg });
      }
    }

    return res.status(200).json({
      message: `Envoyé: ${sent}, Échecs: ${failed}.`,
      sent,
      failed,
      results,
    });
  } catch (err) {
    console.error('send-confirmation-emails error:', err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : 'Internal server error',
      sent: 0,
      failed: 0,
      results: [],
    });
  }
}
