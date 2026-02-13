# 🗄️ Configuration Supabase - Base de données des participants

Ce guide explique comment configurer Supabase pour stocker les inscriptions.

## ✅ Configuration terminée

Votre projet est maintenant configuré avec :
- ✅ Table `participants` créée
- ✅ API `/api/register-participant` connectée à Supabase
- ✅ Package `@supabase/supabase-js` installé
- ✅ Schéma SQL prêt à déployer

## 📝 Étapes de configuration

### 1. Accéder à votre projet Supabase

Votre projet : **hrughgshjjaewouqfpdo**
URL : https://supabase.com/dashboard/project/hrughgshjjaewouqfpdo

### 2. Créer la table participants

1. **Allez dans SQL Editor** dans le menu latéral
2. **Créez une nouvelle query**
3. **Copiez-collez** le contenu des fichiers suivants **dans l'ordre** :
   - `supabase/migrations/001_create_participants.sql`
   - `supabase/migrations/002_add_gender_field.sql`
   - `supabase/migrations/003_add_event_id_field.sql` (ajoute le créneau sélectionné)
   - `supabase/migrations/004_add_jersey_and_jersey_size.sql` (maillot + taille S, M, L, XL)
   - `supabase/migrations/005_remove_gender_column.sql` (supprime le champ sexe)
   - `supabase/migrations/006_add_status_column.sql` (statut inscription : success / canceled)
4. **Exécutez** chaque query (bouton "RUN" ou Ctrl/Cmd + Enter)

**Alternative** : si le projet est lié au CLI Supabase (`supabase link`), exécutez `supabase db push` pour appliquer toutes les migrations.

Les scripts vont créer :
- ✅ Table `participants` avec tous les champs nécessaires (nom, email, téléphone)
- ✅ Champ `event_id` pour stocker le créneau/événement sélectionné
- ✅ Champs `jersey` (black-night, white-sky, yellow-thunder) et `jersey_size` (S, M, L, XL)
- ✅ Pas de champ sexe/genre (supprimé par la migration 005)
- ✅ Champ `status` (success par défaut à l’inscription, canceled = annulé, non compté dans les places)
- ✅ Index pour optimiser les recherches
- ✅ Row Level Security (RLS) activé
- ✅ Politiques de sécurité
- ✅ Trigger pour `updated_at`

### 3. Récupérer vos clés API Supabase

