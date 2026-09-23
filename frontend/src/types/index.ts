export interface Persona {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  category: 'Business & Tech' | 'Sports & Fitness' | 'Pop Culture & Media' | 'Philosophy & Fiction' | 'Everyday Life';
  traits: string[];
  inspiredBy?: string;
  isRealPerson: boolean;
  isLiveBackend: boolean;
  avatarIcon: string;
  color: string;
  starterPrompts: string[];
  disclaimer?: string;
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  characterBreakRisk?: number;
  personaId: string;
  error?: boolean;
}

export interface ChatApiRequest {
  session_id: string;
  message: string;
}

export interface ChatApiResponse {
  bot_reply: string;
  character_break_risk: number;
}

export type RiskLevel = 'stable' | 'moderate' | 'elevated' | 'high';

export interface RiskEvaluation {
  percentage: number;
  level: RiskLevel;
  label: string;
  description: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export interface BackendHealthResponse {
  status: string;
  service?: string;
  model?: string;
  active_sessions?: number;
}
