"use client";

import { Button } from '@/components/ui/button';
import { ApiKeyDialog } from '@/components/setup/api-key-dialog';
import { CustomerSelector } from '@/components/setup/customer-selector';
import { ProfileDialog } from '@/components/profile/profile-dialog';
import { useChatStore } from '@/lib/store';
import { useTheme } from 'next-themes';
import { Moon, Sun, MessageSquare } from 'lucide-react';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { apiKey, userProfile } = useChatStore();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">SatisTrain Chat</span>
        </div>
        
        <div className="flex items-center space-x-4 ml-auto">
          <CustomerSelector />
          <ApiKeyDialog />
          <ProfileDialog />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}