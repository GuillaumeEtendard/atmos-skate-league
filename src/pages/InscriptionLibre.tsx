import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Trophy, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getEventById } from '@/data/events';
import { cn } from '@/lib/utils';

const JERSEY_OPTIONS = [
  { id: 'black-night', label: 'Black Night', src: '/atmos-uploads/black-night.webp' },
  { id: 'white-sky', label: 'White Sky', src: '/atmos-uploads/white-sky.webp' },
  { id: 'yellow-thunder', label: 'Yellow Thunder', src: '/atmos-uploads/yellow-thunder.png' },
] as const;

const JERSEY_SIZES = ['S', 'M', 'L', 'XL'] as const;

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

const typeStyles = {
  king: { bg: 'bg-racing-yellow/10', border: 'border-racing-yellow/30', text: 'text-racing-yellow' },
  queen: { bg: 'bg-racing-purple/10', border: 'border-racing-purple/30', text: 'text-racing-purple' },
  electric: { bg: 'bg-racing-blue/10', border: 'border-racing-blue/30', text: 'text-racing-blue' },
  mixte: { bg: 'bg-racing-red/10', border: 'border-racing-red/30', text: 'text-racing-red' },
};

const InscriptionLibre = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const { toast } = useToast();

  const event = eventId ? getEventById(eventId) : undefined;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jersey, setJersey] = useState('');
  const [jerseySize, setJerseySize] = useState('');
  const [ageCategory, setAgeCategory] = useState<'18+' | '18-' | ''>('');
  const [stockData, setStockData] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/jersey-stock`)
      .then((res) => res.json())
      .then((data) => setStockData(data.stock ?? {}))
      .catch(() => {});
  }, []);

  const handleJerseyChange = (jerseyId: string) => {
    setJersey(jerseyId);
    if (jerseySize && stockData[jerseyId]?.[jerseySize] === 0) setJerseySize('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !jersey || !jerseySize || !ageCategory) {
      toast({
        title: 'Erreur',
        description: "Veuillez remplir tous les champs et choisir un maillot, une taille et une tranche d'âge.",
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/register-sans-paiement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          jersey,
          jersey_size: jerseySize,
          age_category: ageCategory,
          eventId: event?.id,
          creneau: event?.title,
          date: event?.date,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      setIsSuccess(true);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const creneauAttentionMessage =
    event?.type === 'king'
      ? 'Les courses King of the Road sont réservées aux hommes.'
      : event?.type === 'queen'
        ? 'Les courses Queen of the Road sont réservées aux femmes.'
        : null;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#ffd600 1px, transparent 1px), linear-gradient(90deg, #ffd600 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-[10%] -left-40 w-[600px] h-[600px] bg-[#ffd600]/6 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] -right-40 w-[500px] h-[500px] bg-[#ffd600]/5 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-[#ffd600] hover:text-[#ffd600]/80 hover:bg-[#ffd600]/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-wider text-[#ffd600] mb-4">INSCRIPTION</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Inscription sans paiement à l'Atmos Skate League
          </p>
        </motion.div>

        {/* Créneau */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-2xl mx-auto mb-6">
          {event ? (
            <div className={cn('rounded-lg border p-6 backdrop-blur-sm', typeStyles[event.type].bg, typeStyles[event.type].border)}>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className={cn('h-5 w-5', typeStyles[event.type].text)} />
                <h2 className="text-xl font-semibold text-foreground">Créneau</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">{event.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">{event.time}</span>
                </div>
                <div className={cn('inline-block rounded-full px-3 py-1 text-sm font-bold uppercase', typeStyles[event.type].text, typeStyles[event.type].bg)}>
                  {event.title}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4 text-sm text-orange-400">
              Aucun créneau trouvé pour l'identifiant "{eventId}". Vérifiez l'URL.
            </div>
          )}
        </motion.div>

        {/* Formulaire ou succès */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="max-w-2xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8">
            {isSuccess ? (
              <div className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
                </motion.div>
                <h2 className="text-3xl font-bold text-[#ffd600] mb-2">Inscription réussie !</h2>
                <p className="text-muted-foreground mb-6">
                  {name} a bien été inscrit{event ? ` à ${event.title} – ${event.date}` : ''}.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => { setIsSuccess(false); setName(''); setEmail(''); setPhone(''); setJersey(''); setJerseySize(''); setAgeCategory(''); }}
                    className="bg-[#ffd600] hover:bg-[#ffd600]/90 text-black font-semibold"
                  >
                    Inscrire une autre personne
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/')}>
                    Retour à l'accueil
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {creneauAttentionMessage && (
                  <Alert className="border-amber-500/50 bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/30 [&>svg]:top-[18px]">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-lg font-bold">Attention</AlertTitle>
                    <AlertDescription className="text-base">{creneauAttentionMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">Informations personnelles</h3>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input id="name" type="text" placeholder="Jean Dupont" value={name} onChange={(e) => setName(e.target.value)} required className="bg-background/50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="jean.dupont@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background/50" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" value={phone} onChange={(e) => setPhone(e.target.value)} required className="bg-background/50" />
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
                            <img src={opt.src} alt={opt.label} className="h-full w-full object-cover object-top" />
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
                            <span className={cn('text-sm font-semibold', isSoldOut ? 'line-through text-muted-foreground' : 'text-foreground')}>
                              {size}
                            </span>
                            {isSoldOut && <span className="text-[9px] font-bold text-red-500 uppercase leading-tight">Sold out</span>}
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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#ffd600] hover:bg-[#ffd600]/90 text-black font-semibold py-6 text-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Inscription en cours...
                    </>
                  ) : (
                    "Inscrire le participant"
                  )}
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InscriptionLibre;
