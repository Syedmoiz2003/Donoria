import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vrzbvxaddcnzdxmpsggt.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyemJ2eGFkZGNuemR4bXBzZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MTMyMDQsImV4cCI6MjA5MTk4OTIwNH0.vaUrjQALWwihITjfyqgLF2IJNrOCjTFcLCdmKWWI3j8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const User = null; // Type removed, will be inferred from Supabase
