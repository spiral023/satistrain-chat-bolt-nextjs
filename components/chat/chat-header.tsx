"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChatStore } from '@/lib/store';
import { Play, Square, RotateCcw, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ChatHeader() {
  const { 
    currentCustomer, 
    isSessionActive, 
    sessionMetrics, 
    startSession, 
    endSession,
    clearChat 
  } = useChatStore();
  
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isSessionActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - sessionMetrics.startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionActive, sessionMetrics.startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  const getMoodText = (mood: string) => {
    switch (mood) {
      case 'happy': return 'Zufrieden';
      case 'neutral': return 'Neutral';
      case 'frustrated': return 'Frustriert';
      case 'angry': return 'Verärgert';
      default: return 'Unbekannt';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-card border-b">
      <div className="flex items-center space-x-4">
        {currentCustomer && (
          <>
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentCustomer.avatar} alt={currentCustomer.name} />
              <AvatarFallback>
                {currentCustomer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="font-semibold text-sm">{currentCustomer.name}</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getMoodColor(currentCustomer.mood)}`} />
                <span className="text-xs text-muted-foreground">
                  {getMoodText(currentCustomer.mood)}
                </span>
                <Badge variant="secondary" className="text-xs">
                  Level {currentCustomer.difficulty}
                </Badge>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {isSessionActive && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
            <span className="text-sm font-mono text-muted-foreground">
              {formatTime(elapsedTime)}
            </span>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          {!isSessionActive ? (
            <Button size="sm" onClick={startSession} className="text-xs">
              <Play className="w-3 h-3 mr-1" />
              Start
            </Button>
          ) : (
            <Button size="sm" variant="destructive" onClick={endSession} className="text-xs">
              <Square className="w-3 h-3 mr-1" />
              Stop
            </Button>
          )}
          
          <Button size="sm" variant="outline" onClick={clearChat} className="text-xs">
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
          
          <Button size="sm" variant="ghost" className="text-xs">
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}