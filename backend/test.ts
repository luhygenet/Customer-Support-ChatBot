import { parseQuery } from "./lib/nlu";
import { reasonQuery } from "./lib/reasoning";

const queries = [
  "Can I return order O123?",
  "What is the status of order O124?",
  "Does product P002 have a warranty?",
];

queries.forEach((q) => {
  const parsed = parseQuery(q);
  if (!parsed) {
    console.log("Query not parsed:", q);
    console.log("Answer: Could not understand the query");
    console.log("Reasoning: []");
    console.log("---");
    return;
  }
  console.log("parsed THINGS:", parsed);
  const response = reasonQuery(parsed);
  console.log("Query:", q);
  console.log("Answer:", response.answer);
  console.log("Reasoning:", response.reasoning.join(" | "));
  console.log("---");
});
