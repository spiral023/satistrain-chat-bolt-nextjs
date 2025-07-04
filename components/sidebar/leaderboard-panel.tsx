"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChatStore } from '@/lib/store';
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal, Award } from 'lucide-react';

export function LeaderboardPanel() {
  const { leaderboard, userProfile } = useChatStore();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank <= 3) return 'default';
    if (rank <= 10) return 'secondary';
    return 'outline';
  };

  const isCurrentUser = (userId: string) => {
    return userProfile?.id === userId;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>Wochenrangliste</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Basierend auf den Leistungen dieser Woche
          </p>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {leaderboard.map((entry) => (
          <Card 
            key={entry.user.id} 
            className={`p-3 transition-colors ${
              isCurrentUser(entry.user.id) ? 'bg-primary/5 border-primary/20' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {getRankIcon(entry.rank)}
                <Badge variant={getRankBadgeVariant(entry.rank) as any} className="text-xs">
                  #{entry.rank}
                </Badge>
              </div>
              
              <Avatar className="h-8 w-8">
                <AvatarImage src={entry.user.avatar} alt={entry.user.firstName} />
                <AvatarFallback className="text-xs">
                  {entry.user.firstName[0]}{entry.user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium truncate">
                    {isCurrentUser(entry.user.id) ? 'Du' : entry.user.username}
                  </p>
                  {getTrendIcon(entry.trend)}
                </div>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <span>{entry.weeklyScore}% Ø</span>
                  <span>{entry.weeklyXP} XP</span>
                  <span>{entry.sessionsThisWeek} Sessions</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {userProfile && (
        <Card className="bg-muted/50">
          <CardContent className="p-3">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Deine Statistiken</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="font-bold">{userProfile.totalSessions}</p>
                  <p className="text-muted-foreground">Sessions</p>
                </div>
                <div>
                  <p className="font-bold">{userProfile.averageScore}%</p>
                  <p className="text-muted-foreground">Ø Score</p>
                </div>
                <div>
                  <p className="font-bold">Lv. {userProfile.level}</p>
                  <p className="text-muted-foreground">Level</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}