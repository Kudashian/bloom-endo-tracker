/**
 * TEACHING NOTE: TypeScript Types
 * 
 * TypeScript is JavaScript + type checking.
 * These types define the "shape" of our data.
 * 
 * Benefits:
 * - Autocomplete in your editor (knows what fields exist)
 * - Catches errors early (can't accidentally use wrong field name)
 * - Self-documenting (other devs know what data looks like)
 */

export interface SymptomEntry {
  id?: string;  // UUID from database (optional because new entries don't have it yet)
  user_id?: string;
  created_at?: string;
  entry_date: string;  // "2025-02-17"
  
  // Symptom scores (1-10)
  pain_level: number;
  fatigue_level: number;
  bloating_level: number;
  mood_level: number;
  nausea_level: number;
  
  // Other tracking
  bleeding_level: 'none' | 'spotting' | 'light' | 'moderate' | 'heavy';
  triggers: string[];
  notes: string;
}

// What we send to Supabase when creating an entry (excludes auto-generated fields)
export type NewSymptomEntry = Omit<SymptomEntry, 'id' | 'user_id' | 'created_at'>;
