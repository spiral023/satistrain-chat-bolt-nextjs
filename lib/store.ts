import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Message, CustomerProfile, SessionMetrics, Scores, UserProfile, LeaderboardEntry, ChatHistory, Tip } from '@/types';
import { callCustomerAI } from '@/lib/openai';

interface ChatState {
  messages: Message[];
  currentCustomer: CustomerProfile | null;
  sessionMetrics: SessionMetrics;
  currentScores: Scores;
  isTyping: boolean;
  apiKey: string;
  isSessionActive: boolean;
  userProfile: UserProfile | null;
  leaderboard: LeaderboardEntry[];
  chatHistory: ChatHistory[];
  
  // Actions
  addMessage: (message: Message) => void;
  setCurrentCustomer: (customer: CustomerProfile) => void;
  setIsTyping: (typing: boolean) => void;
  setApiKey: (key: string) => void;
  startSession: () => void;
  endSession: () => void;
  updateScores: (scores: Scores) => void;
  updateMetrics: (metrics: Partial<SessionMetrics>) => void;
  clearChat: () => void;
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  setLeaderboard: (leaderboard: LeaderboardEntry[]) => void;
  setChatHistory: (history: ChatHistory[]) => void;
  addChatToHistory: (chat: ChatHistory) => void;
  updateLastCustomerMessage: (scores: Scores, tips: Tip[]) => void;
}

const initialMetrics: SessionMetrics = {
  startTime: null,
  totalTime: 0,
  activeTime: 0,
  messageCount: 0,
  averageResponseTime: 0,
  averageMessageLength: 0,
};

const initialScores: Scores = {
  empathy: 0,
  clarity: 0,
  helpfulness: 0,
  engagement: 0,
  professionalism: 0,
  overall: 0,
  trend: 'neutral',
};

// Mock data for development
const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user: {
      id: '1',
      firstName: 'Anna',
      lastName: 'Schmidt',
      username: 'aschmidt',
      createdAt: new Date(),
      totalSessions: 45,
      averageScore: 92,
      bestScore: 98,
      totalXP: 4500,
      level: 8,
    },
    weeklyScore: 94,
    weeklyXP: 850,
    sessionsThisWeek: 12,
    trend: 'up',
  },
  {
    rank: 2,
    user: {
      id: '2',
      firstName: 'Max',
      lastName: 'Müller',
      username: 'mmueller',
      createdAt: new Date(),
      totalSessions: 38,
      averageScore: 89,
      bestScore: 95,
      totalXP: 3800,
      level: 7,
    },
    weeklyScore: 91,
    weeklyXP: 720,
    sessionsThisWeek: 10,
    trend: 'up',
  },
  {
    rank: 3,
    user: {
      id: '3',
      firstName: 'Lisa',
      lastName: 'Weber',
      username: 'lweber',
      createdAt: new Date(),
      totalSessions: 42,
      averageScore: 87,
      bestScore: 93,
      totalXP: 4200,
      level: 7,
    },
    weeklyScore: 88,
    weeklyXP: 680,
    sessionsThisWeek: 9,
    trend: 'neutral',
  },
];

const mockChatHistory: ChatHistory[] = [
  {
    id: '1',
    userId: 'current-user',
    sessionDate: new Date(Date.now() - 86400000), // Yesterday
    customerProfile: {
      name: 'Anna Müller',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mood: 'frustrated',
      difficulty: 3,
      issue: 'Produktdefekt nach 2 Wochen',
      background: 'Berufstätige Mutter, wenig Zeit, erwartet schnelle Lösung',
    },
    finalScores: {
      empathy: 85,
      clarity: 78,
      helpfulness: 92,
      engagement: 88,
      professionalism: 95,
      overall: 85,
      trend: 'up',
    },
    messageCount: 8,
    duration: 420, // 7 minutes
    xpEarned: 85,
  },
  {
    id: '2',
    userId: 'current-user',
    sessionDate: new Date(Date.now() - 172800000), // 2 days ago
    customerProfile: {
      name: 'Thomas Weber',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      mood: 'angry',
      difficulty: 4,
      issue: 'Falsche Rechnung erhalten',
      background: 'Geschäftsmann, sehr direkt, fordert sofortige Klärung',
    },
    finalScores: {
      empathy: 72,
      clarity: 88,
      helpfulness: 76,
      engagement: 70,
      professionalism: 81,
      overall: 79,
      trend: 'neutral',
    },
    messageCount: 12,
    duration: 680, // 11 minutes
    xpEarned: 79,
  },
];

