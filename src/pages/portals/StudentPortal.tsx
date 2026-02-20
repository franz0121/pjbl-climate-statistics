import { useEffect, useState } from 'react';
import { HeaderStudentIcon } from '../../components/RoleIcons';
import ProgressBar from '../../components/ProgressBar';
import '../../styles/StudentPortal.css';
import { getUserProgress, getRewardShownSections, markRewardShown } from '../../services/progressService';
import ConfettiOverlay from '../../components/ConfettiOverlay';

interface AuthUser {
  username: string;
  role: 'student' | 'teacher' | 'admin' | null;
}

interface Student {
  id: string;
  name: string;
  username: string;
  password: string;
  hasLoggedIn: boolean;
}

interface Class {
  id: string;
  grade: string;
  section: string;
  students: Student[];
}

interface StudentPortalProps {
  user: AuthUser;
  onLogout: () => void;
  classes: Class[];
  onOpenSection?: (sectionId: number) => void;
  initialTab?: 'overview' | 'sections';
}

const sections = [
  { id: 1, title: 'Pre-Assessment', icon: '📋', completed: 0 },
  { id: 2, title: 'Lesson 1 – Climate Correlation Analysis', icon: '📊', completed: 0 },
  { id: 3, title: 'Lesson 2 – Climate Linear Regression Equations', icon: '📈', completed: 0 },
  { id: 4, title: 'Lesson 3 – Climate Predictions and Applications', icon: '🎯', completed: 0 },
  { id: 5, title: 'Post Assessment', icon: '✅', completed: 0 },
  { id: 6, title: 'Performance Summary', icon: '📚', completed: 0 }
];

