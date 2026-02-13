import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://xybvntejftsnbzsjwqal.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5YnZudGVqZnRzbmJ6c2p3cWFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDUwNDIsImV4cCI6MjA4NDMyMTA0Mn0.0mzi4V_73L0hE87LZChonoUjQGxHZ2598fBic8HGqoM"

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
