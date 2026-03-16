import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import { useEventSlot } from '@/contexts/EventSlotContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { getEventById } from '@/data/events';
import { cn } from '@/lib/utils';

const JERSEY_OPTIONS = [
  { id: 'black-night', label: 'Black Night', src: '/atmos-uploads/black-night.webp' },
  { id: 'white-sky', label: 'White Sky', src: '/atmos-uploads/white-sky.webp' },
  { id: 'yellow-thunder', label: 'Yellow Thunder', src: '/atmos-uploads/yellow-thunder.png' },
] as const;

const JERSEY_SIZES = ['S', 'M', 'L', 'XL'] as const;

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

const DevRegistrationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedSlot } = useEventSlot();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [jersey, setJersey] = useState<string>('');
  const [jerseySize, setJerseySize] = useState<string>('');
  const [ageCategory, setAgeCategory] = useState<'18+' | '18-' | ''>('');
  const [stockData, setStockData] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    fetch(`${API_BASE}/api/jersey-stock`)
      .then((res) => res.json())
      .then((data) => setStockData(data.stock ?? {}))
      .catch(() => {});
  }, []);

  const handleJerseyChange = (jerseyId: string) => {
    setJersey(jerseyId);
    if (jerseySize && stockData[jerseyId]?.[jerseySize] === 0) {
      setJerseySize('');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email || !name || !phone || !jersey || !jerseySize || !ageCategory) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires, choisir un maillot, une taille et votre tranche d\'âge',
        variant: 'destructive',
      });
      return;
    }

    const params = new URLSearchParams({
      payment_intent: 'pi_dev_test_' + Date.now(),
      redirect_status: 'succeeded',
      name,
      email,
      phone,
      jersey,
      jersey_size: jerseySize,
      age_category: ageCategory,
    });

    if (selectedSlot) {
      params.set('event_id', selectedSlot.id);
      const event = getEventById(selectedSlot.id);
      if (event) {
        params.set('event_label', `${event.title} – ${event.date}`);
        params.set('creneau', event.title);
        params.set('date', event.date);
      }
    }

    navigate(`/confirmation?${params.toString()}`);
  };

  const event = selectedSlot ? getEventById(selectedSlot.id) : null;
  const creneauAttentionMessage =
    event?.type === 'king'
      ? 'Les courses King of the Road sont réservées aux hommes.'
      : event?.type === 'queen'
        ? 'Les courses Queen of the Road sont réservées aux femmes.'
        : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs text-yellow-400 font-mono">
        ⚙️ Mode développement — paiement Stripe désactivé
      </div>

      {creneauAttentionMessage && (
        <Alert className="border-amber-500/50 bg-amber-500/10 text-amber-800 dark:text-amber-200 dark:border-amber-500/30 [&>svg]:top-[18px]">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-lg font-bold">Attention</AlertTitle>
          <AlertDescription className="text-base">{creneauAttentionMessage}</AlertDescription>
        </Alert>
      )}

      {/* Informations personnelles */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Informations personnelles</h3>

        <div className="space-y-2">
          <Label htmlFor="name">Nom complet *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Jean Dupont"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-background/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="jean.dupont@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+33 6 12 34 56 78"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="bg-background/50"
          />
        </div>

        <div className="space-y-3">
          <Label>Choisis ton maillot *</Label>
          <div className="grid grid-cols-3 gap-3">
            {JERSEY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleJerseyChange(opt.id)}
                className={cn(
                  'relative flex flex-col items-center rounded-lg border-2 p-2 transition-all overflow-hidden',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd600] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  jersey === opt.id
                    ? 'border-[#ffd600] bg-[#ffd600]/10 ring-2 ring-[#ffd600]/30'
                    : 'border-border bg-background/50 hover:border-[#ffd600]/50 hover:bg-background/80'
                )}
              >
                <div className="aspect-[3/4] w-full rounded-md overflow-hidden bg-muted">
                  <img
                    src={opt.src}
                    alt={opt.label}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <span className="mt-2 text-xs font-medium text-foreground">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Taille du maillot *</Label>
          <div className="grid grid-cols-4 gap-2">
            {JERSEY_SIZES.map((size) => {
              const isSoldOut = jersey ? stockData[jersey]?.[size] === 0 : false;
              const isSelected = jerseySize === size;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={isSoldOut}
                  onClick={() => setJerseySize(size)}
                  className={cn(
                    'relative flex flex-col items-center justify-center rounded-lg border-2 py-3 gap-0.5 transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd600] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isSoldOut
                      ? 'cursor-not-allowed border-border/50 bg-muted/30 opacity-60'
                      : isSelected
                        ? 'border-[#ffd600] bg-[#ffd600]/10 ring-2 ring-[#ffd600]/30'
                        : 'border-border bg-background/50 hover:border-[#ffd600]/50 hover:bg-background/80'
                  )}
                >
                  <span className={cn(
                    'text-sm font-semibold',
                    isSoldOut ? 'line-through text-muted-foreground' : 'text-foreground'
                  )}>
                    {size}
                  </span>
                  {isSoldOut && (
                    <span className="text-[9px] font-bold text-red-500 uppercase leading-tight">
                      Sold out
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Tranche d'âge *</Label>
          <div className="grid grid-cols-2 gap-3">
            {(['18+', '18-'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setAgeCategory(cat)}
                className={cn(
                  'flex items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-all',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd600] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  ageCategory === cat
                    ? 'border-[#ffd600] bg-[#ffd600]/10 ring-2 ring-[#ffd600]/30 text-foreground'
                    : 'border-border bg-background/50 hover:border-[#ffd600]/50 hover:bg-background/80 text-foreground'
                )}
              >
                {cat === '18+' ? "J'ai plus de 18 ans" : "J'ai moins de 18 ans"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conditions de non-remboursement */}
      <p className="text-sm text-muted-foreground">
        * Les frais d'inscription ne sont pas remboursables en cas d'annulation ou d'absence le jour de l'événement.
      </p>

      {/* Bouton de soumission */}
      <Button
        type="submit"
        className="w-full bg-[#ffd600] hover:bg-[#ffd600]/90 text-black font-semibold py-6 text-lg"
      >
        Valider et Payer
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        En validant, vous acceptez nos conditions générales de vente et notre politique de confidentialité.
      </p>
    </form>
  );
};

export default DevRegistrationForm;
