import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: lastMessage }] }],
        }),
      }
    );

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: "خطأ فالسيرفر" }, { status: 500 });
  }
}

