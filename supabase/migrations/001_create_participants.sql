-- Créer la table des participants
CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Informations personnelles
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),

  -- Informations de paiement
  payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'eur',
  payment_status VARCHAR(50) DEFAULT 'succeeded',

  -- Métadonnées
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_participants_email ON participants(email);
CREATE INDEX idx_participants_payment_intent ON participants(payment_intent_id);
CREATE INDEX idx_participants_registered_at ON participants(registered_at);

-- Activer Row Level Security (RLS)
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Politique : Lecture publique (pour l'admin dashboard)
CREATE POLICY "Enable read access for all users" ON participants
  FOR SELECT
  USING (true);

-- Politique : Insertion uniquement via service role (backend API)
CREATE POLICY "Enable insert for service role only" ON participants
  FOR INSERT
  WITH CHECK (true);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER update_participants_updated_at
  BEFORE UPDATE ON participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Commentaires pour documentation
COMMENT ON TABLE participants IS 'Table des participants inscrits à l''Atmos Skate League';
COMMENT ON COLUMN participants.id IS 'Identifiant unique du participant';
COMMENT ON COLUMN participants.name IS 'Nom complet du participant';
COMMENT ON COLUMN participants.email IS 'Adresse email du participant';
COMMENT ON COLUMN participants.phone IS 'Numéro de téléphone (obligatoire)';
COMMENT ON COLUMN participants.gender IS 'Sexe du participant (male ou female)';
COMMENT ON COLUMN participants.payment_intent_id IS 'ID du PaymentIntent Stripe';
COMMENT ON COLUMN participants.amount IS 'Montant payé en euros';
COMMENT ON COLUMN participants.currency IS 'Devise du paiement';
COMMENT ON COLUMN participants.payment_status IS 'Statut du paiement Stripe';
COMMENT ON COLUMN participants.registered_at IS 'Date et heure d''inscription';
