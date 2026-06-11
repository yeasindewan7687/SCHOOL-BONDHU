import fs from 'fs';
let content = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf-8');

// The start is the end of NoticesAdmin, the list preview...
const startStr = `<h3 className="text-xl font-extrabold text-slate-800">Notice Board Preview</h3>`;
const endStr = `                 {paginatedStudents.length === 0 ? (`

// We know the exact Notice Board Preview code we need to restore, and the exact StudentsAdmin code we need to restore.
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
            </table>
         </div>
         <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}

function StudentsAdmin() {
  const [students, setStudents] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sid, setSid] = useState("");
  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [fathersName, setFathersName] = useState("");
  const [mothersName, setMothersName] = useState("");
  const [dob, setDob] = useState("");
  const [roll, setRoll] = useState("");
  const [studyGroup, setStudyGroup] = useState("");
  const [section, setSection] = useState("");
  const [pw, setPw] = useState("");
  const [sClass, setSClass] = useState(CLASSES[0]);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [uiMessage, setUiMessage] = useState<{text: string, type: 'error' | 'success'} | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, id: number | null}>({isOpen: false, id: null});
  const [deleting, setDeleting] = useState(false);
  const [filterClass, setFilterClass] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [view, setView] = useState<'add' | 'list'>('add');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase.from('students').select('*').order('id', {ascending: false});
      if (error) {
        setUiMessage({ text: "Error loading students: " + error.message, type: "error" });
      } else {
        setStudents(data || []);
      }
    } catch (err: any) {
      setUiMessage({ text: "Network error: " + err.message, type: "error" });
    }
  }

  useEffect(() => { fetchStudents(); }, []);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };
  
  const downloadPDF = async (student: any) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text("Child Care High School - Student Record", 20, 20);
      
      doc.setFontSize(14);
      doc.text(\`Name: \${student.name || "N/A"}\`, 20, 40);
      doc.text(\`Student ID: \${student.studentId || "N/A"}\`, 20, 50);
      doc.text(\`Class: \${student.studentClass || "N/A"}\`, 20, 60);
      doc.text(\`Password: \${student.password || "N/A"}\`, 20, 70);
      
      const enrollDate = student.created_at ? new Date(student.created_at).toLocaleDateString() : "Not Available";
      doc.text(\`Enrolled Date: \${enrollDate}\`, 20, 80);
      
      doc.save(\`Student_\${student.studentId}.pdf\`);
    } catch(err) {
      console.error(err);
      setUiMessage({ text: "Error downloading PDF.", type: "error" });
    }
  }

  const handleEditClick = (s: any) => {
    setEditingId(s.id);
    setSid(s.studentId);
    setName(s.name);
    setNameBn(s.name_bn || "");
    setFathersName(s.father_name || "");
    setMothersName(s.mother_name || "");
    setDob(s.dob || "");
    setRoll(s.roll || "");
    setStudyGroup(s.study_group || "");
    setSection(s.section || "");
    setPw(s.password);
    setSClass(s.studentClass);
    setPhotoUrl(s.photo_url || "");
    setView('add');
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sid || !pw || !sClass) {
       setUiMessage({ text: "Name, ID, Password and Class are required.", type: "error" });
       return;
    }
    setAdding(true);

    try {
      if (editingId) {
        const { error } = await supabase.from('students').update({
          name, studentId: sid, password: pw, studentClass: sClass, photo_url: photoUrl,
          name_bn: nameBn, father_name: fathersName, mother_name: mothersName, dob: dob, roll: roll, study_group: studyGroup, section: section
        }).eq('id', editingId);
        if (error) throw error;
        setUiMessage({ text: "Student Data Updated!", type: "success" });
      } else {
         const { error } = await supabase.from('students').insert([{
            name, studentId: sid, password: pw, studentClass: sClass, photo_url: photoUrl,
            name_bn: nameBn, father_name: fathersName, mother_name: mothersName, dob: dob, roll: roll, study_group: studyGroup, section: section
         }]);
         if (error) throw error;
         setUiMessage({ text: "Student Registered!", type: "success" });
      }

      fetchStudents();
      setSid(""); setName(""); setNameBn(""); setFathersName(""); setMothersName(""); setDob(""); setRoll(""); setStudyGroup(""); setSection(""); setPw(""); setSClass(CLASSES[0]); setPhotoUrl("");
      setEditingId(null);
      setTimeout(() => {
        setUiMessage(null);
        setView('list');
      }, 1500);
      
    } catch (err: any) {
      setUiMessage({ text: "Network error: " + err.message, type: "error" });
    }
    setAdding(false);
  }

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setDeleting(true);
    const { error } = await supabase.from('students').delete().eq('id', deleteModal.id);
    
    if (error) {
      setUiMessage({ text: error.message, type: "error" });
    } else {
      fetchStudents();
      setUiMessage({ text: "Student Removed!", type: "success" });
      if (editingId === deleteModal.id) {
        setEditingId(null); setSid(""); setName(""); setPw(""); setSClass(CLASSES[0]);
      }
    }
    setDeleting(false);
    setDeleteModal({isOpen: false, id: null});
  }

  const filteredStudents = students.filter(s => {
    const matchesClass = filterClass === "All" || s.studentClass === filterClass;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterClass, searchTerm]);

  return (
    <div className="p-8 md:p-10 flex flex-col bg-slate-50 min-h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setView('add')}
          className={\`group flex flex-col md:flex-row items-start md:items-center gap-4 p-5 md:p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden \${
            view === 'add' 
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_8px_30px_rgb(79,70,229,0.2)]' 
              : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-100 hover:shadow-lg'
          }\`}
        >
          {view === 'add' && <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>}
          <div className={\`p-4 rounded-2xl shrink-0 transition-transform duration-300 group-hover:scale-110 \${view === 'add' ? 'bg-white/20 shadow-inner' : 'bg-indigo-50 text-indigo-600'}\`}>
            {editingId ? <Settings size={24} /> : <Plus size={24} />}
          </div>
          <div className="text-left z-10">
            <h4 className={\`text-lg md:text-xl font-black mb-1 \${view === 'add' ? 'text-white' : 'text-slate-800'}\`}>
              {editingId ? "Edit Student Details" : "Register Student"}
            </h4>
            <p className={\`text-sm font-medium leading-relaxed \${view === 'add' ? 'text-indigo-100' : 'text-slate-500'}\`}>
              {editingId ? "Update existing student's data and credentials" : "Create a new student profile in the system"}
            </p>
          </div>
        </button>

        <button
          onClick={() => setView('list')}
          className={\`group flex flex-col md:flex-row items-start md:items-center gap-4 p-5 md:p-6 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden \${
            view === 'list' 
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_8px_30px_rgb(79,70,229,0.2)]' 
              : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-100 hover:shadow-lg'
          }\`}
        >
          {view === 'list' && <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>}
          <div className={\`p-4 rounded-2xl shrink-0 transition-transform duration-300 group-hover:scale-110 \${view === 'list' ? 'bg-white/20 shadow-inner' : 'bg-indigo-50 text-indigo-600'}\`}>
            <Users size={24} />
          </div>
          <div className="text-left z-10">
            <h4 className={\`text-lg md:text-xl font-black mb-1 \${view === 'list' ? 'text-white' : 'text-slate-800'}\`}>
              Student Database
            </h4>
            <p className={\`text-sm font-medium leading-relaxed \${view === 'list' ? 'text-indigo-100' : 'text-slate-500'}\`}>
              Browse and manage all registered student profiles
            </p>
          </div>
        </button>
      </div>

      <ConfirmModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({isOpen: false, id: null})} 
        onConfirm={confirmDelete}
        title="Remove Student"
        message="Are you sure you want to remove this student? All their data will be permanently deleted."
        loading={deleting}
      />
      
      {/* Form Section */}
      {view === 'add' && (
      <div className="w-full max-w-4xl shrink-0 mx-auto bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="">
            <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-3 mb-8">
              <div className="bg-indigo-100 text-indigo-700 p-2 rounded-xl shadow-sm">
                 {editingId ? <Settings size={18} /> : <Plus size={18} />}
              </div> 
              {editingId ? "Edit Student Login" : "Register New Student"}
            </h3>
           
           {uiMessage && <div className={\`p-4 rounded-xl mb-6 text-sm font-bold border \${uiMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}\`}>{uiMessage.text}</div>}
           
           <form onSubmit={handleAddOrUpdate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Student Name <span className="text-red-500">*</span></label>
                  <input placeholder="Full Name (English)" value={name} onChange={e=>setName(e.target.value)} className="w-full border-2 border-slate-200 bg-white p-3.5 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"/>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bengali Name (Optional)</label>
                  <input placeholder="বাংলা নাম" value={nameBn} onChange={e=>setNameBn(e.target.value)} className="w-full border-2 border-slate-200 bg-white p-3.5 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 font-sans"/>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Father's Name (Optional)</label>
                  <input placeholder="Father's Name" value={fathersName} onChange={e=>setFathersName(e.target.value)} className="w-full border-2 border-slate-200 bg-white p-3.5 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"/>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mother's Name (Optional)</label>
                  <input placeholder="Mother's Name" value={mothersName} onChange={e=>setMothersName(e.target.value)} className="w-full border-2 border-slate-200 bg-white p-3.5 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"/>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date of Birth (Optional)</label>
                  <input type="date" value={dob} onChange={e=>setDob(e.target.value)} className="w-full border-2 border-slate-200 bg-white p-3.5 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"/>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Student ID (Unique) <span className="text-red-500">*</span></label>
                  <input placeholder="e.g. STU12345" value={sid} onChange={e=>setSid(e.target.value)} className="w-full border-2 border-slate-200 bg-white p-3.5 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"/>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Class <span className="text-red-500">*</span></label>
                  <select value={sClass} onChange={e=>setSClass(e.target.value)} className="w-full border-2 border-slate-200 bg-white p-3.5 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700 cursor-pointer">
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Roll (Optional)</label>
                  <input placeholder="Class Roll" value={roll} onChange={e=>setRoll(e.target.value)} className="w-full border-2 border-slate-200 bg-white p-3.5 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"/>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Group (Optional)</label>
                  <input placeholder="e.g. Science, Arts" value={studyGroup} onChange={e=>setStudyGroup(e.target.value)} className="w-full border-2 border-slate-200 bg-white p-3.5 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"/>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Section (Optional)</label>
                  <input placeholder="e.g. A, B" value={section} onChange={e=>setSection(e.target.value)} className="w-full border-2 border-slate-200 bg-white p-3.5 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Login Password <span className="text-red-500">*</span></label>
                <input placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} className="w-full border-2 border-slate-200 bg-white p-3.5 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"/>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Student Photo URL (Optional)</label>
                {photoUrl && (
                  <div className="mb-2">
                    <img src={photoUrl} alt="Preview" className="w-16 h-16 object-cover rounded-full border border-slate-200" />
                  </div>
                )}
                <input placeholder="https://..." value={photoUrl} onChange={e=>setPhotoUrl(e.target.value)} className="w-full border-2 border-slate-200 bg-white p-3.5 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"/>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={adding} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl text-sm hover:bg-indigo-700 transition-all shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {adding && <Loader2 size={18} className="animate-spin" />}
                  {adding ? "Saving Data..." : (editingId ? "Update Student Profile" : "Register New Student")}
                </button>
              </div>
           </form>
          </div>
      </div>
      )}
      
      {/* List Section */}
      {view === 'list' && (
      <div className="w-full flex flex-col">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 mb-8 gap-4">
           <div>
             <h3 className="text-xl font-extrabold text-slate-800">Student Directory</h3>
             <p className="text-sm font-medium text-slate-500 mt-1">{filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'} registered</p>
           </div>
           
           <div className="flex items-center gap-3 w-full sm:w-auto bg-slate-50 p-1.5 rounded-xl border border-slate-200">
             <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
               <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <input 
                 placeholder="Search name or ID..."
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="w-full bg-transparent border-0 pl-9 pr-4 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-0"
               />
             </div>
             <div className="w-px h-6 bg-slate-300 mx-1 hidden sm:block"></div>
             <select value={filterClass} onChange={e=>setFilterClass(e.target.value)} className="border-0 bg-transparent py-2 px-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-0 cursor-pointer">
               <option value="All">All Classes</option>
               {CLASSES.map((c) => (
                 <option key={c} value={c}>{c}</option>
               ))}
             </select>
           </div>
         </div>
         
         <div className="overflow-x-auto bg-white rounded-3xl border-2 border-slate-100 shadow-sm min-h-[400px]">
            <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/80 border-b-2 border-slate-100">
                   <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Photo & Name</th>
                   <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Parents Info</th>
                   <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Class Info</th>
                   <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Credentials</th>
                   <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {`;

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);
if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync('src/pages/AdminPanel.tsx', content, 'utf-8');
  console.log("Restored accurately!");
} else {
  console.log("Could not find start or end index.");
}
