import '../../styles/StudentPortal.css';
import '../../styles/Lesson.css';
import { useMemo } from 'react';
import { getAssessmentScores, getLesson1State } from '../../services/progressService';
import { getUserProgress } from '../../services/progressService';

interface AuthUser {
  username: string;
  role: 'student' | 'teacher' | 'admin' | null;
}

interface SectionPageProps {
  user: AuthUser;
  onBack: () => void;
}

const PerformanceSummary: React.FC<SectionPageProps> = ({ user, onBack }) => {
  const displayName = (() => {
    const raw = localStorage.getItem('teacherClasses');
    if (raw) {
      try {
        const classes = JSON.parse(raw) as Array<{ students: Array<{username:string; name:string}> }>;
        for (const cls of classes) {
          const found = cls.students.find(s => s.username === user.username);
          if (found) return found.name;
        }
      } catch {}
    }
    return user.username;
  })();

  const sectionProgress = getUserProgress(user.username);

  return (
    <div className="portal-container">
      <header className="portal-header">
        <div className="header-left">
          <span className="header-badge badge--performance">📚</span>
          <div className="header-texts">
            <h1 className="portal-title">Performance Summary</h1>
            <p className="portal-subtitle">Student Section</p>
          </div>
        </div>
        <div className="header-right">
          <p className="welcome-text">Welcome, <strong>{displayName}</strong></p>
          <button className="logout-button" onClick={onBack}>Back to Dashboard</button>
        </div>
      </header>

      <main className="portal-content">
        <div className="lesson-container">
          <div style={{ padding: 24 }}>
            <h3>Overview</h3>
            <p>This page summarizes your performance across the learning sections.</p>
            <div style={{ height: 12 }} />
            <div style={{ height: 12 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
              {[
                { id: 1, icon: '📋', title: 'Pre-Assessment' },
                { id: 2, icon: '📊', title: 'Lesson 1: Climate Correlation Analysis' },
                { id: 3, icon: '📈', title: 'Lesson 2: Climate Linear Regression Equations' },
                { id: 4, icon: '🎯', title: 'Lesson 3: Climate Predictions and Applications in Regression' },
                { id: 5, icon: '✅', title: 'Post-Assessment' }
              ].map(item => (
                <div
                  key={item.id}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E6EEF9',
                    borderRadius: 12,
                    padding: '14px 18px',
                    minHeight: 72,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                    <div style={{ fontWeight: 700, textAlign: 'left', color: 'var(--primary-blue)' }}>{item.title}</div>
                  </div>
                  {
                    (() => {
                      const all = getAssessmentScores();
                      const entry = all[user.username];
                      if (item.id === 1) {
                        const hasScore = !!(entry && typeof entry.prePart1Correct === 'number');
                        return (
                          <div style={{ marginRight: 10, fontWeight: 700, color: hasScore ? 'var(--primary-blue)' : 'inherit' }}>
                            {hasScore ? `${entry!.prePart1Correct} out of 15` : <em>pending</em>}
                          </div>
                        );
                      }
                      if (item.id === 2) {
                        // Show teacher-recorded Phase 4 Activity 3 total score if available
                        let score: number | undefined;
                        try {
                          const tfRaw = localStorage.getItem('teacherFeedback');
                          if (tfRaw) {
                            const tf = JSON.parse(tfRaw || '{}');
                            const s = tf?.[user.username]?.lesson1?.phaseScores?.[4];
                            if (typeof s === 'number') score = s;
                          }
                        } catch (e) {}
                        if (typeof score !== 'number') {
                          try {
                            const stateObj = getLesson1State(user.username);
                            const v = stateObj?.phaseData?.[4] as any;
                            if (v && typeof v.teacherScore === 'number') score = v.teacherScore;
                          } catch (e) {}
                        }
                        return (
                          <div style={{ marginRight: 10, fontWeight: 700, color: score ? 'var(--primary-blue)' : 'inherit' }}>
                            {typeof score === 'number' ? `${score} out of 32` : <em>pending</em>}
                          </div>
                        );
                      }
                        if (item.id === 3) {
                          // Lesson 2: check teacherFeedback for lesson2 recorded score (phase 4)
                          let score2: number | undefined;
                          try {
                            const tfRaw = localStorage.getItem('teacherFeedback');
                            if (tfRaw) {
                              const tf = JSON.parse(tfRaw || '{}');
                              const s = tf?.[user.username]?.lesson2?.phaseScores?.[4];
                              if (typeof s === 'number') score2 = s;
                            }
                          } catch (e) {}
                          return (
                            <div style={{ marginRight: 10, fontWeight: 700, color: score2 ? 'var(--primary-blue)' : 'inherit' }}>
                              {typeof score2 === 'number' ? `${score2} out of 32` : <em>pending</em>}
                            </div>
                          );
                        }
                        if (item.id === 4) {
                          // Lesson 3: check teacherFeedback for lesson3 recorded score (phase 3)
                          let score3: number | undefined;
                          try {
                            const tfRaw = localStorage.getItem('teacherFeedback');
                            if (tfRaw) {
                              const tf = JSON.parse(tfRaw || '{}');
                              const s = tf?.[user.username]?.lesson3?.phaseScores?.[3];
                              if (typeof s === 'number') score3 = s;
                            }
                          } catch (e) {}
                          return (
                            <div style={{ marginRight: 10, fontWeight: 700, color: score3 ? 'var(--primary-blue)' : 'inherit' }}>
                              {typeof score3 === 'number' ? `${score3} out of 32` : <em>pending</em>}
                            </div>
                          );
                        }
                      if (item.id === 5) {
                        const hasScore = !!(entry && typeof entry.postPart1Correct === 'number');
                        return (
                          <div style={{ marginRight: 10, fontWeight: 700, color: hasScore ? 'var(--primary-blue)' : 'inherit' }}>
                            {hasScore ? `${entry!.postPart1Correct} out of 15` : <em>pending</em>}
                          </div>
                        );
                      }
                      return (
                        <div style={{ marginRight: 10, fontWeight: 700 }}>
                          <em>pending</em>
                        </div>
                      );
                    })()
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PerformanceSummary;