export const useChatStore = create<ChatState>()(
  subscribeWithSelector((set, get) => ({
    messages: [],
    currentCustomer: null,
    sessionMetrics: initialMetrics,
    currentScores: initialScores,
    isTyping: false,
    apiKey: '',
    isSessionActive: false,
    userProfile: null,
    leaderboard: mockLeaderboard,
    chatHistory: mockChatHistory,

    addMessage: (message) => {
      set((state) => ({
        messages: [...state.messages, message],
        sessionMetrics: {
          ...state.sessionMetrics,
          messageCount: state.sessionMetrics.messageCount + 1,
        },
      }));
    },

    setCurrentCustomer: (customer) => {
      set({ currentCustomer: customer });
    },

    setIsTyping: (typing) => {
      set({ isTyping: typing });
    },

    setApiKey: (key) => {
      set({ apiKey: key });
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('openai_api_key', key);
      }
    },

    startSession: async () => {
      const { currentCustomer, apiKey, addMessage, setIsTyping } = get();

      set((state) => ({
        isSessionActive: true,
        sessionMetrics: {
          ...initialMetrics,
          startTime: new Date(),
        },
        currentScores: initialScores,
        messages: [], // Start with an empty message array
      }));

      if (currentCustomer && apiKey) {
        setIsTyping(true);
        try {
          const initialCustomerPrompt = `Schreibe eine erste, individuelle Nachricht basierend auf diesem Anliegen: "${currentCustomer.issue}". Die Nachricht sollte natürlich klingen und das Anliegen des Kunden proaktiv vortragen.`;
          const customerReply = await callCustomerAI([{ role: 'user', content: initialCustomerPrompt }], apiKey, currentCustomer);

          const customerMessage = {
            id: (Date.now() + 1).toString(),
            content: customerReply,
            role: 'customer' as const,
            timestamp: new Date(),
          };
          addMessage(customerMessage);
        } catch (error) {
          console.error('Error generating initial customer message:', error);
          // Optionally add an error message to the chat
          addMessage({
            id: Date.now().toString(),
            content: 'Entschuldigung, ich konnte die erste Nachricht des Kunden nicht generieren.',
            role: 'customer' as const,
            timestamp: new Date(),
          });
        } finally {
          setIsTyping(false);
        }
      }
    },

    endSession: () => {
      const state = get();
      if (state.isSessionActive && state.sessionMetrics.startTime) {
        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - state.sessionMetrics.startTime.getTime()) / 1000);
        const xpEarned = state.currentScores.overall;
        
        // Add to chat history
        const newHistoryEntry: ChatHistory = {
          id: Date.now().toString(),
          userId: state.userProfile?.id || 'current-user',
          sessionDate: endTime,
          customerProfile: state.currentCustomer!,
          finalScores: state.currentScores,
          messageCount: state.messages.length,
          duration,
          xpEarned,
        };
        
        set((prevState) => ({
          isSessionActive: false,
          chatHistory: [newHistoryEntry, ...prevState.chatHistory],
        }));
      } else {
        set({ isSessionActive: false });
      }
    },

    updateScores: (scores) => {
      set({ currentScores: scores });
    },

    updateMetrics: (metrics) => {
      set((state) => ({
        sessionMetrics: { ...state.sessionMetrics, ...metrics },
      }));
    },

    clearChat: () => {
      set({
        messages: [],
        currentScores: initialScores,
        sessionMetrics: initialMetrics,
      });
    },

    setUserProfile: (profile) => {
      set({ userProfile: profile });
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_profile', JSON.stringify(profile));
      }
    },

    updateUserProfile: (updates) => {
      set((state) => {
        const updatedProfile = state.userProfile ? { ...state.userProfile, ...updates } : null;
        if (updatedProfile && typeof window !== 'undefined') {
          localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
        }
        return { userProfile: updatedProfile };
      });
    },

    setLeaderboard: (leaderboard) => {
      set({ leaderboard });
    },

    setChatHistory: (history) => {
      set({ chatHistory: history });
    },

    addChatToHistory: (chat) => {
      set((state) => ({
        chatHistory: [chat, ...state.chatHistory],
      }));
    },

    updateLastCustomerMessage: (scores, tips) => {
      set((state) => {
        const updatedMessages = state.messages.map((msg, index, arr) => {
          if (index === arr.length - 1 && msg.role === 'customer') {
            return { ...msg, scores, tips };
          }
          return msg;
        });
        return { messages: updatedMessages };
      });
    },
  }))
);
