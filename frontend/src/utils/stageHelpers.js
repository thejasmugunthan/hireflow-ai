export const ALL_STAGES = [
  'Applied',
  'Reject',
  'R1',
  'R1 Reject',
  'R2',
  'R2 Reject',
  'R3',
  'R3 Reject',
  'Approved',
];

export const ALLOWED_TRANSITIONS = {
  Applied: ['R1', 'Reject'],
  R1: ['R2', 'R1 Reject'],
  R2: ['R3', 'R2 Reject'],
  R3: ['Approved', 'R3 Reject'],
  Reject: [],
  'R1 Reject': [],
  'R2 Reject': [],
  'R3 Reject': [],
  Approved: [],
};

export const STAGE_CONFIG = {
  Applied: {
    label: 'Applied',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-600',
    stepNumber: 1,
  },
  R1: {
    label: 'R1 Screen',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dotClass: 'bg-indigo-600',
    stepNumber: 2,
  },
  R2: {
    label: 'R2 Technical',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-600',
    stepNumber: 3,
  },
  R3: {
    label: 'R3 Final',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    dotClass: 'bg-purple-600',
    stepNumber: 4,
  },
  Approved: {
    label: 'Approved',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-600',
    stepNumber: 5,
  },
  Reject: {
    label: 'Rejected',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-600',
    stepNumber: null,
  },
  'R1 Reject': {
    label: 'R1 Rejected',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-600',
    stepNumber: null,
  },
  'R2 Reject': {
    label: 'R2 Rejected',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-600',
    stepNumber: null,
  },
  'R3 Reject': {
    label: 'R3 Rejected',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-600',
    stepNumber: null,
  },
};

export const isTerminalStage = (stage) => {
  return stage === 'Approved' || stage?.includes('Reject');
};

export const getNextAllowedStages = (currentStage) => {
  return ALLOWED_TRANSITIONS[currentStage] || [];
};

export const getStageDecisionOptions = (currentStage) => {
  switch (currentStage) {
    case 'Applied':
      return {
        pass: { stage: 'R1', label: 'Advance to Round 1 (R1 Screen)', description: 'Candidate passes initial screening and is invited for technical screening' },
        reject: { stage: 'Reject', label: 'Reject at Application Stage', description: 'Application does not meet initial criteria' },
      };
    case 'R1':
      return {
        pass: { stage: 'R2', label: 'Advance to Round 2 (R2 Technical)', description: 'Candidate passed R1 and moves to deep technical coding/architecture round' },
        reject: { stage: 'R1 Reject', label: 'Reject after Round 1', description: 'Candidate did not clear technical screening' },
      };
    case 'R2':
      return {
        pass: { stage: 'R3', label: 'Advance to Round 3 (R3 Final)', description: 'Candidate passed R2 and is scheduled for final leadership / culture round' },
        reject: { stage: 'R2 Reject', label: 'Reject after Round 2', description: 'Candidate did not meet technical bar in R2' },
      };
    case 'R3':
      return {
        pass: { stage: 'Approved', label: 'Approve & Extend Offer', description: 'Candidate cleared all rounds. Application approved for hiring offer.' },
        reject: { stage: 'R3 Reject', label: 'Reject after Round 3', description: 'Candidate was not selected following the final round' },
      };
    default:
      return null;
  }
};
