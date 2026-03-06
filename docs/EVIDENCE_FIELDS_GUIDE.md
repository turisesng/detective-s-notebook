# Evidence Table Fields Guide

The app expects your Supabase `evidence` table to have the following columns to display properly labeled evidence cards. The current app has **fallbacks** for missing fields, but for full functionality, add these columns:

## Required Columns (for card labels)

| Column | Type | Example | Purpose |
|--------|------|---------|---------|
| `id` | UUID | `e1` | Unique identifier |
| `title` | TEXT | "Broken Venetian Vase" | Display name of evidence |
| `description` | TEXT | "Shattered vase found near desk" | Short description (shown on card) |
| `detailedDescription` | TEXT | "Blood traces and hair fibers were found..." | Long description (shown in modal) |
| `category` | ENUM | `physical`, `digital`, `testimonial`, `forensic` | Evidence type (affects icon) |
| `collectedAt` | TEXT | "Nov 14, 2024 — 11:52 PM" | Collection timestamp |
| `location` | TEXT | "Venetian Room" | Where evidence was found |
| `case_id` | UUID | `case-midnight-gallery` | FK to cases table |
| `image` | TEXT | URL | Optional evidence photo |
| `discovered_at` | TIMESTAMP | 2024-11-14 23:52:00 | Alternative timestamp field |

## Current Fallbacks (if columns missing)

If a column is missing, the app will use these defaults:

| Missing Field | Fallback Behavior |
|---------------|-------------------|
| `title` | Uses `Evidence {id_prefix}` |
| `category` | Defaults to `physical` (🔍 icon) |
| `collectedAt` | Uses `discovered_at` or "Date Unknown" |
| `location` | Shows "Location Unknown" |
| `detailedDescription` | Uses `description` or generic text |

## How to Add Missing Columns

### Via Supabase SQL Editor

```sql
-- Add title column
ALTER TABLE evidence ADD COLUMN title TEXT;

-- Add category column (enum)
ALTER TABLE evidence ADD COLUMN category TEXT CHECK (category IN ('physical', 'digital', 'testimonial', 'forensic'));

-- Add collectedAt column
ALTER TABLE evidence ADD COLUMN "collectedAt" TEXT;

-- Add location column
ALTER TABLE evidence ADD COLUMN location TEXT;

-- Add detailedDescription column
ALTER TABLE evidence ADD COLUMN "detailedDescription" TEXT;
```

### Sample Data Update

After adding columns, populate them:

```sql
-- Example for "The Heiress Dilemma" case
UPDATE evidence 
SET 
  title = 'Broken Venetian Vase',
  category = 'physical',
  "collectedAt" = 'Feb 25, 2026 — 2:30 PM',
  location = 'Master Bedroom',
  "detailedDescription" = 'A shattered blue vase with traces of an expensive perfume...'
WHERE id = 'e1' AND case_id = 'case-heiress-dilemma';
```

## Testing

After updating your Supabase schema:

1. Reload the browser at `http://localhost:8082/`
2. Select a case from the dropdown
3. You should see:
   - Evidence cards with **proper titles** (instead of "Evidence e1...")
   - **Category icons** (🔍 🗣️ 🧪 etc) matching the category
   - **Timestamps** in `collectedAt` format
   - **Locations** displayed in modals

## Notes

- The `detailedDescription` field can contain HTML formatting
- Category enum prevents invalid values
- If you only have descriptions now, copy them to `collectedAt` temporarily until you add proper timestamps