const StudentPortal: React.FC<StudentPortalProps> = ({ user, onLogout, classes, onOpenSection, initialTab }) => {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sections'>('overview');
  const [sectionProgress, setSectionProgress] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const progress = getUserProgress(user.username);
    // Derive Performance Summary (id 6) as 20% per fully completed section 1..5
    const ids = [1,2,3,4,5];
    const completedCount = ids.reduce((acc, id) => acc + ((progress[id] === 100) ? 1 : 0), 0);
    const perf = Math.min(100, completedCount * 20);
    setSectionProgress({ ...progress, 6: perf });
  }, [user.username]);

  useEffect(() => {
    // Show confetti for first newly completed section not yet rewarded
    const completed = Object.entries(sectionProgress)
      .filter(([_, v]) => (v as number) === 100)
      .map(([k]) => Number(k));
    if (completed.length === 0) return;
    const shown = getRewardShownSections(user.username);
    const newlyCompleted = completed.find(id => !shown.includes(id));
    if (newlyCompleted) {
      setShowConfetti(true);
      markRewardShown(user.username, newlyCompleted as any);
    }
  }, [sectionProgress, user.username]);

  const isSectionLocked = (sectionId: number) => {
    if (user.role === 'admin') return false;
    // Do not lock Performance Summary (id 6) — always accessible to students
    if (sectionId === 6) return false;
    // If Pre-Assessment (1) or Post-Assessment (5) is already completed, make it inaccessible
    if ((sectionId === 1 || sectionId === 5) && (sectionProgress[sectionId] || 0) === 100) return true;
    if (sectionId === 1) return false;
    const prevProgress = sectionProgress[sectionId - 1] || 0;
    return prevProgress !== 100;
  };

  const handleSectionClick = (sectionId: number) => {
    const locked = isSectionLocked(sectionId);
    if (locked) return;
    if (onOpenSection) {
      onOpenSection(sectionId);
    } else {
      setActiveSection(activeSection === sectionId ? null : sectionId);
    }
  };


  const displayName = (() => {
    for (const cls of classes) {
      const found = cls.students.find(s => s.username === user.username);
      if (found) return found.name;
    }
    return user.username;
  })();

  return (
    <div className="portal-container">
      {showConfetti && (
        <ConfettiOverlay onClose={() => setShowConfetti(false)} />
      )}
      <header className="portal-header">
        <div className="header-left">
          <span className="header-badge badge--student"><HeaderStudentIcon /></span>
          <div className="header-texts">
            <h1 className="portal-title">Statistics Meets Climate Action</h1>
            <p className="portal-subtitle">Student Dashboard</p>
          </div>
        </div>
        <div className="header-right">
          <p className="welcome-text">Welcome, <strong>{displayName}</strong> {user.role==='admin' && (<span className="admin-mode-badge" title="Bypass enabled for testing">Admin Mode</span>)}</p>
          <button className="logout-button" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="portal-content">
        <div className="overview-tabs">
          <button className={`tab-button ${activeTab==='overview'?'active':''}`} onClick={()=>setActiveTab('overview')}>Overview</button>
          <button className={`tab-button ${activeTab==='sections'?'active':''}`} onClick={()=>setActiveTab('sections')}>Learning Sections</button>
        </div>

        {activeTab === 'overview' && (
          <section className="overview">
            <h2 className="overview-title"><span className="title-top">Digital Project-Based Learning:</span><span className="title-bottom">Integrating Climate Change into Statistics Instruction</span></h2>
            <p className="overview-intro">This material connects core statistics with real climate issues to build data literacy, critical thinking, and community-oriented problem solving. Students analyze local datasets, interpret relationships, and communicate insights for action. Activities emphasize meaningful applications of statistics to climate questions, helping learners understand evidence, uncertainty, and responsible decision-making.</p>

            <div className="overview-section">
              <h3 className="center section-title"><span className="title-icon">📘</span> Learning Competencies</h3>
              <p className="overview-sub center">These are the specific statistical skills students will develop through climate-focused projects.</p>
              <div className="cards-3">
                <div className="card">
                  <ul>
                    <li>The learner calculates Pearson's sample correlation coefficient <span className="code-blue">(M11/12SP-IVh-2)</span></li>
                    <li>The learner solves problems involving correlation analysis <span className="code-blue">(M11/12SP-IVh-3)</span></li>
                  </ul>
                </div>
                <div className="card">
                  <ul>
                    <li>The learner calculates the slope and y-intercept of the regression line <span className="code-blue">(M11/12SP-IVi-3)</span></li>
                    <li>The learner interprets the calculated slope and y-intercept of the regression line <span className="code-blue">(M11/12SP-IVi-4)</span></li>
                  </ul>
                </div>
                <div className="card">
                  <ul>
                    <li>The learner predicts the value of the dependent variable given the value of the independent variable <span className="code-blue">(M11/12SP-IVj-1)</span></li>
                    <li>The learner solves problems involving regression analysis <span className="code-blue">(M11/12SP-IVj-2)</span></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="overview-section">
              <h3 className="center section-title"><span className="title-icon">🎯</span> Learning Objectives</h3>
              <p className="overview-sub center">By the end of these projects, students will be able to apply statistical methods to real climate data.</p>
              <div className="cards-3">
                <div className="card">
                  <ul>
                    <li>Explain the meaning, strength, and direction of Pearson's sample correlation by interpreting two local climate variables.</li>
                    <li>Calculate Pearson's r accurately from a local environmental dataset using formulas or spreadsheets.</li>
                    <li>Analyze a correlation scenario to propose at least one actionable recommendation for a local environmental problem.</li>
                  </ul>
                </div>
                <div className="card">
                  <ul>
                    <li>Explain the meaning of slope and y‑intercept by describing how changes in one climate variable affect another.</li>
                    <li>Calculate slope and y‑intercept accurately from a local dataset using the correct formula or spreadsheet tools.</li>
                    <li>Interpret slope and intercept to suggest practical recommendations addressing local environmental issues.</li>
                  </ul>
                </div>
                <div className="card">
                  <ul>
                    <li>Explain how a regression equation supports prediction by relating a climate input to an outcome.</li>
                    <li>Predict the dependent variable accurately using a given regression equation and specified inputs.</li>
                    <li>Analyze a regression problem, note limitations, and propose an actionable recommendation for the community.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="overview-section">
              <h3 className="center section-title"><span className="title-icon">🧩</span> Expected Outputs</h3>
              <p className="overview-sub center">Students will complete three progressive climate analysis projects demonstrating their statistical mastery.</p>
              <div className="cards-3 centered">
                <div className="card">
                  <h4 className="blue-title">Climate Correlation Analysis Project: "Understanding Our Local Environment"</h4>
                  <p>Students investigate the relationship between two climate-related variables in the Davao Region and provide evidence-based recommendations to local stakeholders.</p>
                  <span className="duration">Duration: 4 hours</span>
                </div>
                <div className="card">
                  <h4 className="blue-title">Climate Action Project: Analyzing Local Environmental Trends Through Regression</h4>
                  <p>Students analyze local data, calculate and interpret regression lines, and present actionable recommendations to relevant stakeholders.</p>
                  <span className="duration">Duration: 4 hours</span>
                </div>
                <div className="card">
                  <h4 className="blue-title">Climate-Impact Prediction Project: "What Will Our Weather Cost Us?"</h4>
                  <p>Students model how a climate variable affects a community concern, use regression to make predictions, and propose recommendations to stakeholders.</p>
                  <span className="duration">Duration: 4 hours</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'sections' && (
          <section className="sections-container">
            <h2>Learning Sections</h2>
            <div className="sections-grid">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`section-card ${activeSection === section.id ? 'active' : ''} ${isSectionLocked(section.id)?'locked':''}`}
                  onClick={() => handleSectionClick(section.id)}
                >
                  <div className="section-header">
                    <span className="section-icon">{section.icon}</span>
                    {isSectionLocked(section.id) && <span className="section-lock-icon" title="Locked until previous section is completed">🔒</span>}
                  </div>
                  <h3>{section.title}</h3>
                  <ProgressBar progress={sectionProgress[section.id] || 0} />
                  <p className="progress-text">{sectionProgress[section.id] || 0}% Complete</p>

                  {sectionProgress[section.id] === 100 && (
                    <div className="section-content">
                      <p>🎉 Reward unlocked! Great job completing this section.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default StudentPortal;
