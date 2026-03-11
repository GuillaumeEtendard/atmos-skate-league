-- Ajouter le champ age_category aux participants
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participants' AND column_name = 'age_category'
  ) THEN
    ALTER TABLE participants ADD COLUMN age_category VARCHAR(3) CHECK (age_category IN ('18+', '18-'));
    COMMENT ON COLUMN participants.age_category IS 'Tranche d''âge du participant : 18+ (majeur) ou 18- (mineur)';
  END IF;
END $$;
