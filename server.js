import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/atas", async (req, res) => {
  const { userMessage } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
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
    res.json({ result: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Error connecting to OpenAI API" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ATAS backend running on port ${PORT}`));
