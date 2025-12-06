import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yrazkccgcfurdjhjpyhv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyYXprY2NnY2Z1cmRqaGpweWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2Mzg4MDcsImV4cCI6MjA4MDIxNDgwN30.Y9shPtv1FNiV0LAcUcoeVU-iq-OfTnoSsZk2_6DTVQA'

export const supabase = createClient(supabaseUrl, supabaseKey)
