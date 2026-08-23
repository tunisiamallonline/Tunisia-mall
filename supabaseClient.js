import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sxajasczwurlchyluf.supabase.co'
const supabaseAnonKey = 'Sb_publishable_FbKKHDuGIz_21743WXFYbg_BVhd6jvk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
