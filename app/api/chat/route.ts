export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

// Use environment variable or default to local FastAPI server
const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

// Proxy GET /api/chat?text=... to FastAPI GET /query?text=...
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const text = searchParams.get("text");
		if (!text) {
			return NextResponse.json(
				{ answer: "Missing 'text' query parameter.", reasoning: [] },
				{ status: 400 },
			);
		}
		const res = await fetch(`${BACKEND_URL}/query?text=${encodeURIComponent(text)}`);
		const data = await res.json();
		return NextResponse.json(data, { status: res.status });
	} catch (error) {
		console.error("Proxy GET /api/chat error:", error);
		return NextResponse.json(
			{ answer: "Upstream error.", reasoning: [] },
			{ status: 502 },
		);
	}
}

// Proxy POST /api/chat { query } to FastAPI POST /ask
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const query = body?.query;
		if (!query || typeof query !== "string") {
			return NextResponse.json(
				{ answer: "Invalid 'query' payload.", reasoning: [] },
				{ status: 400 },
			);
		}
		const res = await fetch(`${BACKEND_URL}/ask`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query }),
		});
		const data = await res.json();
		return NextResponse.json(data, { status: res.status });
	} catch (error) {
		console.error("Proxy POST /api/chat error:", error);
		return NextResponse.json(
			{ answer: "Upstream error.", reasoning: [] },
			{ status: 502 },
		);
	}
}
