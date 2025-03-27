import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://jhslrmopxyxpslxhjvsn.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impoc2xybW9weHl4cHNseGhqdnNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NDA5MzMsImV4cCI6MjA1ODExNjkzM30.bXV-nl6nukCBNZLxIXbYJhAZ0nHrVoC0GT-VFXku7_g"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

