-- Migration pour supprimer le champ gender (sexe) de la table participants

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participants' AND column_name = 'gender'
  ) THEN
    ALTER TABLE participants DROP COLUMN gender;
  END IF;
END $$;
