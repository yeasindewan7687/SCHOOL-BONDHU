import { supabase } from './src/lib/supabase';

async function main() {
    let { data: d } = await supabase.from('results').select('*').limit(1);
    console.log(d);
    if(d && d.length > 0) {
        const anyKey = Object.keys(d[0])[0];
        console.log("using key:", anyKey);
        const { error: e3 } = await supabase.from('results').delete().neq(anyKey, 'impossible_value_123');
        if (e3) {
             const val = d[0][anyKey];
             await supabase.from('results').delete().eq(anyKey, val); // dummy delete? no, delete all. it needs a valid where clause
             await supabase.from('results').delete().not(anyKey, 'is', null);
        }
    }
}
main();
