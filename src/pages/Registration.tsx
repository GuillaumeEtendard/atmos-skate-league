import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import RegistrationForm from '@/components/registration/RegistrationForm';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Chargez votre clé publique Stripe
// IMPORTANT: Remplacez cette valeur par votre clé publique Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_YOUR_KEY_HERE');

const Registration = () => {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Créer un PaymentIntent dès que la page se charge
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 3500 }), // 35€ en centimes
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to create payment intent');
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
      });
  }, []);

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#ffd600',
      colorBackground: '#0a0a0a',
      colorText: '#ffffff',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background similaire à la page principale */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#ffd600 1px, transparent 1px), linear-gradient(90deg, #ffd600 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute top-[10%] -left-40 w-[600px] h-[600px] bg-[#ffd600]/6 rounded-full blur-[150px]" style={{ animation: 'glow-pulse 8s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
        <div className="absolute top-[40%] -right-40 w-[500px] h-[500px] bg-[#ffd600]/5 rounded-full blur-[130px]" style={{ animation: 'glow-pulse 8s cubic-bezier(0.4, 0, 0.2, 1) infinite', animationDelay: '2s' }} />
      </div>

      {/* Contenu */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Bouton retour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-[#ffd600] hover:text-[#ffd600]/80 hover:bg-[#ffd600]/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </motion.div>

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-wider text-[#ffd600] mb-4">
            INSCRIPTION
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Rejoins l'Atmos Skate League et participe à la première compétition de rollers
          </p>
        </motion.div>

        {/* Formulaire d'inscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8">
            {clientSecret ? (
              <Elements options={options} stripe={stripePromise}>
                <RegistrationForm />
              </Elements>
            ) : (
              <div className="space-y-6">
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffd600] mb-4"></div>
                  <p className="text-muted-foreground">Chargement du formulaire de paiement...</p>
                  <div className="mt-8 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                    <p className="text-sm text-orange-300">
                      ⚠️ <strong>Configuration requise:</strong> Pour activer le paiement, vous devez configurer votre backend Stripe.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Consultez le fichier README pour les instructions de configuration.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Informations supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            🔒 Paiement sécurisé par Stripe • Vos données sont protégées
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Registration;
