import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xcpgmsnwnttlmsibjjjv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjcGdtc253bnR0bG1zaWJqamp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxODgzNDgsImV4cCI6MjA4NTc2NDM0OH0.i9e8yuUwUNtyBtd5lOSfUnBAtF5zEdqIVYHumqiCo-w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 