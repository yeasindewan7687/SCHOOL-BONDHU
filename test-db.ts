import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Load env variables if available

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const ids = [
    "293", "296", "297", "299", "300", "301", "302", "305", "309", "311", "313", "315", 
    "473", "499", "295", "298", "303", "307", "418", "586", "611", "641", "651", "671", 
    "698", "844", "857", "858"
  ];
  const { data, error } = await supabase.from('students').select('*').in('studentId', ids);
  if (error) console.error("Error:", error);
  else console.log(data);
}
run();
