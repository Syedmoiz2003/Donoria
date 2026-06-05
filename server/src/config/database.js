import { createClient } from '@supabase/supabase-js';
// Import config to ensure dotenv is loaded with the correct .env path
import '../config/index.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
