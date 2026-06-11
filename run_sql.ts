import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mawewinuluacryowgbdu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hd2V3aW51bHVhY3J5b3dnYmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODE4ODYsImV4cCI6MjA5MzE1Nzg4Nn0.q0ymElGUpbjPqJNGYme_suBADgfgPxTxXowrJkRQL_M';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    const { error: insertError } = await supabase.from('students').insert([{ 
        name: 'Test', 
        studentId: '9999', 
        studentClass: 'Play', 
        roll: '1', 
        name_bn: 'টেস্ট', 
        father_name: 'FTest', 
        mother_name: 'MTest', 
        dob: '', 
        study_group: '', 
        section: '', 
        photo_url: '' 
    }]);
    console.log("Insert Error:", insertError);
}
run();
