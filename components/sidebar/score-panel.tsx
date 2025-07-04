"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/lib/store';
import { TrendingUp, TrendingDown, Minus, Heart, Eye, HelpCircle } from 'lucide-react';

export function ScorePanel() {
  const { currentScores } = useChatStore();

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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const scores = [
    {
      key: 'empathy',
      label: 'Empathie',
      value: currentScores.empathy,
      icon: <Heart className="w-4 h-4" />,
      description: 'Gefühle erkennen und spiegeln',
    },
    {
      key: 'clarity',
      label: 'Klarheit',
      value: currentScores.clarity,
      icon: <Eye className="w-4 h-4" />,
      description: 'Verständlich kommunizieren',
    },
    {
      key: 'helpfulness',
      label: 'Hilfsbereitschaft',
      value: currentScores.helpfulness,
      icon: <HelpCircle className="w-4 h-4" />,
      description: 'Lösungen anbieten',
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span>Gesamtbewertung</span>
            {getTrendIcon(currentScores.trend)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-2xl font-bold ${getScoreColor(currentScores.overall)}`}>
              {currentScores.overall}%
            </span>
            <Badge variant={currentScores.overall >= 80 ? 'default' : 'secondary'}>
              {currentScores.overall >= 80 ? 'Sehr gut' : 
               currentScores.overall >= 60 ? 'Gut' : 'Verbesserungsbedarf'}
            </Badge>
          </div>
          <Progress value={currentScores.overall} className="h-2" />
        </CardContent>
      </Card>

      <div className="space-y-3">
        {scores.map((score) => (
          <Card key={score.key} className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {score.icon}
                <span className="font-medium text-sm">{score.label}</span>
              </div>
              <span className={`font-bold ${getScoreColor(score.value)}`}>
                {score.value}%
              </span>
            </div>
            <Progress value={score.value} className="h-1.5 mb-2" />
            <p className="text-xs text-muted-foreground">{score.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}