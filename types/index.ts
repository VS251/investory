// ─── Stocks ──────────────────────────────────────────────────────────────────

export type Sector =
  | 'Banking'
  | 'IT'
  | 'Energy'
  | 'FMCG'
  | 'Finance'
  | 'Auto'
  | 'Pharma'
  | 'Consumer'
  | 'Telecom'
  | 'Utilities'
  | 'Materials'
  | 'Infrastructure'
  | 'Insurance'
  | 'Healthcare'
  | 'Mining';

export interface PricePoint {
  date: string; // "YYYY-MM-DD"
  price: number;
}

export interface Stock {
  symbol: string;
  name: string;
  sector: Sector;
  marketCap: 'large' | 'mid' | 'small';
  currentPrice: number;
  priceHistory: PricePoint[];
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  averageBuyPrice: number;
  totalInvested: number;
}

export type TradeType = 'buy' | 'sell';

export interface Trade {
  id: string;
  symbol: string;
  name: string;
  type: TradeType;
  quantity: number;
  price: number; // snapshot at execution time
  total: number;
  timestamp: number;
}

export type TradeResult =
  | { success: true; trade: Trade }
  | { success: false; error: 'insufficient_funds' | 'insufficient_holdings' | 'invalid_quantity' };

export interface PortfolioSnapshot {
  holdings: Record<string, Holding>;
  trades: Trade[];
  cashBalance: number;
  startingBalance: number;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export type Goal = 'wealth_building' | 'learning' | 'retirement' | 'passive_income';
export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  name: string;
  goal: Goal | null;
  riskTolerance: RiskTolerance | null;
  experienceLevel: ExperienceLevel | null;
  hasCompletedOnboarding: boolean;
}

// ─── Learning ─────────────────────────────────────────────────────────────────

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ContentType = 'paragraph' | 'heading' | 'callout' | 'example';

export interface LessonContentBlock {
  type: ContentType;
  text: string;
}

export interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  readingTime: number; // minutes
  content: LessonContentBlock[];
  quiz: Quiz;
  simulatorLink?: {
    message: string;
    lesson: string;
  };
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  lessons: Lesson[];
}

// ─── Health Score ─────────────────────────────────────────────────────────────

export type HealthGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface HealthScore {
  total: number;
  grade: HealthGrade;
  summary: string;
  breakdown: {
    diversification: number; // 0–40
    riskMatch: number; // 0–35
    cashRatio: number; // 0–25
  };
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export type InsightCategory = 'risk' | 'mistake' | 'opportunity' | 'good';
export type InsightSeverity = 'info' | 'warning' | 'critical' | 'positive';

export interface Insight {
  id: string;
  category: InsightCategory;
  severity: InsightSeverity;
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
}

// ─── Explain My Action ────────────────────────────────────────────────────────

export type RiskLevel = 'low' | 'medium' | 'high';

export interface TradeExplanation {
  headline: string;
  riskLevel: RiskLevel;
  riskReason: string;
  explanation: string;
  warnings: string[];
  tip: string;
}

export interface PreTradeInsight {
  warning: string | null;
  riskLevel: RiskLevel;
}
