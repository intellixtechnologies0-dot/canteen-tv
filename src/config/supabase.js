import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://znqhoohjugyblgwepovp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpucWhvb2hqdWd5Ymxnd2Vwb3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0OTk0OTAsImV4cCI6MjA3MDA3NTQ5MH0.dEWUpJtDbzLKRv9UtxpJLEmSMT6M_QChI3eu8EjO3dY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
