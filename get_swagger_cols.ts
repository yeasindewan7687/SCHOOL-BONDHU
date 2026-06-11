import fs from 'fs';

const url = 'https://mawewinuluacryowgbdu.supabase.co/rest/v1/';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hd2V3aW51bHVhY3J5b3dnYmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODE4ODYsImV4cCI6MjA5MzE1Nzg4Nn0.q0ymElGUpbjPqJNGYme_suBADgfgPxTxXowrJkRQL_M';

async function getCols() {
  const res = await fetch(url, { headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` } });
  const data = await res.json();
  const studentsDef = data.definitions?.students || data.components?.schemas?.students;
  if (studentsDef) {
      console.log("Columns for students:", Object.keys(studentsDef.properties));
  } else {
      console.log("All definitions:", Object.keys(data.definitions || {}));
  }
}

getCols().catch(console.error);
