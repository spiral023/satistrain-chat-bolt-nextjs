"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useChatStore } from '@/lib/store';
import { AlertTriangle, Info, CheckCircle, Lightbulb } from 'lucide-react';

export function TipsPanel() {
  const { messages } = useChatStore();

  // Get tips from the most recent messages
  const recentTips = messages
    .slice(-5)
    .flatMap(msg => msg.tips || [])
    .filter(tip => tip.text.length > 0);

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Info className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Lightbulb className="w-4 h-4 text-blue-500" />;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'Wichtig';
      case 'medium':
        return 'Mittel';
      case 'low':
        return 'Niedrig';
      default:
        return 'Info';
    }
  };

  if (recentTips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8">
        <Lightbulb className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">
          Beginnen Sie eine Konversation, um personalisierte Tipps zu erhalten.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Lightbulb className="w-5 h-5" />
            <span>Aktuelle Tipps</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Basierend auf Ihren letzten Antworten
          </p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {recentTips.map((tip, index) => (
          <Alert key={index} className="p-3">
            <div className="flex items-start space-x-3">
              {getImportanceIcon(tip.importance)}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={getImportanceColor(tip.importance) as any} className="text-xs">
                    {getImportanceLabel(tip.importance)}
                  </Badge>
                </div>
                <AlertDescription className="text-sm">
                  {tip.text}
                </AlertDescription>
                {tip.example && (
                  <div className="mt-2 p-2 bg-muted rounded-md">
                    <p className="text-xs text-muted-foreground mb-1">Beispiel:</p>
                    <p className="text-xs italic">&quot;{tip.example}&quot;</p>
                  </div>
                )}
              </div>
            </div>
          </Alert>
        ))}
      </div>
    </div>
  );
}
