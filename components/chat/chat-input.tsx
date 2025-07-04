"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatStore } from '@/lib/store';
import { callCustomerAI, callAnalysisAI } from '@/lib/openai';
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
      updateScores,
      updateLastCustomerMessage
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
      // Prepare conversation history for Customer AI
      const customerConversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role === 'customer' ? 'assistant' : msg.role, // Customer AI sees previous customer messages as assistant
        content: msg.content,
      }));
      customerConversationHistory.push({
        role: 'user',
        content: message.trim(), // User's current message
      });

      // Call Customer AI
      const customerReply = await callCustomerAI(customerConversationHistory, apiKey, currentCustomer);

      const customerMessage = {
        id: (Date.now() + 1).toString(),
        content: customerReply,
        role: 'customer' as const,
        timestamp: new Date(),
      };

      // Add customer's reply to messages immediately
      addMessage(customerMessage);

      // Prepare conversation history for Analysis AI
      // This should include the user's last message and the customer's reply
      const analysisConversationHistory = [
        { role: 'user' as const, content: userMessage.content },
        { role: 'assistant' as const, content: customerMessage.content },
      ];

      // Call Analysis AI
      const { scores, tips } = await callAnalysisAI(analysisConversationHistory, apiKey);

      // Update the last customer message with scores and tips
      // This requires a slight modification to how messages are stored or updated
      // For now, we'll add a new message with scores/tips, or update the last one if possible.
      // A better approach might be to update the existing customerMessage in the store.
      // For simplicity, let's assume we update the last message added.
      // This part needs careful consideration of Zustand's update patterns.
      // For now, I'll add a new message with the scores/tips, which might not be ideal for UI.
      // A more robust solution would be to update the existing customer message.

      // To update the last message, we need a new action in useChatStore or modify addMessage.
      // For now, I'll add a new message with the scores and tips.
      // This will result in two "customer" messages in quick succession, one with content, one with scores/tips.
      // This is a temporary solution for the split AI. A better UI integration would be to update the existing message.

      // Let's refine this: The scores and tips should be associated with the *user's* last message,
      // as they are a critique of the user's performance in response to the customer.
      // So, the scores/tips should be added to the userMessage, not the customerMessage.

      // Re-thinking: The scores and tips are for the *user's* performance in the *entire interaction*.
      // They should be displayed after the customer's reply, as a summary of the user's last turn.
      // The current structure adds scores/tips to the AI (customer) message.
      // Let's stick to the original structure for now, but understand it's a score *of the user's reply*.

      // The scores and tips are for the user's last message, but they are returned by the AI.
      // So, they should be attached to the AI's response that follows the user's message.
      // The current structure in `lib/store.ts` and `types/index.ts` supports this by having `scores` and `tips` on `Message`.

      updateScores(scores); // Update overall scores for the score panel
      updateLastCustomerMessage(scores, tips); // Update the last customer message with scores and tips
      setIsTyping(false);

    } catch (error) {
      console.error('Error in chat input:', error);
      toast.error('Fehler bei der KI-Kommunikation. Bitte versuchen Sie es erneut.');
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
