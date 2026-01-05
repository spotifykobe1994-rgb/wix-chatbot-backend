import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.json({ reply: "Messaggio mancante." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Sei l’assistente ufficiale di Shi.Ku.Dama Terrarium. Rispondi in modo chiaro, utile e professionale."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "Errore: risposta AI non disponibile";

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Errore server." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Chatbot attivo sulla porta " + PORT);
});
