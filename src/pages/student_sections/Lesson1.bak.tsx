import { useEffect, useMemo, useRef, useState } from 'react';
              {open.p2 && (
                <div className="accordion-content">
                  <div className="card"><div>Phase 2 content is loading...</div></div>
                  {p2Score !== undefined && (
                    <div className="banner">Teacher Score: {p2Score}%</div>
                  )}
                </div>
              )}
  function clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.min(max, Math.max(min, value));
  }

  // Lightweight scatter plot renderer used in Activities 2–3
  function renderScatterSVG(
    points: [number, number][],
    width = 420,
    height = 300,
    className?: string,
    displayHeight?: number,
    xLabel?: string,
    yLabel?: string,
    overlayText?: string,
    subtitleText?: string
  ) {
    const padL = 44, padR = 24, padT = 20, padB = 40;
    const w = width - padL - padR;
    const h = height - padT - padB;
    const sx = (x: number) => padL + (clamp(x, 0, 100) / 100) * w;
    const sy = (y: number) => padT + (1 - clamp(y, 0, 100) / 100) * h;
    return (
      <svg
        className={className}
        viewBox={`0 0 ${width} ${height}`}
        style={{ background: '#ffffff', height: displayHeight ? `${displayHeight}px` : undefined, borderRadius: 8 }}
      >
        <rect x={padL} y={padT} width={w} height={h} fill="#FFF5F9" stroke="#FFD4E4" />
        {/* axes */}
        <line x1={padL} y1={padT + h} x2={padL + w} y2={padT + h} stroke="#B6B6B6" />
        <line x1={padL} y1={padT} x2={padL} y2={padT + h} stroke="#B6B6B6" />
        {/* labels */}
        {xLabel && <text x={padL + w / 2} y={height - 10} textAnchor="middle" fontSize={12} fill="#6B2F47">{xLabel}</text>}
        {yLabel && (
          <text x={14} y={padT + h / 2} textAnchor="middle" fontSize={12} fill="#6B2F47" transform={`rotate(-90 14 ${padT + h / 2})`}>{yLabel}</text>
        )}
        {/* points */}
        {points.map(([x, y], i) => (
          <circle key={i} cx={sx(x)} cy={sy(y)} r={3.2} fill="#8A4D66" opacity={0.85} />
        ))}
        {/* overlay */}
        {overlayText && <text x={width - 8} y={14} textAnchor="end" fontSize={12} fill="#6B2F47">{overlayText}</text>}
        {subtitleText && <text x={width - 8} y={28} textAnchor="end" fontSize={11} fill="#8A8A8A">{subtitleText}</text>}
      </svg>
    );
  }

  function makePatternPoints(pattern: P2Pattern): [number, number][] {
    const pts: [number, number][] = [];
    const n = 40;
    for (let i=0;i<n;i++) {
      const x = i*(100/(n-1));
      let y: number;
      if (pattern === 'positive') {
        y = x + randn(0, 12);
      } else if (pattern === 'negative') {
        y = 100 - x + randn(0, 12);
      } else {
        y = 50 + randn(0, 30);
      }
      pts.push([clamp(x,0,100), clamp(y,0,100)]);
    }
    return pts;
  }

  const visualGuides = useMemo(() => ([
    { label: 'Positive correlation', points: makePatternPoints('positive') },
    { label: 'Negative correlation', points: makePatternPoints('negative') },
    { label: 'No correlation', points: makePatternPoints('none') }
  ]), []);

  // ========= Phase 2 Activity 2 (Card 3) datasets and selection =========
  const p2A2Datasets = useMemo(() => ([
    {
      v1: 'Consecutive Dry Days (x)', v2: 'Water Service Interruptions (y)',
      x: ['20.00','10.00','13.00','3.00','6.00','3.00','19.00','16.00'],
      y: ['10.00','3.00','2.00','2.00','4.00','2.00','8.00','8.00']
    },
    {
      v1: 'Temperature Mean (°C) (x)', v2: 'Electricity Demand (GWh) (y)',
      x: ['27.68','26.21','28.28','28.41','25.85','30.23','29.60','28.96'],
      y: ['602.00','683.00','704.00','633.00','615.00','740.00','708.00','679.00']
    },
    {
      v1: 'Rainfall Total (mm) (x)', v2: 'Dengue Cases (y)',
      x: ['63.00','417.00','275.00','179.00','126.00','86.00','391.00','289.00'],
      y: ['61.00','493.00','193.00','467.00','374.00','144.00','426.00','202.00']
    },
    {
      v1: 'ENSO Index (Niño 3.4) (x)', v2: 'Banana Production (MT) (y)',
      x: ['0.50','0.20','1.70','0.80','-0.10','0.70','-0.30','-1.30'],
      y: ['102,061.00','106,146.00','84,229.00','91,548.00','106,147.00','102,490.00','112,551.00','97,878.00']
    },
    {
      v1: 'Wind Speed (m/s) (x)', v2: 'Municipal Fish Catch (MT) (y)',
      x: ['7.12','4.27','1.22','8.36','3.64','2.43','2.66','4.01'],
      y: ['2,092.00','2,447.00','2,587.00','2,024.00','2,197.00','2,722.00','2,435.00','1,066.00']
    },
    {
      v1: 'PM2.5 (μg/m³) (x)', v2: 'Respiratory ER Visits (y)',
      x: ['62.56','13.75','10.45','27.43','60.35','54.24','79.40','53.22'],
      y: ['442.00','689.00','337.00','332.00','733.00','389.00','630.00','685.00']
    },
    {
      v1: 'Rainfall Total (mm) (x)', v2: 'Traffic Accidents (y)',
      x: ['63.00','417.00','275.00','179.00','126.00','86.00','391.00','289.00'],
      y: ['298.00','373.00','160.00','182.00','367.00','245.00','291.00','372.00']
    },
    {
      v1: 'Heat Index (°C) (x)', v2: 'Heat-Related Illness Cases (y)',
      x: ['38.91','33.01','32.58','34.38','31.67','40.28','37.43','38.15'],
      y: ['12.00','21.00','23.00','39.00','33.00','33.00','48.00','40.00']
    },
    {
      v1: 'Temperature Mean (°C) (x)', v2: 'Tourist Arrivals (y)',
      x: ['27.68','26.21','28.28','28.41','25.85','30.23','29.60','28.96'],
      y: ['43,260.00','19,680.00','43,305.00','29,849.00','29,748.00','14,546.00','45,558.00','34,024.00']
    },
    {
      v1: 'Sea Surface Temp (°C) (x)', v2: 'Commercial Fish Catch (MT) (y)',
      x: ['30.33','26.71','29.06','26.29','28.47','27.40','26.76','26.12'],
      y: ['2,390.00','3,497.00','4,066.00','2,237.00','2,165.00','4,678.00','3,232.00','2,082.00']
    }
  ]), []);
  const [p2A2Sel, setP2A2Sel] = useState<number | null>(null);
  const [p2A2Locked, setP2A2Locked] = useState<boolean>(false);
  const selectedDataset = p2A2Sel !== null ? p2A2Datasets[p2A2Sel] : null;
  const [visibleStep, setVisibleStep] = useState<number | null>(null);
  const selfAssessItems = [
    'I can correctly encode and organize two related variables in a spreadsheet for analysis.',
    'I can create an accurate scatterplot using spreadsheet tools.',
    'I can properly label the scatterplot (title, x-axis, y-axis) to represent the data clearly.',
    'I can use spreadsheet formulas or functions to calculate the correlation coefficient (r).',
    'I can interpret the value of r to describe the strength and direction of the relationship between variables.'
  ];
  const selfAssessScale: string[] = [
    'Yes, independently and accurately',
    'Yes, with minimal assistance',
    'Yes, with some guidance',
    'Yes, with significant help',
    'No, I cannot do this yet'
  ];
  // Activity 3 local states
  const [selfAssessAnswers, setSelfAssessAnswers] = useState<string[]>(Array(selfAssessItems.length).fill(''));
  const [selfAssessSubmitted, setSelfAssessSubmitted] = useState<boolean>(false);
  const [uploadPreview, setUploadPreview] = useState<{ url: string; type: 'image' | 'pdf' } | null>(null);
  const [checkpointAnswers, setCheckpointAnswers] = useState<Array<'yes' | 'no' | ''>>(['', '', '', '']);
  const [checkpointFinalized, setCheckpointFinalized] = useState<boolean>(false);

  // ========= Phase 2 Activity 4 (Interpretation Quiz) state =========
  const a4StrengthOptions: string[] = [
    'Perfect',
    'Very Strong',
    'Strong',
    'Moderate',
    'Weak',
    'Very Weak',
    'No Relationship'
  ];
  const a4DirectionOptions: string[] = ['Positive', 'Negative', 'None'];
  const a4QuizItems: Array<{ r: string; strength: string; direction: string }> = [
    { r: '0.43', strength: 'Moderate', direction: 'Positive' },
    { r: '-0.97', strength: 'Very Strong', direction: 'Negative' },
    { r: '0.18', strength: 'Very Weak', direction: 'Positive' },
    { r: '0.74', strength: 'Strong', direction: 'Positive' },
    { r: '-0.27', strength: 'Weak', direction: 'Negative' }
  ];
  const [a4StrengthSel, setA4StrengthSel] = useState<string[]>(Array(a4QuizItems.length).fill(''));
  const [a4DirectionSel, setA4DirectionSel] = useState<string[]>(Array(a4QuizItems.length).fill(''));
  const a4Complete = useMemo(() => (
    a4StrengthSel.every(v => (v || '').trim().length > 0) &&
    a4DirectionSel.every(v => (v || '').trim().length > 0)
  ), [a4StrengthSel, a4DirectionSel]);
  const [a4Checked, setA4Checked] = useState<boolean>(false);
  const [a4Correct, setA4Correct] = useState<boolean[]>(Array(a4QuizItems.length).fill(false));
  const checkA4Answers = () => {
    const norm = (s: string) => (s || '').trim().toLowerCase();
    const results = a4QuizItems.map((it, i) => (
      norm(a4StrengthSel[i]) === norm(it.strength) && norm(a4DirectionSel[i]) === norm(it.direction)
    ));
    setA4Correct(results);
    setA4Checked(true);
  };
  // Small functional calculator used in Activity 2 step cards
  const BasicCalc: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
    const [display, setDisplay] = useState<string>('0');
    const [acc, setAcc] = useState<number | null>(null);
    const [op, setOp] = useState<'+' | '-' | '×' | '÷' | null>(null);
    const [fresh, setFresh] = useState<boolean>(true);

    const parseVal = (s: string) => {
      const t = s.replace(/,/g, '');
      const v = Number(t);
      return Number.isFinite(v) ? v : 0;
    };
    const formatVal = (v: number) => {
      if (!Number.isFinite(v)) return 'Error';
      const s = v.toString();
      return s;
    };
    const apply = (a: number, b: number, o: NonNullable<typeof op>) => {
      switch (o) {
        case '+': return a + b;
        case '-': return a - b;
        case '×': return a * b;
        <main className="portal-content">
          <div className="lesson-container">
            <div className="accordion">
              <div className="accordion-item">
                <div className="accordion-header"><h3>Lesson</h3></div>
                <div className="accordion-content">Content loading…</div>
              </div>
            </div>
          </div>
        </main>
        return next;
      });
    };

    const pearson = () => {
      const rows = cells.slice(1); // exclude header
      const xs: number[] = [];
      const ys: number[] = [];
      rows.forEach(r => {
        const xv = Number(r[1]);
        const yv = Number(r[2]);
        if (Number.isFinite(xv) && Number.isFinite(yv)) { xs.push(xv); ys.push(yv); }
      });
      const n = xs.length;
      if (n === 0) return NaN;
      const sum = (a:number[]) => a.reduce((acc,v)=>acc+v,0);
      const sX = sum(xs), sY = sum(ys);
      const sXY = sum(xs.map((v,i)=>v*ys[i]));
      const sX2 = sum(xs.map(v=>v*v));
      const sY2 = sum(ys.map(v=>v*v));
      const num = n * sXY - sX * sY;
      const den = Math.sqrt((n * sX2 - sX*sX) * (n * sY2 - sY*sY));
      return den === 0 ? NaN : num / den;
    };

    const r = pearson();

    return (
      <div>
        <div style={{ overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <table style={{ width: '100%', minWidth: 520, borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {cells[0].map((h, idx) => (
                  <th key={idx} style={{ position: 'sticky', top: 0, background: '#fafafa', textAlign: 'center', padding: '8px 6px', borderBottom: '2px solid #ddd', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cells.slice(1).map((row, ri) => (
                <tr key={ri}>
                  {/* Month label (read-only) */}
                  <td style={{ padding: '6px', borderBottom: '1px solid #eee', textAlign: 'center', background: '#f8fafc' }}>{row[0]}</td>
                  {/* X editable */}
                  <td style={{ padding: 0, borderBottom: '1px solid #eee' }}>
                    <input value={row[1]} onChange={(e)=> setCell(ri+1, 1, e.target.value)} style={{ width: '100%', height: 32, border: 'none', padding: '0 6px', textAlign: 'center' }} />
                  </td>
                  {/* Y editable */}
                  <td style={{ padding: 0, borderBottom: '1px solid #eee' }}>
                    <input value={row[2]} onChange={(e)=> setCell(ri+1, 2, e.target.value)} style={{ width: '100%', height: 32, border: 'none', padding: '0 6px', textAlign: 'center' }} />
                  </td>
                  {/* xy computed */}
                  <td style={{ padding: '6px', borderBottom: '1px solid #eee', textAlign: 'center', background: '#f8fafc' }}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 700 }}>Compute:</span>
          <span style={{ fontFamily: 'monospace' }}>CORREL(X, Y)</span>
          <span>=</span>
          <span style={{ fontWeight: 700 }}>{Number.isFinite(r) ? r.toFixed(4) : '—'}</span>
        </div>
      </div>
    );
  };

  const stepCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showAllSteps, setShowAllSteps] = useState<boolean>(false);
  const showStep = (step: number) => {
    setShowAllSteps(false);
    setVisibleStep(step);
    setTimeout(() => {
      const el = stepCardRefs.current[step - 1];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  };
  const tableRef = useRef<HTMLDivElement | null>(null);
  const scrollToTable = () => {
    setVisibleStep(null);
    setTimeout(() => {
      const el = tableRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.pageYOffset - 72; // offset to include top step buttons
      window.scrollTo({ top, behavior: 'smooth' });
    }, 0);
  };
  const [nVal, setNVal] = useState<string>('');
  const [nLocked, setNLocked] = useState<boolean>(false);
  const [xSumVal, setXSumVal] = useState<string>('');
  const [xSumLocked, setXSumLocked] = useState<boolean>(false);
  const [ySumVal, setYSumVal] = useState<string>('');
  const [ySumLocked, setYSumLocked] = useState<boolean>(false);
  const [xyVals, setXyVals] = useState<string[]>(Array(8).fill(''));
  const [xyLocked, setXyLocked] = useState<boolean>(false);
  const [xySumVal, setXySumVal] = useState<string>('');
  const [xySumLocked, setXySumLocked] = useState<boolean>(false);
  const [xSqVals, setXSqVals] = useState<string[]>(Array(8).fill(''));
  const [xSqLocked, setXSqLocked] = useState<boolean>(false);
  const [xSqSumVal, setXSqSumVal] = useState<string>('');
  const [xSqSumLocked, setXSqSumLocked] = useState<boolean>(false);
  const [ySqVals, setYSqVals] = useState<string[]>(Array(8).fill(''));
  const [ySqLocked, setYSqLocked] = useState<boolean>(false);
  const [ySqSumVal, setYSqSumVal] = useState<string>('');
  const [ySqSumLocked, setYSqSumLocked] = useState<boolean>(false);

  // Card 10 formula input boxes (independent fields)
  const [fNNum, setFNNum] = useState<string>('');
  const [fXYNum, setFXYNum] = useState<string>('');
  const [fXNum, setFXNum] = useState<string>('');
  const [fYNum, setFYNum] = useState<string>('');
  const [fN_DX, setFN_DX] = useState<string>('');
  const [fXSq_DX, setFXSq_DX] = useState<string>('');
  const [fX_DX, setFX_DX] = useState<string>('');
  const [fN_DY, setFN_DY] = useState<string>('');
  const [fYSq_DY, setFYSq_DY] = useState<string>('');
  const [fY_DY, setFY_DY] = useState<string>('');

  // Card 10 auto-check helpers and status
  const norm = (s: string | number | null | undefined) => String(s ?? '').trim();
  const toNum = (s: string | number | null | undefined) => {
    const v = Number(norm(s));
    return Number.isFinite(v) ? v : null;
  };
  const eqVal = (a: string | number | null | undefined, b: string | number | null | undefined) => {
    const na = toNum(a), nb = toNum(b);
    if (na !== null && nb !== null) return na === nb;
    return norm(a) === norm(b);
  };
  const anyFilled = (arr: Array<string | undefined>) => arr.some(s => norm(s).length > 0);
  const allMatch = (arr: Array<string | undefined>, target: string | undefined) => arr.every(s => eqVal(s, target));

  const nOk = useMemo(() => !!norm(nVal) && allMatch([fNNum, fN_DX, fN_DY], nVal), [nVal, fNNum, fN_DX, fN_DY]);
  const nShow = useMemo(() => !!norm(nVal) && anyFilled([fNNum, fN_DX, fN_DY]), [nVal, fNNum, fN_DX, fN_DY]);

  const sxOk = useMemo(() => !!norm(xSumVal) && allMatch([fXNum, fX_DX], xSumVal), [xSumVal, fXNum, fX_DX]);
  const sxShow = useMemo(() => !!norm(xSumVal) && anyFilled([fXNum, fX_DX]), [xSumVal, fXNum, fX_DX]);

  const syOk = useMemo(() => !!norm(ySumVal) && allMatch([fYNum, fY_DY], ySumVal), [ySumVal, fYNum, fY_DY]);
  const syShow = useMemo(() => !!norm(ySumVal) && anyFilled([fYNum, fY_DY]), [ySumVal, fYNum, fY_DY]);

  const sxyOk = useMemo(() => !!norm(xySumVal) && allMatch([fXYNum], xySumVal), [xySumVal, fXYNum]);
  const sxyShow = useMemo(() => !!norm(xySumVal) && anyFilled([fXYNum]), [xySumVal, fXYNum]);

  const sx2Ok = useMemo(() => !!norm(xSqSumVal) && allMatch([fXSq_DX], xSqSumVal), [xSqSumVal, fXSq_DX]);
  const sx2Show = useMemo(() => !!norm(xSqSumVal) && anyFilled([fXSq_DX]), [xSqSumVal, fXSq_DX]);

  const sy2Ok = useMemo(() => !!norm(ySqSumVal) && allMatch([fYSq_DY], ySqSumVal), [ySqSumVal, fYSq_DY]);
  const sy2Show = useMemo(() => !!norm(ySqSumVal) && anyFilled([fYSq_DY]), [ySqSumVal, fYSq_DY]);

  const CheckCircle = ({ size = 22 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="correct" role="img">
      <circle cx="12" cy="12" r="10" fill="none" stroke="#2ecc71" strokeWidth="3" />
      <path d="M6 12l4 4 8-8" fill="none" stroke="#2ecc71" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const StopSign = ({ size = 22 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-label="incorrect" role="img">
      <circle cx="12" cy="12" r="11" fill="#e74c3c" stroke="#c0392b" strokeWidth="2" />
      <rect x="5" y="10.5" width="14" height="3" fill="#ffffff" />
    </svg>
  );

  const allValuesOk = nOk && sxOk && syOk && sxyOk && sx2Ok && sy2Ok;
  const [plotVisible, setPlotVisible] = useState<boolean>(false);
  const [corrAnswer, setCorrAnswer] = useState<string>('');
  const [corrLocked, setCorrLocked] = useState<boolean>(false);

  const cleanName = (s?: string) => (s || '').replace(/\s*\(x\)\s*/i, '').replace(/\s*\(y\)\s*/i, '').trim();
  const rMap: Record<string, Record<string, string>> = {
    'Consecutive Dry Days': { 'Water Service Interruptions': 'r=0.8509' },
    'Temperature Mean (°C)': { 'Electricity Demand (GWh)': 'r=0.6391', 'Tourist Arrivals': 'r=0.0801' },
    'Rainfall Total (mm)': { 'Dengue Cases': 'r=0.5900', 'Traffic Accidents': 'r=0.2152' },
    'ENSO Index (Niño 3.4)': { 'Banana Production (MT)': 'r=-0.5738' },
    'Wind Speed (m/s)': { 'Municipal Fish Catch (MT)': 'r=-0.3738' },
    'PM2.5 (μg/m³)': { 'Respiratory ER Visits': 'r=0.3402' },
    'Heat Index (°C)': { 'Heat-Related Illness Cases': 'r=0.1222' },
    'Sea Surface Temp (°C)': { 'Commercial Fish Catch (MT)': 'r=0.0502' },
  };
  const currentR = (() => {
    const v1 = cleanName(selectedDataset?.v1); const v2 = cleanName(selectedDataset?.v2);
    return (rMap[v1]?.[v2]) || 'r=—';
  })();

  const parseVal = (s: string) => Number((s || '').replace(/,/g, ''));
  const pointsForDataset = useMemo<[number, number][]>(() => {
    if (!selectedDataset) return [] as [number, number][];
    const xs = selectedDataset.x.map(parseVal);
    const ys = selectedDataset.y.map(parseVal);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const scale = (v: number, min: number, max: number) => {
      if (!isFinite(v) || !isFinite(min) || !isFinite(max)) return 50;
      if (max === min) return 50;
      return ((v - min) / (max - min)) * 100;
    };
    return xs.map((vx, i) => [scale(vx, minX, maxX), scale(ys[i], minY, maxY)]);
  }, [selectedDataset]);

  const onSubmitP2A1 = () => {
    const norm = (s:string) => (s||'').trim().toLowerCase();
    const synonyms: Record<P2Pattern, string[]> = {
      positive: ['positive','pos','+','increasing','upward','uptrend'],
      negative: ['negative','neg','-','decreasing','downward','downtrend'],
      none: ['none','no correlation','zero','no pattern','random']
    };
    const results = p2Pairs.map((pair, i) => {
      const a = norm(p2Answers[i] || '');
      return synonyms[pair.pattern].some(k => a.includes(k));
    });
    setP2Result(results);
    const score = results.filter(Boolean).length;
    const next = savePhase2Activity1(user.username, p2Answers, score);
    setState(next);
  };

  // Original gating logic retained for indicator only; navigation is free for review
  const isLocked = (phase: number) => {
    if (phase === 1) return false;
    return !state.completedPhases.includes(phase - 1);
  };

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
  return (
    <div>
      <header>
        <div>
          <p className="welcome-text">Welcome, <strong>{displayName}</strong></p>
          <button className="logout-button" onClick={onBack}>Back to Dashboard</button>
        </div>
      </header>
      <main className="portal-content">
        <div className="lesson-container">
          <ProgressBar progress={progressPct} />

          <div className="accordion">
            {/* Overview */}
            <div className="accordion-item overview">
              <div className="accordion-header" onClick={() => setOpen(o => ({ ...o, overview: !o.overview }))}>
                <h3>Mission Brief: Understanding Our Local Environment</h3>
                <span>{open.overview ? '▼' : '▶'}</span>
              </div>
              {open.overview && (
                <div className="accordion-content">
                  <h4>Climate Correlation Analysis Project: "Understanding Our Local Environment"</h4>
                  <p>
                    Students will investigate the relationship between two climate-related variables in their local area (Davao Region)
                    and provide evidence-based recommendations to local stakeholders.
                  </p>
                  <div className="cards-row">
                    <div className="card">
                      <h4>Standards</h4>
                      <ul>
                        <li>LC1: The learner calculates Pearson’s sample correlation coefficient (M11/12SP-IVh-2)</li>
                        <li>LC2: The learner solves problems involving correlation analysis (M11/12SP-IVh-3)</li>
                      </ul>
                    </div>
                    <div className="card">
                      <h4>Learning Objectives</h4>
                      <ul>
                        <li>LO1: Explain Pearson’s r by interpreting relationships between local climate variables.</li>
                        <li>LO2: Calculate Pearson’s r accurately from a local dataset.</li>
                        <li>LO3: Analyze a correlation scenario to propose at least one actionable recommendation.</li>
                      </ul>
                    </div>
                    <div className="card">
                      <h4>Getting Started</h4>
                      <p className="hint">Review the brief, then begin Phase 1 to set variables and your guiding question.</p>
                    </div>
                  </div>
                  <div className="section-actions">
                    <button className="save-btn" onClick={() => { unlockPhase(1); setOpen(o => ({ ...o, overview: false, p1: true })); }}>Start First Mission</button>
                  </div>
                </div>
              )}
            </div>

            {/* Phase 1 */}
            <div className="accordion-item phase1">
              <div className="accordion-header" onClick={() => { if (isLocked(1)) return; setOpen(o => ({ ...o, p1: !o.p1 })); setSubOpen({ a1:false, a2:false, a3:false, a4:false }); }}>
                <h3>Phase 1: Launch the Investigation { isLocked(1) && <span className="locked-tag" title="Complete previous phase to unlock" aria-label="Locked">🔒</span> }</h3>
                <span className="right-indicator">{getPhase1Progress(state) >= 25 && (<span className="status-tag">Completed</span>)}<span className="toggle-sign">{open.p1 ? '▼' : '▶'}</span></span>
              </div>
              {open.p1 && (
                <div className="accordion-content">
                  <div className="sub-accordion">
                  {/* Accordion 1: Activity 1 */}
                  <div className="sub-item">
                    <div className="sub-header green" onClick={()=> setSubOpen(s => ({ ...s, a1: !s.a1 }))}><span className="label"><span className="icon">🔎</span> <b>Activity 1: Explore the Data</b></span>{!(user.role==='admin') && !((state.phaseData as any)[1]?.a1Done) && (<span className="locked-tag" title="Complete previous activity to unlock" aria-label="Locked">🔒</span>)}<span className="right-indicator">{(state.phaseData as any)[1]?.a1Done && (<span className="status-tag">Completed</span>)}<span className="toggle-sign">{subOpen.a1 ? '−' : '+'}</span></span></div>
                    <div className="sub-content" style={{display: subOpen.a1 ? 'block' : 'none'}}>
                  <div className="card spacious activity-card">
                    <div className="info-cards">
                      <div className="info-card">
                        <div className="icon-label"><span className="icon">🧭</span> <b>What you will do:</b></div>
                        <p>Start by exploring real climate and environmental data. You’ll see a bar graph and several filter buttons on the screen.</p>
                      </div>
                      <div className="info-card">
                        <div className="icon-label"><span className="icon">🛠️</span> <b>How to do it:</b></div>
                        <ol style={{ paddingLeft: 22 }}>
                          <li>Click the filter buttons to change what data appears on the bar graph.</li>
                          <li>Observe how the values change when you select different options.</li>
                          <li>Take note of patterns, increases, decreases, or anything that catches your attention.</li>
                        </ol>
                      </div>
                    </div>
                    <div className="gap-3">
                      <div className="input-row">
                        <label><b>Year</b></label>
                        <select value={(state.phaseData as any)[1]?.year ?? 'All'} onChange={(e)=> savePhaseData(1, { year: e.target.value === 'All' ? 'All' : Number(e.target.value) as Year })}>
                          <option value={'All'}>All</option>
                          <option value={2021}>2021</option>
                          <option value={2022}>2022</option>
                          <option value={2023}>2023</option>
                          <option value={2024}>2024</option>
                        </select>
                        <label className="icon-label" style={{ fontSize: '1.05rem', fontWeight: 700 }}><span className="legend-dot" style={{ background:'var(--plot-primary)', width:14, height:14 }}></span><b>Climate Data</b></label>
                        <select value={(state.phaseData as any)[1]?.climateKey || climateLabels[0]} onChange={(e)=> savePhaseData(1, { climateKey: e.target.value })}>
                          {([...climateLabels].map(String).sort((a,b)=> a.localeCompare(b))).map(k => (<option key={k} value={k}>{k}</option>))}
                        </select>
                        <label className="icon-label" style={{ fontSize: '1.05rem', fontWeight: 700 }}><span className="legend-dot" style={{ background:'var(--plot-secondary)', width:14, height:14 }}></span><b>Societal Data</b></label>
                        <select value={(state.phaseData as any)[1]?.socKey || societalLabels[0]} onChange={(e)=> savePhaseData(1, { socKey: e.target.value })}>
                          {([...societalLabels].map(String).sort((a,b)=> a.localeCompare(b))).map(k => (<option key={k} value={k}>{k}</option>))}
                        </select>
                      </div>
                      <div className="var-def">
                        {(() => {
                          const ck = ((state.phaseData as any)[1]?.climateKey || climateLabels[0]) as string;
                          return (
                            <div>
                              <div><b>{ck}</b></div>
                              <div>Definition: {getLabelDef(ck)}</div>
                            </div>
                          );
                        })()}
                        {(() => {
                          const sk = ((state.phaseData as any)[1]?.socKey || societalLabels[0]) as string;
                          return (
                            <div style={{ marginTop: 6 }}>
                              <div><b>{sk}</b></div>
                              <div>Definition: {getLabelDef(sk)}</div>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="gap-4" />
                      {/* Graph */}
                      {(() => {
                        const yearSel = (state.phaseData as any)[1]?.year ?? 'All';
                        const ck = ((state.phaseData as any)[1]?.climateKey || climateLabels[0]) as keyof import('../../services/lesson1Phase1Data').ClimateRecord;
                        const sk = ((state.phaseData as any)[1]?.socKey || societalLabels[0]) as keyof import('../../services/lesson1Phase1Data').SocietalRecord;
                        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        const seriesA = yearSel === 'All'
                          ? ([2021,2022,2023,2024] as Year[]).reduce((acc, y) => {
                              const arr = getMonthlySeriesForClimate(y, ck);
                              return acc.map((v,i)=> v + arr[i]);
                            }, Array(12).fill(0)).map(v=> v / 4)
                          : getMonthlySeriesForClimate(yearSel as Year, ck);
                        const seriesB = yearSel === 'All'
                          ? ([2021,2022,2023,2024] as Year[]).reduce((acc, y) => {
                              const arr = getMonthlySeriesForSocietal(y, sk);
                              return acc.map((v,i)=> v + arr[i]);
                            }, Array(12).fill(0)).map(v=> v / 4)
                          : getMonthlySeriesForSocietal(yearSel as Year, sk);
                        return <BarDualChart months={months} seriesA={seriesA} seriesB={seriesB} width={1100} height={420} barWidthScale={0.8} colorA={"var(--plot-primary)"} colorB={"var(--plot-secondary)"} valueColorA={"var(--plot-secondary)"} valueColorB={"var(--plot-primary)"} showValues={true} />;
                      })()}
                      <div className="gap-3"><b>Think about this:</b></div>
                      <p>What does the data tell you? Which data sets seem connected or related?</p>
                      <div className="section-actions">
                        <button className="mark-btn" onClick={()=>{ const next = setPhase1ActivityFlag(user.username, 'a1Done', true); setState(next); setSubOpen({ a1: false, a2: true, a3: false, a4: false }); }}>Mark as Done</button>
                      </div>
                    </div>
                  </div>
                    </div>
                  </div>

                  {/* Accordion 2: Activity 2 */}
                  <div className="sub-item">
                    <div className="sub-header green" onClick={()=> { if (!canOpenActivity(2)) return; setSubOpen(s => ({ ...s, a2: !s.a2 })); }}><span className="label"><span className="icon">🎬</span> <b>Activity 2: Watch and Check Your Understanding</b></span>{!(canOpenActivity(2)) && (<span className="locked-tag" title="Complete previous activity to unlock" aria-label="Locked">🔒</span>)}<span className="right-indicator">{(state.phaseData as any)[1]?.a2Done && (<span className="status-tag">Completed</span>)}<span className="toggle-sign">{subOpen.a2 ? '−' : '+'}</span></span></div>
                    <div className="sub-content" style={{display: subOpen.a2 ? 'block' : 'none'}}>
                    <div className="card spacious activity-card">
                    <div className="info-cards">
                      <div className="info-card">
                        <div className="icon-label"><span className="icon">🧭</span> <b>What you will do:</b></div>
                        <p>You will watch a short video that explains correlation.</p>
                      </div>
                      <div className="info-card">
                        <div className="icon-label"><span className="icon">🛠️</span> <b>How to do it:</b></div>
                        <p>Watch the video carefully. You can pause the video at certain points to answer the checkpoint questions on the left. Replay the video until you finish answering all the questions.</p>
                      </div>
                    </div>
                    <div className="input-row gap-3" style={{ alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <iframe width="100%" height="260" src="https://www.youtube.com/embed/k7IctLRiZmo" title="Pearson r" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4>Questions</h4>
                        {renderActivity2Questions()}
                        <div className="section-actions"><button className="complete-check-btn" onClick={onCompleteCheckpoint} disabled={!a2AllAnswered || a2Submitted}>Submit Answer</button></div>
                        {a2Submitted && (
                          <div className="gap-3" style={{ textAlign:'left' }}>Well done! You may now close this activity, and open the next activity.</div>
                        )}
                      </div>
                    </div>
                  </div>
                    </div>
                  </div>

                  {/* Accordion 3: Activity 3 */}
                  <div className="sub-item">
                    <div className="sub-header green" onClick={()=> { if (!canOpenActivity(3)) return; setSubOpen(s => ({ ...s, a3: !s.a3 })); }}><span className="label"><span className="icon">🧩</span> <b>Activity 3: Choose a Possible Correlation</b></span>{!(canOpenActivity(3)) && (<span className="locked-tag" title="Complete previous activity to unlock" aria-label="Locked">🔒</span>)}<span className="right-indicator">{(state.phaseData as any)[1]?.a3Done && (<span className="status-tag">Completed</span>)}<span className="toggle-sign">{subOpen.a3 ? '−' : '+'}</span></span></div>
                    <div className="sub-content" style={{display: subOpen.a3 ? 'block' : 'none'}}>
                    <div className="card spacious activity-card">
                    <div className="info-cards">
                      <div className="info-card">
                        <div className="icon-label"><span className="icon">🧭</span> <b>What you will do:</b></div>
                        <p>Now that you’ve explored the data and learned about correlation, it’s time to make a decision.</p>
                        <p>Don't worry, you're not alone in this.</p>
                        <p>You will brainstorm with your assigned group members.</p>
                      </div>
                      <div className="info-card">
                        <div className="icon-label"><span className="icon">🛠️</span> <b>How to do it:</b></div>
                        <ol style={{ paddingLeft: 22 }}>
                          <li>Choose one pair of variables that you think may have a possible correlation.</li>
                          <li>Use the drop-down buttons to select your chosen variable pair.</li>
                          <li>In the encoding field, explain why you think these two variables might be related.</li>
                        </ol>
                      </div>
                    </div>
                    <div className="gap-3 icon-label"><span className="icon">🔔</span> <b>Reminder:</b></div>
                    <p>There is no single “correct” answer. What matters is how clearly you explain your reasoning using what you observed.</p>
                    <div className="gap-4" />
                    <div className="gap-4" />
                    <div className="gap-4" />
                    <div className="gap-4" />
                    <div className="gap-3 input-row">
                      <label style={{ color: '#0EA5E9', fontWeight: 700 }}>Variable 1</label>
                      <select value={(state.phaseData as any)[1]?.a3Var1 || ''} onChange={(e)=> savePhaseData(1, { a3Var1: e.target.value })} disabled={!!(state.phaseData as any)[1]?.a3Done}>
                        <option value="">Select</option>
                        {[...climateLabels, ...societalLabels].map(String).sort((a,b)=>a.localeCompare(b)).map(k => (<option key={k} value={k}>{k}</option>))}
                      </select>
                      <label style={{ color: '#EF4444', fontWeight: 700 }}>Variable 2</label>
                      <select value={(state.phaseData as any)[1]?.a3Var2 || ''} onChange={(e)=> savePhaseData(1, { a3Var2: e.target.value })} disabled={!!(state.phaseData as any)[1]?.a3Done}>
                        <option value="">Select</option>
                        {[...climateLabels, ...societalLabels].map(String).sort((a,b)=>a.localeCompare(b)).map(k => (<option key={k} value={k}>{k}</option>))}
                      </select>
                    </div>
                    <div className="gap-3">
                      <div><b>Reason:</b> <span className="gray-italic">You may use any language (English or Filipino) or dialect (Bisaya) in encoding your reasons.</span></div>
                      <textarea rows={3} style={{ width: '100%' }} value={(state.phaseData as any)[1]?.a3Reason || ''} onChange={(e)=> savePhaseData(1, { a3Reason: e.target.value })} disabled={!!(state.phaseData as any)[1]?.a3Done} />
                    </div>
                    <div className="section-actions"><button className="mark-btn" onClick={onActivity3Done} disabled={!a3Ready || !!p1Data.a3Done}>Mark as Done</button></div>
                    {(state.phaseData as any)[1]?.a3Done && (<div className="banner gap-3">Well done! You may now open the next activity.</div>)}
                  </div>
                    </div>
                  </div>

                  {/* Accordion 4: Activity 4 */}
                  <div className="sub-item">
                    <div className="sub-header green" onClick={()=> { if (!canOpenActivity(4)) return; setSubOpen(s => ({ ...s, a4: !s.a4 })); }}><span className="label"><span className="icon">✍️</span> <b>Activity 4: Write Your Research Question</b></span>{!(canOpenActivity(4)) && (<span className="locked-tag" title="Complete previous activity to unlock" aria-label="Locked">🔒</span>)}<span className="right-indicator">{(state.phaseData as any)[1]?.a4bFinalized && (<span className="status-tag">Completed</span>)}<span className="toggle-sign">{subOpen.a4 ? '−' : '+'}</span></span></div>
                    <div className="sub-content" style={{display: subOpen.a4 ? 'block' : 'none'}}>
                    <div className="card spacious activity-card">
                    <div className="info-cards">
                      <div className="info-card">
                        <div className="icon-label"><span className="icon">🧭</span> <b>What you will do:</b></div>
                        <p>You will now turn your idea into a research question.</p>
                        <p>You will brainstorm again with your group members to come up with the research question.</p>
                      </div>
                      <div className="info-card">
                        <div className="icon-label"><span className="icon">🛠️</span> <b>How to do it:</b></div>
                        <ol style={{ paddingLeft:22 }}>
                          <li>Look at the sample research question provided as a guide.</li>
                          <li>In the first encoding field, type your first version of your research question.</li>
                          <li>Submit it and wait for your teacher’s feedback.</li>
                          <li>Once you receive feedback, follow the instructions given by your teacher.</li>
                          <li>Encode your revised or improved version in the second encoding field.</li>
                        </ol>
                      </div>
                    </div>
                    <div className="gap-3 icon-label"><span className="icon">🔔</span> <b>Reminder:</b></div>
                    <p>Feedback is part of the process—use it to strengthen your question.</p>
                    <div className="info-card" style={{ marginTop: 8 }}>
                      <div><b>Question Template:</b></div>
                      <div className="gap-2"><em>"Is there a correlation between [Variable 1] and [Variable 2] in Davao Region, and what does this mean for [specific local concern]?"</em></div>
                      <div className="gap-3"><b>Sample Question:</b></div>
                      <div className="gap-2"><em>“Is there a correlation between Air Quality Index and Respiratory Cases in Davao Region, and what does this mean for the residents and health professionals?”</em></div>
                    </div>
                    <div className="gap-3">
                      <div><b>Now it’s your turn. Encode your question here:</b></div>
                      <textarea rows={3} style={{ width: '100%' }} value={(state.phaseData as any)[1]?.a4aQuestion || ''} onChange={(e)=> savePhaseData(1, { a4aQuestion: e.target.value })} />
                    </div>
                    <div className="section-actions" style={{ justifyContent:'flex-end' }}><button className="submit-btn" onClick={onSubmitQuestion} disabled={!canSubmitQuestion}>Submit Question</button></div>
                    <div className="gap-3 feedback-box" style={{ width: '100%' }}>
                      <b>Feedback Box</b>
                      <div className="gap-2">{teacher?.comments?.[1] || 'Awaiting teacher feedback...'}</div>
                    </div>
                    <div className="gap-3">
                      <div><b>Now, encode here your revised question based on your teacher’s feedback.</b></div>
                      <textarea rows={3} style={{ width: '100%' }} value={(state.phaseData as any)[1]?.a4bFinalQuestion || ''} onChange={(e)=> savePhaseData(1, { a4bFinalQuestion: e.target.value })} />
                    </div>
                    <div className="section-actions" style={{ justifyContent:'flex-end' }}><button className="finalize-btn" onClick={onFinalizeQuestion} disabled={!canFinalize || !!p1Data.a4bFinalized}>Finalize Question</button></div>
                  </div>
                    </div>
                  </div>
                  </div>
                </div>
              )}
            </div>

            {/* Phase 2 */}
            <div className="accordion-item phase2">
              <div className="accordion-header" onClick={() => { setOpen(o => ({ ...o, p2: !o.p2 })); setSubOpen({ a1:false,a2:false,a3:false,a4:false }); }}>
                <h3>Phase 2: Decode the Data { isLocked(2) && <span className="locked-tag" title="Complete previous phase to unlock" aria-label="Locked">🔒</span> }</h3>
                <span className="right-indicator">{state.completedPhases.includes(2) && (<span className="status-tag">Completed</span>)}<span className="toggle-sign">{open.p2 ? '▼' : '▶'}</span></span>
              </div>
              {open.p2 && (
                <div className="accordion-content">
                  <div className="sub-accordion">
                    {/* Phase 2 - Activity 1 */}
                    <div className="sub-item">
                      <div className="sub-header blue" onClick={()=> setSubOpen(s=>({...s, a1: !s.a1}))}><span className="label"><span className="icon">📈</span> <b>Activity 1: Understand Scatter Plots</b></span><span className="right-indicator">{(state.phaseData as any)[2]?.a1Done && (<span className="status-tag">Completed</span>)}<span className="toggle-sign">{subOpen.a1 ? '−' : '+'}</span></span></div>
                      <div className="sub-content" style={{display: subOpen.a1 ? 'block' : 'none'}}>
                        <div className="info-cards">
                          <div className="card">
                            <div className="icon-label"><span className="icon">🧭</span> <b>What you will do:</b></div>
                            <p>You will learn what a scatter plot is and how to recognize different patterns.</p>
                          </div>
                          <div className="card">
                            <div className="icon-label"><span className="icon">🛠️</span> <b>How to do it:</b></div>
                            <ol style={{ paddingLeft:22 }}>
                              <li>Read the short explanation of scatter plots and their common patterns.</li>
                              <li>Study the visual guides that show what each pattern looks like.</li>
                              <li>Practice by identifying the pattern shown in each sample scatter plot.</li>
                            </ol>
                            <div className="gap-3 icon-label"><span className="icon">💡</span> <b>Tip:</b> Focus on the direction and strength of the pattern, not individual points.</div>
                          </div>
                        </div>

                        {/* Card row: definition & patterns */}
                        <div className="cards-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                          <div className="card">
                            <h4>What is Scatter Plot?</h4>
                            <p>A scatter plot is a graph that shows how two numerical variables relate by plotting points (x, y). Patterns in the points can suggest whether the variables move together (positive), move in opposite directions (negative), or do not show a consistent relationship (no correlation).</p>
                          </div>
                          <div className="card">
                            <h4>Scatter Plot Patterns</h4>
                            <ul>
                              <li><b>Positive correlation</b>: points trend upward — as X increases, Y tends to increase.</li>
                              <li><b>Negative correlation</b>: points trend downward — as X increases, Y tends to decrease.</li>
                              <li><b>No correlation</b>: points are scattered without a clear upward or downward trend.</li>
                            </ul>
                          </div>
                        </div>

                        <div className="gap-4" />
                        {/* Card 3: visual pattern guides */}
                          <div className="card">
                          <h4>Visual Pattern Guide</h4>
                          <div className="cards-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                            {visualGuides.map((guide, i)=> (
                              <div key={i} className="card" style={{ padding: 10 }}>
                                {renderScatterSVG(guide.points, 320, 200, 'scatter-guide', 200)}
                                <div className="gap-2" style={{ textAlign:'center' }}>{guide.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="gap-4" />
                        {/* Card 4: split layout selector + plot */}
                        <div className="card" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, alignItems:'start' }}>
                          <div>
                            <div className="icon-label" style={{ whiteSpace:'nowrap', marginBottom: 20 }}><b>Let's try identifying scatter plot patterns using actual climate data.</b></div>
                            {(() => { const sel = (state.phaseData as any)[2]?.a1SelectedPair || 0; const pair = p2Pairs[sel]; return renderScatterSVG(p2PairPoints[sel], 520, 352, 'scatter-tall', plotHeight, pair.v1, pair.v2); })()}
                            <div className="gap-3" />
                          </div>
                          <div style={{ marginTop: 44 }}>
                            <div ref={rightListRef}>
                            {p2Pairs.map((pair, idx)=>{
                              const selected = ((state.phaseData as any)[2]?.a1SelectedPair || 0) === idx;
                              const ansArr = p2Answers;
                              return (
                                <div key={idx} className="input-row" style={{ alignItems:'center', gap: 6, marginBottom: 12 }}>
                                  <label><input className="big-radio" type="radio" name="p2pair" checked={selected} onChange={()=>{ savePhaseData(2, { a1SelectedPair: idx }); setState(getLesson1State(user.username)); }} /></label>
                                  <span style={{ minWidth: 60 }}>{pair.v1}</span>
                                  <span>&amp;</span>
                                  <span style={{ minWidth: 60 }}>{pair.v2}</span>
                                  <input style={{ flex:1 }} placeholder="pattern (positive/negative/none)" value={ansArr[idx] || ''} onChange={(e)=>{ const next=[...ansArr]; next[idx]=e.target.value; setP2Answers(next); }} />
                                  {p2Result && (<span style={{ fontSize: 18, marginLeft:6 }}>{p2Result[idx] ? '✅' : '⭕'}</span>)}
                                </div>
                              );
                            })}
                            </div>
                            <div className="section-actions"><button className="complete-check-btn" onClick={onSubmitP2A1} disabled={!p2AllAnswered || (state.phaseData as any)[2]?.a1Done}>Submit Answer</button></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phase 2 - Activity 2 */}
                    <div className="sub-item">
                      <div className="sub-header blue" onClick={()=> setSubOpen(s=>({...s, a2: !s.a2}))}><span className="label"><span className="icon">🧪</span> <b>Activity 2: Guided Pearson r Practice</b></span><span className="right-indicator"><span className="toggle-sign">{subOpen.a2 ? '−' : '+'}</span></span></div>
                      <div className="sub-content" style={{display: subOpen.a2 ? 'block' : 'none'}}>
                        <div className="card spacious activity-card">
                          <div className="info-cards">
                            <div className="card">
                              <div className="icon-label"><span className="icon">🧭</span> <b>What you will do:</b></div>
                              <p>You will calculate Pearson’s correlation coefficient (r) using a guided, hands-on process.</p>
                            </div>
                            <div className="card">
                              <div className="icon-label"><span className="icon">🛠️</span> <b>How to do it:</b></div>
                              <ul style={{ paddingLeft:22 }}>
                                <li>Follow the step-by-step interactive guide on the screen.</li>
                                <li>Complete each step before moving to the next one.</li>
                                <li>Enter values where prompted and observe how each step affects the final result.</li>
                              </ul>
                              <p style={{ marginTop: 14 }}>
                                <span className="icon">⏳</span> <b>Reminder:</b><br />
                                Take your time. Understanding the process is more important than speed.
                              </p>
                            </div>
                          </div>
                          <div className="card" style={{ marginTop: 12 }}>
                            <h4>Step-by-Step Process in Solving Pearson Correlation Coefficient</h4>
                            <p style={{ marginTop: 24, fontWeight: 700 }}>
                              Look at the last number of your account password. Then, click the button below that matches that number.
                            </p>
                            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                              {[0,1,2,3,4].map(n => {
                                const disabled = p2A2Locked && p2A2Sel !== n;
                                return (
                                  <button key={n} type="button" disabled={disabled} onClick={()=>{ setP2A2Sel(n); setP2A2Locked(true); }} style={{
                                    height: 40,
                                    borderRadius: 8,
                                    background: disabled ? 'var(--phase2-accent-light, #d7b9ea)' : 'var(--phase2-accent, #8e44ad)',
                                    color: '#fff',
                                    border: 'none',
                                    fontWeight: 700,
                                    fontSize: 18,
                                    cursor: disabled ? 'not-allowed' : 'pointer'
                                  }}>{n}</button>
                                );
                              })}
                            </div>
                            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                              {[5,6,7,8,9].map(n => {
                                const disabled = p2A2Locked && p2A2Sel !== n;
                                return (
                                  <button key={n} type="button" disabled={disabled} onClick={()=>{ setP2A2Sel(n); setP2A2Locked(true); }} style={{
                                    height: 40,
                                    borderRadius: 8,
                                    background: disabled ? 'var(--phase2-accent-light, #d7b9ea)' : 'var(--phase2-accent, #8e44ad)',
                                    color: '#fff',
                                    border: 'none',
                                    fontWeight: 700,
                                    fontSize: 18,
                                    cursor: disabled ? 'not-allowed' : 'pointer'
                                  }}>{n}</button>
                                );
                              })}
                            </div>
                            <p style={{ marginTop: 36, fontWeight: 700 }}>
                              Now, look at the table. Data was generated under Column 2 and 3 for you. <br />
                              Click on each button around the table to help you complete the table. Start with Step 1.
                            </p>
                            <div style={{ marginTop: 48 }}>
                              <div ref={tableRef} style={{ position: 'relative' }}>
                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed' }}>
                                <colgroup>
                                  <col style={{ width: '16.66%' }} />
                                  <col style={{ width: '16.66%' }} />
                                  <col style={{ width: '16.66%' }} />
                                  <col style={{ width: '16.66%' }} />
                                  <col style={{ width: '16.66%' }} />
                                  <col style={{ width: '16.66%' }} />
                                </colgroup>
                                <thead>
                                  <tr>
                                    <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>Month</th>
                                    <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>{selectedDataset ? selectedDataset.v1 : '[Variable 1 Name] (X)'}</th>
                                    <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>{selectedDataset ? selectedDataset.v2 : '[Variable 2 Name] (Y)'}</th>
                                    <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>xy</th>
                                    <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>x²</th>
                                    <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>y²</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.from({ length: 9 }).map((_, i) => {
                                    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'];
                                    const isMonthRow = i < months.length;
                                    const monthLabel = isMonthRow ? `${months[i]} 2021` : '';
                                    return (
                                      <tr key={i}>
                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', fontWeight: 700, textAlign: 'center', height: 50 }}>{i === 8 ? (nVal ? (<span style={{ fontWeight: 700 }}>n = {nVal}</span>) : '') : monthLabel}</td>
                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12), inset 0 -1px 2px rgba(255,255,255,0.5)', textAlign: 'center', height: 50 }}>{i === 8 ? (xSumVal ? (<span style={{ fontWeight: 700 }}>Σx = {xSumVal}</span>) : '') : (selectedDataset ? selectedDataset.x[i] : '')}</td>
                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12), inset 0 -1px 2px rgba(255,255,255,0.5)', textAlign: 'center', height: 50 }}>{i === 8 ? (ySumVal ? (<span style={{ fontWeight: 700 }}>Σy = {ySumVal}</span>) : '') : (selectedDataset ? selectedDataset.y[i] : '')}</td>
                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12), inset 0 -1px 2px rgba(255,255,255,0.5)', textAlign: 'center', height: 50 }}>{i === 8 ? (xySumVal ? (<span style={{ fontWeight: 700 }}>Σxy = {xySumVal}</span>) : '') : (xyVals[i] || '')}</td>
                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12), inset 0 -1px 2px rgba(255,255,255,0.5)', textAlign: 'center', height: 50 }}>{i === 8 ? (xSqSumVal ? (<span style={{ fontWeight: 700 }}>Σx² = {xSqSumVal}</span>) : '') : (xSqVals[i] || '')}</td>
                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12), inset 0 -1px 2px rgba(255,255,255,0.5)', textAlign: 'center', height: 50 }}>{i === 8 ? (ySqSumVal ? (<span style={{ fontWeight: 700 }}>Σy² = {ySqSumVal}</span>) : '') : (ySqVals[i] || '')}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                                </table>
                                {/* Step buttons centered per column */}
                              {[
                                { label: 'Step 4', left: '58.33%', step: 4 },
                                { label: 'Step 6', left: '75%', step: 6 },
                                { label: 'Step 8', left: '91.66%', step: 8 },
                              ].map(({ label, left, step }) => (
                                <StepButton key={label} label={label} onClick={() => showStep(step)} style={{ position: 'absolute', top: -34, left }} />
                              ))}
                              {[
                                { label: 'Step 1', left: '8.33%', step: 1 },
                                { label: 'Step 2', left: '25%', step: 2 },
                                { label: 'Step 3', left: '41.66%', step: 3 },
                                { label: 'Step 5', left: '58.33%', step: 5 },
                                { label: 'Step 7', left: '75%', step: 7 },
                                { label: 'Step 9', left: '91.66%', step: 9 },
                              ].map(({ label, left, step }) => (
                                <StepButton key={label} label={label} onClick={() => showStep(step)} style={{ position: 'absolute', bottom: -34, left }} />
                              ))}
                              </div>
                              <div style={{ marginTop: 72 }} />
                              <div style={{ marginTop: 36, display: 'flex', justifyContent: 'center' }}>
                                <div>
                                  <div style={{ fontWeight: 700 }}>Pearson Correlation Coefficient</div>
                                  <div style={{ marginTop: 12, border: '2px solid var(--phase2-accent, #8e44ad)', borderRadius: 12, padding: '16px 24px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                      <span style={{ fontWeight: 700, fontSize: 22 }}>r =</span>
                                      <div style={{ display: 'inline-block', textAlign: 'center' }}>
                                        <div style={{ fontSize: 20, fontWeight: 600 }}>n(Σxy) − (Σx)(Σy)</div>
                                        <div style={{ borderTop: '2px solid #333', margin: '6px 0' }} />
                                        <div style={{ fontSize: 20, fontWeight: 600 }}>√[nΣx² − (Σx)²] [nΣy² − (Σy)²]</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
                                <StepButton label="Step 10" onClick={() => showStep(10)} />
                              </div>
                              <div style={{ marginTop: 24, marginBottom: 24 }}>
                                <div style={{ display: 'grid', gap: 16 }}>
                                  {[
                                    'Step 1: Finding the Value of n',
                                    'Step 2: Summation of X (ΣX)',
                                    'Step 3: Summation of Y',
                                    'Step 4: Solving XY values',
                                    'Step 5: Summation of XY',
                                    'Step 6: Solving for X² values',
                                    'Step 7: Summation of X²',
                                    'Step 8: Solving for Y² values',
                                    'Step 9: Summation of Y²',
                                    'Step 10: Substituting all values in the Pearson Coefficient Correlation Formula'
                                  ].map((title, i) => (
                                    <div key={i} className="card" ref={(el)=>{ stepCardRefs.current[i] = el; }} style={{
                                      border: '2px solid var(--phase2-accent, #8e44ad)',
                                      background: 'var(--phase2-surface, #f9f2ff)',
                                      borderRadius: 12,
                                      padding: '14px 16px',
                                      display: (showAllSteps || visibleStep === (i+1)) ? 'block' : 'none'
                                    }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ fontWeight: 700 }}>{title}</div>
                                        {(i > 0 && i < 9 && i !== 1 && i !== 2 && i !== 3 && i !== 4 && i !== 5 && i !== 6 && i !== 7 && i !== 8) && (
                                          <BasicCalc style={{ marginTop: 8, marginRight: 8 }} />
                                        )}
                                      </div>
                                                                            {i === 1 && (
                                                                              <>
                                                                                <div style={{ fontWeight: 400, whiteSpace: 'pre' }}>{'   '}</div>
                                                                                <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginTop: 8 }}>
                                                                                  <div style={{ flex: 1 }}>
                                                                                    <div>X refers to your first variable.</div>
                                                                                    <div>Column 2 contains the data for your first variable.</div>
                                                                                    <div>Just add up all the values in this column.</div>
                                                                                    <div>You can use the calculator beside the table.</div>
                                                                                    <div>Encode the sum below:</div>
                                                                                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                                                                                      <input type="number" min={0} value={xSumVal} disabled={xSumLocked} onChange={(e)=> setXSumVal(e.target.value)} style={{ height: 28, border: '1px solid #ccc', borderRadius: 8, padding: '0 8px', width: 140 }} />
                                                                                      <StepButton label="Submit" onClick={()=> setXSumLocked(true)} disabled={!xSumVal} />
                                                                                    </div>
                                                                                  </div>
                                                                                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                                                                                    <div style={{ width: 360 }}>
                                                                                      <div style={{ fontWeight: 700, textAlign: 'center' }}>Preview of the Column from the Table</div>
                                                                                      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed', marginTop: 8 }}>
                                                                                        <colgroup>
                                                                                          <col style={{ width: '100%' }} />
                                                                                        </colgroup>
                                                                                        <thead>
                                                                                          <tr>
                                                                                            <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>{selectedDataset ? selectedDataset.v1 : '[Variable 1 Name] (X)'}</th>
                                                                                          </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                          {Array.from({ length: 8 }).map((_, idx) => (
                                                                                            <tr key={idx}>
                                                                                              <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', textAlign: 'center', height: 50 }}>{selectedDataset ? selectedDataset.x[idx] : ''}</td>
                                                                                            </tr>
                                                                                          ))}
                                                                                        </tbody>
                                                                                      </table>
                                                                                    </div>
                                                                                    <BasicCalc style={{ marginTop: 0, marginLeft: 48 }} />
                                                                                  </div>
                                                                                </div>
                                                                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 60 }}>
                                                                                  <StepButton label="View Table" onClick={scrollToTable} disabled={!xSumLocked} style={{ minWidth: 160, height: 36 }} />
                                                                                </div>
                                                                              </>
                                                                            )}
                                      {i === 0 && (
                                        <>
                                          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1 }}>
                                              <div style={{ fontWeight: 400, whiteSpace: 'pre' }}>{'   '}</div>
                                              <div style={{ marginTop: 8 }}>This step is very easy.</div>
                                              <div>Look at Column 1. Count from Jan 2021 to Aug 2021.</div>
                                              <div>How many pairs of data points do you have?</div>
                                              <div>Encode the number here:</div>
                                              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <input type="number" min={1} value={nVal} disabled={nLocked} onChange={(e)=> setNVal(e.target.value)} style={{ height: 28, border: '1px solid #ccc', borderRadius: 8, padding: '0 8px', width: 100 }} />
                                                <StepButton label="Submit" onClick={()=> setNLocked(true)} disabled={!nVal} />
                                              </div>
                                            </div>
                                            <div style={{ width: 360, marginRight: 108 }}>
                                              <div style={{ fontWeight: 700, textAlign: 'center' }}>Preview of the Column from the Table</div>
                                              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed', marginTop: 8 }}>
                                                <colgroup>
                                                  <col style={{ width: '100%' }} />
                                                </colgroup>
                                                <thead>
                                                  <tr>
                                                    <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>Month</th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {['Jan 2021','Feb 2021','Mar 2021','Apr 2021','May 2021','Jun 2021','Jul 2021','Aug 2021'].map((m, idx) => (
                                                    <tr key={idx}>
                                                      <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', textAlign: 'center', height: 50 }}>{m}</td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 60 }}>
                                            <StepButton label="View Table" onClick={scrollToTable} disabled={!nLocked} style={{ minWidth: 160, height: 36 }} />
                                          </div>
                                        </>
                                      )}
                                      {i === 2 && (
                                        <>
                                          <div style={{ fontWeight: 400, whiteSpace: 'pre' }}>{'   '}</div>
                                          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginTop: 8 }}>
                                            <div style={{ flex: 1 }}>
                                              <div>Y refers to your second variable.</div>
                                              <div>Column 3 contains the data for your second variable.</div>
                                              <div>Just add up all the values in this column.</div>
                                              <div>You can use the calculator beside the table.</div>
                                              <div>Encode the sum below:</div>
                                              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <input type="number" min={0} value={ySumVal} disabled={ySumLocked} onChange={(e)=> setYSumVal(e.target.value)} style={{ height: 28, border: '1px solid #ccc', borderRadius: 8, padding: '0 8px', width: 140 }} />
                                                <StepButton label="Submit" onClick={()=> setYSumLocked(true)} disabled={!ySumVal} />
                                              </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                                              <div style={{ width: 360 }}>
                                                <div style={{ fontWeight: 700, textAlign: 'center' }}>Preview of the Column from the Table</div>
                                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed', marginTop: 8 }}>
                                                  <colgroup>
                                                    <col style={{ width: '100%' }} />
                                                  </colgroup>
                                                  <thead>
                                                    <tr>
                                                      <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>{selectedDataset ? selectedDataset.v2 : '[Variable 2 Name] (Y)'}</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {Array.from({ length: 8 }).map((_, idx) => (
                                                      <tr key={idx}>
                                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', textAlign: 'center', height: 50 }}>{selectedDataset ? selectedDataset.y[idx] : ''}</td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                              <BasicCalc style={{ marginTop: 0, marginLeft: 48 }} />
                                            </div>
                                          </div>
                                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 60 }}>
                                            <StepButton label="View Table" onClick={scrollToTable} disabled={!ySumLocked} style={{ minWidth: 160, height: 36 }} />
                                          </div>
                                        </>
                                      )}
                                      {i === 3 && (
                                        <>
                                          <div style={{ fontWeight: 400, whiteSpace: 'pre' }}>{'   '}</div>
                                          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginTop: 8 }}>
                                            <div style={{ flex: 1 }}>
                                              <div>X is your first variable (Column 2).</div>
                                              <div>Y is your second variable (Column 3)</div>
                                              <div>For each pair, multiply X times Y.</div>
                                              <div>Example: If Jan 2021 has X = 3 and Y = 5, that row's XY = 15.</div>
                                              <div>You can use the calculator beside the table.</div>
                                              <div>Do this for every single pair.</div>
                                              <div>Encode the products below:</div>
                                              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                {Array.from({ length: 8 }).map((_, idx) => (
                                                  <input key={idx} type="number" min={0} value={xyVals[idx]} disabled={xyLocked} onChange={(e)=> {
                                                    const next = [...xyVals];
                                                    next[idx] = e.target.value;
                                                    setXyVals(next);
                                                  }} style={{ height: 28, width: 100, border: '1px solid #ccc', borderRadius: 8, padding: '0 8px' }} />
                                                ))}
                                              </div>
                                              <div style={{ marginTop: 12 }}>
                                                <StepButton label="Submit" onClick={()=> setXyLocked(true)} disabled={xyVals.some(v => !v)} />
                                              </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                                              <div style={{ width: 360 }}>
                                                <div style={{ fontWeight: 700, textAlign: 'center' }}>Preview of the Columns from the Table</div>
                                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed', marginTop: 8 }}>
                                                  <colgroup>
                                                    <col style={{ width: '33.33%' }} />
                                                    <col style={{ width: '33.33%' }} />
                                                    <col style={{ width: '33.33%' }} />
                                                  </colgroup>
                                                  <thead>
                                                    <tr>
                                                      <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>{selectedDataset ? selectedDataset.v1 : 'X'}</th>
                                                      <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>{selectedDataset ? selectedDataset.v2 : 'Y'}</th>
                                                      <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>xy</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {Array.from({ length: 8 }).map((_, idx) => (
                                                      <tr key={idx}>
                                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', textAlign: 'center', height: 50 }}>{selectedDataset ? selectedDataset.x[idx] : ''}</td>
                                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', textAlign: 'center', height: 50 }}>{selectedDataset ? selectedDataset.y[idx] : ''}</td>
                                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', textAlign: 'center', height: 50 }}>{xyVals[idx] || ''}</td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                              <BasicCalc style={{ marginTop: 0, marginLeft: 48 }} />
                                            </div>
                                          </div>
                                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 60 }}>
                                            <StepButton label="View Table" onClick={scrollToTable} disabled={!xyLocked} style={{ minWidth: 160, height: 36 }} />
                                          </div>
                                        </>
                                      )}
                                      {i === 4 && (
                                        <>
                                          <div style={{ fontWeight: 400, whiteSpace: 'pre' }}>{'   '}</div>
                                          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginTop: 8 }}>
                                            <div style={{ flex: 1 }}>
                                              <div>You calculated the xy values in Column 4.</div>
                                              <div>Just add up all the values in this column.</div>
                                              <div>You can use the calculator beside the table.</div>
                                              <div>Encode the sum below:</div>
                                              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <input type="number" min={0} value={xySumVal} disabled={xySumLocked} onChange={(e)=> setXySumVal(e.target.value)} style={{ height: 28, border: '1px solid #ccc', borderRadius: 8, padding: '0 8px', width: 140 }} />
                                                <StepButton label="Submit" onClick={()=> setXySumLocked(true)} disabled={!xySumVal} />
                                              </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                                              <div style={{ width: 360 }}>
                                                <div style={{ fontWeight: 700, textAlign: 'center' }}>Preview of the Column from the Table</div>
                                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed', marginTop: 8 }}>
                                                  <colgroup>
                                                    <col style={{ width: '100%' }} />
                                                  </colgroup>
                                                  <thead>
                                                    <tr>
                                                      <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>xy</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {Array.from({ length: 8 }).map((_, idx) => (
                                                      <tr key={idx}>
                                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', textAlign: 'center', height: 50 }}>{xyVals[idx] || ''}</td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                              <BasicCalc style={{ marginTop: 0, marginLeft: 48 }} />
                                            </div>
                                          </div>
                                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 60 }}>
                                            <StepButton label="View Table" onClick={scrollToTable} disabled={!xySumLocked} style={{ minWidth: 160, height: 36 }} />
                                          </div>
                                        </>
                                      )}
                                      {i === 5 && (
                                        <>
                                          <div style={{ fontWeight: 400, whiteSpace: 'pre' }}>{'   '}</div>
                                          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginTop: 8 }}>
                                            <div style={{ flex: 1 }}>
                                              <div>Look at the x values in Column 2.</div>
                                              <div>Multiply the x value in each row by itself.</div>
                                              <div>Example: If Jan 2021 has x = 3, then multiply 3 by 3 and you’ll get x² = 9.</div>
                                              <div>You can use the calculator beside the table.</div>
                                              <div>Do this down the values of entire x column.</div>
                                              <div>Encode the product of each x value below:</div>
                                              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                {Array.from({ length: 8 }).map((_, idx) => (
                                                  <input key={idx} type="number" min={0} value={xSqVals[idx]} disabled={xSqLocked} onChange={(e)=> {
                                                    const next = [...xSqVals];
                                                    next[idx] = e.target.value;
                                                    setXSqVals(next);
                                                  }} style={{ height: 28, width: 100, border: '1px solid #ccc', borderRadius: 8, padding: '0 8px' }} />
                                                ))}
                                              </div>
                                              <div style={{ marginTop: 12 }}>
                                                <StepButton label="Submit" onClick={()=> setXSqLocked(true)} disabled={xSqVals.some(v => !v)} />
                                              </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                                              <div style={{ width: 360 }}>
                                                <div style={{ fontWeight: 700, textAlign: 'center' }}>Preview of the Columns from the Table</div>
                                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed', marginTop: 8 }}>
                                                  <colgroup>
                                                    <col style={{ width: '50%' }} />
                                                    <col style={{ width: '50%' }} />
                                                  </colgroup>
                                                  <thead>
                                                    <tr>
                                                      <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>{selectedDataset ? selectedDataset.v1 : 'X'}</th>
                                                      <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>x²</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {Array.from({ length: 8 }).map((_, idx) => (
                                                      <tr key={idx}>
                                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', textAlign: 'center', height: 50 }}>{selectedDataset ? selectedDataset.x[idx] : ''}</td>
                                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', textAlign: 'center', height: 50 }}>{xSqVals[idx] || ''}</td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                              <BasicCalc style={{ marginTop: 0, marginLeft: 48 }} />
                                            </div>
                                          </div>
                                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 60 }}>
                                            <StepButton label="View Table" onClick={scrollToTable} disabled={!xSqLocked} style={{ minWidth: 160, height: 36 }} />
                                          </div>
                                        </>
                                      )}
                                      {i === 6 && (
                                        <>
                                          <div style={{ fontWeight: 400, whiteSpace: 'pre' }}>{'   '}</div>
                                          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginTop: 8 }}>
                                            <div style={{ flex: 1 }}>
                                              <div>You calculated the x² values in Column 5.</div>
                                              <div>Just add up all the values in this column.</div>
                                              <div>You can use the calculator beside the table.</div>
                                              <div>Encode the sum below:</div>
                                              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <input type="number" min={0} value={xSqSumVal} disabled={xSqSumLocked} onChange={(e)=> setXSqSumVal(e.target.value)} style={{ height: 28, border: '1px solid #ccc', borderRadius: 8, padding: '0 8px', width: 140 }} />
                                                <StepButton label="Submit" onClick={()=> setXSqSumLocked(true)} disabled={!xSqSumVal} />
                                              </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                                              <div style={{ width: 360 }}>
                                                <div style={{ fontWeight: 700, textAlign: 'center' }}>Preview of the Column from the Table</div>
                                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed', marginTop: 8 }}>
                                                  <colgroup>
                                                    <col style={{ width: '100%' }} />
                                                  </colgroup>
                                                  <thead>
                                                    <tr>
                                                      <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>x²</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {Array.from({ length: 8 }).map((_, idx) => (
                                                      <tr key={idx}>
                                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', textAlign: 'center', height: 50 }}>{xSqVals[idx] || ''}</td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                              <BasicCalc style={{ marginTop: 0, marginLeft: 48 }} />
                                            </div>
                                          </div>
                                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 60 }}>
                                            <StepButton label="View Table" onClick={scrollToTable} disabled={!xSqSumLocked} style={{ minWidth: 160, height: 36 }} />
                                          </div>
                                        </>
                                      )}
                                      {i === 7 && (
                                        <>
                                          <div style={{ fontWeight: 400, whiteSpace: 'pre' }}>{'   '}</div>
                                          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginTop: 8 }}>
                                            <div style={{ flex: 1 }}>
                                              <div>Look at the y values in Column 3.</div>
                                              <div>Multiply the y value in each row by itself.</div>
                                              <div>Example: If Jan 2021 has y = 5, then multiply 5 by 5 and you’ll get y² = 25.</div>
                                              <div>You can use the calculator beside the table.</div>
                                              <div>Do this down the values of entire y column.</div>
                                              <div>Encode the product of each y value below:</div>
                                              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                {Array.from({ length: 8 }).map((_, idx) => (
                                                  <input key={idx} type="number" min={0} value={ySqVals[idx]} disabled={ySqLocked} onChange={(e)=> {
                                                    const next = [...ySqVals];
                                                    next[idx] = e.target.value;
                                                    setYSqVals(next);
                                                  }} style={{ height: 28, width: 100, border: '1px solid #ccc', borderRadius: 8, padding: '0 8px' }} />
                                                ))}
                                              </div>
                                              <div style={{ marginTop: 12 }}>
                                                <StepButton label="Submit" onClick={()=> setYSqLocked(true)} disabled={ySqVals.some(v => !v)} />
                                              </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                                              <div style={{ width: 360 }}>
                                                <div style={{ fontWeight: 700, textAlign: 'center' }}>Preview of the Columns from the Table</div>
                                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed', marginTop: 8 }}>
                                                  <colgroup>
                                                    <col style={{ width: '50%' }} />
                                                    <col style={{ width: '50%' }} />
                                                  </colgroup>
                                                  <thead>
                                                    <tr>
                                                      <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>{selectedDataset ? selectedDataset.v2 : 'Y'}</th>
                                                      <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>y²</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {Array.from({ length: 8 }).map((_, idx) => (
                                                      <tr key={idx}>
                                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', textAlign: 'center', height: 50 }}>{selectedDataset ? selectedDataset.y[idx] : ''}</td>
                                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', textAlign: 'center', height: 50 }}>{ySqVals[idx] || ''}</td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                              <BasicCalc style={{ marginTop: 0, marginLeft: 48 }} />
                                            </div>
                                          </div>
                                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 60 }}>
                                            <StepButton label="View Table" onClick={scrollToTable} disabled={!ySqLocked} style={{ minWidth: 160, height: 36 }} />
                                          </div>
                                        </>
                                      )}
                                      {i === 8 && (
                                        <>
                                          <div style={{ fontWeight: 400, whiteSpace: 'pre' }}>{'   '}</div>
                                          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginTop: 8 }}>
                                            <div style={{ flex: 1 }}>
                                              <div>You calculated the y² values in Column 6.</div>
                                              <div>Just add up all the values in this column.</div>
                                              <div>You can use the calculator beside the table.</div>
                                              <div>Encode the sum below:</div>
                                              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <input type="number" min={0} value={ySqSumVal} disabled={ySqSumLocked} onChange={(e)=> setYSqSumVal(e.target.value)} style={{ height: 28, border: '1px solid #ccc', borderRadius: 8, padding: '0 8px', width: 140 }} />
                                                <StepButton label="Submit" onClick={()=> setYSqSumLocked(true)} disabled={!ySqSumVal} />
                                              </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                                              <div style={{ width: 360 }}>
                                                <div style={{ fontWeight: 700, textAlign: 'center' }}>Preview of the Column from the Table</div>
                                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed', marginTop: 8 }}>
                                                  <colgroup>
                                                    <col style={{ width: '100%' }} />
                                                  </colgroup>
                                                  <thead>
                                                    <tr>
                                                      <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>y²</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {Array.from({ length: 8 }).map((_, idx) => (
                                                      <tr key={idx}>
                                                        <td style={{ padding: '8px 12px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', background: 'var(--table-cell-bg, #f6f8fa)', textAlign: 'center', height: 50 }}>{ySqVals[idx] || ''}</td>
                                                      </tr>
                                                    ))}
                                                  </tbody>
                                                </table>
                                              </div>
                                              <BasicCalc style={{ marginTop: 0, marginLeft: 48 }} />
                                            </div>
                                          </div>
                                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 60 }}>
                                            <StepButton label="View Table" onClick={scrollToTable} disabled={!ySqSumLocked} style={{ minWidth: 160, height: 36 }} />
                                          </div>
                                        </>
                                      )}
                                      {i === 9 && (
                                        <>
                                          <div style={{ fontWeight: 400, whiteSpace: 'pre' }}>{'   '}</div>
                                          {/* Formula centered under title */}
                                          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
                                            <div style={{ width: '100%', maxWidth: 980, border: '2px solid var(--phase2-accent, #8e44ad)', borderRadius: 12, padding: '16px 20px', background: '#fff' }}>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', width: '100%' }}>
                                                <span style={{ fontWeight: 700, fontSize: 22, color: 'var(--phase2-accent, #8e44ad)' }}>r =</span>
                                                <div style={{ display: 'inline-block', textAlign: 'center', color: 'var(--phase2-accent, #8e44ad)' }}>
                                                  {/* Numerator */}
                                                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                                                    <input type="number" value={fNNum} onChange={(e)=> setFNNum(e.target.value)} style={{ width: 100, height: 36, border: '2px solid var(--phase2-accent, #8e44ad)', borderRadius: 8, textAlign: 'center' }} />
                                                    <span>(</span>
                                                    <input type="number" value={fXYNum} onChange={(e)=> setFXYNum(e.target.value)} style={{ width: 100, height: 36, border: '2px solid var(--phase2-accent, #8e44ad)', borderRadius: 8, textAlign: 'center' }} />
                                                    <span>) − (</span>
                                                    <input type="number" value={fXNum} onChange={(e)=> setFXNum(e.target.value)} style={{ width: 100, height: 36, border: '2px solid var(--phase2-accent, #8e44ad)', borderRadius: 8, textAlign: 'center' }} />
                                                    <span>)(</span>
                                                    <input type="number" value={fYNum} onChange={(e)=> setFYNum(e.target.value)} style={{ width: 100, height: 36, border: '2px solid var(--phase2-accent, #8e44ad)', borderRadius: 8, textAlign: 'center' }} />
                                                    <span>)</span>
                                                  </div>
                                                  {/* Fraction bar */}
                                                  <div style={{ borderTop: '3px solid var(--phase2-accent, #8e44ad)', margin: '10px 0' }} />
                                                  {/* Denominator */}
                                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                                                    <span style={{ fontWeight: 700 }}>√</span>
                                                    <span>[</span>
                                                    <input type="number" value={fN_DX} onChange={(e)=> setFN_DX(e.target.value)} style={{ width: 100, height: 36, border: '2px solid var(--phase2-accent, #8e44ad)', borderRadius: 8, textAlign: 'center' }} />
                                                    <input type="number" value={fXSq_DX} onChange={(e)=> setFXSq_DX(e.target.value)} style={{ width: 100, height: 36, border: '2px solid var(--phase2-accent, #8e44ad)', borderRadius: 8, textAlign: 'center' }} />
                                                    <span> − (</span>
                                                    <input type="number" value={fX_DX} onChange={(e)=> setFX_DX(e.target.value)} style={{ width: 100, height: 36, border: '2px solid var(--phase2-accent, #8e44ad)', borderRadius: 8, textAlign: 'center' }} />
                                                    <span>)²]</span>
                                                    <span>[</span>
                                                    <input type="number" value={fN_DY} onChange={(e)=> setFN_DY(e.target.value)} style={{ width: 100, height: 36, border: '2px solid var(--phase2-accent, #8e44ad)', borderRadius: 8, textAlign: 'center' }} />
                                                    <input type="number" value={fYSq_DY} onChange={(e)=> setFYSq_DY(e.target.value)} style={{ width: 100, height: 36, border: '2px solid var(--phase2-accent, #8e44ad)', borderRadius: 8, textAlign: 'center' }} />
                                                    <span> − (</span>
                                                    <input type="number" value={fY_DY} onChange={(e)=> setFY_DY(e.target.value)} style={{ width: 100, height: 36, border: '2px solid var(--phase2-accent, #8e44ad)', borderRadius: 8, textAlign: 'center' }} />
                                                    <span>)²]</span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          {/* Values line below formula (add 5 gaps below encoding panel) */}
                                          <div style={{ marginTop: 40 }}>Here are the values you got after finishing Steps 1 to 9:</div>
                                          {/* Horizontal equal-sized rectangles with values */}
                                          <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                                            {[
                                              { key: 'n',    label: 'n',    val: nVal,      ok: nOk,   show: nShow },
                                              { key: 'sx',   label: 'Σx',   val: xSumVal,   ok: sxOk,  show: sxShow },
                                              { key: 'sy',   label: 'Σy',   val: ySumVal,   ok: syOk,  show: syShow },
                                              { key: 'sxy',  label: 'Σxy',  val: xySumVal,  ok: sxyOk, show: sxyShow },
                                              { key: 'sx2',  label: 'Σx²',  val: xSqSumVal, ok: sx2Ok, show: sx2Show },
                                              { key: 'sy2',  label: 'Σy²',  val: ySqSumVal, ok: sy2Ok, show: sy2Show },
                                            ].map((it) => (
                                              <div key={it.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <div style={{ width: 140, height: 40, border: '2px solid var(--phase2-accent, #8e44ad)', borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                                                  <span>{it.label} = {it.val || '[not set]'}</span>
                                                </div>
                                                <div style={{ height: 26, marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                  {it.show ? (it.ok ? <CheckCircle /> : <StopSign />) : null}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                          {/* Guidance lines */}
                                          <div style={{ marginTop: 12, fontWeight: 400 }}>Now, refer to the formula, and encode these values in their corresponding boxes.</div>
                                          <div style={{ fontWeight: 400 }}>When a value is encoded in the correct box(es), a green check with a green circular outline will appear below that value’s box in the list.</div>
                                          <div style={{ fontWeight: 400 }}>If one or more boxes are incorrect for a value, a red stop sign will appear below that value’s box.</div>

                                          {/* Calculate button aligned bottom-right */}
                                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, paddingRight: 24, paddingBottom: 24 }}>
                                            <StepButton label="Calculate" onClick={()=> setPlotVisible(true)} disabled={!allValuesOk} style={{ height: 42, minWidth: 200 }} />
                                          </div>

                                          {/* Congrats line 3 gaps below the button */}
                                          {plotVisible && (
                                            <div style={{ marginTop: 24, fontWeight: 700, textAlign: 'left' }}>
                                              Congratulations! You have succesfully calculated the Pearson Coefficient Correlation of the assigned variables to you.
                                            </div>
                                          )}

                                          {/* Scatter plot 10 gaps below button */}
                                          {plotVisible && (
                                            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
                                              <div style={{ width: '100%', maxWidth: 980, padding: '0 16px', textAlign: 'center' }}>
                                                {/* Rectangle and title outside and above the scatter plot */}
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '6px 16px', border: '2px solid var(--phase2-accent, #8e44ad)', borderRadius: 8, background: '#fff', fontSize: 18, fontWeight: 700, color: 'var(--phase2-accent, #8e44ad)' }}>{currentR}</div>
                                                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--phase2-accent, #8e44ad)' }}>
                                                    {selectedDataset ? `Correlation between ${cleanName(selectedDataset.v1)} and ${cleanName(selectedDataset.v2)}` : ''}
                                                  </div>
                                                </div>
                                                {renderScatterSVG(
                                                  pointsForDataset,
                                                  980,
                                                  360,
                                                  'scatter-card10',
                                                  360,
                                                  cleanName(selectedDataset?.v1) || 'Variable X',
                                                  cleanName(selectedDataset?.v2) || 'Variable Y'
                                                )}
                                              </div>
                                            </div>
                                          )}

                                          {/* Reflection question and input */
                                          }
                                          {plotVisible && (
                                            <div style={{ marginTop: 48, textAlign: 'center' }}>
                                              <div style={{ fontWeight: 700 }}>Looking at the scatter plot pattern, what kind of correlation do the two variables have?</div>
                                              <div style={{ marginTop: 12, display: 'flex', gap: 12, justifyContent: 'center' }}>
                                                <input type="text" value={corrAnswer} onChange={(e)=> setCorrAnswer(e.target.value)} placeholder="positive, negative, no correlation" style={{ height: 32, border: '1px solid #ccc', borderRadius: 8, padding: '0 10px', width: 340 }} />
                                                <StepButton label="Submit" onClick={()=> setCorrLocked(true)} disabled={!corrAnswer.trim()} />
                                              </div>
                                            </div>
                                          )}
                                          {plotVisible && (
                                            <div style={{ marginTop: 40, display: 'flex', justifyContent: 'flex-end', paddingRight: 24 }}>
                                              <StepButton label="Show All Steps" onClick={()=> { setShowAllSteps(true); }} style={{ height: 44, minWidth: 220, fontSize: 16 }} />
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phase 2 - Activity 3 */}
                    <div className="sub-item">
                      <div className="sub-header blue" onClick={()=> setSubOpen(s=>({...s, a3: !s.a3}))}><span className="label"><span className="icon">🧮</span> <b>Activity 3: Spreadsheet Pearson r</b></span><span className="right-indicator"><span className="toggle-sign">{subOpen.a3 ? '−' : '+'}</span></span></div>
                      <div className="sub-content" style={{display: subOpen.a3 ? 'block' : 'none'}}>
                        {/* Instructional cards above video */}
                        <div className="cards-row" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 16 }}>
                          <div className="card spacious">
                            <div style={{ fontWeight: 700 }}>🧭 What you will do:</div>
                            <div className="gap-3" />
                            <div>You will calculate Pearson r again, this time using a spreadsheet tool.</div>
                          </div>
                          <div className="card spacious">
                            <div style={{ fontWeight: 700 }}>🛠️ How to do it:</div>
                            <div className="gap-3" />
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                              <li>Watch the video tutorial while working on your spreadsheet.</li>
                              <li>Follow along as the video shows how to enter data and apply the formula.</li>
                              <li>Complete the calculation using the given climate data.</li>
                            </ul>
                            <div className="gap-3" />
                            <div style={{ fontWeight: 700 }}>💡 Tip:</div>
                            <div>Pause or replay the video anytime if you need to review a step.</div>
                          </div>
                        </div>
                        <div className="card spacious activity-card">
                          <div style={{ fontWeight: 700 }}>Let's solve Pearson Correlation Coefficient the Fast and Easy Way</div>
                          <div className="gap-3" />
                          <div className="gap-3" />
                          <div className="gap-3" />
                          <div>Watch the video below to learn how to build the scatterplot and compute for the correlation coefficient in a spreadsheet.</div>
                          <div className="gap-3" />
                          <div className="gap-3" />
                          <div className="gap-3" />
                          <div>
                            <iframe width="100%" height="420" src="https://www.youtube.com/embed/EvdmMZxM1jY" title="Pearson correlation in spreadsheet" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                          </div>
                          <div className="gap-3" />
                          <div className="gap-3" />
                          <div className="gap-3" />
                          <div className="gap-3" />
                          <div className="gap-3" />
                          <div>
                            Easy right? Now, let's using what you have learned in finding the pearson correlation coefficient of your selected variables during the first phase of our lesson.
                          </div>
                          <div>
                            The dataset of the variables you selected in Phase 1 is displayed below.
                          </div>
                          <div>
                            Calculate the Pearson Correlation Coefficient and create the scatter plot for the two variables.
                            <br />
                            Click on the link below the table to access the spreadsheet.
                          </div>
                          <div className="gap-3" />
                          <div className="gap-3" />
                          <div className="gap-3" />
                          <div className="gap-3" />
                          {(() => {
                            const monthsNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                            const var1Label = ((state.phaseData as any)[1]?.a3Var1 || '') as string;
                            const var2Label = ((state.phaseData as any)[1]?.a3Var2 || '') as string;

                            const inClimate = (label: string) => (climateLabels as unknown as string[]).includes(label);
                            const inSocietal = (label: string) => (societalLabels as unknown as string[]).includes(label);

                            const getSeries = (label: string, year: Year): number[] => {
                              if (!label) return [];
                              if (inClimate(label)) {
                                return getMonthlySeriesForClimate(year, label as keyof import('../../services/lesson1Phase1Data').ClimateRecord);
                              }
                              if (inSocietal(label)) {
                                return getMonthlySeriesForSocietal(year, label as keyof import('../../services/lesson1Phase1Data').SocietalRecord);
                              }
                              return [];
                            };

                            const v1_2022 = getSeries(var1Label, 2022 as Year);
                            const v1_2023 = getSeries(var1Label, 2023 as Year);
                            const v2_2022 = getSeries(var2Label, 2022 as Year);
                            const v2_2023 = getSeries(var2Label, 2023 as Year);
                            const rows2022 = Array.from({ length: 12 }).map((_, m) => ({
                              mLabel: `${monthsNames[m]} 2022`,
                              v1: v1_2022[m],
                              v2: v2_2022[m]
                            }));
                            const rows2023 = Array.from({ length: 12 }).map((_, m) => ({
                              mLabel: `${monthsNames[m]} 2023`,
                              v1: v1_2023[m],
                              v2: v2_2023[m]
                            }));

                            return (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
                                <div style={{ paddingRight: 12, borderRight: '1px solid #e5e7eb' }}>
                                  <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0 }}>
                                    <colgroup>
                                      <col style={{ width: '45%' }} />
                                      <col style={{ width: '27.5%' }} />
                                      <col style={{ width: '27.5%' }} />
                                    </colgroup>
                                    <thead>
                                      <tr>
                                        <th style={{ textAlign: 'center', padding: '8px 6px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>Month and Year</th>
                                        <th style={{ textAlign: 'center', padding: '8px 6px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>{var1Label || 'Variable 1 (Column 2)'}</th>
                                        <th style={{ textAlign: 'center', padding: '8px 6px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>{var2Label || 'Variable 2 (Column 3)'}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {rows2022.map((r, i) => (
                                        <tr key={i}>
                                          <td style={{ padding: '8px 6px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', textAlign: 'center' }}>{r.mLabel}</td>
                                          <td style={{ padding: '8px 6px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', textAlign: 'center', background: 'var(--table-cell-bg, #f6f8fa)' }}>{(r.v1 ?? '') as any}</td>
                                          <td style={{ padding: '8px 6px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', textAlign: 'center', background: 'var(--table-cell-bg, #f6f8fa)' }}>{(r.v2 ?? '') as any}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <div style={{ minHeight: 480, padding: '0 12px' }}>
                                  <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0 }}>
                                    <colgroup>
                                      <col style={{ width: '45%' }} />
                                      <col style={{ width: '27.5%' }} />
                                      <col style={{ width: '27.5%' }} />
                                    </colgroup>
                                    <thead>
                                      <tr>
                                        <th style={{ textAlign: 'center', padding: '8px 6px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>Month and Year</th>
                                        <th style={{ textAlign: 'center', padding: '8px 6px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>{var1Label || 'Variable 1 (Column 2)'}</th>
                                        <th style={{ textAlign: 'center', padding: '8px 6px', borderBottom: '2px solid var(--phase2-accent, #8e44ad)', fontWeight: 700 }}>{var2Label || 'Variable 2 (Column 3)'}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {rows2023.map((r, i) => (
                                        <tr key={i}>
                                          <td style={{ padding: '8px 6px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', textAlign: 'center' }}>{r.mLabel}</td>
                                          <td style={{ padding: '8px 6px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', textAlign: 'center', background: 'var(--table-cell-bg, #f6f8fa)' }}>{(r.v1 ?? '') as any}</td>
                                          <td style={{ padding: '8px 6px', borderBottom: '1px solid var(--phase2-accent, #8e44ad)', textAlign: 'center', background: 'var(--table-cell-bg, #f6f8fa)' }}>{(r.v2 ?? '') as any}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, marginTop: 12 }}>
                                    <a
                                      href="https://docs.google.com/spreadsheets/d/1-qZXsncfMwdTZGI0biiL4r0LIN7T2dOuZC_9B2MWNnE/edit?gid=0#gid=0"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '10px 14px',
                                        borderRadius: 8,
                                        background: '#E6B8CC',
                                        border: '1px solid #D3A5BD',
                                        color: '#4D2038',
                                        textDecoration: 'none',
                                        fontWeight: 700
                                      }}
                                    >
                                      Open Google Sheet
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                          {/* spacing before cards */}
                          <div className="gap-3" />
                          <div className="gap-3" />
                          <div className="gap-3" />
                          <div className="gap-3" />
                          {/* Upload card: full width */}
                          <div className="card" style={{ minHeight: 320, display: 'flex', flexDirection: 'column' }}>
                              <div style={{ fontWeight: 700, textAlign: 'left' }}>Upload your screenshot here.</div>
                              <div className="gap-3" />
                              <div className="gap-3" />
                               <div className="input-row">
                                <label>Upload file</label>
                                 <input type="file" accept="image/jpeg,image/png,application/pdf" disabled={checkpointFinalized} onChange={(e)=>{
                                  const f = e.target.files && e.target.files[0];
                                  if (!f) { setUploadPreview(null); return; }
                                  const url = URL.createObjectURL(f);
                                  const type = f.type.includes('pdf') ? 'pdf' : 'image';
                                  setUploadPreview({ url, type });
                                }} />
                              </div>
                              <div style={{ marginTop: 12, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', background: '#fff', minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {uploadPreview ? (
                                  uploadPreview.type === 'image' ? (
                                    <img src={uploadPreview.url} alt="Uploaded preview" style={{ maxWidth: '100%', maxHeight: 420 }} />
                                  ) : (
                                    <iframe src={uploadPreview.url} title="PDF preview" style={{ width: '100%', height: 420, border: 0 }} />
                                  )
                                ) : (
                                  <span style={{ color: '#888' }}>No file uploaded yet.</span>
                                )}
                              </div>
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <div style={{ fontWeight: 700, textAlign: 'left' }}>Scatter Plot Label Checkpoints:</div>
                              <div className="gap-3" />
                              <div className="gap-3" />
                              {(() => {
                                const checkpointLabels: Array<string | JSX.Element> = [
                                  'a.\u00A0Is the name of the X-Axis referring to your First Variable?',
                                  'b.\u00A0Is the name of the Y-Axis referring to your Second Variable?',
                                  'c.\u00A0Are the names of the X and Y-axis properly capitalized?',
                                  (<>
                                    d.&nbsp;Does the title have this format:<br />
                                    <i>The Correlation between [Variable 1 Name] and [Variable 2 Name] in [Place]?</i>
                                  </>)
                                ];
                                const setAnswer = (idx: number, val: 'yes' | 'no') => {
                                  const next = [...checkpointAnswers];
                                  next[idx] = val;
                                  setCheckpointAnswers(next);
                                };
                                const canFinalize = checkpointAnswers.every(a => a === 'yes');
                                return (
                                  <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '80% 20%', gap: 10, paddingLeft: 12, paddingRight: 12 }}>
                                      {checkpointLabels.map((lbl, i) => (
                                        <>
                                          <div key={`cp-l-${i}`} style={{ textAlign: 'left' }}>{lbl}</div>
                                          <div key={`cp-r-${i}`} style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                                            <button
                                              type="button"
                                              disabled={checkpointFinalized}
                                              onClick={() => setAnswer(i, 'yes')}
                                              style={{
                                                padding: '8px 14px',
                                                borderRadius: 10,
                                                border: '1px solid #D3A5BD',
                                                background: checkpointAnswers[i] === 'yes' ? '#E6B8CC' : '#FFF5F9',
                                                color: checkpointAnswers[i] === 'yes' ? '#4D2038' : '#6B2F47',
                                                fontFamily: 'Poppins, sans-serif',
                                                fontWeight: 400
                                              }}
                                            >Yes</button>
                                            <button
                                              type="button"
                                              disabled={checkpointFinalized}
                                              onClick={() => setAnswer(i, 'no')}
                                              style={{
                                                padding: '8px 14px',
                                                borderRadius: 10,
                                                border: '1px solid #D3A5BD',
                                                background: checkpointAnswers[i] === 'no' ? '#E6B8CC' : '#FFF5F9',
                                                color: checkpointAnswers[i] === 'no' ? '#4D2038' : '#6B2F47',
                                                fontFamily: 'Poppins, sans-serif',
                                                fontWeight: 400
                                              }}
                                            >No</button>
                                          </div>
                                        </>
                                      ))}
                                    </div>
                                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', paddingLeft: 12, paddingRight: 12 }}>
                                      <button className="submit-btn" disabled={!canFinalize || checkpointFinalized} onClick={() => setCheckpointFinalized(true)} style={{ height: 40, padding: '10px 16px', fontSize: 15 }}>Finalize Scatter Plot</button>
                                    </div>
                                  </>
                                );
                              })()}
                          </div>
                          {/* Assessment card: stacked below upload card */}
                          <div className="card" style={{ minHeight: 320, display: 'flex', flexDirection: 'column', marginTop: 16 }}>
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <div style={{ display: 'flex', justifyContent: 'center', padding: '0 12px' }}>
                                <div style={{ width: '100%', background: '#E6B8CC', border: '1px solid #D3A5BD', color: '#4D2038', borderRadius: 12, padding: '10px 16px', fontWeight: 700, textAlign: 'center', fontSize: '1.2rem' }}>
                                  My Spreadsheet Skills Self-Assessment
                                </div>
                              </div>
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <div style={{ textAlign: 'left' }}>Read each statement carefully and assess your level of ability in performing the statements using the scale on the right. There's no need to worry about. There is no right or wrong in this self-assessment.</div>
                              <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '48px 2fr 1fr', gap: 6, flexGrow: 1 }}>
                                <div />
                                <div style={{ fontWeight: 700, textAlign: 'center' }}>Items</div>
                                <div style={{ fontWeight: 700, textAlign: 'center' }}>Scale</div>
                                {selfAssessItems.map((label, idx) => (
                                  <>
                                    <div key={`num-${idx}`} style={{ textAlign: 'left' }}>{idx + 1}.</div>
                                    <div key={`lbl-${idx}`} style={{ textAlign: 'left' }}>{label}</div>
                                    <select key={`sel-${idx}`} value={selfAssessAnswers[idx]} disabled={selfAssessSubmitted} onChange={(e)=>{
                                      const next = [...selfAssessAnswers];
                                      next[idx] = e.target.value;
                                      setSelfAssessAnswers(next);
                                    }} style={{ height: 40, background: '#E6B8CC', border: '1px solid #D3A5BD', color: '#4D2038', borderRadius: 10, padding: '8px 12px', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
                                      <option value="">Select</option>
                                      {selfAssessScale.map((opt, i)=>(<option key={i} value={opt}>{opt}</option>))}
                                    </select>
                                  </>
                                ))}
                              </div>
                              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                  className="submit-btn"
                                  disabled={selfAssessSubmitted || !selfAssessAnswers.every(a => (a || '').trim().length > 0)}
                                  onClick={() => setSelfAssessSubmitted(true)}
                                  style={{ height: 42, padding: '10px 18px', fontSize: 16 }}
                                >
                                  Submit
                                </button>
                              </div>
                              {selfAssessSubmitted && (
                                <div className="banner" style={{ marginTop: 12 }}>Self-assessment submitted. Thank you!</div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Phase 2 - Activity 4 */}
                    <div className="sub-item">
                      <div className="sub-header blue" onClick={()=> setSubOpen(s=>({...s, a4: !s.a4}))}><span className="label"><span className="icon">✍️</span> <b>Activity 4: Interpret Your Pearson r Value</b></span><span className="right-indicator"><span className="toggle-sign">{subOpen.a4 ? '−' : '+'}</span></span></div>
                      <div className="sub-content" style={{display: subOpen.a4 ? 'block' : 'none'}}>
                        {/* Cards 1 and 2: horizontal with equal width and gaps */}
                        <div className="cards-row" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 16 }}>
                          <div className="card spacious">
                            <div style={{ fontWeight: 700 }}><span className="icon">🧭</span> What you will do:</div>
                            <div className="gap-3" />
                            <div>You will learn how to interpret Pearson r values and apply this to your own results.</div>
                          </div>
                          <div className="card spacious">
                            <div style={{ fontWeight: 700 }}><span className="icon">🛠️</span> How to do it:</div>
                            <div className="gap-3" />
                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                              <li>Study the interpretation table that explains what different r values mean.</li>
                              <li>Locate your computed r value in the table.</li>
                              <li>Interpret what your result says about the relationship between your chosen climate variables.</li>
                            </ul>
                            <div className="gap-3" />
                            <div><span className="icon">💡</span> <b>Think about this:</b></div>
                            <div>Does the strength and direction of the relationship match what you observed earlier in the data?</div>
                          </div>
                        </div>

                        {/* Card 3: stacked full-width sections with equal gaps */}
                        <div className="card spacious">
                          {/* General Interpretation table: full width */}
                          <div>
                              {/* Understanding the r Value intro */}
                              <div style={{ fontWeight: 700, textAlign: 'left', fontSize: '1.2rem' }}>Understanding the r Value</div>
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <div style={{ textAlign: 'left' }}>The r value, also called the correlation coefficient, shows how two variables are related. It tells us how strong the relationship is and whether it moves in the same or opposite direction.</div>
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <div style={{ textAlign: 'left' }}>The value of r ranges from –1 to +1.</div>
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <svg width="740" height="200" viewBox="0 0 740 200" aria-label="Correlation coefficient reference" role="img">
                                  {/* Background */}
                                  <rect x="8" y="8" width="724" height="184" rx="12" ry="12" fill="#FFF5F9" stroke="#FFD4E4" />
                                  {/* Titles */}
                                  <text x="370" y="40" textAnchor="middle" fontSize="20" fontWeight="700" fill="#000">Correlation Coefficient</text>
                                  <text x="370" y="60" textAnchor="middle" fontSize="14" fill="#333">Shows Strength & Direction of Correlation</text>
                                  {/* Baseline segments */}
                                  <line x1="50" y1="110" x2="370" y2="110" stroke="#d9534f" strokeWidth="5" />
                                  <line x1="370" y1="110" x2="690" y2="110" stroke="#28a745" strokeWidth="5" />
                                  {/* Zero marker */}
                                  <line x1="370" y1="96" x2="370" y2="124" stroke="#1e88e5" strokeWidth="6" />
                                  {/* Tick marks */}
                                  <line x1="50" y1="104" x2="50" y2="116" stroke="#666" />
                                  <line x1="210" y1="106" x2="210" y2="114" stroke="#666" />
                                  <line x1="530" y1="106" x2="530" y2="114" stroke="#666" />
                                  <line x1="690" y1="104" x2="690" y2="116" stroke="#666" />
                                  {/* Labels under ticks */}
                                  <text x="50" y="140" textAnchor="middle" fontSize="13" fill="#000">-1.0</text>
                                  <text x="210" y="140" textAnchor="middle" fontSize="13" fill="#000">-0.5</text>
                                  <text x="370" y="140" textAnchor="middle" fontSize="13" fill="#1e88e5">0.0</text>
                                  <text x="530" y="140" textAnchor="middle" fontSize="13" fill="#000">+0.5</text>
                                  <text x="690" y="140" textAnchor="middle" fontSize="13" fill="#000">+1.0</text>
                                  {/* Strength labels */}
                                  <text x="110" y="92" textAnchor="middle" fontSize="13" fill="#000">Strong</text>
                                  <text x="260" y="92" textAnchor="middle" fontSize="13" fill="#000">Weak</text>
                                  <text x="480" y="92" textAnchor="middle" fontSize="13" fill="#000">Weak</text>
                                  <text x="630" y="92" textAnchor="middle" fontSize="13" fill="#000">Strong</text>
                                  {/* Direction labels */}
                                  <text x="170" y="165" textAnchor="middle" fontSize="13" fill="#d9534f">Negative Correlation</text>
                                  <text x="370" y="165" textAnchor="middle" fontSize="13" fill="#1e88e5">Zero</text>
                                  <text x="570" y="165" textAnchor="middle" fontSize="13" fill="#28a745">Positive Correlation</text>
                                </svg>
                              </div>
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <ul style={{ margin: 0, paddingLeft: 18, textAlign: 'left' }}>
                                <li><span>&nbsp;&nbsp;&nbsp;</span>A value close to +1 means a strong positive relationship (as one variable increases, the other also increases).</li>
                                <li><span>&nbsp;&nbsp;&nbsp;</span>A value close to –1 means a strong negative relationship (as one variable increases, the other decreases).</li>
                                <li><span>&nbsp;&nbsp;&nbsp;</span>A value near 0 means there is little to no relationship between the variables.</li>
                              </ul>
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <div style={{ textAlign: 'left' }}>Understanding the r value helps us interpret patterns in data and make evidence-based conclusions.<br />Study the table below for your reference.</div>
                              <div className="gap-3" />
                              <div className="gap-3" />
                              {/* Rounded box for title + table */}
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <div style={{ borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', background: 'rgba(248, 228, 235, 0.6)', padding: '16px 20px' }}>
                                <div style={{ fontWeight: 700, textAlign: 'left', fontSize: '1.2rem' }}>General Interpretation of Pearson r Values</div>
                                <div className="gap-3" />
                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed' }}>
                                  <colgroup>
                                    <col style={{ width: '33%' }} />
                                    <col style={{ width: '34%' }} />
                                    <col style={{ width: '33%' }} />
                                  </colgroup>
                                  <thead>
                                    <tr>
                                      <th style={{ textAlign: 'center', fontWeight: 700, padding: '10px 8px', borderBottom: '2px solid #ddd' }}>Correlation Coefficient (r)</th>
                                      <th style={{ textAlign: 'center', fontWeight: 700, padding: '10px 8px', borderBottom: '2px solid #ddd' }}>Strength of Relationship</th>
                                      <th style={{ textAlign: 'center', fontWeight: 700, padding: '10px 8px', borderBottom: '2px solid #ddd' }}>Direction</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[
                                      { r: '1.0 (or -1.0)', s: 'Perfect', d: 'Positive (or Negative)' },
                                      { r: '0.80 to 0.99 (-0.80 to -0.99)', s: 'Very Strong', d: 'Positive (or Negative)' },
                                      { r: '0.60 to 0.79 (-0.60 to -0.79)', s: 'Strong', d: 'Positive (or Negative)' },
                                      { r: '0.40 to 0.59 (-0.40 to -0.59)', s: 'Moderate', d: 'Positive (or Negative)' },
                                      { r: '0.20 to 0.39 (-0.20 to -0.39)', s: 'Weak', d: 'Positive (or Negative)' },
                                      { r: '0.01 to 0.19 (-0.01 to -0.19)', s: 'Very Weak', d: 'Positive (or Negative)' },
                                      { r: '0', s: 'No Relationship', d: 'Positive (or Negative)' }
                                    ].map((row, i) => (
                                      <tr key={i}>
                                        <td style={{ textAlign: 'center', fontWeight: 700, padding: '8px 8px', borderBottom: '1px solid #eee' }}>{row.r}</td>
                                        <td style={{ textAlign: 'center', padding: '8px 8px', borderBottom: '1px solid #eee' }}>{row.s}</td>
                                        <td style={{ textAlign: 'center', padding: '8px 8px', borderBottom: '1px solid #eee' }}>{row.d}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div className="gap-3" />
                              <div className="gap-3" />
                            {/* Quiz: full width */}
                            <div>
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <div style={{ fontWeight: 700, textAlign: 'left', fontSize: '1.2rem' }}>Pearson r Interpretation Quiz</div>
                              <div style={{ textAlign: 'left' }}>Based on the General Interpretation of Pearson r Table, identify the strength of relationship and direction of the r value in each item.</div>
                              <div className="gap-3" />
                              <div className="gap-3" />
                              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed' }}>
                                <colgroup>
                                  <col style={{ width: '40%' }} />
                                  <col style={{ width: '30%' }} />
                                  <col style={{ width: '30%' }} />
                                </colgroup>
                                <thead>
                                  <tr>
                                    <th style={{ textAlign: 'center', fontWeight: 700, padding: '6px 6px' }}>r Value</th>
                                    <th style={{ textAlign: 'center', fontWeight: 700, padding: '6px 6px' }}>Strength</th>
                                    <th style={{ textAlign: 'center', fontWeight: 700, padding: '6px 6px' }}>Direction</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {a4QuizItems.map((item, idx) => (
                                    <tr key={idx}>
                                      <td style={{ padding: '10px 6px', textAlign: 'center' }}>
                                        <div style={{ display: 'inline-block', width: '95%', background: '#FFE8F1', border: '1px solid #FFD4E4', color: '#6B2F47', borderRadius: 10, padding: '8px 12px', fontWeight: 700 }}>
                                          {idx+1}. r = {item.r}
                                        </div>
                                      </td>
                                      <td style={{ padding: '10px 6px', textAlign: 'center' }}>
                                        <select value={a4StrengthSel[idx]} onChange={(e)=>{
                                          const next = [...a4StrengthSel]; next[idx] = e.target.value; setA4StrengthSel(next);
                                        }} style={{ width: '95%', height: 40, background: '#E6B8CC', border: '1px solid #D3A5BD', color: '#4D2038', borderRadius: 10, padding: '8px 12px' }}>
                                          <option value="">Select</option>
                                          {a4StrengthOptions.map((opt, i)=>(<option key={i} value={opt}>{opt}</option>))}
                                        </select>
                                      </td>
                                      <td style={{ padding: '10px 6px', textAlign: 'center' }}>
                                        <select value={a4DirectionSel[idx]} onChange={(e)=>{
                                          const next = [...a4DirectionSel]; next[idx] = e.target.value; setA4DirectionSel(next);
                                        }} style={{ width: '95%', height: 40, background: '#FFF5F9', border: '1px solid #FFD4E4', color: '#6B2F47', borderRadius: 10, padding: '8px 12px' }}>
                                          <option value="">Select</option>
                                          {a4DirectionOptions.map((opt, i)=>(<option key={i} value={opt}>{opt}</option>))}
                                        </select>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="submit-btn" onClick={checkA4Answers} disabled={!a4Complete} style={{ height: 40, padding: '10px 16px' }}>Check Answers</button>
                              </div>
                              {a4Checked && (
                                <div style={{ marginTop: 12 }}>
                                  {a4Correct.map((ok, i)=>(
                                    <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginRight: 12 }}>
                                      <span>Item {i+1}:</span> {ok ? <CheckCircle /> : <StopSign />}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                    {p2Score !== undefined && (
                      <div className="banner">Teacher Score: {p2Score}%</div>
                    )}
                  </div>
                )}
              </div>

              {/* Phase 3 */}
              <div className="accordion-item phase3">
                <div className="accordion-header" onClick={togglePhase3}>
                  <h3>Phase 3: From Numbers to Action</h3>
                  {isLocked(3) && (<span className="locked-tag" title="Complete previous phase to unlock" aria-label="Locked">🔒</span>)}
                  <span className="right-indicator">{state.completedPhases.includes(3) && (<span className="status-tag">Completed</span>)}<span className="toggle-sign">{open.p3 ? '▼' : '▶'}</span></span>
                </div>
                {open.p3 && renderPhase3Content()}
              </div>

              {/* Phase 4 */}
              <div className="accordion-item phase4">
                <div className="accordion-header" onClick={togglePhase4}>
                  <h3>Phase 4</h3>
                  <span className="right-indicator"><span className="toggle-sign">{open.p4 ? '▼' : '▶'}</span></span>
                </div>
                {open.p4 && (
                  <div className="accordion-content">
                    <div className="input-row">
                      <label>Output Format</label>
                      <select onChange={(e)=>savePhaseData(4, { format: e.target.value })}>
                        <option value="">Select</option>
                        <option value="policy-brief">Policy Brief</option>
                        <option value="infographic">Infographic</option>
                        <option value="presentation">Presentation</option>
                      </select>
                    </div>
                    <div className="input-row"><label>Reflection</label><textarea rows={3} onChange={(e)=>savePhaseData(4, { reflection: e.target.value })} /></div>
                    {p4Score !== undefined && (
                      <div className="banner">Teacher Score: {p4Score}%</div>
                    )}
                    <div className="section-actions">
                      <button className="complete-btn" onClick={() => { if (p4Score !== undefined) { markCompleted(4); alert('Mission Complete! Returning to Home.'); onBack(); } else { alert('Awaiting teacher score to finalize Phase 4.'); } }}>Mission Complete</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
      </main>
    </div>
  );
};

export default Lesson1;

function parseList(value: string): string[] {
  const parts = (value || '').split(';').flatMap(part => part.split(','));
  return parts.map(s => s.trim()).filter(Boolean);
}

// removed: renderPhase3Content top-level helper; now defined inside component
