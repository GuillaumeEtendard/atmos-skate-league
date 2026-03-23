import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { first_name, last_name, email, phone, event_id } = req.body;

    if (!first_name || !last_name || !email || !phone) {
      return res.status(400).json({
        error: 'Missing required fields: first_name, last_name, email, phone',
      });
    }

    const { data: spectateur, error: dbError } = await supabase
      .from('inscriptions_spectateurs')
      .insert({ first_name, last_name, email, phone, event_id: event_id || null })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to save spectateur data' });
    }

    console.log('New spectateur registered:', spectateur);

    return res.status(200).json({
      success: true,
      message: 'Registration successful',
      spectateur: {
        id: spectateur.id,
        first_name: spectateur.first_name,
        last_name: spectateur.last_name,
        email: spectateur.email,
        registered_at: spectateur.registered_at,
      },
    });
  } catch (error: any) {
    console.error('Error registering spectateur:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
