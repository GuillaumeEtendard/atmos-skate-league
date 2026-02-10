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
import { Loader2 } from 'lucide-react';
import { useEventSlot } from '@/contexts/EventSlotContext';

const RegistrationForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { selectedSlot } = useEventSlot();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validation basique
    if (!email || !name || !phone || !gender) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
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
      }
      returnUrl.searchParams.set('name', name);
      returnUrl.searchParams.set('email', email);
      returnUrl.searchParams.set('phone', phone);
      returnUrl.searchParams.set('gender', gender);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="space-y-2">
          <Label htmlFor="gender">Sexe *</Label>
          <Select value={gender} onValueChange={setGender} required>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Sélectionnez votre sexe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Homme</SelectItem>
              <SelectItem value="female">Femme</SelectItem>
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
          Frais d'inscription à la ligue Atmos Skate League (includes jersey worth 35€)
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
