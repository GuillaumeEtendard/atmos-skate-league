-- Create jersey_stock table
CREATE TABLE IF NOT EXISTS jersey_stock (
  jersey_id  text    NOT NULL,
  size       text    NOT NULL,
  stock      integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (jersey_id, size)
);

-- Seed initial stock from inventory export
INSERT INTO jersey_stock (jersey_id, size, stock) VALUES
  ('yellow-thunder', 'S',  19),
  ('yellow-thunder', 'M',  58),
  ('yellow-thunder', 'L',  15),
  ('yellow-thunder', 'XL', 22),
  ('white-sky',      'S',  31),
  ('white-sky',      'M',  68),
  ('white-sky',      'L',  0),
  ('white-sky',      'XL', 18),
  ('black-night',    'S',  48),
  ('black-night',    'M',  14),
  ('black-night',    'L',  35),
  ('black-night',    'XL', 48)
ON CONFLICT (jersey_id, size) DO UPDATE SET
  stock      = EXCLUDED.stock,
  updated_at = now();
