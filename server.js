import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.send("ATAS backend is running.");
});

// Main endpoint
app.post("/api/atas", async (req, res) => {
  console.log("📥 Request body received:", req.body);

  const { userMessage } = req.body;

  if (!userMessage || userMessage.trim() === "") {
    console.warn("⚠️ Empty or missing userMessage.");
    return res.status(400).json({ error: "userMessage is required." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are ATAS, an AI that helps testers write automation strategies and test cases based on user prompts."
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      console.error("❌ No choices in OpenAI response:", data);
      return res.status(500).json({ error: "Invalid response from OpenAI." });
    }

    res.json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error("❌ Error calling OpenAI:", error);
    res.status(500).json({ error: error.message || "Error connecting to OpenAI API." });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ ATAS backend running on port ${PORT}`));