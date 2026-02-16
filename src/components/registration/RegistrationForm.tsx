import { useState, FormEvent } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
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

const RegistrationForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { selectedSlot } = useEventSlot();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [jersey, setJersey] = useState<string>('');
  const [jerseySize, setJerseySize] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validation basique
    if (!email || !name || !phone || !jersey || !jerseySize) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires, choisir un maillot et une taille',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Confirmer le paiement
      const returnUrl = new URL(`${window.location.origin}/confirmation`);
      if (selectedSlot) {
        returnUrl.searchParams.set('event_id', selectedSlot.id);
        const event = getEventById(selectedSlot.id);
        if (event) {
          returnUrl.searchParams.set('event_label', `${event.title} – ${event.date}`);
          returnUrl.searchParams.set('creneau', event.title);
          returnUrl.searchParams.set('date', event.date);
        }
      }
      returnUrl.searchParams.set('name', name);
      returnUrl.searchParams.set('email', email);
      returnUrl.searchParams.set('phone', phone);
      returnUrl.searchParams.set('jersey', jersey);
      returnUrl.searchParams.set('jersey_size', jerseySize);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl.toString(),
          receipt_email: email,
          payment_method_data: {
            billing_details: {
              name: name,
              email: email,
              phone: phone,
            },
          },
        },
      });

      if (error) {
        toast({
          title: 'Erreur de paiement',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors du paiement',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
      {creneauAttentionMessage && (
        <Alert className="border-amber-500/50 bg-amber-500/10 text-amber-800 dark:text-amber-200 dark:border-amber-500/30">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>{creneauAttentionMessage}</AlertDescription>
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
                onClick={() => setJersey(opt.id)}
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

        <div className="space-y-2">
          <Label htmlFor="jersey_size">Taille du maillot *</Label>
          <Select value={jerseySize} onValueChange={setJerseySize} required>
            <SelectTrigger id="jersey_size" className="bg-background/50">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              {JERSEY_SIZES.map((size) => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Informations de paiement */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Informations de paiement</h3>
        <div className="border border-border rounded-lg p-4 bg-background/50">
          <PaymentElement />
        </div>
      </div>

      {/* Récapitulatif */}
      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total à payer</span>
          <span className="text-2xl font-bold text-[#ffd600]">35,00 €</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Frais d'inscription à la ligue Atmos Skate League (inclut le maillot de 35€)
        </p>
      </div>

      {/* Bouton de soumission */}
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-[#ffd600] hover:bg-[#ffd600]/90 text-black font-semibold py-6 text-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          'Valider et payer'
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        En validant, vous acceptez nos conditions générales de vente et notre politique de confidentialité.
      </p>
    </form>
  );
};

export default RegistrationForm;
