import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mawewinuluacryowgbdu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hd2V3aW51bHVhY3J5b3dnYmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODE4ODYsImV4cCI6MjA5MzE1Nzg4Nn0.q0ymElGUpbjPqJNGYme_suBADgfgPxTxXowrJkRQL_M";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  console.log("Checking fee_payments table SELECT...");
  const { data, error } = await supabase.from("fee_payments").select("*");
  if (error) {
    console.error("SELECT Error:", error);
  } else {
    console.log("SELECT Successful. Found rows:", data.length);
    console.log("Rows:", data);
  }

  console.log("\nChecking security policies or structure if possible...");
  // Let's try to insert a test record to check if insertion fails or succeeds
  const testTrx = "TEST-" + Math.floor(Math.random() * 1000000);
  console.log("Inserting test payment trx_id:", testTrx);
  const { error: insertError } = await supabase.from("fee_payments").insert([
    {
      student_id: "SID-TEST",
      class_name: "Play",
      amount: 100,
      fee_type: "Test Fee",
      method: "ZiniPay (Test)",
      trx_id: testTrx
    }
  ]);

  if (insertError) {
    console.error("INSERT Error:", insertError);
  } else {
    console.log("INSERT Successful! Row created.");
    // Try to delete the test row
    const { error: deleteError } = await supabase.from("fee_payments").delete().eq("trx_id", testTrx);
    if (deleteError) {
      console.error("DELETE Error (Clean-up):", deleteError);
    } else {
      console.log("DELETE Clean-up Successful.");
    }
  }
}

check();
