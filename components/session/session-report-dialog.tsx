"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/lib/store";
import { BarChart, Star, Lightbulb, MessageSquare, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SessionReportDialog() {
  const { isReportDialogOpen, setReportDialogOpen, sessionReportData } = useChatStore();

  if (!sessionReportData) {
    return null;
  }

  const { overview, rating, tips } = sessionReportData;

  return (
    <Dialog open={isReportDialogOpen} onOpenChange={setReportDialogOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Session Report
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-4">
          {/* Session Overview */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-primary" />
              Session Overview
            </h3>
            <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-bold">{overview.duration}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Messages</span>
                <span className="font-bold">{overview.messageCount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Agent Score</span>
                <span className="font-bold">{overview.agentScore}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Customer Mood</span>
                <Badge variant={overview.customerMood === 'happy' ? 'default' : 'destructive'}>
                  {overview.customerMood}
                </Badge>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-500" />
              Rating
            </h3>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < rating.score ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic">"{rating.comment}"</p>
          </div>

          {/* Tips */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-green-500" />
              Generated Tips
            </h3>
            <ul className="space-y-2">
              {tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-1 text-green-500 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setReportDialogOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
