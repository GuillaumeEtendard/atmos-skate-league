-- Ajouter le champ téléphone à la table inscriptions_spectateurs
ALTER TABLE inscriptions_spectateurs
  ADD COLUMN phone VARCHAR(50) NOT NULL DEFAULT '';

-- Supprimer la valeur par défaut après l'ajout (pour forcer la saisie sur les nouvelles lignes)
ALTER TABLE inscriptions_spectateurs
  ALTER COLUMN phone DROP DEFAULT;

COMMENT ON COLUMN inscriptions_spectateurs.phone IS 'Numéro de téléphone du spectateur (obligatoire)';
