import { supabase } from './src/lib/supabase.ts';
async function test() {
   const { data, error } = await supabase.from('students').insert([{
       name: "Test Name",
       studentId: "999999",
       password: "test",
       studentClass: "Class Play"
   }]);
   console.log(data, error);
}
test();
