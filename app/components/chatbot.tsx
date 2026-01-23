"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"

import React, { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
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

    // Add user message
    const userMessage: Message = {
      type: "user",
      text: userInput,
    };
    setMessages([...messages, userMessage]);

    // Simulate system response
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
    // setTimeout(() => {
    //   const randomResponse =
    //     sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
    //   const systemMessage: Message = {
    //     id: `msg-${Date.now() + 1}`,
    //     type: "system",
    //     response: randomResponse.response,
    //     reasoning: randomResponse.reasoning,
    //   };
    //   setMessages((prev) => [...prev, systemMessage]);
    //   setIsLoading(false);
    // }, 800);
  };
  const lastMessage = messages[messages.length - 1];
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-background/80 p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-primary mb-2">
          Customer Support Bot
        </h2>
        <p className="text-muted-foreground">
          Ask questions about orders, returns, policies, and more
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="flex-1 flex flex-col bg-card border-border shadow-md">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <p className="text-muted-foreground text-lg mb-4">
                        Start a conversation by asking a customer service
                        question
                      </p>
                      <div className="grid grid-cols-1 gap-2 max-w-xs">
                        {sampleResponses.map((sample, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setInputValue(sample.query);
                            }}
                            className="text-sm text-accent hover:text-accent/80 text-left p-3 rounded border border-border hover:border-accent transition-all"
                          >
                            "{sample.query}"
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} style={{ marginBottom: "0.75rem" }}>
                      <strong>{msg.type === "user" ? "You" : "Bot"}:</strong>{" "}
                      {msg.text}
                      {msg.type === "bot" && msg.reasoning?.length ? (
                        <details style={{ marginTop: "0.25rem" }}>
                          <summary>Reasoning</summary>
                          <ul>
                            {msg.reasoning.map((r, idx) => (
                              <li key={idx}>{r}</li>
                            ))}
                          </ul>
                        </details>
                      ) : null}
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary text-secondary-foreground p-4 rounded-lg border border-border">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-secondary-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-secondary-foreground rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-secondary-foreground rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-6 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask a customer service question..."
                  value={userInput}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading}
                  className="flex-1 bg-input text-foreground border-border"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !userInput.trim()}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Reasoning Panel */}
        <div className="flex flex-col">
          <Card className="flex-1 bg-card border-border shadow-md overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border bg-secondary/10">
              <h3 className="font-semibold text-primary">
                Reasoning / Explanation
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                System decision logic
              </p>
            </div>

            <ScrollArea className="flex-1 p-6">
              {messages.length === 0 ||
              lastMessage.type !== "bot" ||
              !lastMessage.reasoning ? (
                <div className="text-center text-muted-foreground text-sm">
                  <p>Send a message to see the reasoning process</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-primary mb-4">
                    Applied Rules & Logic:
                  </h4>
                  {lastMessage.reasoning?.map((rule, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 pb-3 border-b border-border last:border-0"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-foreground flex-1">{rule}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
