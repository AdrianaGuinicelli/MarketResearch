export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.openai.com/v1/vector_stores", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Market Research Navigator - Company Knowledge"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Vector store creation failed"
      });
    }

    return res.status(200).json({
      message: "Company Vector Store created successfully",
      vectorStoreId: data.id,
      name: data.name
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Server error"
    });
  }
}
