import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dnhkdloztlrhsxisbwbs.supabase.co'
const supabaseKey = 'sb_publishable_25MLRb11MWbpVs87KChnYA_rMXc_BI0'

export const supabase = createClient(supabaseUrl, supabaseKey)
