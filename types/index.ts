export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'customer';
  timestamp: Date;
  scores?: Scores;
  tips?: Tip[];
}

export interface Scores {
  empathy: number;
  clarity: number;
  helpfulness: number;
  engagement: number;
  professionalism: number;
  overall: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface Tip {
  importance: 'high' | 'medium' | 'low';
  text: string;
  example?: string;
}

export interface CustomerProfile {
  name: string;
  avatar: string;
  mood: 'happy' | 'neutral' | 'frustrated' | 'angry';
  difficulty: 1 | 2 | 3 | 4 | 5;
  issue: string;
  background: string;
}

export interface SessionMetrics {
  startTime: Date | null;
  totalTime: number;
  activeTime: number;
  messageCount: number;
  averageResponseTime: number;
  averageMessageLength: number;
}

export interface OpenAIResponse {
  ai_reply: string;
  scores: Scores;
  tips: Tip[];
}

export interface TrainingSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  customerProfile: CustomerProfile;
  messages: Message[];
  finalScores: Scores;
  metrics: SessionMetrics;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  avatar?: string;
  createdAt: Date;
  totalSessions: number;
  averageScore: number;
  bestScore: number;
  totalXP: number;
  level: number;
}

export interface LeaderboardEntry {
  rank: number;
  user: UserProfile;
  weeklyScore: number;
  weeklyXP: number;
  sessionsThisWeek: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface ChatHistory {
  id: string;
  userId: string;
  sessionDate: Date;
  customerProfile: CustomerProfile;
  finalScores: Scores;
  messageCount: number;
  duration: number;
  xpEarned: number;
}

export interface SessionReportData {
  overview: {
    duration: string;
    messageCount: number;
    agentScore: number;
    customerMood: 'happy' | 'neutral' | 'frustrated' | 'angry';
  };
  rating: {
    score: number;
    comment: string;
  };
  tips: string[];
}
