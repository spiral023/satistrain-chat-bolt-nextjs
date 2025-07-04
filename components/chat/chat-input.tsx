"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatStore } from '@/lib/store';
import { callOpenAI } from '@/lib/openai';
import { Send, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

export function ChatInput() {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    addMessage, 
    setIsTyping, 
    apiKey, 
    currentCustomer, 
    isSessionActive,
    messages,
    updateScores 
  } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isSessionActive) return;

    if (!apiKey) {
      toast.error('Bitte OpenAI API Key in den Einstellungen hinterlegen');
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      content: message.trim(),
      role: 'user' as const,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setMessage('');
    setIsTyping(true);

    try {
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role === 'customer' ? 'assistant' : msg.role,
        content: msg.content,
      }));

      conversationHistory.push({
        role: 'user',
        content: message.trim(),
      });

      const response = await callOpenAI(conversationHistory, apiKey, currentCustomer);
      
      setTimeout(() => {
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          content: response.ai_reply,
          role: 'customer' as const,
          timestamp: new Date(),
          scores: response.scores,
          tips: response.tips,
        };

        addMessage(aiMessage);
        updateScores(response.scores);
        setIsTyping(false);
      }, 1000 + Math.random() * 2000);

    } catch (error) {
      console.error('Error calling OpenAI:', error);
      toast.error('Fehler bei der KI-Antwort. Bitte versuchen Sie es erneut.');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Spracherkennung wird von diesem Browser nicht unterstützt');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'de-DE';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(prev => prev + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error('Spracherkennung fehlgeschlagen');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="border-t p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isSessionActive ? "Ihre Antwort an den Kunden..." : "Starten Sie eine Session um zu chatten"}
            className="min-h-[60px] max-h-[120px] resize-none"
            disabled={!isSessionActive}
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={toggleListening}
            disabled={!isSessionActive}
            className={isListening ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || !isSessionActive}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}