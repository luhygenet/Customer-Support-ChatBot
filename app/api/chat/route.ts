// export const dynamic = "force-dynamic";
// import { NextRequest, NextResponse } from "next/server";

// // // Temporary POST handler
// // export const POST = async (req: NextRequest) => {
// //   return NextResponse.json({
// //     answer: "API temporarily disabled",
// //     reasoning: [],
// //   });
// // };

// // import { parseQuery } from "@/backend/lib/nlu";
// // import { reasonQuery } from "@/backend/lib/reasoning";

// export async function POST(req: NextRequest) {
//   try {
//     const { query } = await req.json();
//     console.log("Received query in the fetch :):", query);
//     if (!query || typeof query !== "string") {
//       return NextResponse.json(
//         { answer: "Invalid query.", reasoning: [] },
//         { status: 400 },
//       );
//     }

//     const parsed = parseQuery(query);

//     if (!parsed) {
//       return NextResponse.json({
//         answer: "Sorry, I couldn't understand your query in the api.",
//         reasoning: [],
//       });
//     }

//     const response = reasonQuery(parsed);

//     return NextResponse.json(response);
//   } catch (error) {
//     console.error("Chat API error:", error);
//     return NextResponse.json(
//       { answer: "Internal server error.", reasoning: [] },
//       { status: 500 },
//     );
//   }
// }
