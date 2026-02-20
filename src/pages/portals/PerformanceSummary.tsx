import React, { useMemo, useState } from 'react';
import '../../styles/TeacherPortal.css';
import { getAssessmentScores, getPhase2Activity1All, getPhase2Activity2All, getPhase2Activity3All, getPhase2Activity2AnswersAll, getPhase2SelfAssessAll, getPhase2Activity4CheckAll, getPhase2Activity4InterpAll, getPhase2Activity4InterpAllDetailed, getPhase3FinishAll, getPhase3WorksheetAll, getPhase3RecommendationAll, getAllLesson1States, getPhase4ReviewAll, getPhase4CompleteAll, getLesson3Phase4ReviewAll, getLesson3Phase4CompleteAll, getActivity4aAll, setActivity4aFeedback, getActivity4bAll, setPhaseScore, getLesson2Phase1Activity1All, getLesson2Phase1Activity1bAll, getLesson2Phase1Activity2All, getLesson2Phase1Activity2bAll, getLesson2Phase1Activity3All, getLesson2Phase1Activity4All, getLesson2Phase2Activity1All, getLesson2Phase2Activity2All, getLesson2Phase2Activity3All, getLesson2Phase2Activity4All, getLesson2Phase2Activity4InterpAll, getLesson2Phase4Activity1All, getLesson3Phase1Activity1All, getLesson3Phase1Activity2All, getLesson3Phase2Activity1All, getLesson3Phase2Activity2All, getLesson3Phase2Activity3All, getLesson3Phase3Activity1All, getLesson1State, saveLesson1State } from '../../services/progressService';
import { activity2Validators } from '../../services/activity2Questions';

interface Student {
  id: string;
  name: string;
  username: string;
}

interface ClassItem {
  id: string;
  grade: string;
  section: string;
  students: Student[];
}

interface PerformanceSummaryProps {
  classes: ClassItem[];
}

const emptyAnswers = () => Array.from({ length: 15 }, () => '');

