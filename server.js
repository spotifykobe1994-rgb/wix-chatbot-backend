import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.json({ reply: "Messaggio vuoto" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Sei l’assistente ufficiale di Shi.Ku.Dama Terrarium. Rispondi in modo naturale, utile e intelligente."
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

    if (!data.choices || !data.choices[0]) {
      console.error("Risposta OpenAI invalida:", data);
      return res.json({ reply: "Errore: risposta AI non disponibile" });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error("Errore OpenAI:", error);
    res.status(500).json({ reply: "Errore server" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Chatbot attivo sulla porta " + PORT);
});
