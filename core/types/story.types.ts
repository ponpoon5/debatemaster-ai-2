export interface StoryStakeholder {
  name: string;
  role: string;
  standpoint: string;
}

export interface StoryScenario {
  title: string;
  worldSetting: string;
  currentProblem: string;
  userRole: {
    title: string;
    description: string;
    mission: string;
  };
  stakeholders: StoryStakeholder[];
  initialState: string;
}

export interface StoryAnalysis {
  decisionScore: number;
  consensusScore: number;
  outcome: string;
  socialImpact: {
    economic: string;
    publicSentiment: string;
    ethical: string;
  };
  alternativeScenario: string;
}

export interface DemoTurn {
  speaker: 'PRO' | 'CON';
  speakerName: string;
  text: string;
  analysis: {
    type: 'LOGIC' | 'FALLACY' | 'RHETORIC' | 'STRATEGY';
    highlight: string;
    comment: string;
    score?: number;
  };
}

export interface StrategyHighlight {
  technique: string;
  description: string;
  effect: string;
}

export interface ObserverLearningPoint {
  point: string;
  reason: string;
}

export interface DemoAnalysis {
  summary: string;
  clashAnalysis: {
    agenda: string;
    pro: {
      claim: string;
      data: string;
      warrant: string;
    };
    con: {
      counter: string;
      evidence: string;
      impact: string;
    };
    synthesis: string;
  };
  highlights: StrategyHighlight[];
  learningPoints: ObserverLearningPoint[];
}
