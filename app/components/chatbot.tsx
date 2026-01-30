"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Input } from "@/app/components/ui/input";
import { ScrollArea } from "@/app/components/ui/scroll-area";

type UserMessage = {
  type: "user";
  text: string;
};

type BotMessage = {
  type: "bot";
  text: string;
  reasoning?: string[];
};

type Message = UserMessage | BotMessage;

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const hasMessages = messages.length > 0;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const sampleResponses = [
    {
      query: "What is your return policy?",
      response:
        "Our return policy allows returns within 30 days of purchase with original receipt and product in original condition. Refunds are processed within 5-7 business days.",
      reasoning: [
        "Applied Rule 1: Customer Return Policy",
        "Checked Policy Database: 30-day return window",
        "Verified: Original condition requirement",
        "Applied Policy: Refund processing timeline",
      ],
    },
    {
      query: "How do I track my order?",
      response:
        "You can track your order using the tracking number sent to your email after shipment. Visit our tracking portal and enter your tracking number to see real-time updates.",
      reasoning: [
        "Applied Rule 2: Order Tracking Policy",
        "Retrieved: Customer email record",
        "Accessed: Tracking number from order database",
        "Applied Action: Direct to tracking portal",
      ],
    },
    {
      query: "Can I change my order after placing it?",
      response:
        "Order modifications are possible only within 1 hour of placement if the order has not yet been processed. Please contact support immediately with your order number.",
      reasoning: [
        "Applied Rule 3: Order Modification Policy",
        "Checked: Order processing status",
        "Verified: Time window constraint (1 hour)",
        "Applied Action: Direct to support for assistance",
      ],
    },
  ];

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: Message = {
      type: "user",
      text: userInput,
    };
    setMessages([...messages, userMessage]);

    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userInput }),
      });

      const data = await res.json();

      const botMessage: Message = {
        type: "bot",
        text: data.answer,
        reasoning: data.reasoning,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.log(err);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Something went wrong with the bot trying to reply",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center bg-gradient-to-br from-background to-background/80 p-8 ${
        hasMessages ? "justify-center border border-[#d1d5dc] shadow-md" : "justify-center"
      }`}
    >
      {/* Greeting Section */}
      {!hasMessages && (
        <div className="text-center flex flex-col items-center gap-2 mb-6 -mt-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary">{greeting}</h2>
          <p className="text-3xl md:text-4xl font-semibold mt-1">
            <span className="text-primary">How Can I </span>
            <span className="text-[#7A06FF]">Assist You Today?</span>
          </p>
        </div>
      )}

      {/* Chat Area */}
      <div className={`w-full max-w-3xl flex flex-col ${hasMessages ? "mt-1" : "gap-6 -mt-6"}`}>
        {hasMessages ? (
          <div className="relative flex flex-col h-[94vh] md:h-[92vh] rounded-2xl bg-transparent border border-transparent shadow-none overflow-hidden">
            <ScrollArea className="flex-1 overflow-hidden">
              <div className="px-3 py-4 pb-24 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className="flex w-full">
                    <div
                      className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm ${
                        msg.type === "user"
                          ? "ml-auto bg-[#f4edff] text-[#0f172a]"
                          : "mr-auto bg-white text-[#0f172a] border border-[#eef0f5]"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      {msg.type === "bot" && msg.reasoning?.length ? (
                        <details className="mt-2 text-[13px] text-muted-foreground">
                          <summary className="cursor-pointer">Reasoning</summary>
                          <ul className="list-disc ml-5 space-y-1">
                            {msg.reasoning.map((r, idx) => (
                              <li key={idx}>{r}</li>
                            ))}
                          </ul>
                        </details>
                      ) : null}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex w-full">
                    <div className="mr-auto px-4 py-3 rounded-2xl bg-white border border-[#eef0f5] text-sm text-muted-foreground shadow-sm flex gap-2 items-center">
                      <span className="w-2 h-2 bg-[#7A06FF] rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-[#7A06FF] rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-[#7A06FF] rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-4 bg-gradient-to-t from-background to-transparent">
              <div className="relative">
                <Input
                  placeholder="Ask a customer service question..."
                  value={userInput}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading}
                  className="w-full h-14 pr-14 pl-6 rounded-full border border-[#e7e9f3] bg-white shadow-sm text-base focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none focus:border-[#e7e9f3] focus-visible:border-[#e7e9f3]"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={isLoading || !userInput.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full text-[#7A06FF] hover:bg-[#f4edff] border border-transparent transition-colors disabled:opacity-50"
                  aria-label="Send message"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[45vh] w-full px-1">{null}</ScrollArea>

            <div className="relative sticky bottom-0 pb-3 pt-4 bg-gradient-to-t from-background to-transparent">
              <Input
                placeholder="Ask a customer service question..."
                value={userInput}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
                className="w-full h-14 pr-14 pl-6 rounded-full border border-[#e7e9f3] bg-white shadow-sm text-base focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none focus:border-[#e7e9f3] focus-visible:border-[#e7e9f3]"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={isLoading || !userInput.trim()}
                className="absolute right-3 top-1/2 -translate-y-[45%] p-3 rounded-full text-[#7A06FF] hover:bg-[#f4edff] border border-transparent transition-colors disabled:opacity-50"
                aria-label="Send message"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sampleResponses.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputValue(sample.query)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-[#e7e9f3] bg-white shadow-xs text-sm md:text-base font-medium text-foreground hover:border-[#7A06FF] hover:shadow-sm transition"
                >
                  {sample.query}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
