import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// basic health check
app.get("/", (req, res) => {
  res.send("Proxy server is running");
});

app.post("/api/generate", async (req, res) => {
  try {
    const { systemPrompt, query } = req.body;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
      {
        contents: [
          {
            parts: [{ text: systemPrompt }, { text: query }],
          },
        ],
      },
      {
        headers: {
          "x-goog-api-key": process.env.VITE_GEMINI_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    res.json(response.data);
  } catch (err) {
    console.error("Proxy error", err?.response?.data || err.message);
    if (err.response && err.response.status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded" });
    }
    res
      .status(err.response?.status || 500)
      .json({ error: "Internal proxy error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
