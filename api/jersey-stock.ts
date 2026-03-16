import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Supabase table required:
// CREATE TABLE jersey_stock (
//   jersey_id text NOT NULL,
//   size      text NOT NULL,
//   stock     integer NOT NULL DEFAULT 0,
//   updated_at timestamptz DEFAULT now(),
//   PRIMARY KEY (jersey_id, size)
// );

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Admin-Password');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — public, used by the registration form
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('jersey_stock')
        .select('jersey_id, size, stock');

      if (error) {
        // Table might not exist yet — return empty stock (= all sizes available)
        return res.status(200).json({ stock: {} });
      }

      const stock: Record<string, Record<string, number>> = {};
      for (const row of data ?? []) {
        if (!stock[row.jersey_id]) stock[row.jersey_id] = {};
        stock[row.jersey_id][row.size] = row.stock;
      }

      return res.status(200).json({ stock });
    } catch {
      return res.status(200).json({ stock: {} });
    }
  }

  // PUT — admin only
  if (req.method === 'PUT') {
    const password = req.headers['admin-password'] as string | undefined;
    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { jersey_id, size, stock } = req.body as {
      jersey_id?: string;
      size?: string;
      stock?: number;
    };

    if (!jersey_id || !size || stock === undefined || stock < 0) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const { data, error } = await supabase
      .from('jersey_stock')
      .upsert(
        { jersey_id, size, stock, updated_at: new Date().toISOString() },
        { onConflict: 'jersey_id,size' }
      )
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ row: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
