"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScorePanel } from './score-panel';
import { TipsPanel } from './tips-panel';
import { ProgressPanel } from './progress-panel';
import { LeaderboardPanel } from './leaderboard-panel';
import { HistoryPanel } from './history-panel';
import { BarChart3, Lightbulb, TrendingUp, Trophy, History } from 'lucide-react';

export function SidebarTabs() {
  return (
    <Tabs defaultValue="scores" className="flex-1 flex flex-col">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="scores" className="text-xs">
          <BarChart3 className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="tips" className="text-xs">
          <Lightbulb className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="progress" className="text-xs">
          <TrendingUp className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="leaderboard" className="text-xs">
          <Trophy className="w-4 h-4" />
        </TabsTrigger>
        <TabsTrigger value="history" className="text-xs">
          <History className="w-4 h-4" />
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="scores" className="flex-1 mt-4">
        <ScorePanel />
      </TabsContent>
      
      <TabsContent value="tips" className="flex-1 mt-4">
        <TipsPanel />
      </TabsContent>
      
      <TabsContent value="progress" className="flex-1 mt-4">
        <ProgressPanel />
      </TabsContent>
      
      <TabsContent value="leaderboard" className="flex-1 mt-4">
        <LeaderboardPanel />
      </TabsContent>
      
      <TabsContent value="history" className="flex-1 mt-4">
        <HistoryPanel />
      </TabsContent>
    </Tabs>
  );
}
