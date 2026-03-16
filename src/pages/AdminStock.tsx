import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogOut, RefreshCw, Package, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'admin_password';
const API_BASE = import.meta.env.VITE_API_BASE ?? '';

const JERSEY_OPTIONS = [
  { id: 'black-night', label: 'Black Night', src: '/atmos-uploads/black-night.webp' },
  { id: 'white-sky', label: 'White Sky', src: '/atmos-uploads/white-sky.webp' },
  { id: 'yellow-thunder', label: 'Yellow Thunder', src: '/atmos-uploads/yellow-thunder.png' },
];

const JERSEY_SIZES = ['S', 'M', 'L', 'XL'];

type StockData = Record<string, Record<string, number>>;

const AdminStock = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState<string | null>(() =>
    sessionStorage.getItem(STORAGE_KEY)
  );
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stock, setStock] = useState<StockData>({});
  const [saving, setSaving] = useState<string | null>(null);

  const fetchStock = useCallback(async (pwd: string) => {
    setLoading(true);
    setError(null);
    try {
      // Verify password via existing admin endpoint
      const verify = await fetch(`${API_BASE}/api/admin-participants`, {
        headers: { 'Admin-Password': pwd },
      });
      if (verify.status === 401) {
        sessionStorage.removeItem(STORAGE_KEY);
        setStoredPassword(null);
        setAuthenticated(false);
        setError('Mot de passe incorrect.');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/api/jersey-stock`);
      const data = await res.json();
      setStock(data.stock ?? {});
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
      fetchStock(storedPassword);
    }
  }, [storedPassword, authenticated, loading, fetchStock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    fetchStock(password.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setStoredPassword(null);
    setAuthenticated(false);
    setStock({});
    setPassword('');
    setError(null);
  };

  const handleStockChange = async (jerseyId: string, size: string, newStock: number) => {
    if (newStock < 0) return;
    const key = `${jerseyId}-${size}`;
    setSaving(key);

    // Optimistic update
    setStock((prev) => ({
      ...prev,
      [jerseyId]: { ...(prev[jerseyId] ?? {}), [size]: newStock },
    }));

    try {
      await fetch(`${API_BASE}/api/jersey-stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Password': storedPassword!,
        },
        body: JSON.stringify({ jersey_id: jerseyId, size, stock: newStock }),
      });
    } catch (err) {
      console.error('Network error updating stock:', err);
    } finally {
      setSaving(null);
    }
  };

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
              <h1 className="text-2xl font-bold">Admin – Stock Maillots</h1>
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
                <Package className="h-7 w-7" />
                Gestion du stock maillots
              </h1>
              <div className="flex flex-wrap gap-2 items-center">
                <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                  <Users className="h-4 w-4" />
                  Participants
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => storedPassword && fetchStock(storedPassword)}
                  disabled={loading}
                >
                  <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
                  Actualiser
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {JERSEY_OPTIONS.map((jersey) => (
                <div key={jersey.id} className="border border-border rounded-lg overflow-hidden bg-card">
                  <div className="h-48 bg-muted overflow-hidden">
                    <img
                      src={jersey.src}
                      alt={jersey.label}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-4">{jersey.label}</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {JERSEY_SIZES.map((size) => {
                        const currentStock = stock[jersey.id]?.[size] ?? 0;
                        const key = `${jersey.id}-${size}`;
                        const isSaving = saving === key;
                        const isSoldOut = currentStock === 0;

                        return (
                          <div key={size} className="flex flex-col items-center gap-1">
                            <span className="text-xs font-semibold text-muted-foreground">{size}</span>
                            <div
                              className={cn(
                                'flex flex-col items-center gap-1 p-2 rounded-lg border w-full',
                                isSoldOut
                                  ? 'border-red-500/40 bg-red-500/10'
                                  : 'border-border bg-background/50'
                              )}
                            >
                              <button
                                type="button"
                                onClick={() => handleStockChange(jersey.id, size, currentStock + 1)}
                                disabled={isSaving}
                                className="text-base font-bold text-muted-foreground hover:text-foreground w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors disabled:opacity-30"
                              >
                                +
                              </button>
                              <span
                                className={cn(
                                  'text-xl font-bold w-full text-center',
                                  isSoldOut ? 'text-red-500' : 'text-foreground'
                                )}
                              >
                                {isSaving ? '…' : currentStock}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleStockChange(jersey.id, size, currentStock - 1)}
                                disabled={isSaving || isSoldOut}
                                className="text-base font-bold text-muted-foreground hover:text-foreground w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                −
                              </button>
                            </div>
                            {isSoldOut && (
                              <span className="text-[9px] font-bold text-red-500 uppercase text-center leading-tight">
                                Sold out
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              Les tailles avec un stock de 0 apparaissent comme "Sold out" dans le formulaire d'inscription et ne peuvent pas être sélectionnées.
              Un stock non configuré (première utilisation) équivaut à disponible.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminStock;
