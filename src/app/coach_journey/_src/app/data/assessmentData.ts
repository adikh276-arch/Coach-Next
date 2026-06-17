// Focus areas configuration
export const FOCUS_AREAS = [
  { id: 'emotional-regulation', label: 'Emotional Regulation', color: '#FFC107' },
  { id: 'communication', label: 'Communication', color: '#4FC3F7' },
  { id: 'resilience', label: 'Resilience', color: '#9575CD' },
  { id: 'collaboration', label: 'Collaboration', color: '#FF7043' },
  { id: 'problem-solving', label: 'Problem Solving', color: '#42A5F5' },
  { id: 'feedback-orientation', label: 'Feedback Orientation', color: '#26C6DA' },
  { id: 'mindfulness', label: 'Mindfulness', color: '#66BB6A' },
  { id: 'growth-mindset', label: 'Growth Mindset', color: '#5C6BC0' },
  { id: 'goal-setting', label: 'Goal Setting', color: '#29B6F6' },
  { id: 'centeredness', label: 'Centeredness', color: '#AB47BC' },
];

// Assessment questions - each impacts specific focus areas
export const ASSESSMENTS = [
  {
    id: 'emotional-intelligence',
    title: 'Emotional Intelligence Assessment',
    description: 'Evaluate your emotional intelligence and understand how you manage emotions, relationships, and self-awareness.',
    icon: '🧠',
    completed: false,
    questions: [
      {
        id: 'eq1',
        text: 'When you feel stressed, how often do you notice it before reacting?',
        focusAreas: ['emotional-regulation'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'eq2',
        text: 'In difficult situations, how often do you pause before responding?',
        focusAreas: ['emotional-regulation'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'eq3',
        text: 'How often do you adjust your communication based on who you\'re speaking to?',
        focusAreas: ['communication'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'eq4',
        text: 'When things go wrong, how often do you stay composed?',
        focusAreas: ['resilience'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'eq5',
        text: 'During conversations, how often do you let others finish before responding?',
        focusAreas: ['communication'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'eq6',
        text: 'How often do you try to understand others\' perspectives before reacting?',
        focusAreas: ['collaboration'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'eq7',
        text: 'In disagreements, how often do you focus on resolving rather than winning?',
        focusAreas: ['problem-solving'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'eq8',
        text: 'When receiving feedback, how often do you reflect before responding?',
        focusAreas: ['feedback-orientation'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'eq9',
        text: 'After setbacks, how quickly do you regain focus?',
        focusAreas: ['resilience'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'eq10',
        text: 'How often do you adjust your emotional tone depending on the situation?',
        focusAreas: ['mindfulness'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
    ],
  },
  {
    id: 'strength-assessment',
    title: 'Strength Assessment',
    description: 'Discover your strengths and areas for growth, then use these to define focus areas and goals for your coaching program.',
    icon: '📊',
    completed: false,
    questions: [
      {
        id: 'sa1',
        text: 'How clearly can you identify tasks where you perform best?',
        focusAreas: ['growth-mindset'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'sa2',
        text: 'How often does your daily work align with what you do best?',
        focusAreas: ['goal-setting'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'sa3',
        text: 'When assigned new tasks, how often do you feel confident handling them?',
        focusAreas: ['centeredness'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'sa4',
        text: 'How often do colleagues approach you for help in specific areas?',
        focusAreas: ['communication'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'sa5',
        text: 'How often do you choose tasks that match your strengths when possible?',
        focusAreas: ['goal-setting'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'sa6',
        text: 'When solving problems, how often do you rely on your strengths?',
        focusAreas: ['problem-solving'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'sa7',
        text: 'How often do you feel energized while working on certain tasks?',
        focusAreas: ['resilience'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'sa8',
        text: 'How often do you actively try to improve your strongest skills?',
        focusAreas: ['growth-mindset'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'sa9',
        text: 'How easily can you explain your strengths in a work context?',
        focusAreas: ['communication'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'sa10',
        text: 'How often do you use your strengths to overcome difficult situations?',
        focusAreas: ['problem-solving'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
    ],
  },
  {
    id: 'leadership-potential',
    title: 'Leadership Potential Assessment',
    description: 'Assess your leadership capabilities and identify areas to develop your leadership impact.',
    icon: '⭐',
    completed: false,
    questions: [
      {
        id: 'lp1',
        text: 'How often do you take initiative without being asked?',
        focusAreas: ['growth-mindset'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'lp2',
        text: 'In team discussions, how often are your ideas accepted or acted upon?',
        focusAreas: ['communication'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'lp3',
        text: 'When something goes wrong, how often do you take responsibility?',
        focusAreas: ['centeredness'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'lp4',
        text: 'When faced with decisions, how often do you make them without delay?',
        focusAreas: ['problem-solving'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'lp5',
        text: 'How often do team members seek your guidance?',
        focusAreas: ['collaboration'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'lp6',
        text: 'How often do you simplify complex ideas for others?',
        focusAreas: ['communication'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'lp7',
        text: 'How often do you follow through on commitments?',
        focusAreas: ['centeredness'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'lp8',
        text: 'In uncertain situations, how often do you stay steady and guide others?',
        focusAreas: ['resilience'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'lp9',
        text: 'How often do you ask for feedback to improve your performance?',
        focusAreas: ['feedback-orientation'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
      {
        id: 'lp10',
        text: 'How often do you think beyond immediate tasks to long-term outcomes?',
        focusAreas: ['goal-setting'],
        options: [
          { value: 1, label: 'Never' },
          { value: 2, label: 'Rarely' },
          { value: 3, label: 'Sometimes' },
          { value: 4, label: 'Often' },
          { value: 5, label: 'Almost Always' },
        ],
      },
    ],
  },
];

export interface AssessmentAnswer {
  questionId: string;
  value: number;
}

export interface AssessmentResult {
  assessmentId: string;
  answers: AssessmentAnswer[];
  completedAt: Date;
}

// Calculate focus area scores from assessment results
export function calculateFocusAreaScores(results: AssessmentResult[]): Record<string, number> {
  const scores: Record<string, { total: number; count: number }> = {};

  // Initialize scores
  FOCUS_AREAS.forEach(area => {
    scores[area.id] = { total: 0, count: 0 };
  });

  // Calculate scores from all assessments
  results.forEach(result => {
    const assessment = ASSESSMENTS.find(a => a.id === result.assessmentId);
    if (!assessment) return;

    result.answers.forEach(answer => {
      const question = assessment.questions.find(q => q.id === answer.questionId);
      if (!question) return;

      question.focusAreas.forEach(areaId => {
        scores[areaId].total += answer.value;
        scores[areaId].count += 1;
      });
    });
  });

  // Calculate averages
  const finalScores: Record<string, number> = {};
  Object.keys(scores).forEach(areaId => {
    finalScores[areaId] = scores[areaId].count > 0 
      ? Math.round((scores[areaId].total / scores[areaId].count) * 10) / 10
      : 0;
  });

  return finalScores;
}

// Generate ACTUAL progress data over time
export function calculateActualProgress(results: AssessmentResult[]): any[] {
  if (!results || results.length === 0) return [];
  
  // Sort results by date ascending
  const sortedResults = [...results].sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());
  
  const dataPoints: any[] = [];
  const cumulativeResults: AssessmentResult[] = [];
  let currentDateStr = '';
  
  sortedResults.forEach(result => {
    cumulativeResults.push(result);
    const dateObj = new Date(result.completedAt);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const currentScores = calculateFocusAreaScores(cumulativeResults);
    
    if (dateStr === currentDateStr && dataPoints.length > 0) {
      const lastPoint = dataPoints[dataPoints.length - 1];
      FOCUS_AREAS.forEach(area => {
        lastPoint[area.id] = currentScores[area.id] || 0;
      });
    } else {
      const newPoint: any = { date: dateStr };
      FOCUS_AREAS.forEach(area => {
        newPoint[area.id] = currentScores[area.id] || 0;
      });
      dataPoints.push(newPoint);
      currentDateStr = dateStr;
    }
  });

  return dataPoints;
}
