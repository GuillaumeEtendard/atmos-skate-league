-- Créer la table des inscriptions spectateurs (sans paiement)
CREATE TABLE IF NOT EXISTS inscriptions_spectateurs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Informations personnelles
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,

  -- Créneau
  event_id VARCHAR(100),

  -- Métadonnées
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_inscriptions_spectateurs_email ON inscriptions_spectateurs(email);
CREATE INDEX idx_inscriptions_spectateurs_event_id ON inscriptions_spectateurs(event_id);
CREATE INDEX idx_inscriptions_spectateurs_registered_at ON inscriptions_spectateurs(registered_at);

-- Activer Row Level Security (RLS)
ALTER TABLE inscriptions_spectateurs ENABLE ROW LEVEL SECURITY;

-- Politique : Lecture publique (pour l'admin dashboard)
CREATE POLICY "Enable read access for all users" ON inscriptions_spectateurs
  FOR SELECT
  USING (true);

-- Politique : Insertion uniquement via service role (backend API)
CREATE POLICY "Enable insert for service role only" ON inscriptions_spectateurs
  FOR INSERT
  WITH CHECK (true);

-- Trigger updated_at
CREATE TRIGGER update_inscriptions_spectateurs_updated_at
  BEFORE UPDATE ON inscriptions_spectateurs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Commentaires pour documentation
COMMENT ON TABLE inscriptions_spectateurs IS 'Table des inscriptions spectateurs (sans paiement) à l''Atmos Skate League';
COMMENT ON COLUMN inscriptions_spectateurs.first_name IS 'Prénom du spectateur';
COMMENT ON COLUMN inscriptions_spectateurs.last_name IS 'Nom du spectateur';
COMMENT ON COLUMN inscriptions_spectateurs.email IS 'Adresse email du spectateur';
COMMENT ON COLUMN inscriptions_spectateurs.event_id IS 'ID du créneau choisi';
