/**
 * Envoi d'emails via Brevo (league.atmosgear.com - Atmos Skate League)
 * Template Brevo : https://app.brevo.com/templates/email/edit/42
 * Ce fichier est un module partagé par les routes API ; le default export évite une route publique.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const FROM_EMAIL = 'noreply@mail.atmosgear.com';
const FROM_NAME = 'AtmosGear';

function getApiKey(): string {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    throw new Error('BREVO_API_KEY is not set');
  }
  return key;
}

/** "DIMANCHE 15 MARS" → "Dimanche 15 Mars" */
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export interface RegistrationEmailData {
  customerName: string;
  customerEmail: string;
  /** Titre du créneau (ex. "King of the Road") */
  creneau?: string;
  /** Date affichée (ex. "Dimanche 15 Mars") */
  date?: string;
}

/**
 * Envoie l'email de confirmation d'inscription via le template Brevo (ID 42).
 * Seuls les params sont passés au template.
 */
export async function sendRegistrationConfirmationEmail(
  data: RegistrationEmailData
): Promise<{ success: boolean; data?: { messageId?: string }; error?: unknown }> {
  try {
    const params: Record<string, string> = {};
    if (data.creneau) params.creneau = data.creneau;
    if (data.date) params.date = toTitleCase(data.date);

    const requestBody = {
      to: [
        {
          email: data.customerEmail,
          name: data.customerName,
        },
      ],
      templateId: 42,
      params,
    };

    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': getApiKey(),
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Brevo registration email error:', response.status, result);
      return { success: false, error: result };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('sendRegistrationConfirmationEmail error:', error);
    return { success: false, error };
  }
}

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(404).end();
}
