-- Ajouter le champ status aux participants (success par défaut, canceled = annulé, non compté)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participants' AND column_name = 'status'
  ) THEN
    ALTER TABLE participants ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'success';
    ALTER TABLE participants ADD CONSTRAINT status_check CHECK (status IN ('success', 'canceled'));
    CREATE INDEX idx_participants_status ON participants(status);
    COMMENT ON COLUMN participants.status IS 'Statut de l''inscription : success (compté) ou canceled (annulé, non compté)';
  END IF;
END $$;
