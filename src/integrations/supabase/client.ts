
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://guhyokyledhnsvfurpqp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1aHlva3lsZWRobnN2ZnVycHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjQ5NjIsImV4cCI6MjA2MzM0MDk2Mn0.1_bUdC7QVzwdhmEvafQ9hbeTwWVsw3MZN56kHzqPK18";


export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);