/**
 * TEACHING NOTE: Supabase Client
 * 
 * This file creates a connection to your Supabase database.
 * Think of it like a phone line between your React app and the database.
 * 
 * The client uses:
 * - URL: Where your database lives (like a phone number)
 * - Anon Key: Permission to make calls (like a password, but safe to expose in browser)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single instance of the Supabase client
// We'll import this in components that need to talk to the database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
