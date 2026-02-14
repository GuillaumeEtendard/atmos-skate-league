import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { EVENTS } from '@/data/events';
import { Lock, LogOut, RefreshCw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const STORAGE_KEY = 'admin_password';

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_id: string | null;
  jersey: string | null;
  jersey_size: string | null;
  status: string;
  registered_at: string;
  amount: number;
}

interface ByEvent {
  [key: string]: Participant[];
}

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

const Admin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState<string | null>(() =>
    sessionStorage.getItem(STORAGE_KEY)
  );
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [byEvent, setByEvent] = useState<ByEvent>({});
  const [participants, setParticipants] = useState<Participant[]>([]);

  const fetchParticipants = useCallback(
    async (pwd: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/admin-participants`, {
          headers: { 'Admin-Password': pwd },
        });
        if (res.status === 401) {
          sessionStorage.removeItem(STORAGE_KEY);
          setStoredPassword(null);
          setAuthenticated(false);
          setError('Mot de passe incorrect.');
          return;
        }
        if (!res.ok) {
          setError('Erreur lors du chargement des participants.');
          return;
        }
        const data = await res.json();
        setByEvent(data.byEvent ?? {});
        setParticipants(data.participants ?? []);
        setAuthenticated(true);
        sessionStorage.setItem(STORAGE_KEY, pwd);
        setStoredPassword(pwd);
      } catch {
        setError('Erreur réseau.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (storedPassword && !authenticated && !loading) {
      fetchParticipants(storedPassword);
    }
  }, [storedPassword, authenticated, loading, fetchParticipants]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    fetchParticipants(password.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setStoredPassword(null);
    setAuthenticated(false);
    setByEvent({});
    setParticipants([]);
    setPassword('');
    setError(null);
  };

  const eventOrder = EVENTS.map((e) => e.id);
  const eventLabels: Record<string, string> = {};
  EVENTS.forEach((e) => {
    eventLabels[e.id] = `${e.title} – ${e.date} ${e.time}`;
  });
  eventLabels['__sans_creneau__'] = 'Sans créneau';
  const allEventKeys = [...eventOrder, '__sans_creneau__', ...Object.keys(byEvent).filter((k) => !eventOrder.includes(k) && k !== '__sans_creneau__')];

  const isAutoChecking = storedPassword != null && loading && !authenticated && !error;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {isAutoChecking ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
            <RefreshCw className="h-8 w-8 animate-spin mb-4" />
            <p>Connexion…</p>
          </div>
        ) : !authenticated ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="flex items-center gap-2 text-primary">
              <Lock className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Admin – Participants</h1>
            </div>
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe admin"
                  className="bg-card border-border"
                  autoFocus
                  disabled={loading}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Vérification…' : 'Accéder'}
              </Button>
            </form>
            <Button variant="ghost" onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Users className="h-7 w-7" />
                Liste des participants par course
              </h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => storedPassword && fetchParticipants(storedPassword)}
                  disabled={loading}
                >
                  <RefreshCw className={loading ? 'animate-spin h-4 w-4' : 'h-4 w-4'} />
                  Actualiser
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            </div>

            {loading && participants.length === 0 ? (
              <p className="text-muted-foreground">Chargement…</p>
            ) : (
              <div className="space-y-8">
                {allEventKeys.map((eventId) => {
                  const list = byEvent[eventId] ?? [];
                  const label = eventLabels[eventId] ?? eventId;
                  return (
                    <section key={eventId} className="border border-border rounded-lg overflow-hidden bg-card">
                      <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center justify-between">
                        <h2 className="font-semibold text-lg">{label}</h2>
                        <span className="text-sm text-muted-foreground">{list.length} participant{list.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="overflow-x-auto">
                        {list.length === 0 ? (
                          <p className="p-4 text-sm text-muted-foreground">Aucun participant.</p>
                        ) : (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border bg-muted/30">
                                <th className="text-left p-3 font-medium">Nom</th>
                                <th className="text-left p-3 font-medium hidden sm:table-cell">Email</th>
                                <th className="text-left p-3 font-medium hidden md:table-cell">Téléphone</th>
                                <th className="text-left p-3 font-medium">Maillot</th>
                                <th className="text-left p-3 font-medium">Inscription</th>
                                <th className="text-right p-3 font-medium">Montant</th>
                              </tr>
                            </thead>
                            <tbody>
                              {list.map((p) => (
                                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20">
                                  <td className="p-3 font-medium">{p.name}</td>
                                  <td className="p-3 hidden sm:table-cell">{p.email}</td>
                                  <td className="p-3 hidden md:table-cell">{p.phone}</td>
                                  <td className="p-3">
                                    {p.jersey || p.jersey_size
                                      ? [p.jersey, p.jersey_size].filter(Boolean).join(' / ')
                                      : '–'}
                                  </td>
                                  <td className="p-3 text-muted-foreground">
                                    {p.registered_at
                                      ? new Date(p.registered_at).toLocaleDateString('fr-FR', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })
                                      : '–'}
                                  </td>
                                  <td className="p-3 text-right">{p.amount != null ? `${p.amount} €` : '–'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