const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({ classes }) => {
  const [activeSub, setActiveSub] = useState<'pre' | 'lesson1' | 'lesson2' | 'lesson3' | 'post' | 'classRecord'>('pre');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [lessonPhase, setLessonPhase] = useState<'phase1' | 'phase2' | 'phase3' | 'phase4'>('phase1');
  const [phase1Activity, setPhase1Activity] = useState<'a1' | 'a2' | 'a3' | 'a4a' | 'a4b' | 'a4' | 'a5' | 'a6'>('a1');
  const [phase3Activity, setPhase3Activity] = useState<'act1' | 'act2' | 'act3'>('act1');
  const [p3Act1SelectedUser, setP3Act1SelectedUser] = useState<string>('');
  const [p3Act2SelectedUser, setP3Act2SelectedUser] = useState<string>('');
  const [p3Act3SelectedUser, setP3Act3SelectedUser] = useState<string>('');
  const [phase4Activity, setPhase4Activity] = useState<'act1' | 'act2' | 'act3'>('act1');
  const [lesson1Phase4SelectedStudent, setLesson1Phase4SelectedStudent] = useState<string>('');
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [lesson2Phase, setLesson2Phase] = useState<'phase1' | 'phase2' | 'phase3' | 'phase4'>('phase1');
  const [lesson2Phase1Activity, setLesson2Phase1Activity] = useState<'a1a' | 'a1b' | 'a2a' | 'a2b' | 'a3' | 'a4'>('a1a');
  const [lesson2Phase2Activity, setLesson2Phase2Activity] = useState<'a1' | 'a2' | 'a3' | 'a4a' | 'a4b'>('a1');
  const [lesson2Phase2SelectedStudent, setLesson2Phase2SelectedStudent] = useState<string>('');
  const [phase2A3SelectedStudent, setPhase2A3SelectedStudent] = useState<string>('');
  const [lesson2Phase3Activity, setLesson2Phase3Activity] = useState<'a1' | 'a2'>('a1');
  const [lesson2Phase3SelectedStudent, setLesson2Phase3SelectedStudent] = useState<string>('');
  const [lesson2Phase4Activity, setLesson2Phase4Activity] = useState<'a1'>('a1');
  const [lesson2Phase4SelectedStudent, setLesson2Phase4SelectedStudent] = useState<string>('');
  const [rubricSelections, setRubricSelections] = useState<number[]>(Array(8).fill(1));
  const [lesson3Phase, setLesson3Phase] = useState<'phase1' | 'phase2' | 'phase3' | 'phase4'>('phase1');
  const [lesson3Phase1Activity, setLesson3Phase1Activity] = useState<'activity1' | 'activity2' | 'activity3'>('activity1');
  const [lesson3Phase1SelectedStudent, setLesson3Phase1SelectedStudent] = useState<string>('');
  const [lesson3Phase2Activity, setLesson3Phase2Activity] = useState<'activity1' | 'activity2' | 'activity3'>('activity1');
  const [lesson3Phase2SelectedStudent, setLesson3Phase2SelectedStudent] = useState<string>('');
  const [lesson3Phase3SelectedStudent, setLesson3Phase3SelectedStudent] = useState<string>('');
  const [lesson3Phase4Activity, setLesson3Phase4Activity] = useState<'act1' | 'act2' | 'act3'>('act1');
  const [lesson3Phase4SelectedStudent, setLesson3Phase4SelectedStudent] = useState<string>('');
  const [rubricSelectionsL3, setRubricSelectionsL3] = useState<number[]>(Array(8).fill(1));

  const classOptions = useMemo(() => [
    { id: 'all', label: 'All Classes' },
    ...classes.map((c) => ({ id: c.id, label: `${c.grade} - ${c.section}` }))
  ], [classes]);
  const formatNameLastFirst = (fullName: string) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    const last = parts[parts.length - 1];
    const first = parts.slice(0, parts.length - 1).join(' ');
    return `${last}, ${first}`;
  };
    // Small internal scoring table component
    const ScoringTable: React.FC<{ criteria: string[]; options: string[][]; onRecord: (selections: number[]) => void; studentDisplay?: string }> = ({ criteria, options, onRecord, studentDisplay }) => {
      const [sels, setSels] = useState<number[]>(Array(criteria.length).fill(1));
      const interp = ['Below Proficient','Proficient','Advanced'];
      const scoreVal = (i:number) => (i === 0 ? 2 : i === 1 ? 3 : 4);
      const total = sels.reduce((a,b)=>a+scoreVal(b),0);
      return (
        <div>
          <table className="scoring-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Criterion</th>
                <th>Selection</th>
                <th>Interpretation</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((c, idx) => (
                <tr key={idx}>
                  <td style={{ padding: 6 }}>{c}</td>
                  <td className="scoring-select-cell" style={{ padding: 6 }}>
                    <select className="scoring-select" value={sels[idx]} onChange={(e)=>{ const v = Number(e.target.value); setSels(s=>{ const copy = s.slice(); copy[idx]=v; return copy; }); }}>
                      <option value={0}>{options[idx][0]}</option>
                      <option value={1}>{options[idx][1]}</option>
                      <option value={2}>{options[idx][2]}</option>
                    </select>
                  </td>
                  <td className="scoring-interpret" style={{ padding: 6 }}>{interp[sels[idx]]}</td>
                  <td className="scoring-score" style={{ padding: 6 }}>{scoreVal(sels[idx])}</td>
                </tr>
              ))}
              <tr>
                <td style={{ padding: 6, fontWeight: 800 }}>Total</td>
                <td></td>
                <td></td>
                <td className="scoring-score" style={{ padding: 6, fontWeight: 800 }}>{total}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => onRecord(sels)} style={{ padding: '8px 12px', borderRadius: 6, border: 'none', background: '#2f6f5a', color: '#fff' }}>Record Score</button>
            <div style={{ marginLeft: 8, color: '#374151', fontWeight: 700 }}>{studentDisplay || ''}</div>
          </div>
        </div>
      );
    };

  const studentsForSelected = useMemo(() => {
    if (selectedClassId === 'all') {
      return classes.flatMap((c) => c.students.map(s => ({ ...s, classId: c.id })));
    }
    const found = classes.find(c => c.id === selectedClassId);
    return found ? found.students.map(s => ({ ...s, classId: found.id })) : [];
  }, [classes, selectedClassId]);

  // include a snapshot of assessment scores so tableRows recomputes when localStorage assessment data changes
  const allScoresJson = JSON.stringify(getAssessmentScores());
  const tableRows = useMemo(() => {
    const allScores = getAssessmentScores();
    return studentsForSelected.map((s) => {
      const entry = allScores[s.username] || {} as any;
      const answers: string[] = entry.postPart1Responses || entry.prePart1Responses || emptyAnswers();
      const postScore = typeof entry.postPart1Correct === 'number' ? entry.postPart1Correct : undefined;
      const fallbackScore = ((): any => {
        try {
          const tf = JSON.parse(localStorage.getItem('teacherFeedback') || '{}') || {};
          const t = tf[s.username] && tf[s.username].lesson1 && tf[s.username].lesson1.phaseScores ? tf[s.username].lesson1.phaseScores[4] : undefined;
          if (typeof t === 'number') return t;
        } catch (e) {}
        try {
          const all = getAllLesson1States();
          const v = all[s.username]?.phaseData?.[4] as any;
          if (v && typeof v.teacherScore === 'number') return v.teacherScore;
        } catch (e) {}
        return 0;
      })();
      return {
        id: s.id,
        name: s.name,
        username: s.username,
        answers,
        score: typeof postScore === 'number' ? postScore : fallbackScore
      };
    });
  }, [studentsForSelected, allScoresJson]);

  const downloadCSV = (rows: any[], filename = 'performance.csv') => {
    const header = ['Name','Username',...Array.from({ length: 15 }, (_, i) => `Q${i+1}`),'Score'];
    const lines = [header.join(',')];
    rows.forEach(r => {
      const line = [r.name, r.username, ...r.answers, r.score].map((v:any) => `"${String(v).replace(/"/g,'""')}"`).join(',');
      lines.push(line);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = (sectionTitle: string) => {
    const w = window.open('', '_blank');
    if (!w) return;
    const html = `
      <html>
      <head>
        <title>${sectionTitle}</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 6px 8px; font-size: 12px; }
          th { background: #eef6ff; }
        </style>
      </head>
      <body>
        <h2>${sectionTitle}</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              ${Array.from({ length: 15 }, (_, i) => `<th>Q${i+1}</th>`).join('')}
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows.map(r => `
              <tr>
                <td>${r.name}</td>
                <td>${r.username}</td>
                ${r.answers.map(a=>`<td>${a}</td>`).join('')}
                <td>${r.score}</td>
              </tr>
            `).join('\n')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    w.document.write(html);
    w.document.close();
    w.print();
  };

  return (
    <div className="performance-page">
      <div className="performance-header">
        <h2 className="performance-title">Performance Summary</h2>
      </div>

        <div className="performance-subtabs">
        <button className={`subtab ${activeSub === 'pre' ? 'active' : ''}`} onClick={() => setActiveSub('pre')}>Pre-Assessment</button>
        <button className={`subtab ${activeSub === 'lesson1' ? 'active' : ''}`} onClick={() => setActiveSub('lesson1')}>Lesson 1</button>
        <button className={`subtab ${activeSub === 'lesson2' ? 'active' : ''}`} onClick={() => setActiveSub('lesson2')}>Lesson 2</button>
        <button className={`subtab ${activeSub === 'lesson3' ? 'active' : ''}`} onClick={() => setActiveSub('lesson3')}>Lesson 3</button>
        <button className={`subtab ${activeSub === 'post' ? 'active' : ''}`} onClick={() => setActiveSub('post')}>Post-Assessment</button>
        <button className={`subtab ${activeSub === 'classRecord' ? 'active' : ''}`} onClick={() => setActiveSub('classRecord')}>Class Record</button>
      </div>

      <div className="performance-content">
        {activeSub === 'pre' && (
          <div className="subpage">
            <div className="subpage-header">
              <h3 className="subpage-title">Pre-Assessment Results</h3>
              <div className="subpage-controls">
                <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                  {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                </select>
                <div className="download-group">
                  <button onClick={() => {
                    // prepare rows from assessment scores
                    const all = getAssessmentScores();
                    const rows = studentsForSelected.map(s => {
                      const entry = all[s.username] || {};
                      return {
                        name: s.name,
                        username: s.username,
                        answers: entry.prePart1Responses || Array.from({ length: 15 }, () => ''),
                        score: typeof entry.prePart1Correct === 'number' ? entry.prePart1Correct : ''
                      };
                    });
                    downloadCSV(rows, 'pre-assessment.csv');
                  }} className="download-btn">Download CSV</button>
                  <button onClick={() => {
                    const all = getAssessmentScores();
                    const rows = studentsForSelected.map(s => ({
                      name: s.name,
                      username: s.username,
                      answers: all[s.username]?.prePart1Responses || Array.from({ length: 15 }, () => ''),
                      score: all[s.username]?.prePart1Correct ?? ''
                    }));
                    // simple PDF export
                    const html = `\n                      <html><head><title>Pre-Assessment Results</title></head><body><h2>Pre-Assessment Results</h2><table border="1" cellpadding="6"><thead><tr><th>Name</th><th>Username</th>${Array.from({length:15},(_,i)=>`<th>Q${i+1}</th>`).join('')}<th>Score</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.name}</td><td>${r.username}</td>${r.answers.map((a: string)=>`<td>${a}</td>`).join('')}<td>${r.score}</td></tr>`).join('')}</tbody></table></body></html>`;
                    const w = window.open('', '_blank'); if (!w) return; w.document.write(html); w.document.close(); w.print();
                  }} className="download-btn">Download PDF</button>
                </div>
              </div>
            </div>

            <div className="table-wrap">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    {Array.from({ length: 15 }, (_, i) => <th key={i}>Q{i+1}</th>)}
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsForSelected.length === 0 && (
                    <tr><td colSpan={17} style={{ textAlign: 'center', padding: '18px' }}>No students found for selected class.</td></tr>
                  )}
                  {(() => {
                    const all = getAssessmentScores();
                    return studentsForSelected.map(s => {
                      const entry = all[s.username] || {} as any;
                      const answers: string[] = entry.prePart1Responses || Array.from({ length: 15 }, () => '');
                      const score = typeof entry.prePart1Correct === 'number' ? entry.prePart1Correct : '';
                      return (
                        <tr key={s.id}>
                          <td>{s.name}</td>
                          <td>{s.username}</td>
                          {answers.map((a, idx) => <td key={idx} className={(entry.prePart1ItemCorrect && entry.prePart1ItemCorrect[idx]) ? 'cell-correct' : ''}>{a}</td>)}
                          <td>{score}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSub === 'lesson1' && (
          <div className="subpage">
            <div className="subpage-header">
              <h3 className="subpage-title">Lesson 1: Climate Correlation Analysis</h3>
            </div>

            <div className="lesson-phases">
              <div className="phase-tabs">
                <button className={`phase ${lessonPhase === 'phase1' ? 'active' : ''}`} onClick={() => setLessonPhase('phase1')}>Phase 1: Launch the Investigation</button>
                <button className={`phase ${lessonPhase === 'phase2' ? 'active' : ''}`} onClick={() => setLessonPhase('phase2')}>Phase 2: Decode the Data</button>
                <button className={`phase ${lessonPhase === 'phase3' ? 'active' : ''}`} onClick={() => setLessonPhase('phase3')}>Phase 3: From Numbers to Action</button>
                <button className={`phase ${lessonPhase === 'phase4' ? 'active' : ''}`} onClick={() => setLessonPhase('phase4')}>Phase 4: Share the Story, Reflect on the Journey</button>
              </div>

              {/* --- Phase 1 layout: left vertical activities, right content panel --- */}
              {lessonPhase === 'phase1' && (
                <div className="lesson-layout">
                  <aside className="activity-list">
                    <button className={`activity ${phase1Activity === 'a1' ? 'active' : ''}`} onClick={() => setPhase1Activity('a1')}>Activity 1</button>
                    <button className={`activity ${phase1Activity === 'a2' ? 'active' : ''}`} onClick={() => setPhase1Activity('a2')}>Activity 2</button>
                    <button className={`activity ${phase1Activity === 'a3' ? 'active' : ''}`} onClick={() => setPhase1Activity('a3')}>Activity 3</button>
                    <button className={`activity ${phase1Activity === 'a4a' ? 'active' : ''}`} onClick={() => setPhase1Activity('a4a')}>Activity 4a</button>
                    <button className={`activity ${phase1Activity === 'a4b' ? 'active' : ''}`} onClick={() => setPhase1Activity('a4b')}>Activity 4b</button>
                  </aside>

                  <section className="activity-panel">
                    {/* Activity 1 */}
                    {phase1Activity === 'a1' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title">Activity 1: Explore the Data</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => downloadCSV(tableRows)} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 1: Explore the Data')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students explore real climate and environmental data. They use the filter buttons to change what data appears on the bar graph, observe how the values change when you select different options, and take note of patterns, increases, decreases, or anything that catches your attention.</p>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Timestamp (Mark as Done)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentsForSelected.length === 0 && <tr><td colSpan={2} style={{ textAlign: 'center' }}>No students found.</td></tr>}
                              {(() => {
                                const allStates = getAllLesson1States();
                                return studentsForSelected.map(s => {
                                  const rawTs = (allStates?.[s.username]?.phaseData?.[1] as any)?.a1Timestamp || '';
                                  let display = '';
                                  if (rawTs) {
                                    try {
                                      const d = new Date(rawTs);
                                      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                                      const m = monthNames[d.getMonth()];
                                      const dd = String(d.getDate()).padStart(2,'0');
                                      const yyyy = d.getFullYear();
                                      const hh = String(d.getHours()).padStart(2,'0');
                                      const mm = String(d.getMinutes()).padStart(2,'0');
                                      const ss = String(d.getSeconds()).padStart(2,'0');
                                      display = `${m} ${dd}, ${yyyy} - ${hh}:${mm}:${ss}`;
                                    } catch (e) { display = rawTs; }
                                  }
                                  return (
                                    <tr key={s.id}>
                                      <td>{s.name}</td>
                                      <td>{display}</td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 2 */}
                    {phase1Activity === 'a2' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title">Activity 2: Watch and Check Your Understanding</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => downloadCSV(tableRows)} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 2: Watch and Check Your Understanding')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students watch an instructional video about Pearson Correlation and answer the checkpoint questions.</p>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Q1</th>
                                <th>Q2</th>
                                <th>Q3</th>
                                <th>Q4</th>
                                <th>Q5</th>
                                <th>Score</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const allStates = getAllLesson1States();
                                return studentsForSelected.slice().sort((a,b)=>{
                                  const la = a.name.split(' ').slice(-1)[0].toLowerCase();
                                  const lb = b.name.split(' ').slice(-1)[0].toLowerCase();
                                  return la.localeCompare(lb);
                                }).map(s => {
                                  const entry = (allStates || {})[s.username] as any || {};
                                  const p1 = entry.phaseData?.[1] || {};
                                  const answers: string[] = (p1.a2Answers as string[]) ?? Array.from({ length: activity2Validators.length }, () => '');
                                  const score = typeof p1.a2Score === 'number' ? p1.a2Score : '';
                                  return (
                                    <tr key={s.id}>
                                      <td>{s.name}</td>
                                      {answers.map((val, i) => {
                                        const correct = !!activity2Validators[i] && activity2Validators[i](val || '');
                                        return <td key={i} className={correct ? 'cell-correct' : ''}>{val || ''}</td>;
                                      })}
                                      <td>{score}</td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 3 */}
                    {phase1Activity === 'a3' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title">Activity 3: Choose a Possible Correlation</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => downloadCSV(tableRows)} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 3: Choose a Possible Correlation')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students choose one pair of variables that they think may have a possible correlation and explain why they think these two variables might be related.</p>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Variable 1</th>
                                <th>Variable 2</th>
                                <th>Encoded Reason</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const allStates = getAllLesson1States();
                                return studentsForSelected.slice().sort((a,b)=> a.name.localeCompare(b.name)).map(s => {
                                  const entry = (allStates || {})[s.username] as any || {};
                                  const p1 = entry.phaseData?.[1] || {};
                                  const v1 = p1.a3Var1 || '';
                                  const v2 = p1.a3Var2 || '';
                                  const reason = p1.a3Reason || '';
                                  return (
                                    <tr key={s.id}>
                                      <td>{s.name}</td>
                                      <td>{v1}</td>
                                      <td>{v2}</td>
                                      <td>{reason}</td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 4a */}
                    {phase1Activity === 'a4a' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title">Activity 4a: Write Your Research Question (Initial)</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => downloadCSV(tableRows)} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 4a: Write Your Research Question (Initial)')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students turn their idea into a research question. They encode first their first version of their research question. The teacher will provide feedback.</p>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Timestamp (Submit Question)</th>
                                <th>Research Question</th>
                                <th>Teacher Feedback</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const activity4a = getActivity4aAll();
                                return studentsForSelected.slice().sort((a,b)=> a.name.localeCompare(b.name)).map(s => {
                                  const entry = (activity4a || {})[s.username] as any || {};
                                  const rawTs = entry.timestamp || '';
                                  let tsDisplay = '';
                                  if (rawTs) {
                                    try {
                                      const d = new Date(rawTs);
                                      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                                      const m = monthNames[d.getMonth()];
                                      const dd = String(d.getDate()).padStart(2,'0');
                                      const yyyy = d.getFullYear();
                                      const hh = String(d.getHours()).padStart(2,'0');
                                      const mm = String(d.getMinutes()).padStart(2,'0');
                                      const ss = String(d.getSeconds()).padStart(2,'0');
                                      tsDisplay = `${m} ${dd}, ${yyyy} - ${hh}:${mm}:${ss}`;
                                    } catch (e) { tsDisplay = rawTs; }
                                  }
                                  const question = entry.question || '';
                                  const existingFeedback = entry.feedback || '';
                                  const disabled = !!existingFeedback;
                                  return (
                                    <tr key={s.id}>
                                      <td>{s.name}</td>
                                      <td>{tsDisplay}</td>
                                      <td style={{ maxWidth: 420, wordBreak: 'break-word' }}>{question}</td>
                                      <td>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                          <input value={existingFeedback ? existingFeedback : (feedbackMap[s.id] || '')} onChange={(e)=> setFeedbackMap(prev=>({ ...prev, [s.id]: e.target.value }))} placeholder="Enter feedback" disabled={disabled} />
                                          <button onClick={()=>{
                                            const fb = feedbackMap[s.id] || '';
                                            setActivity4aFeedback(s.username, fb);
                                            setFeedbackMap(prev => ({ ...prev, [s.id]: '' }));
                                          }} disabled={disabled || !(feedbackMap[s.id] && feedbackMap[s.id].trim().length > 0)}>Send</button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 4b */}
                    {phase1Activity === 'a4b' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title">Activity 4b: Write Your Research Question (Revised)</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => downloadCSV(tableRows)} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 4b: Write Your Research Question (Revised)')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students finalize their research questions based on teacher's feedback.</p>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Timestamp (Finalize Question)</th>
                                <th>Revised Research Question</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const activity4b = getActivity4bAll();
                                return studentsForSelected.slice().sort((a,b)=> a.name.localeCompare(b.name)).map(s => {
                                  const entry = (activity4b || {})[s.username] as any || {};
                                  const rawTs = entry.timestamp || '';
                                  let tsDisplay = '';
                                  if (rawTs) {
                                    try {
                                      const d = new Date(rawTs);
                                      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                                      const m = monthNames[d.getMonth()];
                                      const dd = String(d.getDate()).padStart(2,'0');
                                      const yyyy = d.getFullYear();
                                      const hh = String(d.getHours()).padStart(2,'0');
                                      const mm = String(d.getMinutes()).padStart(2,'0');
                                      const ss = String(d.getSeconds()).padStart(2,'0');
                                      tsDisplay = `${m} ${dd}, ${yyyy} - ${hh}:${mm}:${ss}`;
                                    } catch (e) { tsDisplay = rawTs; }
                                  }
                                  const finalQ = entry.finalQuestion || '';
                                  return (
                                    <tr key={s.id}>
                                      <td>{s.name}</td>
                                      <td>{tsDisplay}</td>
                                      <td style={{ maxWidth: 480, wordBreak: 'break-word' }}>{finalQ}</td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}

              

              {/* --- Phase 4 layout: left vertical activities, right content panel --- */}
              {lessonPhase === 'phase4' && (
                <div className="lesson-layout">
                  <aside className="activity-list">
                    <button className={`activity ${phase4Activity === 'act1' ? 'active' : ''}`} onClick={() => setPhase4Activity('act1')}>Activity 1</button>
                    <button className={`activity ${phase4Activity === 'act2' ? 'active' : ''}`} onClick={() => setPhase4Activity('act2')}>Activity 2</button>
                    <button className={`activity ${phase4Activity === 'act3' ? 'active' : ''}`} onClick={() => setPhase4Activity('act3')}>Activity 3</button>
                  </aside>

                  <section className="activity-panel">
                    {/* Activity 1: Peer Review */}
                    {phase4Activity === 'act1' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Peer Review: Quality Check Before Submission</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => { const reviews = getLesson3Phase4ReviewAll(); const rows = Object.keys(reviews).map(u=>({ username: u, data: reviews[u]?.review || {} })); downloadCSV(rows as any, 'lesson3_phase4_peerreview.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Peer Review: Quality Check Before Submission')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students ask their peers to review their Lesson 1 output before submission.</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                          <select className="class-filter" value={lesson1Phase4SelectedStudent} onChange={(e) => setLesson1Phase4SelectedStudent(e.target.value)}>
                            <option value="">All Students (who submitted)</option>
                            {Object.keys(getLesson3Phase4ReviewAll()).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0])).map(u=> <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th style={{ width: '45%' }}>Prompt</th>
                                <th>Student Answer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const all = getAllLesson1States();
                                const reviews = getPhase4ReviewAll();
                                const users = Object.keys(reviews).sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0]));
                                const preview = lesson1Phase4SelectedStudent || users[0] || '';
                                // Define the expected structure for phaseData[4]
                                type Phase4ReviewData = {
                                  clarity?: string;
                                  evidence?: string;
                                  actionability?: string;
                                  honesty?: string;
                                  strength?: string;
                                  suggestion?: string;
                                  peerReviewer?: string;
                                  [key: string]: any; // fallback for any additional fields
                                };
                                
                                const d: Phase4ReviewData = preview ? all[preview]?.phaseData?.[4] || {} : {};
                                const rows = [
                                  ['1. CLARITY: Can you understand their finding and recommendation without asking questions?', d.clarity || ''],
                                  ['2. EVIDENCE: Is their recommendation clearly supported by their r value and interpretation?', d.evidence || ''],
                                  ['3. ACTIONABILITY: Could a stakeholder actually implement this recommendation?', d.actionability || ''],
                                  ['4. HONESTY: Did they acknowledge limitations of their data?', d.honesty || ''],
                                  ['ONE STRENGTH of their work:', d.strength || ''],
                                  ['ONE SUGGESTION for improvement:', d.suggestion || ''],
                                  ['Username of Peer reviewer:', d.peerReviewer || ''],
                                ];
                                return rows.map((r, idx) => (<tr key={idx}><td style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{r[0]}</td><td style={{ whiteSpace: 'pre-wrap' }}>{r[1]}</td></tr>));
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 2: Reflection and Final Submission */}
                    {phase4Activity === 'act2' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Reflection and Final Submission</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => { const complete = getPhase4CompleteAll(); const all = getAllLesson1States(); const rows = Object.keys(complete).map(u=>({ username: u, data: all[u]?.phaseData?.[4] || {} })); downloadCSV(rows as any, 'lesson1_phase4_reflection.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Reflection and Final Submission')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students reflect on their Lesson 1 journey.</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                          <select className="class-filter" value={lesson1Phase4SelectedStudent} onChange={(e) => setLesson1Phase4SelectedStudent(e.target.value)}>
                            <option value="">All Students (who completed)</option>
                            {Object.keys(getLesson3Phase4CompleteAll()).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0])).map(u=> <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th style={{ width: '45%' }}>Prompt</th>
                                <th>Student Answer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const all = getAllLesson1States();
                                const complete = getPhase4CompleteAll();
                                const users = Object.keys(complete).sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0]));
                                const preview = lesson1Phase4SelectedStudent || users[0] || '';
                                const d = preview ? all[preview]?.phaseData?.[4] || {} : {};
                                const rows = [
                                  ['1. How confident am I in my correlation calculation?', (d as any).reflection?.confidence || ''],
                                  ['2. What contributed to this confidence level?', (d as any).reflection?.contributed || ''],
                                  ['3. What was most challenging about this project?', (d as any).reflection?.challenging || ''],
                                  ['4a. Statistics:', (d as any).reflection?.stats || ''],
                                  ['4b. Climate:', (d as any).reflection?.climate || ''],
                                  ['4c. The connection between them:', (d as any).reflection?.connection || ''],
                                  ['5. If I could extend this project, I would investigate:', (d as any).reflection?.extend || ''],
                                  ['6. One thing I learned about myself as a learner:', (d as any).reflection?.learned || ''],
                                ];
                                return rows.map((r, idx) => (<tr key={idx}><td style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{r[0]}</td><td style={{ whiteSpace: 'pre-wrap' }}>{r[1]}</td></tr>));
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 3: Submission of Final Outputs */}
                    {phase4Activity === 'act3' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Submission of Final Outputs</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => { const complete = getPhase4CompleteAll(); const all = getAllLesson1States(); const rows = Object.keys(complete).map(u=>({ username: u, data: all[u]?.phaseData?.[4] || {} })); downloadCSV(rows as any, 'lesson1_phase4_submission.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Submission of Final Outputs')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students submit their final outputs depending on the type or format they chose.</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                          <select className="class-filter" value={lesson1Phase4SelectedStudent} onChange={(e) => setLesson1Phase4SelectedStudent(e.target.value)}>
                            <option value="">All Students (who completed)</option>
                            {Object.keys(getPhase4CompleteAll()).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0])).map(u=> <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>

                        <div style={{ aspectRatio: '16/9', background: '#f6f7fb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {(() => {
                            const all = getAllLesson1States();
                            const complete = getPhase4CompleteAll();
                            const users = Object.keys(complete).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0]));
                            const username = lesson1Phase4SelectedStudent || users[0] || '';
                            const d: any = username ? all[username]?.phaseData?.[4] || {} : {};
                            const upload = d?.upload || d?.uploadUrl ? (d.upload || { url: d.uploadUrl, mimeType: d.mimeType }) : null;
                            const url = upload?.url || '';
                            const mime = upload?.mimeType || '';
                            if (!url) return 'Preview frame (student upload preview)';
                            if (mime?.includes('pdf') || url.endsWith('.pdf')) {
                              return <iframe src={url} title={`preview-${username}`} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6 }} />;
                            }
                            if (mime?.startsWith('image') || url.startsWith('data:image') || /\.(png|jpe?g|gif|webp)$/i.test(url)) {
                              return <img src={url} alt={`preview-${username}`} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 6 }} />;
                            }
                            return <iframe src={url} title={`preview-${username}`} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6 }} />;
                          })()}
                        </div>

                        <div style={{ marginTop: 12, padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #e6eef0' }}>
                          <div style={{ fontWeight: 800, marginBottom: 8 }}>Scoring Rubric</div>
                          {(() => {
                            const criteria = [
                              'CALCULATION ACCURACY', 'INTERPRETATION', 'PATTERN ANALYSIS', 'DATA RELIABILITY EVALUATION', 'EVIDENCE-BASED CONCLUSIONS', 'ACTIONABLE RECOMMENDATION', 'COMMUNICATION CLARITY', 'REFLECTION ON PROCESS'
                            ];
                            const optionsList: string[][] = [
                              [
                                'r value incorrect or calculation process has major errors',
                                'r correctly calculated using appropriate method; minor errors in process',
                                'r calculated both manually and digitally with verification; all steps shown accurately'
                              ],
                              [
                                'Misidentifies strength or direction; interpretation unclear',
                                'Correctly identifies strength and direction; explains meaning in context',
                                'Thorough interpretation with nuanced understanding; connects to climate patterns effectively'
                              ],
                              [
                                'Patterns not clearly identified; limited use of visual/numerical evidence',
                                'Patterns identified and described using scatter plot and r value',
                                'Sophisticated pattern analysis; discusses seasonal variations, outliers, or subgroup differences'
                              ],
                              [
                                'No discussion of limitations or data quality',
                                'Acknowledges at least 2 limitations (sample size, time period, missing variables)',
                                'Critical evaluation of data quality with specific implications for confidence in findings'
                              ],
                              [
                                'Conclusions not clearly supported by data; confuses correlation with causation',
                                'Conclusions logically follow from data; distinguishes between correlation and causation',
                                'Nuanced conclusions acknowledging what data does and does not show; considers alternative explanations'
                              ],
                              [
                                'No clear recommendation OR recommendation not connected to finding',
                                'Specific, stakeholder-focused recommendation with clear justification',
                                'Highly actionable recommendation with detailed implementation guidance; addresses potential challenges'
                              ],
                              [
                                'Output disorganized; findings unclear; poor visual/written presentation',
                                'Clear organization; findings communicated effectively; appropriate visuals',
                                'Professional-quality output; compelling presentation; excellent integration of text, data, visuals'
                              ],
                              [
                                'Minimal reflection on assumptions, uncertainties, or learning',
                                'Reflects on analytical assumptions and uncertainties; identifies learning growth',
                                'Deep metacognitive reflection; discusses how experience changed understanding of statistics and climate'
                              ]
                            ];
                            return (
                              (() => {
                                const username = lesson1Phase4SelectedStudent || Object.keys(getPhase4CompleteAll())[0] || '';
                                const allStudents = classes.flatMap(c => c.students || []);
                                const found = allStudents.find(s => s.username === username);
                                const studentDisplay = found ? `${found.name} (${username})` : (username || '');
                                return <ScoringTable criteria={criteria} options={optionsList} studentDisplay={studentDisplay} onRecord={(selections) => {
                                  const scores = selections.map(s => (s === 0 ? 2 : s === 1 ? 3 : 4));
                                  const total = scores.reduce((a,b)=>a+b,0);
                                  const usernameInner = lesson1Phase4SelectedStudent || Object.keys(getPhase4CompleteAll())[0] || '';
                                  if (!usernameInner) { alert('No student selected'); return; }
                                  try { setPhaseScore(usernameInner, 4, total); alert('Recorded score: ' + total); } catch (e) { alert('Failed to save score'); }
                                }} />
                              })()
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* --- Phase 2 layout: vertical activity tabs + content panel --- */}
              {lessonPhase === 'phase2' && (
                <div className="lesson-layout">
                  <aside className="activity-list">
                    <button className={`activity ${phase1Activity === 'a1' ? 'active' : ''}`} onClick={() => setPhase1Activity('a1')}>Activity 1</button>
                    <button className={`activity ${phase1Activity === 'a2' ? 'active' : ''}`} onClick={() => setPhase1Activity('a2')}>Activity 2</button>
                    <button className={`activity ${phase1Activity === 'a3' ? 'active' : ''}`} onClick={() => setPhase1Activity('a3')}>Activity 3a</button>
                    <button className={`activity ${phase1Activity === 'a4' ? 'active' : ''}`} onClick={() => setPhase1Activity('a4')}>Activity 3b</button>
                    <button className={`activity ${phase1Activity === 'a5' ? 'active' : ''}`} onClick={() => setPhase1Activity('a5')}>Activity 4a</button>
                    <button className={`activity ${phase1Activity === 'a6' ? 'active' : ''}`} onClick={() => setPhase1Activity('a6')}>Activity 4b</button>
                  </aside>

                  <section className="activity-panel">
                    {/* Phase2 - Activity1 */}
                    {phase1Activity === 'a1' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title">Activity 1: Understand Scatter Plots</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => {
                                const all = getPhase2Activity1All();
                                const rows = studentsForSelected.map(s => ({ name: s.name, username: s.username, answers: (all[s.username]?.answers || Array(6).fill('')), score: all[s.username]?.score ?? '' }));
                                downloadCSV(rows, 'phase2-activity1.csv');
                              }} className="download-btn">Download CSV</button>
                              <button onClick={() => {}} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>
                        <p className="activity-desc">Description: <br /> In this activity, students read the short explanation of scatter plots and their common patterns, study the visual guides that show what each pattern looks like, and practice by identifying the pattern shown in each sample scatter plot.</p>
                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Timestamp (Submit)</th>
                                {Array.from({ length: 6 }, (_, i) => <th key={i}>S{i+1}</th>)}
                                <th>Score</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const all = getPhase2Activity1All();
                                const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                                return studentsForSelected.slice().sort((a,b)=> a.name.localeCompare(b.name)).map(s => {
                                  const entry = (all || {})[s.username] as any || {};
                                  const rawTs = entry.timestamp || '';
                                  let tsDisplay = '';
                                  if (rawTs) {
                                    try {
                                      const d = new Date(rawTs);
                                      const m = monthNames[d.getMonth()];
                                      const dd = String(d.getDate()).padStart(2,'0');
                                      const yyyy = d.getFullYear();
                                      const hh = String(d.getHours()).padStart(2,'0');
                                      const mm = String(d.getMinutes()).padStart(2,'0');
                                      const ss = String(d.getSeconds()).padStart(2,'0');
                                      tsDisplay = `${m} ${dd}, ${yyyy} - ${hh}:${mm}:${ss}`;
                                    } catch (e) { tsDisplay = rawTs; }
                                  }
                                  const answers = entry.answers || Array(6).fill('');
                                  const score = typeof entry.score === 'number' ? entry.score : (entry.score ?? '');
                                  return (
                                    <tr key={s.id}>
                                      <td>{s.name}</td>
                                      <td>{tsDisplay}</td>
                                      {answers.map((ans:any, idx:any)=>(<td key={idx}>{ans}</td>))}
                                      <td>{score}</td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Phase2 - Activity2 */}
                    {phase1Activity === 'a2' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title">Activity 2: Guided Pearson r Practice</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => { const all=getPhase2Activity2All(); const rows = studentsForSelected.map(s=>({name:s.name,username:s.username, payload: all[s.username]||{} })); downloadCSV(rows,'phase2-activity2.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => {}} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>
                        <p className="activity-desc">Description: <br /> In this activity, students follow the step-by-step interactive guide on the screen, complete each step before moving to the next one, and enter values where prompted and observe how each step affects the final result.</p>
                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Variable 1 (x)</th>
                                <th>Variable 2 (y)</th>
                                <th>Step1</th>
                                <th>Step2</th>
                                <th>Step3</th>
                                <th>Step5</th>
                                <th>Step7</th>
                                <th>Step9</th>
                                <th>Encoded</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const extra = getPhase2Activity2AnswersAll();
                                const meta = getPhase2Activity2All();
                                return studentsForSelected.slice().sort((a,b)=> a.name.localeCompare(b.name)).map(s => {
                                  const e: any = extra[s.username] || {};
                                  const m: any = meta[s.username] || {};
                                  const steps: any = e.steps || {};
                                  return (
                                    <tr key={s.id}>
                                      <td>{s.name}</td>
                                      <td>{m.var1 || ''}</td>
                                      <td>{m.var2 || ''}</td>
                                      <td>{steps.n || ''}</td>
                                      <td>{steps.xSum || ''}</td>
                                      <td>{steps.ySum || ''}</td>
                                      <td>{steps.xySum || ''}</td>
                                      <td>{steps.xSqSum || ''}</td>
                                      <td>{steps.ySqSum || ''}</td>
                                      <td>{e.answer || ''}</td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Phase2 - Activity3a */}
                    {phase1Activity === 'a3' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title">Activity 3a: Spreadsheet Pearson r (PDF Outputs)</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => { const all = getPhase2Activity3All(); const rows = studentsForSelected.map(s=>({name:s.name, username:s.username, meta: all[s.username]||{}})); downloadCSV(rows,'phase2-activity3a.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => {}} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>
                        <p className="activity-desc">Description: <br /> In this activity, students calculate Pearson r again, this time using a spreadsheet tool.</p>
                        <div style={{ marginTop: 12 }}>
                          <div style={{ marginBottom: 8 }}>
                            <select className="class-filter" value={phase2A3SelectedStudent} onChange={(e)=> setPhase2A3SelectedStudent(e.target.value)}>
                              <option value="">All Students (who finalized)</option>
                              {studentsForSelected.slice().sort((a,b)=> a.name.localeCompare(b.name)).map(s => <option key={s.username} value={s.username}>{s.name}</option>)}
                            </select>
                          </div>
                          <div style={{ aspectRatio: '16/9', background: '#f6f7fb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {(() => {
                              const all = getPhase2Activity3All();
                              const entry: any = (phase2A3SelectedStudent ? all[phase2A3SelectedStudent] : null) || null;
                              const url = entry ? (entry.uploadUrl || entry.file || entry.pdf || '') : '';
                              if (!url) return 'Preview frame (PDF)';
                              const isPdf = (entry && entry.mimeType && (entry.mimeType as string).includes('pdf')) || String(url).startsWith('data:application/pdf');
                              return isPdf ? <iframe src={url} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6 }} /> : <img src={url} style={{ maxWidth: '100%', maxHeight: '100%' }} />;
                            })()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Phase2 - Activity3b */}
                    {phase1Activity === 'a4' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title">Activity 3b: Spreadsheet Pearson r (Self-Assessment)</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => { const all = getPhase2SelfAssessAll(); const rows = studentsForSelected.map(s=>({name:s.name, username:s.username, answers: all[s.username]?.answers || [] })); downloadCSV(rows,'phase2-activity3b.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => {}} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>
                        <p className="activity-desc">Description: <br /> In this activity, students reflect on their spreadsheet skills.</p>
                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Timestamp (Submit)</th>
                                {Array.from({ length: 5 }, (_, i) => <th key={i}>Q{i+1}</th>)}
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const all = getPhase2SelfAssessAll();
                                const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                                return studentsForSelected.slice().sort((a,b)=> a.name.localeCompare(b.name)).map(s => {
                                  const entry: any = all[s.username] || {};
                                  let tsDisplay = '';
                                  if (entry.timestamp) {
                                    try {
                                      const d = new Date(entry.timestamp);
                                      const m = monthNames[d.getMonth()];
                                      const dd = String(d.getDate()).padStart(2,'0');
                                      const yyyy = d.getFullYear();
                                      const hh = String(d.getHours()).padStart(2,'0');
                                      const mm = String(d.getMinutes()).padStart(2,'0');
                                      const ss = String(d.getSeconds()).padStart(2,'0');
                                      tsDisplay = `${m} ${dd}, ${yyyy} - ${hh}:${mm}:${ss}`;
                                    } catch (e) { tsDisplay = entry.timestamp; }
                                  }
                                  return (
                                    <tr key={s.id}><td>{s.name}</td><td>{tsDisplay}</td>{(entry.answers || Array(5).fill('')).map((v:any, i:any)=>(<td key={i}>{v}</td>))}</tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Phase2 - Activity4a */}
                    {phase1Activity === 'a5' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title">Activity 4a: Interpret Your Pearson r Value (Quiz)</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => { const all = getPhase2Activity4CheckAll(); const rows = studentsForSelected.map(s=>({name:s.name, username:s.username, checked: all[s.username]?.checked || false })); downloadCSV(rows,'phase2-activity4a.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => {}} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>
                        <p className="activity-desc">Description: <br /> In this activity, students study the interpretation table that explains what different r values mean, locate their computed r value in the table, and interpret what their result says about the relationship between their chosen climate variables.</p>
                        <div className="table-wrap">
                          <table className="results-table">
                            <thead><tr><th>Name</th><th>Timestamp</th><th>Strength answers</th><th>Direction answers</th><th>Score</th></tr></thead>
                            <tbody>{(() => {
                              const all = getPhase2Activity4CheckAll();
                              return studentsForSelected.slice().sort((a,b)=> a.name.localeCompare(b.name)).map(s=>{
                                const entry: any = all[s.username] || {};
                                let tsDisplay = '';
                                if (entry.timestamp) {
                                  try {
                                    const d = new Date(entry.timestamp);
                                    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                                    const m = months[d.getMonth()];
                                    const dd = String(d.getDate()).padStart(2,'0');
                                    const yyyy = d.getFullYear();
                                    const hh = String(d.getHours()).padStart(2,'0');
                                    const mm = String(d.getMinutes()).padStart(2,'0');
                                    const ss = String(d.getSeconds()).padStart(2,'0');
                                    tsDisplay = `${m} ${dd}, ${yyyy} - ${hh}:${mm}:${ss}`;
                                  } catch (e) { tsDisplay = entry.timestamp; }
                                }
                                const strength = Array.isArray(entry.strength) ? entry.strength.join('; ') : '';
                                const direction = Array.isArray(entry.direction) ? entry.direction.join('; ') : '';
                                return (<tr key={s.id}><td>{s.name}</td><td>{tsDisplay}</td><td>{strength}</td><td>{direction}</td><td>{''}</td></tr>);
                              });
                            })()}</tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Phase2 - Activity4b */}
                    {phase1Activity === 'a6' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title">Activity 4b: Interpret Your Pearson r Value (Interpretation)</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => { const all = getPhase2Activity4InterpAll(); const rows = studentsForSelected.map(s=>({name:s.name, username:s.username, interp: all[s.username]?.interp || '' })); downloadCSV(rows,'phase2-activity4b.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => {}} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>
                        <p className="activity-desc">Description: <br /> In this activity, students study the interpretation table that explains what different r values mean, locate their computed r value in the table, and interpret what their result says about the relationship between their chosen climate variables.</p>
                        <div className="table-wrap">
                          <table className="results-table">
                            <thead><tr><th>Name</th><th>Timestamp</th><th>Variable 1</th><th>Variable 2</th><th>Research Question</th><th>Computed r</th><th>Strength</th><th>Direction</th><th>Interpretation</th></tr></thead>
                            <tbody>{(() => {
                              const all = getPhase2Activity4InterpAllDetailed ? getPhase2Activity4InterpAllDetailed() : {};
                              return studentsForSelected.slice().sort((a,b)=> a.name.localeCompare(b.name)).map(s=>{
                                const entry: any = all[s.username] || {};
                                let tsDisplay = '';
                                if (entry.timestamp) {
                                  try {
                                    const d = new Date(entry.timestamp);
                                    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                                    const m = months[d.getMonth()];
                                    const dd = String(d.getDate()).padStart(2,'0');
                                    const yyyy = d.getFullYear();
                                    const hh = String(d.getHours()).padStart(2,'0');
                                    const mm = String(d.getMinutes()).padStart(2,'0');
                                    const ss = String(d.getSeconds()).padStart(2,'0');
                                    tsDisplay = `${m} ${dd}, ${yyyy} - ${hh}:${mm}:${ss}`;
                                  } catch (e) { tsDisplay = entry.timestamp; }
                                }
                                const var1 = entry.var1 || '';
                                const var2 = entry.var2 || '';
                                const question = entry.question || '';
                                const computedR = entry.computedR || '';
                                const strength = entry.strength || '';
                                const direction = entry.direction || '';
                                const interp = entry.interp || '';
                                return (<tr key={s.id}><td>{s.name}</td><td>{tsDisplay}</td><td>{var1}</td><td>{var2}</td><td>{question}</td><td>{computedR}</td><td>{strength}</td><td>{direction}</td><td>{interp}</td></tr>);
                              });
                            })()}</tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* --- Phase 3 layout: left vertical activities, right content panel --- */}
              {lessonPhase === 'phase3' && (
                <div className="lesson-layout">
                  <aside className="activity-list">
                    <button className={`activity ${phase3Activity === 'act1' ? 'active' : ''}`} onClick={() => setPhase3Activity('act1')}>Activity 1</button>
                    <button className={`activity ${phase3Activity === 'act2' ? 'active' : ''}`} onClick={() => setPhase3Activity('act2')}>Activity 2</button>
                    <button className={`activity ${phase3Activity === 'act3' ? 'active' : ''}`} onClick={() => setPhase3Activity('act3')}>Activity 3</button>
                  </aside>

                  <section className="activity-panel">
                    {/* Activity 1: Relating Findings to Real-World */}
                    {phase3Activity === 'act1' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 1: Relating Findings to Real-World</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => {
                                const allStates = getAllLesson1States();
                                const finish = getPhase3FinishAll();
                                const rows = Object.keys(finish).map(username => ({ username, state: allStates[username] || {} }));
                                // Extend the type to include part1_r and part1_interp for type safety
                                type Phase3FinishData = {
                                  part1_r?: string;
                                  part1_interp?: string;
                                  r?: string;
                                  interp?: string;
                                  [key: string]: any;
                                };
                                // flatten rows into CSV-friendly format (username + simple fields)
                                const csvRows = rows.map(r => {
                                  const data = r.state.phaseData?.[3] as Phase3FinishData || {};
                                  return {
                                    username: r.username,
                                    r: data.part1_r ?? data.r ?? '',
                                    interp: data.part1_interp ?? data.interp ?? ''
                                  };
                                });
                                downloadCSV(csvRows as any, 'lesson1_phase3_activity1.csv');
                              }} className="download-btn">Download CSV</button>
                              <button onClick={() => {
                                downloadPDF('Activity 1: Relating Findings to Real-World');
                              }} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students complete the critical analysis worksheet.</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                          <select className="class-filter" value={p3Act1SelectedUser} onChange={(e) => setP3Act1SelectedUser(e.target.value)}>
                            <option value="">All Students (who finished)</option>
                            {Object.keys(getPhase3FinishAll()).slice().sort((a,b)=>{
                              const as = a.split(' ').slice(-1)[0].toLowerCase();
                              const bs = b.split(' ').slice(-1)[0].toLowerCase();
                              return as.localeCompare(bs);
                            }).map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th style={{ width: '45%' }}>Question / Prompt</th>
                                <th>Student Answer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const all = getAllLesson1States();
                                const finish = getPhase3FinishAll();
                                // choose first finished student as default preview
                                const usernames = Object.keys(finish).sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0]));
                                const previewUser = p3Act1SelectedUser || usernames[0] || '';
                                const data = previewUser ? all[previewUser]?.phaseData?.[3] || {} : {};
                                // Extend the type to include part1_r and part1_interp for type safety
                                type Phase3FinishData = {
                                  part1_r?: string;
                                  part1_interp?: string;
                                  part2_reason?: string;
                                  part2_exp1?: string;
                                  part2_evid1?: string;
                                  part2_exp2?: string;
                                  part2_evid2?: string;
                                  part2_plausible?: string;
                                  part3_causation?: string;
                                  part3_factors?: string;
                                  part4_concern?: string;
                                  part4_confidence?: string;
                                  stakeholders?: string[];
                                  linkage?: string;
                                  recommendation?: string;
                                  [key: string]: any;
                                };
                                const rows = [
                                  ['PART 1: What Your Data Shows', ''],
                                  ['My correlation coefficient: r =', (data as Phase3FinishData).part1_r || ''],
                                  ['Interpretation:', (data as Phase3FinishData).part1_interp || ''],
                                  ['PART 2: Explaining the Pattern', ''],
                                  ['Why might these variables be related?', (data as Phase3FinishData).part2_reason || ''],
                                  ['Possible Explanation 1:', (data as Phase3FinishData).part2_exp1 || ''],
                                  ['Supporting Evidence', (data as Phase3FinishData).part2_evid1 || ''],
                                  ['Possible Explanation 2:', (data as Phase3FinishData).part2_exp2 || ''],
                                  ['Supporting Evidence', (data as Phase3FinishData).part2_evid2 || ''],
                                  ['Which explanation seems most plausible? Why?', (data as Phase3FinishData).part2_plausible || ''],
                                  ['PART 3: What Your Data DOESN\'T Show', ''],
                                  ['Does correlation prove causation here?', (data as Phase3FinishData).part3_because || ''],
                                  ['What other factors might influence this relationship?', [ (data as Phase3FinishData).part3_factor1 || '', (data as Phase3FinishData).part3_factor2 || '' ].filter(Boolean).join('; ') || ''],
                                  ['PART 4: Data Quality and Limitations', ''],
                                  ['My biggest concern about data reliability:', (data as Phase3FinishData).part4_concern || ''],
                                  ['How does this limitation affect my confidence in the findings?', (data as Phase3FinishData).part4_confidence || ''],
                                ];
                                return rows.map((r, idx) => (<tr key={idx}><td style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{r[0]}</td><td>{r[1]}</td></tr>));
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 2: Analyzing Key Stakeholders */}
                    {phase3Activity === 'act2' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 2: Analyzing Key Stakeholders</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => { const all = getAllLesson1States(); const ws = getPhase3WorksheetAll(); const rows = Object.keys(ws).map(u=>({ username: u, state: all[u]?.phaseData?.[3] || {} })); downloadCSV(rows as any, 'lesson1_phase3_activity2.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 2: Analyzing Key Stakeholders')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>
                        <p className="activity-desc">Description: <br /> In this activity, students complete the stakeholder analysis worksheet.</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                          <select className="class-filter" value={p3Act2SelectedUser} onChange={(e)=> setP3Act2SelectedUser(e.target.value)}>
                            <option value="">All Students (who submitted)</option>
                            {Object.keys(getPhase3WorksheetAll()).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0])).map(u=> <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th style={{ width: '45%' }}>Question / Prompt</th>
                                <th>Student Answer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const all = getAllLesson1States();
                                const ws = getPhase3WorksheetAll();
                                const usernames = Object.keys(ws).sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0]));
                                const preview = p3Act2SelectedUser || usernames[0];
                                // Extend the type to include all expected fields
                                type Phase3WorksheetData = {
                                  sa_question?: string;
                                  sa_rvalue?: string;
                                  sa_interp?: string;
                                  sa_stakeholders?: Array<{ name?: string } | string>;
                                  sa_matters_to?: string;
                                  sa_because?: string;
                                  sa_decisions?: string[];
                                  [key: string]: any;
                                };
                                const d: Phase3WorksheetData = preview ? all[preview]?.phaseData?.[3] || {} : {};
                                const rows = [
                                  ['Our research question:', d.sa_question || ''],
                                  ['Our r value:', d.sa_rvalue || ''],
                                  ['Interpretation:', d.sa_interp || ''],
                                  ['PART 1: Identify Potential Stakeholders', ''],
                                  ['Who in our community might care about this relationship?\n1.\n2.\n3.', (d.sa_stakeholders || []).map((s:any)=> typeof s === 'string' ? s : (s?.name || '')).filter(Boolean).join('\n')],
                                  ['PART 2: Why It Matters to Them', ''],
                                  ['Choose ONE stakeholder and explain: This relationship matters to: because:', ((d.sa_matters_to || '') + (d.sa_because ? ('\n\n' + d.sa_because) : '')) || ''],
                                  ['PART 3: Current Decisions This Affects', ''],
                                  ['What decisions does this stakeholder make that could be informed by your finding?\n1.\n2.', (d.sa_decisions || []).join('\n')],
                                ];
                                return rows.map((r, idx) => (<tr key={idx}><td style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{r[0]}</td><td style={{ whiteSpace: 'pre-wrap' }}>{r[1]}</td></tr>));
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 3: Building Evidence-Based Recommendation */}
                    {phase3Activity === 'act3' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 3: Building Evidence-Based Recommendation</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => { const all = getAllLesson1States(); const rec = getPhase3RecommendationAll(); const rows = Object.keys(rec).map(u=>({ username: u, state: all[u]?.phaseData?.[3] || {} })); downloadCSV(rows as any, 'lesson1_phase3_activity3.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 3: Building Evidence-Based Recommendation')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>
                        <p className="activity-desc">Description: <br /> In this activity, students complete the recommendation template.</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                          <select className="class-filter" value={p3Act3SelectedUser} onChange={(e)=> setP3Act3SelectedUser(e.target.value)}>
                            <option value="">All Students (who finalized)</option>
                            {Object.keys(getPhase3RecommendationAll()).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0])).map(u=> <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th style={{ width: '45%' }}>Template Field</th>
                                <th>Student Answer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const all = getAllLesson1States();
                                const rec = getPhase3RecommendationAll();
                                const usernames = Object.keys(rec).sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0]));
                                const preview = p3Act3SelectedUser || usernames[0] || '';
                                // Extend the type to include all expected fields for recommendation (student-side keys prefixed with rec_)
                                type Phase3RecommendationData = {
                                  rec_to?: string;
                                  rec_from?: string;
                                  rec_re?: string;
                                  rec_date?: string;
                                  rec_var1?: string;
                                  rec_var2?: string;
                                  rec_strength?: string;
                                  rec_rvalue?: string;
                                  rec_meaning?: string;
                                  rec_aspect?: string;
                                  rec_means_for?: string;
                                  rec_significance?: string;
                                  rec_action?: string;
                                  rec_justification?: string;
                                  rec_limitations?: string;
                                  rec_strengthen?: string;
                                  rec_conclusion?: string;
                                  [key: string]: any;
                                };
                                const d: Phase3RecommendationData = preview ? all[preview]?.phaseData?.[3] || {} : {};
                                const finalized = !!(rec && preview && rec[preview]?.finalized);
                                const rows = [
                                  ['TO:', finalized ? (d.rec_to || '') : ''],
                                  ['FROM:', finalized ? (d.rec_from || '') : ''],
                                  ['RE:', finalized ? (d.rec_re || '') : ''],
                                  ['DATE:', finalized ? (d.rec_date || '') : ''],
                                  ['EXECUTIVE SUMMARY', ''],
                                  ['Variable 1:', finalized ? (d.rec_var1 || '') : ''],
                                  ['Variable 2:', finalized ? (d.rec_var2 || '') : ''],
                                  ['Strength and direction:', finalized ? (d.rec_strength || '') : ''],
                                  ['R value:', finalized ? (d.rec_rvalue || '') : ''],
                                  ['What the data means:', finalized ? (d.rec_meaning || '') : ''],
                                  ['WHAT THIS MEANS FOR', ''],
                                  ['Stakeholder:', finalized ? (d.rec_means_for || '') : ''],
                                  ['Answer:', finalized ? (d.rec_significance || '') : ''],
                                  ['RECOMMENDATION', finalized ? (d.rec_action || '') : ''],
                                  ['JUSTIFICATION', finalized ? (d.rec_justification || '') : ''],
                                  ['LIMITATIONS & CAUTIONS', finalized ? (d.rec_limitations || '') : ''],
                                  ['STRENGTHENING THE EVIDENCE', finalized ? (d.rec_strengthen || '') : ''],
                                  ['CONCLUSION:', finalized ? (d.rec_conclusion || '') : ''],
                                ];
                                return rows.map((r, idx) => (<tr key={idx}><td style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{r[0]}</td><td style={{ whiteSpace: 'pre-wrap' }}>{r[1]}</td></tr>));
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* For other lesson phases, keep simple placeholder */}
              {(lessonPhase !== 'phase1' && lessonPhase !== 'phase2' && lessonPhase !== 'phase3' && lessonPhase !== 'phase4') && (
                <div className="phase-content">{/* left empty for now */}</div>
              )}
            </div>
          </div>
        )}

        {activeSub === 'lesson2' && (
          <div className="subpage">
            <div className="subpage-header">
              <h3 className="subpage-title">Lesson 2: Climate Linear Regression Equations</h3>
            </div>
            <div className="lesson-phases">
              <div className="phase-tabs">
                <button className={`phase ${lesson2Phase === 'phase1' ? 'active' : ''}`} onClick={() => setLesson2Phase('phase1')}>Phase 1</button>
                <button className={`phase ${lesson2Phase === 'phase2' ? 'active' : ''}`} onClick={() => setLesson2Phase('phase2')}>Phase 2</button>
                <button className={`phase ${lesson2Phase === 'phase3' ? 'active' : ''}`} onClick={() => setLesson2Phase('phase3')}>Phase 3</button>
                <button className={`phase ${lesson2Phase === 'phase4' ? 'active' : ''}`} onClick={() => setLesson2Phase('phase4')}>Phase 4</button>
              </div>

              {lesson2Phase === 'phase1' && (
                <div className="lesson-layout">
                  <aside className="activity-list">
                    <button className={`activity ${lesson2Phase1Activity === 'a1a' ? 'active' : ''}`} onClick={() => setLesson2Phase1Activity('a1a')}>Activity 1a</button>
                    <button className={`activity ${lesson2Phase1Activity === 'a1b' ? 'active' : ''}`} onClick={() => setLesson2Phase1Activity('a1b')}>Activity 1b</button>
                    <button className={`activity ${lesson2Phase1Activity === 'a2a' ? 'active' : ''}`} onClick={() => setLesson2Phase1Activity('a2a')}>Activity 2a</button>
                    <button className={`activity ${lesson2Phase1Activity === 'a2b' ? 'active' : ''}`} onClick={() => setLesson2Phase1Activity('a2b')}>Activity 2b</button>
                    <button className={`activity ${lesson2Phase1Activity === 'a3' ? 'active' : ''}`} onClick={() => setLesson2Phase1Activity('a3')}>Activity 3</button>
                    <button className={`activity ${lesson2Phase1Activity === 'a4' ? 'active' : ''}`} onClick={() => setLesson2Phase1Activity('a4')}>Activity 4</button>
                  </aside>

                  <section className="activity-panel">
                    {/* Activity 1a */}
                    {lesson2Phase1Activity === 'a1a' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 1a: Climate Change Observation (Scenarios)</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => downloadCSV(tableRows, 'lesson2_phase1_activity1a.csv')} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 1a: Climate Change Observation (Scenarios)')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>
                        <p className="activity-desc">Description: <br /> In this activity, students view each image carefully, note what climate-related change or impact is being shown, and encode their observations.</p>
                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                {Array.from({ length: 8 }, (_, i) => <th key={i}>Scenario {i+1}</th>)}
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const allObs = getLesson2Phase1Activity1All();
                                return studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0])).map(s => (
                                  <tr key={s.id}>
                                    <td>{s.name}</td>
                                    {Array.from({ length: 8 }).map((_,i) => {
                                      const entry = (allObs || {})[s.username] ? (allObs[s.username] as any)[i+1] : null;
                                      const cell = entry ? `Obs: ${entry.obs || ''}\nAffected: ${entry.affected || ''}\nCauses: ${entry.causes || ''}` : '';
                                      return <td key={i} style={{ whiteSpace: 'pre-wrap', maxWidth: 320 }}>{cell}</td>;
                                    })}
                                  </tr>
                                ));
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 1b */}
                    {lesson2Phase1Activity === 'a1b' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 1b: Climate Change Observation (Questions)</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => downloadCSV(tableRows, 'lesson2_phase1_activity1b.csv')} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 1b: Climate Change Observation (Questions)')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>
                        <p className="activity-desc">Description: <br /> In this activity, students view each image carefully, note what climate-related change or impact is being shown, and encode their observations.</p>
                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Most Urgent Scenario</th>
                                <th>Question 1</th>
                                <th>Question 2</th>
                                <th>Question 3 (Optional)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const allb = getLesson2Phase1Activity1bAll();
                                return studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0])).map(s => {
                                  const entry = (allb || {})[s.username] || {} as any;
                                  return (<tr key={s.id}><td>{s.name}</td><td style={{ whiteSpace: 'pre-wrap' }}>{entry.mostUrgent || ''}</td><td style={{ whiteSpace: 'pre-wrap' }}>{entry.q1 || ''}</td><td style={{ whiteSpace: 'pre-wrap' }}>{entry.q2 || ''}</td><td style={{ whiteSpace: 'pre-wrap' }}>{entry.q3 || ''}</td></tr>);
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 2a */}
                    {lesson2Phase1Activity === 'a2a' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 2a: Variable Exploration & Identification (Checkpoints)</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => downloadCSV(tableRows, 'lesson2_phase1_activity2a.csv')} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 2a: Variable Exploration & Identification (Checkpoints)')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>
                        <p className="activity-desc">Description: <br /> In this activity, students watch a video on the concept of Regression Analysis, investigate different climate-related variables, and distinguish between independent variables (factors that influence change) and dependent variables (outcomes that are affected).</p>
                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                {Array.from({ length: 5 }, (_, i) => <th key={i}>Question {i+1}</th>)}
                                <th>Score Earned</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const all = getLesson2Phase1Activity2All();
                                return studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0])).map(s => {
                                  const rec = all[s.username] || { answers: [], score: '' } as any;
                                  const answers = Array.isArray(rec.answers) ? rec.answers.slice(0,5) : Array.from({ length: 5 }, () => '');
                                  const score = typeof rec.score === 'number' ? rec.score : '';
                                  return (<tr key={s.id}><td>{s.name}</td>{answers.map((ans:any, i:number)=>(<td key={i} style={{ whiteSpace: 'pre-wrap' }}>{ans || ''}</td>))}<td>{score}</td></tr>);
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 2b */}
                    {lesson2Phase1Activity === 'a2b' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 2b: Variable Exploration & Identification (Pair of Variables)</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => downloadCSV(tableRows, 'lesson2_phase1_activity2b.csv')} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 2b: Variable Exploration & Identification (Pair of Variables)')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>
                        <p className="activity-desc">Description: <br /> In this activity, students watch a video on the concept of Regression Analysis, investigate different climate-related variables, and distinguish between independent variables (factors that influence change) and dependent variables (outcomes that are affected).</p>
                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                {Array.from({ length: 5 }, (_, i) => <th key={i}>Question {i+1} (IV/DV)</th>)}
                                <th>Score Earned</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const all = getLesson2Phase1Activity2bAll();
                                return studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0])).map(s => {
                                  const rec = all[s.username] || { pairs: [] } as any;
                                  const pairs = Array.isArray(rec.pairs) ? rec.pairs.slice(0,5) : Array.from({ length: 5 }, () => ({ predictor: '', response: '' }));
                                  return (<tr key={s.id}><td>{s.name}</td>{pairs.map((p: any, i: number) => (<td key={i} style={{ whiteSpace: 'pre-wrap' }}>{(p?.predictor || '') + (p?.response ? ' → ' + p.response : '')}</td>))}<td>{''}</td></tr>);
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 3 */}
                    {lesson2Phase1Activity === 'a3' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 3: Climate Variable Selection</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => downloadCSV(tableRows, 'lesson2_phase1_activity3.csv')} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 3: Climate Variable Selection')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>
                        <p className="activity-desc">Description: <br /> In this activity, students choose a specific pair of climate-related variables from the Davao Region that they want to investigate for their regression analysis project and justify their choice.</p>
                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>IV</th>
                                <th>DV</th>
                                <th>Reason</th>
                                <th>Prediction</th>
                                <th>Research Question</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const all = getLesson2Phase1Activity3All();
                                return studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0])).map(s => {
                                  const entry = all[s.username] || {};
                                  return (
                                    <tr key={s.id}>
                                      <td>{s.name}</td>
                                      <td>{entry.var1 || ''}</td>
                                      <td>{entry.var2 || ''}</td>
                                      <td>{entry.reasoning || ''}</td>
                                      <td>{entry.prediction || ''}</td>
                                      <td>{entry.researchQuestion || ''}</td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 4 */}
                    {lesson2Phase1Activity === 'a4' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 4: Exit Ticket</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => downloadCSV(tableRows, 'lesson2_phase1_activity4.csv')} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 4: Exit Ticket')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>
                        <p className="activity-desc">Description: <br /> In this activity, students reflect on what they learned during the lesson by completing a brief exit ticket.</p>
                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Important Learning</th>
                                <th>Confidence</th>
                                <th>Understanding</th>
                                <th>Connection</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0])).map(s => {
                                const all = getLesson2Phase1Activity4All();
                                const rec = all[s.username] || null;
                                return (
                                  <tr key={s.id}>
                                    <td>{s.name}</td>
                                    <td style={{ whiteSpace: 'pre-wrap' }}>{rec ? rec.importantLearning : ''}</td>
                                    <td>{rec ? rec.confidence : ''}</td>
                                    <td>{rec ? rec.understanding : ''}</td>
                                    <td>{rec ? rec.connection : ''}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {lesson2Phase === 'phase2' && (
                <div className="lesson-layout">
                  <aside className="activity-list">
                    <button className={`activity ${lesson2Phase2Activity === 'a1' ? 'active' : ''}`} onClick={() => setLesson2Phase2Activity('a1')}>Activity 1</button>
                    <button className={`activity ${lesson2Phase2Activity === 'a2' ? 'active' : ''}`} onClick={() => setLesson2Phase2Activity('a2')}>Activity 2</button>
                    <button className={`activity ${lesson2Phase2Activity === 'a3' ? 'active' : ''}`} onClick={() => setLesson2Phase2Activity('a3')}>Activity 3</button>
                    <button className={`activity ${lesson2Phase2Activity === 'a4a' ? 'active' : ''}`} onClick={() => setLesson2Phase2Activity('a4a')}>Activity 4a</button>
                    <button className={`activity ${lesson2Phase2Activity === 'a4b' ? 'active' : ''}`} onClick={() => setLesson2Phase2Activity('a4b')}>Activity 4b</button>
                  </aside>

                  <section className="activity-panel">
                    {/* Activity 1 */}
                    {lesson2Phase2Activity === 'a1' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 1: Understanding Regression Lines</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => {
                                const all = getLesson2Phase2Activity1All();
                                const rows = studentsForSelected.map(s => ({ name: s.name, username: s.username, answers: (all[s.username]?.answers || Array(4).fill('')), score: all[s.username]?.score ?? '' }));
                                downloadCSV(rows, 'lesson2_phase2_activity1.csv');
                              }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 1: Understanding Regression Lines')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students watch an instructional video that explains what a regression line is, how it represents the relationship between two variables, and why it's useful for making predictions about climate data.</p>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                {Array.from({ length: 4 }, (_, i) => <th key={i}>Question {i+1}</th>)}
                                <th>Score Earned</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const all = getLesson2Phase2Activity1All();
                                return studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0])).map(s => (
                                  <tr key={s.id}>
                                    <td>{s.name}</td>
                                    {(all[s.username]?.answers || Array(4).fill('')).map((ans:any, idx:any)=>(<td key={idx}>{ans}</td>))}
                                    <td>{all[s.username]?.score ?? ''}</td>
                                  </tr>
                                ));
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 2 */}
                    {lesson2Phase2Activity === 'a2' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 2: Manual Regression Calculation Practice</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                              <div className="download-group">
                              <button onClick={() => { const all = getLesson2Phase2Activity2All(); const rows = studentsForSelected.map(s=>({ name: s.name, username: s.username, payload: all[s.username]||{} })); downloadCSV(rows,'lesson2_phase2_activity2.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 2: Manual Regression Calculation Practice')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students calculate a regression equation by hand using sample climate data.</p>

                        <div style={{ marginTop: 12 }}>
                          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'flex-end' }}>
                            <select className="class-filter" value={lesson2Phase2SelectedStudent} onChange={(e)=>setLesson2Phase2SelectedStudent(e.target.value)}>
                              <option value="">All Students</option>
                              {studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0])).map(s => <option key={s.username} value={s.username}>{s.name}</option>)}
                            </select>
                          </div>
                          <div style={{ aspectRatio: '16/9', background: '#f6f7fb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {(() => {
                              const all = getLesson2Phase2Activity2All();
                              type Activity2Entry = { var1: string; var2: string; r: number; year?: number | "All"; file?: string; pdf?: string; uploadUrl?: string; [key: string]: any };
                              // Add file, pdf, uploadUrl as optional properties to all entries for type safety
                              const entry: any = lesson2Phase2SelectedStudent ? ({
                                ...all[lesson2Phase2SelectedStudent],
                                file: (all[lesson2Phase2SelectedStudent] as any).file,
                                pdf: (all[lesson2Phase2SelectedStudent] as any).pdf,
                                uploadUrl: (all[lesson2Phase2SelectedStudent] as any).uploadUrl
                              }) : null;
                              const url = (entry as any)?.file || (entry as any)?.pdf || (entry as any)?.uploadUrl || '';
                              return url ? <iframe src={url} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6 }} /> : 'Preview frame (student upload preview)';
                            })()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Activity 3 */}
                    {lesson2Phase2Activity === 'a3' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 3: Spreadsheet Verification of Regression Equation</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                              <div className="download-group">
                              <button onClick={() => { const all = getLesson2Phase2Activity3All(); const rows = studentsForSelected.map(s=>({ name: s.name, username: s.username, meta: all[s.username]||{} })); downloadCSV(rows,'lesson2_phase2_activity3.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 3: Spreadsheet Verification of Regression Equation')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students use spreadsheet software (Google Sheets) to verify the regression equation they calculated manually in Activity 2.</p>

                        <div style={{ marginTop: 12 }}>
                          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'flex-end' }}>
                            <select className="class-filter" value={lesson2Phase2SelectedStudent} onChange={(e)=>setLesson2Phase2SelectedStudent(e.target.value)}>
                              <option value="">All Students</option>
                              {studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0])).map(s => <option key={s.username} value={s.username}>{s.name}</option>)}
                            </select>
                          </div>
                            <div style={{ aspectRatio: '16/9', background: '#f6f7fb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {(() => {
                              const all = getLesson2Phase2Activity3All();
                              const entry = lesson2Phase2SelectedStudent ? all[lesson2Phase2SelectedStudent] : null;
                              const url = (entry as any)?.file || (entry as any)?.pdf || (entry as any)?.uploadUrl || '';
                              return url ? <iframe src={url} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6 }} /> : 'Preview frame (student upload preview)';
                            })()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Activity 4a */}
                    {lesson2Phase2Activity === 'a4a' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 4a: Calculating Your Climate Project Regression (Outputs)</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => { const all = getPhase2Activity4CheckAll(); const rows = studentsForSelected.map(s=>({ name: s.name, username: s.username, payload: all[s.username]||{} })); downloadCSV(rows,'lesson2_phase2_activity4a.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 4a: Calculating Your Climate Project Regression (Outputs)')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students calculate the regression equation for their actual project data and interpret what the results mean for their climate research question.</p>

                        <div style={{ marginTop: 12 }}>
                          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'flex-end' }}>
                            <select className="class-filter" value={lesson2Phase2SelectedStudent} onChange={(e)=>setLesson2Phase2SelectedStudent(e.target.value)}>
                              <option value="">All Students</option>
                              {studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0])).map(s => <option key={s.username} value={s.username}>{s.name}</option>)}
                            </select>
                          </div>
                          <div style={{ aspectRatio: '16/9', background: '#f6f7fb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {(() => {
                              // use the Lesson2 Phase2 Activity4 uploads so teacher preview shows the student's uploaded output
                              const all = getLesson2Phase2Activity4All();
                              const entry = lesson2Phase2SelectedStudent ? all[lesson2Phase2SelectedStudent] : null;
                              const url = (entry as any)?.uploadUrl || (entry as any)?.file || (entry as any)?.pdf || '';
                              if (!url) return 'Preview frame (student upload preview)';
                              const isPdf = String(url).startsWith('data:application/pdf') || String(url).toLowerCase().endsWith('.pdf');
                              return isPdf ? <iframe src={url} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6 }} /> : <img src={url} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 6 }} />;
                            })()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Activity 4b */}
                    {lesson2Phase2Activity === 'a4b' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 4b: Calculating Your Climate Project Regression (Interpretations)</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                              <div className="download-group">
                              <button onClick={() => { const all = getLesson2Phase2Activity4InterpAll(); const rows = studentsForSelected.map(s=>({ name: s.name, username: s.username, interp: all[s.username]||{} })); downloadCSV(rows,'lesson2_phase2_activity4b.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 4b: Calculating Your Climate Project Regression (Interpretations)')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students calculate the regression equation for their actual project data and interpret what the results mean for their climate research question.</p>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Regression Line Equation</th>
                                <th>y-intercept Interpretation</th>
                                <th>Regression Interpretation</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const all = getLesson2Phase2Activity4InterpAll();
                                return studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].localeCompare(b.name.split(' ').slice(-1)[0])).map(s => {
                                  const encodings = (all[s.username] as any)?.encodings || {};
                                  return (
                                    <tr key={s.id}>
                                      <td>{s.name}</td>
                                      <td>{encodings.equation || ''}</td>
                                      <td>{encodings.yIntercept || ''}</td>
                                      <td>{encodings.interpretation || ''}</td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {lesson2Phase === 'phase3' && (
                <div className="lesson-layout">
                  <aside className="activity-list">
                    <button className={`activity ${lesson2Phase3Activity === 'a1' ? 'active' : ''}`} onClick={() => setLesson2Phase3Activity('a1')}>Activity 1</button>
                    <button className={`activity ${lesson2Phase3Activity === 'a2' ? 'active' : ''}`} onClick={() => setLesson2Phase3Activity('a2')}>Activity 2</button>
                  </aside>

                  <section className="activity-panel">
                    {/* Activity 1 */}
                    {lesson2Phase3Activity === 'a1' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 1: Relating Findings to Real-World</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => { const finish = getPhase3FinishAll(); const all = getAllLesson1States(); const rows = Object.keys(finish).map(u=>({ username: u, data: all[u]?.phaseData?.[3] || {} })); downloadCSV(rows as any, 'lesson2_phase3_activity1.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 1: Relating Findings to Real-World')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students complete the critical analysis worksheet.</p>

                        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                          <select className="class-filter" value={lesson2Phase3SelectedStudent} onChange={(e)=>setLesson2Phase3SelectedStudent(e.target.value)}>
                            <option value="">All Students</option>
                            {Object.keys(getPhase3FinishAll()).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0])).map(u=> <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th style={{ width: '45%' }}>Question / Prompt</th>
                                <th>Student Answer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const all = getAllLesson1States();
                                const finish = getPhase3FinishAll();
                                const users = Object.keys(finish).sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0]));
                                const preview = lesson2Phase3SelectedStudent || users[0];
                                const p3 = preview ? all[preview]?.phaseData?.[3] || {} : {};
                                const l2a1 = (p3.lesson2 && p3.lesson2.activity1) ? p3.lesson2.activity1 : {};
                                const rows = [
                                  ['PART 1: What Your Data Shows', ''],
                                  ['A. Our Research Question:', l2a1.part1_researchQuestion || ''],
                                  ['B. Our Regression Line Equation:', l2a1.part1_r || ''],
                                  ['C. Our Interpretation:', l2a1.part1_interp || ''],
                                  ['PART 2: Explaining the Pattern', ''],
                                  ['A. Possible Explanation 1:', l2a1.part2_exp1 || ''],
                                  ['Evidence supporting this:', l2a1.part2_evid1 || ''],
                                  ['Possible Explanation 2:', l2a1.part2_exp2 || ''],
                                  ['Evidence supporting this:', l2a1.part2_evid2 || ''],
                                  ['B. Which explanation seems most plausible? Why?', l2a1.part2_plausible || ''],
                                  ['PART 3: What Your Data DOESN\'T Show', ''],
                                  ['A. Yes, because', l2a1.part3_because && l2a1.part3_because.startsWith('Yes') ? l2a1.part3_because : ''],
                                  ['A. No, because', l2a1.part3_because && l2a1.part3_because.startsWith('No') ? l2a1.part3_because : ''],
                                  ['B. What other factors might influence this prediction?', [l2a1.part3_factor1, l2a1.part3_factor2].filter(Boolean).join('\n')],
                                  ['PART 4: Data Quality and Limitations', ''],
                                  ['A. My biggest concern about data reliability:', l2a1.part4_concern || ''],
                                  ['B. How does this limitation affect my confidence in the findings?', l2a1.part4_confidence || ''],
                                ];
                                return rows.map((r, idx) => (<tr key={idx}><td style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{r[0]}</td><td style={{ whiteSpace: 'pre-wrap' }}>{r[1]}</td></tr>));
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 2 */}
                    {lesson2Phase3Activity === 'a2' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 2: Evaluating Relevance of Information to Stakeholders</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => { const ws = getPhase3WorksheetAll(); const all = getAllLesson1States(); const rows = Object.keys(ws).map(u=>({ username: u, state: all[u]?.phaseData?.[3] || {} })); downloadCSV(rows as any, 'lesson2_phase3_activity2.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 2: Evaluating Relevance of Information to Stakeholders')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students complete the stakeholder analysis worksheet.</p>

                        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                          <select className="class-filter" value={lesson2Phase3SelectedStudent} onChange={(e)=>setLesson2Phase3SelectedStudent(e.target.value)}>
                            <option value="">All Students</option>
                            {Object.keys(getPhase3WorksheetAll()).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0])).map(u=> <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th style={{ width: '45%' }}>Question / Prompt</th>
                                <th>Student Answer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const all = getAllLesson1States();
                                const ws = getPhase3WorksheetAll();
                                const users = Object.keys(ws).sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0]));
                                const preview = lesson2Phase3SelectedStudent || users[0];
                                const d = preview ? all[preview]?.phaseData?.[3] || {} : {};
                                const p3 = preview ? all[preview]?.phaseData?.[3] || {} : {};
                                const l2a2 = (p3.lesson2 && p3.lesson2.activity2) ? p3.lesson2.activity2 : {};
                                const rows = [
                                  ['PART 1: Identify Potential Stakeholders', ''],
                                  ['1.', l2a2.sa_stakeholders && l2a2.sa_stakeholders[0] ? l2a2.sa_stakeholders[0] : ''],
                                  ['2.', l2a2.sa_stakeholders && l2a2.sa_stakeholders[1] ? l2a2.sa_stakeholders[1] : ''],
                                  ['3.', l2a2.sa_stakeholders && l2a2.sa_stakeholders[2] ? l2a2.sa_stakeholders[2] : ''],
                                  ['PART 2: Why It Matters to Them', ''],
                                  ['The understanding of this influence matters to', l2a2.sa_matters_to || ''],
                                  ['because…', l2a2.sa_because || ''],
                                  ['PART 3: Current Decisions This Affects', ''],
                                  ['Decisions affected:', [l2a2.sa_decisions && l2a2.sa_decisions[0] ? l2a2.sa_decisions[0] : '', l2a2.sa_decisions && l2a2.sa_decisions[1] ? l2a2.sa_decisions[1] : ''].filter(Boolean).join('\n')],
                                ];
                                return rows.map((r, idx) => (<tr key={idx}><td style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{r[0]}</td><td style={{ whiteSpace: 'pre-wrap' }}>{r[1]}</td></tr>));
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {lesson2Phase === 'phase4' && (
                <div className="lesson-layout">
                  <aside className="activity-list">
                    <button className={`activity ${lesson2Phase4Activity === 'a1' ? 'active' : ''}`} onClick={() => setLesson2Phase4Activity('a1')}>Activity 1</button>
                  </aside>

                  <section className="activity-panel">
                    {lesson2Phase4Activity === 'a1' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Our Evidence-Based Recommendation (Initial)</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => { const rec = getPhase3RecommendationAll(); const all = getAllLesson1States(); const rows = Object.keys(rec).map(u=>({ username: u, state: all[u]?.phaseData?.[3] || {} })); downloadCSV(rows as any, 'lesson2_phase4_activity1.csv'); }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Our Evidence-Based Recommendation (Initial)')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students submit their initial recommendations.</p>

                        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                          <select className="class-filter" value={lesson2Phase4SelectedStudent} onChange={(e)=>setLesson2Phase4SelectedStudent(e.target.value)}>
                            <option value="">All Students</option>
                            {Object.keys(getPhase3RecommendationAll()).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0])).map(u=> <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>

                          <div style={{ marginTop: 12 }}>
                          <div style={{ aspectRatio: '16/9', background: '#f6f7fb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {(() => {
                              const all = getLesson2Phase4Activity1All();
                              const entry = lesson2Phase4SelectedStudent ? all[lesson2Phase4SelectedStudent] : null;
                              const url = (entry as any)?.uploadUrl || (entry as any)?.file || (entry as any)?.pdf || '';
                              return url ? <iframe src={url} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6 }} /> : 'Preview frame (student upload preview)';
                            })()}
                          </div>
                          {/* Rubric scoring UI for Lesson 2 Phase 4 Activity 1 */}
                          <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                            <h4 style={{ margin: '6px 0 12px 0' }}>Teacher Scoring Rubric</h4>
                            {(() => {
                              const criteria = [
                                {
                                  key: 'calculation',
                                  label: 'CALCULATION ACCURACY',
                                  options: [
                                    'R value, R2 value, and regression line equation are incorrect, or calculation process has major errors',
                                    'R value, R2 value, and regression line equation correctly calculated using appropriate method; minor errors in process',
                                    'R value, R2 value, and regression line equation calculated both manually and digitally with verification; all steps shown accurately'
                                  ]
                                },
                                { key: 'interpretation', label: 'INTERPRETATION', options: ['Misidentifies strength or direction; interpretation unclear','Correctly identifies strength and direction; explains meaning in context','Thorough interpretation with nuanced understanding; connects to climate patterns effectively'] },
                                { key: 'pattern', label: 'PATTERN ANALYSIS', options: ['Patterns not clearly identified; limited use of visual/numerical evidence','Patterns identified and described using scatter plot and r value','Sophisticated pattern analysis; discusses seasonal variations, outliers, or subgroup differences'] },
                                { key: 'reliability', label: 'DATA RELIABILITY EVALUATION', options: ['No discussion of limitations or data quality','Acknowledges at least 2 limitations (sample size, time period, missing variables)','Critical evaluation of data quality with specific implications for confidence in findings'] },
                                { key: 'evidence', label: 'EVIDENCE-BASED CONCLUSIONS', options: ['Conclusions not clearly supported by data; confuses correlation with causation','Conclusions logically follow from data; distinguishes between correlation and causation','Nuanced conclusions acknowledging what data does and does not show; considers alternative explanations'] },
                                { key: 'recommendation', label: 'ACTIONABLE RECOMMENDATION', options: ['No clear recommendation OR recommendation not connected to finding','Specific, stakeholder-focused recommendation with clear justification','Highly actionable recommendation with detailed implementation guidance; addresses potential challenges'] },
                                { key: 'communication', label: 'COMMUNICATION CLARITY', options: ['Output disorganized; findings unclear; poor visual/written presentation','Clear organization; findings communicated effectively; appropriate visuals','Professional-quality output; compelling presentation; excellent integration of text, data, visuals'] },
                                { key: 'reflection', label: 'REFLECTION ON PROCESS', options: ['Minimal reflection on assumptions, uncertainties, or learning','Reflects on analytical assumptions and uncertainties; identifies learning growth','Deep metacognitive reflection; discusses how experience changed understanding of statistics and climate'] }
                              ];
                              const interpLabels = ['Below Proficient','Proficient','Advanced'];
                              const scoreVals = [2,3,4];
                              const onChangeSel = (idx:number, val:number) => { const copy = rubricSelections.slice(); copy[idx] = val; setRubricSelections(copy); };
                              const total = rubricSelections.reduce((acc, sel) => acc + (scoreVals[sel] || 0), 0);
                              return (
                                <div>
                                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                      <tr>
                                        <th style={{ textAlign: 'left', padding: 6 }}>Criterion</th>
                                        <th style={{ padding: 6 }}>Dropdown option</th>
                                        <th style={{ padding: 6 }}>Interpretation</th>
                                        <th style={{ padding: 6 }}>Score</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {criteria.map((c, idx) => (
                                        <tr key={c.key} style={{ borderTop: '1px solid #eee' }}>
                                          <td style={{ padding: 8, verticalAlign: 'top', width: '22%' }}><strong>{c.label}</strong></td>
                                          <td style={{ padding: 8, width: '48%' }}>
                                            <select className="scoring-select" value={rubricSelections[idx]} onChange={(e)=>onChangeSel(idx, Number(e.target.value))}>
                                              {c.options.map((opt, oi) => <option key={oi} value={oi}>{opt}</option>)}
                                            </select>
                                          </td>
                                          <td style={{ padding: 8, width: '18%' }}>{interpLabels[rubricSelections[idx]]}</td>
                                          <td style={{ padding: 8, width: '12%', textAlign: 'center' }}>{scoreVals[rubricSelections[idx]]}</td>
                                        </tr>
                                      ))}
                                      <tr>
                                        <td colSpan={2} style={{ padding: 8, fontWeight: 700 }}>Total</td>
                                        <td style={{ padding: 8 }}></td>
                                        <td style={{ padding: 8, textAlign: 'center', fontWeight: 800 }}>{total}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <button className="record-score-btn" onClick={() => {
                                      if (!lesson2Phase4SelectedStudent) { alert('Select a student before recording score'); return; }
                                      const username = lesson2Phase4SelectedStudent;
                                      // persist teacher feedback under lesson2.phaseScores[4]
                                      try {
                                        const raw = localStorage.getItem('teacherFeedback');
                                        const allTF = raw ? JSON.parse(raw) : {};
                                        allTF[username] = allTF[username] || {};
                                        allTF[username].lesson2 = allTF[username].lesson2 || {};
                                        allTF[username].lesson2.phaseScores = { ...(allTF[username].lesson2.phaseScores || {}), 4: total };
                                        localStorage.setItem('teacherFeedback', JSON.stringify(allTF));
                                      } catch (e) { /* ignore */ }
                                      alert('Score recorded for ' + lesson2Phase4SelectedStudent + ': ' + total);
                                    }}>Record Score</button>
                                    <div style={{ color: '#374151', fontWeight: 700 }}>{(() => {
                                      if (!lesson2Phase4SelectedStudent) return '';
                                      const allStudents = classes.flatMap(c => c.students);
                                      const found = allStudents.find(st => st.username === lesson2Phase4SelectedStudent);
                                      return found ? `${found.name} (${found.username})` : lesson2Phase4SelectedStudent;
                                    })()}</div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSub === 'lesson3' && (
          <div className="subpage">
            <div className="subpage-header">
              <h3 className="subpage-title">Lesson 3: Climate Predictions and Applications in Regression</h3>
              
            </div>
            <div className="lesson-phases">
              <div className="phase-tabs">
                <button className={`phase ${lesson3Phase === 'phase1' ? 'active' : ''}`} onClick={() => setLesson3Phase('phase1')}>Phase 1</button>
                <button className={`phase ${lesson3Phase === 'phase2' ? 'active' : ''}`} onClick={() => setLesson3Phase('phase2')}>Phase 2</button>
                <button className={`phase ${lesson3Phase === 'phase3' ? 'active' : ''}`} onClick={() => setLesson3Phase('phase3')}>Phase 3</button>
                <button className={`phase ${lesson3Phase === 'phase4' ? 'active' : ''}`} onClick={() => setLesson3Phase('phase4')}>Phase 4</button>
              </div>

              {/* Phase 1: Activities layout */}
              {lesson3Phase === 'phase1' && (
                <div className="lesson-layout">
                  <aside className="activity-list">
                    <button className={`activity ${lesson3Phase1Activity === 'activity1' ? 'active' : ''}`} onClick={() => setLesson3Phase1Activity('activity1')}>Activity 1</button>
                    <button className={`activity ${lesson3Phase1Activity === 'activity2' ? 'active' : ''}`} onClick={() => setLesson3Phase1Activity('activity2')}>Activity 2</button>
                  </aside>

                  <section className="activity-panel">
                    {/* Activity 1 */}
                    {lesson3Phase1Activity === 'activity1' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 1a: Climate Change Observation (Scenarios)</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => {
                                const rows = studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].toLowerCase().localeCompare(b.name.split(' ').slice(-1)[0].toLowerCase())).map(s=>({ name: s.name, researchQuestion: '', regressionEquation: '', interpretation: '' }));
                                downloadCSV(rows as any, 'lesson3_activity1.csv');
                              }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 1a: Climate Change Observation (Scenarios)')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students review and summarize the key elements of their research, including their variables, research question, regression equation, and what that equation means in the context of their study.</p>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Research Question</th>
                                <th>Regression Line Equation</th>
                                <th>Interpretation</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const store = getLesson3Phase1Activity1All();
                                return studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].toLowerCase().localeCompare(b.name.split(' ').slice(-1)[0].toLowerCase())).map(s => {
                                  const entry = store[s.username] || { researchQuestion: '', regressionEquation: '', interpretation: '' };
                                  return (
                                    <tr key={s.id}>
                                      <td>{s.name}</td>
                                      <td>{entry.researchQuestion || ''}</td>
                                      <td>{entry.regressionEquation || ''}</td>
                                      <td>{entry.interpretation || ''}</td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 2 */}
                    {lesson3Phase1Activity === 'activity2' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 2: Identifying Confounding Variables</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => {
                                const rows = studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].toLowerCase().localeCompare(b.name.split(' ').slice(-1)[0].toLowerCase())).map(s=>({ name: s.name, considerations: '' }));
                                downloadCSV(rows as any, 'lesson3_activity2.csv');
                              }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 2: Identifying Confounding Variables')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students collaborate with their group to identify other possible factors beyond their independent variable that could influence their dependent variable.</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
                          <select value={lesson3Phase1SelectedStudent} onChange={(e) => setLesson3Phase1SelectedStudent(e.target.value)} className="class-filter">
                            <option value="">All Students</option>
                            {studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].toLowerCase().localeCompare(b.name.split(' ').slice(-1)[0].toLowerCase())).map(s => <option key={s.id} value={s.username}>{s.name}</option>)}
                          </select>
                        </div>

                        <div style={{ aspectRatio: '16/9', background: '#f6f7fb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                          {(() => {
                            const store = getLesson3Phase1Activity2All();
                            const username = lesson3Phase1SelectedStudent || (studentsForSelected[0]?.username || '');
                            const entry = username ? store[username] : null as any;
                            const url = entry?.fileDataUrl || '';
                            return url ? <iframe src={url} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6 }} /> : 'Preview frame (student upload preview)';
                          })()}
                        </div>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Considerations</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const store = getLesson3Phase1Activity2All();
                                return studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].toLowerCase().localeCompare(b.name.split(' ').slice(-1)[0].toLowerCase())).map(s => {
                                  const entry = store[s.username] || { considerations: '' };
                                  return (
                                    <tr key={s.id}>
                                      <td>{s.name}</td>
                                      <td>{entry.considerations || ''}</td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* Phase 2 layout: left vertical activities, right content panel (Lesson 3 Phase 2) */}
              {lesson3Phase === 'phase2' && (
                <div className="lesson-layout">
                  <aside className="activity-list">
                    <button className={`activity ${lesson3Phase2Activity === 'activity1' ? 'active' : ''}`} onClick={() => setLesson3Phase2Activity('activity1')}>Activity 1</button>
                    <button className={`activity ${lesson3Phase2Activity === 'activity2' ? 'active' : ''}`} onClick={() => setLesson3Phase2Activity('activity2')}>Activity 2</button>
                    <button className={`activity ${lesson3Phase2Activity === 'activity3' ? 'active' : ''}`} onClick={() => setLesson3Phase2Activity('activity3')}>Activity 3</button>
                  </aside>

                  <section className="activity-panel">
                    {/* Activity 1: Making Predictions Within Your Data Range */}
                    {lesson3Phase2Activity === 'activity1' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 1: Making Predictions Within Your Data Range</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => {
                                const rows = studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].toLowerCase().localeCompare(b.name.split(' ').slice(-1)[0].toLowerCase())).map(s=>({ name: s.name, username: s.username, note: '' }));
                                downloadCSV(rows as any, 'lesson3_phase2_activity1.csv');
                              }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 1: Making Predictions Within Your Data Range')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students use their regression equation to predict dependent variable values for independent variable values that fall within the range of their collected data.</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
                          <select value={lesson3Phase2SelectedStudent} onChange={(e) => setLesson3Phase2SelectedStudent(e.target.value)} className="class-filter">
                            <option value="">All Students</option>
                            {studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].toLowerCase().localeCompare(b.name.split(' ').slice(-1)[0].toLowerCase())).map(s => <option key={s.id} value={s.username}>{s.name}</option>)}
                          </select>
                        </div>

                        <div style={{ aspectRatio: '16/9', background: '#f6f7fb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                          {(() => {
                            const store = getLesson3Phase2Activity1All();
                            const username = lesson3Phase2SelectedStudent || (studentsForSelected[0]?.username || '');
                            const entry = username ? store[username] : null as any;
                            const url = entry?.fileDataUrl || '';
                            return url ? <iframe src={url} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6 }} /> : 'Preview frame (student upload preview)';
                          })()}
                        </div>

                      </div>
                    )}

                    {/* Activity 2: Making Predictions Beyond Your Data Range */}
                    {lesson3Phase2Activity === 'activity2' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 2: Making Predictions Beyond Your Data Range</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => {
                                const rows = studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].toLowerCase().localeCompare(b.name.split(' ').slice(-1)[0].toLowerCase())).map(s=>({ name: s.name, username: s.username, note: '' }));
                                downloadCSV(rows as any, 'lesson3_phase2_activity2.csv');
                              }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 2: Making Predictions Beyond Your Data Range')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students use their regression equation to predict dependent variable values for independent variable values that fall outside the range of their collected data.</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
                          <select value={lesson3Phase2SelectedStudent} onChange={(e) => setLesson3Phase2SelectedStudent(e.target.value)} className="class-filter">
                            <option value="">All Students</option>
                            {studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].toLowerCase().localeCompare(b.name.split(' ').slice(-1)[0].toLowerCase())).map(s => <option key={s.id} value={s.username}>{s.name}</option>)}
                          </select>
                        </div>

                        <div style={{ aspectRatio: '16/9', background: '#f6f7fb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                          {(() => {
                            const all = getLesson3Phase2Activity2All();
                            const answers = getPhase2Activity2AnswersAll();
                            const username = lesson3Phase2SelectedStudent || (studentsForSelected[0]?.username || '');
                            const entry = username ? all[username] : null as any;
                            const url = entry ? (entry.fileDataUrl || '') : '';
                            const filename = entry ? (entry.filename || '') : '';
                            const encoded = (answers && answers[username]) ? (answers[username].answer || '') : '';
                            return (
                              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ flex: 1, minHeight: 0 }}>
                                  {url ? <iframe src={url} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6 }} /> : 'Preview frame (student upload preview)'}
                                </div>
                                <div style={{ marginTop: 8, padding: 8, background: '#fff', borderRadius: 6, border: '1px solid #e6e9ef' }}>
                                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Selected student data</div>
                                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <div><strong>Filename:</strong> {filename || '—'}</div>
                                    <div><strong>Encoded answer:</strong> {encoded || '—'}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                      </div>
                    )}

                    {/* Activity 3: Determining the Strength of Your Model */}
                    {lesson3Phase2Activity === 'activity3' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Activity 3: Determining the Strength of Your Model</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => {
                                const rows = studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].toLowerCase().localeCompare(b.name.split(' ').slice(-1)[0].toLowerCase())).map(s=>({ name: s.name, username: s.username, r2: '' }));
                                downloadCSV(rows as any, 'lesson3_phase2_activity3.csv');
                              }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Activity 3: Determining the Strength of Your Model')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students calculate the coefficient of determination (R²) to measure how well their regression line explains the variation in their dependent variable.</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
                          <select value={lesson3Phase2SelectedStudent} onChange={(e) => setLesson3Phase2SelectedStudent(e.target.value)} className="class-filter">
                            <option value="">All Students</option>
                            {studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].toLowerCase().localeCompare(b.name.split(' ').slice(-1)[0].toLowerCase())).map(s => <option key={s.id} value={s.username}>{s.name}</option>)}
                          </select>
                        </div>

                        <div style={{ aspectRatio: '16/9', background: '#f6f7fb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                          {(() => {
                            const store = getLesson3Phase2Activity3All();
                            const username = lesson3Phase2SelectedStudent || (studentsForSelected[0]?.username || '');
                            const entry = username ? store[username] : null as any;
                            const url = entry?.fileDataUrl || '';
                            return url ? <iframe src={url} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6 }} /> : 'Preview frame (student upload preview)';
                          })()}
                        </div>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>R² Interpretation</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].toLowerCase().localeCompare(b.name.split(' ').slice(-1)[0].toLowerCase())).map(s => {
                                const store = getLesson3Phase2Activity3All();
                                const entry = store[s.username] || { interpretation: '' };
                                return (
                                  <tr key={s.id}>
                                    <td>{s.name}</td>
                                    <td>{entry.interpretation || ''}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* Phase 3 layout: single left tab 'Activity 1' + right content panel (Lesson 3 Phase 3) */}
              {lesson3Phase === 'phase3' && (
                <div className="lesson-layout">
                  <aside className="activity-list">
                    <button className={`activity active`} onClick={() => { /* single tab only */ }}>Activity 1</button>
                  </aside>

                  <section className="activity-panel">
                    <div>
                      <div className="activity-header">
                        <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Finalized Evidence-Based Recommendations</h4>
                        <div className="activity-controls">
                          <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                            {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                          </select>
                          <div className="download-group">
                            <button onClick={() => {
                              const all = getPhase3RecommendationAll();
                              const rows = studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].toLowerCase().localeCompare(b.name.split(' ').slice(-1)[0].toLowerCase())).map(s => ({ name: s.name, username: s.username, recommendation: ((all[s.username] as any)?.recommendation || '') }));
                              downloadCSV(rows as any, 'lesson3_phase3_activity1.csv');
                            }} className="download-btn">Download CSV</button>
                            <button onClick={() => downloadPDF('Finalized Evidence-Based Recommendations')} className="download-btn">Download PDF</button>
                          </div>
                        </div>
                      </div>

                      <p className="activity-desc">Description: <br /> In this activity, students revisit their initial recommendation from Lesson 2 and improve it by incorporating their understanding of correlation strength and how much of the variation your model explains.</p>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
                        <select value={lesson3Phase3SelectedStudent} onChange={(e) => setLesson3Phase3SelectedStudent(e.target.value)} className="class-filter">
                          <option value="">All Students</option>
                          {studentsForSelected.slice().sort((a,b)=> a.name.split(' ').slice(-1)[0].toLowerCase().localeCompare(b.name.split(' ').slice(-1)[0].toLowerCase())).map(s => <option key={s.id} value={s.username}>{s.name}</option>)}
                        </select>
                      </div>

                      <div style={{ aspectRatio: '16/9', background: '#f6f7fb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                        {(() => {
                          // Prefer Lesson3 Phase3 store (student uploads). Fallback to existing recs or lesson1 states.
                          const store = getLesson3Phase3Activity1All();
                          const recs = getPhase3RecommendationAll();
                          const all = getAllLesson1States();
                          const username = lesson3Phase3SelectedStudent || (studentsForSelected[0]?.username || '');
                          const entry = username ? (store[username] || recs[username] || all[username] || {}) : null as any;
                          const url = (entry as any)?.fileDataUrl || (entry as any)?.file || (entry as any)?.pdf || (entry as any)?.uploadUrl || (entry as any)?.lesson3?.phase3?.file || '';
                          return url ? <iframe src={url} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6 }} /> : 'Preview frame (student upload preview)';
                        })()}
                      </div>

                    </div>
                  </section>
                </div>
              )}
              {/* Phase 4 layout: left vertical activities, right content panel (Lesson 3 Phase 4) */}
              {lesson3Phase === 'phase4' && (
                <div className="lesson-layout">
                  <aside className="activity-list">
                    <button className={`activity ${lesson3Phase4Activity === 'act1' ? 'active' : ''}`} onClick={() => setLesson3Phase4Activity('act1')}>Activity 1</button>
                    <button className={`activity ${lesson3Phase4Activity === 'act2' ? 'active' : ''}`} onClick={() => setLesson3Phase4Activity('act2')}>Activity 2</button>
                    <button className={`activity ${lesson3Phase4Activity === 'act3' ? 'active' : ''}`} onClick={() => setLesson3Phase4Activity('act3')}>Activity 3</button>
                  </aside>

                  <section className="activity-panel">
                    {/* Activity 1: Peer Review */}
                    {lesson3Phase4Activity === 'act1' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Peer Review: Quality Check Before Submission</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => {
                                const reviews = getLesson3Phase4ReviewAll();
                                const users = Object.keys(reviews).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0]));
                                const rows = users.map(u => ({ username: u, data: reviews[u]?.review || {} }));
                                downloadCSV(rows as any, 'lesson3_phase4_peerreview.csv');
                              }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Peer Review: Quality Check Before Submission')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students ask their peers to review their Lesson 3 output before submission.</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                          <select className="class-filter">
                            <option>All Students (who submitted)</option>
                            {Object.keys(getLesson3Phase4ReviewAll()).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0])).map(u=> <option key={u}>{u}</option>)}
                          </select>
                        </div>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th style={{ width: '45%' }}>Prompt</th>
                                <th>Student Answer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const reviews = getLesson3Phase4ReviewAll();
                                const users = Object.keys(reviews).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0]));
                                const preview = users[0];
                                const d: any = preview ? (reviews[preview]?.review || {}) : {};
                                const rows = [
                                  ['1. CLARITY: Can you understand their finding and recommendation without asking questions?', Array.isArray(d.q1) ? d.q1.join(', ') : d.q1 || ''],
                                  ['2. EVIDENCE: Is their recommendation clearly supported by their r value and interpretation?', Array.isArray(d.q2) ? d.q2.join(', ') : d.q2 || ''],
                                  ['3. ACTIONABILITY: Could a stakeholder actually implement this recommendation?', Array.isArray(d.q3) ? d.q3.join(', ') : d.q3 || ''],
                                  ['4. HONESTY: Did they acknowledge limitations of their data?', Array.isArray(d.q4) ? d.q4.join(', ') : d.q4 || ''],
                                  ['ONE STRENGTH of their work:', d.strength || ''],
                                  ['ONE SUGGESTION for improvement:', d.suggestion || ''],
                                  ['Username of Peer reviewer:', d.peerReviewer || ''],
                                ];
                                return rows.map((r, idx) => (<tr key={idx}><td style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{r[0]}</td><td style={{ whiteSpace: 'pre-wrap' }}>{r[1]}</td></tr>));
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 2: Reflection and Final Submission */}
                    {lesson3Phase4Activity === 'act2' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Reflection and Final Submission</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => {
                                const complete = getLesson3Phase4CompleteAll();
                                const users = Object.keys(complete).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0]));
                                const rows = users.map(u => ({ username: u, data: complete[u] || {} }));
                                downloadCSV(rows as any, 'lesson3_phase4_reflection.csv');
                              }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Reflection and Final Submission')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students reflect on their Lesson 3 journey.</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                          <select value={lesson3Phase4SelectedStudent} onChange={(e) => setLesson3Phase4SelectedStudent(e.target.value)} className="class-filter">
                            <option value="">All Students (who completed)</option>
                            {Object.keys(getLesson3Phase4CompleteAll()).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0])).map(u=> <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>

                        <div className="table-wrap">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th style={{ width: '45%' }}>Prompt</th>
                                <th>Student Answer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(() => {
                                const complete = getLesson3Phase4CompleteAll();
                                const users = Object.keys(complete).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0]));
                                const preview = lesson3Phase4SelectedStudent || users[0];
                                const d: any = preview ? (complete[preview] || {}) : {};
                                const rows = [
                                  ['1. How confident am I in my correlation calculation?', (d as any).reflection?.confidence || ''],
                                  ['2. What contributed to this confidence level?', (d as any).reflection?.contributed || ''],
                                  ['3. What was most challenging about this project?', (d as any).reflection?.challenging || ''],
                                  ['4a. Statistics:', (d as any).reflection?.stats || ''],
                                  ['4b. Climate:', (d as any).reflection?.climate || ''],
                                  ['4c. The connection between them:', (d as any).reflection?.connection || ''],
                                  ['5. If I could extend this project, I would investigate:', (d as any).reflection?.extend || ''],
                                  ['6. One thing I learned about myself as a learner:', (d as any).reflection?.learned || ''],
                                ];
                                return rows.map((r, idx) => (<tr key={idx}><td style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{r[0]}</td><td style={{ whiteSpace: 'pre-wrap' }}>{r[1]}</td></tr>));
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Activity 3: Final Output Submission */}
                    {lesson3Phase4Activity === 'act3' && (
                      <div>
                        <div className="activity-header">
                          <h4 className="activity-title" style={{ fontWeight: 700, textAlign: 'left' }}>Final Output Submission</h4>
                          <div className="activity-controls">
                            <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                              {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                            <div className="download-group">
                              <button onClick={() => {
                                const complete = getLesson3Phase4CompleteAll();
                                const users = Object.keys(complete).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0]));
                                const rows = users.map(u => ({ username: u, data: complete[u] || {} }));
                                downloadCSV(rows as any, 'lesson3_phase4_submission.csv');
                              }} className="download-btn">Download CSV</button>
                              <button onClick={() => downloadPDF('Final Output Submission')} className="download-btn">Download PDF</button>
                            </div>
                          </div>
                        </div>

                        <p className="activity-desc">Description: <br /> In this activity, students submit their final outputs depending on the type or format they chose.</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                          <select value={lesson3Phase4SelectedStudent} onChange={(e) => setLesson3Phase4SelectedStudent(e.target.value)} className="class-filter">
                            <option value="">All Students (who completed)</option>
                            {Object.keys(getLesson3Phase4CompleteAll()).slice().sort((a,b)=> a.split(' ').slice(-1)[0].localeCompare(b.split(' ').slice(-1)[0])).map(u=> <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>

                        <div style={{ aspectRatio: '16/9', background: '#f6f7fb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {(() => {
                            const complete = getLesson3Phase4CompleteAll();
                            const username = lesson3Phase4SelectedStudent || Object.keys(complete)[0] || '';
                            const entry = username ? (complete[username] || {}) : {} as any;
                            // only show Lesson3 upload (do not fallback to Lesson1)
                            const url = (entry as any)?.uploadUrl || '';
                            return url ? <iframe src={url} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 6 }} /> : 'Preview frame (student upload preview)';
                          })()}
                        </div>

                        {/* Rubric scoring UI for Lesson 3 Phase 4 Activity 3 (Final Output Submission) */}
                        <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                          <h4 style={{ margin: '6px 0 12px 0' }}>Teacher Scoring Rubric (Lesson 3)</h4>
                          {(() => {
                            const criteria = [
                              { key: 'calculation', label: 'CALCULATION ACCURACY', options: [
                                'R value, R2 value, and regression line equation are incorrect, or calculation process has major errors',
                                'R value, R2 value, and regression line equation correctly calculated using appropriate method; minor errors in process',
                                'R value, R2 value, and regression line equation calculated both manually and digitally with verification; all steps shown accurately'
                              ] },
                              { key: 'interpretation', label: 'INTERPRETATION', options: ['Misidentifies strength or direction; interpretation unclear','Correctly identifies strength and direction; explains meaning in context','Thorough interpretation with nuanced understanding; connects to climate patterns effectively'] },
                              { key: 'pattern', label: 'PATTERN ANALYSIS', options: ['Patterns not clearly identified; limited use of visual/numerical evidence','Patterns identified and described using scatter plot and r value','Sophisticated pattern analysis; discusses seasonal variations, outliers, or subgroup differences'] },
                              { key: 'reliability', label: 'DATA RELIABILITY EVALUATION', options: ['No discussion of limitations or data quality','Acknowledges at least 2 limitations (sample size, time period, missing variables)','Critical evaluation of data quality with specific implications for confidence in findings'] },
                              { key: 'evidence', label: 'EVIDENCE-BASED CONCLUSIONS', options: ['Conclusions not clearly supported by data; confuses correlation with causation','Conclusions logically follow from data; distinguishes between correlation and causation','Nuanced conclusions acknowledging what data does and does not show; considers alternative explanations'] },
                              { key: 'recommendation', label: 'ACTIONABLE RECOMMENDATION', options: ['No clear recommendation OR recommendation not connected to finding','Specific, stakeholder-focused recommendation with clear justification','Highly actionable recommendation with detailed implementation guidance; addresses potential challenges'] },
                              { key: 'communication', label: 'COMMUNICATION CLARITY', options: ['Output disorganized; findings unclear; poor visual/written presentation','Clear organization; findings communicated effectively; appropriate visuals','Professional-quality output; compelling presentation; excellent integration of text, data, visuals'] },
                              { key: 'reflection', label: 'REFLECTION ON PROCESS', options: ['Minimal reflection on assumptions, uncertainties, or learning','Reflects on analytical assumptions and uncertainties; identifies learning growth','Deep metacognitive reflection; discusses how experience changed understanding of statistics and climate'] }
                            ];
                            const interpLabels = ['Below Proficient','Proficient','Advanced'];
                            const scoreVals = [2,3,4];
                            const onChangeSel = (idx:number, val:number) => { const copy = rubricSelectionsL3.slice(); copy[idx] = val; setRubricSelectionsL3(copy); };
                            const total = rubricSelectionsL3.reduce((acc, sel) => acc + (scoreVals[sel] || 0), 0);
                            return (
                              <div>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr>
                                      <th style={{ textAlign: 'left', padding: 6 }}>Criterion</th>
                                      <th style={{ padding: 6 }}>Dropdown option</th>
                                      <th style={{ padding: 6 }}>Interpretation</th>
                                      <th style={{ padding: 6 }}>Score</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {criteria.map((c, idx) => (
                                      <tr key={c.key} style={{ borderTop: '1px solid #eee' }}>
                                        <td style={{ padding: 8, verticalAlign: 'top', width: '22%' }}><strong>{c.label}</strong></td>
                                        <td style={{ padding: 8, width: '48%' }}>
                                          <select className="scoring-select" value={rubricSelectionsL3[idx]} onChange={(e)=>onChangeSel(idx, Number(e.target.value))}>
                                            {c.options.map((opt, oi) => <option key={oi} value={oi}>{opt}</option>)}
                                          </select>
                                        </td>
                                        <td style={{ padding: 8, width: '18%' }}>{interpLabels[rubricSelectionsL3[idx]]}</td>
                                        <td style={{ padding: 8, width: '12%', textAlign: 'center' }}>{scoreVals[rubricSelectionsL3[idx]]}</td>
                                      </tr>
                                    ))}
                                    <tr>
                                      <td colSpan={2} style={{ padding: 8, fontWeight: 700 }}>Total</td>
                                      <td style={{ padding: 8 }}></td>
                                      <td style={{ padding: 8, textAlign: 'center', fontWeight: 800 }}>{total}</td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
                                  <button className="record-score-btn" onClick={() => {
                                    if (!lesson3Phase4SelectedStudent) { alert('Select a student before recording score'); return; }
                                    const username = lesson3Phase4SelectedStudent;
                                    // persist teacher feedback under lesson3.phaseScores[3]
                                    try {
                                      const raw = localStorage.getItem('teacherFeedback');
                                      const allTF = raw ? JSON.parse(raw) : {};
                                      allTF[username] = allTF[username] || {};
                                      allTF[username].lesson3 = allTF[username].lesson3 || {};
                                      allTF[username].lesson3.phaseScores = { ...(allTF[username].lesson3.phaseScores || {}), 3: total };
                                      localStorage.setItem('teacherFeedback', JSON.stringify(allTF));
                                    } catch (e) { /* ignore */ }
                                    alert('Score recorded for ' + lesson3Phase4SelectedStudent + ': ' + total);
                                  }}>Record Score</button>
                                  <div style={{ color: '#374151', fontWeight: 700 }}>{(() => {
                                    if (!lesson3Phase4SelectedStudent) return '';
                                    const allStudents = classes.flatMap(c => c.students);
                                    const found = allStudents.find(st => st.username === lesson3Phase4SelectedStudent);
                                    return found ? `${found.name} (${found.username})` : lesson3Phase4SelectedStudent;
                                  })()}</div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSub === 'post' && (
          <div className="subpage">
            <div className="subpage-header">
              <h3 className="subpage-title">Post Assessment Results</h3>
              <div className="subpage-controls">
                <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                  {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                </select>
                <div className="download-group">
                  <button onClick={() => downloadCSV(tableRows)} className="download-btn">Download CSV</button>
                  <button onClick={() => downloadPDF('Post Assessment Results')} className="download-btn">Download PDF</button>
                </div>
              </div>
            </div>

            <div className="table-wrap">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    {Array.from({ length: 15 }, (_, i) => <th key={i}>Q{i+1}</th>)}
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.length === 0 && (
                    <tr><td colSpan={17} style={{ textAlign: 'center', padding: '18px' }}>No students found for selected class.</td></tr>
                  )}
                  {tableRows.map(r => (
                    <tr key={r.id}>
                      <td>{r.name}</td>
                      <td>{r.username}</td>
                      {r.answers.map((a:string, idx:number) => <td key={idx}>{a}</td>)}
                      <td>{r.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSub === 'classRecord' && (
          <div className="subpage class-record">
            <div className="subpage-header">
              <h3 className="subpage-title">Class Record</h3>
              <div className="subpage-controls">
                <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="class-filter">
                  {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                </select>
                <div className="download-group">
                  <button onClick={() => {
                    // build rows for CSV
                    const students = studentsForSelected;
                    const allScores = getAssessmentScores();
                    let tf: any = {};
                    try { tf = JSON.parse(localStorage.getItem('teacherFeedback') || '{}') || {}; } catch (e) { tf = {}; }
                    const allL1 = getAllLesson1States();
                    const rows = students.map(s => {
                      const username = s.username;
                      const pre = (allScores[username] && typeof allScores[username].prePart1Correct === 'number') ? String(allScores[username].prePart1Correct) : '';
                      const post = (allScores[username] && typeof allScores[username].postPart1Correct === 'number') ? String(allScores[username].postPart1Correct) : '';
                      let l1: any = '';
                      try {
                        const v = tf?.[username]?.lesson1?.phaseScores?.[4];
                        if (typeof v === 'number') l1 = String(v);
                        else {
                          const st = allL1[username];
                          const alt = st?.phaseData?.[4];
                          if (alt && typeof (alt as any).teacherScore === 'number') l1 = String((alt as any).teacherScore);
                        }
                      } catch (e) { l1 = ''; }
                      const l2 = (tf?.[username]?.lesson2?.phaseScores?.[4] && typeof tf[username].lesson2.phaseScores[4] === 'number') ? String(tf[username].lesson2.phaseScores[4]) : '';
                      const l3 = (tf?.[username]?.lesson3?.phaseScores?.[3] && typeof tf[username].lesson3.phaseScores[3] === 'number') ? String(tf[username].lesson3.phaseScores[3]) : '';
                      return { name: formatNameLastFirst(s.name), username, pre, l1, l2, l3, post };
                    });
                    // csv
                    const header = ['Name of Student','Username','Pre-Assessment','Lesson 1 Final Output','Lesson 2 Final Output','Lesson 3 Final Output','Post Assessment'];
                    const lines = [header.join(',')];
                    rows.forEach(r => {
                      const line = [r.name, r.username, r.pre, r.l1, r.l2, r.l3, r.post].map((v:any) => `"${String(v || '').replace(/"/g,'""')}"`).join(',');
                      lines.push(line);
                    });
                    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `class-record-${selectedClassId}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }} className="download-btn">Download CSV</button>
                </div>
              </div>
            </div>

            <div className="table-wrap">
              <table className="results-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}>Name of Student</th>
                    <th style={{ textAlign: 'center' }}>Pre-Assessment</th>
                    <th style={{ textAlign: 'center' }}>Lesson 1 Final Output</th>
                    <th style={{ textAlign: 'center' }}>Lesson 2 Final Output</th>
                    <th style={{ textAlign: 'center' }}>Lesson 3 Final Output</th>
                    <th style={{ textAlign: 'center' }}>Post Assessment</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsForSelected.map(s => {
                    const username = s.username;
                    const allScores = getAssessmentScores();
                    const pre = (allScores[username] && typeof allScores[username].prePart1Correct === 'number') ? String(allScores[username].prePart1Correct) : '';
                    const post = (allScores[username] && typeof allScores[username].postPart1Correct === 'number') ? String(allScores[username].postPart1Correct) : '';
                    let l1: any = '';
                    try {
                      const tfRaw = localStorage.getItem('teacherFeedback');
                      const tf = tfRaw ? JSON.parse(tfRaw || '{}') : {};
                      const v = tf?.[username]?.lesson1?.phaseScores?.[4];
                      if (typeof v === 'number') l1 = String(v);
                      else {
                        const all = getAllLesson1States();
                        const alt = all[username]?.phaseData?.[4];
                        if (alt && typeof (alt as any).teacherScore === 'number') l1 = String((alt as any).teacherScore);
                      }
                    } catch (e) { l1 = ''; }
                    let l2 = '';
                    try { const tfRaw = localStorage.getItem('teacherFeedback'); const tf = tfRaw ? JSON.parse(tfRaw || '{}') : {}; if (tf?.[username]?.lesson2?.phaseScores?.[4] && typeof tf[username].lesson2.phaseScores[4] === 'number') l2 = String(tf[username].lesson2.phaseScores[4]); } catch (e) { l2 = ''; }
                    let l3 = '';
                    try { const tfRaw = localStorage.getItem('teacherFeedback'); const tf = tfRaw ? JSON.parse(tfRaw || '{}') : {}; if (tf?.[username]?.lesson3?.phaseScores?.[3] && typeof tf[username].lesson3.phaseScores[3] === 'number') l3 = String(tf[username].lesson3.phaseScores[3]); } catch (e) { l3 = ''; }
                    const displayName = formatNameLastFirst(s.name);
                    return (
                      <tr key={username}>
                        <td style={{ textAlign: 'left' }}>{displayName}</td>
                        <td style={{ textAlign: 'center' }}>{pre}</td>
                        <td style={{ textAlign: 'center' }}>{l1}</td>
                        <td style={{ textAlign: 'center' }}>{l2}</td>
                        <td style={{ textAlign: 'center' }}>{l3}</td>
                        <td style={{ textAlign: 'center' }}>{post}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceSummary;
