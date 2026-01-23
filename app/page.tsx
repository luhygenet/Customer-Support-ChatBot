'use client';

import React, { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import Chatbot from '@/app/components/chatbot';
import About from '@/app/components/about';
import SystemArchitecture from '@/app/components/system-architecture';
import KnowledgeBase from '@/app/components/knowledge-base';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('chatbot');

  const navigationItems = [
    { id: 'chatbot', label: 'Chatbot', icon: '💬' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
    { id: 'architecture', label: 'System Architecture', icon: '🏗️' },
    { id: 'knowledge', label: 'Knowledge Base', icon: '📚' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border shadow-lg">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-accent">AI Chatbot</h1>
          <p className="text-xs text-sidebar-foreground/70 mt-1">Customer Service Agent</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gray-500 foreground font-semibold'
                    : 'text-sidebar-foreground hover:bg-sidebar-border/50 '
                }`}
              >
                <span className="mr-3">{item.icon}</span>
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
          {activeTab === 'architecture' && <SystemArchitecture />}
          {activeTab === 'knowledge' && <KnowledgeBase />}
        </div>
      </main>
    </div>
  );
}
