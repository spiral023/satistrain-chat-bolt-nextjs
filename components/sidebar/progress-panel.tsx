"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useChatStore } from '@/lib/store';
import { Clock, MessageCircle, Target, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ProgressPanel() {
  const { sessionMetrics, messages, isSessionActive } = useChatStore();
  const [currentTime, setCurrentTime] = useState(new Date(0));

  useEffect(() => {
    // Set the actual current time after component mounts
    setCurrentTime(new Date());
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getSessionDuration = () => {
    if (!isSessionActive || !sessionMetrics.startTime) return 0;
    return Math.floor((currentTime.getTime() - sessionMetrics.startTime.getTime()) / 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAverageResponseTime = () => {
    if (messages.length < 2) return 0;
    // Simple calculation - in real app, you'd track actual response times
    return Math.floor(Math.random() * 30) + 10; // 10-40 seconds
  };

  const getAverageMessageLength = () => {
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) return 0;
    
    const totalLength = userMessages.reduce((sum, msg) => sum + msg.content.length, 0);
    return Math.floor(totalLength / userMessages.length);
  };

  const metrics = [
    {
      label: 'Session-Dauer',
      value: formatTime(getSessionDuration()),
      icon: <Clock className="w-4 h-4" />,
      color: 'text-blue-500',
    },
    {
      label: 'Nachrichten',
      value: messages.length.toString(),
      icon: <MessageCircle className="w-4 h-4" />,
      color: 'text-green-500',
    },
    {
      label: 'Ø Antwortzeit',
      value: `${getAverageResponseTime()}s`,
      icon: <Timer className="w-4 h-4" />,
      color: 'text-orange-500',
    },
    {
      label: 'Ø Nachrichtenlänge',
      value: `${getAverageMessageLength()} Zeichen`,
      icon: <Target className="w-4 h-4" />,
      color: 'text-purple-500',
    },
  ];

  const getPerformanceBadge = () => {
    const avgResponseTime = getAverageResponseTime();
    const messageLength = getAverageMessageLength();
    
    if (avgResponseTime <= 20 && messageLength >= 50 && messageLength <= 200) {
      return { label: 'Optimal', variant: 'default' };
    } else if (avgResponseTime > 45) {
      return { label: 'Zu langsam', variant: 'destructive' };
    } else if (messageLength > 250) {
      return { label: 'Zu lang', variant: 'secondary' };
    } else if (messageLength < 30) {
      return { label: 'Zu kurz', variant: 'secondary' };
    }
    return { label: 'Gut', variant: 'default' };
  };

  const performanceBadge = getPerformanceBadge();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span>Session-Übersicht</span>
            {isSessionActive && (
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Performance</span>
            <Badge variant={performanceBadge.variant as any}>
              {performanceBadge.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-center space-x-2 mb-1">
              <span className={metric.color}>{metric.icon}</span>
              <span className="text-xs text-muted-foreground">{metric.label}</span>
            </div>
            <p className="font-semibold text-sm">{metric.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Kommunikationsziele</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Empathie zeigen</span>
              <span>7/10</span>
            </div>
            <Progress value={70} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Klar kommunizieren</span>
              <span>8/10</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Lösungen anbieten</span>
              <span>6/10</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}