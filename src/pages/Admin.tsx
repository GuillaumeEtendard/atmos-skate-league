import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { EVENTS } from '@/data/events';
import { Lock, LogOut, Mail, Package, RefreshCw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const STORAGE_KEY = 'admin_password';

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_id: string | null;
  jersey: string | null;
  jersey_size: string | null;
  age_category?: string | null;
  status: string;
  registered_at: string;
  amount: number;
  currency?: string | null;
  payment_status?: string | null;
  payment_intent_id?: string | null;
  confirmation_email_sent?: boolean;
  confirmation_email_sent_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
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
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [sendEmailsLoading, setSendEmailsLoading] = useState(false);
  const [sendEmailsMessage, setSendEmailsMessage] = useState<string | null>(null);

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

  const handleSendConfirmationEmails = async () => {
    if (!storedPassword) return;
    setSendEmailsLoading(true);
    setSendEmailsMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/send-confirmation-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Password': storedPassword,
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.status === 401) {
        setSendEmailsMessage('Non autorisé.');
        return;
      }
      if (!res.ok) {
        setSendEmailsMessage(data.error || 'Erreur lors de l\'envoi.');
        return;
      }
      setSendEmailsMessage(data.message || `Envoyé: ${data.sent}, Échecs: ${data.failed}.`);
      if (data.sent > 0 && storedPassword) {
        fetchParticipants(storedPassword);
      }
    } catch {
      setSendEmailsMessage('Erreur réseau.');
    } finally {
      setSendEmailsLoading(false);
    }
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
              <div className="flex flex-wrap gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin-spectateurs')}
                >
                  <Users className="h-4 w-4" />
                  Spectateurs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin-stock')}
                >
                  <Package className="h-4 w-4" />
                  Stock maillots
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendConfirmationEmails}
                  disabled={sendEmailsLoading || loading}
                  title="Envoyer l'email de confirmation à tous ceux qui ne l'ont pas reçu"
                >
                  <Mail className={sendEmailsLoading ? 'animate-pulse h-4 w-4' : 'h-4 w-4'} />
                  {sendEmailsLoading ? 'Envoi…' : 'Emails manquants'}
                </Button>
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
            {sendEmailsMessage && (
              <p className="text-sm text-muted-foreground mb-4 px-1">{sendEmailsMessage}</p>
            )}

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
                        <div className="flex items-center gap-3 text-sm">
                          {list.length > 0 && (() => {
                            const payants = list.filter((p) => p.payment_status === 'succeeded').length;
                            const gratuits = list.filter((p) => p.payment_status === 'free').length;
                            return (
                              <>
                                {payants > 0 && <span className="text-green-400">{payants} payant{payants !== 1 ? 's' : ''}</span>}
                                {gratuits > 0 && <span className="text-blue-400">{gratuits} gratuit{gratuits !== 1 ? 's' : ''}</span>}
                                <span className="text-muted-foreground">{list.length} total</span>
                              </>
                            );
                          })()}
                          {list.length === 0 && <span className="text-muted-foreground">0 participant</span>}
                        </div>
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
                                <th className="text-right p-3 font-medium">Paiement</th>
                              </tr>
                            </thead>
                            <tbody>
                              {list.map((p) => {
                                const isFree = p.payment_status === 'free';
                                return (
                                <tr
                                  key={p.id}
                                  role="button"
                                  tabIndex={0}
                                  onClick={() => setSelectedParticipant(p)}
                                  onKeyDown={(e) => e.key === 'Enter' && setSelectedParticipant(p)}
                                  className={`border-b border-border/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset ${isFree ? 'bg-blue-950/20 hover:bg-blue-950/30' : 'hover:bg-muted/30'}`}
                                >
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
                                  <td className="p-3 text-right">
                                    {isFree ? (
                                      <span className="inline-flex items-center rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/30">
                                        Gratuit
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-400 border border-green-500/30">
                                        {p.amount != null ? `${p.amount} €` : 'Payé'}
                                      </span>
                                    )}
                                  </td>
                                </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}

            <Dialog open={!!selectedParticipant} onOpenChange={(open) => !open && setSelectedParticipant(null)}>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Détails du participant</DialogTitle>
                  <DialogDescription className="sr-only">Informations complètes du participant inscrit</DialogDescription>
                </DialogHeader>
                {selectedParticipant && (
                  <div className="grid gap-3 text-sm">
                    <DetailRow label="Nom" value={selectedParticipant.name} />
                    <DetailRow label="Email" value={selectedParticipant.email} />
                    <DetailRow label="Téléphone" value={selectedParticipant.phone} />
                    <DetailRow label="Créneau" value={eventLabels[selectedParticipant.event_id ?? '__sans_creneau__'] ?? selectedParticipant.event_id ?? 'Non assigné'} />
                    <DetailRow label="Maillot (modèle)" value={selectedParticipant.jersey ?? '–'} />
                    <DetailRow label="Taille maillot" value={selectedParticipant.jersey_size ?? '–'} />
                    <DetailRow label="Tranche d'âge" value={selectedParticipant.age_category ?? '–'} />
                    <DetailRow label="Statut" value={selectedParticipant.status} />
                    <DetailRow label="Inscription" value={formatDate(selectedParticipant.registered_at)} />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-muted-foreground font-medium">Type d'inscription</span>
                      {selectedParticipant.payment_status === 'free' ? (
                        <span className="inline-flex w-fit items-center rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/30">Gratuit (sans paiement)</span>
                      ) : (
                        <span className="inline-flex w-fit items-center rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-400 border border-green-500/30">Payant – {selectedParticipant.amount != null ? `${selectedParticipant.amount} €` : 'montant inconnu'}</span>
                      )}
                    </div>
                    <DetailRow label="Payment Intent (Stripe)" value={selectedParticipant.payment_status === 'free' ? '–' : (selectedParticipant.payment_intent_id ?? '–')} />
                    <DetailRow label="Email de confirmation envoyé" value={selectedParticipant.confirmation_email_sent ? 'Oui' : 'Non'} />
                    <DetailRow label="Date envoi confirmation" value={formatDate(selectedParticipant.confirmation_email_sent_at)} />
                    <DetailRow label="Créé le" value={formatDate(selectedParticipant.created_at)} />
                    <DetailRow label="Modifié le" value={formatDate(selectedParticipant.updated_at)} />
                    <DetailRow label="ID" value={selectedParticipant.id} className="font-mono text-xs break-all" />
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

export default Admin;
