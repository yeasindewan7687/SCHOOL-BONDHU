import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mawewinuluacryowgbdu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hd2V3aW51bHVhY3J5b3dnYmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODE4ODYsImV4cCI6MjA5MzE1Nzg4Nn0.q0ymElGUpbjPqJNGYme_suBADgfgPxTxXowrJkRQL_M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBuckets() {
  console.log('Attempting to create bucket "school_files"...');
  const { data: createData, error: createError } = await supabase.storage.createBucket('school_files', {
    public: true,
    fileSizeLimit: 52428800, // 50MB
  });

  if (createError) {
    console.error('Error creating bucket:', createError);
  } else {
    console.log('Bucket created successfully:', createData);
  }

  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error listing buckets:', error);
    return;
  }
  console.log('Buckets found after creation attempt:', data.map(b => b.name));
}

checkBuckets();
