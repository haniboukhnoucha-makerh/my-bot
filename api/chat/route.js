import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    // تحويل الرسائل لتناسب Gemini API
    const geminiContents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({ contents: geminiContents }),
      }
    );

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "خطأ: لم يتم الرد من Gemini";

    return NextResponse.json({ reply: replyText });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
