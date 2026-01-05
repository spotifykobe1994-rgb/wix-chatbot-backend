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

    let reply = "Ciao! 👋 Come posso aiutarti?";

if (data.output && data.output.length > 0) {
  const content = data.output[0].content || [];
  reply = content
    .filter(item => item.type === "output_text")
    .map(item => item.text)
    .join(" ");
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
