import { generateDemoResponse } from "./_lib/demoChat.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body || {};
    const text = generateDemoResponse(messages);
    return res.status(200).json({ text });
  } catch {
    return res.status(400).json({ error: "Invalid request" });
  }
}
