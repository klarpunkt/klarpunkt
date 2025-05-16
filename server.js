const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

// CORS Middleware: Erlaubt alle Anfragen vom Netlify-Frontend
app.use(cors({
  origin: "https://klarpunktgptlivetest.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/gpt", async (req, res) => {
  const userText = req.body.text;
  if (!userText) return res.status(400).json({ error: "Kein Text gesendet." });

  const prompt = `Gib mir bitte Feedback zu folgendem Text. Beurteile in je 1–2 Sätzen:\n- Struktur\n- Sprache\n- Inhalt\n\nDer Text:\n${userText}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ feedback: reply });
  } catch (err) {
    console.error("Fehler bei GPT:", err);
    res.status(500).json({ error: "Fehler beim Abrufen von OpenAI." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
