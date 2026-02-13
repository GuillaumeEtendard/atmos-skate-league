import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Confirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'registration_error'>('loading');

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const jersey = searchParams.get('jersey');
    const jerseySize = searchParams.get('jersey_size');
    const eventId = searchParams.get('event_id');

    if (!paymentIntent) {
      setStatus('error');
      return;
    }

    // Vérifier que les champs requis sont présents
    if (!name || !email || !phone) {
      console.error('Missing required fields in URL params');
      setStatus('error');
      return;
    }

    // Vérifier le statut du paiement
    if (redirectStatus === 'succeeded') {
      // Vérifier si déjà traité (éviter les doubles soumissions)
      const registrationKey = `registration_${paymentIntent}`;
      if (sessionStorage.getItem(registrationKey)) {
        setStatus('success');
        return;
      }

      // Enregistrer le participant dans la base de données
      fetch('/api/register-participant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntent,
          name,
          email,
          phone,
          jersey: jersey || undefined,
          jersey_size: jerseySize || undefined,
          eventId,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            if (res.status === 409) {
              sessionStorage.setItem(registrationKey, 'true');
              setStatus('success');
              return;
            }
            if (res.status === 400) {
              setStatus('error');
              return;
            }
            setStatus('registration_error');
            return;
          }
          return res.json();
        })
        .then((data) => {
          if (data == null) return;
          sessionStorage.setItem(registrationKey, 'true');
          setStatus('success');
        })
        .catch((error) => {
          console.error('Error registering participant:', error);
          setStatus('registration_error');
        });
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#ffd600 1px, transparent 1px), linear-gradient(90deg, #ffd600 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute top-[10%] -left-40 w-[600px] h-[600px] bg-[#ffd600]/6 rounded-full blur-[150px]" style={{ animation: 'glow-pulse 8s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
      </div>

      {/* Contenu */}
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="h-16 w-16 mx-auto text-[#ffd600] animate-spin mb-4" />
                <h1 className="text-2xl font-bold mb-2">Vérification du paiement...</h1>
                <p className="text-muted-foreground">
                  Veuillez patienter pendant que nous confirmons votre paiement.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
                </motion.div>
                <h1 className="text-3xl font-bold mb-2 text-[#ffd600]">Inscription réussie !</h1>
                <p className="text-muted-foreground mb-6">
                  Merci pour ton inscription à l'Atmos Skate League. 
                </p>
                <div className="space-y-4">
                  {true && (
                  <div className="bg-[#ffd600]/10 border border-[#ffd600]/30 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 text-[#ffd600]">Prochaines étapes</h3>
                    <ul className="text-sm text-left space-y-2 text-muted-foreground">
                      <li>✅ Préparez toi pour la course !</li>
                      <li>✅ Rejoins nous sur les réseaux sociaux</li>
                    </ul>
                  </div>
                  )}
                  <Button
                    onClick={() => navigate('/')}
                    className="w-full bg-[#ffd600] hover:bg-[#ffd600]/90 text-black font-semibold"
                  >
                    Retour à l'accueil
                  </Button>
                </div>
              </>
            )}

            {status === 'registration_error' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <XCircle className="h-16 w-16 mx-auto text-amber-500 mb-4" />
                </motion.div>
                <h1 className="text-3xl font-bold mb-2 text-amber-500">Paiement reçu, inscription en attente</h1>
                <p className="text-muted-foreground mb-6">
                  Votre paiement a bien été enregistré, mais nous n&apos;avons pas pu finaliser votre inscription (problème technique). Contactez-nous avec votre email pour que nous puissions valider votre inscription.
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="w-full bg-[#ffd600] hover:bg-[#ffd600]/90 text-black font-semibold"
                >
                  Retour à l&apos;accueil
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
                </motion.div>
                <h1 className="text-3xl font-bold mb-2 text-red-500">Erreur de paiement</h1>
                <p className="text-muted-foreground mb-6">
                  Une erreur est survenue lors du traitement de votre paiement. Aucun montant n&apos;a été débité.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/inscription')}
                    className="w-full bg-[#ffd600] hover:bg-[#ffd600]/90 text-black font-semibold"
                  >
                    Réessayer
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="w-full"
                  >
                    Retour à l&apos;accueil
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Confirmation;
