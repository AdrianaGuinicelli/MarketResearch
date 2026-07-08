export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
console.log("Environment keys:", Object.keys(process.env).filter(k => k.includes("OPENAI")));
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5.1",
        input: [
          {
            role: "system",
            content: `
You are Market Research Navigator, an AI co-pilot for structured market research for CAREL users.

Behave like an experienced CAREL sales manager and market intelligence co-pilot.

Keep responses concise, practical and business-oriented.
Do not overload the user.
Ask one useful question at a time.
Help the user structure market research through one continuous conversation.

Always end substantial answers with:

Knowledge Used:
- Company documents:
- Previous research:
- Web sources:
- User inputs:
`
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI API error"
      });
    }

    const text =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "No response generated.";

    return res.status(200).json({
      reply: text
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server error"
    });
  }
}