1. **Allez dans Settings** > **API**
2. **Copiez ces valeurs** :
   - **Project URL** : `https://hrughgshjjaewouqfpdo.supabase.co`
   - **Publishable key** : Pour le frontend (pas utilisé pour l'instant)
   - **Secret key** : ⚠️ **SECRET** - Pour le backend (serveurs/API)

   ⚠️ **Note** : Utilisez les nouvelles clés "Publishable/Secret", pas les legacy "anon/service_role"

### 4. Configuration locale (.env)

Ajoutez ces variables à votre fichier `.env` :

```env
# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_votre_cle_ici
STRIPE_SECRET_KEY=sk_test_votre_cle_ici

# Supabase
SUPABASE_URL=https://hrughgshjjaewouqfpdo.supabase.co
SUPABASE_SECRET_KEY=votre_secret_key_ici
```

**⚠️ IMPORTANT** : La `secret` key permet un accès privilégié et bypass le RLS - ne JAMAIS l'exposer côté client !

### 5. Configuration sur Vercel

Dans le dashboard Vercel :
1. **Settings** > **Environment Variables**
2. **Ajoutez** :
   - `SUPABASE_URL` = `https://hrughgshjjaewouqfpdo.supabase.co`
   - `SUPABASE_SECRET_KEY` = votre clé secret (service role key)
3. **Redéployez** le projet

### 6. Tester l'inscription

1. **Lancez le projet** : `vercel dev` (en local) ou visitez votre site déployé
2. **Allez sur** `/inscription`
3. **Remplissez** le formulaire
4. **Payez** avec la carte de test : `4242 4242 4242 4242`
5. **Vérifiez** dans Supabase > Table Editor > participants

## 📊 Structure de la table participants

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Identifiant unique (auto-généré) |
| `name` | VARCHAR(255) | Nom complet du participant |
| `email` | VARCHAR(255) | Email du participant |
| `phone` | VARCHAR(50) | Numéro de téléphone |
| `event_id` | VARCHAR(100) | Créneau/événement sélectionné (optionnel) |
| `jersey` | VARCHAR(50) | Maillot (black-night, white-sky, yellow-thunder) |
| `jersey_size` | VARCHAR(5) | Taille (S, M, L, XL) |
| `status` | VARCHAR(20) | Statut : `success` (défaut) ou `canceled` (non compté) |
| `payment_intent_id` | VARCHAR(255) | ID Stripe (unique) |
| `amount` | DECIMAL(10,2) | Montant payé en euros |
| `currency` | VARCHAR(3) | Devise (eur) |
| `payment_status` | VARCHAR(50) | Statut du paiement |
| `registered_at` | TIMESTAMPTZ | Date d'inscription |
| `created_at` | TIMESTAMPTZ | Date de création |
| `updated_at` | TIMESTAMPTZ | Dernière modification |

## 🔍 Consulter les inscriptions

### Via Supabase Dashboard
1. **Table Editor** > **participants**
2. Vous pouvez voir, filtrer, et exporter les données

### Via SQL
```sql
-- Voir tous les participants
SELECT * FROM participants ORDER BY registered_at DESC;

-- Compter les inscriptions
SELECT COUNT(*) as total_participants FROM participants;

-- Voir les inscriptions du jour
SELECT * FROM participants
WHERE registered_at::date = CURRENT_DATE;
```

## 🔒 Sécurité (Row Level Security)

La table a le RLS activé avec ces politiques :

1. **Lecture publique** : Tout le monde peut lire (pour un dashboard public)
2. **Insertion restreinte** : Seulement via secret key (l'API backend)

### Modifier les politiques RLS

Si vous voulez restreindre la lecture :

```sql
-- Supprimer la politique actuelle
DROP POLICY "Enable read access for all users" ON participants;

-- Créer une nouvelle politique (lecture admin seulement)
CREATE POLICY "Enable read for authenticated users only" ON participants
  FOR SELECT
  USING (auth.role() = 'authenticated');
```

## 📧 Prochaines étapes

### 1. Emails de confirmation

Intégrer un service d'email (Resend recommandé) :

```bash
npm install resend
```

Puis dans `api/register-participant.ts` :

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Après l'insertion dans Supabase
await resend.emails.send({
  from: 'Atmos Skate League <noreply@votre-domaine.com>',
  to: email,
  subject: 'Confirmation d\'inscription - Atmos Skate League',
  html: `
    <h1>Bienvenue ${name} !</h1>
    <p>Ton inscription a été confirmée.</p>
    <p>Montant payé : ${amount}€</p>
  `,
});
```

### 2. Dashboard Admin

Créer une page `/admin/participants` pour voir les inscriptions :

```typescript
import { createClient } from '@supabase/supabase-js';

// Récupérer les participants
const { data: participants } = await supabase
  .from('participants')
  .select('*')
  .order('registered_at', { ascending: false });
```

### 3. Export Excel/CSV

Bouton d'export dans le dashboard :

```typescript
// Convertir en CSV
const csv = participants.map(p =>
  `${p.name},${p.email},${p.phone},${p.amount},${p.registered_at}`
).join('\n');

// Télécharger
const blob = new Blob([csv], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
```

## 🆘 Dépannage

### Erreur "relation participants does not exist"
→ La table n'a pas été créée. Exécutez le script SQL dans Supabase.

### Erreur "Invalid API credentials"
→ Vérifiez que `SUPABASE_SECRET_KEY` est correcte dans `.env` ou Vercel.

### Erreur "duplicate key value violates unique constraint"
→ Un participant a déjà été enregistré avec ce `payment_intent_id`.

### Les données ne s'affichent pas dans Table Editor
→ Vérifiez les politiques RLS. Utilisez l'onglet "Policies" pour les voir/modifier.

## 📚 Documentation

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Editor](https://supabase.com/docs/guides/database/overview)

---

✨ **Votre base de données Supabase est prête !** Les participants seront automatiquement enregistrés après paiement.
