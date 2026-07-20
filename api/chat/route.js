import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { messages } = await request.json();

    // Map format l-messages l Gemini (user w model)
    const geminiContents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const apiKey = process.env.GEMINI_API_KEY;

    // Daba l-URL ma fihsh l-key, m9ad n9i
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey, // Hna fin dazt l-key jdid securely f l-headers!
        },
        body: JSON.stringify({
          contents: geminiContents,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: "Gemini API failed", details: errorData }, { status: response.status });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ reply: replyText });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
