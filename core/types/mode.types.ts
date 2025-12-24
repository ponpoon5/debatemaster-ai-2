export enum ThinkingFramework {
  MECE = 'MECE',
  FIVE_WHYS = 'FIVE_WHYS',
  SWOT = 'SWOT',
  PEST = 'PEST',
  LOGIC_TREE = 'LOGIC_TREE',
  META_COGNITION = 'META_COGNITION',
}

export interface PremiseData {
  definitions: string;
  goal: string;
}

export interface FactOpinionSegment {
  text: string;
  type: 'fact' | 'opinion' | 'neutral';
}

export interface ArgumentAnalysis {
  segments: FactOpinionSegment[];
  factRatio: number;
  opinionRatio: number;
}

export interface FacilitationBoardData {
  currentAgenda: string;
  opinionA: {
    summary: string;
    pros: string[];
    cons: string[];
  };
  opinionB: {
    summary: string;
    pros: string[];
    cons: string[];
  };
  agreedPoints: string[];
  conflictingPoints: string[];
  facilitationHint: string;
}
