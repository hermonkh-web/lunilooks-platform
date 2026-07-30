import { createClient } from '@supabase/supabase-js';

// Pastikan Anda menempatkan variabel ini di file .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase Environment Variables");
}

// Export client untuk digunakan di seluruh komponen Frontend (React)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);