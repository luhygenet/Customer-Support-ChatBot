'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Chatbot from '@/app/components/chatbot';
import About from '@/app/components/about';
// Removed extra sections to match requested UI

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('chatbot');

  const icons = useMemo(
    () => ({
      plus: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
      info: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
    }),
    [],
  );

  const navigationItems = [
    { id: 'chatbot', label: 'New Chat', icon: icons.plus },
    { id: 'about', label: 'About', icon: icons.info },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#eef3fb] text-sidebar-foreground flex flex-col shadow-md">
        <div className="p-6 border-b border-[#d1d5dc] flex items-center gap-3">
          <Image src="/chat.png" alt="Logo" width={36} height={36} />
          <div>
            <h1 className="text-xl font-bold text-accent">ChatBot</h1>
            <p className="text-xs text-sidebar-foreground/70 mt-1">Customer Service Agent</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg transition-colors duration-150 ${
                  activeTab === item.id
                    ? 'bg-[#e6edf8] text-[#0f172a] font-semibold'
                    : 'text-[#0f172a] hover:bg-[#dfe7f7] hover:text-[#0c1224]'
                }`}
              >
                <span className="flex-shrink-0" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/60 text-center">
            Machine Intelligence Project
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="h-full">
          {activeTab === 'chatbot' && <Chatbot />}
          {activeTab === 'about' && <About />}
        </div>
      </main>
    </div>
  );
}
