import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { messages } = await request.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Anthropic API failed" }, { status: response.status });
    }

    const data = await response.json();
    const replyText = data.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return NextResponse.json({ reply: replyText });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

