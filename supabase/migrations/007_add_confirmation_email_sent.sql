-- Ajouter le champ confirmation_email_sent aux participants (email de confirmation d'inscription envoyé via Brevo)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participants' AND column_name = 'confirmation_email_sent'
  ) THEN
    ALTER TABLE participants ADD COLUMN confirmation_email_sent BOOLEAN NOT NULL DEFAULT false;
    COMMENT ON COLUMN participants.confirmation_email_sent IS 'True si l''email de confirmation d''inscription a été envoyé (Brevo)';
  END IF;
END $$;

-- Optionnel : date d'envoi pour traçabilité
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participants' AND column_name = 'confirmation_email_sent_at'
  ) THEN
    ALTER TABLE participants ADD COLUMN confirmation_email_sent_at TIMESTAMPTZ;
    COMMENT ON COLUMN participants.confirmation_email_sent_at IS 'Date/heure d''envoi de l''email de confirmation';
  END IF;
END $$;
