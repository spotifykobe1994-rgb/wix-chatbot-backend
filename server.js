import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Sei l’assistente ufficiale di Shi.Ku.Dama Terrarium. Rispondi in modo chiaro e gentile.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

 res.json({ reply: data.output_text });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel server" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Chatbot attivo sulla porta " + PORT);
});
