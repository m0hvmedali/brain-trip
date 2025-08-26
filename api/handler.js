import { LlamaCloudIndex, ContextChatEngine } from "llamaindex";

export default async function handler(req, res) {
  try {
    // Parse the request body. For Vercel Edge Functions, req.body is already parsed.
    // For other environments, ensure it's parsed correctly.
    const body = req.body;

    if (!body || !body.query) {
      return res.status(400).json({ error: "Query parameter is missing in the request body." });
    }

    const index = new LlamaCloudIndex({
      name: "qualified-stingray-2025-08-26",
      projectName: "Default",
      organizationId: "80af136a-180a-4b31-a9bb-d35160b2dd64",
      apiKey: process.env.LLAMA_CLOUD_API_KEY, // استخدام متغير البيئة بدلاً من المفتاح المباشر
    });

    const retriever = index.asRetriever({ similarityTopK: 5 });
    const chatEngine = new ContextChatEngine({ retriever });

    const response = await chatEngine.chat(body.query);

    res.status(200).json({ result: response.response });
  } catch (err) {
    console.error("Error in API handler:", err);
    res.status(500).json({ error: err.message || "An unknown error occurred." });
  }
}

