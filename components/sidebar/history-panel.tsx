"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/lib/store';
import { History, Clock, MessageCircle, Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

export function HistoryPanel() {
  const { chatHistory, setCurrentCustomer, clearChat } = useChatStore();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-green-500';
      case 'neutral': return 'bg-yellow-500';
      case 'frustrated': return 'bg-orange-500';
      case 'angry': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleReplaySession = (historyItem: any) => {
    setCurrentCustomer(historyItem.customerProfile);
    clearChat();
  };

  if (chatHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8">
        <History className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">
          Noch keine Chat-Verläufe vorhanden.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Starten Sie eine Session, um Ihren Fortschritt zu verfolgen.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <History className="w-5 h-5" />
            <span>Chat-Verlauf</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Ihre letzten {chatHistory.length} Trainings-Sessions
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {chatHistory.map((item) => (
          <Card key={item.id} className="p-3 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              {/* Customer Info */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.customerProfile.avatar} alt={item.customerProfile.name} />
                  <AvatarFallback className="text-xs">
                    {item.customerProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium truncate">{item.customerProfile.name}</p>
                    <div className={`w-2 h-2 rounded-full ${getMoodColor(item.customerProfile.mood)}`} />
                    <Badge variant="outline" className="text-xs">
                      Level {item.customerProfile.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.customerProfile.issue}
                  </p>
                </div>
              </div>

              {/* Session Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span>{formatDuration(item.duration)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-3 h-3 text-muted-foreground" />
                  <span>{item.messageCount} Nachrichten</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-muted-foreground" />
                  <span>{item.xpEarned} XP</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(item.sessionDate, { addSuffix: true, locale: de })}
                  </span>
                </div>
              </div>

              {/* Scores */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant={getScoreBadgeVariant(item.finalScores.overall) as any} className="text-xs">
                    {item.finalScores.overall}%
                  </Badge>
                  {getTrendIcon(item.finalScores.trend)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handleReplaySession(item)}
                >
                  Wiederholen
                </Button>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <p className={`font-bold ${getScoreColor(item.finalScores.empathy)}`}>
                    {item.finalScores.empathy}%
                  </p>
                  <p className="text-muted-foreground">Empathie</p>
                </div>
                <div className="text-center">
                  <p className={`font-bold ${getScoreColor(item.finalScores.clarity)}`}>
                    {item.finalScores.clarity}%
                  </p>
                  <p className="text-muted-foreground">Klarheit</p>
                </div>
                <div className="text-center">
                  <p className={`font-bold ${getScoreColor(item.finalScores.helpfulness)}`}>
                    {item.finalScores.helpfulness}%
                  </p>
                  <p className="text-muted-foreground">Hilfe</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}