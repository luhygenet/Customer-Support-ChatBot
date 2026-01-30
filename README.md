# Customer Service Chatbot Agent with Reasoning

Customer Service Chatbot that answers customer queries using a structured knowledge base, hybrid NLU, and rule-based reasoning with explainable traces.

## Features
- Hybrid NLU flow: LLM intent + spaCy entity extraction
- Structured JSON knowledge base for products, orders, and policies
- Rule-based reasoning with transparent reasoning trace
- Web UI with chat experience and reasoning toggle
- FastAPI backend with simple HTTP endpoints

## Architecture
- **Frontend**: Next.js + React
- **Backend**: FastAPI (Python)
- **NLU**: LLM intent classification + spaCy entity extraction
- **Knowledge Base**: JSON file loaded via a small abstraction layer
- **Reasoning**: Deterministic rules per intent

## Project Structure
```
app/                 # Next.js app
backend/             # FastAPI backend
	knowledge_base.json
	knowledge_base.py
	nlu.py
	reasoning.py
```

## Requirements
- Node.js 18+
- Python 3.10+

## Setup

### 1) Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```
GEMINI_API_KEY=your_key_here
```

Run the backend:
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 2) Frontend
```bash
cd ..
npm install
npm run dev
```

The app will be available at http://localhost:3000

## Example Queries
- "What’s the status of order O135?"
- "Can I return order O138?"
- "What’s the warranty on Laptop Bag?"
- "What is your shipping policy?"

## Reasoning Output
Responses include a `reasoning` array that lists the intent, extracted entities, and applied rules.

## Notes
- Product/order/policy data lives in `backend/knowledge_base.json`.
- Add or update entries there to expand coverage.

## License
MIT
