//api/handler.js
import { LlamaCloudIndex, ContextChatEngine } from "llamaindex";

export default async function handler(req, res) {
  try {
    const body = req.body || (await new Promise((resolve) => {
      let data = "";
      req.on("data", (chunk) => { data += chunk });
      req.on("end", () => resolve(JSON.parse(data || "{}")));
    }));

    const index = new LlamaCloudIndex({
      name: "qualified-stingray-2025-08-26",
      projectName: "Default",
      organizationId: "80af136a-180a-4b31-a9bb-d35160b2dd64",
      apiKey: "llx-PdTufgkIr4R0dmyrQDdU7eENZvjOJlQLE7qCQckYyyO5Cb28", // مفتاحك من Vercel env
    });

    const retriever = index.asRetriever({ similarityTopK: 5 });
    const chatEngine = new ContextChatEngine({ retriever });

    const response = await chatEngine.chat(body.query);

    res.status(200).json({ result: response.response });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
