import React from "react";
import { Card } from "@/app/components/ui/card";

export default function SystemArchitecture() {
  const components = [
    {
      name: "User Interface",
      description: "React-based web interface for customer interactions",
      features: [
        "Chat interface",
        "Real-time reasoning display",
        "Responsive design",
      ],
    },
    {
      name: "Natural Language Understanding",
      description: "Processes and interprets customer queries",
      features: [
        "Query parsing and tokenization",
        "Intent recognition",
        "Entity extraction",
      ],
    },
    {
      name: "Structured Knowledge Base",
      description: "Centralized repository of policies and domain data",
      features: [
        "Product catalog",
        "Order information",
        "Return policies",
        "Pricing rules",
      ],
    },
    {
      name: "Reasoning Engine",
      description: "Core inference mechanism for decision-making",
      features: ["Rule evaluation", "Constraint checking", "Logic inference"],
    },
    {
      name: "Response Generator",
      description: "Formulates natural language responses",
      features: [
        "Template-based generation",
        "Policy compliance",
        "Clarity optimization",
      ],
    },
    {
      name: "Explanation Module",
      description: "Provides transparent reasoning traces",
      features: [
        "Rule application logging",
        "Decision path tracking",
        "Reasoning visualization",
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-background/80 p-8 overflow-auto">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-primary mb-3">
            System Architecture
          </h2>
          <p className="text-lg text-muted-foreground">
            Component overview and design
          </p>
        </div>

        {/* Architecture Diagram Placeholder */}
        <Card className="mb-8 p-12 bg-secondary/5 border-border border-2 border-dashed flex items-center justify-center min-h-64 shadow-md">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-30">🏗️</div>
            <p className="text-muted-foreground text-lg">
              Architecture Diagram Placeholder
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Visual system flow diagram will be displayed here
            </p>
          </div>
        </Card>

        {/* Component Details */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-primary mb-6">
            Core Components
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component, idx) => (
              <Card
                key={idx}
                className="p-6 bg-card border-border shadow-md hover:shadow-lg hover:border-accent transition-all"
              >
                <h4 className="text-lg font-bold text-primary mb-2">
                  {component.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {component.description}
                </p>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-secondary uppercase">
                    Features
                  </p>
                  <ul className="space-y-2">
                    {component.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex gap-2 text-sm">
                        <span className="text-accent">✓</span>
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Data Flow */}
        <Card className="p-6 bg-secondary/10 border border-secondary/30 shadow-md">
          <h3 className="text-2xl font-bold text-primary mb-6">
            Request Processing Flow
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">
                  User Query Input
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Customer submits a natural language question through the chat
                  interface
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">
                  NLU Processing
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Natural Language Understanding module parses query, extracts
                  intent and entities
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">
                  Rule Evaluation
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Reasoning engine evaluates applicable rules against structured
                  knowledge base
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">
                  Response Generation
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  System generates natural language response with inline
                  reasoning explanations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                5
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">User Display</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Response with reasoning path delivered to user interface for
                  display
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
