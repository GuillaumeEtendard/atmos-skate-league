-- Migration pour ajouter le champ gender et rendre phone obligatoire
-- À exécuter si vous avez déjà créé la table avec la migration 001

-- Ajouter la colonne gender (si elle n'existe pas déjà)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participants' AND column_name = 'gender'
  ) THEN
    ALTER TABLE participants ADD COLUMN gender VARCHAR(10);

    -- Ajouter la contrainte CHECK pour valider les valeurs
    ALTER TABLE participants ADD CONSTRAINT gender_check CHECK (gender IN ('male', 'female'));

    -- Ajouter un commentaire
    COMMENT ON COLUMN participants.gender IS 'Sexe du participant (male ou female)';
  END IF;
END $$;

-- Rendre la colonne phone obligatoire (si ce n'est pas déjà le cas)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'participants'
    AND column_name = 'phone'
    AND is_nullable = 'YES'
  ) THEN
    -- Mettre à jour les valeurs NULL existantes avant de rendre la colonne NOT NULL
    UPDATE participants SET phone = '' WHERE phone IS NULL;

    -- Rendre la colonne NOT NULL
    ALTER TABLE participants ALTER COLUMN phone SET NOT NULL;

    -- Mettre à jour le commentaire
    COMMENT ON COLUMN participants.phone IS 'Numéro de téléphone (obligatoire)';
  END IF;
END $$;

-- Rendre la colonne gender obligatoire (une fois que toutes les données ont été migrées)
-- Décommentez cette partie une fois que vous avez mis à jour toutes les lignes existantes
-- ALTER TABLE participants ALTER COLUMN gender SET NOT NULL;
