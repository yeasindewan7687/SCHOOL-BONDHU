import fs from 'fs';

let content = fs.readFileSync('src/pages/Result.tsx', 'utf-8');

const regex = /\{\/\* Official School Header for PDF \*\/\}(.|\n)*?<div className="no-print">/g;

const replacement = `{/* Official School Header for PDF */}
                     {individualData.isClassReport ? (
                       <div className="text-center mb-6 pb-6 border-b-2 border-slate-100 relative z-10">
                         <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-1">CHILD CARE HIGH SCHOOL</h2>
                         <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">BANIARCHALA, GAZIPUR</p>
                         <div className="inline-block bg-slate-800 text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                           MERIT LIST • {individualData.reports[0]?.exam_name || 'EXAM'} • {individualData.class_name}
                         </div>
                       </div>
                     ) : null}

                     {individualData.isClassReport ? (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6 relative z-10">
                           <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm min-w-max">
                              <thead>
                                <tr className="bg-slate-800 text-white uppercase tracking-widest text-[10px]">
                                   <th className="p-4 font-black text-center border-r border-slate-700">Rank</th>
                                   <th className="p-4 font-black border-r border-slate-700">Student Name</th>
                                   <th className="p-4 font-black border-r border-slate-700">Student ID</th>
                                   {individualData.subjects && individualData.subjects.map((sub: string) => (
                                      <th key={sub} className="p-4 font-black text-center border-r border-slate-700">{sub}</th>
                                   ))}
                                   <th className="p-4 font-black text-center border-r border-slate-700">Total Marks</th>
                                   <th className="p-4 font-black text-center border-r border-slate-700">GPA</th>
                                   <th className="p-4 font-black text-center">Grade</th>
                                </tr>
                              </thead>
                              <tbody>
                                {individualData.reports.map((r: any, i: number) => (
                                   <tr key={i} className={\`border-b border-slate-100 \${i < 3 ? 'bg-yellow-50/40 font-bold' : 'hover:bg-slate-50'}\`}>
                                      <td className="p-4 text-center border-r border-slate-100">
                                         {i === 0 ? '🥇 1st' : i === 1 ? '🥈 2nd' : i === 2 ? '🥉 3rd' : r.rank_roll}
                                      </td>
                                      <td className="p-4 text-slate-800 border-r border-slate-100 font-bold">{r.student_name}</td>
                                      <td className="p-4 text-slate-600 font-medium text-xs border-r border-slate-100">{r.student_number}</td>
                                      {individualData.subjects && individualData.subjects.map((sub: string) => (
                                          <td key={sub} className="p-4 text-center text-slate-600 text-xs font-bold border-r border-slate-100">
                                              {r.subjectMarks && r.subjectMarks[sub] !== undefined ? r.subjectMarks[sub] : '-'}
                                          </td>
                                      ))}
                                      <td className="p-4 text-center font-black text-slate-700 border-r border-slate-100">{r.total_marks}</td>
                                      <td className="p-4 text-center font-black text-indigo-700 border-r border-slate-100">{r.gpa}</td>
                                      <td className={\`p-4 text-center font-black \${r.grade === 'F' ? 'text-red-500' : 'text-emerald-600'}\`}>{r.grade}</td>
                                   </tr>
                                ))}
                              </tbody>
                           </table>
                          </div>
                        </div>
                     ) : (
                       <div className="relative z-10 w-[800px] mx-auto bg-white" style={{ fontFamily="'Inter', sans-serif" }}>
                         {/* PDF HEADER */}
                         <div className="flex justify-between items-start mb-6">
                            {/* Photo Placeholder */}
                            <div className="w-[100px] h-[120px] border border-blue-900 border-dashed flex items-center justify-center p-1 bg-slate-50 relative shrink-0">
                               {individualData.studentDetails && individualData.studentDetails.photo_url ? (
                                  <img src={individualData.studentDetails.photo_url} className="w-full h-full object-cover" alt="Student" crossOrigin="anonymous"/>
                               ) : (
                                  <div className="text-blue-900/40 font-bold flex flex-col items-center"><User size={32}/><span className="text-[10px] mt-1">Photo</span></div>
                               )}
                            </div>
                            
                            {/* Center Title */}
                            <div className="text-center flex-grow px-4">
                               <div className="flex justify-center mb-1"><BookOpen size={24} className="text-blue-900"/></div>
                               <h1 className="text-2xl font-black text-blue-900 tracking-wide uppercase">CHILD CARE HIGH SCHOOL</h1>
                               <p className="text-[11px] font-bold text-slate-700">Baniarchala, Bhobanipur, Gazipur Sadar, Gazipur</p>
                               <div className="mt-3 font-black text-[15px]">{currentExamName} - 2026</div>
                               <div className="inline-block border-b border-black font-bold text-[13px] uppercase tracking-widest mt-1">ACADEMIC TRANSCRIPT</div>
                            </div>
                            
                            {/* Grade Table */}
                            <div className="w-[180px] shrink-0 border border-slate-400 p-0 text-[10px] font-bold text-center">
                               <div className="grid grid-cols-3 border-b border-slate-400 bg-slate-100">
                                  <div className="border-r border-slate-400 py-1">Grade</div>
                                  <div className="border-r border-slate-400 py-1 px-1 text-[9px] leading-[1.1]">Class Interval</div>
                                  <div className="py-1">Grade Point</div>
                               </div>
                               <div className="grid grid-cols-3 border-b border-slate-400 border-dotted"><div className="border-r border-slate-400 border-dotted py-0.5">A+</div><div className="border-r border-slate-400 border-dotted py-0.5">80-100</div><div className="py-0.5">5.00</div></div>
                               <div className="grid grid-cols-3 border-b border-slate-400 border-dotted"><div className="border-r border-slate-400 border-dotted py-0.5">A</div><div className="border-r border-slate-400 border-dotted py-0.5">70-79</div><div className="py-0.5">4.00</div></div>
                               <div className="grid grid-cols-3 border-b border-slate-400 border-dotted"><div className="border-r border-slate-400 border-dotted py-0.5">A-</div><div className="border-r border-slate-400 border-dotted py-0.5">60-69</div><div className="py-0.5">3.50</div></div>
                               <div className="grid grid-cols-3 border-b border-slate-400 border-dotted"><div className="border-r border-slate-400 border-dotted py-0.5">B</div><div className="border-r border-slate-400 border-dotted py-0.5">50-59</div><div className="py-0.5">3.00</div></div>
                               <div className="grid grid-cols-3 border-b border-slate-400 border-dotted"><div className="border-r border-slate-400 border-dotted py-0.5">C</div><div className="border-r border-slate-400 border-dotted py-0.5">40-49</div><div className="py-0.5">2.00</div></div>
                               <div className="grid grid-cols-3 border-b border-slate-400 border-dotted"><div className="border-r border-slate-400 border-dotted py-0.5">D</div><div className="border-r border-slate-400 border-dotted py-0.5">33-39</div><div className="py-0.5">1.00</div></div>
                               <div className="grid grid-cols-3"><div className="border-r border-slate-400 border-dotted py-0.5">F</div><div className="border-r border-slate-400 border-dotted py-0.5">0-32</div><div className="py-0.5">0.00</div></div>
                            </div>
                         </div>
                         
                         {/* Student Details Grid */}
                         <div className="flex flex-col gap-1.5 text-xs font-medium mb-6 px-1">
                            <div className="grid grid-cols-6 gap-2">
                               <div className="col-span-1 text-slate-700">Name of Student</div>
                               <div className="col-span-5 font-bold uppercase">: {individualData["Student Name"] || individualData["Name"]}</div>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                               <div className="col-span-1 text-slate-700">Father's Name</div>
                               <div className="col-span-5 font-bold uppercase">: {individualData.studentDetails?.father_name || "N/A"}</div>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                               <div className="col-span-1 text-slate-700">Mother's Name</div>
                               <div className="col-span-5 font-bold uppercase">: {individualData.studentDetails?.mother_name || "N/A"}</div>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                               <div className="col-span-1 text-slate-700">Date of Birth</div>
                               <div className="col-span-5 font-bold uppercase">: {individualData.studentDetails?.dob || "N/A"}</div>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                               <div className="col-span-1 text-slate-700">Session/Year</div>
                               <div className="col-span-2 font-bold uppercase">: 2026</div>
                               <div className="col-span-1 text-slate-700 ml-4">Student ID</div>
                               <div className="col-span-2 font-bold uppercase">: {studentId}</div>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                               <div className="col-span-1 text-slate-700">Class</div>
                               <div className="col-span-2 font-bold uppercase">: {targetClass.replace(/class\\s+/i, '').trim()}</div>
                               <div className="col-span-1 text-slate-700 ml-4">Class Roll</div>
                               <div className="col-span-2 font-bold uppercase">: {individualData.studentDetails?.roll || individualData.Position || "01"}</div>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                               <div className="col-span-1 text-slate-700">Group</div>
                               <div className="col-span-2 font-bold uppercase">: {individualData.studentDetails?.study_group || "N/A"}</div>
                               <div className="col-span-1 text-slate-700 ml-4">Section</div>
                               <div className="col-span-2 font-bold uppercase">: {individualData.studentDetails?.section || "N/A"}</div>
                            </div>
                         </div>
                         
                         {/* Summary block */}
                         <div className="border border-slate-500 border-dashed rounded flex flex-wrap text-[11px] font-bold p-1 mb-4 grid grid-cols-3">
                            <div className="grid grid-cols-2 p-1">
                               <div className="text-slate-600">Total Marks</div><div>: {getValue(individualData, ["Total Marks", "সর্বমোট"])}</div>
                            </div>
                            <div className="grid grid-cols-2 p-1 border-l border-slate-400 border-dashed">
                               <div className="text-slate-600">Obtained Marks</div><div>: {getValue(individualData, ["Total Marks", "সর্বমোট"])}</div>
                            </div>
                            <div className="grid grid-cols-2 p-1 border-l border-slate-400 border-dashed">
                               <div className="text-slate-600">Result Status</div><div>: <span className="uppercase">{getValue(individualData, ["Grade"]) === "F" ? "Failed" : "Passed"}</span></div>
                            </div>
                            <div className="grid grid-cols-2 p-1 border-t border-slate-400 border-dashed">
                               <div className="text-slate-600">Overall GPA</div><div>: {getValue(individualData, ["GPA", "জিপিএ"])}</div>
                            </div>
                            <div className="grid grid-cols-2 p-1 border-t border-l border-slate-400 border-dashed">
                               <div className="text-slate-600">Overall Grade</div><div>: {getValue(individualData, ["Grade"])}</div>
                            </div>
                            <div className="grid grid-cols-2 p-1 border-t border-l border-slate-400 border-dashed">
                               <div className="text-slate-600">Exam Merit</div><div>: {getValue(individualData, ["Position", "অবস্থান", "Roll", "রোল"])}</div>
                            </div>
                         </div>
                         
                         {/* Main Marks Table */}
                         {individualData.isInternal && individualData.detailedMarks ? (
                         <div className="mb-6">
                            <table className="w-full text-center border-collapse border border-slate-700 text-xs">
                               <thead>
                                  <tr className="bg-slate-50 text-slate-800 font-bold">
                                     <th className="border border-slate-700 py-1.5 w-8">SN</th>
                                     <th className="border border-slate-700 py-1.5 text-left pl-2">Subject Name</th>
                                     <th className="border border-slate-700 py-1.5 w-12 leading-tight">Full<br/>Marks</th>
                                     <th className="border border-slate-700 py-1.5 w-12 leading-tight">Max.<br/>Marks</th>
                                     <th className="border border-slate-700 py-1.5 w-14">Written</th>
                                     <th className="border border-slate-700 py-1.5 w-10">MCQ</th>
                                     <th className="border border-slate-700 py-1.5 w-14">Practical</th>
                                     <th className="border border-slate-700 py-1.5 w-12 leading-tight">Obt.<br/>Marks</th>
                                     <th className="border border-slate-700 py-1.5 w-14 leading-tight">Combined<br/>Avg.</th>
                                     <th className="border border-slate-700 py-1.5 w-10 leading-tight">100%<br/>Marks</th>
                                     <th className="border border-slate-700 py-1.5 w-12">Grade</th>
                                     <th className="border border-slate-700 py-1.5 w-12">GPA</th>
                                  </tr>
                               </thead>
                               <tbody>
                                  {individualData.detailedMarks.map((m: any, idx: number) => {
                                     const sr = m.sr;
                                     return (
                                        <tr key={idx}>
                                           <td className="border border-slate-600 py-1 font-bold">{idx + 1}</td>
                                           <td className="border border-slate-600 py-1 text-left pl-2 font-bold">{m.subject}</td>
                                           <td className="border border-slate-600 py-1">{sr?.total?.toFixed(1) || '-'}</td>
                                           <td className="border border-slate-600 py-1">{sr?.total?.toFixed(1) || '-'}</td>
                                           <td className="border border-slate-600 py-1">{m.cq_marks !== undefined && m.cq_marks !== null ? m.cq_marks : (m.subject !== 'Tutorial' ? m.marks : '')}</td>
                                           <td className="border border-slate-600 py-1">{m.mcq_marks !== undefined && m.mcq_marks !== null ? m.mcq_marks : ''}</td>
                                           <td className="border border-slate-600 py-1">{m.practical_marks !== undefined && m.practical_marks !== null ? m.practical_marks : ''}</td>
                                           <td className="border border-slate-600 py-1 font-bold text-slate-800">{m.marks}</td>
                                           <td className="border border-slate-600 py-1">-</td>
                                           <td className="border border-slate-600 py-1 font-bold">{m.marks}</td>
                                           <td className="border border-slate-600 py-1 font-black uppercase text-slate-800">
                                              {['Play', 'Nursery', 'One', 'Two'].includes(targetClass) ? \`\${sr?.grade} \${sr?.grade==='A+'?'Tri':sr?.grade==='A-'?'Cir':'Sq'}\` : sr?.grade}
                                           </td>
                                           <td className="border border-slate-600 py-1 font-bold">{sr?.gp?.toFixed(2)}</td>
                                        </tr>
                                     )
                                  })}
                               </tbody>
                            </table>
                         </div>
                         ) : (
                           // External Link generic map rendering
                           <div className="mb-6">
                            <table className="w-full text-center border-collapse border border-slate-700 text-xs">
                               <thead>
                                  <tr className="bg-slate-50 text-slate-800 font-bold">
                                     <th className="border border-slate-700 py-1.5 w-8">SN</th>
                                     <th className="border border-slate-700 py-1.5 text-left pl-2">Subject Name</th>
                                     <th className="border border-slate-700 py-1.5 w-12">Obt. Marks</th>
                                  </tr>
                               </thead>
                               <tbody>
                                 {Object.keys(individualData).filter(subjectKey => {
                                      const k = subjectKey.trim();
                                      const lowerK = k.toLowerCase();
                                      const excludeKeywords = ["name", "id", "class", "gpa", "position", "roll", "rank", "result", "total", "percentage", "photo", "serial", "sheet", "link", "date", "published", "isinternal", "grade", "আইডি", "নাম", "জিপিএ", "ফল", "রোল", "স্থান", "অবস্থান", "detailedmarks"];
                                      return !excludeKeywords.some(keyword => lowerK.includes(keyword)) && individualData[subjectKey] !== "";
                                 }).map((sub, i) => (
                                      <tr key={sub}>
                                           <td className="border border-slate-600 py-1 font-bold">{i + 1}</td>
                                           <td className="border border-slate-600 py-1 text-left pl-2 font-bold">{sub}</td>
                                           <td className="border border-slate-600 py-1 font-bold text-slate-800">{individualData[sub]}</td>
                                      </tr>
                                 ))}
                               </tbody>
                               </table>
                           </div>
                         )}

                         {currentExamName === 'Final Terminal Exam' && individualData.previousTerminals && individualData.previousTerminals.length > 0 && (
                            <div className="mb-6 border border-slate-500 border-dashed p-1">
                                <table className="w-full text-center border-collapse text-xs font-bold">
                                    <thead>
                                        <tr className="text-slate-600 border-b border-slate-400 border-dashed">
                                            <th className="py-1 line">Exam Term</th>
                                            <th className="py-1">Marks Obtained</th>
                                            <th className="py-1">% Contribution</th>
                                            <th className="py-1">Total Marks</th>
                                            <th className="py-1">Merit Position</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {['1st Terminal Exam', '2nd Terminal Exam', 'Final Terminal Exam'].map((exName, ix) => {
                                             let matchRes = null;
                                             if (exName === 'Final Terminal Exam') {
                                                matchRes = {total_marks: individualData["Total Marks"]};
                                             } else {
                                                matchRes = individualData.previousTerminals.find((pt: any) => pt.exam_name === exName);
                                             }
                                             const pctStr = exName === 'Final Terminal Exam' ? '(50%)' : '(25%)';
                                             const termP = matchRes ? (exName === 'Final Terminal Exam' ? Number(matchRes.total_marks)/2 : Number(matchRes.total_marks)/4).toFixed(1) : '-';
                                             
                                             let overallMarksStr = '-';
                                             let finalPosStr = '-';
                                             
                                             if (ix === 1) { // center total area in 2nd row artificially
                                                  // Calculate Total across 3
                                                  let totalAcross3 = 0;
                                                  let count = 0;
                                                  ['1st Terminal Exam', '2nd Terminal Exam'].forEach(p_ex => {
                                                      const fd = individualData.previousTerminals.find((pt: any) => pt.exam_name === p_ex);
                                                      if(fd) { totalAcross3 += Number(fd.total_marks)/4; count++; }
                                                  });
                                                  totalAcross3 += Number(individualData["Total Marks"])/2;
                                                  overallMarksStr = totalAcross3.toFixed(2);
                                                  finalPosStr = individualData.Position || individualData.Rank || "1";
                                             }
                                             
                                             return (
                                                 <tr key={exName} className={ix < 2 ? "border-b border-slate-300 border-dotted" : ""}>
                                                     <td className="py-1">{exName}</td>
                                                     <td className="py-1">{matchRes ? Number(matchRes.total_marks).toFixed(2) : '-'}</td>
                                                     <td className="py-1 text-slate-500">{termP} {pctStr}</td>
                                                     {ix === 1 ? (
                                                         <td className="py-1 text-3xl text-red-400 pb-0" rowSpan={2}>{overallMarksStr}</td>
                                                     ) : ix === 0 ? <td className="py-1"></td> : null}
                                                     {ix === 1 ? (
                                                         <td className="py-1 text-4xl text-blue-900 pb-0 font-black" rowSpan={2}>{finalPosStr}</td>
                                                     ) : ix === 0 ? <td className="py-1"></td> : null}
                                                 </tr>
                                             )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                         )}
                         
                         {/* Footer area */}
                         <div className="flex border border-slate-400 border-dashed rounded text-[11px] font-bold p-1 items-center justify-between mt-auto pt-6">
                             <div className="flex w-1/2">
                                <div className="w-24 text-center">Outstanding</div>
                                <div className="border-t border-slate-400 border-dashed mx-2 w-full pt-1 text-center font-normal text-slate-500">Remarks</div>
                             </div>
                             <div className="flex-1 text-center text-[10px] text-slate-500 px-4">
                                This is automatically computer generated result, if any mistake will be considerable.
                             </div>
                             <div className="flex w-1/4 flex-col text-center">
                                <div className="h-6"></div>
                                <div className="border-t border-black font-bold pt-1">Principal / Director</div>
                             </div>
                         </div>
                       </div>
                     )}
                     
                     <div className="no-print">`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/pages/Result.tsx', content, 'utf-8');
console.log("Updated UI rendering.");
