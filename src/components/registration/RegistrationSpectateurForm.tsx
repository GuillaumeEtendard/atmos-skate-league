import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEventSlot } from '@/contexts/EventSlotContext';
import { useToast } from '@/hooks/use-toast';

const RegistrationSpectateurForm = () => {
  const navigate = useNavigate();
  const { selectedSlot } = useEventSlot();
  const { toast } = useToast();

  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/register-spectateur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          event_id: selectedSlot?.id || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      navigate('/confirmation-spectateur', {
        state: {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
        },
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="first_name" className="block text-sm font-medium text-foreground">
            Prénom <span className="text-racing-yellow">*</span>
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            value={form.first_name}
            onChange={handleChange}
            placeholder="Jean"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-racing-yellow/50 focus:outline-none focus:ring-1 focus:ring-racing-yellow/50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="last_name" className="block text-sm font-medium text-foreground">
            Nom <span className="text-racing-yellow">*</span>
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            value={form.last_name}
            onChange={handleChange}
            placeholder="Dupont"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-racing-yellow/50 focus:outline-none focus:ring-1 focus:ring-racing-yellow/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email <span className="text-racing-yellow">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="jean.dupont@email.com"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-racing-yellow/50 focus:outline-none focus:ring-1 focus:ring-racing-yellow/50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-foreground">
          Téléphone <span className="text-racing-yellow">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          value={form.phone}
          onChange={handleChange}
          placeholder="06 12 34 56 78"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-racing-yellow/50 focus:outline-none focus:ring-1 focus:ring-racing-yellow/50"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-racing-yellow text-black font-bold uppercase tracking-wider hover:bg-racing-yellow/90 disabled:opacity-50"
      >
        {loading ? 'Inscription en cours...' : 'Confirmer mon inscription'}
      </Button>
    </form>
  );
};

export default RegistrationSpectateurForm;
