import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body?.message;

    if (!message) {
      return NextResponse.json({ error: "No message sent" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "Ти си строителен AI асистент за България. Отговаряш кратко и точно.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // 🔥 IMPORTANT: show full response if something is wrong
    if (!response.ok) {
      return NextResponse.json({
        error: "Groq API error",
        details: data,
      });
    }

    return NextResponse.json({
      answer: data?.choices?.[0]?.message?.content,
      debug: data,
    });
  } catch (err) {
    return NextResponse.json({
      error: "Server error",
      details: String(err),
    });
  }
}
