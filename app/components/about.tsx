import React from "react";
import { Card } from "@/app/components/ui/card";

export default function About() {
  const sections = [
    {
      title: "Project Overview",
      content:
        "This Customer Service Chatbot Agent is an advanced Machine Intelligence system designed to demonstrate rule-based reasoning and knowledge representation. The system processes customer inquiries, applies domain-specific policies, and provides transparent explanations of its decision-making process.",
    },
    {
      title: "Objectives",
      items: [
        "Demonstrate practical application of knowledge-based reasoning systems",
        "Showcase rule-engine implementation in customer service domain",
        "Provide transparent AI decision-making with explainable reasoning",
        "Implement structured knowledge representation for business policies",
      ],
    },
    {
      title: "Key Features",
      items: [
        "Natural Language Understanding for customer queries",
        "Rule-based reasoning engine with transparent logic paths",
        "Structured knowledge base of policies and procedures",
        "Real-time reasoning visualization and explanation",
        "Scalable architecture for policy management",
      ],
    },
    {
      title: "Academic Context",
      content:
        "This project applies fundamental concepts from Machine Intelligence and Knowledge-Based Systems. It demonstrates the practical implementation of knowledge representation, inference mechanisms, and rule-based reasoning engines. The system serves as an educational tool for understanding how AI systems can combine symbolic reasoning with structured data to solve domain-specific problems.",
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
            Customer Service Chatbot Agent with Reasoning
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
                <p className="font-semibold text-foreground mb-2">
                  Core System
                </p>
                <p className="text-muted-foreground text-sm">
                  Rule-based reasoning engine
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-2">Data</p>
                <p className="text-muted-foreground text-sm">
                  Structured knowledge base
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-2">NLU</p>
                <p className="text-muted-foreground text-sm">
                  Natural Language Understanding
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
