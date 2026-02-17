import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import { EVENTS, getEventById } from '@/data/events';
import { Lock, Loader2, Send } from 'lucide-react';

const STORAGE_KEY = 'admin_password';
const API_BASE = import.meta.env.VITE_API_BASE ?? '';

const JERSEY_OPTIONS = [
  { id: 'black-night', label: 'Black Night' },
  { id: 'white-sky', label: 'White Sky' },
  { id: 'yellow-thunder', label: 'Yellow Thunder' },
] as const;

const JERSEY_SIZES = ['S', 'M', 'L', 'XL'] as const;

const TestRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState<string | null>(() =>
    sessionStorage.getItem(STORAGE_KEY)
  );
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ emailSent: boolean; emailNote?: string } | null>(null);

  const [eventId, setEventId] = useState(EVENTS[0]?.id ?? '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jersey, setJersey] = useState('');
  const [jerseySize, setJerseySize] = useState('');
  const [testSecret, setTestSecret] = useState('');

  const selectedEvent = eventId ? getEventById(eventId) : null;

  const checkPassword = useCallback(async (pwd: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin-participants`, {
        headers: { 'Admin-Password': pwd },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(STORAGE_KEY);
        setStoredPassword(null);
        setAuthError('Mot de passe incorrect.');
        return;
      }
      setAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY, pwd);
      setStoredPassword(pwd);
    } catch {
      setAuthError('Erreur réseau.');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (storedPassword && !authenticated && !authLoading) {
      checkPassword(storedPassword);
    }
  }, [storedPassword, authenticated, authLoading, checkPassword]);

  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    checkPassword(password.trim());
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!testSecret.trim()) {
      toast({
        title: 'Clé de test requise',
        description: 'Renseigne TEST_REGISTRATION_SECRET (voir .env.local)',
        variant: 'destructive',
      });
      return;
    }
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast({
        title: 'Champs requis',
        description: 'Nom, email et téléphone sont obligatoires.',
        variant: 'destructive',
      });
      return;
    }

    setResult(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/test-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Test-Secret': testSecret,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          eventId: selectedEvent?.id || null,
          creneau: selectedEvent?.title || null,
          date: selectedEvent?.date || null,
          jersey: jersey || undefined,
          jersey_size: jerseySize || undefined,
          testSecret,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: 'Erreur',
          description: data.error || 'Erreur serveur',
          variant: 'destructive',
        });
        return;
      }

      setResult({ emailSent: data.emailSent, emailNote: data.emailNote });
      toast({
        title: 'Inscription test enregistrée',
        description: data.emailNote,
      });
    } catch (err) {
      toast({
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Erreur réseau',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAutoChecking = storedPassword != null && authLoading && !authenticated && !authError;

  if (!authenticated) {
    if (isAutoChecking) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Connexion…</p>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <div className="flex items-center gap-2 text-primary">
            <Lock className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Accès test</h1>
          </div>
          <form onSubmit={handleAuthSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-password">Mot de passe</Label>
              <Input
                id="test-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe admin"
                className="bg-card border-border"
                autoFocus
                disabled={authLoading}
              />
            </div>
            {authError && (
              <p className="text-sm text-destructive">{authError}</p>
            )}
            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? 'Vérification…' : 'Accéder'}
            </Button>
          </form>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-xl py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card p-6 shadow-sm"
        >
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Test inscription (sans paiement)
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Vérifie l’envoi d’email Brevo et l’enregistrement en base. Créneau prédefini depuis les events.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="test-secret">Clé de test (TEST_REGISTRATION_SECRET)</Label>
              <Input
                id="test-secret"
                type="password"
                placeholder="Clé depuis .env.local"
                value={testSecret}
                onChange={(e) => setTestSecret(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label>Créneau (event)</Label>
              <Select value={eventId} onValueChange={setEventId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un créneau" />
                </SelectTrigger>
                <SelectContent>
                  {EVENTS.filter((e) => !e.comingSoon).map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title} – {event.date} ({event.time})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedEvent && (
                <p className="text-xs text-muted-foreground">
                  Envoyé dans l’email : creneau = &quot;{selectedEvent.title}&quot;, date = &quot;{selectedEvent.date}&quot;
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jean@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 12 34 56 78"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Maillot</Label>
                <Select value={jersey} onValueChange={setJersey}>
                  <SelectTrigger>
                    <SelectValue placeholder="Optionnel" />
                  </SelectTrigger>
                  <SelectContent>
                    {JERSEY_OPTIONS.map((j) => (
                      <SelectItem key={j.id} value={j.id}>
                        {j.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Taille</Label>
                <Select value={jerseySize} onValueChange={setJerseySize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Optionnel" />
                  </SelectTrigger>
                  <SelectContent>
                    {JERSEY_SIZES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {result && (
              <div
                className={`rounded-lg border p-3 text-sm ${result.emailSent ? 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400' : 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}
              >
                {result.emailNote}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours…
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer inscription test + email
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default TestRegistration;
