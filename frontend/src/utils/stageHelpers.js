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
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    dotClass: 'bg-blue-400',
    stepNumber: 1,
  },
  R1: {
    label: 'R1 Screen',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    dotClass: 'bg-indigo-400',
    stepNumber: 2,
  },
  R2: {
    label: 'R2 Technical',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dotClass: 'bg-amber-400',
    stepNumber: 3,
  },
  R3: {
    label: 'R3 Final',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    dotClass: 'bg-purple-400',
    stepNumber: 4,
  },
  Approved: {
    label: 'Approved',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
    stepNumber: 5,
  },
  Reject: {
    label: 'Rejected',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dotClass: 'bg-rose-400',
    stepNumber: null,
  },
  'R1 Reject': {
    label: 'R1 Rejected',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dotClass: 'bg-rose-400',
    stepNumber: null,
  },
  'R2 Reject': {
    label: 'R2 Rejected',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dotClass: 'bg-rose-400',
    stepNumber: null,
  },
  'R3 Reject': {
    label: 'R3 Rejected',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dotClass: 'bg-rose-400',
    stepNumber: null,
  },
};

export const isTerminalStage = (stage) => {
  return stage === 'Approved' || stage.includes('Reject');
};

export const getNextAllowedStages = (currentStage) => {
  return ALLOWED_TRANSITIONS[currentStage] || [];
};
