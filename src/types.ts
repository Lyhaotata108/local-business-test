export type ViewState = 'home' | 'diagnostic' | 'results';

export interface AnswerOption {
  label: string;
  value: string;
  score?: number;
  problemText?: string; // Text to use if this is selected as a problem
}

export interface Question {
  id: string;
  type: 'select' | 'radio' | 'text' | 'url';
  label: string;
  options?: AnswerOption[];
  category?: 'visibility' | 'trust' | 'conversion' | 'offer' | 'retention' | 'competition';
  optional?: boolean;
}

export interface Step {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface DiagnosticState {
  answers: Record<string, any>;
  scores: Record<string, number>;
}

export interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  rate: number;
}
