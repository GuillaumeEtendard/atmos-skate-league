import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const eventIdsParam = req.query.eventIds;
    if (!eventIdsParam || typeof eventIdsParam !== 'string') {
      return res.status(400).json({ error: 'Missing query param: eventIds (comma-separated)' });
    }

    const eventIds = eventIdsParam.split(',').map((id) => id.trim()).filter(Boolean);
    if (eventIds.length === 0) {
      return res.status(200).json({});
    }

    const { data: rows, error } = await supabase
      .from('participants')
      .select('event_id')
      .in('event_id', eventIds);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch participant counts' });
    }

    const counts: Record<string, number> = {};
    for (const id of eventIds) {
      counts[id] = 0;
    }
    for (const row of rows ?? []) {
      const id = row.event_id;
      if (id != null && eventIds.includes(id)) {
        counts[id] = (counts[id] ?? 0) + 1;
      }
    }

    return res.status(200).json(counts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
