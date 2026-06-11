import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf-8');

const regex = /<table className="w-full text-left border-collapse">(.|\n)*?<td className="px-6 py-4 whitespace-nowrap text-right"/;

const rep = `<table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/80 border-b-2 border-slate-100">
                   <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Photo & Name</th>
                   <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Parents Info</th>
                   <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Class Info</th>
                   <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Credentials</th>
                   <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {paginatedStudents.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium italic italic">No students found matching your criteria.</td>
                   </tr>
                 ) : (
                   paginatedStudents.map(s => (
                     <React.Fragment key={s.id}>
                       <tr className={\`hover:bg-indigo-50/30 transition-colors group cursor-pointer \${expandedId === s.id ? 'bg-indigo-50/40' : ''}\`} onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}>
                         <td className="px-4 py-3 whitespace-nowrap">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 ring-2 ring-indigo-50 overflow-hidden">
                               {s.photo_url ? (
                                 <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover" />
                               ) : (
                                 s.name.charAt(0)
                               )}
                             </div>
                             <div className="flex flex-col">
                               <span className="font-extrabold text-slate-800 text-sm whitespace-normal max-w-[160px]">{s.name}</span>
                               {s.name_bn && <span className="font-sans text-[11px] text-slate-500">{s.name_bn}</span>}
                               <span className="text-[10px] text-slate-400 mt-0.5">DOB: <strong className="text-slate-600">{s.dob || 'N/A'}</strong></span>
                             </div>
                           </div>
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap">
                           <div className="flex flex-col gap-1 text-[11px] font-medium">
                             <div className="flex items-center gap-1.5"><span className="text-slate-400 w-4 font-bold">F:</span><span className="text-slate-700 whitespace-normal max-w-[150px]">{s.father_name || 'N/A'}</span></div>
                             <div className="flex items-center gap-1.5"><span className="text-slate-400 w-4 font-bold">M:</span><span className="text-slate-700 whitespace-normal max-w-[150px]">{s.mother_name || 'N/A'}</span></div>
                           </div>
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap">
                           <div className="flex flex-col gap-1.5 min-w-[100px]">
                              <span className="bg-indigo-50 text-indigo-700 text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border border-indigo-100 italic w-max">
                                {s.studentClass}
                              </span>
                              <div className="flex gap-2 text-[10px] text-slate-500 font-bold max-w-[120px] whitespace-normal">
                                <span>Roll: {s.roll || 'N/A'}</span>
                                <span className={s.section && s.section !== 'N/A' ? '' : 'hidden'}>Div: {s.section}</span>
                                <span className={s.study_group && s.study_group !== 'N/A' ? '' : 'hidden'}>Grp: {s.study_group}</span>
                              </div>
                           </div>
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap">
                           <div className="flex flex-col gap-1.5 items-start">
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400 font-bold hidden xl:inline">ID:</span>
                                <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold text-[10px] ring-1 ring-slate-200">{s.studentId}</code>
                                <button onClick={(e) => { e.stopPropagation(); handleCopy(s.studentId, \`id-\${s.id}\`); }} className="text-slate-300 hover:text-indigo-600 transition-colors">
                                  {copiedField === \`id-\${s.id}\` ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                                </button>
                             </div>
                             <div className="flex items-center gap-2">
                               <span className="text-[10px] text-slate-400 font-bold hidden xl:inline">PW:</span>
                               <code className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded font-bold text-[10px] ring-1 ring-orange-100">{s.password}</code>
                               <button onClick={(e) => { e.stopPropagation(); handleCopy(s.password, \`pw-\${s.id}\`); }} className="text-slate-300 hover:text-orange-600 transition-colors">
                                  {copiedField === \`pw-\${s.id}\` ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                               </button>
                             </div>
                           </div>
                         </td>
                         <td className="px-4 py-3 whitespace-nowrap text-right"`;

content = content.replace(regex, rep);
fs.writeFileSync('src/pages/AdminPanel.tsx', content, 'utf-8');
console.log("Updated!");
