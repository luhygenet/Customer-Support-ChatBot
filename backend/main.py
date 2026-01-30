from pydantic import BaseModel
from nlu import parse_query
from reasoning import reason_query
from fastapi import FastAPI, Query
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Rule-Based Logic API")

origins = [
    "http://localhost:3000",  # Next.js frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.post("/ask")
def ask(request: QueryRequest):
    parsed = parse_query(request.query)
    response = reason_query(parsed)
    return response

@app.get("/")
def root():
    return {"message": "Rule-Based Logic API Running"}

@app.get("/query")
def query_endpoint(text: str):
    parsed = parse_query(text)
    if not parsed:
        return {"answer": "Could not understand the query", "reasoning": []}
    response = reason_query(parsed)
    return response
