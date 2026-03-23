import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { EVENTS } from '@/data/events';
import { Lock, LogOut, RefreshCw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const STORAGE_KEY = 'admin_password';

interface Spectateur {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  event_id: string | null;
  registered_at: string;
  created_at?: string | null;
  updated_at?: string | null;
}

interface ByEvent {
  [key: string]: Spectateur[];
}

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

const eventLabels: Record<string, string> = {};
EVENTS.forEach((e) => {
  eventLabels[e.id] = `${e.title} – ${e.date} ${e.time}`;
});
eventLabels['__sans_creneau__'] = 'Sans créneau';

const eventOrder = EVENTS.map((e) => e.id);

const AdminSpectateurs = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState<string | null>(() =>
    sessionStorage.getItem(STORAGE_KEY)
  );
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [byEvent, setByEvent] = useState<ByEvent>({});
  const [spectateurs, setSpectateurs] = useState<Spectateur[]>([]);
  const [selected, setSelected] = useState<Spectateur | null>(null);

  const fetchSpectateurs = useCallback(async (pwd: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin-spectateurs`, {
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
        setError('Erreur lors du chargement des spectateurs.');
        return;
      }
      const data = await res.json();
      setByEvent(data.byEvent ?? {});
      setSpectateurs(data.spectateurs ?? []);
      setAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY, pwd);
      setStoredPassword(pwd);
    } catch {
      setError('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (storedPassword && !authenticated && !loading) {
      fetchSpectateurs(storedPassword);
    }
  }, [storedPassword, authenticated, loading, fetchSpectateurs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    fetchSpectateurs(password.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setStoredPassword(null);
    setAuthenticated(false);
    setByEvent({});
    setSpectateurs([]);
    setPassword('');
    setError(null);
  };

  const allEventKeys = [
    ...eventOrder,
    '__sans_creneau__',
    ...Object.keys(byEvent).filter((k) => !eventOrder.includes(k) && k !== '__sans_creneau__'),
  ];

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
              <h1 className="text-2xl font-bold">Admin – Spectateurs</h1>
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
              {error && <p className="text-sm text-destructive">{error}</p>}
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
                Spectateurs inscrits
                <span className="ml-2 text-base font-normal text-muted-foreground">({spectateurs.length} total)</span>
              </h1>
              <div className="flex flex-wrap gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin')}
                >
                  Challengers
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => storedPassword && fetchSpectateurs(storedPassword)}
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

            {loading && spectateurs.length === 0 ? (
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
                        <span className="text-sm text-muted-foreground">
                          {list.length} spectateur{list.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        {list.length === 0 ? (
                          <p className="p-4 text-sm text-muted-foreground">Aucun spectateur.</p>
                        ) : (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border bg-muted/30">
                                <th className="text-left p-3 font-medium">Nom</th>
                                <th className="text-left p-3 font-medium">Prénom</th>
                                <th className="text-left p-3 font-medium hidden sm:table-cell">Email</th>
                                <th className="text-left p-3 font-medium hidden md:table-cell">Téléphone</th>
                                <th className="text-left p-3 font-medium">Inscription</th>
                              </tr>
                            </thead>
                            <tbody>
                              {list.map((s) => (
                                <tr
                                  key={s.id}
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => setSelected(s)}
                                  onKeyDown={(e) => e.key === 'Enter' && setSelected(s)}
                                  className="border-b border-border/50 hover:bg-muted/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
                                >
                                  <td className="p-3 font-medium">{s.last_name}</td>
                                  <td className="p-3">{s.first_name}</td>
                                  <td className="p-3 hidden sm:table-cell">{s.email}</td>
                                  <td className="p-3 hidden md:table-cell">{s.phone}</td>
                                  <td className="p-3 text-muted-foreground">
                                    {s.registered_at
                                      ? new Date(s.registered_at).toLocaleDateString('fr-FR', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })
                                      : '–'}
                                  </td>
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

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Détails du spectateur</DialogTitle>
                  <DialogDescription className="sr-only">Informations complètes du spectateur inscrit</DialogDescription>
                </DialogHeader>
                {selected && (
                  <div className="grid gap-3 text-sm">
                    <DetailRow label="Prénom" value={selected.first_name} />
                    <DetailRow label="Nom" value={selected.last_name} />
                    <DetailRow label="Email" value={selected.email} />
                    <DetailRow label="Téléphone" value={selected.phone} />
                    <DetailRow label="Créneau" value={eventLabels[selected.event_id ?? '__sans_creneau__'] ?? selected.event_id ?? 'Non assigné'} />
                    <DetailRow label="Inscription" value={formatDate(selected.registered_at)} />
                    <DetailRow label="Créé le" value={formatDate(selected.created_at)} />
                    <DetailRow label="ID" value={selected.id} className="font-mono text-xs break-all" />
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

function DetailRow({ label, value, className }: { label: string; value: string | undefined; className?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className={className}>{value ?? '–'}</span>
    </div>
  );
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '–';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default AdminSpectateurs;
