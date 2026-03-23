import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://drxumiwwiesjpbouboym.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyeHVtaXd3aWVzanBib3Vib3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5Mjg1MjgsImV4cCI6MjA4OTUwNDUyOH0._oyS2a8dDcrua8hF_BHtau1vqY7RbyxCw7TBvA8mByA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
