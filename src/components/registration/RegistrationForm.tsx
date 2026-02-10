import { useState, FormEvent } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const RegistrationForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validation basique
    if (!email || !name) {
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
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/confirmation`,
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
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+33 6 12 34 56 78"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-background/50"
          />
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
          <span className="text-2xl font-bold text-[#ffd600]">20,00 €</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Frais d'inscription à la ligue Atmos Skate League
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
