import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Admin-Password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const password = (req.headers['admin-password'] ?? req.query.password) as string | undefined;
  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data: rows, error } = await supabase
      .from('participants')
      .select('id, name, email, phone, event_id, jersey, jersey_size, status, registered_at, amount, confirmation_email_sent, confirmation_email_sent_at')
      .neq('status', 'canceled')
      .order('registered_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch participants' });
    }

    // Grouper par event_id (y compris null = "Non assigné")
    const byEvent: Record<string, typeof rows> = {};
    for (const row of rows ?? []) {
      const key = row.event_id ?? '__sans_creneau__';
      if (!byEvent[key]) byEvent[key] = [];
      byEvent[key].push(row);
    }

    return res.status(200).json({ participants: rows ?? [], byEvent });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
