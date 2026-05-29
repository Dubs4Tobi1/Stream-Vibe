import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fdnrevuoclhjuwqtjdbc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkbnJldnVvY2xoanV3cXRqZGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwODAyMzgsImV4cCI6MjA5NTY1NjIzOH0.cvEF6gGnSxJiGJpuuWt4RaxbySHza6CdhFTx6O3cAc0';

export const supabase = createClient(supabaseUrl, supabaseKey);