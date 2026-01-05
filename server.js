import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Dimmi pure 😊" });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content: "Sei l’assistente ufficiale di Shi.Ku.Dama Terrarium. Rispondi in modo chiaro, utile e naturale."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    let reply = "Non sono riuscito a rispondere 😕";

    if (data.output && data.output.length > 0) {
      const content = data.output[0].content || [];
      reply = content
        .filter(c => c.type === "output_text")
        .map(c => c.text)
        .join(" ");
    }

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Errore del server" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Chatbot attivo sulla porta " + PORT);
});
