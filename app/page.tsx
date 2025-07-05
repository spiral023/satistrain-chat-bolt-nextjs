"use client";

import dynamic from 'next/dynamic';

const Header = dynamic(() => import('@/components/layout/header').then(mod => mod.Header), { ssr: false });
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { SidebarTabs } from '@/components/sidebar/sidebar-tabs';
import { SessionReportDialog } from '@/components/session/session-report-dialog';
import { ExplanationDialog } from '@/components/explanation/explanation-dialog';
import { ClientInit } from '@/components/setup/client-init';

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <ClientInit />
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
      <ExplanationDialog />
    </div>
  );
}
