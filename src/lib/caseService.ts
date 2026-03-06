import { supabase } from '@/lib/supabase';

export type Suspect = {
  id: string;
  name: string;
  role?: string | null;
  image?: string | null;
  profile?: string | null;
  case_id?: string | null;
  occupation?: string | null;
  age?: number | null;
  background?: string | null;
  motive?: string | null;
  alibi?: string | null;
  relationship?: string | null;
  [key: string]: any;
};

export type Evidence = {
  id: string;
  name?: string | null;
  description?: string | null;
  image_url?: string | null;
  forensic_note?: string | null;
  discovered_at?: string | null;
  case_id?: string | null;
  contradicts_suspect_id?: string | null;
  category?: string | null;
  collectedAt?: string | null;
  location?: string | null;
  detailedDescription?: string | null;
  [key: string]: any;
};

// --- NEW TIMELINE TYPE ---
export type TimelineEvent = {
  id: string;
  case_id: string;
  event_time: string;
  description: string;
  event_type: 'incident' | 'discovery' | 'sighting' | 'forensic';
  created_at?: string;
};

export type Case = {
  id: string;
  title: string;
  summary?: string | null;
  victim_name?: string | null;
  victim_occupation?: string | null;
  victim_tod?: string | null;
  victim_image?: string | null;
  victim_profile?: string | null;
  scene_location?: string | null;
  scene_description?: string | null;
  scene_image?: string | null;
  solution_guilty_id?: string | null;
  solution_explanation?: string | null;
  created_at?: string | null;
  year?: string | number | null;
  suspects?: Suspect[];
  evidence?: Evidence[];
  timeline?: TimelineEvent[]; // Added timeline to the Case model
  [key: string]: any;
};

/**
 * Fetches all cases from Supabase.
 */
export async function fetchCases(): Promise<Case[]> {
  const { data, error } = await supabase
    .from('cases')
    .select(`
      *,
      suspects!fk_case (*),
      evidence!fk_case_evidence (*),
      timeline (*) 
    `)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching cases:', error);
    throw error;
  }

  return (data ?? []) as Case[];
}

/**
 * Fetches a single case by ID with full relations.
 */
export async function fetchCaseById(id: string): Promise<Case | null> {
  const { data, error } = await supabase
    .from('cases')
    .select(`
      *,
      suspects!fk_case (*),
      evidence!fk_case_evidence (*),
      timeline (*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching case ${id}:`, error);
    throw error;
  }

  return (data ?? null) as Case | null;
}

// --- NEW TIMELINE FETCH FUNCTION ---
/**
 * Fetches the chronological log for a specific case.
 */
export async function fetchTimelineByCase(caseId: string): Promise<TimelineEvent[]> {
  const { data, error } = await supabase
    .from('timeline')
    .select('*')
    .eq('case_id', caseId)
    .order('event_time', { ascending: false });

  if (error) {
    console.error(`Error fetching timeline for case ${caseId}:`, error);
    throw error;
  }

  return (data ?? []) as TimelineEvent[];
}

/**
 * Fetches suspects for a specific case ID.
 */
export async function fetchSuspectsByCase(caseId: string): Promise<Suspect[]> {
  const { data, error } = await supabase
    .from('suspects')
    .select('*')
    .eq('case_id', caseId);

  if (error) {
    console.error(`Error fetching suspects for case ${caseId}:`, error);
    throw error;
  }

  return (data ?? []) as Suspect[];
}

/**
 * Fetches evidence for a specific case ID.
 */
export async function fetchEvidenceByCase(caseId: string): Promise<Evidence[]> {
  const { data, error } = await supabase
    .from('evidence')
    .select('*')
    .eq('case_id', caseId);

  if (error) {
    console.error(`Error fetching evidence for case ${caseId}:`, error);
    throw error;
  }

  return (data ?? []) as Evidence[];
}

/**
 * Update victim image URL in a case.
 */
export async function updateVictimImage(caseId: string, imageUrl: string): Promise<void> {
  const { error } = await supabase
    .from('cases')
    .update({ victim_image: imageUrl })
    .eq('id', caseId);

  if (error) {
    console.error(`Error updating victim image for case ${caseId}:`, error);
    throw error;
  }
}

/**
 * Update scene image URL in a case.
 */
export async function updateSceneImage(caseId: string, imageUrl: string): Promise<void> {
  const { error } = await supabase
    .from('cases')
    .update({ scene_image: imageUrl })
    .eq('id', caseId);

  if (error) {
    console.error(`Error updating scene image for case ${caseId}:`, error);
    throw error;
  }
}

/**
 * Update suspect image.
 */
export async function updateSuspectImage(suspectId: string, imageUrl: string): Promise<void> {
  const { error } = await supabase
    .from('suspects')
    .update({ image: imageUrl })
    .eq('id', suspectId);

  if (error) {
    console.error(`Error updating suspect image for suspect ${suspectId}:`, error);
    throw error;
  }
}

/**
 * Update evidence image.
 */
export async function updateEvidenceImage(evidenceId: string, imageUrl: string): Promise<void> {
  const { error } = await supabase
    .from('evidence')
    .update({ image_url: imageUrl })
    .eq('id', evidenceId);

  if (error) {
    console.error(`Error updating evidence image for evidence ${evidenceId}:`, error);
    throw error;
  }
}