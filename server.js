import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
  model: "gpt-4.1-mini",
  input: [
    {
      role: "system",
      content: [
        {
          type: "text",
          text: "Sei l’assistente ufficiale di Shi.Ku.Dama Terrarium. Rispondi in modo intelligente, naturale e cordiale. Se l’utente saluta, saluta. Se fa domande sui terrarium, rispondi in modo competente."
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: userMessage
        }
      ]
    }
  ]
})
    });

   const data = await response.json();

let reply = "Scusa, non ho capito la domanda.";

try {
  const output = data.output?.[0]?.content;

  if (Array.isArray(output)) {
    const text = output
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join(" ");

    if (text.trim()) {
      reply = text;
    }
  }
} catch (e) {
  console.error("Errore parsing risposta OpenAI", e);
}

res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel server" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Chatbot attivo sulla porta " + PORT);
});
