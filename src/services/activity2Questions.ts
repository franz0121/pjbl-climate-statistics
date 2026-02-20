// Phase 1 - Activity 2: Original checkpoint questions
// Sourced from user-provided material.

export const activity2Questions: string[] = [
  'In simple terms, what does a Pearson correlation measure between two variables?',
  'What is the numerical range of Pearson’s r?',
  'What does the sign of the numerical range of Pearson’s r convey?',
  'What hypothesis is tested whether it is rejected or not?',
  'Name one assumption that must be satisfied for Pearson correlation to be appropriate.'
];

const norm = (s: string) => (s || '').toLowerCase().trim();

export const activity2Validators: Array<(answer: string) => boolean> = [
  // Q1: strength and direction (order-agnostic, must contain both words)
  (answer) => {
    const a = norm(answer);
    return a.includes('strength') && a.includes('direction');
  },
  // Q2: −1 to +1 (accept ASCII '-' or Unicode '−', must contain -1 and +1)
  (answer) => {
    const a = norm(answer).replace(/–|—|−/g, '-');
    return a.includes('-1') && a.includes('+1');
  },
  // Q3: sign conveys direction (must include 'direction' and both 'positive' and 'negative')
  (answer) => {
    const a = norm(answer);
    return a.includes('direction') && a.includes('positive') && a.includes('negative');
  },
  // Q4: null hypothesis
  (answer) => {
    const a = norm(answer);
    return a.includes('null hypothesis');
  },
  // Q5: any one of: linear relationship; approximately normal/bivariate normal; no major outliers; homoscedasticity
  (answer) => {
    const a = norm(answer);
    const keywords = [
      'linear',
      'normal',
      'bivariate normal',
      'outlier',
      'outliers',
      'homoscedasticity'
    ];
    return keywords.some(k => a.includes(k));
  }
];

// Activity 2b answer key: expected predictor/response pairs for the 'Pair of Variables' task.
// Normalize comparisons by lowercasing and trimming.
export const activity2bAnswerKey: Array<{ predictor: string; response: string }> = [
  { predictor: 'consecutive dry days', response: 'tourist arrivals' },
  { predictor: 'heat index', response: 'rice production' },
  { predictor: 'total rainfall', response: 'rice production' },
  { predictor: 'consecutive wet days', response: 'electricity demand' },
  { predictor: 'enso index (niño 3.4)', response: 'respiratory er visits' }
];

// Lesson 2 Phase 2 Activity 1: Video checkpoints for "Understanding Regression Lines" (Lesson 2 only)
export const lesson2Phase2Activity1Questions: string[] = [
  'What do we call the straight line that represents the relationship between two variables in simple linear regression?',
  'In the regression equation, what does the slope (b) measure?',
  'What does the y-intercept (a) represent in the regression equation?',
  'The slope describes the change in the dependent variable for every one-unit increase in what variable?'
];

const norm2 = (s: string) => (s || '').toLowerCase().trim();

export const lesson2Phase2Activity1Validators: Array<(answer: string) => boolean> = [
  // Q1: accept 'regression line' or both words 'regression' and 'line'
  (answer) => {
    const a = norm2(answer);
    return a.includes('regression') && a.includes('line');
  },
  // Q2: accept 'rate of change' or presence of 'rate' and 'change'
  (answer) => {
    const a = norm2(answer);
    return a.includes('rate') || a.includes('rate of change') || a.includes('change');
  },
  // Q3: accept 'starting value' or synonyms like 'intercept' or 'initial value'
  (answer) => {
    const a = norm2(answer);
    return a.includes('start') || a.includes('starting') || a.includes('intercept') || a.includes('initial');
  },
  // Q4: accept 'independent variable' or presence of 'independent'
  (answer) => {
    const a = norm2(answer);
    return a.includes('independent');
  }
];

// Phase 2 - Activity 1: The Concept of Linear Regression (validators)
export const phase2Activity1Questions: string[] = [
  'What do we call the straight line that represents the relationship between two variables in simple linear regression?',
  'In the regression equation, what does the slope (b) measure?',
  'What does the y-intercept (a) represent in the regression equation?',
  'The slope describes the change in the dependent variable for every one-unit increase in what variable?'
];

export const phase2Activity1Validators: Array<(answer: string) => boolean> = [
  // Q1: expects 'regression line' (allow 'line of best fit')
  (answer) => {
    const a = norm(answer);
    return (a.includes('regression') && a.includes('line')) || a.includes('line of best fit') || a.includes('regression line');
  },
  // Q2: expects 'rate of change' (accept 'slope' or phrase containing 'rate' and 'change')
  (answer) => {
    const a = norm(answer);
    return a.includes('rate') && a.includes('change') || a.includes('slope');
  },
  // Q3: expects 'starting value' (accept 'intercept' or 'y-intercept')
  (answer) => {
    const a = norm(answer);
    return a.includes('starting') && a.includes('value') || a.includes('intercept');
  },
  // Q4: expects 'independent variable' (accept 'independent' or 'predictor')
  (answer) => {
    const a = norm(answer);
    return a.includes('independent') || a.includes('predictor');
  }
];
