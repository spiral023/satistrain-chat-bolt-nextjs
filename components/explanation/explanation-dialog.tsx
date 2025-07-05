"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Zap, Target } from "lucide-react";

export function ExplanationDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setIsOpen(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Willkommen bei SatisTrain Chat!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-white">
          <p className="text-lg">
            Diese interaktive Trainingsplattform hilft Ihnen, Ihre Fähigkeiten im Kundenservice zu meistern.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <Rocket className="h-10 w-10 text-blue-500 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Realistische Szenarien</h3>
              <p className="text-sm">
                Üben Sie mit einem KI-gesteuerten Chatbot, der typische Kundenanfragen simuliert.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <Zap className="h-10 w-10 text-green-500 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Sofortiges Feedback</h3>
              <p className="text-sm">
                Erhalten Sie nach jeder Konversation eine detaillierte Auswertung Ihrer Leistung.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 border rounded-lg">
              <Target className="h-10 w-10 text-red-500 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Messen Sie Ihren Fortschritt</h3>
              <p className="text-sm">
                Verfolgen Sie Ihre Entwicklung und entdecken Sie Ihre Stärken und Schwächen.
              </p>
            </div>
          </div>
          <p className="text-center text-md font-medium">
            Sind Sie bereit, Ihre Kommunikationsfähigkeiten auf das nächste Level zu heben?
          </p>
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={handleClose} className="w-full">
            Training starten
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
