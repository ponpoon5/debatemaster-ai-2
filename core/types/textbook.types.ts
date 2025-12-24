export interface ToulminLabResult {
  score: number;
  critique: string;
  warrantImprovement: string;
}

export interface DefinitionLabResult {
  counterExample: string;
  explanation: string;
  isRobust: boolean;
}
