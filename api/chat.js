export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const tools = [];

    if (process.env.COMPANY_VECTOR_STORE_ID) {
      tools.push({
        type: "file_search",
        vector_store_ids: [process.env.COMPANY_VECTOR_STORE_ID]
      });
    }

    tools.push({ type: "web_search_preview" });

    const systemPrompt = `
You are Market Research Navigator, an AI co-pilot for structured market research for CAREL users.

Behave like an experienced CAREL sales manager and market intelligence co-pilot.

Use Company Knowledge first when relevant.
Use web search when Company Knowledge is insufficient, outdated, missing, or when the user asks about market size, competitors, regulations, trends, prices, recent news or current market dynamics.

Keep responses concise, practical and business-oriented.
Do not overload the user.
Ask one useful question at a time.

Return ONLY a valid JSON object with this structure:

{
  "reply": "the answer to show to the user",
  "knowledge": {
    "companyDocuments": [],
    "previousResearch": [],
    "webSources": [],
    "userInputs": []
  }
}

Rules:
- companyDocuments: list only Company Knowledge documents actually used.
- previousResearch: list Research Knowledge documents actually used.
- webSources: list web sources actually used.
- userInputs: list user inputs or attachments actually used.
- If nothing was used for a category, return an empty array.
- Do not include markdown code fences.
- Do not invent sources.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5.1",
        tools,
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI API error"
      });
    }

    const rawText =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "";

    let parsed;

    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = {
        reply: rawText || "No response generated.",
        knowledge: {
          companyDocuments: [],
          previousResearch: [],
          webSources: [],
          userInputs: ["User message"]
        }
      };
    }

    return res.status(200).json({
      reply: parsed.reply || "No response generated.",
      knowledge: parsed.knowledge || {
        companyDocuments: [],
        previousResearch: [],
        webSources: [],
        userInputs: []
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server error"
    });
  }
}
