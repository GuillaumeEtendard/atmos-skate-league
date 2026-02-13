-- Migration pour ajouter les champs maillot (modèle et taille) aux participants
-- Maillots : black-night (BN), white-sky (WS), yellow-thunder (YT)
-- Tailles : S, M, L, XL

-- Colonne jersey : modèle de maillot choisi (black-night, white-sky, yellow-thunder)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participants' AND column_name = 'jersey'
  ) THEN
    ALTER TABLE participants ADD COLUMN jersey VARCHAR(50);
    COMMENT ON COLUMN participants.jersey IS 'Modèle de maillot : black-night (BN), white-sky (WS), yellow-thunder (YT)';
  END IF;
END $$;

-- Colonne jersey_size : taille du maillot (S, M, L, XL)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participants' AND column_name = 'jersey_size'
  ) THEN
    ALTER TABLE participants ADD COLUMN jersey_size VARCHAR(5);
    COMMENT ON COLUMN participants.jersey_size IS 'Taille du maillot : S, M, L ou XL';
  END IF;
END $$;
