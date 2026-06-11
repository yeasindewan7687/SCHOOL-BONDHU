import fs from 'fs';
let content = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf-8');

const regex = /<h3 className="text-xl font-extrabold text-slate-800">Notice Board Preview<\/h3>(.|\n)*?<\/table>/;
const replacement = `<h3 className="text-xl font-extrabold text-slate-800">Notice Board Preview</h3>
           <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">{notices.length} active notices</span>
         </div>
         
         <div className="overflow-x-auto bg-white rounded-3xl border-2 border-slate-100 shadow-sm flex-grow">
            <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/80 border-b-2 border-slate-100">
                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Pin/Label</th>
                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {paginatedNotices.length === 0 ? (
                   <tr>
                     <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium italic">No notices found.</td>
                   </tr>
                 ) : (
                   paginatedNotices.map((n) => (
                     <tr key={n.id} className="hover:bg-indigo-50/30 transition-colors group">
                       <td className="px-6 py-4 whitespace-nowrap">
                         <span className="text-sm font-bold text-slate-700">{n.date}</span>
                       </td>
                       <td className="px-6 py-4">
                         <span className="font-extrabold text-slate-800 text-base">{n.title}</span>
                       </td>
                       <td className="px-6 py-4 hidden lg:table-cell">
                         <div className="flex gap-2 items-center">
                           {n.is_pinned && <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold text-[10px] uppercase">Pinned</span>}
                           {n.label && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold text-[10px] uppercase">{n.label}</span>}
                         </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-right">
                         <div className="flex items-center justify-end gap-2">
                           {(n.link || n.fileUrl) && (
                             <a href={n.link || n.fileUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-all" title="View Attachment">
                               <ExternalLink size={16} />
                             </a>
                           )}
                           <button onClick={() => handleEdit(n)} className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg group-hover:opacity-100 opacity-100 lg:opacity-0" title="Edit">
                              <Edit size={16} />
                           </button>
                           <button onClick={() => setDeleteModal({isOpen: true, id: n.id})} className="text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg group-hover:opacity-100 opacity-100 lg:opacity-0" title="Delete">
                              <Trash2 size={16}/>
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
            </table>`;
content = content.replace(regex, replacement);
fs.writeFileSync('src/pages/AdminPanel.tsx', content, 'utf-8');
console.log("Notices fixed!");
