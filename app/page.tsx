"use client";

import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { SidebarTabs } from '@/components/sidebar/sidebar-tabs';
import { SessionReportDialog } from '@/components/session/session-report-dialog';
import { useChatStore } from '@/lib/store';
import { getRandomCustomerProfile } from '@/lib/customer-profiles';

export default function Home() {
  const { setCurrentCustomer, setApiKey, setUserProfile } = useChatStore();

  useEffect(() => {
    // Set default customer profile
    setCurrentCustomer(getRandomCustomerProfile());
    
    // Load API key from session storage
    const savedApiKey = sessionStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    // Load user profile from localStorage
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
  }, [setCurrentCustomer, setApiKey, setUserProfile]);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatHeader />
          <ChatMessages />
          <ChatInput />
        </div>
        
        {/* Sidebar */}
        <div className="w-80 border-l bg-card/50 p-4 overflow-y-auto">
          <SidebarTabs />
        </div>
      </div>
      <SessionReportDialog />
    </div>
  );
}
