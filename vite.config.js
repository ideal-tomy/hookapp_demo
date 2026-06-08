import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { generateDemoResponse } from "./api/_lib/demoChat.js";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "demo-chat-api",
      configureServer(server) {
        server.middlewares.use("/api/chat", async (req, res, next) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: "Method not allowed" }));
            return;
          }

          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", () => {
            try {
              const { messages } = JSON.parse(body || "{}");
              const text = generateDemoResponse(messages);
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ text }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Invalid request" }));
            }
          });
          req.on("error", next);
        });
      },
    },
  ],
});
