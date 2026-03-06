# Supabase integration

Quick steps to add Supabase to this Vite + React project.

- Install dependency:

```bash
npm install @supabase/supabase-js
```

- Add environment variables: copy `.env.example` to `.env.local` (or `.env`) and set your keys:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
```

- The client is in `src/lib/supabase.ts` — it uses `import.meta.env.VITE_*` variables.

- Example usage (any React component):

```ts
import { supabase } from '../lib/supabase';

export async function fetchCases() {
  const { data, error } = await supabase.from('cases').select('*');
  if (error) throw error;
  return data;
}
```

- Notes:
  - Restart the dev server after adding env vars.
  - For auth flows, let me know if you want a simple sign-in UI or row-level security guidance.

## Relating suspects & evidence to cases

To keep your data consistent, every suspect and piece of evidence should reference the case it belongs to. Add a `case_id` foreign key column on the `suspects` and `evidence` tables and set up the relation using the Supabase dashboard or run:

```sql
alter table public.suspects add column case_id text references public.cases(id);
alter table public.evidence add column case_id text references public.cases(id);
```

Once the relation exists you can fetch cases with their related rows:

```ts
const { data } = await supabase
  .from('cases')
  .select('*, suspects(*), evidence(*)');
```

When inserting suspect or evidence records, always include the `case_id`:

```sql
insert into public.suspects (id, name, case_id) values ('suspect-1','Silas Vane','case-alchemist-breath');
insert into public.evidence (id, description, case_id) values ('ev-1','argon canister','case-alchemist-breath');
```

The project's `caseService` already exposes `suspects` and `evidence` arrays in its TypeScript types and fetch helpers; client components will handle those properties automatically when present.
