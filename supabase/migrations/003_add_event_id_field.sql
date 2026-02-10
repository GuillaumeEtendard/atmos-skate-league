-- Migration pour ajouter le champ event_id aux participants

-- Ajouter la colonne event_id (si elle n'existe pas déjà)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participants' AND column_name = 'event_id'
  ) THEN
    ALTER TABLE participants ADD COLUMN event_id VARCHAR(100);

    -- Ajouter un commentaire
    COMMENT ON COLUMN participants.event_id IS 'Identifiant du créneau/événement sélectionné (optionnel)';

    -- Créer un index pour les recherches par événement
    CREATE INDEX idx_participants_event_id ON participants(event_id);
  END IF;
END $$;
