"use client";

import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/lib/store';
import { Bot, User, Atom as Customer, Clipboard as Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';

export function ChatMessages() {
  const { messages, currentCustomer, isTyping } = useChatStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(id);
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  useEffect(() => {
    const scrollViewport = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    );
    if (scrollViewport) {
      scrollViewport.scrollTop = scrollViewport.scrollHeight;
    }
  }, [messages, isTyping]);

  const getMessageSide = (role: string) => {
    return role === 'user' ? 'justify-end' : 'justify-start';
  };

  const getMessageStyle = (role: string) => {
    switch (role) {
      case 'user':
        return 'bg-primary text-primary-foreground';
      case 'customer':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getMessageIcon = (role: string) => {
    switch (role) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'customer':
        return <Customer className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${getMessageSide(message.role)} animate-slide-in-${
              message.role === 'user' ? 'right' : 'left'
            }`}
          >
            <div className="flex items-end space-x-2 max-w-[75%]">
              {message.role !== 'user' && (
                <div className="flex-shrink-0">
                  {message.role === 'customer' && currentCustomer ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentCustomer.avatar} alt={currentCustomer.name} />
                      <AvatarFallback>
                        {currentCustomer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                      {getMessageIcon(message.role)}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex flex-col space-y-1">
                <div className={`group relative rounded-lg px-3 py-2 ${getMessageStyle(message.role)}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(message.content, message.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{formatTime(message.timestamp)}</span>
                  {copiedMessageId === message.id && (
                    <span className="text-xs text-green-500">Copied!</span>
                  )}
                  {message.scores && (
                    <Badge variant="outline" className="text-xs">
                      {message.scores.overall}%
                    </Badge>
                  )}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    {getMessageIcon(message.role)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start animate-slide-in-left">
            <div className="flex items-end space-x-2 max-w-[75%]">
              <div className="flex-shrink-0">
                {currentCustomer ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentCustomer.avatar} alt={currentCustomer.name} />
                    <AvatarFallback>
                      {currentCustomer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                    <Customer className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <div className="bg-muted rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full typing-dot"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
