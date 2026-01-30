import React from "react";
import { Card } from "@/app/components/ui/card";

export default function About() {
  const sections = [
    {
      title: "Project Overview",
      content:
        "This Customer Service Chatbot Agent provides fast, policy-aware support for common customer questions. It combines intent detection, entity extraction, and rule-based reasoning over a structured knowledge base to deliver accurate, explainable answers.",
    },
    {
      title: "Objectives",
      items: [
        "Provide accurate answers using company policies and order data",
        "Resolve common customer requests with clear, traceable reasoning",
        "Extract key entities (order IDs, product names) from user queries",
        "Keep the system modular for future policy and data updates",
      ],
    },
    {
      title: "Key Features",
      items: [
        "Hybrid NLU flow: LLM intent + spaCy entity extraction",
        "Rule-based reasoning with transparent logic paths",
        "Structured JSON knowledge base for products, orders, and policies",
        "Reasoning trace available for each response",
        "Extensible policy and data model",
      ],
    },
    {
      title: "How It Works",
      content:
        "The system first detects the user’s intent with an LLM, then extracts entities like order IDs and product names using spaCy. It retrieves relevant facts from the JSON knowledge base and applies business rules to generate the final response with an explainable reasoning trail.",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-background/80 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-primary mb-3">
            About This Project
          </h2>
          <p className="text-lg text-muted-foreground">
            Customer Service Chatbot Agent
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section, idx) => (
            <Card
              key={idx}
              className="p-6 bg-card border-border shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-bold text-primary mb-4">
                {section.title}
              </h3>

              {section.content ? (
                <p className="text-foreground leading-relaxed">
                  {section.content}
                </p>
              ) : (
                <ul className="space-y-3">
                  {section.items?.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex gap-3">
                      <span className="text-accent font-bold flex-shrink-0 mt-1">
                        •
                      </span>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}

          <Card className="p-6 bg-secondary/10 border border-secondary/30 shadow-md">
            <h3 className="text-xl font-bold text-primary mb-4">
              Technical Stack
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-foreground mb-2">Frontend</p>
                <p className="text-muted-foreground text-sm">
                  React, Next.js, TypeScript
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-2">Backend</p>
                <p className="text-muted-foreground text-sm">FastAPI (Python)</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-2">Data</p>
                <p className="text-muted-foreground text-sm">
                  JSON knowledge base (products, orders, policies)
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-2">NLU</p>
                <p className="text-muted-foreground text-sm">
                  LLM intent + spaCy entity extraction
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
